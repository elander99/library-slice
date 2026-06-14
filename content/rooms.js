// Room graph and sign lookup
const SIGN_BY_ID = {};
[...SIGNS, ...WORLD_SIGNS].forEach(s => { SIGN_BY_ID[s.id] = s; });

function get_room_signs(room_id) {
  const room = ROOM_DEFS[room_id];
  if (!room) return [];
  return room.sign_layout.map(sl => SIGN_BY_ID[sl.sign_id]).filter(Boolean);
}

const ROOM_DEFS = {
  street: {
    id: "street", name_jp: "通り", name_ko: "거리", name_en: "Street",
    left: "house", right: "lobby",
    wall_color: "#87ceeb", floor_color: "#808080", floor_dark: "#505050",
    outdoor: true,
    sign_layout: [],
    object_hotspots: (W, FY, SY) => ({}),
  },
  lobby: {
    id: "lobby", name_jp: "ロビー", name_ko: "로비", name_en: "Lobby",
    left: "street", right: "play_area",
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
    left: "salon", right: "house",
    wall_color: "#87ceeb", floor_color: "#5a8c3a", floor_dark: "#3a6020",
    outdoor: true,
    sign_layout: [
      { sign_id: "outdoor_safety",  x: 470, w: 160, h:  80 },
      { sign_id: "outdoor_zipline", x: 60,  w: 190, h: 120 },
      { sign_id: "outdoor_yield",   x: 280, w: 180, h: 100 },
    ],
    object_hotspots: (W, FY, SY) => ({
      outdoor_bench:   { x: Math.round(W * 0.6),      y: FY - 38,  w: 120, h: 38  },
      zipline_post:    { x: Math.round(W * 0.1) - 20, y: FY - 170, w: 40,  h: 170 },
    }),
  },
  house: {
    id: "house", name_jp: "家", name_ko: "집", name_en: "Home",
    left: "outdoor", right: "street",
    wall_color: "#f5f0e8", floor_color: "#8B4A20", floor_dark: "#4b2d12",
    sign_layout: [
      { sign_id: "house_entrance", x: 60,  w: 180, h: 110 },
      { sign_id: "house_kotatsu",  x: 280, w: 200, h:  90 },
      { sign_id: "house_kitchen",  x: 490, w: 180, h: 100 },
    ],
    object_hotspots: (W, FY, SY) => ({
      npc_house_resident: { x: Math.round(W * 0.58) - 22, y: FY - 90, w: 44, h: 90 },
      house_window:       { x: Math.round(W * 0.15),       y: SY + 10,  w: 60, h: 50 },
    }),
  },
  house_a: {
    id: "house_a", name_jp: "子供の家", name_ko: "아이들의 집", name_en: "Family House",
    left: null, right: null, down: "street",
    wall_color: "#f5f0e8", floor_color: "#8B4A20", floor_dark: "#4b2d12",
    sign_layout: [],
    object_hotspots: (W, FY, SY) => ({}),
  },
  house_b: {
    id: "house_b", name_jp: "学生の家", name_ko: "학생의 집", name_en: "Student House",
    left: null, right: null, down: "street",
    wall_color: "#e8f0f5", floor_color: "#8B4A20", floor_dark: "#4b2d12",
    sign_layout: [],
    object_hotspots: (W, FY, SY) => ({}),
  },
  house_c: {
    id: "house_c", name_jp: "近所の家", name_ko: "이웃집", name_en: "Neighbor's House",
    left: null, right: null, down: "street",
    wall_color: "#f0f5e8", floor_color: "#8B4A20", floor_dark: "#4b2d12",
    sign_layout: [],
    object_hotspots: (W, FY, SY) => ({}),
  },
  gallery: {
    id: "gallery", name_jp: "おもちゃ画廊", name_ko: "장난감 갤러리", name_en: "Toy Gallery",
    left: null, right: null, down: "play_area",
    wall_color: "#f5f0e8", floor_color: "#c8a060", floor_dark: "#a06030",
    sign_layout: [
      { sign_id: "gallery_welcome", x: 60,  w: 200, h:  90 },
      { sign_id: "gallery_care",    x: 290, w: 200, h: 110 },
      { sign_id: "gallery_hours",   x: 510, w: 190, h:  90 },
    ],
    object_hotspots: (W, FY, SY) => ({
      npc_gallery_curator: { x: Math.round(W * 0.5) - 22, y: FY - 90, w: 44, h: 90 },
    }),
  },
  cooking_room: {
    id: "cooking_room", name_jp: "料理室", name_ko: "요리실", name_en: "Cooking Room",
    left: null, right: null, up: "salon",
    wall_color: "#f0ebe0", floor_color: "#737373", floor_dark: "#505050",
    sign_layout: [
      { sign_id: "cooking_welcome",   x: 40,  w: 180, h:  90 },
      { sign_id: "cooking_safety",    x: 250, w: 200, h: 110 },
      { sign_id: "cooking_schedule",  x: 470, w: 190, h:  90 },
      { sign_id: "cooking_materials", x: 680, w: 180, h:  90 },
    ],
    object_hotspots: (W, FY, SY) => ({
      npc_cook: { x: Math.round(W * 0.5) - 22, y: FY - 90, w: 44, h: 90 },
    }),
  },
};
