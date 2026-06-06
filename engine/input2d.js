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
      WorkspacePanel.open_npc_sentence(text, [text], 0, '', null, en);
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
          DialoguePanel.open(npc_id);
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
        const player_near = Math.abs(S.state.px - rect.wx) < TS*2.5 &&
                            Math.abs(S.state.py - rect.wy) < TS*2.5;
        if (player_near) {
          _advance_convo(S, room, npc_id);
          const npc_def = (room.npcs || []).find(n => n.npc_id === npc_id);
          if (typeof DialoguePanel !== 'undefined') {
            if (npc_def?.convo) DialoguePanel.openConvo(npc_def.convo);
            else if (typeof NPC_DEFS !== 'undefined' && NPC_DEFS[npc_id]) DialoguePanel.open(npc_id);
          }
        } else {
          S.set_walk_target(rect.wx, rect.wy);
        }
        return;
      }
    }

    // Check object clicks — hit area is obj.tile_rect if declared, else single anchor tile
    const clicked_tc = Math.floor(wx / TS), clicked_tr = Math.floor(wy / TS);
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
      const player_near = Math.abs(S.state.px - (ox+TS/2)) < TS*2.5 &&
                          Math.abs(S.state.py - (oy+TS)) < TS*2.5;
      if (player_near) {
        if (sx != null && typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(obj.id, sx, sy);
        this._open_obj_menu(obj.id, x, y);
      } else {
        S.set_walk_target(ox+TS/2, oy+TS);
      }
      return;
    }

    // Check tile descriptions
    if (typeof TILE_DEFS !== 'undefined' && typeof TILES !== 'undefined') {
      const tc = Math.floor(wx / TS), tr = Math.floor(wy / TS);
      const tile_code = room.tiles[tr]?.[tc];
      if (tile_code && TILE_DEFS[tile_code]) {
        if (sx != null && typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(tile_code, sx, sy);
        if (TILES[tile_code]?.solid) return; // solid tile — don't try to walk into it
      }
    }

    // Click-to-move: walk to world position
    S.set_walk_target(wx, wy);
  }

  _try_interact() {
    const S = this.sim;
    const s = S.state;
    const room = ROOM_MAP_DATA[s.room];
    if (!room) return;

    const _popup_cx = this.renderer.W / 2, _popup_cy = this.renderer.VP_Y + 80;

    // NPC interaction
    for (const npc_def of (room.npcs||[])) {
      const nx=npc_def.col*TS+TS/2, ny=npc_def.row*TS+TS;
      if (Math.abs(s.px-nx)<TS*1.5 && Math.abs(s.py-ny)<TS*2) {
        if (npc_def.ambient) {
          _advance_convo(S, room, npc_def.npc_id);
          if (typeof DialoguePanel !== 'undefined') {
            if (npc_def.convo) DialoguePanel.openConvo(npc_def.convo);
            else if (typeof NPC_DEFS !== 'undefined' && NPC_DEFS[npc_def.npc_id]) DialoguePanel.open(npc_def.npc_id);
          }
        } else {
          if (typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(npc_def.npc_id, _popup_cx, _popup_cy);
          DialoguePanel.open(npc_def.npc_id);
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
            if (r && wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) { cursor = 'pointer'; break; }
          }
        }

        // Ambient NPCs (visitors etc.)
        if (cursor === 'default' && R._ambient_npc_rects) {
          for (const rect of Object.values(R._ambient_npc_rects)) {
            const nx = rect.col * TS, ny = (rect.row - 1) * TS;
            if (wx >= nx && wx <= nx + TS && wy >= ny && wy <= ny + TS * 2) { cursor = 'pointer'; break; }
          }
        }

        // Objects — use tile_rect if declared
        if (cursor === 'default') {
          const htc = Math.floor(wx / TS), htr = Math.floor(wy / TS);
          for (const obj of (room.objects || [])) {
            if (obj_tile_hit(obj, htc, htr)) { cursor = 'pointer'; break; }
          }
        }

        // Tiles with descriptions
        if (cursor === 'default' && typeof TILE_DEFS !== 'undefined') {
          const tc = Math.floor(wx / TS), tr = Math.floor(wy / TS);
          const tile_code = room.tiles[tr]?.[tc];
          if (tile_code && TILE_DEFS[tile_code]) cursor = 'pointer';
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

if (typeof module !== 'undefined') module.exports = { obj_tile_hit, _advance_convo };
