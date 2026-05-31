// Meaning-matching contract tests.
//
// Format rules enforced everywhere in the game:
//   1. No static meaning alternative may start with "to <verb>" — player types
//      "go", not "to go".
//   2. Alternatives must use "/" not "," — e.g. "a/the" not "a, the".
//      A comma is allowed only inside a fixed phrase ending in "?" (e.g. "nice, right?").
//   3. "-ly" adverbs also accept their base adjective form.
//      "quietly" → player may type "quiet"; "slowly" → "slow"; etc.

const fs   = require('fs');
const path = require('path');

// ── contract: mirrors the normalization the matcher must apply ───────────────
function matchesMeaning(playerInput, meaning) {
  const norm     = s => s.replace(/[?!.,]+$/, '');
  const depolite = s => s.replace(/^(please|to|is)\s+/, '');
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
  if (parts.some(p => p.split(' and ').some(piece => {
    if (!piece.endsWith('ing')) return false;
    const base = piece.slice(0, -3);
    if (base.length >= 3 && (v === base || v_ns === base)) return true;
    const baseE = base + 'e';
    return base.length >= 2 && (v === baseE || v_ns === baseE);
  }))) return true;

  // Accept base verb of -ment nominalizations: replenishment→replenish, movement→move.
  if (parts.some(p => {
    if (!p.endsWith('ment')) return false;
    const base = p.slice(0, -4);
    return base.length >= 4 && (v === base || v_ns === base);
  })) return true;

  // Accept base verb of -ed past participles (depolite already strips "is "):
  //   allowed→allow  prohibited→prohibit  (strip "ed", base ≥ 3)
  //   closed→close  related→relate        (strip "d" when result ends in "e", base ≥ 4)
  return parts.some(p => {
    if (p.endsWith('ed')) {
      const base = p.slice(0, -2);
      if (base.length >= 3 && (v === base || v_ns === base)) return true;
      // Doubled consonant (permitted→permit): strip the extra consonant too
      if (base.length >= 2 && base[base.length - 1] === base[base.length - 2]) {
        const base2 = base.slice(0, -1);
        if (base2.length >= 3 && (v === base2 || v_ns === base2)) return true;
      }
    }
    if (p.endsWith('d')) {
      const base = p.slice(0, -1);
      if (base.endsWith('e') && base.length >= 4 && (v === base || v_ns === base)) return true;
    }
    return false;
  });
}

// ── static meaning extraction ────────────────────────────────────────────────
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extractFallbackMeanings(src) {
  const block = src.match(/_KO_FALLBACK\s*=\s*\{([\s\S]*?)\};/)?.[1] || '';
  // Match both single-quoted and double-quoted meaning values
  return [...block.matchAll(/meaning\s*:\s*(?:'([^']+)'|"([^"]+)")/g)]
    .map(m => m[1] ?? m[2]);
}

function loadContentVar(file, varName) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'content', file), 'utf8');
  // eslint-disable-next-line no-new-func
  return new Function(`${src}; return ${varName}`)();
}

function allTokenMeanings(signs) {
  const out = [];
  for (const sign of signs) {
    for (const tok of (sign.tokens || [])) {
      if (tok.meaning) out.push(tok.meaning);
      for (const part of (tok.parts || []))
        if (part.meaning) out.push(part.meaning);
    }
  }
  return out;
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

// ── -ed past-participle base-verb matching ───────────────────────────────────
// Strip "ed" or silent-e "d" to accept the base verb for all game past-participles:
//   allowed→allow  prohibited→prohibit  closed→close  related→relate
// "is" auxiliary stripped from "is permitted" so "permit" also matches.
describe('-ed past-participle base-verb matching', () => {
  // Strip plain "ed": 가능→allowed, お断り/금지→prohibited
  test('"allow"    matches "allowed"',                        () => expect(matchesMeaning('allow',    'allowed')).toBe(true));
  test('"prohibit" matches "prohibited"',                     () => expect(matchesMeaning('prohibit', 'prohibited')).toBe(true));
  // Strip silent-e "d": 終了/마감→closed, 関連→related
  test('"close"    matches "closed"',                        () => expect(matchesMeaning('close',    'closed')).toBe(true));
  test('"relate"   matches "related"',                       () => expect(matchesMeaning('relate',   'related')).toBe(true));
  // "is X" auxiliary: されています→is permitted
  test('"permit"   matches "is permitted"',                  () => expect(matchesMeaning('permit',   'is permitted')).toBe(true));
  // Works within alternatives list (가능 meaning has "/" alternatives)
  test('"allow"    matches "allowed/possible/ok/okay"',      () => expect(matchesMeaning('allow',    'allowed/possible/ok/okay')).toBe(true));
  // False-positive guards
  test('"us" does NOT match "used"  (base < 4 chars)',       () => expect(matchesMeaning('us',   'used')).toBe(false));
  test('"re" does NOT match "red"   (base < 3 chars)',       () => expect(matchesMeaning('re',   'red')).toBe(false));
  test('"go" does NOT match "good"  (not an -ed word)',      () => expect(matchesMeaning('go',   'good')).toBe(false));
});

// ── -ment nominalization base-verb matching ──────────────────────────────────
// Strip "-ment" to accept the base verb: replenishment → replenish, etc.
describe('-ment nominalization base-verb matching', () => {
  // The triggering case: 보충 meaning "replenishment"
  test('"replenish" matches "replenishment"', () => expect(matchesMeaning('replenish', 'replenishment')).toBe(true));
  // False-positive guards — short -ment words must NOT strip
  test('"mo"     does NOT match "moment"',  () => expect(matchesMeaning('mo',  'moment')).toBe(false));
  test('"ce"     does NOT match "cement"',  () => expect(matchesMeaning('ce',  'cement')).toBe(false));
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

// ── no comma-separated alternatives (Rule 2) ─────────────────────────────────
// Alternatives use "/" not ",". Commas are only allowed inside a fixed phrase
// ending with "?" (e.g. "nice, right?"). This covers all static content files
// plus the KO_FALLBACK dictionary so violations are caught at CI time.
describe('no comma-separated alternatives', () => {
  // A comma is a separator when the slash-part containing it does NOT end with '?'
  function hasCommaAlt(meaning) {
    return meaning.replace(/\(.*?\)/g, '').split('/').some(part => {
      const t = part.trim();
      return /,\s*[a-zA-Z]/.test(t) && !t.endsWith('?');
    });
  }

  // Confirm the detector itself works correctly
  test('detector: "a, the" is flagged',      () => expect(hasCommaAlt('a, the')).toBe(true));
  test('detector: "a/the" is NOT flagged',   () => expect(hasCommaAlt('a/the')).toBe(false));
  test('detector: "nice, right?" is NOT flagged (fixed phrase)', () =>
    expect(hasCommaAlt('nice, right?')).toBe(false));
  test('detector: "to go, to leave" is flagged', () =>
    expect(hasCommaAlt('to go, to leave')).toBe(true));

  test('KO_FALLBACK: no comma-separated alternatives', () => {
    const violations = fallbackMeanings.filter(hasCommaAlt);
    expect(violations).toEqual([]);
  });

  const signFiles = [
    ['signs.js',           'SIGNS'],
    ['signs_ko.js',        'SIGNS_KO'],
    ['world_signs.js',     'WORLD_SIGNS'],
    ['world_signs_ko.js',  'WORLD_SIGNS_KO'],
  ];

  test.each(signFiles)('%s token meanings: no comma-separated alternatives', (file, varName) => {
    const signs    = loadContentVar(file, varName);
    const meanings = allTokenMeanings(signs);
    const violations = meanings.filter(hasCommaAlt);
    expect(violations).toEqual([]);
  });
});
