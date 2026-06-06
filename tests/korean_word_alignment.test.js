// TDD: Korean words in the workspace-panel chips row must appear on the
// same horizontal line regardless of token type, completion state, or
// whether an input slot is currently active.
//
// Root cause: compound (parts) tokens conditionally omit their whole-reading
// <span> from the DOM once allPRomaji is true, making them ~22px shorter.
// With align-items:center on .ws-merged-chip this shifts the Korean text
// of those tokens down relative to adjacent simple tokens.
//
// Contract:
//   1. The whole-reading slot for compound tokens is ALWAYS in the DOM
//      (never conditionally skipped).
//   2. When allPRomaji is true and the slot is not the active input,
//      the slot receives class "slot-spacer" — invisible but still
//      occupies its full height.
//   3. .ws-token-reading.slot-spacer uses visibility:hidden (not
//      display:none, which would collapse height).

const fs   = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function getCSSProp(selector, prop) {
  const esc = selector.replace(/[#.()\[\]:]/g, '\\$&');
  const re  = new RegExp(esc + '\\s*\\{[^}]*?\\b' + prop + '\\s*:\\s*([^;\\n}]+)', 's');
  const m   = html.match(re);
  return m ? m[1].trim() : null;
}

function extractFnBody(header) {
  const start = html.indexOf(header);
  if (start === -1) return null;
  let depth = 0, i = start, body = '';
  while (i < html.length) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (depth === 0) { body = html.slice(start, i + 1); break; } }
    i++;
  }
  return body;
}

const renderChipsSrc = extractFnBody('function _render_chips()');

// ── CSS contract ─────────────────────────────────────────────────────────────

describe('CSS: slot-spacer keeps height without being visible', () => {
  test('.ws-token-reading.slot-spacer has visibility:hidden', () => {
    const v = getCSSProp('.ws-token-reading.slot-spacer', 'visibility');
    expect(v).toBe('hidden');
  });

  test('.ws-token-reading.slot-spacer does NOT use display:none (that would collapse height)', () => {
    const d = getCSSProp('.ws-token-reading.slot-spacer', 'display');
    expect(d === null || d !== 'none').toBe(true);
  });
});

// ── JS contract: wrspan is always appended ───────────────────────────────────

describe('_render_chips: compound-token whole-reading slot is always in the DOM', () => {
  test('_render_chips source exists', () => {
    expect(renderChipsSrc).not.toBeNull();
  });

  test('slot-spacer class is used in _render_chips', () => {
    expect(renderChipsSrc).toMatch(/slot-spacer/);
  });

  test('span.appendChild(wrspan) appears exactly once (unconditional, not per-branch)', () => {
    const matches = [...renderChipsSrc.matchAll(/span\.appendChild\(wrspan\)/g)];
    expect(matches.length).toBe(1);
  });

  test('the unconditional wrspan append comes after the slot-spacer else branch', () => {
    const spacerIdx  = renderChipsSrc.indexOf('slot-spacer');
    const appendIdx  = renderChipsSrc.indexOf('span.appendChild(wrspan)');
    expect(spacerIdx).toBeGreaterThan(-1);
    expect(appendIdx).toBeGreaterThan(-1);
    expect(appendIdx).toBeGreaterThan(spacerIdx);
  });
});
