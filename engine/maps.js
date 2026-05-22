// Room tile maps and interactive object placement.
// Map arrays: each cell is a TILES key string. '' = default floor for room.
// All rooms sized for 1920×1080: VP=1920×848px at TS=32 → 60×26.5, use 60×27.

// ── Shorthand aliases ────────────────────────────────────────────────────────
const _W = 'WALL', _D = 'DESK', _S = 'SHELF', _C = 'CRAFT', _R = 'RECEPTION';
const _B = 'BENCH', _SW = 'SWING', _G = 'GATE', _T = 'TREE', _T2='TREE2', _T3='TREE3';

// ── Map builder helpers ───────────────────────────────────────────────────────
const _COLS = 60, _ROWS = 27;
const _EX   = [13, 14]; // exit row pair — vertical midpoint of a 27-row room

// Build a tile map array.
//   perimeter: tile code for all 4 edges (top row, bottom row, side cols).
//   exits: [{dir:'left'|'right', rows:[...]}] — gaps cut into the side walls.
//   items: flat triplets [col, row, tile, col, row, tile, ...].
function make_map(cols, rows, perimeter, exits, items) {
  const left_ex = new Set(), right_ex = new Set();
  for (const e of (exits || [])) {
    if (e.dir === 'left')  e.rows.forEach(r => left_ex.add(r));
    if (e.dir === 'right') e.rows.forEach(r => right_ex.add(r));
  }
  // Group item overrides by row for O(1) per-row lookup
  const by_row = Array.from({length: rows}, () => []);
  for (let i = 0; i < (items || []).length; i += 3)
    by_row[items[i + 1]].push([items[i], items[i + 2]]);

  const map = [];
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols).fill('');
    if (r === 0 || r === rows - 1) {
      row.fill(perimeter);
    } else {
      if (!left_ex.has(r))  row[0]        = perimeter;
      if (!right_ex.has(r)) row[cols - 1] = perimeter;
    }
    for (const [c, tile] of by_row[r]) row[c] = tile;
    map.push(row);
  }
  return map;
}

// Return flat [col, row, tile, ...] triples filling a rectangle.
function rect(c1, r1, c2, r2, tile) {
  const out = [];
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++)
      out.push(c, r, tile);
  return out;
}

// ── Library (60×27) ──────────────────────────────────────────────────────────
// Floor: F_WOOD. Exits: left col=0 rows 13-14, right col=59 rows 13-14.
// Layout: bookshelves right wall · desk banks · reception left · librarian NPC.
const LIBRARY_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
  [
    // Bookshelves along right wall — two banks, gap at exit rows
    ...rect(52, 1, 58, 11, _S),
    ...rect(52, 15, 58, 25, _S),
    // Reception desk (left side, near left entrance)
    ...rect(3, 9, 6, 11, _R),
    // Study desk bank 1 — three sections separated by aisles
    ...rect(10, 9, 20, 10, _D),
    ...rect(23, 9, 33, 10, _D),
    ...rect(36, 9, 48, 10, _D),
    // Study desk bank 2 (lower half)
    ...rect(10, 17, 20, 18, _D),
    ...rect(23, 17, 33, 18, _D),
    ...rect(36, 17, 48, 18, _D),
    // Study desk bank 3
    ...rect(10, 22, 20, 23, _D),
    ...rect(23, 22, 33, 23, _D),
    ...rect(36, 22, 48, 23, _D),
  ]
);

const LIBRARY_OBJECTS = [
  { id:'laptop',   col:12, row:9  },
  { id:'textbook', col:16, row:9  },
  { id:'phone',    col:12, row:10 },
  { id:'snack',    col:25, row:9  },
  { id:'outlet',   col:50, row:10 },
];
const LIBRARY_NPCS  = [{ npc_id:'librarian', col:35, row:20 }];
const LIBRARY_SIGNS = [
  { sign_id:'outlet_rule', col:5,  row:1 },
  { sign_id:'quiet_rule',  col:20, row:1 },
  { sign_id:'food_rule',   col:40, row:1 },
];

// ── Play Area (60×27) ────────────────────────────────────────────────────────
// Floor: F_GRASS. Exits: left col=0 rows 13-14 (to lobby), right col=59 rows 13-14 (to library).
const PLAY_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
  [
    // Swings — two pairs on the left side
    ...rect(8,  8, 9,  9, _SW),
    ...rect(12, 8, 13, 9, _SW),
    // Gate structure — two sections forming an arch
    ...rect(28, 8, 29, 9, _G),
    ...rect(32, 8, 33, 9, _G),
    // Tree clusters — scattered decoration
    ...rect(45, 5, 46, 6, _T),
    ...rect(50, 8, 51, 9, _T2),
    ...rect(20, 20, 21, 21, _T),
    ...rect(40, 18, 41, 19, _T2),
    ...rect(8,  18, 9,  19, _T3),
  ]
);
const PLAY_NPCS  = [{ npc_id:'play_staff', col:40, row:10 }];
const PLAY_SIGNS = [
  { sign_id:'play_shoes',       col:5,  row:1 },
  { sign_id:'play_supervision', col:25, row:1 },
  { sign_id:'play_age',         col:50, row:1 },
];

// ── Lobby (60×27) ─────────────────────────────────────────────────────────────
// Floor: F_GRAY. Exit: right col=59 rows 13-14 (to play area).
const LOBBY_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'right', rows:_EX }],
  [
    // Wide reception counter in the centre
    ...rect(22, 10, 38, 12, _R),
  ]
);
const LOBBY_NPCS  = [{ npc_id:'receptionist', col:40, row:10 }];
const LOBBY_SIGNS = [
  { sign_id:'lobby_directory', col:5,  row:1 },
  { sign_id:'lobby_reception', col:30, row:1 },
];

// ── Salon (60×27) ────────────────────────────────────────────────────────────
// Floor: F_TATAMI. Exits: left col=0 rows 13-14 (from library), right col=59 rows 13-14 (to outdoor).
const SALON_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
  [
    // Craft table banks — three sections with walkway gaps
    ...rect(10, 9, 20, 11, _C),
    ...rect(23, 9, 33, 11, _C),
    ...rect(36, 9, 48, 11, _C),
    // Lower craft bank
    ...rect(10, 17, 20, 19, _C),
    ...rect(23, 17, 33, 19, _C),
    ...rect(36, 17, 48, 19, _C),
  ]
);
const SALON_NPCS  = [{ npc_id:'salon_staff', col:50, row:20 }];
const SALON_SIGNS = [
  { sign_id:'salon_share', col:5,  row:1 },
  { sign_id:'salon_food',  col:30, row:1 },
];

// ── Outdoor (60×27) ──────────────────────────────────────────────────────────
// Floor: F_GRASS. Exit: left col=0 rows 13-14 (to salon). Perimeter: tree line.
const OUTDOOR_MAP = make_map(_COLS, _ROWS, _T,
  [{ dir:'left', rows:_EX }],
  [
    // Interior tree clusters for depth and decoration
    ...rect(2,  2,  3,  3,  _T),
    ...rect(8,  2,  9,  3,  _T2),
    ...rect(55, 2,  57, 4,  _T),
    ...rect(50, 2,  51, 3,  _T2),
    ...rect(2,  20, 3,  22, _T),
    ...rect(8,  22, 9,  23, _T2),
    ...rect(55, 21, 57, 23, _T),
    ...rect(50, 22, 51, 23, _T2),
    ...rect(30, 3,  31, 4,  _T3),
    // Bench in the centre
    5, 13, _B,
  ]
);
const OUTDOOR_NPCS  = [{ npc_id:'outdoor_guide', col:30, row:18 }];
const OUTDOOR_SIGNS = [
  { sign_id:'outdoor_zipline', col:5,  row:1 },
  { sign_id:'outdoor_yield',   col:40, row:1 },
];

// ── Room registry ────────────────────────────────────────────────────────────
const ROOM_MAP_DATA = {
  lobby: {
    id: 'lobby', floor: 'F_GRAY', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: LOBBY_MAP, npcs: LOBBY_NPCS, objects: [], signs: LOBBY_SIGNS,
    exits: [{ dir:'right', room:'play_area', my_col:59, my_rows:_EX, enter_col:1 }],
    name_jp: 'ロビー', name_en: 'Lobby',
  },
  play_area: {
    id: 'play_area', floor: 'F_GRASS', cols: _COLS, rows: _ROWS,
    wall_patch: 'road_curb',
    tiles: PLAY_MAP, npcs: PLAY_NPCS, objects: [], signs: PLAY_SIGNS,
    exits: [
      { dir:'left',  room:'lobby',   my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'library', my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: '遊び場', name_en: 'Play Area',
  },
  library: {
    id: 'library', floor: 'F_WOOD', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: LIBRARY_MAP, npcs: LIBRARY_NPCS, objects: LIBRARY_OBJECTS, signs: LIBRARY_SIGNS,
    exits: [
      { dir:'left',  room:'play_area', my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'salon',     my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: '図書館', name_en: 'Library',
  },
  salon: {
    id: 'salon', floor: 'F_TATAMI', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: SALON_MAP, npcs: SALON_NPCS, objects: [], signs: SALON_SIGNS,
    exits: [
      { dir:'left',  room:'library', my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'outdoor', my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: 'こどもサロン', name_en: "Children's Salon",
  },
  outdoor: {
    id: 'outdoor', floor: 'F_GRASS', cols: _COLS, rows: _ROWS,
    tiles: OUTDOOR_MAP, npcs: OUTDOOR_NPCS, objects: [], signs: OUTDOOR_SIGNS,
    exits: [
      { dir:'left', room:'salon', my_col:0, my_rows:_EX, enter_col:58 },
    ],
    name_jp: '屋外', name_en: 'Outdoor',
  },
};
