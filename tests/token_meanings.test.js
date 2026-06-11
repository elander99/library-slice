// TDD spec for Korean sign token meaning strings.
// Reads the actual content files — a failing test means the data is wrong.
//
// To add coverage for a new word: add it to EXPECTED and run the tests.
// If the test is red, update the content file (or KO_FALLBACK) to match.

const fs   = require('fs');
const path = require('path');

function loadVar(file, varName) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'content', file), 'utf8');
  // new Function wraps the source so const/let declarations are accessible via return
  // eslint-disable-next-line no-new-func
  return new Function(`${src}; return ${varName}`)();
}

function allTokens(signs) {
  const out = [];
  for (const sign of signs) {
    for (const tok of (sign.tokens || [])) {
      out.push({ ...tok, _sign: sign.id });
      for (const part of (tok.parts || []))
        out.push({ ...part, _sign: sign.id, _parent: tok.text });
    }
  }
  return out;
}

const signsKo      = loadVar('signs_ko.js',      'SIGNS_KO');
const worldSignsKo = loadVar('world_signs_ko.js', 'WORLD_SIGNS_KO');
const tokens       = [...allTokens(signsKo), ...allTokens(worldSignsKo)];

// Canonical meaning spec — authoritative mapping from token text → expected meaning.
// One entry covers all occurrences of that text across all signs.
// Add a new entry here BEFORE updating the content file (red → green workflow).
const EXPECTED = {
  // ── outlet sign ─────────────────────────────────────────────────────────────
  '콘센트':     'outlet',
  '도서관':     'library',
  '도서':       'books',
  '관':         'building',
  '업무':       'work',
  '전용':       'exclusively for',
  '사용':       'use',
  '해':         'please do',

  // ── quiet sign ───────────────────────────────────────────────────────────────
  '관내':       'indoors',
  '조용히':     'quietly',
  '통화':       'phone call',
  '삼가':       'refrain',   // "please" belongs to 주세요 — not to the verb

  // ── food sign ────────────────────────────────────────────────────────────────
  '음식물':     'food and drink',
  '음식':       'food',
  '물':         'substance',
  '섭취':       'consumption',
  '금지':       'prohibited',
  '되어':       'become',
  '있습니다':   'there is',

  // ── lobby directory ──────────────────────────────────────────────────────────
  '어린이':     'child',
  '살롱':       'salon',
  '요리실':     'cooking room',
  '요리':       'cooking',
  '실':         'room',
  '완구':       'toys',
  '전시관':     'exhibition hall',
  '전시':       'exhibition',

  // ── lobby reception ──────────────────────────────────────────────────────────
  '오늘':       'today',
  '접수':       'reception',
  '마감':       'closed',
  '되었습니다': 'has been done',

  // ── play area ────────────────────────────────────────────────────────────────
  '신발':       'shoes',
  '벗어':       'take off',
  '어린':       'young',
  '아이':       'child',
  '어른':       'adult',
  '함께':       'together',
  '부터':       'from',
  '까지':       'until',
  '위한':       'for',
  '공간':       'area',

  // ── salon ────────────────────────────────────────────────────────────────────
  '차례차례':   'in turns',
  '사이좋게':   'friendly',
  '반입':       'bringing in',
  '수분':       'water',
  '보충':       'replenishment',
  '가능':       'allowed/possible/ok/okay',
  '합니다':     'is',

  // ── outdoor ──────────────────────────────────────────────────────────────────
  '짚라인':     'zipline',
  '이용자':     'user',
  '이용':       'use',
  '자':         'person',
  '지나가':     'pass',
  '주의':       'caution',
  '이상':       'and over',
  '양보':       'give way',
};

describe('Korean sign token meanings', () => {
  test.each(Object.entries(EXPECTED))('%s → "%s"', (text, expected) => {
    const matches = tokens.filter(t => t.text === text);
    expect(matches.length).toBeGreaterThan(0);
    matches.forEach(tok =>
      expect(tok.meaning).toBe(expected)
    );
  });
});
