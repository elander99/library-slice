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
const _ECX  = [29, 30]; // exit col pair — horizontal midpoint of a 60-col room

// Build a tile map array.
//   perimeter: tile code for all 4 edges (top row, bottom row, side cols).
//   exits: [{dir:'left'|'right', rows:[...]}] — gaps cut into the side walls.
//   items: flat triplets [col, row, tile, col, row, tile, ...].
function make_map(cols, rows, perimeter, exits, items) {
  const left_ex = new Set(), right_ex = new Set();
  const top_ex  = new Set(), bot_ex   = new Set();
  for (const e of (exits || [])) {
    if (e.dir === 'left')  e.rows.forEach(r => left_ex.add(r));
    if (e.dir === 'right') e.rows.forEach(r => right_ex.add(r));
    if (e.dir === 'up')    e.cols.forEach(c => top_ex.add(c));
    if (e.dir === 'down')  e.cols.forEach(c => bot_ex.add(c));
  }
  // Group item overrides by row for O(1) per-row lookup
  const by_row = Array.from({length: rows}, () => []);
  for (let i = 0; i < (items || []).length; i += 3)
    by_row[items[i + 1]].push([items[i], items[i + 2]]);

  const map = [];
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols).fill('');
    if (r === 0) {
      for (let c = 0; c < cols; c++) row[c] = top_ex.has(c) ? '' : perimeter;
    } else if (r === rows - 1) {
      for (let c = 0; c < cols; c++) row[c] = bot_ex.has(c) ? '' : perimeter;
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
const LIBRARY_NPCS  = [
  { npc_id:'librarian', col:35, row:20 },
  { npc_id:'student_a', col:25, row:17, ambient:true, convo:'library_study_chat',
    goals: [
      { col:25, row:16, pause_ms:12000, say_ko:'지금 공부 중이에요.',          say_en:'Studying right now.'              },
      { col:51, row:5,  pause_ms:4000,  say_ko:'책 찾고 있어요.',              say_en:'Looking for a book.'              },
      { col:51, row:22, pause_ms:3000,  say_ko:'여기 책도 보고 있어요.',        say_en:'Checking the books down here.'    },
      { col:25, row:16, pause_ms:9000,  say_ko:'자리로 돌아가는 중이에요.',     say_en:'Heading back to my seat.'         },
    ],
  },
  { npc_id:'student_b', col:29, row:17, ambient:true, convo:'library_study_chat',
    start_goal: 2,
    goals: [
      { col:29, row:16, pause_ms:14000, say_ko:'리포트 쓰고 있어요.',           say_en:'Writing a report.'                },
      { col:51, row:12, pause_ms:3000,  say_ko:'참고 자료 찾는 중이에요.',      say_en:'Looking for reference materials.' },
      { col:29, row:16, pause_ms:10000, say_ko:'다시 공부해야겠어요.',           say_en:'Time to study again.'             },
      { col:18, row:12, pause_ms:2000,  say_ko:'잠깐 스트레칭하고 있어요.',     say_en:'Taking a little stretch.'         },
    ],
  },
  { npc_id:'visitor_a', col:44, row:11, ambient:true, convo:'library_outlet_chat',
    goals: [
      { col:44, row:11, pause_ms:10000, say_ko:'노트북으로 작업하고 있어요.',    say_en:'Working on my laptop.'            },
      { col:51, row:8,  pause_ms:3000,  say_ko:'책 좀 보고 있어요.',            say_en:'Just browsing the books.'         },
      { col:44, row:11, pause_ms:8000,  say_ko:'다시 작업하러 가요.',           say_en:'Going back to work.'              },
    ],
  },
  { npc_id:'visitor_b', col:48, row:11, ambient:true, convo:'library_outlet_chat',
    start_goal: 2,
    goals: [
      { col:48, row:11, pause_ms:12000, say_ko:'집중해서 일하는 중이에요.',      say_en:'Working, trying to focus.'        },
      { col:51, row:20, pause_ms:3000,  say_ko:'아래쪽 책 보고 있어요.',        say_en:'Looking at the lower shelves.'    },
      { col:48, row:11, pause_ms:7000,  say_ko:'자리로 돌아가요.',              say_en:'Heading back to my seat.'         },
    ],
  },
];
const LIBRARY_SIGNS = [
  { sign_id:'outlet_rule', col:5,  row:1 },
  { sign_id:'quiet_rule',  col:20, row:1 },
  { sign_id:'food_rule',   col:40, row:1 },
];

// ── Play Area (60×27) ────────────────────────────────────────────────────────
// Floor: F_GRASS. Exits: left col=0 rows 13-14 (to lobby), right col=59 rows 13-14 (to library).
const PLAY_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }, { dir:'up', cols:_ECX }],
  [
    // Swings
    ...rect(8,  8, 9,  9, _SW),
    ...rect(12, 8, 13, 9, _SW),
    // Gate arch (center decorative)
    ...rect(28, 8, 29, 9, _G),
    ...rect(32, 8, 33, 9, _G),
    // Gallery entrance arch at top wall (cols 29-30 are the exit gap)
    ...rect(27, 1, 28, 2, _G),
    ...rect(31, 1, 32, 2, _G),
    // Sandy path from left entrance toward the gate
    ...rect(1, 11, 27, 12, _FSD),
    // Sandy path leading up to gallery entrance
    ...rect(29, 3, 30, 7, _FSD),
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

// ── Street (60×27) ───────────────────────────────────────────────────────────
// Two-lane road with pavement sidewalks on each side. Floor: F_ROAD (asphalt).
// Sidewalk bands (rows 1-8 and 18-25) overlaid with F_STONE.
const STREET_MAP = make_map(_COLS, _ROWS, _T,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
  [
    // ── Sidewalk bands — concrete pavement over road floor ─────────────────
    ...rect(1,  1, 58,  8, _FS),
    ...rect(1, 18, 58, 25, _FS),
    // ── Kerb rows — white strip faces the pavement, gray faces the road ──
    ...rect(1,  9, 58,  9, 'F_ROAD_CURB_T'),  // white edge at top  (pavement above, road below)
    ...rect(1, 17, 58, 17, 'F_ROAD_CURB_B'),  // white edge at bottom (road above, pavement below)
    // ── Boulevard trees — staggered on both sides ─────────────────────────
    ...rect( 2,  3,  4,  6, _T3),
    ...rect( 2, 20,  4, 23, _T),
    ...rect(12,  3, 13,  6, _T),
    ...rect(12, 21, 13, 23, _T2),
    ...rect(24,  3, 25,  5, _T3),
    ...rect(24, 21, 25, 23, _T),
    ...rect(37,  3, 38,  6, _T2),
    ...rect(37, 20, 38, 23, _T3),
    ...rect(50,  3, 51,  5, _T),
    // ── Parking lot — lower-right sidewalk (clears tree that was at 50-51,21-23) ──
    ...rect(41, 18, 57, 25, 'F_LIGHT'),
    // Driveway curb cut at parking lot exit (col 46-51, row 17)
    46, 17, _FS, 47, 17, _FS, 48, 17, _FS, 49, 17, _FS, 50, 17, _FS, 51, 17, _FS,
    // ── Benches on the pavement ───────────────────────────────────────────
    15,  5, _B,
    45,  5, _B,
    15, 21, _B,
  ]
);
const STREET_NPCS    = [];
const STREET_SIGNS   = [
  { sign_id: 'street_mirai',     col: 7,  row: 1 },
  { sign_id: 'street_yield',     col: 48, row: 17 },
  { sign_id: 'street_themes',    col: 30, row: 1 },
  { sign_id: 'street_discovery', col: 43, row: 1 },
];
const STREET_OBJECTS = [
  // Streetlights on the upper kerb edge, facing the road
  { id:'streetlight', col: 8,  row: 9 },
  { id:'streetlight', col:22,  row: 9 },
  { id:'streetlight', col:38,  row: 9 },
  { id:'streetlight', col:53,  row: 9 },
  // Benches on the upper pavement
  { id:'bench', col:15, row: 5 },
  { id:'bench', col:45, row: 5 },
  // Benches on the lower pavement
  { id:'bench', col:15, row:21 },
  { id:'bench', col:45, row:21 },
];

// ── Lobby (60×27) ─────────────────────────────────────────────────────────────
// Floor: F_GRAY. Exits: left col=0 rows 13-14 (to street), right col=59 rows 13-14 (to play area).
const LOBBY_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
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
const LOBBY_NPCS    = [
  { npc_id:'receptionist', col:40, row:10 },
  { npc_id:'visitor_a', col:8, row:17, ambient:true, convo:'lobby_visitor_chat',
    goals: [
      { col:8,  row:17, pause_ms:8000,  say_ko:'로비에서 기다리고 있어요.',       say_en:'Waiting in the lobby.'           },
      { col:30, row:17, pause_ms:5000,  say_ko:'안내 데스크 쪽으로 가요.',         say_en:'Heading toward the front desk.'  },
      { col:3,  row:8,  pause_ms:6000,  say_ko:'벤치에서 잠깐 쉬어요.',            say_en:'Taking a quick rest on the bench.' },
      { col:8,  row:17, pause_ms:4000,  say_ko:'다시 돌아다니고 있어요.',          say_en:'Walking around again.'           },
    ],
  },
  { npc_id:'visitor_b', col:50, row:17, ambient:true, convo:'lobby_visitor_chat',
    start_goal: 2,
    goals: [
      { col:50, row:17, pause_ms:9000,  say_ko:'로비 오른쪽에 있어요.',            say_en:'Over on the right side of the lobby.' },
      { col:30, row:15, pause_ms:4000,  say_ko:'안내판 보고 있어요.',               say_en:'Looking at the directory board.'      },
      { col:57, row:8,  pause_ms:7000,  say_ko:'저쪽 벤치에 앉아요.',              say_en:'Sitting on that bench.'               },
      { col:50, row:17, pause_ms:3000,  say_ko:'다시 돌아가요.',                   say_en:'Heading back.'                        },
    ],
  },
];
const LOBBY_SIGNS   = [
  { sign_id:'lobby_directory', col:5,  row:1 },
  { sign_id:'lobby_reception', col:30, row:1 },
];
const LOBBY_OBJECTS = [
  { id:'reception_desk',  col:30, row:11 },
  { id:'waiting_bench',   col:1,  row:8  },
  { id:'directory_board', col:5,  row:2  },
];

// ── Salon (60×27) ────────────────────────────────────────────────────────────
// Floor: F_TATAMI. Exits: left col=0 rows 13-14 (from library), right col=59 rows 13-14 (to outdoor).
const SALON_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }, { dir:'down', cols:_ECX }],
  [
    // Supply shelves: top wall (around sign cols 5, 30)
    ...rect( 1, 1,  4, 1, _S2),
    ...rect( 6, 1, 28, 1, _S2),
    ...rect(31, 1, 51, 1, _S2),
    // Supply shelves: bottom wall (gap at cols 29-30 for cooking room exit)
    ...rect( 1, 25, 28, 25, _S2),
    ...rect(31, 25, 51, 25, _S2),
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
const SALON_NPCS    = [
  { npc_id:'salon_staff', col:50, row:20 },
  { npc_id:'visitor_a', col:34, row:13, ambient:true, prop:'🍱', convo:'salon_food_chat',
    goals: [
      { col:34, row:13, pause_ms:10000, say_ko:'점심 먹고 있어요!',             say_en:'Having lunch!'                    },
      { col:20, row:20, pause_ms:3000,  say_ko:'재료 구경하고 있어요.',          say_en:'Looking at the supplies.'         },
      { col:34, row:13, pause_ms:8000,  say_ko:'자리로 돌아가요.',              say_en:'Heading back to my seat.'         },
    ],
  },
  { npc_id:'visitor_b', col:44, row:13, ambient:true, prop:'🥤', convo:'salon_food_chat',
    start_goal: 2,
    goals: [
      { col:44, row:13, pause_ms:12000, say_ko:'음료 마시면서 쉬고 있어요.',     say_en:'Relaxing with a drink.'           },
      { col:10, row:20, pause_ms:4000,  say_ko:'왼쪽 재료 확인하고 있어요.',     say_en:'Checking the supplies over here.' },
      { col:44, row:13, pause_ms:9000,  say_ko:'다시 돌아가요.',                say_en:'Going back.'                      },
    ],
  },
];
const SALON_SIGNS   = [
  { sign_id:'salon_share', col:5,  row:1 },
  { sign_id:'salon_food',  col:30, row:1 },
];
const SALON_OBJECTS = [
  { id:'craft_table', col:13, row:10 },
  { id:'craft_table', col:26, row:10 },
  { id:'craft_table', col:39, row:18 },
  { id:'water_jug',   col:55, row:5  },
];

// ── Outdoor (60×27) ──────────────────────────────────────────────────────────
// Floor: F_GRASS. Exits: left col=0 rows 13-14 (to salon), right col=59 rows 13-14 (to house).
const OUTDOOR_MAP = make_map(_COLS, _ROWS, _T,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
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
    50, 22, _T2, 50, 23, _T2, 50, 24, _T2,  // trimmed — cols 51-52 cleared for house
    // (cols 55-57 bottom trees removed — inside house building footprint)
    // Scattered interior trees
    ...rect(12,  8, 13, 10, _T3),
    ...rect(25,  6, 26,  8, _T2),
    ...rect(40, 10, 41, 12, _T),
    ...rect(48,  7, 49,  9, _T3),
    ...rect(18, 14, 19, 16, _T3),
    ...rect(45, 16, 46, 18, _T2),
    // Sandy path from gate entrance to house door
    ...rect(1, 11,  3, 16, _FSD),
    ...rect(3, 13, 28, 14, _FSD),
    ...rect(35, 11, 51, 16, _FSD),  // path ends at house facade (col 51)
    // Swing set
    ...rect(37, 3, 38, 4, _SW),
    ...rect(41, 3, 42, 4, _SW),
    39, 3, _G, 39, 4, _G,
    // Benches: entrance rest spot + gathering area
     5, 13, _B,
    29, 14, _B,
    33, 14, _B,

    // ── House building exterior ────────────────────────────────────────────
    // Stone floor visible through/inside the door
    ...rect(52,  7, 58, 21, _FS),
    // Left facade — solid wall with door gap at rows 13-14
    ...rect(51,  5, 51, 12, _W),
    ...rect(51, 15, 51, 22, _W),
    // Roofline across top of building
    ...rect(51,  5, 58,  6, _W),
    // Building base
    ...rect(51, 22, 58, 22, _W),
  ]
);
const OUTDOOR_NPCS    = [
  { npc_id:'outdoor_guide', col:30, row:18 },
  { npc_id:'child_a', col:11, row:8, ambient:true, convo:'outdoor_zipline_chat',
    goals: [
      { col:10, row:7,  pause_ms:2000,                        say_ko:'짚라인 차례 기다리고 있어요!', say_en:'Waiting for my turn on the zipline!' },
      { col:8,  row:5,  pause_ms:0, activity:'zipline_ride',  say_ko:'으아아— 짚라인 타고 있어요!',  say_en:'Wheee— riding the zipline!'         },
      { col:50, row:17, pause_ms:1500,                        say_ko:'다 왔어요! 엄청 빠르죠?',      say_en:'Made it! Pretty fast, right?'       },
      { col:33, row:20, pause_ms:1000,                        say_ko:'산책하면서 돌아가고 있어요.',    say_en:'Walking back through the park.'     },
      { col:10, row:7,  pause_ms:1500,                        say_ko:'또 타러 왔어요!',              say_en:'Back to ride again!'                },
    ],
  },
  { npc_id:'child_b', col:50, row:17, ambient:true, convo:'outdoor_zipline_chat',
    start_goal: 3,
    goals: [
      { col:10, row:7,  pause_ms:4000,                        say_ko:'순서 기다리는 중이에요.',        say_en:'Waiting my turn.'                   },
      { col:8,  row:5,  pause_ms:0, activity:'zipline_ride',  say_ko:'짚라인 출발!',                  say_en:'Zipline, go!'                       },
      { col:50, row:17, pause_ms:2000,                        say_ko:'착지 성공!',                    say_en:'Landed!'                            },
      { col:33, row:20, pause_ms:3000,                        say_ko:'공원 둘러보고 있어요.',           say_en:'Exploring the park.'                },
      { col:10, row:7,  pause_ms:1000,                        say_ko:'짚라인 또 타고 싶어요!',         say_en:'I want to ride again!'              },
    ],
  },
];
const OUTDOOR_SIGNS   = [
  { sign_id:'outdoor_zipline', col:5,  row:1 },
  { sign_id:'outdoor_yield',   col:40, row:1 },
];
const OUTDOOR_OBJECTS = [
  { id:'swing',    col:38, row:4  },
  { id:'zipline',  col:8, row:5, end_col:50, end_row:15 },
  { id:'bench',    col:5,  row:13 },
  { id:'bench',    col:29, row:14 },
  { id:'bench',    col:33, row:14 },
];

// ── House (60×27) ─────────────────────────────────────────────────────────────
// Floor: F_TATAMI (tatami throughout). Three zones: genkan (wood), main room
// (tatami, kotatsu), kitchen/dining (hardwood). Exits left↔outdoor, right↔street.
const _FW = 'F_WOOD', _BED = 'BED';
const HOUSE_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'left', rows:_EX }, { dir:'right', rows:_EX }],
  [
    // ── Top wall (row 1) — storage shelving, gaps at sign cols 4, 25, 48 ─────
    ...rect( 1, 1,  3, 1, _S2),
    ...rect( 5, 1, 24, 1, _S2),
    ...rect(26, 1, 47, 1, _S2),
    ...rect(49, 1, 57, 1, _S2),
    // ── Bottom wall (row 25) — storage shelf ─────────────────────────────────
    ...rect( 1, 25, 58, 25, _S2),
    // ── Left wall (col 1) — storage above and below entry gap ────────────────
    ...rect(1,  2, 1, 11, _S2),
    ...rect(1, 16, 1, 24, _S2),

    // ── Genkan / entry vestibule — wood floor ─────────────────────────────────
    ...rect(2,  7, 9, 20, _FW2),         // genkan entry floor
    ...rect(2,  7, 5,  7, _S2),          // shoe cabinet along top of vestibule
    7, 8, _B,                            // bench for removing shoes

    // ── Main tatami room ─────────────────────────────────────────────────────
    // Futon (sleeping area in the upper corner, against the wall)
    ...rect(12, 2, 15, 5, _BED),
    // Kotatsu (low heated table, center of room)
    ...rect(22, 11, 27, 13, _D),
    // Benches flanking the kotatsu
    20, 12, _B,   29, 12, _B,

    // ── Kitchen / dining area — hardwood floor ────────────────────────────────
    ...rect(39, 2, 57, 24, _FW),         // kitchen hardwood floor
    // Kitchen counter and stove (along the wall)
    ...rect(41,  8, 55, 11, _R),
    // Lower cabinets below counter
    ...rect(41, 12, 54, 12, _S2),
    // Dining table
    ...rect(43, 17, 51, 19, _D),
    // Dining chairs
    41, 18, _B,   52, 18, _B,
    // Right wall storage unit
    ...rect(57,  2, 57, 24, _S2),
  ]
);
const HOUSE_NPCS    = [
  { npc_id:'house_resident', col:36, row:20 },
  { npc_id:'visitor_a', col:14, row:17, ambient:true, convo:'house_welcome_chat',
    goals: [
      { col:14, row:17, pause_ms:8000,  say_ko:'신발 벗고 있어요.',             say_en:'Taking my shoes off.'             },
      { col:25, row:12, pause_ms:5000,  say_ko:'코타츠에서 따뜻하게 쉬고 있어요.', say_en:'Resting at the kotatsu.'         },
      { col:45, row:15, pause_ms:3000,  say_ko:'주방 구경하고 있어요.',           say_en:'Looking at the kitchen.'          },
      { col:14, row:17, pause_ms:4000,  say_ko:'현관으로 돌아가요.',             say_en:'Heading back to the entrance.'    },
    ],
  },
  { npc_id:'visitor_b', col:17, row:17, ambient:true, convo:'house_activity_chat',
    start_goal: 2,
    goals: [
      { col:17, row:17, pause_ms:10000, say_ko:'들어오는 중이에요.',             say_en:'Just coming in.'                  },
      { col:30, row:12, pause_ms:5000,  say_ko:'코타츠에서 쉬고 있어요.',        say_en:'Sitting at the kotatsu.'          },
      { col:17, row:17, pause_ms:6000,  say_ko:'다시 이쪽으로 왔어요.',          say_en:'Back over here.'                  },
    ],
  },
];
const HOUSE_SIGNS   = [
  { sign_id:'house_entrance',   col:4,  row:1 },
  { sign_id:'house_kotatsu',    col:25, row:1 },
  { sign_id:'house_kitchen',    col:48, row:1 },
  { sign_id:'house_menu_only',  col:60, row:1 },
];
const HOUSE_OBJECTS = [
  { id:'genkan',          col:5,  row:13, tile_rect:[2,7,9,20]    },
  { id:'kotatsu',         col:24, row:12, tile_rect:[20,11,29,13] },  // expanded to include flanking seat tiles
  { id:'kitchen_counter', col:47, row:10, tile_rect:[41,8,55,11]  },
  { id:'dining_table',    col:47, row:18, tile_rect:[41,17,53,19] },  // dining table + chairs
  { id:'bed',             col:13, row:3,  tile_rect:[12,2,15,5]   },  // futon sleeping area
];

// ── Toy Gallery (60×27) ──────────────────────────────────────────────────────
// Floor: F_TAN. Exit: down col=29-30 rows 26 (to play_area).
// Open gallery space: display cases along walls, central pedestals, viewing benches.
const GALLERY_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'down', cols:_ECX }],
  [
    // Display shelves: top wall (gaps at sign cols 10, 30, 50)
    ...rect( 1, 1,  9, 1, _S2),
    ...rect(11, 1, 29, 1, _S2),
    ...rect(31, 1, 49, 1, _S2),
    ...rect(51, 1, 58, 1, _S2),
    // Display shelves: left and right walls
    ...rect(1, 2, 1, 24, _S2),
    ...rect(58, 2, 58, 24, _S2),
    // Display shelves: bottom wall flanking the exit gap
    ...rect( 1, 25, 28, 25, _S2),
    ...rect(31, 25, 58, 25, _S2),
    // Central display pedestals (benches as stands)
     8, 9, _B,  15, 9, _B,  23, 9, _B,  35, 9, _B,  43, 9, _B,  51, 9, _B,
     8,13, _B,  15,13, _B,  23,13, _B,  35,13, _B,  43,13, _B,  51,13, _B,
    // Viewing benches across the middle
    20, 17, _B,   40, 17, _B,
  ]
);
const GALLERY_NPCS = [
  { npc_id:'gallery_curator', col:30, row:20 },
  { npc_id:'child_a', col:13, row:20, ambient:true, convo:'gallery_explore_chat',
    goals: [
      { col:13, row:20, pause_ms:7000,  say_ko:'입구 근처 전시품 보고 있어요.',   say_en:'Looking at the displays near the entrance.' },
      { col:30, row:12, pause_ms:5000,  say_ko:'가운데 전시대 보고 있어요.',      say_en:'Checking out the central displays.'         },
      { col:50, row:20, pause_ms:5000,  say_ko:'저쪽 전시품이 더 있어요!',        say_en:'There are more exhibits on that side!'      },
      { col:13, row:20, pause_ms:4000,  say_ko:'다시 처음으로 돌아가요.',         say_en:'Heading back to the start.'                 },
    ],
  },
  { npc_id:'child_b', col:16, row:20, ambient:true, convo:'gallery_explore_chat',
    start_goal: 2,
    goals: [
      { col:16, row:20, pause_ms:8000,  say_ko:'입구 쪽 전시품 구경하고 있어요.', say_en:'Looking at the exhibits near the entrance.' },
      { col:45, row:12, pause_ms:4000,  say_ko:'오른쪽 전시대 보고 있어요.',      say_en:'Checking the right side displays.'          },
      { col:16, row:20, pause_ms:6000,  say_ko:'처음 자리로 돌아가요.',           say_en:'Heading back.'                              },
    ],
  },
];
const GALLERY_SIGNS = [
  { sign_id:'gallery_dolls',  col:10, row:1 },
  { sign_id:'gallery_care',   col:30, row:1 },
  { sign_id:'gallery_trains', col:50, row:1 },
];
// Toys on display pedestals: left=dolls, centre=plush/games, right=trains
const GALLERY_OBJECTS = [
  // Row 9 pedestals (upper)
  { id:'ningyou',    col: 8, row: 9 },
  { id:'matryoshka', col:15, row: 9 },
  { id:'teddy_bear', col:23, row: 9 },
  { id:'board_game', col:35, row: 9 },
  { id:'toy_train',  col:43, row: 9 },
  { id:'yoyo',       col:51, row: 9 },
  // Row 13 pedestals (lower) — alternated for variety
  { id:'matryoshka', col: 8, row:13 },
  { id:'ningyou',    col:15, row:13 },
  { id:'board_game', col:23, row:13 },
  { id:'teddy_bear', col:35, row:13 },
  { id:'yoyo',       col:43, row:13 },
  { id:'toy_train',  col:51, row:13 },
  { id:'hours_board', col:52, row:3  },
];

// ── Cooking Room (60×27) ──────────────────────────────────────────────────────
// Floor: F_STONE. Exit: up col=29-30 rows 0 (to salon).
// Kitchen layout: counters along walls, cooking stations in center.
const COOKING_MAP = make_map(_COLS, _ROWS, _W,
  [{ dir:'up', cols:_ECX }],
  [
    // Kitchen counters: top wall flanking exit gap
    ...rect( 1, 1, 28, 1, _R),
    ...rect(31, 1, 58, 1, _R),
    // Kitchen counters: bottom wall
    ...rect( 1, 25, 58, 25, _R),
    // Kitchen counters: left and right walls
    ...rect(1, 2, 1, 24, _R),
    ...rect(58, 2, 58, 24, _R),
    // Cooking station islands
    ...rect( 8,  9, 20, 11, _C),
    ...rect(24,  9, 36, 11, _C2),
    ...rect(40,  9, 52, 11, _C),
    ...rect( 8, 17, 20, 19, _C2),
    ...rect(24, 17, 36, 19, _C),
    ...rect(40, 17, 52, 19, _C2),
  ]
);
const COOKING_NPCS = [
  { npc_id:'cook', col:30, row:14 },
  { npc_id:'visitor_a', col:14, row:22, ambient:true, convo:'cooking_lesson_chat',
    goals: [
      { col:14, row:22, pause_ms:9000,  say_ko:'자리에서 요리 구경하고 있어요.',   say_en:'Watching the cooking from my seat.' },
      { col:20, row:14, pause_ms:4000,  say_ko:'좀 더 가까이서 보고 있어요.',      say_en:'Getting a closer look.'             },
      { col:14, row:22, pause_ms:6000,  say_ko:'자리로 돌아가요.',                say_en:'Going back to my seat.'             },
    ],
  },
  { npc_id:'visitor_b', col:17, row:22, ambient:true, convo:'cooking_lesson_chat',
    start_goal: 2,
    goals: [
      { col:17, row:22, pause_ms:10000, say_ko:'자리에 앉아서 기다리고 있어요.',   say_en:'Sitting and waiting.'               },
      { col:25, row:14, pause_ms:5000,  say_ko:'카운터 쪽으로 가고 있어요.',       say_en:'Moving closer to the counter.'      },
      { col:17, row:22, pause_ms:7000,  say_ko:'다시 앉을게요.',                  say_en:'Going back to sit down.'            },
    ],
  },
];
const COOKING_SIGNS = [
  { sign_id:'cooking_welcome',  col: 5, row:1 },
  { sign_id:'cooking_safety',   col:20, row:1 },
  { sign_id:'cooking_schedule', col:45, row:1 },
];
const COOKING_OBJECTS = [
  { id:'curry_pot',   col:30, row:9  },
  { id:'rice_cooker', col:14, row:9  },
  { id:'knife',       col:22, row:12 },
  { id:'menu_board',  col:50, row:3  },
];

// ── Room registry ────────────────────────────────────────────────────────────
const ROOM_MAP_DATA = {
  street: {
    id: 'street', floor: 'F_STONE', cols: _COLS, rows: _ROWS,
    tiles: STREET_MAP, npcs: STREET_NPCS, objects: STREET_OBJECTS, signs: STREET_SIGNS,
    exits: [
      { dir:'left',  room:'house', my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'lobby', my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: '通り', name_ko: '거리', name_en: 'Street',
    // no hours — always accessible
  },
  lobby: {
    id: 'lobby', floor: 'F_GRAY', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: LOBBY_MAP, npcs: LOBBY_NPCS, objects: LOBBY_OBJECTS, signs: LOBBY_SIGNS,
    exits: [
      { dir:'left',  room:'street',    my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'play_area', my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: 'ロビー', name_ko: '로비', name_en: 'Lobby',
    opens: 9, closes: 20, kick_to: 'street', host_npc: 'receptionist',
  },
  play_area: {
    id: 'play_area', floor: 'F_GRASS', cols: _COLS, rows: _ROWS,
    wall_patch: 'road_curb',
    tiles: PLAY_MAP, npcs: PLAY_NPCS, objects: [], signs: PLAY_SIGNS,
    exits: [
      { dir:'left',  room:'lobby',   my_col:0,  my_rows:_EX,  enter_col:58 },
      { dir:'right', room:'library', my_col:59, my_rows:_EX,  enter_col:1  },
      { dir:'up',    room:'gallery', my_cols:_ECX, enter_row:24 },
    ],
    name_jp: '遊び場', name_ko: '놀이 공간', name_en: 'Play Area',
    opens: 9, closes: 19, kick_to: 'street', host_npc: 'play_staff',
  },
  library: {
    id: 'library', floor: 'F_WOOD', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: LIBRARY_MAP, npcs: LIBRARY_NPCS, objects: LIBRARY_OBJECTS, signs: LIBRARY_SIGNS,
    exits: [
      { dir:'left',  room:'play_area', my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'salon',     my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: '図書館', name_ko: '도서관', name_en: 'Library',
    opens: 9, closes: 20, kick_to: 'street', host_npc: 'librarian',
  },
  salon: {
    id: 'salon', floor: 'F_BLUE', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: SALON_MAP, npcs: SALON_NPCS, objects: SALON_OBJECTS, signs: SALON_SIGNS,
    exits: [
      { dir:'left',  room:'library',      my_col:0,  my_rows:_EX,  enter_col:58 },
      { dir:'right', room:'outdoor',      my_col:59, my_rows:_EX,  enter_col:1  },
      { dir:'down',  room:'cooking_room', my_cols:_ECX, enter_row:2 },
    ],
    name_jp: 'こどもサロン', name_ko: '어린이 살롱', name_en: "Children's Salon",
    opens: 10, closes: 19, kick_to: 'street', host_npc: 'salon_staff',
  },
  outdoor: {
    id: 'outdoor', floor: 'F_GRASS', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: OUTDOOR_MAP, npcs: OUTDOOR_NPCS, objects: OUTDOOR_OBJECTS, signs: OUTDOOR_SIGNS,
    exits: [
      { dir:'left',  room:'salon', my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'house', my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: '屋外', name_ko: '야외', name_en: 'Outdoor',
    opens: 7, closes: 21, kick_to: 'street', host_npc: 'outdoor_guide',
  },
  house: {
    id: 'house', floor: 'F_TATAMI', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: HOUSE_MAP, npcs: HOUSE_NPCS, objects: HOUSE_OBJECTS, signs: HOUSE_SIGNS,
    exits: [
      { dir:'left',  room:'outdoor', my_col:0,  my_rows:_EX, enter_col:58 },
      { dir:'right', room:'street',  my_col:59, my_rows:_EX, enter_col:1  },
    ],
    name_jp: '家', name_ko: '집', name_en: 'Home',
    // no hours — home is always accessible
  },
  gallery: {
    id: 'gallery', floor: 'F_LIB', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: GALLERY_MAP, npcs: GALLERY_NPCS, objects: GALLERY_OBJECTS, signs: GALLERY_SIGNS,
    exits: [
      { dir:'down', room:'play_area', my_cols:_ECX, enter_row:2 },
    ],
    name_jp: 'おもちゃ画廊', name_ko: '장난감 갤러리', name_en: 'Toy Gallery',
    opens: 10, closes: 17, days: [0, 6], kick_to: 'street', host_npc: 'gallery_curator',
  },
  cooking_room: {
    id: 'cooking_room', floor: 'F_STONE', cols: _COLS, rows: _ROWS,
    wall_patch: 'stone_border',
    tiles: COOKING_MAP, npcs: COOKING_NPCS, objects: COOKING_OBJECTS, signs: COOKING_SIGNS,
    exits: [
      { dir:'up', room:'salon', my_cols:_ECX, enter_row:24 },
    ],
    name_jp: '料理室', name_ko: '요리실', name_en: 'Cooking Room',
    opens: 10, closes: 17, kick_to: 'street', host_npc: 'cook',
  },
};
