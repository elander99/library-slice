// ENGINE: Simulation
// All game rules, resource math, and state transitions live here.
// No DOM references. No rendering. No strings (use DIALOGUE keys, not text).
// This file is the MonoGame port target — keep it pure logic.

class Sim {
  constructor() {
    this._init_state();
    this.reactions = [];   // consumed by renderer each frame
    this._tick_id = null;
    this._listeners = [];
  }

  _init_state() {
    const def = (key) => Object.assign({}, ENTITY_DEFS[key].initial);
    this.state = {
      juujitsukan: 100,
      session_active: false,
      session_ended: false,

      laptop:    def("laptop"),
      outlet:    def("outlet"),
      textbook:  def("textbook"),
      phone:     def("phone"),
      snack:     def("snack"),
      librarian: def("librarian"),

      current_activity: null,
      violation_flags: {},

      goals: {
        study: { label: "Read the textbook", complete: false, progress: 0 },
        notes: { label: "Take notes on laptop", complete: false, progress: 0 }
      },

      current_room: "library",
      player: { x: 300, target_x: 300, facing: 1, walk_phase: 0 },
      transition: null,  // { to_room, enter_x, alpha, switched }
    };

    // Restore saved world position
    try {
      const saved = JSON.parse(localStorage.getItem("library-slice-world-v1") || "{}");
      if (saved.room && ROOM_DEFS[saved.room]) {
        this.state.current_room   = saved.room;
        this.state.player.x       = saved.x || 300;
        this.state.player.target_x = saved.x || 300;
      }
    } catch {}
  }

  _save_world() {
    try {
      localStorage.setItem("library-slice-world-v1", JSON.stringify({
        room: this.state.current_room,
        x:    Math.round(this.state.player.x),
      }));
    } catch {}
  }

  // --- Lifecycle ---

  start() {
    this.state.session_active = true;
    this._tick_id = setInterval(() => this._tick(), 1000);
    this._notify();
  }

  restart() {
    clearInterval(this._tick_id);
    this._init_state();
    this.reactions = [];
    this.start();
  }

  // --- Frame update (called every rAF for smooth player movement) ---

  update_frame(dt, room_width) {
    const s = this.state;
    if (!s.session_active) return;

    if (s.transition) {
      if (!s.transition.switched) {
        s.transition.alpha += dt * 4;
        if (s.transition.alpha >= 1) {
          s.transition.alpha    = 1;
          s.current_room        = s.transition.to_room;
          s.player.x            = s.transition.enter_x;
          s.player.target_x     = s.transition.enter_x;
          s.transition.switched = true;
          this._save_world();
        }
      } else {
        s.transition.alpha -= dt * 4;
        if (s.transition.alpha <= 0) s.transition = null;
      }
      return;
    }

    const p = s.player;
    p.target_x = Math.max(30, Math.min(p.target_x, room_width - 30));
    const dx = p.target_x - p.x;
    if (Math.abs(dx) > 2) {
      p.facing = dx > 0 ? 1 : -1;
      const speed = room_width * 0.35;
      const step  = Math.sign(dx) * speed * dt;
      p.x = Math.abs(step) >= Math.abs(dx) ? p.target_x : p.x + step;
      p.walk_phase += dt * 10;
    } else {
      p.x = p.target_x;
    }

    const room = ROOM_DEFS[s.current_room];
    if (room) {
      if (room.left  && p.x <= 35)               s.transition = { to_room: room.left,  enter_x: room_width - 80, alpha: 0, switched: false };
      if (room.right && p.x >= room_width - 35)  s.transition = { to_room: room.right, enter_x: 80,              alpha: 0, switched: false };
    }
  }

  // --- Tick ---

  _tick() {
    const s = this.state;
    if (!s.session_active) return;

    // Reading progress
    if (s.current_activity === "reading" && s.textbook.in_hand) {
      s.textbook.progress = Math.min(100, s.textbook.progress + 1.4);
      s.goals.study.progress = s.textbook.progress;
      if (s.textbook.progress >= 100 && !s.goals.study.complete) {
        s.goals.study.complete = true;
        s.juujitsukan = Math.min(100, s.juujitsukan + 20);
        this._push_reaction("goal", "goal_complete");
      }
    }

    // Notes progress — requires laptop on, task = library, battery > 20
    if (s.current_activity === "using_laptop" && s.laptop.task === "library" && s.laptop.battery > 20) {
      s.goals.notes.progress = Math.min(100, s.goals.notes.progress + 1.8);
      if (s.goals.notes.progress >= 100 && !s.goals.notes.complete) {
        s.goals.notes.complete = true;
        s.juujitsukan = Math.min(100, s.juujitsukan + 15);
        this._push_reaction("goal", "notes_complete");
      }
    }

    // Battery
    if (s.laptop.on) {
      if (s.laptop.plugged_in) {
        s.laptop.battery = Math.min(100, s.laptop.battery + 0.8);
      } else {
        s.laptop.battery = Math.max(0, s.laptop.battery - 0.4);
        if (s.laptop.battery <= 0) {
          s.laptop.on = false;
          s.laptop.task = null;
          if (s.current_activity === "using_laptop") s.current_activity = null;
          this._push_reaction("info", "laptop_dead");
        }
      }
    }

    // RULE: outlet_requires_library_task
    // Outlet use for personal task drains 充実感 continuously
    const outlet_violation = s.laptop.plugged_in && s.laptop.task === "personal";
    if (outlet_violation) {
      s.juujitsukan = Math.max(0, s.juujitsukan - 0.35);
      if (!s.violation_flags.outlet) {
        s.violation_flags.outlet = true;
        s.librarian.mood = "annoyed";
        s.librarian.alert = { key: "outlet_notice", timer: 7 };
        this._push_reaction("violation", "outlet_requires_library_task");
      }
    } else {
      if (s.violation_flags.outlet) {
        s.violation_flags.outlet = false;
        s.librarian.mood = "neutral";
      }
    }

    // RULE: no_phone_calls — ongoing drain while on call
    if (s.phone.on_call) {
      s.juujitsukan = Math.max(0, s.juujitsukan - 0.5);
    }

    // Phone lookup cooldown
    if (s.phone.lookup_cooldown > 0) s.phone.lookup_cooldown--;

    // Librarian alert countdown
    if (s.librarian.alert) {
      s.librarian.alert.timer--;
      if (s.librarian.alert.timer <= 0) s.librarian.alert = null;
    }

    this._save_world();
    this._notify();
  }

  // --- Actions ---
  // All player-initiated state changes go through here.

  perform(action, params) {
    const s = this.state;
    params = params || {};

    switch (action) {

      case "turn_on_laptop":
        if (!s.laptop.on && s.laptop.battery > 0) s.laptop.on = true;
        break;

      case "turn_off_laptop":
        s.laptop.on = false;
        s.laptop.task = null;
        if (s.current_activity === "using_laptop") s.current_activity = null;
        break;

      case "plug_in_laptop":
        if (!s.outlet.in_use) {
          s.laptop.plugged_in = true;
          s.outlet.in_use = true;
        }
        break;

      case "unplug_laptop":
        s.laptop.plugged_in = false;
        s.outlet.in_use = false;
        s.violation_flags.outlet = false;
        if (s.librarian.mood === "annoyed" && !s.phone.on_call) s.librarian.mood = "neutral";
        break;

      case "set_task_library":
        if (s.laptop.on) {
          s.laptop.task = "library";
          s.current_activity = "using_laptop";
          s.violation_flags.outlet = false;
          if (!s.phone.on_call) s.librarian.mood = "neutral";
        }
        break;

      case "set_task_personal":
        if (s.laptop.on) {
          s.laptop.task = "personal";
          s.current_activity = "using_laptop";
        }
        break;

      case "pick_up_textbook":
        s.textbook.in_hand = true;
        break;

      case "put_down_textbook":
        s.textbook.in_hand = false;
        if (s.current_activity === "reading") s.current_activity = null;
        break;

      case "start_reading":
        if (s.textbook.in_hand) s.current_activity = "reading";
        break;

      case "stop_reading":
        if (s.current_activity === "reading") s.current_activity = null;
        break;

      case "make_call":
        if (!s.phone.on_call) {
          s.phone.on_call = true;
          s.juujitsukan = Math.max(0, s.juujitsukan - 10);
          s.librarian.mood = "annoyed";
          s.librarian.alert = { key: "phone_notice", timer: 8 };
          this._push_reaction("violation", "no_phone_calls");
        }
        break;

      case "end_call":
        s.phone.on_call = false;
        if (!s.violation_flags.outlet) s.librarian.mood = "neutral";
        break;

      case "eat_snack":
        if (!s.snack.eaten) {
          s.snack.eaten = true;
          s.juujitsukan = Math.max(0, s.juujitsukan - 10);
          s.librarian.mood = "annoyed";
          s.librarian.alert = { key: "food_notice", timer: 8 };
          this._push_reaction("violation", "no_food_drink");
        }
        break;

      case "talk_to_librarian":
        if (!s.librarian.alert) {
          s.librarian.alert = { key: "librarian_greeting", timer: 5 };
        }
        break;

      case "use_phone_lookup":
        if (s.phone.lookup_cooldown <= 0) s.phone.lookup_cooldown = 60;
        break;

      case "set_player_target":
        s.player.target_x = params.x;
        break;
    }

    this._notify();
  }

  // --- Internal ---

  _push_reaction(type, key) {
    this.reactions.push({ type, key, id: Date.now() + Math.random() });
  }

  _end_session() {
    this.state.session_active = false;
    this.state.session_ended = true;
    clearInterval(this._tick_id);
    this._notify();
  }

  on_change(cb) { this._listeners.push(cb); }
  _notify() { this._listeners.forEach(cb => cb(this.state)); }

  // Helper: get available actions for a given object, based on current state.
  // Used by input/render to build the action menu. Keeps UI logic near engine logic.
  get_actions(object_id) {
    const s = this.state;
    const actions = [];

    switch (object_id) {
      case "laptop":
        if (!s.laptop.on) {
          if (s.laptop.battery > 0) actions.push({ action: "turn_on_laptop", label_key: "turn_on_laptop" });
        } else {
          if (!s.laptop.plugged_in) actions.push({ action: "plug_in_laptop", label_key: "plug_in_laptop" });
          if (s.laptop.plugged_in)  actions.push({ action: "unplug_laptop",   label_key: "unplug_laptop" });
          if (s.laptop.task !== "library") actions.push({ action: "set_task_library",  label_key: "set_task_library" });
          if (s.laptop.task !== "personal") actions.push({ action: "set_task_personal", label_key: "set_task_personal" });
          actions.push({ action: "turn_off_laptop", label_key: "turn_off_laptop" });
        }
        break;

      case "textbook":
        if (!s.textbook.in_hand) {
          actions.push({ action: "pick_up_textbook", label_key: "pick_up_textbook" });
        } else {
          if (s.current_activity !== "reading") actions.push({ action: "start_reading", label_key: "start_reading" });
          if (s.current_activity === "reading")  actions.push({ action: "stop_reading",  label_key: "stop_reading" });
          actions.push({ action: "put_down_textbook", label_key: "put_down_textbook" });
        }
        break;

      case "phone":
        if (!s.phone.on_call) actions.push({ action: "make_call", label_key: "make_call" });
        else                   actions.push({ action: "end_call",  label_key: "end_call" });
        break;

      case "snack":
        if (!s.snack.eaten) actions.push({ action: "eat_snack", label_key: "eat_snack" });
        break;

      case "librarian":
        actions.push({ action: "talk_to_librarian", label_key: "talk_to_librarian" });
        break;

      case "outlet":
        // Outlet itself has no direct actions — interact via laptop
        break;
    }

    return actions;
  }
}
