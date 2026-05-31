// CONTENT: Entity definitions and initial states
// Metadata (labels, icons, descriptions) lives here.
// Simulation behavior lives in engine/sim.js.

const ENTITY_DEFS = {
  laptop: {
    label: "ノートパソコン",
    label_ko: "노트북",
    label_en: "Laptop",
    icon: "💻",
    desc_en: "It is your laptop.",
    initial: { battery: 42, on: false, plugged_in: false, task: null }
  },
  outlet: {
    label: "コンセント",
    label_ko: "콘센트",
    label_en: "Outlet",
    icon: "⚡",
    desc_en: "A wall outlet. Governed by the outlet policy sign.",
    initial: { in_use: false }
  },
  textbook: {
    label: "教科書",
    label_ko: "교과서",
    label_en: "Textbook",
    icon: "📖",
    desc_en: "A Japanese textbook. Read it to complete your study goal.",
    initial: { in_hand: false, progress: 0 }
  },
  phone: {
    label: "携帯電話",
    label_ko: "휴대전화",
    label_en: "Phone",
    icon: "📱",
    desc_en: "Your phone. Be careful about the library's phone policy.",
    initial: { on_call: false, lookup_cooldown: 0 }
  },
  snack: {
    label: "お菓子",
    label_ko: "과자",
    label_en: "Snack",
    icon: "🍘",
    desc_en: "A rice cracker from the convenience store. Delicious.",
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
    desc_en: "The reception desk. Staff assist visitors here.",
    initial: {}
  },
  waiting_bench: {
    label: "待合席",
    label_ko: "대기석",
    label_en: "Waiting Area",
    icon: "🪑",
    desc_en: "Benches for waiting visitors.",
    initial: {}
  },
  directory_board: {
    label: "案内板",
    label_ko: "안내판",
    label_en: "Directory Board",
    icon: "🗺",
    desc_en: "Shows which facilities are on each floor.",
    initial: {}
  },

  // ── Salon ──────────────────────────────────────────────────────────────────
  craft_table: {
    label: "工作台",
    label_ko: "공작대",
    label_en: "Craft Table",
    icon: "✂️",
    desc_en: "A table for craft and art activities.",
    initial: {}
  },

  // ── Outdoor ────────────────────────────────────────────────────────────────
  bench: {
    label: "ベンチ",
    label_ko: "벤치",
    label_en: "Bench",
    icon: "🪑",
    desc_en: "A bench for resting outdoors.",
    initial: {}
  },
  swing: {
    label: "ブランコ",
    label_ko: "그네",
    label_en: "Swing",
    icon: "🎠",
    desc_en: "A swing set.",
    initial: {}
  },
  zipline: {
    label: "ジップライン",
    label_ko: "짚라인",
    label_en: "Zipline",
    icon: "🪂",
    desc_en: "A zipline. Wait your turn.",
    initial: {}
  },

  // ── House ──────────────────────────────────────────────────────────────────
  kotatsu: {
    label: "こたつ",
    label_ko: "고타츠",
    label_en: "Kotatsu",
    icon: "🛋",
    desc_en: "A heated table — the heart of a Japanese home.",
    initial: {}
  },
  kitchen_counter: {
    label: "台所",
    label_ko: "부엌",
    label_en: "Kitchen",
    icon: "🍳",
    desc_en: "The kitchen counter.",
    initial: {}
  },
  genkan: {
    label: "玄関",
    label_ko: "현관",
    label_en: "Entryway",
    icon: "🚪",
    desc_en: "The genkan — remove your shoes here before entering.",
    initial: {}
  },
};

// Descriptions for tile types that aren't named objects.
// Keyed by the tile code used in TILES / room.tiles[][].
const TILE_DEFS = {
  TREE:      { label:'木',      label_ko:'나무',   label_en:'Tree',        desc_en:'It is a tree.' },
  TREE2:     { label:'木',      label_ko:'나무',   label_en:'Tree',        desc_en:'It is a tree.' },
  TREE3:     { label:'木',      label_ko:'나무',   label_en:'Tree',        desc_en:'It is a tree.' },
  BENCH:     { label:'ベンチ',  label_ko:'벤치',   label_en:'Bench',       desc_en:'It is a bench.' },
  SHELF:     { label:'本棚',    label_ko:'책장',   label_en:'Bookshelf',   desc_en:'It is a bookshelf.' },
  SHELF2:    { label:'棚',      label_ko:'선반',   label_en:'Shelf',       desc_en:'It is a shelf.' },
  DESK:      { label:'机',      label_ko:'책상',   label_en:'Desk',        desc_en:'It is a study desk.' },
  DESK2:     { label:'机',      label_ko:'책상',   label_en:'Desk',        desc_en:'It is a study desk.' },
  CRAFT:     { label:'工作台',  label_ko:'공작대', label_en:'Craft Table', desc_en:'It is a craft table.' },
  CRAFT2:    { label:'工作台',  label_ko:'공작대', label_en:'Craft Table', desc_en:'It is a craft table.' },
  SWING:     { label:'ブランコ',label_ko:'그네',   label_en:'Swing',       desc_en:'It is a swing.' },
  GATE:      { label:'門',      label_ko:'문',     label_en:'Gate',        desc_en:'It is a gate.' },
  RECEPTION: { label:'受付',    label_ko:'접수',   label_en:'Counter',     desc_en:'It is the reception counter.' },
};
