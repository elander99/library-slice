// Input handler: WASD/arrows + click-to-move + E-to-interact.

class Input2D {
  constructor(canvas, sim, renderer) {
    this.canvas   = canvas;
    this.sim      = sim;
    this.renderer = renderer;
    this._keys    = {};
    this._speed   = 90;   // px/sec
    this._last_t  = 0;
    this._interact_cooldown = 0;

    window.addEventListener('keydown', e => this._on_keydown(e));
    window.addEventListener('keyup',   e => { this._keys[e.key] = false; });
    window.addEventListener('blur',    () => { this._keys = {}; });
    window.addEventListener('focusin', e => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) this._keys = {};
    });
    canvas.addEventListener('mousemove', e => {
      const p = this._pos(e);
      renderer._hover_x = p.x;
      renderer._hover_y = p.y;
      this._update_cursor(p.x, p.y);
    });
    canvas.addEventListener('click', e => this._on_click(e));

    // Drag canvas HUD elements (room name → obj-label for meaning slots)
    this._drag_down = null;
    canvas.addEventListener('mousedown', e => {
      const p = this._pos(e);
      this._drag_down = p;
    });
    canvas.draggable = true;
    canvas.addEventListener('dragstart', e => {
      const p = this._drag_down;
      const R = renderer;
      if (p && R._hud_room_btn && R._pt_in(R._hud_room_btn, p.x, p.y)) {
        e.dataTransfer.setData('obj-label', R._hud_room_btn.en);
        if (LANG.current === 'ko') {
          e.dataTransfer.setData('dlg-word', R._hud_room_btn.text);
        }
        e.dataTransfer.effectAllowed = 'copy';
      } else {
        e.preventDefault();
      }
      this._drag_down = null;
    });
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      this._on_click_pos(
        (t.clientX-rect.left)*(renderer.W/rect.width),
        (t.clientY-rect.top) *(renderer.H/rect.height),
        t.clientX, t.clientY
      );
    }, {passive:false});
  }

  _pos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX-rect.left)*(this.renderer.W/rect.width),
      y: (e.clientY-rect.top) *(this.renderer.H/rect.height),
    };
  }

  // Convert canvas-space coords to CSS client coords for HTML overlay positioning.
  _c2s(cx, cy) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: cx * (rect.width  / this.renderer.W) + rect.left,
      y: cy * (rect.height / this.renderer.H) + rect.top,
    };
  }

  _input_focused() {
    const t = document.activeElement;
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
  }

  _on_keydown(e) {
    if (this._input_focused()) return;
    this._keys[e.key] = true;

    // Interact key
    if (e.key==='e'||e.key==='E'||e.key===' ') {
      if (this._interact_cooldown<=0) {
        this._try_interact();
        this._interact_cooldown = 20;
      }
    }
    // Toggle calendar
    if ((e.key==='c'||e.key==='C') && !e.ctrlKey && !e.metaKey) {
      this.renderer.show_calendar = !this.renderer.show_calendar;
    }
    // Close calendar / action menu on Escape
    if (e.key==='Escape') {
      this.renderer.show_calendar = false;
      this.renderer.action_menu = null;
    }
  }

  // Called each frame from the game loop with delta-time
  update(dt, now) {
    if (this._interact_cooldown > 0) this._interact_cooldown--;
    const s   = this.sim.state;
    if (!s.session_active || s.transition) return;

    // Dismiss action menu on any movement key
    const moving = this._keys['ArrowLeft']||this._keys['ArrowRight']||this._keys['ArrowUp']||this._keys['ArrowDown']||
                   this._keys['a']||this._keys['d']||this._keys['w']||this._keys['s']||
                   this._keys['A']||this._keys['D']||this._keys['W']||this._keys['S'];
    if (moving) { this.renderer.action_menu = null; this.sim.clear_walk_target(); }

    const spd = this._speed * dt;
    let dx=0, dy=0;
    if (this._keys['ArrowLeft'] ||this._keys['a']||this._keys['A']) dx=-spd;
    if (this._keys['ArrowRight']||this._keys['d']||this._keys['D']) dx= spd;
    if (this._keys['ArrowUp']   ||this._keys['w']||this._keys['W']) dy=-spd;
    if (this._keys['ArrowDown'] ||this._keys['s']||this._keys['S']) dy= spd;

    // Normalize diagonals
    if (dx!==0 && dy!==0) { dx*=0.707; dy*=0.707; }

    if (dx!==0||dy!==0) {
      s.moving = true;
      this.sim.move(dx, dy);
    } else {
      s.moving = false;
      // Tick click-to-move walk
      this.sim.tick_walk(dt);
    }
  }

  _on_click(e) {
    const p = this._pos(e);
    this._on_click_pos(p.x, p.y, e.clientX, e.clientY);
  }

  _on_click_pos(x, y, sx, sy) {
    const R = this.renderer;
    const S = this.sim;

    if (S.state.session_ended) {
      if (R._end_msg_btn && R._pt_in(R._end_msg_btn,x,y)) {
        const {text,en} = R._end_msg_btn;
        const words = text.split(/\s+/);
        WorkspacePanel.open_npc_sentence(text, words, 0, '', null, en);
        return;
      }
      if (R._end_btn && R._pt_in(R._end_btn,x,y)) { S.restart(); R.log_entries=[]; R.notifications=[]; R.action_menu=null; }
      return;
    }

    // Calendar: text elements open workspace panel; anything else closes
    if (R.show_calendar) {
      const _calOpen = btn => { const words=btn.text.split(/\s+/); const tdefs=words.map((_,i)=>({meaning:i===0?btn.en:''})); WorkspacePanel.open_npc_sentence(btn.text, words, 0, '', tdefs, btn.en); R.show_calendar = false; };
      if (R._cal_month_btn && R._pt_in(R._cal_month_btn, x, y)) { _calOpen(R._cal_month_btn); return; }
      for (const btn of (R._cal_dow_btns||[])) { if (btn && R._pt_in(btn, x, y)) { _calOpen(btn); return; } }
      for (const btn of (R._cal_day_btns||[])) { if (btn && R._pt_in(btn, x, y)) { _calOpen(btn); return; } }
      R.show_calendar = false;
      return;
    }

    // Time widget: date/dow line opens workspace panel; rest of widget opens calendar
    if (R._time_dow_btn && R._pt_in(R._time_dow_btn, x, y)) {
      const {text, en} = R._time_dow_btn;
      WorkspacePanel.open_npc_sentence(text, [text], 0, '', null, en);
      return;
    }
    if (R._clock_rect && R._pt_in(R._clock_rect, x, y)) { R.show_calendar = true; return; }

    // Action menu click
    if (R.action_menu) {
      const items = R.action_menu._item_rects||[];
      for (let i=0;i<items.length;i++) {
        if (items[i] && R._pt_in(items[i],x,y)) {
          S.perform(R.action_menu.items[i].action);
          R.action_menu=null;
          return;
        }
      }
      R.action_menu=null;
      return;
    }

    // 充実感 / 충실감 label
    if (R._juujitsukan_btn && R._pt_in(R._juujitsukan_btn, x, y)) {
      const {text, en} = R._juujitsukan_btn;
      WorkspacePanel.open_npc_sentence(text, [text], 0, '', null, en);
      return;
    }

    // HUD room name (clickable to look up)
    if (R._hud_room_btn && R._pt_in(R._hud_room_btn, x, y)) {
      const {text, en} = R._hud_room_btn;
      const words = text.split(/\s+/).filter(Boolean);
      WorkspacePanel.open_npc_sentence(text, words, 0, '', null, en);
      return;
    }

    // Floating Korean notification (goal/info type only)
    if (R._notif_btn && R._pt_in(R._notif_btn, x, y)) {
      const {text} = R._notif_btn;
      WorkspacePanel.open_npc_sentence(text, text.split(/\s+/), 0, '', null, '');
      return;
    }

    // Click in viewport → check for entity clicks then click-to-move
    if (y < R.VP_Y || y > R.VP_Y+R.VP_H) return;

    const cam  = R._camera(S.state);
    const room = ROOM_MAP_DATA[S.state.room];
    if (!room) return;

    // Convert click to world coords
    const wx = x + cam.cx;
    const wy = (y - R.VP_Y) + cam.cy;

    // Speech bubble dismiss (X button)
    if (R._bubble_close_btn && R._pt_in(R._bubble_close_btn, x, y)) {
      if (S.state.librarian.alert) S.state.librarian.alert = null;
      if (S.state.room_alert)      S.state.room_alert = null;
      return;
    }

    // Check NPC chat bubble clicks
    if (R._npc_chat_btns) {
      for (const [npc_id, btn] of Object.entries(R._npc_chat_btns)) {
        if (R._pt_in(btn, x, y)) {
          if (sx != null && typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(npc_id, sx, sy);
          const a = this._c2s(btn.x + btn.w / 2, btn.y);
          const npc_def = [...(room.npcs || []), ...(S.state.extra_npcs || [])].find(n => n.npc_id === npc_id);
          if (npc_def?.convo) DialoguePanel.openConvo(npc_def.convo, a.x, a.y);
          else DialoguePanel.open(npc_id, a.x, a.y);
          return;
        }
      }
    }

    // Check sign clicks using the world-space rects computed by the renderer
    const sign_rects = R._sign_world_rects || {};
    for (const sg of (room.signs||[])) {
      const r = sign_rects[sg.sign_id];
      if (r && wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) {
        WorkspacePanel.open(sg.sign_id);
        return;
      }
    }

    // Check ambient NPC clicks (visitors etc.)
    const ambient_rects = R._ambient_npc_rects || {};
    for (const [npc_id, rect] of Object.entries(ambient_rects)) {
      const nx = rect.col*TS, ny = (rect.row-1)*TS;
      if (wx >= nx && wx <= nx+TS && wy >= ny && wy <= ny+TS*2) {
        const extra_block = (S.state.extra_npcs || []).find(n => n.npc_id === npc_id);
        if (sx != null && typeof ObjectDescPopup !== 'undefined') {
          if (extra_block && !extra_block.convo)
            ObjectDescPopup.show('사람', 'person', sx, sy, 'Resting.');
          else if (typeof NPC_DEFS !== 'undefined' && NPC_DEFS[npc_id])
            ObjectDescPopup.show_for(npc_id, sx, sy);
        }
        const player_near = Math.abs(S.state.px - rect.wx) < TS*2.5 &&
                            Math.abs(S.state.py - rect.wy) < TS*2.5;
        if (player_near) {
          if (extra_block && !extra_block.convo) {
            return;
          }
          if (typeof JOURNAL_PROGRESS !== 'undefined') JOURNAL_PROGRESS.mark_seen(npc_id, S.state.room);
          _advance_convo(S, room, npc_id);
          const npc_def = (room.npcs || []).find(n => n.npc_id === npc_id);
          if (typeof DialoguePanel !== 'undefined') {
            const a = this._c2s(rect.sx + rect.sw / 2, rect.sy);
            const open_convo = npc_def?.convo || extra_block?.convo;
            if (open_convo) DialoguePanel.openConvo(open_convo, a.x, a.y);
            else if (typeof NPC_DEFS !== 'undefined' && NPC_DEFS[npc_id]) DialoguePanel.open(npc_id, a.x, a.y);
          }
        } else {
          S.set_walk_target(rect.wx, rect.wy);
        }
        return;
      }
    }

    // Check door clicks — walk to door or enter if already adjacent
    const clicked_tc = Math.floor(wx / TS), clicked_tr = Math.floor(wy / TS);
    for (const obj of (room.objects||[])) {
      if (!obj.door_to) continue;
      if (obj_tile_hit(obj, clicked_tc, clicked_tr)) {
        const ox = obj.col*TS + TS/2, oy = obj.row*TS + TS;
        const player_near = Math.abs(S.state.px - ox) < TS*2.5 && Math.abs(S.state.py - oy) < TS*2.5;
        if (player_near) {
          if (obj.residents && typeof JOURNAL_PROGRESS !== 'undefined' &&
              !obj.residents.some(id => JOURNAL_PROGRESS.get(id).seen)) {
            const ko = typeof LANG !== 'undefined' && LANG.current === 'ko';
            const msg = ko ? '아직 이 집 주민을 모르세요.' : "You don't know anyone who lives here yet.";
            this.renderer.notifications.push({ text: msg, type: 'violation', ttl: 180 });
            return;
          }
          S._begin_transition({ room: obj.door_to, dir: 'up', enter_row: obj.enter_row ?? 24 });
        } else {
          S.set_walk_target(ox, oy);
        }
        return;
      }
    }

    // Check object clicks — hit area is obj.tile_rect if declared, else single anchor tile
    let best_obj = null, best_dist = Infinity;
    for (const obj of (room.objects||[])) {
      if (obj_tile_hit(obj, clicked_tc, clicked_tr)) {
        const dist = Math.abs(wx - (obj.col*TS + TS/2)) + Math.abs(wy - (obj.row*TS + TS/2));
        if (dist < best_dist) { best_dist = dist; best_obj = obj; }
      }
    }
    if (best_obj) {
      const obj = best_obj;
      const ox = obj.col*TS, oy = obj.row*TS;
      if (sx != null && typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(obj.id, sx, sy);
      const player_near = Math.abs(S.state.px - (ox+TS/2)) < TS*2.5 &&
                          Math.abs(S.state.py - (oy+TS)) < TS*2.5;
      if (player_near) {
        this._open_obj_menu(obj.id, x, y);
      } else {
        S.set_walk_target(ox+TS/2, oy+TS);
      }
      return;
    }

    // Check tile descriptions — empty '' means room's default floor
    if (typeof TILE_DEFS !== 'undefined' && typeof TILES !== 'undefined') {
      const tc = Math.floor(wx / TS), tr = Math.floor(wy / TS);
      const tile_code = room.tiles[tr]?.[tc];
      const resolved  = tile_code || room.floor;
      if (resolved && TILE_DEFS[resolved]) {
        if (sx != null && typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(resolved, sx, sy);
        if (TILES[resolved]?.solid) return; // solid tile — don't try to walk into it
      }
    }

    // Click-to-move: walk to world position
    S.set_walk_target(wx, wy);
  }

  _try_interact() {
    const S = this.sim;
    const R = this.renderer;
    const s = S.state;
    const room = ROOM_MAP_DATA[s.room];
    if (!room) return;

    const _popup_cx = this.renderer.W / 2, _popup_cy = this.renderer.VP_Y + 80;

    // Door interaction
    for (const obj of (room.objects||[])) {
      if (!obj.door_to) continue;
      const ox = obj.col*TS + TS/2, oy = obj.row*TS + TS;
      if (Math.abs(s.px-ox) < TS*2 && Math.abs(s.py-oy) < TS*2) {
        if (obj.residents && typeof JOURNAL_PROGRESS !== 'undefined' &&
            !obj.residents.some(id => JOURNAL_PROGRESS.get(id).seen)) {
          const ko = typeof LANG !== 'undefined' && LANG.current === 'ko';
          const msg = ko ? '아직 이 집 주민을 모르세요.' : "You don't know anyone who lives here yet.";
          this.renderer.notifications.push({ text: msg, type: 'violation', ttl: 180 });
          return;
        }
        S._begin_transition({ room: obj.door_to, dir: 'up', enter_row: obj.enter_row ?? 24 });
        return;
      }
    }

    // NPC interaction
    for (const npc_def of (room.npcs||[])) {
      const nx=npc_def.col*TS+TS/2, ny=npc_def.row*TS+TS;
      if (Math.abs(s.px-nx)<TS*1.5 && Math.abs(s.py-ny)<TS*2) {
        if (npc_def.ambient) {
          if (typeof JOURNAL_PROGRESS !== 'undefined') JOURNAL_PROGRESS.mark_seen(npc_def.npc_id, s.room);
          _advance_convo(S, room, npc_def.npc_id);
          if (typeof DialoguePanel !== 'undefined') {
            const arect = R._ambient_npc_rects?.[npc_def.npc_id];
            const a = arect ? this._c2s(arect.sx + arect.sw / 2, arect.sy) : { x: null, y: null };
            if (npc_def.convo) DialoguePanel.openConvo(npc_def.convo, a.x, a.y);
            else if (typeof NPC_DEFS !== 'undefined' && NPC_DEFS[npc_def.npc_id]) DialoguePanel.open(npc_def.npc_id, a.x, a.y);
          }
        } else {
          if (typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(npc_def.npc_id, _popup_cx, _popup_cy);
          const btn = R._npc_chat_btns?.[npc_def.npc_id];
          const a = btn ? this._c2s(btn.x + btn.w / 2, btn.y) : { x: null, y: null };
          DialoguePanel.open(npc_def.npc_id, a.x, a.y);
        }
        return;
      }
    }

    // Sign interaction
    for (const sg of (room.signs||[])) {
      const sx=sg.col*TS+TS/2, sy=sg.row*TS+TS;
      if (Math.abs(s.px-sx)<TS*2 && Math.abs(s.py-sy)<TS*2) {
        WorkspacePanel.open(sg.sign_id);
        return;
      }
    }

    // Object interaction
    for (const obj of (room.objects||[])) {
      const ox=obj.col*TS+TS/2, oy=obj.row*TS+TS;
      if (Math.abs(s.px-ox)<TS*2 && Math.abs(s.py-oy)<TS*2) {
        if (typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(obj.id, _popup_cx, _popup_cy);
        this._open_obj_menu(obj.id,
          this.renderer.W/2,
          this.renderer.VP_Y + this.renderer.VP_H/2
        );
        return;
      }
    }
  }

  _open_obj_menu(obj_id, sx, sy) {
    const actions = this.sim.get_actions(obj_id);
    if (!actions.length) return;
    this.renderer.action_menu = { object_id:obj_id, items:actions, x:sx, y:sy, _item_rects:[] };
  }

  _update_cursor(x, y) {
    const R = this.renderer;
    const S = this.sim;
    let cursor = 'default';

    // End-screen: sentence and restart button
    if (S.state.session_ended) {
      if (R._end_msg_btn && R._pt_in(R._end_msg_btn, x, y)) cursor = 'pointer';
      if (R._end_btn && R._pt_in(R._end_btn, x, y)) cursor = 'pointer';
      this.canvas.style.cursor = cursor;
      return;
    }

    // Action menu items
    if (R.action_menu) {
      const items = R.action_menu._item_rects || [];
      for (const r of items) {
        if (r && R._pt_in(r, x, y)) { cursor = 'pointer'; break; }
      }
      this.canvas.style.cursor = cursor;
      return;
    }

    // Calendar text elements (when calendar open)
    if (R.show_calendar) {
      if (R._cal_month_btn && R._pt_in(R._cal_month_btn, x, y)) { this.canvas.style.cursor = 'pointer'; return; }
      for (const btn of (R._cal_dow_btns||[])) { if (btn && R._pt_in(btn, x, y)) { this.canvas.style.cursor = 'pointer'; return; } }
      for (const btn of (R._cal_day_btns||[])) { if (btn && R._pt_in(btn, x, y)) { this.canvas.style.cursor = 'pointer'; return; } }
      this.canvas.style.cursor = cursor;
      return;
    }

    // HUD room name
    if (R._hud_room_btn && R._pt_in(R._hud_room_btn, x, y)) {
      this.canvas.style.cursor = 'pointer';
      return;
    }

    // 充実感 / 충실감 label
    if (R._juujitsukan_btn && R._pt_in(R._juujitsukan_btn, x, y)) {
      this.canvas.style.cursor = 'pointer';
      return;
    }

    // Floating Korean notification
    if (R._notif_btn && R._pt_in(R._notif_btn, x, y)) {
      this.canvas.style.cursor = 'pointer';
      return;
    }

    // Time widget dow line (opens word lookup); rest opens calendar
    if (R._time_dow_btn && R._pt_in(R._time_dow_btn, x, y)) {
      this.canvas.style.cursor = 'pointer';
      return;
    }
    // Clock/HUD area (opens calendar)
    if (R._clock_rect && R._pt_in(R._clock_rect, x, y)) {
      this.canvas.style.cursor = 'pointer';
      return;
    }

    // Speech bubble close button
    if (R._bubble_close_btn && (S.state.librarian.alert || S.state.room_alert) && R._pt_in(R._bubble_close_btn, x, y)) {
      this.canvas.style.cursor = 'pointer';
      return;
    }

    // NPC chat bubble indicators
    if (R._npc_chat_btns) {
      for (const btn of Object.values(R._npc_chat_btns)) {
        if (R._pt_in(btn, x, y)) { this.canvas.style.cursor = 'pointer'; return; }
      }
    }

    // Only check world-space interactables if click is in viewport
    R._hover_highlight = null;
    if (y >= R.VP_Y && y <= R.VP_Y + R.VP_H) {
      const cam = R._camera(S.state);
      const wx = x + cam.cx;
      const wy = (y - R.VP_Y) + cam.cy;
      const room = ROOM_MAP_DATA[S.state.room];

      if (room) {
        // Signs
        if (cursor === 'default') {
          const sign_rects = R._sign_world_rects || {};
          for (const sg of (room.signs || [])) {
            const r = sign_rects[sg.sign_id];
            if (r && wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) {
              cursor = 'pointer';
              R._hover_highlight = { wx: r.x, wy: r.y, ww: r.w, wh: r.h };
              break;
            }
          }
        }

        // Ambient NPCs (visitors etc.)
        if (cursor === 'default' && R._ambient_npc_rects) {
          for (const rect of Object.values(R._ambient_npc_rects)) {
            const nx = rect.col * TS, ny = (rect.row - 1) * TS;
            if (wx >= nx && wx <= nx + TS && wy >= ny && wy <= ny + TS * 2) {
              cursor = 'pointer';
              R._hover_highlight = { wx: nx, wy: ny, ww: TS, wh: TS * 2 };
              break;
            }
          }
        }

        // Objects and tiles — use hover_highlight_rect for both
        if (cursor === 'default') {
          const hr = hover_highlight_rect(wx, wy, room);
          if (hr) { cursor = 'pointer'; R._hover_highlight = hr; }
        }
      }
    }

    this.canvas.style.cursor = cursor;
  }
}

// Advance (or start) the ambient conversation for npc_id and store result in sim state.
function _advance_convo(S, room, npc_id) {
  const npc_def = (room.npcs || []).find(n => n.npc_id === npc_id);

  // If the NPC has a per-goal saying, store it in ambient history only — do NOT
  // set convo_bubble, which would float a speech bubble above the NPC's head.
  const npc_st = S.state.npc_states?.[npc_id];
  if (npc_def?.goals?.length && npc_st != null) {
    const goal = npc_def.goals[npc_st.goal_idx];
    if (goal?.say_ko) {
      if (typeof DialoguePanel !== 'undefined') DialoguePanel.addAmbient(npc_id, goal.say_ko, goal.say_en);
      return;
    }
  }

  const convo_id = npc_def?.convo;
  if (!convo_id || typeof CONVERSATIONS === 'undefined' || !CONVERSATIONS[convo_id]) return;
  const convo = CONVERSATIONS[convo_id];
  const cur = S.state.convo_bubble;
  const next = (cur?.convo_id === convo_id) ? (cur.turn_idx + 1) % convo.turns.length : 0;
  const turn = convo.turns[next];
  S.state.convo_bubble = { convo_id, turn_idx: next, npc_id: turn.npc_id, text_ko: turn.ko, text_en: turn.en };
  if (typeof DialoguePanel !== 'undefined') DialoguePanel.addAmbient(turn.npc_id, turn.ko, turn.en);
}

// Returns true if tile coordinate (tc, tr) falls within the object's interactive area.
// If obj declares tile_rect:[c1,r1,c2,r2], the entire rectangle is interactive.
// Otherwise only the single anchor tile (obj.col, obj.row) matches.
function obj_tile_hit(obj, tc, tr) {
  if (obj.tile_rect) {
    const [c1, r1, c2, r2] = obj.tile_rect;
    return tc >= c1 && tc <= c2 && tr >= r1 && tr <= r2;
  }
  return tc === obj.col && tr === obj.row;
}

// BFS bounding box for a connected block of same-code solid tiles at (tc, tr).
// Returns null for floor tiles, walls, empty/unknown codes.
function tile_cluster_rect(room, tc, tr) {
  const code = room.tiles[tr]?.[tc];
  if (!code) return null;
  const def = typeof TILES !== 'undefined' && TILES[code];
  if (!def || !def.solid) return null;
  if (code === 'WALL' || code === 'WALL2') return null;

  const visited = new Set();
  const queue   = [[tc, tr]];
  let minC = tc, maxC = tc, minR = tr, maxR = tr;

  while (queue.length) {
    const [c, r] = queue.shift();
    const key = `${c},${r}`;
    if (visited.has(key)) continue;
    if (r < 0 || r >= room.rows || c < 0 || c >= room.cols) continue;
    if (room.tiles[r]?.[c] !== code) continue;
    visited.add(key);
    minC = Math.min(minC, c); maxC = Math.max(maxC, c);
    minR = Math.min(minR, r); maxR = Math.max(maxR, r);
    queue.push([c-1, r], [c+1, r], [c, r-1], [c, r+1]);
  }

  return { wx: minC*TS, wy: minR*TS, ww: (maxC-minC+1)*TS, wh: (maxR-minR+1)*TS };
}

// Returns the world-space rect {wx, wy, ww, wh} to brighten on hover, or null.
// Priority: named objects (tile_rect) > tile cluster > single tile.
// Empty tile codes resolve to room.floor for TILE_DEF lookup; clusters only apply
// to explicit (non-empty) tile codes.
function hover_highlight_rect(wx, wy, room) {
  if (!room) return null;
  const tc = Math.floor(wx / TS), tr = Math.floor(wy / TS);

  for (const obj of (room.objects || [])) {
    if (obj_tile_hit(obj, tc, tr)) {
      if (obj.tile_rect) {
        const [c1, r1, c2, r2] = obj.tile_rect;
        return { wx: c1*TS, wy: r1*TS, ww: (c2-c1+1)*TS, wh: (r2-r1+1)*TS };
      }
      return { wx: obj.col*TS, wy: obj.row*TS, ww: TS, wh: TS };
    }
  }

  const tile_code = room.tiles[tr]?.[tc];
  const resolved  = tile_code || room.floor;
  if (resolved && typeof TILE_DEFS !== 'undefined' && TILE_DEFS[resolved]) {
    if (tile_code) {
      const cluster = tile_cluster_rect(room, tc, tr);
      if (cluster) return cluster;
    }
    return { wx: tc*TS, wy: tr*TS, ww: TS, wh: TS };
  }

  return null;
}

if (typeof module !== 'undefined') module.exports = { obj_tile_hit, _advance_convo, hover_highlight_rect, tile_cluster_rect };
