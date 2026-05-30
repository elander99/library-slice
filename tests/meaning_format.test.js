// Meaning-matching contract tests.
//
// Two rules enforced everywhere in the game:
//   1. No static meaning alternative may start with "to <verb>" — player types
//      "go", not "to go".
//   2. The matcher must normalise "to <verb>" and comma-separated alternatives
//      so Ollama outputs like "to go, to leave" work at runtime.

const fs   = require('fs');
const path = require('path');

// ── contract: mirrors the normalization the matcher must apply ───────────────
function matchesMeaning(playerInput, meaning) {
  const norm  = s => s.replace(/[?!.,]+$/, '');
  const parts = meaning
    .replace(/\(.*?\)/g, '')
    .toLowerCase()
    .split(/\s*[/,]\s*/)                       // split on "/" and ","
    .map(p => norm(p.trim()).replace(/^to\s+/, ''))  // strip leading "to "
    .filter(Boolean);
  const v    = norm(playerInput.toLowerCase());
  const v_ns = norm(playerInput.toLowerCase().replace(/\s+/g, ''));
  return parts.some(p => v === p || v_ns === p.replace(/\s+/g, ''));
}

// ── static meaning extraction ────────────────────────────────────────────────
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extractFallbackMeanings(src) {
  const block = src.match(/_KO_FALLBACK\s*=\s*\{([\s\S]*?)\};/)?.[1] || '';
  return [...block.matchAll(/meaning\s*:\s*'([^']+)'/g)].map(m => m[1]);
}

const fallbackMeanings = extractFallbackMeanings(indexHtml);

// ── matcher behaviour tests ──────────────────────────────────────────────────
describe('meaning matcher', () => {
  test('"go"    matches "go / leave"',            () => expect(matchesMeaning('go',    'go / leave')).toBe(true));
  test('"leave" matches "go / leave"',            () => expect(matchesMeaning('leave', 'go / leave')).toBe(true));
  test('"go"    matches "to go, to leave"',       () => expect(matchesMeaning('go',    'to go, to leave')).toBe(true));
  test('"leave" matches "to go, to leave"',       () => expect(matchesMeaning('leave', 'to go, to leave')).toBe(true));
  test('"play"  matches "to play / visit"',       () => expect(matchesMeaning('play',  'to play / visit')).toBe(true));
  test('"rest"  matches "to rest"',               () => expect(matchesMeaning('rest',  'to rest')).toBe(true));
  test('"exist" matches "there is / is / exist"', () => expect(matchesMeaning('exist', 'there is / is / exist')).toBe(true));
});

// ── static data format ───────────────────────────────────────────────────────
describe('KO_FALLBACK meaning format', () => {
  // Split on "/" and check each alternative; strip parens first.
  const toVerbAlt = meaning =>
    meaning.replace(/\(.*?\)/g, '').split('/').map(p => p.trim())
      .filter(p => /^to [a-z]+$/.test(p));   // "to go", "to rest", etc.

  test('no alternative starts with "to <verb>"', () => {
    const violations = fallbackMeanings
      .filter(m => toVerbAlt(m).length > 0)
      .map(m => `${m} → bad alts: [${toVerbAlt(m).join(', ')}]`);
    expect(violations).toEqual([]);
  });
});
