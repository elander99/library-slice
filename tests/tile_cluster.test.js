// TDD: tile_cluster_rect — BFS bounding box for a connected same-code tile group.
//
// Contract:
//   tile_cluster_rect(room, tc, tr) → {wx, wy, ww, wh} | null
//
//   Returns null for:
//     • floor (non-solid) tiles — highlight stays single-tile
//     • WALL / WALL2         — perimeter would be huge
//     • empty/unknown codes
//
//   Otherwise: BFS all 4-connected tiles with the same code, return bounding box.

global.TS = 32;

global.TILES = {
  TREE:   { solid: true  },
  TREE2:  { solid: true  },
  TREE3:  { solid: true  },
  SHELF:  { solid: true  },
  SHELF2: { solid: true  },
  DESK:   { solid: true  },
  WALL:   { solid: true  },
  WALL2:  { solid: true  },
  F_STONE: { solid: false },
  F_GRASS: { solid: false },
};

global.TILE_DEFS = {};  // not needed by tile_cluster_rect but required by input2d.js load

const { tile_cluster_rect } = require('../engine/input2d.js');

// ── Helpers ────────────────────────────────────────────────────────────────

function emptyGrid(cols, rows, fill = '') {
  return Array.from({ length: rows }, () => new Array(cols).fill(fill));
}

function makeRoom(tiles, cols = tiles[0].length, rows = tiles.length) {
  return { tiles, cols, rows, floor: '', objects: [] };
}

// ── Single-tile cluster ────────────────────────────────────────────────────

describe('tile_cluster_rect: single isolated tile', () => {
  test('one TREE tile → 1×1 rect at that tile', () => {
    const tiles = emptyGrid(10, 10);
    tiles[4][5] = 'TREE';
    const r = tile_cluster_rect(makeRoom(tiles), 5, 4);
    expect(r).toEqual({ wx: 5*32, wy: 4*32, ww: 32, wh: 32 });
  });

  test('one SHELF tile → 1×1 rect', () => {
    const tiles = emptyGrid(10, 10);
    tiles[2][3] = 'SHELF';
    const r = tile_cluster_rect(makeRoom(tiles), 3, 2);
    expect(r).toEqual({ wx: 3*32, wy: 2*32, ww: 32, wh: 32 });
  });
});

// ── Rectangular cluster ────────────────────────────────────────────────────

describe('tile_cluster_rect: rectangular block', () => {
  // Place a 3-wide × 4-tall TREE3 block at cols 2-4, rows 3-6 (like street map)
  function streetTreeRoom() {
    const tiles = emptyGrid(60, 27);
    for (let r = 3; r <= 6; r++)
      for (let c = 2; c <= 4; c++)
        tiles[r][c] = 'TREE3';
    return makeRoom(tiles, 60, 27);
  }

  test('hover on top-left of block → full block rect', () => {
    const r = tile_cluster_rect(streetTreeRoom(), 2, 3);
    expect(r).toEqual({ wx: 2*32, wy: 3*32, ww: 3*32, wh: 4*32 });
  });

  test('hover on center of block → same full block rect', () => {
    const r = tile_cluster_rect(streetTreeRoom(), 3, 4);
    expect(r).toEqual({ wx: 2*32, wy: 3*32, ww: 3*32, wh: 4*32 });
  });

  test('hover on bottom-right of block → same full block rect', () => {
    const r = tile_cluster_rect(streetTreeRoom(), 4, 6);
    expect(r).toEqual({ wx: 2*32, wy: 3*32, ww: 3*32, wh: 4*32 });
  });
});

// ── Two separate clusters don't merge ─────────────────────────────────────

describe('tile_cluster_rect: separate clusters are independent', () => {
  function twoTreeRoom() {
    const tiles = emptyGrid(20, 10);
    // Block A: cols 2-3, rows 2-3
    for (let r = 2; r <= 3; r++)
      for (let c = 2; c <= 3; c++)
        tiles[r][c] = 'TREE';
    // Block B: cols 6-7, rows 2-3 (not adjacent to A)
    for (let r = 2; r <= 3; r++)
      for (let c = 6; c <= 7; c++)
        tiles[r][c] = 'TREE';
    return makeRoom(tiles, 20, 10);
  }

  test('hover on block A returns only A bounding box', () => {
    const r = tile_cluster_rect(twoTreeRoom(), 2, 2);
    expect(r).toEqual({ wx: 2*32, wy: 2*32, ww: 2*32, wh: 2*32 });
  });

  test('hover on block B returns only B bounding box', () => {
    const r = tile_cluster_rect(twoTreeRoom(), 6, 2);
    expect(r).toEqual({ wx: 6*32, wy: 2*32, ww: 2*32, wh: 2*32 });
  });
});

// ── Excluded types return null ─────────────────────────────────────────────

describe('tile_cluster_rect: excluded tile types return null', () => {
  test('WALL tile returns null', () => {
    const tiles = emptyGrid(10, 10);
    tiles[0][0] = 'WALL';
    expect(tile_cluster_rect(makeRoom(tiles), 0, 0)).toBeNull();
  });

  test('WALL2 tile returns null', () => {
    const tiles = emptyGrid(10, 10);
    tiles[1][1] = 'WALL2';
    expect(tile_cluster_rect(makeRoom(tiles), 1, 1)).toBeNull();
  });

  test('floor tile (non-solid) returns null', () => {
    const tiles = emptyGrid(10, 10);
    tiles[3][3] = 'F_STONE';
    expect(tile_cluster_rect(makeRoom(tiles), 3, 3)).toBeNull();
  });

  test('empty string tile returns null', () => {
    const tiles = emptyGrid(10, 10); // all ''
    expect(tile_cluster_rect(makeRoom(tiles), 5, 5)).toBeNull();
  });

  test('code absent from TILES returns null', () => {
    const tiles = emptyGrid(10, 10);
    tiles[2][2] = 'UNKNOWN';
    expect(tile_cluster_rect(makeRoom(tiles), 2, 2)).toBeNull();
  });
});

// ── Mixed cluster: TREE adjacent to TREE2 does NOT merge ──────────────────

describe('tile_cluster_rect: different codes are not merged', () => {
  test('TREE next to TREE2 — cluster only covers the hovered code', () => {
    const tiles = emptyGrid(10, 10);
    tiles[3][3] = 'TREE';
    tiles[3][4] = 'TREE2'; // different code, adjacent
    // Hover on TREE tile → only that one tile (TREE2 is a different code)
    const r = tile_cluster_rect(makeRoom(tiles), 3, 3);
    expect(r).toEqual({ wx: 3*32, wy: 3*32, ww: 32, wh: 32 });
  });
});
