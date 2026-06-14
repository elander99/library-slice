// TDD: Korean words in the workspace-panel chips row must appear on the
// same horizontal line regardless of token type, completion state, or
// whether an input slot is currently active.
//
// Root cause (original): compound tokens omitted their whole-reading span
// when allPRomaji=true, causing compound-vs-compound height drift.
//
// Root cause (current): .ws-merged-chip uses align-items:center, so tokens
// of different heights (simple vs compound) center their midpoints — the
// Korean text ends up at DIFFERENT absolute y positions:
//   simple token:   Korean text at y=22 (one reading slot above)
//   compound token: Korean text at y=44 (wrspan 22 + part-reading 22)
// → 22px vertical offset between Korean words in the same row.
//
// Contract:
//   1. .ws-merged-chip uses align-items:flex-start so all tokens start
//      at the same top edge of the row.
//   2. The whole-reading slot for compound tokens (wrspan) is ALWAYS in
//      the DOM (never conditionally removed via JS).
//   3. CSS collapses the compound wrspan to height:0 when it is not
//      slot-active, so Korean text is at y=22 for both simple and compound
//      tokens. Rule targets:
//        .ws-token[data-has-parts] > .ws-token-reading:not(.slot-active)
//   4. .ws-token-reading.slot-spacer still uses visibility:hidden (so the
//      dashed border doesn't show on the collapsed spacer).

const fs   = require('fs');
const path = require('path');

const css         = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');
const workspaceSrc = fs.readFileSync(path.join(__dirname, '..', 'ui', 'workspace.js'), 'utf8');

function getCSSProp(selector, prop) {
  const esc = selector.replace(/[#.()\[\]:]/g, '\\$&');
  const re  = new RegExp(esc + '\\s*\\{[^}]*?\\b' + prop + '\\s*:\\s*([^;\\n}]+)', 's');
  const m   = css.match(re);
  return m ? m[1].trim() : null;
}

function extractFnBody(header) {
  const start = workspaceSrc.indexOf(header);
  if (start === -1) return null;
  let depth = 0, i = start, body = '';
  while (i < workspaceSrc.length) {
    if (workspaceSrc[i] === '{') depth++;
    else if (workspaceSrc[i] === '}') { depth--; if (depth === 0) { body = workspaceSrc.slice(start, i + 1); break; } }
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

// ── CSS contract: flex-start alignment pins all Korean text to the same y ────

describe('CSS: .ws-merged-chip uses align-items:flex-start for Korean text alignment', () => {
  test('.ws-merged-chip has align-items:flex-start (not center)', () => {
    const v = getCSSProp('.ws-merged-chip', 'align-items');
    expect(v).toBe('flex-start');
  });
});

// ── CSS contract: compound wrspan collapses to height:0 when not active ───────
//
// Simple token Korean text sits at y=22 (one 22px reading slot above).
// Compound token Korean text sits at y=44 (wrspan + part-reading above).
// Collapsing the wrspan to height:0 brings compound Korean text to y=22
// so both types are on the same horizontal line with align-items:flex-start.

describe('CSS: compound token wrspan collapses to height:0 when not slot-active', () => {
  // getCSSProp handles compound selectors — escape special chars then regex-search CSS.
  test('.ws-token[data-has-parts] > .ws-token-reading:not(.slot-active) has min-height:0', () => {
    const v = getCSSProp(
      '.ws-token[data-has-parts] > .ws-token-reading:not(.slot-active)',
      'min-height'
    );
    expect(v).toBe('0');
  });

  test('.ws-token[data-has-parts] > .ws-token-reading:not(.slot-active) has height:0', () => {
    const v = getCSSProp(
      '.ws-token[data-has-parts] > .ws-token-reading:not(.slot-active)',
      'height'
    );
    expect(v).toBe('0');
  });

  test('.ws-token[data-has-parts] > .ws-token-reading:not(.slot-active) has overflow:hidden', () => {
    const v = getCSSProp(
      '.ws-token[data-has-parts] > .ws-token-reading:not(.slot-active)',
      'overflow'
    );
    expect(v).toBe('hidden');
  });
});
