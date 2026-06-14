// TDD: Parts produced by _ko_split_words must always have romaji set to a
// digit-free romanization string. Regression test for the "31일 → 31il" bug
// (digits passing through before Sino-Korean conversion was added to romanizeKo)
// and for the follow-on issue where auto-split parts had `reading` but not
// `romaji`, making the workspace panel unable to check or display the answer.

const fs   = require('fs');
const path = require('path');

// Load romanizeKo
const romanizeSrc = fs.readFileSync(path.join(__dirname, '..', 'engine', 'romanize_ko.js'), 'utf8');
// eslint-disable-next-line no-new-func
const romanizeKo = new Function(romanizeSrc + '; return romanizeKo')();

// Load _KO_FALLBACK and _KO_PARTICLES from workspace.js
const workspaceSrc = fs.readFileSync(path.join(__dirname, '..', 'ui', 'workspace.js'), 'utf8');

function loadKoFallback() {
  const start = workspaceSrc.indexOf('_KO_FALLBACK = {') + '_KO_FALLBACK = '.length;
  const end   = workspaceSrc.indexOf('\n    };', start) + '\n    }'.length;
  // eslint-disable-next-line no-new-func
  return new Function(`return ${workspaceSrc.slice(start, end)}`)();
}
function loadKoParticles() {
  const start = workspaceSrc.indexOf('const _KO_PARTICLES = [') + 'const _KO_PARTICLES = '.length;
  const end   = workspaceSrc.indexOf('\n    ]', start) + '\n    ]'.length;
  // eslint-disable-next-line no-new-func
  return new Function(`return ${workspaceSrc.slice(start, end)}`)();
}

// Reconstruct _ko_split_words exactly as it appears in workspace.js,
// injecting romanizeKo and the fallback dicts as upvalues.
function buildSplitWords(romanizeKo, _KO_FALLBACK, _KO_PARTICLES) {
  const _KO_NO_SPLIT = new Set([
    '안녕하세요','안녕하십시오','감사합니다','감사해요','죄송합니다','죄송해요',
    '괜찮아요','괜찮습니다','실례합니다','어서오세요','잘부탁합니다',
  ]);
  function _ko_base_raw(w) {
    for (const p of _KO_PARTICLES) {
      if (w.length > p.length && w.endsWith(p)) return w.slice(0, -p.length);
    }
    return null;
  }

  // Extract _ko_split_words body from workspace.js and patch in the upvalues.
  // This mirrors the actual production code so the test stays in sync.
  const fnStart = workspaceSrc.indexOf('function _ko_split_words(words, defs)');
  // Walk braces to find end of function
  let depth = 0, i = fnStart;
  while (i < workspaceSrc.length) {
    if (workspaceSrc[i] === '{') depth++;
    else if (workspaceSrc[i] === '}') { depth--; if (depth === 0) { i++; break; } }
    i++;
  }
  const fnSrc = workspaceSrc.slice(fnStart, i);
  // eslint-disable-next-line no-new-func
  return new Function('romanizeKo', '_KO_FALLBACK', '_ko_base_raw', '_KO_NO_SPLIT', `${fnSrc}; return _ko_split_words;`)(
    romanizeKo, _KO_FALLBACK, _ko_base_raw, _KO_NO_SPLIT
  );
}

const _KO_FALLBACK  = loadKoFallback();
const _KO_PARTICLES = loadKoParticles();
const split = buildSplitWords(romanizeKo, _KO_FALLBACK, _KO_PARTICLES);

// ── helpers ───────────────────────────────────────────────────────────────────

// Returns the base part (index 0) for a word whose suffix was stripped
function basePart(word) {
  const { defs } = split([word], null);
  return defs[0]?.parts?.[0];
}

// ── N일 base-part romaji tests ─────────────────────────────────────────────
// These words appear in NPC birthday sentences. The particle suffix is stripped
// and the remaining "N일" base must have a digit-free romaji so that:
//   • _checkWhat() can verify the player's typed answer
//   • the reading slot can display the correct romanization after answering

describe('_ko_split_words — N일 part romaji is set and digit-free', () => {
  const cases = [
    // word,          expected base-part text, expected romaji
    ['1일이에요.',    '1일',    'iril'       ],
    ['3일이에요.',    '3일',    'samil'      ],
    ['5일이에요.',    '5일',    'oil'        ],
    ['7일이에요.',    '7일',    'chiril'     ],
    ['23일이에요.',   '23일',   'isipsamil'  ],
    ['31일이에요.',   '31일',   'samsibiril' ],
  ];

  test.each(cases)('%s base part has romaji set', (word, expectedText, expectedRomaji) => {
    const part = basePart(word);
    expect(part).toBeDefined();
    expect(part.text).toBe(expectedText);
    // romaji must be set (not undefined) so the workspace panel can verify answers
    expect(part.romaji).toBeDefined();
    expect(part.romaji).not.toMatch(/\d/);
    expect(part.romaji).toBe(expectedRomaji);
  });
});

// ── No digit leakage in whole-word reading ────────────────────────────────────
describe('_ko_split_words — whole-word reading for N일 words is digit-free', () => {
  test('31일! whole-token reading has no digit', () => {
    const { defs } = split(['31일!'], null);
    expect(defs[0].reading).not.toMatch(/\d/);
    expect(defs[0].reading).toBe('samsibiril');
  });

  test('1일. whole-token reading has no digit', () => {
    const { defs } = split(['1일.'], null);
    expect(defs[0].reading).not.toMatch(/\d/);
    expect(defs[0].reading).toBe('iril');
  });

  test('5월 31일 — both tokens digit-free', () => {
    const { defs } = split(['5월', '31일'], null);
    expect(defs[0].reading).not.toMatch(/\d/);
    expect(defs[1].reading).not.toMatch(/\d/);
  });
});
