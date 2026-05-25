// TDD: tiles must render at their native (source) resolution.
//
// "Native resolution" has two properties:
//   1. No scaling inside drawImage itself — destination dimensions equal source dimensions
//      so the only scaling factor is the DPR canvas transform.
//   2. Draw positions snap to physical device pixels, not just CSS pixels, so tile
//      edges never land between physical pixels on HiDPI displays.
//
// The camera already snaps its offset to physical pixels (Math.round(cx*dpr)/dpr),
// which can produce sub-CSS-pixel positions like 45.5 at DPR=2. Math.floor would
// discard the .5 and shift the tile by 1 physical pixel — these tests catch that.

// ── Globals expected by render2d.js ─────────────────────────────────────────

global.TS     = 32;
global.TS_ART = 16;

global.TILES = {
  // T-style tile: 32×32 source (same as TS)
  F_WOOD:   { img: 'interior', sx: 32, sy: 0,  solid: false, color: '#66381A' },
  // T16-style tile: 16×16 source (smaller than TS)
  T16_WALL: { img: 'terrain',  sx: 0,  sy: 0,  tw: 16, th: 16, solid: true, color: '#888' },
};

global.window = {
  devicePixelRatio: 2,
  innerWidth: 800,
  innerHeight: 600,
  addEventListener: () => {},
};

// Stubs for symbols referenced at class-definition time (not needed by the methods
// under test, but required so the require() doesn't throw a ReferenceError).
global.ROOM_MAP_DATA = {};
global.CHARS         = {};
global.NPC_DEFS      = {};
global.DIALOGUE      = { actions: {} };
global.SIGN_BY_ID    = {};
global.GRASS_OVERLAYS = [];
global.NINE_PATCH    = {};
global.TREE_SPRITES  = {};
global.LANG          = { current: 'jp' };

// ── Load module ──────────────────────────────────────────────────────────────

const { Renderer2D } = require('../engine/render2d.js');

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRenderer(dpr = 2) {
  const drawCalls = [];
  const fillCalls = [];
  const mockCtx = {
    drawImage: (...args) => drawCalls.push(args),
    fillRect:  (...args) => fillCalls.push(args),
    set fillStyle(_) {},
  };
  const mockImg = { complete: true, naturalWidth: 100 };
  // Bypass the constructor (which needs a real canvas/window) via Object.create.
  const renderer = Object.create(Renderer2D.prototype);
  renderer.ctx   = mockCtx;
  renderer._dpr  = dpr;
  renderer._imgs = { interior: mockImg, terrain: mockImg };
  return { renderer, drawCalls, fillCalls };
}

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
//           [0]   [1] [2] [3]     [4]      [5] [6] [7]     [8]
const SRC_W = 3, SRC_H = 4, DST_X = 5, DST_Y = 6, DST_W = 7, DST_H = 8;

// ── _draw_tile ───────────────────────────────────────────────────────────────

describe('_draw_tile: native source size', () => {
  test('T tile (32×32 source) draws at 32×32 destination', () => {
    const { renderer, drawCalls } = makeRenderer();
    renderer._draw_tile('F_WOOD', 0, 0);

    expect(drawCalls).toHaveLength(1);
    const call = drawCalls[0];
    expect(call[DST_W]).toBe(call[SRC_W]); // dw === sw
    expect(call[DST_H]).toBe(call[SRC_H]); // dh === sh
    expect(call[DST_W]).toBe(32);
  });

  test('T16 tile (16×16 source) draws at 16×16 — not upscaled to TS=32', () => {
    const { renderer, drawCalls } = makeRenderer();
    renderer._draw_tile('T16_WALL', 0, 0);

    expect(drawCalls).toHaveLength(1);
    const call = drawCalls[0];
    expect(call[SRC_W]).toBe(16);          // source is 16
    expect(call[DST_W]).toBe(call[SRC_W]); // destination matches source
    expect(call[DST_H]).toBe(call[SRC_H]);
    expect(call[DST_W]).toBe(16);          // NOT 32
  });

  test('fallback fillRect uses native source size (not TS) when image absent', () => {
    const { renderer, fillCalls } = makeRenderer();
    renderer._imgs = {}; // no images available

    renderer._draw_tile('T16_WALL', 0, 0);

    expect(fillCalls).toHaveLength(1);
    const [, , fw, fh] = fillCalls[0]; // fillRect(x, y, w, h)
    expect(fw).toBe(16);
    expect(fh).toBe(16);
  });
});

describe('_draw_tile: physical-pixel position snapping', () => {
  test('integer position passes through unchanged at DPR=1', () => {
    const { renderer, drawCalls } = makeRenderer(1);
    renderer._draw_tile('F_WOOD', 64, 32);

    const call = drawCalls[0];
    expect(call[DST_X]).toBe(64);
    expect(call[DST_Y]).toBe(32);
  });

  test('at DPR=2 a .5 CSS-pixel position is preserved (already a physical pixel)', () => {
    // Camera snapping at DPR=2 produces half-CSS-pixel offsets like 45.5.
    // Math.floor would wrongly discard the .5, shifting the tile 1 physical pixel.
    const { renderer, drawCalls } = makeRenderer(2);
    renderer._draw_tile('F_WOOD', 45.5, 10.5);

    const call = drawCalls[0];
    expect(call[DST_X]).toBe(45.5); // 45.5 × 2 = 91 physical px ✓
    expect(call[DST_Y]).toBe(10.5);
  });

  test('at DPR=2 a non-pixel-boundary position rounds to nearest physical pixel', () => {
    // 45.3 CSS: Math.floor → 45 (90 physical), Math.round(×2)/2 → 45.5 (91 physical)
    const { renderer, drawCalls } = makeRenderer(2);
    renderer._draw_tile('F_WOOD', 45.3, 0);

    const call = drawCalls[0];
    // Result must be a physical-pixel-aligned CSS value: call[DST_X] × dpr is integer
    expect(call[DST_X] * 2).toBe(Math.round(45.3 * 2));
  });

  test('at DPR=3 position rounds to nearest third-CSS-pixel', () => {
    const { renderer, drawCalls } = makeRenderer(3);
    renderer._draw_tile('F_WOOD', 10.4, 0);

    const call = drawCalls[0];
    expect(call[DST_X] * 3).toBe(Math.round(10.4 * 3));
  });
});

// ── _draw_patch_tile ─────────────────────────────────────────────────────────

describe('_draw_patch_tile: physical-pixel position snapping', () => {
  const ptile = { img: 'terrain', sx: 0, sy: 0, tw: 16, th: 16 };

  test('integer position passes through unchanged', () => {
    const { renderer, drawCalls } = makeRenderer(2);
    renderer._draw_patch_tile(ptile, 32, 64);

    const call = drawCalls[0];
    expect(call[DST_X]).toBe(32);
    expect(call[DST_Y]).toBe(64);
  });

  test('at DPR=2 a .5 CSS-pixel position is preserved', () => {
    const { renderer, drawCalls } = makeRenderer(2);
    renderer._draw_patch_tile(ptile, 45.5, 10.5);

    const call = drawCalls[0];
    expect(call[DST_X]).toBe(45.5);
    expect(call[DST_Y]).toBe(10.5);
  });

  test('at DPR=2 a non-boundary position rounds to nearest physical pixel', () => {
    const { renderer, drawCalls } = makeRenderer(2);
    renderer._draw_patch_tile(ptile, 45.3, 0);

    const call = drawCalls[0];
    expect(call[DST_X] * 2).toBe(Math.round(45.3 * 2));
  });
});
