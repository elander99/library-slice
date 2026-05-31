// 2D simulation engine — player movement, entity state, room transitions.

class Sim2D {
  constructor() {
    this._listeners = [];
    this.reactions  = [];
    this._tick_id   = null;
    this._init();
  }

  _init() {
    const saved = this._load_save();
    const room_id = (saved.room && ROOM_MAP_DATA[saved.room]) ? saved.room : 'library';
    const room_def = ROOM_MAP_DATA[room_id];
    // Discard saved position if it's outside the room bounds (e.g. from a stale save).
    const px_ok = saved.px > 0 && saved.px < room_def.cols * TS;
    const py_ok = saved.py > 0 && saved.py < room_def.rows * TS;
    this.state = {
      room:        room_id,
      px:          (px_ok && py_ok) ? saved.px : 10 * TS,
      py:          (px_ok && py_ok) ? saved.py : 7  * TS,
      facing:      'down',
      moving:      false,

      juujitsukan: 100,
      session_active:  false,
      session_ended:   false,
      current_activity: null,
      violation_flags:  {},

      laptop:   { on:false, battery:80, plugged_in:false, task:null },
      outlet:   { in_use:false },
      textbook: { in_hand:false, progress:0 },
      phone:    { on_call:false, lookup_cooldown:0 },
      snack:    { eaten:false },
      librarian:{ mood:'neutral', alert:null },

      goals: {
        study: { label:'Read the textbook', complete:false, progress:0 },
        notes: { label:'Take notes on laptop', complete:false, progress:0 },
      },

      transition: null,  // { alpha, from_room, to_room, to_px, to_py }
    };
    // If saved position lands on a solid tile, reset to the room's default spawn.
    if (!this.can_move_to(this.state.px, this.state.py)) {
      this.state.px = 10 * TS;
      this.state.py = 7  * TS;
    }
  }

  reset_position() {
    this.state.px = 10 * TS;
    this.state.py = 7  * TS;
    this._walk_target = null;
    this._save();
    this._notify();
  }

  _load_save() {
    try { return JSON.parse(localStorage.getItem('lib2d-v1') || '{}'); } catch { return {}; }
  }
  _save() {
    try {
      localStorage.setItem('lib2d-v1', JSON.stringify({
        room: this.state.room, px: Math.round(this.state.px), py: Math.round(this.state.py),
      }));
    } catch {}
  }

  start() {
    this.state.session_active = true;
    this._tick_id = setInterval(() => this._tick(), 1000);
    this._notify();
  }

  restart() {
    clearInterval(this._tick_id);
    this._init();
    this.reactions = [];
    this.start();
  }

  // ── Collision ────────────────────────────────────────────────────────────

  // Player bounding box: 14px wide, 10px tall, anchored at feet center.
  _box(px, py) {
    return { x: px - 7, y: py - 10, w: 14, h: 10 };
  }

  is_solid_at(px, py) {
    const room = ROOM_MAP_DATA[this.state.room];
    if (!room) return true;
    const col = Math.floor(px / TS);
    const row = Math.floor(py / TS);
    if (col < 0 || row < 0 || col >= room.cols || row >= room.rows) return true;
    const code = room.tiles[row][col];
    if (code === '') return false;
    const tile = TILES[code];
    return tile ? tile.solid : false;
  }

  can_move_to(px, py) {
    const b = this._box(px, py);
    // Test all four corners of the bounding box
    return (
      !this.is_solid_at(b.x,         b.y        ) &&
      !this.is_solid_at(b.x + b.w,   b.y        ) &&
      !this.is_solid_at(b.x,         b.y + b.h  ) &&
      !this.is_solid_at(b.x + b.w,   b.y + b.h  )
    );
  }

  // ── Movement ─────────────────────────────────────────────────────────────

  move(dx, dy) {
    if (!this.state.session_active || this.state.transition) return;
    const s = this.state;
    const nx = s.px + dx;
    const ny = s.py + dy;

    const room = ROOM_MAP_DATA[s.room];

    // Check exit transitions
    if (room) {
      for (const exit of room.exits) {
        const col = Math.floor(nx / TS);
        const row = Math.floor(ny / TS);
        const matches_row = exit.my_rows.includes(row);
        if (exit.dir === 'left'  && col <= 0         && matches_row) { this._begin_transition(exit); return; }
        if (exit.dir === 'right' && col >= room.cols-1 && matches_row) { this._begin_transition(exit); return; }
      }
    }

    // Try full move, then axis-separated fallbacks
    if (this.can_move_to(nx, ny)) {
      s.px = nx; s.py = ny;
    } else if (this.can_move_to(nx, s.py)) {
      s.px = nx;
    } else if (this.can_move_to(s.px, ny)) {
      s.py = ny;
    }

    // Update facing
    if      (dx > 0) s.facing = 'right';
    else if (dx < 0) s.facing = 'left';
    else if (dy > 0) s.facing = 'down';
    else if (dy < 0) s.facing = 'up';

    this._save();
    this._notify();
  }

  _begin_transition(exit) {
    const s = this.state;
    const dest = ROOM_MAP_DATA[exit.room];
    if (!dest) return;
    const enter_y = 7 * TS;
    const raw_px  = exit.enter_col * TS + TS/2;
    // Clamp so the player can never land outside the destination room.
    const to_px   = Math.max(TS, Math.min(raw_px, (dest.cols - 1) * TS));
    s.transition = { alpha:0, to_room: exit.room, to_px, to_py: enter_y };
    this._notify();
  }

  advance_transition(dt) {
    const s = this.state;
    if (!s.transition) return false;
    s.transition.alpha += dt * 3;
    if (s.transition.alpha >= 1) {
      s.room = s.transition.to_room;
      s.px   = s.transition.to_px;
      s.py   = s.transition.to_py;
      s.transition = null;
      this._save();
      this._notify();
      return true; // room changed
    }
    return false;
  }

  // ── Click-to-move target ─────────────────────────────────────────────────

  set_walk_target(wx, wy) {
    this._walk_target = { x: wx, y: wy };
  }
  clear_walk_target() { this._walk_target = null; }

  tick_walk(dt) {
    if (!this._walk_target) return;
    const s = this.state;
    const dx = this._walk_target.x - s.px;
    const dy = this._walk_target.y - s.py;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 3) { this._walk_target = null; return; }
    const speed = 90 * dt;
    const mx = (dx/dist) * Math.min(speed, dist);
    const my = (dy/dist) * Math.min(speed, dist);
    this.move(mx, my);
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  perform(action, params) {
    const s = this.state;
    params = params || {};
    switch (action) {
      case 'turn_on_laptop':    if (!s.laptop.on && s.laptop.battery>0) s.laptop.on=true; break;
      case 'turn_off_laptop':   s.laptop.on=false; s.laptop.task=null; if(s.current_activity==='using_laptop') s.current_activity=null; break;
      case 'plug_in_laptop':    if(!s.outlet.in_use){s.laptop.plugged_in=true; s.outlet.in_use=true;} break;
      case 'unplug_laptop':     s.laptop.plugged_in=false; s.outlet.in_use=false; s.violation_flags.outlet=false; if(s.librarian.mood==='annoyed'&&!s.phone.on_call) s.librarian.mood='neutral'; break;
      case 'set_task_library':  if(s.laptop.on){s.laptop.task='library'; s.current_activity='using_laptop'; s.violation_flags.outlet=false; if(!s.phone.on_call) s.librarian.mood='neutral';} break;
      case 'set_task_personal': if(s.laptop.on){s.laptop.task='personal'; s.current_activity='using_laptop';} break;
      case 'pick_up_textbook':  s.textbook.in_hand=true; break;
      case 'put_down_textbook': s.textbook.in_hand=false; if(s.current_activity==='reading') s.current_activity=null; break;
      case 'start_reading':     if(s.textbook.in_hand) s.current_activity='reading'; break;
      case 'stop_reading':      if(s.current_activity==='reading') s.current_activity=null; break;
      case 'make_call':
        if(!s.phone.on_call){s.phone.on_call=true; s.juujitsukan=Math.max(0,s.juujitsukan-10); s.librarian.mood='annoyed'; s.librarian.alert={key:'phone_notice',timer:8}; this._push_reaction('violation','no_phone_calls');}
        break;
      case 'end_call':          s.phone.on_call=false; if(!s.violation_flags.outlet) s.librarian.mood='neutral'; break;
      case 'eat_snack':
        if(!s.snack.eaten){s.snack.eaten=true; s.juujitsukan=Math.max(0,s.juujitsukan-10); s.librarian.mood='annoyed'; s.librarian.alert={key:'food_notice',timer:8}; this._push_reaction('violation','no_food_drink');}
        break;
      case 'talk_to_librarian': if(!s.librarian.alert) s.librarian.alert={key:'librarian_greeting',timer:5}; break;
      case 'use_phone_lookup':  if(s.phone.lookup_cooldown<=0) s.phone.lookup_cooldown=60; break;
    }
    this._notify();
  }

  get_actions(obj_id) {
    const s = this.state;
    const a = [];
    switch (obj_id) {
      case 'laptop':
        if (!s.laptop.on) { if(s.laptop.battery>0) a.push({action:'turn_on_laptop',label_key:'turn_on_laptop'}); }
        else {
          if(!s.laptop.plugged_in) a.push({action:'plug_in_laptop',label_key:'plug_in_laptop'});
          if(s.laptop.plugged_in)  a.push({action:'unplug_laptop',label_key:'unplug_laptop'});
          if(s.laptop.task!=='library')  a.push({action:'set_task_library',label_key:'set_task_library'});
          if(s.laptop.task!=='personal') a.push({action:'set_task_personal',label_key:'set_task_personal'});
          a.push({action:'turn_off_laptop',label_key:'turn_off_laptop'});
        }
        break;
      case 'textbook':
        if(!s.textbook.in_hand) a.push({action:'pick_up_textbook',label_key:'pick_up_textbook'});
        else {
          if(s.current_activity!=='reading') a.push({action:'start_reading',label_key:'start_reading'});
          if(s.current_activity==='reading') a.push({action:'stop_reading',label_key:'stop_reading'});
          a.push({action:'put_down_textbook',label_key:'put_down_textbook'});
        }
        break;
      case 'phone':
        a.push(s.phone.on_call ? {action:'end_call',label_key:'end_call'} : {action:'make_call',label_key:'make_call'});
        break;
      case 'snack':
        if(!s.snack.eaten) a.push({action:'eat_snack',label_key:'eat_snack'});
        break;
    }
    return a;
  }

  // ── Tick ─────────────────────────────────────────────────────────────────

  _tick() {
    const s = this.state;
    if (!s.session_active) return;

    if (s.current_activity==='reading' && s.textbook.in_hand) {
      s.textbook.progress = Math.min(100, s.textbook.progress+1.4);
      s.goals.study.progress = s.textbook.progress;
      if (s.textbook.progress>=100 && !s.goals.study.complete) {
        s.goals.study.complete=true; s.juujitsukan=Math.min(100,s.juujitsukan+20);
        this._push_reaction('goal','goal_complete');
      }
    }
    if (s.current_activity==='using_laptop' && s.laptop.task==='library' && s.laptop.battery>20) {
      s.goals.notes.progress = Math.min(100, s.goals.notes.progress+1.8);
      if (s.goals.notes.progress>=100 && !s.goals.notes.complete) {
        s.goals.notes.complete=true; s.juujitsukan=Math.min(100,s.juujitsukan+15);
        this._push_reaction('goal','notes_complete');
      }
    }
    if (s.laptop.on) {
      if (s.laptop.plugged_in) { s.laptop.battery=Math.min(100,s.laptop.battery+0.8); }
      else {
        s.laptop.battery=Math.max(0,s.laptop.battery-0.4);
        if (s.laptop.battery<=0) { s.laptop.on=false; s.laptop.task=null; if(s.current_activity==='using_laptop') s.current_activity=null; this._push_reaction('info','laptop_dead'); }
      }
    }
    if (s.laptop.plugged_in && s.laptop.task==='personal') {
      s.juujitsukan=Math.max(0,s.juujitsukan-0.35);
      if (!s.violation_flags.outlet) { s.violation_flags.outlet=true; s.librarian.mood='annoyed'; s.librarian.alert={key:'outlet_notice',timer:7}; this._push_reaction('violation','outlet_requires_library_task'); }
    } else if (s.violation_flags.outlet) { s.violation_flags.outlet=false; if(!s.phone.on_call) s.librarian.mood='neutral'; }
    if (s.phone.on_call) s.juujitsukan=Math.max(0,s.juujitsukan-0.5);
    if (s.phone.lookup_cooldown>0) s.phone.lookup_cooldown--;
    if (s.librarian.alert) { s.librarian.alert.timer--; if(s.librarian.alert.timer<=0) s.librarian.alert=null; }
    this._notify();
  }

  _push_reaction(type, key) { this.reactions.push({type,key,id:Date.now()+Math.random()}); }
  on_change(cb) { this._listeners.push(cb); }
  _notify() { this._listeners.forEach(cb => cb(this.state)); }
}
