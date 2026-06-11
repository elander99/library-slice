// CONTENT: Entity definitions and initial states
// Metadata (labels, icons, descriptions) lives here.
// Simulation behavior lives in engine/sim.js.

const ENTITY_DEFS = {
  laptop: {
    label: "ノートパソコン",
    label_ko: "노트북",
    label_en: "Laptop",
    icon: "💻",
    desc_en: "Your laptop. You use it for library work — check the outlet sign before charging.",
    initial: { battery: 42, on: false, plugged_in: false, task: null }
  },
  outlet: {
    label: "コンセント",
    label_ko: "콘센트",
    label_en: "Outlet",
    icon: "⚡",
    desc_en: "A wall outlet. Use is prohibited unless it is for library work only.",
    initial: { in_use: false }
  },
  textbook: {
    label: "教科書",
    label_ko: "교과서",
    label_en: "Textbook",
    icon: "📖",
    desc_en: "A Japanese textbook — one of the books you borrowed from the library collection.",
    initial: { in_hand: false, progress: 0 }
  },
  phone: {
    label: "携帯電話",
    label_ko: "휴대전화",
    label_en: "Phone",
    icon: "📱",
    desc_en: "Your mobile phone. Making a phone call indoors is not allowed — refrain from calling.",
    initial: { on_call: false, lookup_cooldown: 0 }
  },
  snack: {
    label: "お菓子",
    label_ko: "과자",
    label_en: "Snack",
    icon: "🍘",
    desc_en: "A snack. Consumption of food and drink is prohibited indoors — you cannot eat this here.",
    initial: { eaten: false }
  },
  librarian: {
    label: "図書館員",
    label_ko: "사서",
    label_en: "Librarian",
    icon: "👩",
    desc_en: "The librarian. She keeps an eye on things.",
    initial: { mood: "neutral", alert: null }
  },

  // ── Lobby ──────────────────────────────────────────────────────────────────
  reception_desk: {
    label: "受付",
    label_ko: "접수",
    label_en: "Reception Desk",
    icon: "🪧",
    desc_en: "The reception desk. Today the reception is closed — come back tomorrow.",
    initial: {}
  },
  waiting_bench: {
    label: "待合席",
    label_ko: "대기석",
    label_en: "Waiting Area",
    icon: "🪑",
    desc_en: "Benches for waiting. Adults can sit here while children play nearby.",
    initial: {}
  },
  directory_board: {
    label: "案内板",
    label_ko: "안내판",
    label_en: "Directory Board",
    icon: "🗺",
    desc_en: "A directory board showing this building's rooms and facilities.",
    initial: {}
  },

  // ── Salon ambient visitors ────────────────────────────────────────────────
  visitor_a: {
    label: '방문객',
    label_ko: '방문객',
    label_en: 'Visitor',
    icon: '🍱',
    desc_en: 'A visitor. Food and drink must not be brought in — consumption of food indoors is prohibited.',
    initial: {}
  },
  visitor_b: {
    label: '방문객',
    label_ko: '방문객',
    label_en: 'Visitor',
    icon: '🥤',
    desc_en: 'A visitor. Water replenishment is always allowed — drinking water is permitted.',
    initial: {}
  },

  // ── Salon ──────────────────────────────────────────────────────────────────
  craft_table: {
    label: "工作台",
    label_ko: "공작대",
    label_en: "Craft Table",
    icon: "✂️",
    desc_en: "A craft table in the salon. Use the space, take turns, and be friendly.",
    initial: {}
  },
  water_jug: {
    label: "給水ジャグ",
    label_ko: "물병",
    label_en: "Water Jug",
    icon: "🫗",
    desc_en: "A jug of water. Water replenishment is always allowed, even when food and drink are not.",
    initial: {}
  },

  // ── Outdoor ────────────────────────────────────────────────────────────────
  streetlight: {
    label: "街灯",
    label_ko: "가로등",
    label_en: "Streetlight",
    icon: "💡",
    desc_en: "It is a streetlight.",
    initial: {}
  },
  bench: {
    label: "ベンチ",
    label_ko: "벤치",
    label_en: "Bench",
    icon: "🪑",
    desc_en: "An outdoor bench. Adults rest here while young children play nearby.",
    initial: {}
  },
  swing: {
    label: "ブランコ",
    label_ko: "그네",
    label_en: "Swing",
    icon: "🎠",
    desc_en: "A swing set for young children. This area is for children ages 3 to 6.",
    initial: {}
  },
  zipline: {
    label: "ジップライン",
    label_ko: "짚라인",
    label_en: "Zipline",
    icon: "🪂",
    desc_en: "A zipline. Users must give way — those 7 and over yield to younger children.",
    initial: {}
  },

  // ── House ──────────────────────────────────────────────────────────────────
  kotatsu: {
    label: "こたつ",
    label_ko: "코타츠",
    label_en: "Kotatsu",
    icon: "🛋",
    desc_en: "A kotatsu — a heated low table with a built-in heater underneath. Sit on the cushions and warm your feet.",
    initial: {}
  },
  kitchen_counter: {
    label: "台所",
    label_ko: "부엌",
    label_en: "Kitchen",
    icon: "🍳",
    desc_en: "The kitchen counter. Tonight's dinner is being prepared here — curry rice is on the menu.",
    initial: {}
  },
  genkan: {
    label: "玄関",
    label_ko: "현관",
    label_en: "Entryway",
    icon: "🚪",
    desc_en: "The genkan — the entryway where you take off your shoes before stepping inside. Use the bench to sit.",
    initial: {}
  },
  dining_table: {
    label: "食卓",
    label_ko: "식탁",
    label_en: "Dining Table",
    icon: "🍽️",
    desc_en: "The dining table. The family gathers here for meals together. Pull out a chair and sit down.",
    initial: {}
  },
  bed: {
    label: "布団",
    label_ko: "이불",
    label_en: "Futon",
    icon: "🛏️",
    desc_en: "A soft futon laid out on the tatami floor. Lie down and get some rest.",
    initial: { sleeping: false }
  },

  // ── Gallery toys ───────────────────────────────────────────────────────────
  ningyou: {
    label:    "人形",
    label_ko: "인형",
    label_en: "Japanese Doll",
    icon: "🎎",
    desc_en: "A traditional Japanese doll on exhibition in this hall. Please don't touch the exhibits.",
    initial: {}
  },
  matryoshka: {
    label:    "マトリョーシカ",
    label_ko: "마트료시카",
    label_en: "Matryoshka",
    icon: "🪆",
    desc_en: "A Russian nesting doll. This exhibit is on display — please don't touch.",
    initial: {}
  },
  teddy_bear: {
    label:    "くまのぬいぐるみ",
    label_ko: "곰인형",
    label_en: "Teddy Bear",
    icon: "🧸",
    desc_en: "A well-loved stuffed bear — part of the toy exhibition. Please don't touch the exhibits.",
    initial: {}
  },
  board_game: {
    label:    "ボードゲーム",
    label_ko: "보드게임",
    label_en: "Board Game",
    icon: "🎲",
    desc_en: "A classic strategy board game from the exhibition hall collection. Exhibits are display only.",
    initial: {}
  },
  toy_train: {
    label:    "汽車のおもちゃ",
    label_ko: "기차 장난감",
    label_en: "Toy Train",
    icon: "🚂",
    desc_en: "A vintage tin toy on exhibition. Toys like these are on display — look, don't touch.",
    initial: {}
  },
  yoyo: {
    label:    "ヨーヨー",
    label_ko: "요요",
    label_en: "Yo-yo",
    icon: "🪀",
    desc_en: "A wooden yo-yo popular with children for generations. Now on exhibition in this hall.",
    initial: {}
  },
  hours_board: {
    label:    "開館案内",
    label_ko: "개관 안내",
    label_en: "Opening Hours Board",
    icon:     "📅",
    desc_en:  "The opening hours board. This exhibition hall is open on Saturday and Sunday.",
    initial:  {}
  },

  // ── Cooking Room ───────────────────────────────────────────────────────────
  curry_pot: {
    label: "カレー鍋",
    label_ko: "카레 냄비",
    label_en: "Curry Pot",
    icon: "🍛",
    desc_en: "A large pot of curry rice simmering over fire. Be careful of the fire.",
    initial: {}
  },
  rice_cooker: {
    label: "炊飯器",
    label_ko: "밥솥",
    label_en: "Rice Cooker",
    icon: "🍚",
    desc_en: "An electric rice cooker, quietly steaming. The rice will be ready soon.",
    initial: {}
  },
  knife: {
    label:    "包丁",
    label_ko: "칼",
    label_en: "Knife",
    icon:     "🔪",
    desc_en:  "A kitchen knife. Be careful when you use a knife — caution is required.",
    initial:  {}
  },
  menu_board: {
    label:    "メニュー",
    label_ko: "메뉴판",
    label_en: "Menu Board",
    icon:     "📋",
    desc_en:  "The menu board for today's cooking class. Today's menu is curry rice.",
    initial:  {}
  },
};

// Descriptions for tile types that aren't named objects.
// Keyed by the tile code used in TILES / room.tiles[][].
const TILE_DEFS = {
  // ── Furniture / outdoor structures ───────────────────────────────────────
  TREE:      { label:'木',      label_ko:'나무',   label_en:'Tree',        desc_en:'A tree in the outdoor area.' },
  TREE2:     { label:'木',      label_ko:'나무',   label_en:'Tree',        desc_en:'A tree in the outdoor area.' },
  TREE3:     { label:'木',      label_ko:'나무',   label_en:'Tree',        desc_en:'A tree in the outdoor area.' },
  BENCH:     { label:'ベンチ',  label_ko:'벤치',   label_en:'Bench',       desc_en:'A bench. Find a seat and take a rest.' },
  SHELF:     { label:'本棚',    label_ko:'책장',   label_en:'Bookshelf',   desc_en:'A bookshelf. Library books are kept here.' },
  SHELF2:    { label:'棚',      label_ko:'선반',   label_en:'Shelf',       desc_en:'A shelf for storing supplies.' },
  DESK:      { label:'机',      label_ko:'책상',   label_en:'Desk',        desc_en:'A study desk. Used quietly for library work.' },
  DESK2:     { label:'机',      label_ko:'책상',   label_en:'Desk',        desc_en:'A study desk. Used quietly for library work.' },
  CRAFT:     { label:'工作台',  label_ko:'공작대', label_en:'Craft Table', desc_en:'A craft table. Share the space — take turns and be friendly.' },
  CRAFT2:    { label:'工作台',  label_ko:'공작대', label_en:'Craft Table', desc_en:'A craft table. Share the space — take turns and be friendly.' },
  SWING:     { label:'ブランコ',label_ko:'그네',   label_en:'Swing',       desc_en:'A playground swing for young children. Adults, please give way.' },
  GATE:      { label:'門',      label_ko:'문',     label_en:'Gate',        desc_en:'A gate at the entrance to the play area.' },
  RECEPTION: { label:'受付',    label_ko:'접수',   label_en:'Counter',     desc_en:'The reception counter. Today the reception is closed.' },
  BED:       { label:'布団',    label_ko:'이불',   label_en:'Futon',       desc_en:'A soft futon laid out on the floor. Lie down and rest.' },
  // ── Walls ─────────────────────────────────────────────────────────────────
  WALL:      { label:'壁',      label_ko:'벽',     label_en:'Wall',        desc_en:'A wall.' },
  WALL2:     { label:'壁',      label_ko:'벽',     label_en:'Wall',        desc_en:'A wall.' },
  // ── Street / road ─────────────────────────────────────────────────────────
  F_STONE:       { label:'道',    label_ko:'거리',   label_en:'Street',      desc_en:'The street. Sidewalks and road surface.' },
  F_ROAD_CURB_T: { label:'縁石',  label_ko:'연석',   label_en:'Curb',        desc_en:'The road curb — the boundary between sidewalk and road.' },
  F_ROAD_CURB_B: { label:'縁石',  label_ko:'연석',   label_en:'Curb',        desc_en:'The road curb — the boundary between sidewalk and road.' },
  F_LIGHT:       { label:'駐車場',label_ko:'주차장', label_en:'Parking Lot', desc_en:'A paved parking area.' },
  // ── Outdoor ground ────────────────────────────────────────────────────────
  F_GRASS:   { label:'草地',    label_ko:'잔디',   label_en:'Grass',       desc_en:'A grassy area.' },
  F_SAND:    { label:'砂道',    label_ko:'모래길', label_en:'Gravel Path', desc_en:'A sandy gravel path.' },
  // ── Indoor floors ─────────────────────────────────────────────────────────
  F_WOOD:    { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'A wooden floor.' },
  F_WOOD2:   { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'A wooden floor.' },
  F_LIB:     { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'The library floor.' },
  F_GRAY:    { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'The lobby floor.' },
  F_BLUE:    { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'A mat floor.' },
  F_TAN:     { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'A wooden floor.' },
  F_TAN_B:   { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'A wooden floor.' },
  F_TAN_C:   { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'A wooden floor.' },
  F_SALON:   { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'The salon floor.' },
  F_SCHOOL:  { label:'床',      label_ko:'바닥',   label_en:'Floor',       desc_en:'The floor.' },
  // ── Tatami ────────────────────────────────────────────────────────────────
  F_TATAMI:   { label:'畳',     label_ko:'다다미', label_en:'Tatami',      desc_en:'Traditional Japanese tatami flooring.' },
  F_TATAMI_B: { label:'畳',     label_ko:'다다미', label_en:'Tatami',      desc_en:'Traditional Japanese tatami flooring.' },
  F_TATAMI_C: { label:'畳',     label_ko:'다다미', label_en:'Tatami',      desc_en:'Traditional Japanese tatami flooring.' },
};

// Resolves a map tile code and room default floor to a TILE_DEFS entry.
// tile_code === '' means the tile is the room's default floor → use room_floor.
// Returns null for null/undefined input or unrecognized codes.
function tile_label_for(tile_code, room_floor) {
  if (tile_code == null) return null;
  const resolved = tile_code === '' ? room_floor : tile_code;
  if (!resolved) return null;
  return TILE_DEFS[resolved] || null;
}

if (typeof module !== 'undefined') module.exports = { tile_label_for, TILE_DEFS };
