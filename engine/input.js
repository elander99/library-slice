// ENGINE: Input handler
// Translates mouse/touch events into sim.perform() calls and renderer UI state updates.
// No game logic here — only event routing.

class Input {
  constructor(canvas, sim, renderer) {
    this.canvas  = canvas;
    this.sim     = sim;
    this.renderer = renderer;

    canvas.addEventListener("mousemove", e => this._on_move(e));
    canvas.addEventListener("click",     e => this._on_click(e));
    canvas.addEventListener("mouseleave", () => { renderer.hover = { x: -1, y: -1 }; });

    // Touch support
    canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      const pos = this._touch_pos(e);
      this._on_click_pos(pos.x, pos.y);
    }, { passive: false });
  }

  _canvas_pos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.renderer.W / rect.width),
      y: (e.clientY - rect.top)  * (this.renderer.H / rect.height)
    };
  }

  _touch_pos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const t = e.touches[0];
    return {
      x: (t.clientX - rect.left) * (this.renderer.W / rect.width),
      y: (t.clientY - rect.top)  * (this.renderer.H / rect.height)
    };
  }

  _on_move(e) {
    const pos = this._canvas_pos(e);
    this.renderer.hover = pos;

    // Update cursor style
    const hit = this._hit_test(pos.x, pos.y);
    this.canvas.style.cursor = hit ? "pointer" : "default";
  }

  _on_click(e) {
    const pos = this._canvas_pos(e);
    this._on_click_pos(pos.x, pos.y);
  }

  _on_click_pos(x, y) {
    const R = this.renderer;
    const S = this.sim;

    // Session ended — only restart button
    if (S.state.session_ended) {
      if (R._end_restart_btn && R._rect_contains(R._end_restart_btn, x, y)) {
        S.restart();
        R.log_entries = [];
        R.notifications = [];
        R.sign_panel = null;
        R.action_menu = null;
      }
      return;
    }

    // Action menu open — handle item clicks or click-away
    if (R.action_menu) {
      const menu = R.action_menu;
      const items = menu._item_rects || [];
      for (let i = 0; i < items.length; i++) {
        if (R._rect_contains(items[i], x, y)) {
          S.perform(menu.items[i].action);
          R.action_menu = null;
          return;
        }
      }
      // Click outside menu — dismiss
      R.action_menu = null;
      return;
    }

    // Hit-test hotspots
    const hs = R.hotspots;

    // NPC clicks → open dialogue
    for (const [hs_id, rect] of Object.entries(hs)) {
      if (NPC_HOTSPOT[hs_id] && R._rect_contains(rect, x, y)) {
        DialoguePanel.open(NPC_HOTSPOT[hs_id]);
        return;
      }
    }

    // Signs (current room only) → open in workspace
    for (const sign of get_room_signs(S.state.current_room)) {
      const key = `sign_${sign.id}`;
      if (hs[key] && R._rect_contains(hs[key], x, y)) {
        WorkspacePanel.open(sign.id);
        return;
      }
    }

    // Interactive objects (library-specific, excluding librarian which is now an NPC)
    const interactives = ["laptop", "textbook", "phone", "snack"];
    for (const obj_id of interactives) {
      if (hs[obj_id] && R._rect_contains(hs[obj_id], x, y)) {
        const actions = S.get_actions(obj_id);
        if (actions.length === 0) return;
        const obj_hs = hs[obj_id];
        R.action_menu = { object_id: obj_id, items: actions, x: obj_hs.x, y: obj_hs.y + obj_hs.h + 6, _item_rects: [] };
        const entry = SCENE_LORE[obj_id];
        if (entry) R.lore_popup = { ...entry, ttl: 220 };
        return;
      }
    }

    // Outlet
    if (hs.outlet && R._rect_contains(hs.outlet, x, y)) {
      const entry = SCENE_LORE["outlet"];
      if (entry) R.lore_popup = { ...entry, ttl: 220 };
      R.log_entries.unshift({ text: "Use the laptop menu to plug in here.", type: "info" });
      if (R.log_entries.length > 3) R.log_entries.pop();
      return;
    }

    // Lore-only objects (all rooms, skip NPCs and signs)
    for (const [id, rect] of Object.entries(hs)) {
      if (id.startsWith("sign_") || NPC_HOTSPOT[id]) continue;
      if (interactives.includes(id) || id === "outlet") continue;
      if (R._rect_contains(rect, x, y) && SCENE_LORE[id]) {
        R.lore_popup = { ...SCENE_LORE[id], ttl: 260 };
        return;
      }
    }

    // Ambient NPC prop clicks → lore popup
    for (const [npc_id, rect] of Object.entries(R._prop_rects || {})) {
      if (R._rect_contains(rect, x, y)) {
        const entry = SCENE_LORE[npc_id];
        if (entry) R.lore_popup = { ...entry, ttl: 260 };
        return;
      }
    }

    // Ambient NPC body clicks → conversation panel
    const room_def = ROOM_MAP_DATA[S.state.current_room];
    for (const [npc_id, rect] of Object.entries(R._ambient_npc_rects || {})) {
      if (rect.sx == null) continue;
      if (R._rect_contains({ x: rect.sx, y: rect.sy, w: rect.sw, h: rect.sh }, x, y)) {
        const npc_def = room_def?.npcs?.find(n => n.npc_id === npc_id);
        if (npc_def?.convo && typeof ConvoPanel !== 'undefined') {
          ConvoPanel.open(npc_def.convo);
          return;
        }
      }
    }

    // Click-to-walk: nothing else caught this click
    if (!R.sign_panel && y > R.SCENE_Y && y < R.H - R.LOG_H) {
      S.perform("set_player_target", { x });
    }
  }

  // Returns true if (x,y) is over any interactive element
  _hit_test(x, y) {
    const R = this.renderer;
    const hs = R.hotspots;

    for (const sign of get_room_signs(this.sim.state.current_room)) {
      const key = `sign_${sign.id}`;
      if (hs[key] && R._rect_contains(hs[key], x, y)) return true;
    }
    for (const [id, rect] of Object.entries(hs)) {
      if (!id.startsWith("sign_") && R._rect_contains(rect, x, y)) return true;
    }
    for (const [, rect] of Object.entries(R._prop_rects || {})) {
      if (R._rect_contains(rect, x, y)) return true;
    }
    for (const [, rect] of Object.entries(R._ambient_npc_rects || {})) {
      if (rect.sx != null && R._rect_contains({ x: rect.sx, y: rect.sy, w: rect.sw, h: rect.sh }, x, y)) return true;
    }
    if (R.action_menu && R.action_menu._item_rects) {
      for (const rect of R.action_menu._item_rects) {
        if (rect && R._rect_contains(rect, x, y)) return true;
      }
    }
    if (R._end_restart_btn && R._rect_contains(R._end_restart_btn, x, y)) return true;
    return false;
  }
}
