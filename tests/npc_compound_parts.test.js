// TDD spec for compound NPC word parts breakdowns in _KO_FALLBACK.
// Reads workspace.js directly — a failing test means the data is wrong.
//
// To add a new compound: append to EXPECTED_PARTS (red), then add parts to
// workspace.js _KO_FALLBACK (green).  Parts texts must concatenate to the word.

const fs   = require('fs');
const path = require('path');

function loadKoFallback() {
  const src   = fs.readFileSync(path.join(__dirname, '..', 'ui', 'workspace.js'), 'utf8');
  const start = src.indexOf('_KO_FALLBACK = {') + '_KO_FALLBACK = '.length;
  const end   = src.indexOf('\n    };', start) + '\n    }'.length;
  // eslint-disable-next-line no-new-func
  return new Function(`return ${src.slice(start, end)}`)();
}

const FALLBACK = loadKoFallback();

// ── Compound parts spec ──────────────────────────────────────────────────────
// Each entry: [word, [{text, romaji, meaning}, ...]]
// Parts texts must concatenate to the whole word (checked automatically below).

const EXPECTED_PARTS = [
  ['오셨어요', [
    { text: '오',   romaji: 'o',      meaning: 'come'           },
    { text: '셨',   romaji: 'syeoss', meaning: 'honorific past' },
    { text: '어요', romaji: 'eoyo',   meaning: 'polite ending'  },
  ]],
  ['재미있게', [
    { text: '재미', romaji: 'jaemi', meaning: 'fun / interest' },
    { text: '있',   romaji: 'it',    meaning: 'to have'        },
    { text: '게',   romaji: 'ge',    meaning: 'in a ~ way'     },
  ]],
  ['계신가요', [
    { text: '계신', romaji: 'gyesin', meaning: 'honorific present (be / exist)' },
    { text: '가요', romaji: 'gayo',   meaning: 'polite question ending'         },
  ]],
];

describe('NPC compound word parts', () => {
  test.each(EXPECTED_PARTS)('%s has correct parts breakdown', (word, expected) => {
    const entry = FALLBACK[word];
    expect(entry).toBeDefined();
    expect(Array.isArray(entry.parts)).toBe(true);
    expect(entry.parts.length).toBe(expected.length);
    expected.forEach(({ text, romaji, meaning }, i) => {
      expect(entry.parts[i].text).toBe(text);
      expect(entry.parts[i].romaji).toBe(romaji);
      expect(entry.parts[i].meaning).toBe(meaning);
    });
    // structural invariant: parts must reassemble to the full word
    expect(entry.parts.map(p => p.text).join('')).toBe(word);
  });
});
