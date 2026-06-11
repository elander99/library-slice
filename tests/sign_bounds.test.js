// TDD: no world sign should render outside the room's pixel boundary.
//
// Regression guard for house_menu_only which was placed at col:60 — one
// column past the 60-wide map boundary — causing the sign to extend ~80px
// off the right edge of the screen.
//
// Contract:
//   For every sign placement (sign_id, col) in every room, the rendered
//   sign panel must fit entirely within [0, room_cols * TS].
//
// The sign width formula (from render2d._draw_sign_hotspots):
//   sw = max_line_chars * CHAR_W + PAD_X * 2
//   wx_c = col * TS + TS / 2          (world-space centre)
//   wx_l = wx_c - sw / 2  ≥ 0
//   wx_r = wx_c + sw / 2  ≤ room_cols * TS
//
// Character width is estimated conservatively at 1.1 × FONT_SZ (16.5 px)
// for full-width CJK/Korean/Japanese glyphs.  This matches measured canvas
// widths within ~5% for Noto Serif JP at 15 px.

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── rendering constants (must match render2d.js) ─────────────────────────
const TS      = 32;
const FONT_SZ = 15;
const PAD_X   = 12;
// 1.1× gives a safe upper bound for full-width CJK character widths at FONT_SZ
const CHAR_W  = FONT_SZ * 1.1;

// All rooms share the same dimensions
const ROOM_COLS = 60;
const WORLD_PX  = ROOM_COLS * TS; // 1920

// ── load a sign array from a content file ────────────────────────────────
// Content files look like:  const WORLD_SIGNS_KO = [ { id: "...", ... }, ... ];
// We extract the array literal and evaluate it (plain data — no side effects).
function loadSignArray(relPath) {
  const src   = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  const start = src.indexOf('[');
  const end   = src.lastIndexOf(']') + 1;
  return new Function('return ' + src.slice(start, end))();
}

function buildById(signs) {
  const m = {};
  signs.forEach(s => { m[s.id] = s; });
  return m;
}

const jpById = buildById([
  ...loadSignArray('content/world_signs.js'),
]);

const koById = buildById([
  ...loadSignArray('content/world_signs_ko.js'),
]);

// ── extract all sign placements from maps.js ─────────────────────────────
// Matches  { sign_id:'foo', col:N, row:N }  in any sign array.
function extractPlacements(src) {
  const re = /\{\s*sign_id\s*:\s*'([^']+)'\s*,\s*col\s*:\s*(\d+)\s*,\s*row\s*:\s*(\d+)\s*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ sign_id: m[1], col: parseInt(m[2], 10), row: parseInt(m[3], 10) });
  }
  return out;
}

const mapsSrc    = fs.readFileSync(path.join(ROOT, 'engine/maps.js'), 'utf8');
const placements = extractPlacements(mapsSrc);

// ── helpers ──────────────────────────────────────────────────────────────
function approxSignWidth(japaneseText) {
  const lines    = japaneseText.split('\n');
  const maxChars = Math.max(...lines.map(l => l.length));
  return maxChars * CHAR_W + PAD_X * 2;
}

// ── tests ─────────────────────────────────────────────────────────────────
describe('world signs: no sign overflows room boundaries', () => {
  for (const [lang, byId] of [['JP', jpById], ['KO', koById]]) {
    describe(`${lang} signs`, () => {
      for (const sg of placements) {
        const sign = byId[sg.sign_id];
        if (!sign) continue; // sign only exists in the other language

        test(`${sg.sign_id} (col ${sg.col}) fits within world width`, () => {
          const text = sign.japanese || sign.tokens.map(t => t.text).join('');
          const sw   = approxSignWidth(text);
          const wx_c = sg.col * TS + TS / 2;
          const wx_l = wx_c - sw / 2;
          const wx_r = wx_c + sw / 2;

          expect(wx_l).toBeGreaterThanOrEqual(0);
          expect(wx_r).toBeLessThanOrEqual(WORLD_PX);
        });
      }
    });
  }
});
