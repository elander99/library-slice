// Room tile maps and interactive object placement.
// Map arrays: each cell is a TILES key string. '' = default floor for room.
// All rooms sized for 1920×1080: VP=1920×848px at TS=32 → 60×26.5, use 60×27.

// ── Shorthand aliases ────────────────────────────────────────────────────────
const _W = 'WALL', _D = 'DESK', _S = 'SHELF', _S2 = 'SHELF2', _C = 'CRAFT', _C2 = 'CRAFT2', _R = 'RECEPTION';
const _B = 'BENCH', _SW = 'SWING', _G = 'GATE', _T = 'TREE', _T2='TREE2', _T3='TREE3';
const _FT = 'F_TAN', _FS = 'F_STONE', _FSD = 'F_SAND', _FW2 = 'F_WOOD2';

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
    // Bookshelves: right wall (two banks, gap at exit rows)
    ...rect(52, 1, 58, 11, _S),
    ...rect(52, 15, 58, 25, _S),
    // Bookshelves: top wall (around sign columns 5, 20, 40)
    ...rect( 1, 1,  4, 1, _S),
    ...rect( 6, 1, 19, 1, _S),
    ...rect(21, 1, 39, 1, _S),
    ...rect(41, 1, 51, 1, _S),
    // Bookshelves: bottom wall
    ...rect( 1, 25, 51, 25, _S),
    // Bookshelves: left wall (above and below reception)
    ...rect(1, 1, 1,  7, _S),
    ...rect(1, 15, 1, 25, _S),
    // Reception desk (left side)
    ...rect(3, 9, 6, 11, _R),
    // Warm-wood aisle runners between desk banks
    ...rect(9, 12, 49, 15, _FT),
    ...rect(9, 20, 49, 21, _FT),
    // Study desk bank 1
    ...rect(10, 9, 20, 10, _D),
    ...rect(23, 9, 33, 10, _D),
    ...rect(36, 9, 48, 10, _D),
    // Study desk bank 2
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
    // Swings
    ...rect(8,  8, 9,  9, _SW),
    ...rect(12, 8, 13, 9, _SW),
    // Gate arch
    ...rect(28, 8, 29, 9, _G),
    ...rect(32, 8, 33, 9, _G),
    // Sandy path from left entrance toward the gate
    ...rect(1, 11, 27, 12, _FSD),
    // Sandy ring around the swing area
    ...rect(6, 6, 15, 11, _FSD),
    // Benches near the gate / rest area
    24, 11, _B,   37, 11, _B,
    // Tree clusters — richer coverage
    ...rect(45, 4, 47, 6, _T),
    ...rect(50, 7, 52, 9, _T2),
    ...rect(55, 4, 57, 6, _T3),
    ...rect(3,  4, 5,  6, _T3),
    ...rect(18, 4, 19, 5, _T3),
    ...rect(38, 4, 40, 6, _T2),
    ...rect(20, 19, 22, 21, _T),
    ...rect(40, 17, 42, 19, _T2),
    ...rect(8,  18, 10, 20, _T3),
    ...rect(30, 20, 32, 22, _T),
    ...rect(50, 19, 52, 21, _T3),
    ...rect(55, 20, 57, 22, _T2),
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
    // Wide reception counter
    ...rect(22, 10, 38, 12, _R),
    // Waiting benches along side walls
     1,  5, _B,    1,  8, _B,    1, 11, _B,
    58,  5, _B,   58,  8, _B,   58, 11, _B,
    // Welcome-mat accent in front of reception
    ...rect(22, 14, 38, 15, _FT),
    // Decorative floor band across the upper lobby
    ...rect( 2,  4, 57,  5, _FS),
    // Stone trim along bottom wall
    ...rect( 2, 22, 57, 22, _FS),
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
    // Supply shelves: top wall (around sign cols 5, 30)
    ...rect( 1, 1,  4, 1, _S2),
    ...rect( 6, 1, 28, 1, _S2),
    ...rect(31, 1, 51, 1, _S2),
    // Supply shelves: bottom wall
    ...rect( 1, 25, 51, 25, _S2),
    // Supply shelves: left wall
    ...rect(1, 2, 1, 8, _S2),
    ...rect(1, 15, 1, 24, _S2),
    // Upper craft banks — alternating table variants for visual interest
    ...rect(10,  9, 15, 11, _C),
    ...rect(16,  9, 20, 11, _C2),
    ...rect(23,  9, 28, 11, _C),
    ...rect(29,  9, 33, 11, _C2),
    ...rect(36,  9, 41, 11, _C),
    ...rect(42,  9, 48, 11, _C2),
    // Lower craft banks
    ...rect(10, 17, 15, 19, _C2),
    ...rect(16, 17, 20, 19, _C),
    ...rect(23, 17, 28, 19, _C2),
    ...rect(29, 17, 33, 19, _C),
    ...rect(36, 17, 41, 19, _C2),
    ...rect(42, 17, 48, 19, _C),
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
    // Dense tree line: top interior edge
    ...rect( 2,  2,  4,  4, _T),
    ...rect( 7,  2,  9,  4, _T2),
    ...rect(13,  2, 15,  4, _T3),
    ...rect(18,  2, 20,  4, _T),
    ...rect(25,  2, 27,  4, _T2),
    ...rect(31,  2, 33,  3, _T3),
    ...rect(37,  2, 39,  4, _T),
    ...rect(44,  2, 46,  4, _T2),
    ...rect(50,  2, 52,  4, _T3),
    ...rect(55,  2, 57,  4, _T),
    // Dense tree line: bottom interior edge
    ...rect( 2, 21,  4, 24, _T2),
    ...rect( 8, 22, 10, 24, _T),
    ...rect(15, 22, 17, 24, _T3),
    ...rect(22, 21, 24, 24, _T),
    ...rect(29, 22, 31, 24, _T2),
    ...rect(36, 22, 38, 24, _T),
    ...rect(43, 21, 45, 24, _T3),
    ...rect(50, 22, 52, 24, _T2),
    ...rect(55, 21, 57, 24, _T),
    // Scattered interior trees
    ...rect(12,  8, 13, 10, _T3),
    ...rect(25,  6, 26,  8, _T2),
    ...rect(40, 10, 41, 12, _T),
    ...rect(48,  7, 49,  9, _T3),
    ...rect(18, 14, 19, 16, _T3),
    ...rect(45, 16, 46, 18, _T2),
    // Sandy path from gate entrance through the space
    ...rect(1, 11,  3, 16, _FSD),
    ...rect(3, 13, 28, 14, _FSD),
    // Swing set
    ...rect(37, 3, 38, 4, _SW),
    ...rect(41, 3, 42, 4, _SW),
    39, 3, _G, 39, 4, _G,
    // Benches: entrance rest spot + gathering area
     5, 13, _B,
    29, 14, _B,
    33, 14, _B,
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
