// TDD: hover_highlight_rect — computes the world-space rect to brighten on hover.
//
// Contract:
//   hover_highlight_rect(wx, wy, room) → {wx, wy, ww, wh} | null
//
//   Priority order: named objects > tile TILE_DEF > null.
//
//   Objects: single-tile → {obj.col*TS, obj.row*TS, TS, TS}.
//            tile_rect   → covers full [c1,r1,c2,r2] rect.
//   Tiles:   resolved = tile_code || room.floor; returns single tile if TILE_DEF exists.
//   null:    tile has no TILE_DEF and no object at that position.

global.TS = 32;

// Minimal TILE_DEFS — just enough for the tests below
global.TILE_DEFS = {
  F_STONE: { label_en: 'Street' },
  TREE:    { label_en: 'Tree'   },
  SHELF:   { label_en: 'Bookshelf' },
  WALL:    { label_en: 'Wall'   },
};

const { hover_highlight_rect } = require('../engine/input2d.js');

// ── Helpers ────────────────────────────────────────────────────────────────

// Build a minimal room with given floor, tiles grid, and objects.
function makeRoom({ floor = '', tiles = null, objects = [], cols = 10, rows = 10 } = {}) {
  // Default tiles: all empty string (→ default floor)
  const t = tiles || Array.from({ length: rows }, () => new Array(cols).fill(''));
  return { floor, tiles: t, objects, cols, rows };
}

// ── Single-tile objects ────────────────────────────────────────────────────

describe('hover_highlight_rect: single-tile objects', () => {
  const laptop = { id: 'laptop', col: 4, row: 3 };
  const room   = makeRoom({ objects: [laptop] });

  test('hovering anchor tile returns that tile rect', () => {
    // world coords at center of (col=4, row=3)
    const r = hover_highlight_rect(4 * 32 + 16, 3 * 32 + 16, room);
    expect(r).toEqual({ wx: 4 * 32, wy: 3 * 32, ww: 32, wh: 32 });
  });

  test('hovering adjacent tile returns null (no object there)', () => {
    const r = hover_highlight_rect(5 * 32 + 16, 3 * 32 + 16, room);
    // No object at (5,3) and default floor '' with no TILE_DEF → null
    expect(r).toBeNull();
  });

  test('hovering anchor top-left pixel still hits the tile', () => {
    const r = hover_highlight_rect(4 * 32, 3 * 32, room);
    expect(r).toEqual({ wx: 4 * 32, wy: 3 * 32, ww: 32, wh: 32 });
  });
});

// ── Multi-tile objects (tile_rect) ─────────────────────────────────────────

describe('hover_highlight_rect: tile_rect objects', () => {
  // Kotatsu spans cols 22-28, rows 11-13
  const kotatsu = { id: 'kotatsu', col: 25, row: 12, tile_rect: [22, 11, 28, 13] };
  const room = makeRoom({ objects: [kotatsu], cols: 60, rows: 27 });

  test('hovering anchor tile returns full tile_rect', () => {
    const r = hover_highlight_rect(25 * 32 + 16, 12 * 32 + 16, room);
    expect(r).toEqual({
      wx: 22 * 32,
      wy: 11 * 32,
      ww: (28 - 22 + 1) * 32,
      wh: (13 - 11 + 1) * 32,
    });
  });

  test('hovering top-left corner of rect returns full tile_rect', () => {
    const r = hover_highlight_rect(22 * 32 + 1, 11 * 32 + 1, room);
    expect(r).toEqual({
      wx: 22 * 32,
      wy: 11 * 32,
      ww: (28 - 22 + 1) * 32,
      wh: (13 - 11 + 1) * 32,
    });
  });

  test('hovering bottom-right corner of rect returns full tile_rect', () => {
    const r = hover_highlight_rect(28 * 32 + 1, 13 * 32 + 1, room);
    expect(r).toEqual({
      wx: 22 * 32,
      wy: 11 * 32,
      ww: (28 - 22 + 1) * 32,
      wh: (13 - 11 + 1) * 32,
    });
  });

  test('hovering outside tile_rect returns null', () => {
    // tile (21,12) is just outside left edge of tile_rect
    const r = hover_highlight_rect(21 * 32 + 16, 12 * 32 + 16, room);
    expect(r).toBeNull();
  });
});

// ── Tile descriptions ──────────────────────────────────────────────────────

describe('hover_highlight_rect: tiles with TILE_DEF', () => {
  test('explicit tile code with TILE_DEF returns single tile rect', () => {
    const tiles = Array.from({ length: 5 }, () => new Array(5).fill(''));
    tiles[2][3] = 'SHELF'; // place SHELF at (col=3, row=2)
    const room = makeRoom({ floor: 'F_STONE', tiles });

    const r = hover_highlight_rect(3 * 32 + 16, 2 * 32 + 16, room);
    expect(r).toEqual({ wx: 3 * 32, wy: 2 * 32, ww: 32, wh: 32 });
  });

  test('empty tile resolves to room floor — F_STONE → returns rect', () => {
    const room = makeRoom({ floor: 'F_STONE' });
    const r = hover_highlight_rect(2 * 32 + 4, 1 * 32 + 4, room);
    expect(r).toEqual({ wx: 2 * 32, wy: 1 * 32, ww: 32, wh: 32 });
  });

  test('empty tile with floor that has no TILE_DEF returns null', () => {
    const room = makeRoom({ floor: 'F_WOOD' }); // not in our mock TILE_DEFS
    const r = hover_highlight_rect(2 * 32 + 4, 1 * 32 + 4, room);
    expect(r).toBeNull();
  });

  test('explicit tile with no TILE_DEF returns null', () => {
    const tiles = Array.from({ length: 5 }, () => new Array(5).fill(''));
    tiles[1][1] = 'UNKNOWN_CODE';
    const room = makeRoom({ floor: 'F_STONE', tiles });
    const r = hover_highlight_rect(1 * 32 + 16, 1 * 32 + 16, room);
    expect(r).toBeNull();
  });
});

// ── Object priority over tile ──────────────────────────────────────────────

describe('hover_highlight_rect: object takes priority over tile', () => {
  test('object at a tile with TILE_DEF → returns object rect, not tile rect', () => {
    const obj  = { id: 'phone', col: 2, row: 2 };
    // Place a SHELF tile at the same location
    const tiles = Array.from({ length: 5 }, () => new Array(5).fill(''));
    tiles[2][2] = 'SHELF';
    const room = makeRoom({ floor: 'F_STONE', tiles, objects: [obj] });

    const r = hover_highlight_rect(2 * 32 + 16, 2 * 32 + 16, room);
    // Object wins — size is exactly TS×TS at the object's anchor
    expect(r).toEqual({ wx: 2 * 32, wy: 2 * 32, ww: 32, wh: 32 });
    // (rect ww/wh = TS, not tile_rect-sized — confirmed by single-tile path)
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────

describe('hover_highlight_rect: edge cases', () => {
  test('null room returns null', () => {
    expect(hover_highlight_rect(100, 100, null)).toBeNull();
  });

  test('undefined room returns null', () => {
    expect(hover_highlight_rect(100, 100, undefined)).toBeNull();
  });

  test('world coords at exact tile origin still land in that tile', () => {
    const room = makeRoom({ floor: 'F_STONE' });
    const r = hover_highlight_rect(3 * 32, 3 * 32, room);
    expect(r).toEqual({ wx: 3 * 32, wy: 3 * 32, ww: 32, wh: 32 });
  });
});
