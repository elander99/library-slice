// ENGINE: Renderer
// Draws everything onto the canvas each frame.
// Reads from sim.state — never writes to it.
// For MonoGame port: translate each draw_* method to SpriteBatch / DrawString calls.

class Renderer {
  constructor(canvas, sim) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sim = sim;
    const dpr = window.devicePixelRatio || 1;
    this._dpr = dpr;
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    canvas.width  = this.W * dpr;
    canvas.height = this.H * dpr;

    // Layout (recomputed on resize too)
    this._update_layout();

    window.addEventListener("resize", () => {
      this.W = window.innerWidth;
      this.H = window.innerHeight;
      canvas.width  = this.W * dpr;
      canvas.height = this.H * dpr;
      this._update_layout();
      this._define_hotspots();
    });

    // UI state (owned by renderer, not sim)
    this.selected       = null;
    this.action_menu    = null;
    this.sign_panel     = null;
    this.lore_popup     = null;
    this.hover          = { x: -1, y: -1 };
    this._current_room  = null;   // tracked to detect room changes
    this._room_changed  = false;
    this.log_entries    = [];     // { text, type, age }
    this.notifications  = [];     // { text, type, ttl, id }  — floats above scene

    // Hotspots: named rects { x, y, w, h } in canvas coords
    // Populated once in draw() so they stay in sync with drawn positions
    this.hotspots = {};
    this._define_hotspots();

    // Fonts
    this.FONT_JP   = "'Noto Serif JP', serif";
    this.FONT_MONO = "'DM Mono', monospace";

    // Colors
    this.C = {
      wall:       "#f0ebe0",
      wall_dark:  "#d4c9b0",
      floor:      "#b07a3a",
      floor_dark: "#7a4f1e",
      desk:       "#5c3317",
      desk_top:   "#7a4520",
      sign_frame: "#2a2a1a",
      hud_bg:     "rgba(20,18,14,0.92)",
      violation:  "#c0392b",
      goal_done:  "#2d6a4f",
      gold:       "#b8860b",
      text_dark:  "#1a1209",
      text_mid:   "#4a3820",
      text_light: "#f5f0e8",
    };
  }

  _update_layout() {
    this.HUD_H   = 56;
    this.LOG_H   = 220;  // scene stops 220px from bottom (180 workspace + 40 buffer)
    this.SCENE_Y = this.HUD_H;
    this.SCENE_H = this.H - this.HUD_H - this.LOG_H;
    this.FLOOR_Y = this.SCENE_Y + Math.floor(this.SCENE_H * 0.48);
    this.LOG_Y   = this.H - this.LOG_H;
  }

  _define_hotspots() {
    const FY = this.FLOOR_Y;
    const SY = this.SCENE_Y;
    const W  = this.W;
    const room_id = this.sim.state.current_room;
    const room    = ROOM_DEFS[room_id];

    this.hotspots = {};

    // Signs from room definition
    if (room && room.sign_layout) {
      room.sign_layout.forEach(sl => {
        this.hotspots[`sign_${sl.sign_id}`] = { x: sl.x, y: SY + 18, w: sl.w, h: sl.h };
      });
    }

    // Object hotspots from room definition
    if (room && room.object_hotspots) {
      Object.assign(this.hotspots, room.object_hotspots(W, FY, SY));
    }

    // Library-specific hardcoded objects
    if (room_id === "library") {
      Object.assign(this.hotspots, {
        bookshelf_obj: { x: 600, y: SY + 8,  w: 90,  h: FY - SY - 40 },
        window_view:   { x: 700, y: SY + 16, w: 72,  h: 96 },
        laptop:        { x: 142, y: FY - 52, w: 118, h: 62 },
        textbook:      { x: 296, y: FY - 48, w: 58,  h: 72 },
        phone:         { x: 142, y: FY + 18, w: 34,  h: 56 },
        snack:         { x: 316, y: FY + 18, w: 48,  h: 48 },
        outlet:        { x: 694, y: FY - 56, w: 38,  h: 50 },
        librarian:     { x: 598, y: FY - 18, w: 56,  h: 128 },
      });
    }
  }

  // --- Main draw ---

  draw() {
    const ctx = this.ctx;
    ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
    ctx.clearRect(0, 0, this.W, this.H);

    // Detect room change
    const cur_room = this.sim.state.current_room;
    if (cur_room !== this._current_room) {
      this._current_room = cur_room;
      this.sign_panel  = null;
      this.action_menu = null;
      this.lore_popup  = null;
      this._define_hotspots();
      this._room_changed = true;
    }

    this._consume_reactions();

    this._draw_hud();
    this._draw_scene();
    this._draw_log();

    if (this.lore_popup)  this._draw_lore_popup();
    if (this.action_menu) this._draw_action_menu();

    this._draw_notifications();

    if (this.sim.state.session_ended) this._draw_end_screen();

    // Transition fade overlay (drawn on top of everything)
    if (this.sim.state.transition) {
      ctx.fillStyle = `rgba(0,0,0,${this.sim.state.transition.alpha})`;
      ctx.fillRect(0, 0, this.W, this.H);
    }
  }

  // --- Consume reactions from sim ---

  _consume_reactions() {
    const reactions = this.sim.reactions.splice(0);
    reactions.forEach(r => {
      let text = "";
      let type = r.type;

      if (r.type === "violation") {
        text = DIALOGUE.violations[r.key] || r.key;
      } else if (r.type === "goal") {
        text = DIALOGUE[r.key] ? DIALOGUE[r.key].english : r.key;
      } else if (r.type === "info") {
        text = r.key === "laptop_dead" ? "Laptop battery died." : r.key;
        type = "info";
      }

      if (text) {
        this.log_entries.unshift({ text, type });
        if (this.log_entries.length > 3) this.log_entries.pop();

        this.notifications.push({
          text, type,
          x: this.W / 2,
          y: this.FLOOR_Y - 20,
          ttl: 180,
          id: r.id
        });
      }
    });

    // Age notifications
    this.notifications = this.notifications
      .map(n => ({ ...n, ttl: n.ttl - 1 }))
      .filter(n => n.ttl > 0);
  }

  // --- HUD ---

  _draw_hud() {
    const ctx = this.ctx;
    const s = this.sim.state;
    const W = this.W, H = this.HUD_H;

    ctx.fillStyle = this.C.hud_bg;
    ctx.fillRect(0, 0, W, H);

    // 充実感 bar
    const BAR_X = 16, BAR_Y = 14, BAR_W = 220, BAR_H = 18;
    ctx.fillStyle = "#333";
    ctx.fillRect(BAR_X, BAR_Y, BAR_W, BAR_H);
    const pct = s.juujitsukan / 100;
    const barColor = pct > 0.6 ? "#2d6a4f" : pct > 0.3 ? "#b8860b" : "#c0392b";
    ctx.fillStyle = barColor;
    ctx.fillRect(BAR_X, BAR_Y, Math.floor(BAR_W * pct), BAR_H);
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.strokeRect(BAR_X, BAR_Y, BAR_W, BAR_H);

    ctx.fillStyle = this.C.text_light;
    ctx.font = `12px ${this.FONT_MONO}`;
    ctx.textAlign = "left";
    ctx.fillText("充実感", BAR_X, BAR_Y - 2);
    ctx.fillText(`${Math.round(s.juujitsukan)}`, BAR_X + BAR_W + 6, BAR_Y + 13);

    // Room name (center)
    const room = ROOM_DEFS[s.current_room];
    ctx.textAlign = "center";
    ctx.fillStyle = "#4a3820";
    ctx.font = `11px ${this.FONT_MONO}`;
    if (room) ctx.fillText(room.name_en, W / 2, H - 6);

    // Goal indicators (library only)
    if (s.current_room === "library") {
      const goal_x = W - 224;
      ctx.font = `11px ${this.FONT_MONO}`;
      ctx.textAlign = "left";
      [
        { g: s.goals.study, done_text: "✓ Read textbook",       todo_text: "○ Read textbook",       y: 16 },
        { g: s.goals.notes, done_text: "✓ Take notes",          todo_text: "○ Take notes (laptop)", y: 36 },
      ].forEach(({ g, done_text, todo_text, y }) => {
        ctx.fillStyle = g.complete ? this.C.goal_done : "#888";
        ctx.fillText(g.complete ? done_text : todo_text, goal_x, y);
        if (!g.complete && g.progress > 0) {
          ctx.fillStyle = "#333";
          ctx.fillRect(goal_x + 118, y - 10, 100, 4);
          ctx.fillStyle = this.C.goal_done;
          ctx.fillRect(goal_x + 118, y - 10, Math.floor(100 * g.progress / 100), 4);
        }
      });

      if (s.current_activity) {
        const act = s.current_activity === "reading" ? "読書中…" : "作業中…";
        ctx.textAlign = "center";
        ctx.fillStyle = this.C.gold;
        ctx.font = `13px ${this.FONT_JP}`;
        ctx.fillText(act, W / 2, H - 4);
      }
    }
  }

  // --- Scene ---

  _draw_scene() {
    const room_id = this.sim.state.current_room;
    const room    = ROOM_DEFS[room_id];

    if (room && room.outdoor) {
      this._draw_outdoor_background();
    } else {
      this._draw_background();
    }

    this._draw_signs();
    this._draw_doors();

    if (room_id === "library") {
      this._draw_bookshelf();
      this._draw_window();
      this._draw_outlet();
      this._draw_desk();
      this._draw_laptop();
      this._draw_textbook();
      this._draw_phone();
      this._draw_snack();
      this._draw_librarian();
    } else if (room_id === "lobby") {
      this._draw_lobby_objects();
    } else if (room_id === "play_area") {
      this._draw_play_area_objects();
    } else if (room_id === "salon") {
      this._draw_salon_objects();
    } else if (room_id === "outdoor") {
      this._draw_outdoor_objects();
    }

    this._draw_player();
  }

  _draw_background() {
    const ctx = this.ctx;
    const SY = this.SCENE_Y, FY = this.FLOOR_Y, W = this.W;
    const SCENE_BOTTOM = this.SCENE_Y + this.SCENE_H;
    const room = ROOM_DEFS[this.sim.state.current_room];
    const wall_col  = (room && room.wall_color)  || this.C.wall;
    const floor_col = (room && room.floor_color) || this.C.floor;
    const floor_dk  = (room && room.floor_dark)  || this.C.floor_dark;

    ctx.fillStyle = wall_col;
    ctx.fillRect(0, SY, W, FY - SY);

    const wall_grad = ctx.createLinearGradient(0, SY, 0, SY + 40);
    wall_grad.addColorStop(0, "rgba(0,0,0,0.15)");
    wall_grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = wall_grad;
    ctx.fillRect(0, SY, W, 40);

    const floor_grad = ctx.createLinearGradient(0, FY, 0, SCENE_BOTTOM);
    floor_grad.addColorStop(0, floor_col);
    floor_grad.addColorStop(1, floor_dk);
    ctx.fillStyle = floor_grad;
    ctx.fillRect(0, FY, W, SCENE_BOTTOM - FY);

    ctx.fillStyle = this.C.desk;
    ctx.fillRect(0, FY, W, 8);

    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, FY + 8);
      ctx.lineTo(x, SCENE_BOTTOM);
      ctx.stroke();
    }
  }

  _draw_outdoor_background() {
    const ctx = this.ctx;
    const SY = this.SCENE_Y, FY = this.FLOOR_Y, W = this.W;
    const SCENE_BOTTOM = this.SCENE_Y + this.SCENE_H;

    const sky = ctx.createLinearGradient(0, SY, 0, FY);
    sky.addColorStop(0, "#4a9fd4");
    sky.addColorStop(1, "#a8d8f0");
    ctx.fillStyle = sky;
    ctx.fillRect(0, SY, W, FY - SY);

    // Clouds
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (const [cx, cy, r] of [[W*0.18, SY+35, 28], [W*0.5, SY+18, 36], [W*0.78, SY+42, 22]]) {
      for (const [ox, oy, or_] of [[0,0,1],[0.6,0.3,0.7],[-0.5,0.3,0.65]]) {
        ctx.beginPath(); ctx.arc(cx + ox*r, cy + oy*r, or_*r, 0, Math.PI*2); ctx.fill();
      }
    }

    const grass = ctx.createLinearGradient(0, FY, 0, SCENE_BOTTOM);
    grass.addColorStop(0, "#5a8c3a");
    grass.addColorStop(1, "#3a6020");
    ctx.fillStyle = grass;
    ctx.fillRect(0, FY, W, SCENE_BOTTOM - FY);
    ctx.fillStyle = "#2a4c14";
    ctx.fillRect(0, FY, W, 8);
  }

  _draw_signs() {
    const ctx = this.ctx;
    const SY = this.SCENE_Y;

    get_room_signs(this.sim.state.current_room).forEach((sign) => {
      const hs = this.hotspots[`sign_${sign.id}`];
      if (!hs) return;

      const is_hovered  = this._is_hovered(hs);
      const is_selected = this.sign_panel && this.sign_panel.sign_id === sign.id;
      const is_complete = sign.tokens && sign.tokens.length > 0 && (() => {
        const prog = WORD_PROGRESS.getSign(sign.id);
        return sign.tokens.every((_, idx) => { const r = prog[idx] || {}; return r.romaji && r.meaning; });
      })();

      // Frame / shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(hs.x + 3, hs.y + 3, hs.w, hs.h);

      // Background
      ctx.fillStyle = sign.color;
      ctx.fillRect(hs.x, hs.y, hs.w, hs.h);

      // Completion green overlay
      if (is_complete) {
        ctx.fillStyle = "rgba(45,106,79,0.35)";
        ctx.fillRect(hs.x, hs.y, hs.w, hs.h);
      }

      // Hover / selected highlight
      if (is_hovered || is_selected) {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(hs.x, hs.y, hs.w, hs.h);
      }

      // Border
      ctx.strokeStyle = is_complete ? "#4fc38a" : is_selected ? "#fff" : "rgba(255,255,255,0.3)";
      ctx.lineWidth   = is_complete || is_selected ? 2 : 1;
      ctx.strokeRect(hs.x, hs.y, hs.w, hs.h);

      // Japanese text — two lines, centered, clipped to sign bounds
      ctx.fillStyle = is_complete ? "#4fc38a" : "#fff";
      ctx.font = `11px ${this.FONT_JP}`;
      ctx.textAlign = "center";
      ctx.save();
      ctx.beginPath();
      ctx.rect(hs.x + 4, hs.y + 8, hs.w - 8, hs.h - 16);
      ctx.clip();
      const lines = sign.japanese.split("\n");
      const line_total_h = lines.length * 18;
      const start_y = hs.y + (hs.h - line_total_h) / 2 + 14;
      lines.forEach((line, li) => {
        ctx.fillText(line, hs.x + hs.w / 2, start_y + li * 18);
      });
      ctx.restore();

      // "Click to read" hint
      if (is_hovered) {
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = `9px ${this.FONT_MONO}`;
        ctx.fillText("click to read", hs.x + hs.w / 2, hs.y + hs.h - 5);
      }

      // Mounting screws
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      [[4,4],[hs.w-4,4],[4,hs.h-4],[hs.w-4,hs.h-4]].forEach(([dx,dy]) => {
        ctx.beginPath();
        ctx.arc(hs.x + dx, hs.y + dy, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  _draw_bookshelf() {
    const ctx = this.ctx;
    const SY = this.SCENE_Y, FY = this.FLOOR_Y;
    const x = 600, y = SY + 8, w = 90, h = FY - SY - 8;

    ctx.fillStyle = this.C.desk;
    ctx.fillRect(x, y, w, h);

    // Shelves
    const shelf_colors = ["#8b3a1e","#5c2d0a","#6b4520","#3a1a08","#7a3520"];
    for (let s = 0; s < 5; s++) {
      const sy = y + 10 + s * (h / 5);
      // Shelf board
      ctx.fillStyle = "#3a2010";
      ctx.fillRect(x + 2, sy + h / 5 - 6, w - 4, 5);
      // Books
      let bx = x + 4;
      for (let b = 0; b < 4; b++) {
        const bw = 14 + (b % 2) * 4;
        ctx.fillStyle = shelf_colors[(s + b) % shelf_colors.length];
        ctx.fillRect(bx, sy + 4, bw, h / 5 - 12);
        bx += bw + 2;
      }
    }

    // Hover glow + label
    const bk_hovered = this._is_hovered(this.hotspots.bookshelf_obj);
    if (bk_hovered) {
      ctx.strokeStyle = this.C.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
    }
    ctx.fillStyle = bk_hovered ? this.C.gold : this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("書棚", x + w / 2, y + h + 14);
    if (bk_hovered) {
      ctx.fillStyle = "rgba(184,134,11,0.8)";
      ctx.font = `9px ${this.FONT_MONO}`;
      ctx.fillText("click to read", x + w / 2, y + h + 26);
    }
  }

  _draw_window() {
    const ctx = this.ctx;
    const SY = this.SCENE_Y;
    const x = 700, y = SY + 16, w = 72, h = 96;

    // Sky
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#a8d4f5");
    sky.addColorStop(1, "#d0e8f8");
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);

    // Panes
    const win_hovered = this._is_hovered(this.hotspots.window_view);
    ctx.strokeStyle = win_hovered ? this.C.gold : this.C.wall_dark;
    ctx.lineWidth = win_hovered ? 2 : 3;
    ctx.strokeRect(x, y, w, h);
    ctx.strokeStyle = win_hovered ? this.C.gold : this.C.wall_dark;
    ctx.lineWidth = win_hovered ? 1 : 3;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();

    // Light on floor
    ctx.fillStyle = "rgba(200,220,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w + 30, this.FLOOR_Y + 60);
    ctx.lineTo(x - 20, this.FLOOR_Y + 60);
    ctx.fill();

    if (win_hovered) {
      ctx.fillStyle = "rgba(184,134,11,0.85)";
      ctx.font = `9px ${this.FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText("click to read", x + w / 2, y + h + 12);
    }
  }

  _draw_outlet() {
    const ctx = this.ctx;
    const hs = this.hotspots.outlet;
    const s = this.sim.state;
    const is_hovered = this._is_hovered(hs);

    ctx.fillStyle = "#e8e0d0";
    ctx.fillRect(hs.x, hs.y, hs.w, hs.h);
    ctx.strokeStyle = is_hovered ? this.C.gold : "#aaa";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hs.x, hs.y, hs.w, hs.h);

    // Socket holes
    ctx.fillStyle = "#666";
    ctx.fillRect(hs.x + 8,  hs.y + 10, 6, 12);
    ctx.fillRect(hs.x + 20, hs.y + 10, 6, 12);
    ctx.fillRect(hs.x + 13, hs.y + 26, 8, 8);

    // In-use indicator
    if (s.outlet.in_use) {
      ctx.fillStyle = s.violation_flags && s.violation_flags.outlet ? this.C.violation : this.C.goal_done;
      ctx.beginPath();
      ctx.arc(hs.x + hs.w - 5, hs.y + 5, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = this.C.text_dark;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("outlet", hs.x + hs.w / 2, hs.y + hs.h + 11);

    // If plugged in and violation: warning glow
    if (s.violation_flags && s.violation_flags.outlet) {
      ctx.strokeStyle = this.C.violation;
      ctx.lineWidth = 2;
      ctx.strokeRect(hs.x - 2, hs.y - 2, hs.w + 4, hs.h + 4);
    }
  }

  _draw_desk() {
    const ctx = this.ctx;
    const FY = this.FLOOR_Y;
    const dx = 120, dw = 300, dh = 90;

    // Desk legs
    ctx.fillStyle = this.C.desk;
    ctx.fillRect(dx + 8, FY + 60, 18, 60);
    ctx.fillRect(dx + dw - 26, FY + 60, 18, 60);

    // Desk top (side face)
    ctx.fillStyle = this.C.desk;
    ctx.fillRect(dx, FY + 10, dw, dh);

    // Desk top surface
    ctx.fillStyle = this.C.desk_top;
    ctx.fillRect(dx - 4, FY - 14, dw + 8, 28);

    // Surface shine
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(dx, FY - 12, dw + 4, 10);
  }

  _draw_laptop() {
    const ctx = this.ctx;
    const hs = this.hotspots.laptop;
    const s = this.sim.state;
    const is_hovered = this._is_hovered(hs);

    // Base
    ctx.fillStyle = s.laptop.on ? "#2a2a2a" : "#3a3a3a";
    ctx.fillRect(hs.x, hs.y + 30, hs.w, 18);

    // Screen (when on)
    if (s.laptop.on) {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(hs.x + 4, hs.y, hs.w - 8, 34);
      // Screen content hint
      const screen_color = s.laptop.task === "personal" ? "#4a1a1a" : s.laptop.task === "library" ? "#1a3a2a" : "#1a2a3a";
      ctx.fillStyle = screen_color;
      ctx.fillRect(hs.x + 8, hs.y + 4, hs.w - 16, 26);
      if (s.laptop.task) {
        ctx.fillStyle = s.laptop.task === "personal" ? "#ff6b6b" : "#6bff9e";
        ctx.font = `9px ${this.FONT_MONO}`;
        ctx.textAlign = "center";
        ctx.fillText(s.laptop.task === "library" ? "library work" : "personal", hs.x + hs.w / 2, hs.y + 20);
      }
    } else {
      // Closed lid
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(hs.x + 4, hs.y, hs.w - 8, 30);
    }

    // Battery bar on base
    const bat_w = Math.floor((hs.w - 16) * s.laptop.battery / 100);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(hs.x + 8, hs.y + 34, hs.w - 16, 8);
    const bat_color = s.laptop.battery > 30 ? "#2d6a4f" : "#c0392b";
    ctx.fillStyle = bat_color;
    ctx.fillRect(hs.x + 8, hs.y + 34, bat_w, 8);

    // Plug indicator
    if (s.laptop.plugged_in) {
      ctx.fillStyle = this.C.gold;
      ctx.font = `12px ${this.FONT_MONO}`;
      ctx.textAlign = "right";
      ctx.fillText("⚡", hs.x + hs.w, hs.y + 30);
    }

    // Hover border
    if (is_hovered) {
      ctx.strokeStyle = this.C.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(hs.x - 2, hs.y - 2, hs.w + 4, hs.h + 4);
    }

    // Label
    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText(`💻 ${Math.round(s.laptop.battery)}%`, hs.x + hs.w / 2, hs.y + hs.h + 12);
  }

  _draw_textbook() {
    const ctx = this.ctx;
    const hs = this.hotspots.textbook;
    const s = this.sim.state;
    const is_hovered = this._is_hovered(hs);

    // Book shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(hs.x + 3, hs.y + 3, hs.w, hs.h);

    // Cover
    ctx.fillStyle = s.textbook.in_hand ? "#1a3a5c" : "#2a4a6c";
    ctx.fillRect(hs.x, hs.y, hs.w, hs.h);

    // Spine
    ctx.fillStyle = "#1a2a3c";
    ctx.fillRect(hs.x, hs.y, 6, hs.h);

    // Title lines
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(hs.x + 10, hs.y + 10, hs.w - 14, 3);
    ctx.fillRect(hs.x + 10, hs.y + 18, hs.w - 14, 2);

    // Progress bar along bottom edge
    const prog_w = Math.floor(hs.w * s.textbook.progress / 100);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(hs.x, hs.y + hs.h - 6, hs.w, 6);
    ctx.fillStyle = this.C.goal_done;
    ctx.fillRect(hs.x, hs.y + hs.h - 6, prog_w, 6);

    if (is_hovered) {
      ctx.strokeStyle = this.C.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(hs.x - 2, hs.y - 2, hs.w + 4, hs.h + 4);
    }

    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText(`📖 ${Math.round(s.textbook.progress)}%`, hs.x + hs.w / 2, hs.y + hs.h + 12);
  }

  _draw_phone() {
    const ctx = this.ctx;
    const hs = this.hotspots.phone;
    const s = this.sim.state;
    const is_hovered = this._is_hovered(hs);

    ctx.fillStyle = s.phone.on_call ? "#c0392b" : "#1a1a1a";
    ctx.fillRect(hs.x, hs.y, hs.w, hs.h);
    ctx.fillStyle = s.phone.on_call ? "rgba(255,100,100,0.6)" : "#222";
    ctx.fillRect(hs.x + 3, hs.y + 6, hs.w - 6, hs.h - 16);

    if (s.phone.on_call) {
      ctx.fillStyle = "#fff";
      ctx.font = `9px ${this.FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText("ON", hs.x + hs.w / 2, hs.y + hs.h / 2 + 3);
    }

    if (is_hovered) {
      ctx.strokeStyle = this.C.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(hs.x - 2, hs.y - 2, hs.w + 4, hs.h + 4);
    }

    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("📱", hs.x + hs.w / 2, hs.y + hs.h + 12);
  }

  _draw_snack() {
    const ctx = this.ctx;
    const hs = this.hotspots.snack;
    const s = this.sim.state;
    const is_hovered = this._is_hovered(hs);

    if (!s.snack.eaten) {
      ctx.fillStyle = "#8b6914";
      ctx.fillRect(hs.x, hs.y + 10, hs.w, hs.h - 10);
      ctx.fillStyle = "#b8860b";
      ctx.fillRect(hs.x + 4, hs.y + 4, hs.w - 8, 14);
      ctx.fillStyle = "#f5e642";
      ctx.font = `18px serif`;
      ctx.textAlign = "center";
      ctx.fillText("🍘", hs.x + hs.w / 2, hs.y + hs.h - 4);

      if (is_hovered) {
        ctx.strokeStyle = this.C.gold;
        ctx.lineWidth = 2;
        ctx.strokeRect(hs.x - 2, hs.y - 2, hs.w + 4, hs.h + 4);
      }
    }

    ctx.fillStyle = s.snack.eaten ? "#666" : this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText(s.snack.eaten ? "(eaten)" : "snack", hs.x + hs.w / 2, hs.y + hs.h + 12);
  }

  _draw_librarian() {
    const ctx = this.ctx;
    const hs = this.hotspots.librarian;
    const s = this.sim.state;
    const is_hovered = this._is_hovered(hs);

    const cx = hs.x + hs.w / 2;

    // Body
    ctx.fillStyle = s.librarian.mood === "annoyed" ? "#5a1a1a" : "#1a3a5a";
    ctx.fillRect(hs.x + 6, hs.y + 38, hs.w - 12, hs.h - 38);

    // Head
    ctx.fillStyle = "#e8c89a";
    ctx.beginPath();
    ctx.arc(cx, hs.y + 24, 20, 0, Math.PI * 2);
    ctx.fill();

    // Hair bun
    ctx.fillStyle = "#3a2010";
    ctx.beginPath();
    ctx.arc(cx, hs.y + 8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 12, hs.y + 8, 24, 18);

    // Glasses
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 16, hs.y + 20, 12, 9);
    ctx.strokeRect(cx + 4,  hs.y + 20, 12, 9);
    ctx.beginPath();
    ctx.moveTo(cx - 4, hs.y + 24); ctx.lineTo(cx + 4, hs.y + 24);
    ctx.stroke();

    // Mood eyes
    ctx.fillStyle = "#1a1a1a";
    if (s.librarian.mood === "annoyed") {
      // Furrowed brow + frown
      ctx.fillRect(cx - 14, hs.y + 20, 10, 2);
      ctx.fillRect(cx + 4,  hs.y + 20, 10, 2);
      ctx.beginPath();
      ctx.arc(cx, hs.y + 32, 6, 0.2 * Math.PI, 0.8 * Math.PI, true);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(cx, hs.y + 30, 4, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }

    // Arms
    ctx.fillStyle = s.librarian.mood === "annoyed" ? "#5a1a1a" : "#1a3a5a";
    ctx.fillRect(hs.x, hs.y + 50, 8, 40);
    ctx.fillRect(hs.x + hs.w - 8, hs.y + 50, 8, 40);

    if (is_hovered) {
      ctx.strokeStyle = this.C.gold;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hs.x - 2, hs.y - 2, hs.w + 4, hs.h + 4);
    }

    // Speech bubble
    if (s.librarian.alert) {
      this._draw_speech_bubble(s.librarian.alert, cx, hs.y - 4);
    }

    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("図書館員", cx, hs.y + hs.h + 13);
  }

  _draw_speech_bubble(alert, cx, cy) {
    const ctx = this.ctx;
    const dialogue = DIALOGUE[alert.key];
    if (!dialogue) return;

    const text = dialogue.japanese;
    const bw = 220, bh = 54;
    const bx = Math.min(Math.max(cx - bw / 2, 4), this.W - bw - 4);
    const by = cy - bh - 14;

    // Bubble bg
    ctx.fillStyle = "rgba(250,248,240,0.97)";
    ctx.strokeStyle = "#5c3317";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 8);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.fillStyle = "rgba(250,248,240,0.97)";
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 14);
    ctx.lineTo(cx,     cy - 2);
    ctx.lineTo(cx + 8, cy - 14);
    ctx.fill();
    ctx.strokeStyle = "#5c3317";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 14);
    ctx.lineTo(cx,     cy - 2);
    ctx.lineTo(cx + 8, cy - 14);
    ctx.stroke();

    ctx.fillStyle = this.C.text_dark;
    ctx.font = `13px ${this.FONT_JP}`;
    ctx.textAlign = "center";
    ctx.fillText(text, bx + bw / 2, by + 26, bw - 12);
  }

  // --- Player ---

  _draw_player() {
    const ctx = this.ctx;
    const p   = this.sim.state.player;
    const x   = p.x;
    const fy  = this.FLOOR_Y;
    const moving = Math.abs(p.x - p.target_x) > 3;
    const leg   = moving ? Math.sin(p.walk_phase) * 8 : 0;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(x, fy + 3, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = "#2a3050";
    ctx.fillRect(x - 9, fy - 28, 7, 28 + leg);
    ctx.fillRect(x + 2,  fy - 28, 7, 28 - leg);

    // Body
    ctx.fillStyle = "#3a4a6c";
    ctx.fillRect(x - 13, fy - 66, 26, 40);

    // Head
    ctx.fillStyle = "#e0c090";
    ctx.beginPath();
    ctx.arc(x, fy - 78, 14, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#3a2010";
    ctx.beginPath();
    ctx.arc(x, fy - 86, 10, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x - 10, fy - 92, 20, 10);

    // Eye (indicates facing direction)
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(x + p.facing * 5, fy - 78, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Doors ---

  _draw_doors() {
    const ctx  = this.ctx;
    const room = ROOM_DEFS[this.sim.state.current_room];
    if (!room) return;

    const FY = this.FLOOR_Y, W = this.W;
    const dw = 52, dh = 96;

    const _door = (edge_x, label, arrow) => {
      const dx = edge_x === "left" ? 0 : W - dw;
      const dy = FY - dh;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(dx, dy, dw, dh);
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(dx + 4, dy + 4, dw - 8, dh - 4);
      ctx.fillStyle = this.C.gold;
      ctx.font = `15px ${this.FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(arrow, dx + dw / 2, dy + dh / 2 + 5);
      ctx.font = `9px ${this.FONT_JP}`;
      ctx.fillText(label, dx + dw / 2, dy + dh - 8);
    };

    const _room_name = r => LANG.current === 'ko' && r.name_ko ? r.name_ko : r.name_jp;
    if (room.left)  _door("left",  _room_name(ROOM_DEFS[room.left]),  "←");
    if (room.right) _door("right", _room_name(ROOM_DEFS[room.right]), "→");
  }

  // --- NPC figure helper ---

  _draw_npc_figure(hs, body_color, hair_color, is_hovered) {
    const ctx  = this.ctx;
    const cx   = hs.x + hs.w / 2;
    const fy   = hs.y + hs.h;          // feet at hotspot bottom
    const h    = hs.h;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.ellipse(cx, fy + 2, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = body_color;
    ctx.fillRect(cx - 8,  fy - h * 0.28, 7, h * 0.28);
    ctx.fillRect(cx + 1,  fy - h * 0.28, 7, h * 0.28);

    // Body
    ctx.fillRect(cx - 12, fy - h * 0.72, 24, h * 0.44);

    // Head
    ctx.fillStyle = "#e0c090";
    ctx.beginPath();
    ctx.arc(cx, fy - h * 0.82, h * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = hair_color;
    ctx.beginPath();
    ctx.arc(cx, fy - h * 0.9, h * 0.10, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(cx - h * 0.10, fy - h * 0.9, h * 0.20, h * 0.09);

    // Hover "!" indicator
    if (is_hovered) {
      ctx.fillStyle = this.C.gold;
      ctx.font = `bold 14px ${this.FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText("!", cx, hs.y - 6);
      ctx.font = `9px ${this.FONT_MONO}`;
      ctx.fillStyle = "rgba(184,134,11,0.8)";
      ctx.fillText("talk", cx, hs.y - 16);
    }
  }

  // --- Non-library room objects ---

  _draw_lobby_objects() {
    const ctx = this.ctx;
    const FY  = this.FLOOR_Y, W = this.W;

    // Reception desk
    const rx = W / 2 - 70;
    ctx.fillStyle = "#5c3317";
    ctx.fillRect(rx, FY - 48, 140, 48);
    ctx.fillStyle = "#7a4520";
    ctx.fillRect(rx - 4, FY - 52, 148, 10);
    // Name plate
    ctx.fillStyle = "#b8860b";
    ctx.fillRect(rx + 20, FY - 40, 100, 18);
    ctx.fillStyle = "#0d0b07";
    ctx.font = `10px ${this.FONT_JP}`;
    ctx.textAlign = "center";
    ctx.fillText("案内・受付", rx + 70, FY - 27);

    // Exit sign above door (right side)
    const ex = W - 80;
    ctx.fillStyle = "#2d6a4f";
    ctx.fillRect(ex, this.SCENE_Y + 130, 60, 28);
    ctx.fillStyle = "#fff";
    ctx.font = `11px ${this.FONT_JP}`;
    ctx.textAlign = "center";
    ctx.fillText("出口", ex + 30, this.SCENE_Y + 149);

    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("reception", W / 2, FY + 12);

    // Receptionist NPC
    const npc_hs = this.hotspots["npc_receptionist"];
    if (npc_hs) this._draw_npc_figure(npc_hs, "#5c3317", "#1a0a08", this._is_hovered(npc_hs));
  }

  _draw_play_area_objects() {
    const ctx = this.ctx;
    const FY = this.FLOOR_Y, SY = this.SCENE_Y, W = this.W;

    // Shoe rack (right side)
    const rx = W - 150;
    ctx.fillStyle = "#8b6914";
    ctx.fillRect(rx, FY - 68, 110, 68);
    // Shelf dividers
    ctx.fillStyle = "#6a5010";
    ctx.fillRect(rx + 2, FY - 36, 106, 4);
    // Shoes
    const shoe_colors = ["#c0392b", "#2a4a6c", "#2d6a4f", "#8b3a1e", "#5c1a5c", "#1a3a5c"];
    for (let i = 0; i < 6; i++) {
      const row = i < 3 ? 0 : 1;
      const col = i % 3;
      ctx.fillStyle = shoe_colors[i];
      ctx.fillRect(rx + 6 + col * 34, FY - 64 + row * 32, 28, 14);
    }
    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_JP}`;
    ctx.textAlign = "center";
    ctx.fillText("下駄箱", rx + 55, FY + 12);

    // Entrance gate / arch
    const gx = W / 2 - 40;
    ctx.strokeStyle = "#5c3317";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(gx, FY); ctx.lineTo(gx, FY - 110);
    ctx.lineTo(gx + 80, FY - 110); ctx.lineTo(gx + 80, FY);
    ctx.stroke();
    ctx.fillStyle = "rgba(184,134,11,0.15)";
    ctx.fillRect(gx + 3, FY - 107, 74, 107);

    // Colorful ball pit hint (left)
    for (const [bx, by, br, bc] of [
      [80, FY-20, 16, "#c0392b"], [108, FY-28, 14, "#b8860b"],
      [134, FY-18, 15, "#2d6a4f"], [60, FY-34, 12, "#2a4a6c"]
    ]) {
      ctx.fillStyle = bc;
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
    }

    // Play area staff NPC
    const npc_hs = this.hotspots["npc_play_staff"];
    if (npc_hs) this._draw_npc_figure(npc_hs, "#2d6a4f", "#3a2010", this._is_hovered(npc_hs));
  }

  _draw_salon_objects() {
    const ctx = this.ctx;
    const FY = this.FLOOR_Y, W = this.W;

    // Low craft table (center)
    const tx = W / 2 - 90;
    ctx.fillStyle = "#c8a870";
    ctx.fillRect(tx, FY - 14, 180, 14);
    ctx.fillStyle = "#a07840";
    ctx.fillRect(tx + 4,  FY - 32, 8, 20);
    ctx.fillRect(tx + 168, FY - 32, 8, 20);
    // Craft items on table
    ctx.fillStyle = "#c0392b"; ctx.fillRect(tx + 20, FY - 26, 18, 12);
    ctx.fillStyle = "#2a4a6c"; ctx.fillRect(tx + 50, FY - 28, 14, 14);
    ctx.fillStyle = "#b8860b"; ctx.fillRect(tx + 80, FY - 24, 20, 10);
    ctx.fillStyle = "#2d6a4f"; ctx.fillRect(tx + 110, FY - 26, 16, 12);

    // Cushion seats
    for (const [sx, sc] of [[tx - 50, "#8b1a5c"], [tx + 200, "#5c1a8b"]]) {
      ctx.fillStyle = sc;
      ctx.beginPath();
      ctx.roundRect(sx, FY - 22, 36, 22, 4);
      ctx.fill();
    }

    // Bookshelf (right)
    ctx.fillStyle = "#6a4a8c";
    ctx.fillRect(W - 90, this.SCENE_Y + 8, 70, FY - this.SCENE_Y - 8);
    for (let row = 0; row < 4; row++) {
      const ry = this.SCENE_Y + 18 + row * 38;
      const colors = ["#c0392b","#b8860b","#2d6a4f","#1a3a5c"];
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = colors[(row + b) % 4];
        ctx.fillRect(W - 84 + b * 20, ry, 16, 28);
      }
    }

    ctx.fillStyle = this.C.text_light;
    ctx.font = `10px ${this.FONT_JP}`;
    ctx.textAlign = "center";
    ctx.fillText("工作台", W / 2, FY + 12);

    // Salon staff NPC
    const npc_hs = this.hotspots["npc_salon_staff"];
    if (npc_hs) this._draw_npc_figure(npc_hs, "#5c1a5c", "#1a0808", this._is_hovered(npc_hs));
  }

  _draw_outdoor_objects() {
    const ctx = this.ctx;
    const FY  = this.FLOOR_Y, W = this.W;

    // Trees
    for (const tx of [W * 0.12, W * 0.38, W * 0.65, W * 0.88]) {
      ctx.fillStyle = "#1e3c14";
      ctx.beginPath(); ctx.arc(tx - 12, FY - 52, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2d5c1e";
      ctx.beginPath(); ctx.arc(tx, FY - 62, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5c3a10";
      ctx.fillRect(tx - 6, FY - 28, 12, 28);
    }

    // Zipline posts
    ctx.strokeStyle = "#6a4010";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(W * 0.1, FY); ctx.lineTo(W * 0.1, FY - 160);
    ctx.moveTo(W * 0.9, FY); ctx.lineTo(W * 0.9, FY - 90);
    ctx.stroke();

    // Zipline cable
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W * 0.1, FY - 158); ctx.lineTo(W * 0.9, FY - 88);
    ctx.stroke();

    // Rider on cable (simple)
    const t    = (Date.now() % 6000) / 6000;
    const rx   = W * 0.1 + (W * 0.8) * t;
    const ry   = (FY - 158) + (70) * t;
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(rx - 6, ry, 12, 18);
    ctx.fillStyle = "#e0c090";
    ctx.beginPath(); ctx.arc(rx, ry - 8, 8, 0, Math.PI * 2); ctx.fill();

    // Bench
    const bx = W * 0.6;
    ctx.fillStyle = "#8b6914";
    ctx.fillRect(bx, FY - 30, 120, 8);
    ctx.fillRect(bx + 8,  FY - 22, 8, 22);
    ctx.fillRect(bx + 104, FY - 22, 8, 22);
    ctx.fillRect(bx + 8,  FY - 50, 8, 22);  // backrest
    ctx.fillRect(bx + 104, FY - 50, 8, 22);
    ctx.fillRect(bx, FY - 50, 120, 6);

    // Outdoor guide NPC
    const npc_hs = this.hotspots["npc_outdoor_guide"];
    if (npc_hs) this._draw_npc_figure(npc_hs, "#2a4a6c", "#3a2010", this._is_hovered(npc_hs));
  }

  // --- Log ---

  _draw_log() {
    const ctx = this.ctx;
    ctx.fillStyle = this.C.hud_bg;
    ctx.fillRect(0, this.LOG_Y, this.W, this.LOG_H);

    ctx.fillStyle = "#555";
    ctx.fillRect(0, this.LOG_Y, this.W, 1);

    this.log_entries.slice(0, 3).forEach((entry, i) => {
      const alpha = 1 - i * 0.3;
      ctx.globalAlpha = alpha;
      const color = entry.type === "violation" ? "#e07070" : entry.type === "goal" ? "#70c090" : "#aaa";
      ctx.fillStyle = color;
      ctx.font = `12px ${this.FONT_MONO}`;
      ctx.textAlign = "left";
      ctx.fillText((i === 0 ? "▸ " : "  ") + entry.text, 16, this.LOG_Y + 18 + i * 16);
    });
    ctx.globalAlpha = 1;

    // Hint
    ctx.fillStyle = "#444";
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "right";
    ctx.fillText("click objects or signs to interact", this.W - 10, this.LOG_Y + this.LOG_H - 8);
  }

  // --- Floating notifications ---

  _draw_notifications() {
    const ctx = this.ctx;
    this.notifications.slice(-1).forEach(n => {
      const alpha = Math.min(1, n.ttl / 30);
      const y = this.FLOOR_Y - 30 - (1 - n.ttl / 180) * 30;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = n.type === "violation" ? this.C.violation : n.type === "goal" ? this.C.goal_done : "#888";
      ctx.font = `bold 13px ${this.FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(n.text, this.W / 2, y);
    });
    ctx.globalAlpha = 1;
  }

  // --- Action menu ---

  _draw_action_menu() {
    const menu = this.action_menu;
    if (!menu || menu.items.length === 0) return;

    const ctx = this.ctx;
    const ITEM_H = 28, PAD = 10;
    const mw = 200;
    const mh = menu.items.length * ITEM_H + PAD * 2;
    const mx = Math.min(menu.x, this.W - mw - 4);
    const my = Math.min(menu.y, this.H - mh - 4);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(mx + 3, my + 3, mw, mh);

    // Background
    ctx.fillStyle = "rgba(28,22,14,0.97)";
    ctx.strokeStyle = "#8b6914";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 6);
    ctx.fill();
    ctx.stroke();

    menu.items.forEach((item, i) => {
      const iy = my + PAD + i * ITEM_H;
      const item_rect = { x: mx + 4, y: iy, w: mw - 8, h: ITEM_H - 2 };
      menu._item_rects = menu._item_rects || [];
      menu._item_rects[i] = item_rect;

      const hovered = this._rect_contains(item_rect, this.hover.x, this.hover.y);
      if (hovered) {
        ctx.fillStyle = "rgba(184,134,11,0.25)";
        ctx.beginPath();
        ctx.roundRect(item_rect.x, item_rect.y, item_rect.w, item_rect.h, 4);
        ctx.fill();
      }

      ctx.fillStyle = hovered ? this.C.gold : this.C.text_light;
      ctx.font = `13px ${this.FONT_MONO}`;
      ctx.textAlign = "left";
      ctx.fillText(DIALOGUE.actions[item.label_key] || item.label_key, mx + PAD + 8, iy + ITEM_H - 8);
    });
  }

  // --- Lore popup ---

  _draw_lore_popup() {
    const ctx  = this.ctx;
    const p    = this.lore_popup;
    const fade = Math.min(1, p.ttl / 40);
    ctx.globalAlpha = fade;

    const pw = 500, ph = 64;
    const px = (this.W - pw) / 2;
    const py = this.LOG_Y - ph - 10;

    ctx.fillStyle = "rgba(15,12,8,0.95)";
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 6);
    ctx.fill();
    ctx.strokeStyle = "#4a3010";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 6);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = this.C.text_light;
    ctx.font = `13px ${this.FONT_MONO}`;
    ctx.fillText(p.l1, px + pw / 2, py + 22);
    ctx.fillStyle = "#999";
    ctx.font = `11px ${this.FONT_MONO}`;
    ctx.fillText(p.l2, px + pw / 2, py + 44);

    ctx.globalAlpha = 1;

    p.ttl--;
    if (p.ttl <= 0) this.lore_popup = null;
  }

  // --- Sign panel ---

  _compute_word_rects(tokens, area_x, area_y, area_w) {
    const ctx = this.ctx;
    const CHIP_PAD = 9;   // horizontal padding inside each chip
    const CHIP_H   = 34;
    const H_GAP    = 6;   // gap between chips in a row
    const V_GAP    = 8;   // gap between rows

    ctx.font = `15px ${this.FONT_JP}`;

    const rects = [];
    let cx = area_x, cy = area_y;

    tokens.forEach((token, i) => {
      const text_w  = ctx.measureText(token.text).width;
      const chip_w  = Math.ceil(text_w) + CHIP_PAD * 2;

      if (cx + chip_w > area_x + area_w && cx > area_x) {
        cx = area_x;
        cy += CHIP_H + V_GAP;
      }

      rects.push({ x: cx, y: cy, w: chip_w, h: CHIP_H, token, i });
      cx += chip_w + H_GAP;
    });

    return rects;
  }

  _draw_sign_panel() {
    const ctx = this.ctx;
    const panel = this.sign_panel;
    const sign = SIGN_BY_ID[panel.sign_id];
    if (!sign) return;

    // Overlay
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, this.W, this.H);

    const pw = 640, ph = 460;
    const px = (this.W - pw) / 2;
    const py = (this.H - ph) / 2;

    // Panel shadow
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(px + 5, py + 5, pw, ph);

    // Panel background
    ctx.fillStyle = "#fafaf2";
    ctx.strokeStyle = sign.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 8);
    ctx.fill();
    ctx.stroke();

    // Color header strip
    ctx.fillStyle = sign.color;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, 48, [8, 8, 0, 0]);
    ctx.fill();

    // Header text — Japanese label
    ctx.fillStyle = "#fff";
    ctx.font = `16px ${this.FONT_JP}`;
    ctx.textAlign = "left";
    ctx.fillText(sign.label, px + 20, py + 32);

    // Close button
    const cx_btn = px + pw - 24, cy_btn = py + 18;
    this.sign_panel._close_btn = { x: cx_btn - 12, y: cy_btn - 12, w: 24, h: 24 };
    const close_hovered = this._rect_contains(this.sign_panel._close_btn, this.hover.x, this.hover.y);
    ctx.fillStyle = close_hovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(cx_btn, cy_btn, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `14px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("×", cx_btn, cy_btn + 5);

    // Hint
    ctx.fillStyle = "#999";
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.textAlign = "center";
    ctx.fillText("click a word to look it up", px + pw / 2, py + 62);

    // --- Word chips ---
    const tokens = sign.tokens;
    if (tokens && tokens.length > 0) {
      if (!panel._word_rects) {
        panel._word_rects = this._compute_word_rects(tokens, px + 20, py + 72, pw - 40);
      }

      panel._word_rects.forEach(wr => {
        const is_hovered  = this._rect_contains(wr, this.hover.x, this.hover.y);
        const is_selected = panel.selected_word_index === wr.i;
        const res         = (panel.word_results || {})[wr.i] || {};
        const has_romaji  = !!res.romaji;
        const has_meaning = !!res.meaning;
        const is_both     = has_romaji && has_meaning;

        // Background
        let bg;
        if      (is_both)     bg = "#2d6a4f";
        else if (is_selected) bg = sign.color;
        else if (has_romaji)  bg = is_hovered ? "rgba(184,134,11,0.14)" : "rgba(184,134,11,0.08)";
        else if (has_meaning) bg = is_hovered ? "rgba(45,106,79,0.14)"  : "rgba(45,106,79,0.08)";
        else                  bg = is_hovered ? "rgba(0,0,0,0.07)" : "rgba(0,0,0,0.03)";
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(wr.x, wr.y, wr.w, wr.h, 4);
        ctx.fill();

        // Border
        let border;
        if      (is_both)     border = "#2d6a4f";
        else if (is_selected) border = sign.color;
        else if (has_romaji)  border = is_hovered ? this.C.gold : "rgba(184,134,11,0.6)";
        else if (has_meaning) border = is_hovered ? "#2d6a4f"   : "rgba(45,106,79,0.5)";
        else                  border = is_hovered ? sign.color  : "rgba(0,0,0,0.15)";
        ctx.strokeStyle = border;
        ctx.lineWidth = (is_both || is_selected || is_hovered || has_romaji || has_meaning) ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(wr.x, wr.y, wr.w, wr.h, 4);
        ctx.stroke();

        ctx.fillStyle = (is_both || is_selected) ? "#fff" : this.C.text_dark;
        ctx.font = `15px ${this.FONT_JP}`;
        ctx.textAlign = "center";
        ctx.fillText(wr.token.text, wr.x + wr.w / 2, wr.y + wr.h - 8);
      });
    }

    // --- Word definition box ---
    // Two rows: pronunciation (furigana/romaji) and meaning, unlocked independently.
    const def_y = py + 210;

    ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Box height = 96: word row (~28), romaji input zone (334-362), meaning row (≥367)
    ctx.roundRect(px + 20, def_y, pw - 40, 96, 6);
    ctx.fill();
    ctx.stroke();

    if (panel.selected_word_index != null && tokens) {
      const word = tokens[panel.selected_word_index];
      const res  = (panel.word_results || {})[panel.selected_word_index] || {};
      if (word) {
        // Row 1 — word text, always visible
        ctx.fillStyle = sign.color;
        ctx.font = `21px ${this.FONT_JP}`;
        ctx.textAlign = "left";
        ctx.fillText(word.text, px + 32, def_y + 24);

        // Row 2 — pronunciation (furigana + romaji), own line below the word
        if (res.romaji) {
          ctx.fillStyle = this.C.gold;
          ctx.font = `11px ${this.FONT_MONO}`;
          ctx.fillText(word.furigana + "  [" + (word.romaji || "") + "]", px + 32, def_y + 46);
        }

        // Row 3 — meaning, own line below the pronunciation input zone
        if (res.meaning) {
          ctx.fillStyle = this.C.goal_done;
          ctx.font = `13px ${this.FONT_MONO}`;
          ctx.fillText("✓ " + word.meaning.split("/")[0].trim(), px + 32, def_y + 80);
        }
        // HTML input overlay covers row 2 or row 3 while they are still locked
      }
    } else {
      ctx.fillStyle = "#bbb";
      ctx.font = `11px ${this.FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.fillText("— click a word above —", px + pw / 2, def_y + 48);
    }

  }

  // --- End screen ---

  _draw_end_screen() {
    const ctx = this.ctx;
    const s = this.sim.state;

    ctx.fillStyle = "rgba(10,8,4,0.85)";
    ctx.fillRect(0, 0, this.W, this.H);

    const pw = 420, ph = 280;
    const px = (this.W - pw) / 2, py = (this.H - ph) / 2;

    ctx.fillStyle = "#1a1209";
    ctx.strokeStyle = this.C.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 10);
    ctx.fill();
    ctx.stroke();

    const high = s.juujitsukan >= 60;
    const dl = high ? DIALOGUE.session_end_high : DIALOGUE.session_end_low;

    ctx.fillStyle = this.C.gold;
    ctx.font = `28px ${this.FONT_JP}`;
    ctx.textAlign = "center";
    ctx.fillText(dl.japanese, px + pw / 2, py + 70);

    ctx.fillStyle = this.C.text_light;
    ctx.font = `14px ${this.FONT_MONO}`;
    ctx.fillText(dl.english, px + pw / 2, py + 104);

    // Score
    const score_color = s.juujitsukan > 60 ? this.C.goal_done : s.juujitsukan > 30 ? this.C.gold : this.C.violation;
    ctx.fillStyle = score_color;
    ctx.font = `48px ${this.FONT_MONO}`;
    ctx.fillText(Math.round(s.juujitsukan), px + pw / 2, py + 176);

    ctx.fillStyle = "#888";
    ctx.font = `11px ${this.FONT_MONO}`;
    ctx.fillText("充実感 remaining", px + pw / 2, py + 196);

    // Goal result
    ctx.font = `12px ${this.FONT_MONO}`;
    ctx.fillStyle = s.goals.study.complete ? this.C.goal_done : "#888";
    ctx.fillText(s.goals.study.complete ? "✓ Read textbook" : "○ Read textbook", px + pw / 2 - 60, py + 222);
    ctx.fillStyle = s.goals.notes.complete ? this.C.goal_done : "#888";
    ctx.fillText(s.goals.notes.complete ? "✓ Took notes" : "○ Took notes", px + pw / 2 + 60, py + 222);

    // Restart
    const rb = { x: px + pw / 2 - 70, y: py + ph - 50, w: 140, h: 34 };
    this._end_restart_btn = rb;
    const rb_hovered = this._rect_contains(rb, this.hover.x, this.hover.y);
    ctx.fillStyle = rb_hovered ? this.C.gold : "#333";
    ctx.strokeStyle = this.C.gold;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rb.x, rb.y, rb.w, rb.h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = rb_hovered ? "#1a1209" : this.C.text_light;
    ctx.font = `13px ${this.FONT_MONO}`;
    ctx.fillText("Play again", rb.x + rb.w / 2, rb.y + 22);
  }

  // --- Helpers ---

  _is_hovered(rect) {
    return this._rect_contains(rect, this.hover.x, this.hover.y);
  }

  _rect_contains(rect, x, y) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  _lighten(hex, amount) {
    // Very simple: parse hex and add amount to each channel
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const to_hex = v => Math.min(255, v + amount).toString(16).padStart(2, "0");
    return `#${to_hex(r)}${to_hex(g)}${to_hex(b)}`;
  }
}
