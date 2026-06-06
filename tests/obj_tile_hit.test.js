// TDD: obj_tile_hit — object tile hit detection contract.
//
// obj_tile_hit(obj, tc, tr) returns true when tile coord (tc, tr) should trigger
// an object's interaction:
//
//   tile_rect present:  hit iff tc∈[c1,c2] and tr∈[r1,r2] (inclusive)
//   no tile_rect:       hit iff tc===obj.col and tr===obj.row (single tile)
//
// This drives the click handler and cursor hover in input2d.js.  The rect is
// declared once in maps.js — no runtime flood-fill needed.

const { obj_tile_hit } = require('../engine/input2d.js');

// ── tile_rect objects ─────────────────────────────────────────────────────────

describe('obj_tile_hit: tile_rect [c1,r1,c2,r2]', () => {
  // Kotatsu: tile_rect covers cols 22-28, rows 11-13, anchor at col 25 row 12
  const kotatsu = { id: 'kotatsu', col: 25, row: 12, tile_rect: [22, 11, 28, 13] };

  test('anchor tile itself is a hit', () => {
    expect(obj_tile_hit(kotatsu, 25, 12)).toBe(true);
  });

  test('top-left corner of rect is a hit', () => {
    expect(obj_tile_hit(kotatsu, 22, 11)).toBe(true);
  });

  test('top-right corner of rect is a hit', () => {
    expect(obj_tile_hit(kotatsu, 28, 11)).toBe(true);
  });

  test('bottom-left corner of rect is a hit', () => {
    expect(obj_tile_hit(kotatsu, 22, 13)).toBe(true);
  });

  test('bottom-right corner of rect is a hit', () => {
    expect(obj_tile_hit(kotatsu, 28, 13)).toBe(true);
  });

  test('tile just outside left edge is a miss', () => {
    expect(obj_tile_hit(kotatsu, 21, 12)).toBe(false);
  });

  test('tile just outside right edge is a miss', () => {
    expect(obj_tile_hit(kotatsu, 29, 12)).toBe(false);
  });

  test('tile just above rect is a miss', () => {
    expect(obj_tile_hit(kotatsu, 25, 10)).toBe(false);
  });

  test('tile just below rect is a miss', () => {
    expect(obj_tile_hit(kotatsu, 25, 14)).toBe(false);
  });

  // Kitchen counter: tile_rect covers cols 40-54, rows 9-12, anchor at col 47 row 10
  const kitchen = { id: 'kitchen_counter', col: 47, row: 10, tile_rect: [40, 9, 54, 12] };

  test('kitchen counter: far corner is a hit', () => {
    expect(obj_tile_hit(kitchen, 40, 9)).toBe(true);
    expect(obj_tile_hit(kitchen, 54, 12)).toBe(true);
  });

  test('kitchen counter: one past the edge is a miss', () => {
    expect(obj_tile_hit(kitchen, 39, 10)).toBe(false);
    expect(obj_tile_hit(kitchen, 55, 10)).toBe(false);
    expect(obj_tile_hit(kitchen, 47,  8)).toBe(false);
    expect(obj_tile_hit(kitchen, 47, 13)).toBe(false);
  });

  // Genkan: tile_rect covers cols 2-7, rows 9-18, anchor at col 4 row 13
  const genkan = { id: 'genkan', col: 4, row: 13, tile_rect: [2, 9, 7, 18] };

  test('genkan: tile far from anchor within rect is a hit', () => {
    expect(obj_tile_hit(genkan, 2, 9)).toBe(true);
    expect(obj_tile_hit(genkan, 7, 18)).toBe(true);
    expect(obj_tile_hit(genkan, 6, 10)).toBe(true);
  });

  test('genkan: tile outside rect is a miss', () => {
    expect(obj_tile_hit(genkan, 1, 13)).toBe(false);
    expect(obj_tile_hit(genkan, 8, 13)).toBe(false);
    expect(obj_tile_hit(genkan, 4,  8)).toBe(false);
    expect(obj_tile_hit(genkan, 4, 19)).toBe(false);
  });
});

// ── single-tile objects (no tile_rect) ───────────────────────────────────────

describe('obj_tile_hit: no tile_rect — single tile only', () => {
  const laptop = { id: 'laptop', col: 12, row: 9 };

  test('anchor tile is a hit', () => {
    expect(obj_tile_hit(laptop, 12, 9)).toBe(true);
  });

  test('adjacent tile is a miss', () => {
    expect(obj_tile_hit(laptop, 13, 9)).toBe(false);
    expect(obj_tile_hit(laptop, 12, 10)).toBe(false);
    expect(obj_tile_hit(laptop, 11, 9)).toBe(false);
  });
});

// ── nearest-object resolution: when tile is in range of multiple objects ─────

describe('nearest object when overlapping ranges', () => {
  // Two objects whose tile_rects overlap (edge case: shouldn't occur in practice
  // but the function must still return true for the tile under each object).
  const objA = { id: 'a', col: 10, row: 5, tile_rect: [8, 4, 12, 6] };
  const objB = { id: 'b', col: 14, row: 5, tile_rect: [11, 4, 16, 6] };

  test('tile in objA rect hits objA', () => {
    expect(obj_tile_hit(objA, 9, 5)).toBe(true);
    expect(obj_tile_hit(objB, 9, 5)).toBe(false);
  });

  test('tile in objB rect hits objB', () => {
    expect(obj_tile_hit(objA, 15, 5)).toBe(false);
    expect(obj_tile_hit(objB, 15, 5)).toBe(true);
  });

  test('tile in overlapping zone hits both (caller picks nearest)', () => {
    expect(obj_tile_hit(objA, 11, 5)).toBe(true);
    expect(obj_tile_hit(objB, 11, 5)).toBe(true);
  });
});
