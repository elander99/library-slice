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
    // Close action menu on Escape
    if (e.key==='Escape') {
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
      if (R._end_btn && R._pt_in(R._end_btn,x,y)) { S.restart(); R.log_entries=[]; R.notifications=[]; R.action_menu=null; }
      return;
    }

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

    // Click in viewport → check for entity clicks then click-to-move
    if (y < R.VP_Y || y > R.VP_Y+R.VP_H) return;

    const cam  = R._camera(S.state);
    const room = ROOM_MAP_DATA[S.state.room];
    if (!room) return;

    // Convert click to world coords
    const wx = x + cam.cx;
    const wy = (y - R.VP_Y) + cam.cy;

    // Speech bubble dismiss (X button)
    if (R._bubble_close_btn && S.state.librarian.alert && R._pt_in(R._bubble_close_btn, x, y)) {
      S.state.librarian.alert = null;
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

    // Check object clicks
    for (const obj of (room.objects||[])) {
      const ox=obj.col*TS, oy=obj.row*TS;
      if (wx>=ox && wx<=ox+TS && wy>=oy && wy<=oy+TS) {
        const player_near = Math.abs(S.state.px - (ox+TS/2)) < TS*2.5 &&
                            Math.abs(S.state.py - (oy+TS)) < TS*2.5;
        if (player_near) {
          if (sx != null && typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(obj.id, sx, sy);
          this._open_obj_menu(obj.id, x, y);
        }
        else S.set_walk_target(ox+TS/2, oy+TS); // walk toward it
        return;
      }
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
        if (typeof ObjectDescPopup !== 'undefined') ObjectDescPopup.show_for(npc_def.npc_id, _popup_cx, _popup_cy);
        DialoguePanel.open(npc_def.npc_id);
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

    // End-screen restart button
    if (S.state.session_ended) {
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

    // Speech bubble close button
    if (R._bubble_close_btn && S.state.librarian && S.state.librarian.alert && R._pt_in(R._bubble_close_btn, x, y)) {
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

        // Objects
        if (cursor === 'default') {
          for (const obj of (room.objects || [])) {
            const ox = obj.col * TS, oy = obj.row * TS;
            if (wx >= ox && wx <= ox + TS && wy >= oy && wy <= oy + TS) { cursor = 'pointer'; break; }
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
