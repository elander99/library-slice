// Room graph and sign lookup
const SIGN_BY_ID = {};
[...SIGNS, ...WORLD_SIGNS].forEach(s => { SIGN_BY_ID[s.id] = s; });

function get_room_signs(room_id) {
  const room = ROOM_DEFS[room_id];
  if (!room) return [];
  return room.sign_layout.map(sl => SIGN_BY_ID[sl.sign_id]).filter(Boolean);
}

const ROOM_DEFS = {
  lobby: {
    id: "lobby", name_jp: "ロビー", name_ko: "로비", name_en: "Lobby",
    left: null, right: "play_area",
    wall_color: "#ede8da", floor_color: "#9a6830", floor_dark: "#6a4010",
    sign_layout: [
      { sign_id: "lobby_directory", x: 60,  w: 220, h: 130 },
      { sign_id: "lobby_reception", x: 310, w: 180, h:  90 },
    ],
    object_hotspots: (W, FY, SY) => ({
      info_desk:       { x: W / 2 - 70,      y: FY - 50,  w: 140, h: 50  },
      exit_door:       { x: W - 90,           y: FY - 110, w: 60,  h: 110 },
      npc_receptionist:{ x: W / 2 + 10,       y: FY - 96,  w: 44,  h: 52  },
    }),
  },
  play_area: {
    id: "play_area", name_jp: "遊び場", name_ko: "놀이 공간", name_en: "Play Area",
    left: "lobby", right: "library",
    wall_color: "#fef5cc", floor_color: "#6a8c2a", floor_dark: "#4a6010",
    sign_layout: [
      { sign_id: "play_shoes",       x: 40,  w: 150, h:  90 },
      { sign_id: "play_supervision", x: 210, w: 200, h:  90 },
      { sign_id: "play_age",         x: 430, w: 160, h: 100 },
    ],
    object_hotspots: (W, FY, SY) => ({
      shoe_rack:     { x: W - 150,          y: FY - 70,  w: 120, h: 70  },
      play_gate:     { x: W / 2 - 40,       y: FY - 110, w: 80,  h: 110 },
      npc_play_staff:{ x: Math.round(W * 0.28) - 22, y: FY - 90, w: 44, h: 90 },
    }),
  },
  library: {
    id: "library", name_jp: "図書館", name_ko: "도서관", name_en: "Library",
    left: "play_area", right: "salon",
    wall_color: "#f0ebe0", floor_color: "#b07a3a", floor_dark: "#7a4f1e",
    sign_layout: [
      { sign_id: "outlet_rule", x: 36,  w: 192, h: 100 },
      { sign_id: "quiet_rule",  x: 242, w: 192, h: 100 },
      { sign_id: "food_rule",   x: 448, w: 130, h: 100 },
    ],
    // Library objects (incl. librarian hotspot) defined inline in renderer
  },
  salon: {
    id: "salon", name_jp: "こどもサロン", name_ko: "어린이 살롱", name_en: "Children's Salon",
    left: "library", right: "outdoor",
    wall_color: "#f0e8f5", floor_color: "#7a5090", floor_dark: "#4a2060",
    sign_layout: [
      { sign_id: "salon_share", x: 50,  w: 210, h:  90 },
      { sign_id: "salon_food",  x: 290, w: 200, h: 110 },
    ],
    object_hotspots: (W, FY, SY) => ({
      craft_table:    { x: W / 2 - 90,             y: FY - 50, w: 180, h: 50 },
      salon_seat:     { x: W - 130,                y: FY - 40, w: 90,  h: 40 },
      npc_salon_staff:{ x: Math.round(W * 0.22) - 22, y: FY - 90, w: 44, h: 90 },
    }),
  },
  outdoor: {
    id: "outdoor", name_jp: "屋外", name_ko: "야외", name_en: "Outdoor",
    left: "salon", right: null,
    wall_color: "#87ceeb", floor_color: "#5a8c3a", floor_dark: "#3a6020",
    outdoor: true,
    sign_layout: [
      { sign_id: "outdoor_zipline", x: 60,  w: 190, h: 120 },
      { sign_id: "outdoor_yield",   x: 280, w: 180, h: 100 },
    ],
    object_hotspots: (W, FY, SY) => ({
      outdoor_bench:   { x: Math.round(W * 0.6),      y: FY - 38,  w: 120, h: 38  },
      zipline_post:    { x: Math.round(W * 0.1) - 20, y: FY - 170, w: 40,  h: 170 },
      npc_outdoor_guide:{ x: Math.round(W * 0.5) - 22, y: FY - 90, w: 44, h: 90  },
    }),
  },
};
