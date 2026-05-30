// Tests for Korean romaji (romanization) matching.
// Run: node test/romaji-match.test.js
//
// Mirrors _normRomaji + the romaji branch of _checkWhat() from index.html.
// The critical invariant: only the *correct* romanization (and close variants)
// should match. Wrong LLM-hallucinated romanizations must be rejected.

function normRomaji(s) {
  return s.toLowerCase().replace(/[-\s]+/g, "").replace(/ou/g, "o").replace(/uu/g, "u").replace(/aa/g, "a");
}

function matchesRomaji(wordRomaji, input) {
  const val_ns = input.trim().toLowerCase().replace(/\s+/g, "");
  return normRomaji(val_ns) === normRomaji(wordRomaji);
}

// Each case: [korean, correct_romaji, input, shouldPass, note?]
const cases = [
  // ── 하세요 (please do / are you — polite honorific) ───────────────────────
  // Bug: Ollama returned "Hae-si" which incorrectly matched.
  // Fix: _KO_FALLBACK must supply reading "haseyo" so Ollama is never called.
  ['하세요', 'haseyo', 'haseyo',   true],
  ['하세요', 'haseyo', 'ha-se-yo', true,  'hyphen variant'],
  ['하세요', 'haseyo', 'ha se yo', true,  'space variant'],
  ['하세요', 'haseyo', 'hae-si',   false, 'wrong — what Ollama hallucinated'],
  ['하세요', 'haseyo', 'haesi',    false, 'wrong romanization'],
  ['하세요', 'haseyo', 'hasiyo',   false, 'wrong romanization'],
  ['하세요', 'haseyo', 'haseo',    false, 'wrong romanization'],

  // ── 해요 (to do — polite) ─────────────────────────────────────────────────
  ['해요', 'haeyo', 'haeyo',   true],
  ['해요', 'haeyo', 'hae-yo',  true,  'hyphen variant'],
  ['해요', 'haeyo', 'heyo',    false, 'wrong'],
  ['해요', 'haeyo', 'hayo',    false, 'wrong'],

  // ── 합니다 (to do — formal) ───────────────────────────────────────────────
  ['합니다', 'hamnida', 'hamnida',  true],
  ['합니다', 'hamnida', 'ham-nida', true, 'hyphen variant'],
  ['합니다', 'hamnida', 'hapnida',  false, 'wrong — romanizes the ㅂ literally'],

  // ── 안녕하세요 (hello — formal) ───────────────────────────────────────────
  ['안녕하세요', 'annyeonghaseyo', 'annyeonghaseyo', true],
  ['안녕하세요', 'annyeonghaseyo', 'annyeong haseyo', true, 'space variant'],
  ['안녕하세요', 'annyeonghaseyo', 'anyonghaseyo',   false, 'wrong romanization'],

  // ── 감사합니다 (thank you — formal) ──────────────────────────────────────
  ['감사합니다', 'gamsahamnida', 'gamsahamnida',  true],
  ['감사합니다', 'gamsahamnida', 'gamsahabnida',  false, 'wrong — common misspelling'],

  // ── normRomaji rules ──────────────────────────────────────────────────────
  ['봐요', 'bwayo', 'bwayo', true],
  // ou→o collapsing (Japanese rule, should not incorrectly affect Korean)
  ['오', 'o',  'o',  true],
  ['오', 'o',  'ou', true,  'ou→o normalization applies'],
];

// ── Run ────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const failures = [];

for (const [korean, romaji, input, expected, note] of cases) {
  const got = matchesRomaji(romaji, input);
  if (got === expected) {
    pass++;
  } else {
    fail++;
    failures.push({ korean, romaji, input, expected, got, note });
  }
}

if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) {
    const label = f.expected ? '✗ should accept' : '✗ should reject';
    console.log(`  ${label} "${f.input}" for ${f.korean} (romaji: ${f.romaji})${f.note ? ' — ' + f.note : ''}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
