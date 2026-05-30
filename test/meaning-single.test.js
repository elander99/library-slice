// Verifies every token meaning in the game is a single canonical value —
// no "/" separating synonyms. Pick one, commit to it.
// Run: node test/meaning-single.test.js

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

function load(filename) {
  // `const` in vm doesn't attach to the context object, so rewrite to `var`.
  const code = fs.readFileSync(path.join(__dirname, '..', 'content', filename), 'utf8')
    .replace(/\bconst\s+/g, 'var ');
  const ctx = vm.createContext({ console });
  vm.runInContext(code, ctx);
  return ctx;
}

// ── Load sign data ──────────────────────────────────────────────────────────
const { WORLD_SIGNS }    = load('world_signs.js');
const { WORLD_SIGNS_KO } = load('world_signs_ko.js');
const { SIGNS }          = load('signs.js');
const { SIGNS_KO }       = load('signs_ko.js');

// ── Canonical single meanings ───────────────────────────────────────────────
// Each entry: word (text field) → the one accepted meaning.
// No "/" allowed. If a word appears in multiple signs with the same meaning,
// one entry covers all of them.
const CANONICAL = {
  // ── world_signs.js (Japanese) ──────────────────────────────────────────
  'サロン':         'salon',
  '料理室':         'cooking room',
  '本日':           'today',
  '受付':           'reception',
  '終了':           'closed',
  'くつ':           'shoes',
  'ぬぎましょう':   'please remove',
  '小さい':         'small',
  'お子様':         'child',
  '大人':           'adult',
  '一緒に':         'together',
  '才':             'years old',
  'こども':         'child',
  '対象':           'intended for',
  '順番に':         'in turns',
  '仲よく':         'friendly',
  '使いましょう':   'please use',
  '飲食':           'eating and drinking',
  'ご遠慮':         'please refrain',
  '水分補給':       'hydration',
  '可':             'allowed',
  '乗っている':     'riding',
  '人':             'person',
  '通ります':       'will pass',
  '気をつけて':     'watch out',
  '以上':           'and over',
  '方':             'person',
  '小さな':         'small',
  '子':             'child',
  '道':             'path',
  '譲って':         'give way',
  'おかえりなさい': 'welcome back',
  'おぬぎ':         'please remove',
  'こたつ':         'kotatsu',
  'で':             'at',
  'あたたまろう':   "let's warm up",
  '今日':           'today',
  'の':             'possessive particle',
  '夕飯':           'dinner',
  'は':             'topic particle',
  'カレーライス':   'curry rice',
  'から':           'from',
  'まで':           'until',

  // ── world_signs_ko.js (Korean) ─────────────────────────────────────────
  '도서':     'books',
  '관':       'building',
  '요리':     'cooking',
  '실':       'room',
  '전시':     'exhibition',
  '오늘':     'today',
  '접수':     'reception',
  '마감':     'closed',
  '어린':     'young',
  '아이':     'child',
  '어른':     'adult',
  '함께':     'together',
  '3살':      '3 years old',
  '부터':     'from',
  '6살':      '6 years old',
  '까지':     'until',
  '위한':     'for',
  '공간':     'area',
  '차례차례': 'in turns',
  '사이좋게': 'friendly',
  '사용':     'use',
  '주세요':   'please',
  '음식물':   'food and drink',
  '반입':     'bringing in',
  '삼가':     'please refrain',
  '수분':     'water',
  '보충':     'replenishment',
  '가능':     'allowed',
  '합니다':   'is',
  '이용':     'use',
  '자':       'person',
  '지나가':   'pass',
  '주의':     'caution',
  '7살':      '7 years old',
  '이상':     'and over',
  '은':       'topic particle',
  '에게':     'to',
  '양보':     'give way',

  // ── signs.js (Japanese library rules) ─────────────────────────────────
  'コンセント': 'outlet',
  'ご使用':     'use',
  '業務':       'work',
  '関連':       'related',
  'する':       'to do',
  '場合':       'when',
  'のみ':       'only',
  '許可':       'permission',
  '館内':       'indoors',
  'では':       'inside',
  '静粛':       'silence',
  'に':         'particle',
  'して':       'doing',
  '携帯電話':   'mobile phone',
  'ご遠慮':     'please refrain',
  '飲食':       'eating and drinking',
  'での':       'inside',
  '固く':       'strictly',
  'お断り':     'prohibited',
  'します':     'we do',

  // ── signs_ko.js (Korean library rules) ────────────────────────────────
  'コンセント': 'outlet',   // appears in ko file too
  '콘센트':     'outlet',
  '업무':       'work',
  '전용':       'exclusively for',
  '으로':       'by',
  '해':         'please do',
  '관내':       'indoors',
  '에서':       'at',
  '조용히':     'quietly',
  '휴대':       'portable',
  '전화':       'phone',
  '통화':       'phone call',
  '음식':       'food',
  '물':         'substance',
  '섭취':       'consumption',
  '금지':       'prohibited',
  '되어':       'become',
  '있습니다':   'there is',
};

// ── Walk all tokens in a sign array ────────────────────────────────────────
function* tokens(signs) {
  for (const sign of (signs || [])) {
    for (const tok of (sign.tokens || [])) {
      yield { sign: sign.id, tok };
      for (const part of (tok.parts || [])) yield { sign: sign.id, tok: part };
    }
  }
}

// ── Check ──────────────────────────────────────────────────────────────────
const all = [
  ...tokens(WORLD_SIGNS),
  ...tokens(WORLD_SIGNS_KO),
  ...tokens(SIGNS),
  ...tokens(SIGNS_KO),
];

let pass = 0, fail = 0;
const failures = [];

for (const { sign, tok } of all) {
  if (!tok.meaning) continue;
  const canonical = CANONICAL[tok.text];
  if (canonical === undefined) continue; // word not in our list — skip

  // Fail if meaning contains "/" (synonym list) or doesn't match canonical
  if (tok.meaning !== canonical) {
    fail++;
    failures.push({ sign, word: tok.text, got: tok.meaning, want: canonical });
  } else {
    pass++;
  }
}

if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) {
    console.log(`  [${f.sign}] "${f.word}": got "${f.got}" — want "${f.want}"`);
  }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
