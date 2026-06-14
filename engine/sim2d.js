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
      npc_states: {},        // keyed by npc_id — dynamic position/goal state for roaming NPCs
      extra_npcs: [],        // scheduled NPC instance objects active in the current room
      absent_room_npcs: new Set(), // room.npcs entries hidden due to hour_start/hour_end
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
      phone:    { on_call:false, charges:5, recharge_timer:0 },
      snack:    { eaten:false },
      bed:      { sleeping:false },
      librarian:{ mood:'neutral', alert:null },

      goals: {
        study: { label:'Read the textbook', complete:false, progress:0 },
        notes: { label:'Take notes on laptop', complete:false, progress:0 },
      },

      transition: null,  // { alpha, from_room, to_room, to_px, to_py }

      game_time: (() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), hour: 9, minute: 0 };
      })(),
      closing_warned: {},  // keys: `${room_id}_${year}-${month}-${day}` → 'soon'|'now'
      room_alert: null,    // { npc_id, key, timer } — shown as NPC speech bubble
      convo_bubble: null,  // { convo_id, turn_idx, npc_id, text_ko, text_en } — ambient conversation
    };
    if (saved.game_time) this.state.game_time = saved.game_time;
    if (saved.closing_warned) this.state.closing_warned = saved.closing_warned;
    // If saved position lands on a solid tile, reset to the room's default spawn.
    if (!this.can_move_to(this.state.px, this.state.py)) {
      this.state.px = 10 * TS;
      this.state.py = 7  * TS;
      this._nudge_out_of_solid(); // handles rooms where the default spawn is also blocked
    }
    this._init_npc_states(room_id);
  }

  _init_npc_states(room_id) {
    const s = this.state;
    s.npc_states = {};
    s.extra_npcs = [];
    s.absent_room_npcs = new Set();
    const room = ROOM_MAP_DATA[room_id];
    if (room?.npcs) {
      for (const n of room.npcs) {
        if (!n.goals?.length) continue;
        if (n.hour_start !== undefined) {
          const t = s.game_time.hour + s.game_time.minute / 60;
          if (t < n.hour_start || t >= n.hour_end) { s.absent_room_npcs.add(n.npc_id); continue; }
        }
        const gi = n.start_goal || 0;
        const g0 = n.goals[gi];
        s.npc_states[n.npc_id] = {
          px: g0.col * TS + TS / 2,
          py: g0.row * TS + TS,
          goal_idx: gi,
          pause_timer: (g0.pause_ms || 0) / 1000,
          activity: g0.activity || null,
          say_ko: g0.say_ko || null,
          say_en: g0.say_en || null,
          zipline_t: 0,
          facing_left: false,
        };
      }
    }
    for (const n of this._scheduled_npcs_for_room(room_id)) {
      if (!n.goals?.length || s.npc_states[n.npc_id]) continue;
      s.extra_npcs.push(n);
      const g0 = n.goals[0];
      s.npc_states[n.npc_id] = {
        px: (n.col ?? g0.col) * TS + TS / 2,
        py: (n.row ?? g0.row) * TS + TS,
        goal_idx: 0,
        pause_timer: (g0.pause_ms || 0) / 1000,
        activity: g0.activity || null,
        say_ko: g0.say_ko || null,
        say_en: g0.say_en || null,
        zipline_t: 0,
        facing_left: false,
      };
    }
  }

  _scheduled_npcs_for_room(room_id) {
    if (typeof NPC_SCHEDULES === 'undefined') return [];
    const gt = this.state.game_time;
    const dow = new Date(gt.year, gt.month - 1, gt.day).getDay();
    const t = gt.hour + gt.minute / 60;
    const result = [];
    for (const [npc_id, blocks] of Object.entries(NPC_SCHEDULES)) {
      const block = blocks.find(b => {
        if (b.room !== room_id || !b.days.includes(dow)) return false;
        // Overnight block (e.g. hour_start:21, hour_end:9) wraps through midnight
        return b.hour_start > b.hour_end
          ? (t >= b.hour_start || t < b.hour_end)
          : (t >= b.hour_start && t < b.hour_end);
      });
      if (block) result.push({ ...block, npc_id });
    }
    return result;
  }

  _check_scheduled_npcs() {
    const s = this.state;
    const current = this._scheduled_npcs_for_room(s.room);
    const current_ids = new Set(current.map(n => n.npc_id));
    const extra_ids   = new Set(s.extra_npcs.map(n => n.npc_id));

    // Remove NPCs whose schedule block ended
    s.extra_npcs = s.extra_npcs.filter(n => {
      if (!current_ids.has(n.npc_id)) { delete s.npc_states[n.npc_id]; return false; }
      return true;
    });

    // Add NPCs whose schedule block just started
    for (const n of current) {
      if (extra_ids.has(n.npc_id)) continue;
      const existing = s.npc_states[n.npc_id];
      s.extra_npcs.push(n);
      const g0 = n.goals[0];
      s.npc_states[n.npc_id] = {
        px: existing?.px ?? (n.col ?? g0.col) * TS + TS / 2,
        py: existing?.py ?? (n.row ?? g0.row) * TS + TS,
        goal_idx: 0,
        pause_timer: (g0.pause_ms || 0) / 1000,
        activity: g0.activity || null,
        say_ko: g0.say_ko || null,
        say_en: g0.say_en || null,
        zipline_t: 0,
        facing_left: false,
      };
    }

    // Show/hide time-gated room.npcs entries
    const room = ROOM_MAP_DATA[s.room];
    if (room?.npcs) {
      const t = s.game_time.hour + s.game_time.minute / 60;
      for (const n of room.npcs) {
        if (n.hour_start === undefined || !n.goals?.length) continue;
        const active = t >= n.hour_start && t < n.hour_end;
        if (active && s.absent_room_npcs.has(n.npc_id)) {
          s.absent_room_npcs.delete(n.npc_id);
          const g0 = n.goals[0];
          s.npc_states[n.npc_id] = {
            px: g0.col * TS + TS / 2,
            py: g0.row * TS + TS,
            goal_idx: 0,
            pause_timer: (g0.pause_ms || 0) / 1000,
            activity: g0.activity || null,
            say_ko: g0.say_ko || null,
            say_en: g0.say_en || null,
            zipline_t: 0,
            facing_left: false,
          };
        } else if (!active && !s.absent_room_npcs.has(n.npc_id)) {
          s.absent_room_npcs.add(n.npc_id);
          if (!s.extra_npcs.some(e => e.npc_id === n.npc_id)) {
            delete s.npc_states[n.npc_id];
          }
        }
      }
    }
  }

  // Called every frame from the render loop — smooth NPC movement.
  tick_npcs(dt) {
    const s = this.state;
    if (!s.session_active || s.transition) return;
    const room = ROOM_MAP_DATA[s.room];

    const SPEED  = 45; // px/s walking speed
    const RIDE_S = 6;  // seconds for zipline ride

    const all_npcs = [...(room?.npcs || []), ...(s.extra_npcs || [])];
    for (const n of all_npcs) {
      if (!n.goals?.length) continue;
      const st = s.npc_states?.[n.npc_id];
      if (!st) continue;

      // ── Zipline ride phase ─────────────────────────────────────────────────
      if (st.activity === 'zipline_ride') {
        st.zipline_t += dt / RIDE_S;
        if (st.zipline_t >= 1) {
          st.zipline_t = 0;
          st.activity  = null;
          const zip = room.objects?.find(o => o.id === 'zipline');
          if (zip) { st.px = zip.end_col * TS + TS / 2; st.py = zip.end_row * TS + TS; }
          st.goal_idx   = (st.goal_idx + 1) % n.goals.length;
          const gnext   = n.goals[st.goal_idx];
          st.activity   = gnext.activity || null;
          st.say_ko     = gnext.say_ko || null;
          st.say_en     = gnext.say_en || null;
          st.pause_timer = (gnext.pause_ms || 0) / 1000;
        }
        continue;
      }

      // ── Pause at waypoint ──────────────────────────────────────────────────
      if (st.pause_timer > 0) {
        st.pause_timer -= dt;
        if (st.pause_timer <= 0) {
          st.pause_timer = 0;
          st.goal_idx    = (st.goal_idx + 1) % n.goals.length;
          const gnext    = n.goals[st.goal_idx];
          st.activity    = gnext.activity || null;
          st.say_ko      = gnext.say_ko || null;
          st.say_en      = gnext.say_en || null;
          if (gnext.activity === 'zipline_ride') st.zipline_t = 0;
        }
        continue;
      }

      // ── Walk toward current goal ───────────────────────────────────────────
      const goal = n.goals[st.goal_idx];
      const tx   = goal.col * TS + TS / 2;
      const ty   = goal.row * TS + TS;
      const ddx  = tx - st.px;
      const ddy  = ty - st.py;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);

      if (dist < 2) {
        st.px = tx; st.py = ty;
        if (goal.activity === 'zipline_ride') {
          st.activity   = 'zipline_ride';
          st.zipline_t  = 0;
        } else {
          st.pause_timer = (goal.pause_ms || 0) / 1000;
          st.say_ko      = goal.say_ko || null;
          st.say_en      = goal.say_en || null;
          if (st.pause_timer <= 0) {
            st.goal_idx  = (st.goal_idx + 1) % n.goals.length;
            const gnext  = n.goals[st.goal_idx];
            st.activity  = gnext.activity || null;
            st.say_ko    = gnext.say_ko || null;
            st.say_en    = gnext.say_en || null;
            if (gnext.activity === 'zipline_ride') st.zipline_t = 0;
          }
        }
      } else {
        const step = Math.min(SPEED * dt, dist);
        st.px += (ddx / dist) * step;
        st.py += (ddy / dist) * step;
        if (ddx < -1) st.facing_left = true;
        else if (ddx > 1) st.facing_left = false;
      }
    }
  }

  reset_position() {
    this.state.px = 10 * TS;
    this.state.py = 7  * TS;
    this._nudge_out_of_solid();
    this._walk_target = null;
    this._save();
    this._notify();
  }

  _nudge_out_of_solid() {
    const s = this.state;
    if (this.can_move_to(s.px, s.py)) return;
    const room = ROOM_MAP_DATA[s.room];
    const mid_x = room ? room.cols * TS / 2 : 30 * TS;
    const mid_y = room ? room.rows * TS / 2 : 13 * TS;
    const dir_x = s.px < mid_x ? 1 : -1;
    const dir_y = s.py < mid_y ? 1 : -1;
    let found = false;
    for (let d = TS / 4; d <= 10 * TS && !found; d += TS / 4) {
      if (this.can_move_to(s.px + d * dir_x, s.py)) { s.px += d * dir_x; found = true; }
      else if (this.can_move_to(s.px - d * dir_x, s.py)) { s.px -= d * dir_x; found = true; }
    }
    if (!found) {
      for (let d = TS / 4; d <= 10 * TS; d += TS / 4) {
        if (this.can_move_to(s.px, s.py + d * dir_y)) { s.py += d * dir_y; break; }
      }
    }
  }

  _load_save() {
    try { return JSON.parse(localStorage.getItem('lib2d-v1') || '{}'); } catch { return {}; }
  }
  _save() {
    try {
      localStorage.setItem('lib2d-v1', JSON.stringify({
        room: this.state.room, px: Math.round(this.state.px), py: Math.round(this.state.py),
        game_time: this.state.game_time,
        closing_warned: this.state.closing_warned,
      }));
    } catch {}
  }

  // ── Time helpers ─────────────────────────────────────────────────────────

  _room_is_open(room) {
    if (!room || (!room.opens && !room.closes && !room.days)) return true;
    const gt = this.state.game_time;
    if (room.days) {
      const dow = new Date(gt.year, gt.month-1, gt.day).getDay();
      if (!room.days.includes(dow)) return false;
    }
    const t = gt.hour + gt.minute / 60;
    if (room.opens && t < room.opens) return false;
    if (room.closes && t >= room.closes) return false;
    return true;
  }

  _check_room_hours() {
    const s = this.state;
    const gt = s.game_time;
    const room = ROOM_MAP_DATA[s.room];
    if (!room || !room.closes) return;

    const day_key = `${s.room}_${gt.year}-${gt.month}-${gt.day}`;

    // If room is closed today (wrong day of week), kick immediately
    if (room.days) {
      const dow = new Date(gt.year, gt.month-1, gt.day).getDay();
      if (!room.days.includes(dow) && s.closing_warned[day_key] !== 'now') {
        s.closing_warned[day_key] = 'now';
        if (room.host_npc) s.room_alert = { npc_id: room.host_npc, key: 'room_closed', timer: 4 };
        setTimeout(() => this.navigate_to_room(room.kick_to), 3000);
        return;
      }
    }

    const mins_until_close = (room.closes - gt.hour) * 60 - gt.minute;

    if (mins_until_close <= 0 && s.closing_warned[day_key] !== 'now') {
      s.closing_warned[day_key] = 'now';
      if (room.host_npc) s.room_alert = { npc_id: room.host_npc, key: 'closing_now', timer: 4 };
      setTimeout(() => this.navigate_to_room(room.kick_to), 3000);
    } else if (mins_until_close > 0 && mins_until_close <= 15 && !s.closing_warned[day_key]) {
      s.closing_warned[day_key] = 'soon';
      if (room.host_npc) s.room_alert = { npc_id: room.host_npc, key: 'closing_soon', timer: 12 };
    }
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
        if (exit.dir === 'left' || exit.dir === 'right') {
          const matches_row = exit.my_rows && exit.my_rows.includes(row);
          if (exit.dir === 'left'  && col <= 0          && matches_row) { this._begin_transition(exit); return; }
          if (exit.dir === 'right' && col >= room.cols-1 && matches_row) { this._begin_transition(exit); return; }
        } else {
          const matches_col = exit.my_cols && exit.my_cols.includes(col);
          if (exit.dir === 'up'   && row <= 0          && matches_col) { this._begin_transition(exit); return; }
          if (exit.dir === 'down' && row >= room.rows-1 && matches_col) { this._begin_transition(exit); return; }
        }
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
    if (!this._room_is_open(dest)) {
      this._notify();
      return;
    }
    let to_px, to_py;
    if (exit.dir === 'up' || exit.dir === 'down') {
      to_px = Math.max(TS, Math.min(s.px, (dest.cols - 1) * TS));
      const raw_py = exit.enter_row * TS + TS / 2;
      to_py = Math.max(TS, Math.min(raw_py, (dest.rows - 1) * TS));
    } else {
      const raw_px = exit.enter_col * TS + TS / 2;
      to_px = Math.max(TS, Math.min(raw_px, (dest.cols - 1) * TS));
      to_py = Math.max(TS, Math.min(s.py, (dest.rows - 1) * TS));
    }
    s.transition = { alpha:0, to_room: exit.room, to_px, to_py };
    this._notify();
  }

  navigate_to_room(room_id) {
    const dest = ROOM_MAP_DATA[room_id];
    if (!dest || this.state.transition) return;
    const s = this.state;
    s.transition = { alpha: 0, to_room: room_id, to_px: Math.round(dest.cols / 2) * TS, to_py: 7 * TS };
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
      // If spawn landed on a solid tile, nudge toward room center until walkable.
      if (!this.can_move_to(s.px, s.py)) {
        const room = ROOM_MAP_DATA[s.room];
        const mid_x = room ? (room.cols * TS / 2) : (30 * TS);
        const mid_y = room ? (room.rows * TS / 2) : (13 * TS);
        const dir_x = s.px < mid_x ? 1 : -1;
        const dir_y = s.py < mid_y ? 1 : -1;
        let found = false;
        for (let d = TS / 4; d <= 6 * TS; d += TS / 4) {
          if (this.can_move_to(s.px + d * dir_x, s.py)) { s.px += d * dir_x; found = true; break; }
        }
        if (!found) {
          for (let d = TS / 4; d <= 6 * TS; d += TS / 4) {
            if (this.can_move_to(s.px, s.py + d * dir_y)) { s.py += d * dir_y; break; }
          }
        }
      }
      s.transition = null;
      this._init_npc_states(s.room);
      this._save();
      this._notify();
      return true; // room changed
    }
    return false;
  }

  // Instantly teleport to a room+pixel position, nudging out of solid tiles.
  warp_to(room_id, px, py) {
    const s = this.state;
    s.room = room_id;
    s.px   = px;
    s.py   = py;
    s.transition = null;
    if (!this.can_move_to(s.px, s.py)) {
      const room = ROOM_MAP_DATA[room_id];
      const mid  = room ? (room.cols * TS / 2) : (30 * TS);
      // Try nudging horizontally toward room center.
      const dir  = s.px < mid ? 1 : -1;
      let found  = false;
      for (let d = TS / 4; d <= 6 * TS; d += TS / 4) {
        if (this.can_move_to(s.px + d * dir, s.py)) { s.px += d * dir; found = true; break; }
      }
      // If still stuck (whole row blocked), walk down row-by-row until walkable.
      if (!found) {
        for (let dy = TS / 4; dy <= 8 * TS; dy += TS / 4) {
          if (this.can_move_to(s.px, s.py + dy)) { s.py += dy; break; }
        }
      }
    }
    this._save();
    this._notify();
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
      case 'use_phone_lookup':  if(s.phone.charges>0) s.phone.charges--; break;
      case 'go_to_sleep':
        if(!s.bed.sleeping){
          s.bed.sleeping=true; s.current_activity='sleeping';
          // Advance time to the next 7:00 AM immediately
          const gt=s.game_time;
          if(gt.hour>=7){ gt.day++; const dim=new Date(gt.year,gt.month,0).getDate(); if(gt.day>dim){gt.day=1;gt.month++;} if(gt.month>12){gt.month=1;gt.year++;} }
          gt.hour=7; gt.minute=0;
          this._push_reaction('info','go_to_sleep');
        }
        break;
      case 'wake_up':
        if(s.bed.sleeping){
          s.bed.sleeping=false; s.current_activity=null; s.juujitsukan=Math.min(100,s.juujitsukan+25);
          this._push_reaction('info','wake_up');
        }
        break;
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
      case 'bed':
        if(!s.bed.sleeping) a.push({action:'go_to_sleep',label_key:'go_to_sleep'});
        else a.push({action:'wake_up',label_key:'wake_up'});
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
    if (s.phone.charges<5) { s.phone.recharge_timer++; if(s.phone.recharge_timer>=90){s.phone.charges++;s.phone.recharge_timer=0;} }
    if (s.librarian.alert) { s.librarian.alert.timer--; if(s.librarian.alert.timer<=0) s.librarian.alert=null; }
    if (s.room_alert)      { s.room_alert.timer--;      if(s.room_alert.timer<=0)      s.room_alert=null; }

    // Advance game clock (1 real second = 1 game minute)
    const gt = s.game_time;
    gt.minute++;
    if (gt.minute >= 60) { gt.minute = 0; gt.hour++; }
    if (gt.hour >= 24)   { gt.hour = 0; gt.day++;
      const days_in_month = new Date(gt.year, gt.month, 0).getDate();
      if (gt.day > days_in_month) { gt.day = 1; gt.month++; }
      if (gt.month > 12) { gt.month = 1; gt.year++; }
    }

    this._check_room_hours();
    this._check_scheduled_npcs();
    this._notify();
  }

  _push_reaction(type, key) { this.reactions.push({type,key,id:Date.now()+Math.random()}); }
  on_change(cb) { this._listeners.push(cb); }
  _notify() { this._listeners.forEach(cb => cb(this.state)); }
}
