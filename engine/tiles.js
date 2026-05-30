// Sprite positions verified by pixel analysis of the actual PNG files.
// All sheets are 256×256.
//
// Interior tileset uses a 32×32 grid (verified by cell content checks).
// People tilesets use measured column bands (1px gaps) + 32px row height.
// Trees: measured zero-density column boundaries within each band.
// Terrain: 32px grid, tile types confirmed by center-pixel color sampling.

const TS = 32; // game tile size in pixels (display size)
const TS_ART = 16; // native art tile size in pixels

// Tile: { img, sx, sy, solid, color(fallback) }
// Uses 32px art grid (for interior/furniture sheets where objects span 32px)
function T(img, col, row, solid, color) {
  return { img, sx: col*32, sy: row*32, solid: !!solid, color };
}
// Tile with explicit pixel coords (for non-grid sprites)
function Tp(img, sx, sy, solid, color) {
  return { img, sx, sy, solid: !!solid, color };
}
// T16: 16px art tile — correct for terrain/water/etc. sheets
// Crops a 16×16 source region, upscaled to TS (32px) when rendered.
function T16(img, col, row, solid, color) {
  return { img, sx: col*16, sy: row*16, tw: 16, th: 16, solid: !!solid, color };
}

// ── Interior tile grid (32px, all 64 cells have content) ────────────────────
// Center-pixel colors confirmed:
//   [1,0]=rgb(102,56,23) wood   [2,0]=rgb(135,185,205) blue-mat  [3,0]=rgb(166,171,175) gray-tile
//   [4,0]=rgb(84,84,84)  dark   [4,1]=rgb(75,45,29) dark-brown   [6,3]=rgb(183,184,153) tatami
//   [0,4]=rgb(75,45,29)  shelf  [0,6]=rgb(142,120,79) tan-wood   [7,7]=rgb(205,200,196) white-tile

// ── Terrain tile grid (32px) ─────────────────────────────────────────────────
// Center-pixel colors confirmed:
//   [2,0]=rgb(83,108,42) grass  [3,3]=rgb(115,115,115) stone  [6,1]=rgb(238,238,238) light
//   [4,4]=rgb(206,194,132) sand  [5,5]=rgb(192,191,189) paved-gray

const TILES = {
  // ── Floors (walkable) ────────────────────────────────────────────────────
  F_WOOD:    T('interior', 1, 0, false, '#66381A'),  // warm brown wood plank
  F_WOOD2:   T('interior', 0, 1, false, '#65341A'),  // brown wood variant
  F_GRAY:    T('interior', 3, 0, false, '#A6ABB0'),  // light gray tile (lobby)
  F_BLUE:    T('interior', 2, 0, false, '#87B9CD'),  // blue-tinted mat
  F_TATAMI:  T('interior', 6, 3, false, '#B7B899'),  // warm green-gray tatami
  F_TAN:     T('interior', 0, 6, false, '#8E7850'),  // tan/light wood
  // Grass floor — 8 variants confirmed by pixel analysis (cols 2-4, rows 0-2 of terrain.png)
  F_GRASS:   T('terrain',  2, 0, false, '#536C2A'),
  F_GRASS_B: T('terrain',  3, 0, false, '#536C2A'),
  F_GRASS_C: T('terrain',  2, 1, false, '#536C2A'),
  F_GRASS_D: T('terrain',  3, 1, false, '#536C2A'),
  F_GRASS_E: T('terrain',  4, 1, false, '#536C2A'),
  F_GRASS_F: T('terrain',  2, 2, false, '#536C2A'),
  F_GRASS_G: T('terrain',  3, 2, false, '#536C2A'),
  F_GRASS_H: T('terrain',  4, 2, false, '#536C2A'),
  F_STONE:   T('terrain',  3, 3, false, '#737373'),  // gray stone/concrete
  F_LIGHT:   T('terrain',  6, 1, false, '#EEEEEE'),  // near-white paved
  F_SAND:    T16('terrain', 8, 8, false, '#CEC284'),  // sandy path — 16px native art
  F_SCHOOL:  T('school',   0, 0, false, '#F6F6F1'),  // classroom floor (near-white)
  F_SALON:   T('school',   0, 1, false, '#B7B899'),  // tatami/linoleum (salon)

  // ── Walls (solid) ────────────────────────────────────────────────────────
  WALL:      T('interior', 0, 0, true,  '#000000'),  // dark wall/border
  WALL2:     T('interior', 4, 0, true,  '#545454'),  // dark gray wall

  // ── Furniture/objects (solid) ────────────────────────────────────────────
  DESK:      T('interior', 4, 1, true,  '#4B2D1D'),  // dark brown desk surface
  DESK2:     T('interior', 4, 2, true,  '#4B2D1D'),  // desk variant
  SHELF:     T('interior', 0, 4, true,  '#4B2D1D'),  // dark brown bookshelf body
  SHELF2:    T('interior', 2, 4, true,  '#4B2D1D'),  // bookshelf section 2
  RECEPTION: T('interior', 3, 1, true,  '#65341A'),  // reception desk top
  CRAFT:     T('interior', 4, 3, true,  '#D4A060'),  // craft table surface
  CRAFT2:    T('interior', 5, 3, true,  '#C49050'),  // craft table variant
  BENCH:     T('interior', 4, 4, true,  '#E8E8E8'),  // bench/seat (white-ish)
  GATE:      Tp('terrain', 96, 64, true, '#808080'),  // gate/arch
  SWING:     Tp('infra',    0,  0, false,'#8A6030'),  // playground swing (decorative)

  // Tree placeholders — rendered via TREE_SPRITES (tall sprites), but listed here
  // so the collision system (is_solid_at → TILES[code].solid) treats them as blocking.
  TREE:  { img:'trees', sx:69,  sy:0, solid: true,  color:'#2a6a10' },
  TREE2: { img:'trees', sx:160, sy:2, solid: true,  color:'#1a4a0a' },
  TREE3: { img:'trees', sx:216, sy:1, solid: true,  color:'#3a5a20' },
};

// ── Character sprites ─────────────────────────────────────────────────────
// Each character occupies a 16×32px cell in the sprite sheet (verified: the old
// sw=47 / sw=31 measurements spanned 3 or 2 characters at once, causing the
// "multiple people" rendering bug).
// sx is rounded to the nearest 16px column start.
// Drawn at dw=TS (32px) × dh=48px on screen.
function P(sx, sy, img) {
  return { img: img||'people', sx, sy, sw: 16, sh: 32, dw: TS, dh: TS * 2 };
}

const CHARS = {
  player:         P( 80,  0),               // people.png col5 row0
  librarian:      P(112,  0, 'people2'),     // people2.png col7 row0
  receptionist:   P(128, 96),               // people.png col8 row3
  play_staff:     P( 48, 64),               // people.png col3 row2
  salon_staff:    P( 80, 96),               // people.png col5 row3
  guide:          P(208, 32),               // people.png col13 row1
  house_resident: P( 64, 32),               // people.png col4 row1
};

// ── Tree sprites (measured zero-density column boundaries in band0) ─────────
// Art is 16px native (same scale as T16 terrain tiles), so display at 2× source size.
// ay = display pixels from sprite top to ground contact (bottom of last opaque row × scale).
//   Aligns the visible trunk/shadow base with the tile anchor rather than the transparent
//   sprite bottom. Values derived from pixel analysis of tileset_trees.png.
// Band 0 top half (y=0-87): trees separated at x=32, x=61-68, x=107-122, x=148-154
// Band 1 (x=160-207): pine/conifer,  tight y=2..255 — use top 88px for crown
// Band 2 (x=216-246): shrub/small tree, tight y=1..180 — use top 88px
const _TS = TS / TS_ART; // art-to-game scale factor (2)
const TREE_SPRITES = {
  leafy_sm: { img:'trees', sx:0,   sy:0, sw:32, sh:88, dw:32*_TS, dh:88*_TS, ay:67*_TS },
  leafy_md: { img:'trees', sx:33,  sy:0, sw:28, sh:88, dw:28*_TS, dh:88*_TS, ay:80*_TS },
  leafy_lg: { img:'trees', sx:69,  sy:0, sw:38, sh:88, dw:38*_TS, dh:88*_TS, ay:82*_TS },
  leafy_xl: { img:'trees', sx:123, sy:0, sw:25, sh:88, dw:25*_TS, dh:88*_TS, ay:84*_TS },
  pine:     { img:'trees', sx:160, sy:2, sw:48, sh:88, dw:48*_TS, dh:88*_TS, ay:83*_TS },
  shrub:    { img:'trees', sx:216, sy:1, sw:31, sh:88, dw:31*_TS, dh:88*_TS },
};

// ── Library bookshelf strip (measured: y=127-175, full 256px wide) ───────────
// Draw as 32×32 crops from the bookshelf strip for wall-mounted shelves
const SHELF_STRIP = { img:'library', sx:0, sy:127, sw:256, sh:49 };

// ── Nine-patch tile groups (extendable bordered regions) ──────────────────────
// Each group has 9 tiles: TL TC TR / ML MC MR / BL BC BR.
// Draw with _pick_patch() + _draw_patch_tile() in render2d.js.
// All use T16 (16×16 art source, upscaled 2× to TS=32 on screen).
//
// Pixel coords verified by analyze_tiles7.js (tileHasContent + center-pixel checks):
//
// terrain.png road/curb border (cols 10-12, rows 0-2 at 16px):
//   r0: c10=#(grass+road TL) c11=#(top edge)   c12=#(road TR)
//   r1: c10=#(left edge)     c11=BLANK(center)  c12=#(right edge)
//   r2: c10=#(road BL)       c11=#(bot edge)    c12=#(road BR)
//
// terrain_2.png stone-to-grass border (cols 8-10, rows 0-2 at 16px):
//   r0: c8=gray c9=lt-gray c10=lt-gray (all solid stone top)
//   r1: c8=gray c9=gray    c10=gray    (all solid — stone floor inside)
//   r2: c8=olive c9=BLANK  c10=BLANK   (lower edge, right cells transparent)
//
// terrain_2.png pool/water-edge stone frame (cols 11-13, rows 6-8 at 16px):
//   r6: c11=lt-blue c12=lt-gray  c13=gray    (top)
//   r7: c11=lt-gray c12=BLANK    c13=gray    (center transparent)
//   r8: c11=lt-blue c12=lt-blue  c13=lt-blue (bottom)
//
// water.png water-body border 4×4 frame (cols 0-3, rows 0-3 at 16px):
//   Outer ring has content; inner (cols 1-2, rows 1-2) is transparent.
//   Extract 3×3 subset using cols 0,1,3 and rows 0,1,3.
//
// terrain_3.png grass edge overlay (cols 0-3, rows 0-3 at 16px):
//   Semi-transparent grass (varying alpha). Inner 2×2 blank.
//   Used as terrain blend overlay, not a hard room border.

const NINE_PATCH = {
  // Road/curb border — for outdoor grass rooms
  road_curb: {
    TL: T16('terrain', 10, 0), TC: T16('terrain', 11, 0), TR: T16('terrain', 12, 0),
    ML: T16('terrain', 10, 1), MC: T16('terrain', 11, 1), MR: T16('terrain', 12, 1),
    BL: T16('terrain', 10, 2), BC: T16('terrain', 11, 2), BR: T16('terrain', 12, 2),
  },
  // Stone-to-grass border — for stone-floored outdoor areas
  stone_border: {
    TL: T16('terrain2', 8, 0), TC: T16('terrain2', 9, 0), TR: T16('terrain2', 10, 0),
    ML: T16('terrain2', 8, 1), MC: T16('terrain2', 9, 1), MR: T16('terrain2', 10, 1),
    BL: T16('terrain2', 8, 2), BC: T16('terrain2', 9, 2), BR: T16('terrain2', 10, 2),
  },
  // Pool/water-edge stone frame — for areas bordering water
  pool_edge: {
    TL: T16('terrain2', 11, 6), TC: T16('terrain2', 12, 6), TR: T16('terrain2', 13, 6),
    ML: T16('terrain2', 11, 7), MC: T16('terrain2', 12, 7), MR: T16('terrain2', 13, 7),
    BL: T16('terrain2', 11, 8), BC: T16('terrain2', 12, 8), BR: T16('terrain2', 13, 8),
  },
  // Water body border — dark frame around water areas
  // 4×4 source frame → 9-patch using corners (cols 0,1,3) and (rows 0,1,3)
  water_edge: {
    TL: T16('water', 0, 0), TC: T16('water', 1, 0), TR: T16('water', 3, 0),
    ML: T16('water', 0, 1), MC: T16('water', 1, 1), MR: T16('water', 3, 1),
    BL: T16('water', 0, 3), BC: T16('water', 1, 3), BR: T16('water', 3, 3),
  },
  // Grass edge overlay — semi-transparent, for blending grass into other terrain
  grass_edge: {
    TL: T16('terrain3', 0, 0), TC: T16('terrain3', 1, 0), TR: T16('terrain3', 3, 0),
    ML: T16('terrain3', 0, 1), MC: T16('terrain3', 1, 1), MR: T16('terrain3', 3, 1),
    BL: T16('terrain3', 0, 3), BC: T16('terrain3', 1, 3), BR: T16('terrain3', 3, 3),
  },
  // Sandy path — terrain.png (16px native), some slots reuse tiles with flips
  sand_path: {
    TL: T16('terrain', 8, 8), TC: T16('terrain', 10, 8), TR: T16('terrain', 9, 8),
    ML: T16('terrain', 8, 9), MC: T16('terrain', 10, 10), MR: {...T16('terrain', 8, 9), flipX:true},
    BL: {...T16('terrain', 8, 8), flipY:true}, BC: {...T16('terrain', 10, 8), flipY:true}, BR: {...T16('terrain', 9, 8), flipY:true},
  },
};

// Grass variant pool — pixel-verified from terrain.png (cols 2-4, rows 0-2)
const FLOOR_VARIANTS = {
  F_GRASS: ['F_GRASS','F_GRASS_B','F_GRASS_C','F_GRASS_D','F_GRASS_E','F_GRASS_F','F_GRASS_G','F_GRASS_H'],
};
