// Meaning-matching contract tests.
//
// Two rules enforced everywhere in the game:
//   1. No static meaning alternative may start with "to <verb>" — player types
//      "go", not "to go".
//   2. The matcher must normalise "to <verb>" and comma-separated alternatives
//      so Ollama outputs like "to go, to leave" work at runtime.
//
// Rule 3 (added): "-ly" adverbs should also accept their base adjective form.
//   "quietly" → player may type "quiet"; "slowly" → "slow"; etc.

const fs   = require('fs');
const path = require('path');

// ── contract: mirrors the normalization the matcher must apply ───────────────
function matchesMeaning(playerInput, meaning) {
  const norm     = s => s.replace(/[?!.,]+$/, '');
  const depolite = s => s.replace(/^(please|to)\s+/, '');
  const parts = meaning
    .replace(/\(.*?\)/g, '')
    .toLowerCase()
    .split(/\s*[/,]\s*/)
    .map(p => depolite(norm(p.trim())))
    .filter(Boolean);
  const v    = depolite(norm(playerInput.toLowerCase()));
  const v_ns = depolite(norm(playerInput.toLowerCase().replace(/\s+/g, '')));
  if (parts.some(p => v === p || v_ns === p.replace(/\s+/g, ''))) return true;

  // Accept base adjective/adverb form of -ly adverbs:
  //   quietly→quiet  slowly→slow  strictly→strict  silently→silent
  //   comfortably→comfortable  amicably→amicable  enjoyably→enjoyable
  if (parts.some(p => {
    if (p.length < 6 || !p.endsWith('ly')) return false;
    const base = p.endsWith('ably') ? p.slice(0, -4) + 'able'
               : p.endsWith('ibly') ? p.slice(0, -4) + 'ible'
               : p.slice(0, -2);
    return base.length >= 4 && base !== 'friend' && (v === base || v_ns === base);
  })) return true;

  // Accept base verb of -ing gerunds; split on " and " within a part first.
  // base >= 3 chars for direct match; base+"e" when base >= 2 (silent-e verbs: take/use).
  return parts.some(p => p.split(' and ').some(piece => {
    if (!piece.endsWith('ing')) return false;
    const base = piece.slice(0, -3);
    if (base.length >= 3 && (v === base || v_ns === base)) return true;
    const baseE = base + 'e';
    return base.length >= 2 && (v === baseE || v_ns === baseE);
  }));
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

// ── -ly adverb base-form matching ────────────────────────────────────────────
describe('-ly adverb base-form matching', () => {
  // Words in actual sign tokens
  test('"quiet"       matches "quietly"',              () => expect(matchesMeaning('quiet',       'quietly')).toBe(true));
  test('"strict"      matches "strictly"',             () => expect(matchesMeaning('strict',      'strictly')).toBe(true));
  // Words in _KO_FALLBACK / NPC dialogue
  test('"slow"        matches "slowly"',               () => expect(matchesMeaning('slow',        'slowly')).toBe(true));
  test('"silent"      matches "silently"',             () => expect(matchesMeaning('silent',      'silently')).toBe(true));
  test('"quick"       matches "quickly"',              () => expect(matchesMeaning('quick',       'quickly')).toBe(true));
  test('"comfortable" matches "comfortably"',          () => expect(matchesMeaning('comfortable', 'comfortably')).toBe(true));
  test('"quiet"       matches "quietly / silently / please be quiet"', () =>
    expect(matchesMeaning('quiet', 'quietly / silently / please be quiet')).toBe(true));
  test('"slow"        matches "slowly / take your time"', () =>
    expect(matchesMeaning('slow', 'slowly / take your time')).toBe(true));
  // False-positive guards — these must NOT match
  test('"friend" does NOT match "friendly"',           () => expect(matchesMeaning('friend', 'friendly')).toBe(false));
  test('"on"     does NOT match "only"',               () => expect(matchesMeaning('on',     'only')).toBe(false));
});

// ── -ing gerund base-verb matching ───────────────────────────────────────────
// Split on " and " first, then strip "-ing" (≥ 6 chars), also try base + "e".
describe('-ing gerund base-verb matching', () => {
  // The triggering case: 섭취 meaning in KO_FALLBACK / updated sign token
  test('"eat"    matches "eating and drinking"',                    () => expect(matchesMeaning('eat',    'eating and drinking')).toBe(true));
  test('"drink"  matches "eating and drinking"',                    () => expect(matchesMeaning('drink',  'eating and drinking')).toBe(true));
  test('"eat"    matches "consumption / intake / eating and drinking"', () =>
    expect(matchesMeaning('eat', 'consumption / intake / eating and drinking')).toBe(true));
  test('"consume" matches "consumption / consume / intake / eating and drinking"', () =>
    expect(matchesMeaning('consume', 'consumption / consume / intake / eating and drinking')).toBe(true));
  // Other gerunds in the game
  test('"cook"   matches "cooking"',                               () => expect(matchesMeaning('cook',   'cooking')).toBe(true));
  test('"follow" matches "following"',                             () => expect(matchesMeaning('follow', 'following')).toBe(true));
  test('"take"   matches "taking"',                                () => expect(matchesMeaning('take',   'taking')).toBe(true));
  test('"use"    matches "using"',                                 () => expect(matchesMeaning('use',    'using')).toBe(true));
  // False-positive guards
  test('"king" does NOT match "king"',    () => expect(matchesMeaning('king', 'king')).toBe(true));   // exact match still works
  test('"ri"  does NOT match "ring"',     () => expect(matchesMeaning('ri',   'ring')).toBe(false));  // too short (4 chars)
  test('"br"  does NOT match "bring"',    () => expect(matchesMeaning('br',   'bring')).toBe(false)); // too short (5 chars)
});

// ── empty / blank input is always wrong ──────────────────────────────────────
// The LLM judge must NEVER be called with empty input — some models return "yes"
// for blank answers, which auto-fills slots without the player typing anything.
// This invariant is enforced by short-circuiting before any async call when
// raw.trim() === "".
describe('empty input is always wrong', () => {
  test('empty string does not match any meaning',   () => expect(matchesMeaning('',    'quietly')).toBe(false));
  test('whitespace does not match any meaning',     () => expect(matchesMeaning('   ', 'reception')).toBe(false));
  test('empty string does not match via -ly rule',  () => expect(matchesMeaning('',    'slowly')).toBe(false));
  test('empty string does not match short meaning', () => expect(matchesMeaning('',    'is')).toBe(false));
});

// ── static data format ───────────────────────────────────────────────────────
describe('KO_FALLBACK meaning format', () => {
  const toVerbAlt = meaning =>
    meaning.replace(/\(.*?\)/g, '').split('/').map(p => p.trim())
      .filter(p => /^to [a-z]+$/.test(p));

  test('no alternative starts with "to <verb>"', () => {
    const violations = fallbackMeanings
      .filter(m => toVerbAlt(m).length > 0)
      .map(m => `${m} → bad alts: [${toVerbAlt(m).join(', ')}]`);
    expect(violations).toEqual([]);
  });
});
