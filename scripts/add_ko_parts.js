#!/usr/bin/env node
// Automatically generate parts[] for Korean words in _KO_FALLBACK that can
// be decomposed into a stem + grammatical suffix.
//
// All part texts must concatenate to equal the original word.
//
// Usage:
//   node scripts/add_ko_parts.js           # dry run
//   node scripts/add_ko_parts.js --apply   # write changes to workspace.js

'use strict';
const fs   = require('fs');
const path = require('path');

const WS    = path.join(__dirname, '../ui/workspace.js');
const APPLY = process.argv.includes('--apply');

// ── 1. Extract _KO_FALLBACK ────────────────────────────────────────────────────

const src = fs.readFileSync(WS, 'utf8');

function extractFallback(src) {
  const lines = src.split('\n');
  const startIdx = lines.findIndex(l => /^\s*_KO_FALLBACK\s*=\s*\{/.test(l));
  const endIdx   = lines.findIndex((l, i) => i > startIdx && /^\s*\};\s*$/.test(l));
  if (startIdx === -1 || endIdx === -1) throw new Error('_KO_FALLBACK not found');

  const dict = {};
  const entryRe = /^\s*'([^']+)'\s*:\s*\{reading:'([^']*)',\s*meaning:(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/;
  for (let i = startIdx + 1; i < endIdx; i++) {
    const m = entryRe.exec(lines[i]);
    if (!m) continue;
    const [, word, reading, sq, dq] = m;
    const meaning = (sq !== undefined ? sq : dq) || '';
    const entry = { reading, meaning: meaning.replace(/\\'/g, "'") };
    const partsMatch = /,\s*parts:(.+?)\s*\},?/.exec(lines[i]);
    if (partsMatch) {
      try { entry.parts = Function('"use strict"; return (' + partsMatch[1] + ');')(); } catch (_) {}
    }
    dict[word] = entry;
  }
  return dict;
}

const DICT = extractFallback(src);

// ── 2. Suffix tables ──────────────────────────────────────────────────────────

const HADA_SUFFIXES = [
  ['하갘습니다', 'hagesseumnida', 'will do (formal)'],
  ['했습니다',       'haesseumnida',  'did (past formal)'],
  ['하갘어요',       'hagesseoyo',    'will do (polite)'],
  ['했어요',             'haesseoyo',     'did (past polite)'],
  ['하십시오',       'hasipsio',      'please do (formal)'],
  ['하시면',             'hasimyeon',     'if you do (honorific)'],
  ['하세요',             'haseyo',        'please do (honorific)'],
  ['합니다',             'hamnida',       'do/does (formal)'],
  ['하면서',             'hamyeonseo',    'while doing'],
  ['해서',                   'haeseo',        'doing / because'],
  ['하면',                   'hamyeon',       'if you do'],
  ['하고',                   'hago',          'doing / and'],
  ['해요',                   'haeyo',         'do/does (polite)'],
  ['해',                         'hae',           'do (casual)'],
];

const VERB_SUFFIXES = [
  ['었습니다', 'eosseumnida', 'did (past formal)'],
  ['았습니다', 'asseumnida',  'did (past formal)'],
  ['갘어요',       'gesseoyo',    'will (polite)'],
  ['었어요',       'eosseoyo',    'did (past polite)'],
  ['았어요',       'asseoyo',     'did (past polite)'],
  ['어요',             'eoyo',        'polite ending'],
  ['아요',             'ayo',         'polite ending'],
];

// ── 3. Hardcoded irregular / contracted forms ─────────────────────────────────

function P(text, romaji, meaning) {
  return { text, furigana: text, romaji, meaning };
}

// Irregular verbs that end in 요 — text split at 요 so parts concatenate correctly.
// e.g. '몰라' + '요' = '몰라요' ✓
const IRREGULAR_YO = {
  '몰라요': [P('몰라', 'molla', 'don\'t know (모르다, ㄹ irr)'), P('요', 'yo', 'polite ending')],
  '골라요': [P('골라', 'golla', 'choose (고르다, ㄹ irr)'), P('요', 'yo', 'polite ending')],
  '불러요': [P('불러', 'bulleo', 'call / sing (부르다, ㄹ irr)'), P('요', 'yo', 'polite ending')],
  '봐요': [P('봐', 'bwa', 'see / look (보다, 보+아→봐)'), P('요', 'yo', 'polite ending')],
  '와요': [P('와', 'wa',  'come (오다, 오+아→와)'),         P('요', 'yo', 'polite ending')],
  '줘요': [P('줘', 'jwo', 'give (주다, 주+어→줘)'), P('요', 'yo', 'polite ending')],
  '마셔요': [P('마셔', 'masyeo', 'drink (마시다, 이+어→여)'), P('요', 'yo', 'polite ending')],
  '달려요': [P('달려', 'dallyeo', 'run (달리다, 이+어→여)'), P('요', 'yo', 'polite ending')],
  '빌려요': [P('빌려', 'billyeo', 'borrow (빌리다, 이+어→여)'), P('요', 'yo', 'polite ending')],
  '느껴요': [P('느껴', 'neukkyeo', 'feel (느끼다, 이+어→여)'), P('요', 'yo', 'polite ending')],
  '기다려요': [P('기다려', 'gidaryeo', 'wait (기다리다, 이+어→여)'), P('요', 'yo', 'polite ending')],
  '가르쳐요': [P('가르쳐', 'gareuchyeo', 'teach (가르치다, 이+어→여)'), P('요', 'yo', 'polite ending')],
  '배워요': [P('배워', 'baewo', 'learn (배우다, 우+어→워)'), P('요', 'yo', 'polite ending')],
  '쉬워요': [P('쉬워', 'swiwo', 'easy (쉽다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '어려워요': [P('어려워', 'eoryeowo', 'difficult (어렵다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '귀여워요': [P('귀여워', 'gwiyeowo', 'cute (귀엽다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '무서워요': [P('무서워', 'museowoyo', 'scary (무섭다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '무거워요': [P('무거워', 'mugeowoyo', 'heavy (무겁다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '가벼워요': [P('가벼워', 'gabyeowoyo', 'light (가볍다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '차가워요': [P('차가워', 'chagawoyo', 'cold/touch (차갑다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '더워요': [P('더워', 'deowoyo', 'hot/weather (덥다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '추워요': [P('추워', 'chuwoyo', 'cold/weather (춥다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '시끄러워요': [P('시끄러워', 'sikkeureowoyo', 'noisy (시끄럽다, ㅂ irr)'), P('요', 'yo', 'polite ending')],
  '써요': [P('써', 'sseo', 'write / use (쓰다, ㅡ irr)'), P('요', 'yo', 'polite ending')],
  '나빠요': [P('나빠', 'nappa', 'bad (나쁘다, ㅡ irr)'), P('요', 'yo', 'polite ending')],
  '예뻐요': [P('예뻐', 'yeppeo', 'pretty (예쁘다, ㅡ irr)'), P('요', 'yo', 'polite ending')],
  '바빠요': [P('바빠', 'bappa', 'busy (바쁘다, ㅡ irr)'), P('요', 'yo', 'polite ending')],
  '아파요': [P('아파', 'apa', 'hurt / sick (아프다, ㅡ irr)'), P('요', 'yo', 'polite ending')],
  '빨개요': [P('빨개', 'palgae', 'red (빨갛다, ㅎ irr)'), P('요', 'yo', 'polite ending')],
  '파래요': [P('파래', 'parae', 'blue (파랗다, ㅎ irr)'), P('요', 'yo', 'polite ending')],
  '노래요': [P('노래', 'norae', 'yellow (노랗다, ㅎ irr)'), P('요', 'yo', 'polite ending')],
  '그래요': [P('그래', 'geurae', 'like that (그러다 stem)'), P('요', 'yo', 'polite ending')],
};

// Other irregular forms where split is at a non-요 boundary
const IRREGULAR_OTHER = {
  '있어요': [P('있', 'it', 'exist / have'), P('어요', 'eoyo', 'polite ending')],
  '없어요': [P('없', 'eops', 'not exist / not have'), P('어요', 'eoyo', 'polite ending')],
  '있는지': [P('있', 'it', 'exist / have'), P('는지', 'neunji', 'whether / if')],
  '맞아요': [P('맞', 'maj', 'correct / right'), P('아요', 'ayo', 'polite ending')],
  '같아요': [P('같', 'gat', 'seem / same'), P('아요', 'ayo', 'polite ending')],
  '알겠어요': [P('알', 'al', 'know / understand'), P('겠어요', 'gesseoyo', 'will / conjecture (polite)')],
  '모르겠어요': [P('모르', 'moreu', 'not know (모르다 stem)'), P('겠어요', 'gesseoyo', 'will / conjecture (polite)')],
  '좋겠다': [P('좋', 'jo', 'good'), P('겠다', 'getda', 'would be / conjecture')],
  '들어요': [P('들', 'deul', 'listen / enter (듣다, ㄷ irr)'), P('어요', 'eoyo', 'polite ending')],
  '재미있어요': [P('재미있', 'jaemiit', 'interesting (재미+있다)'), P('어요', 'eoyo', 'polite ending')],
  '재미없다': [P('재미없', 'jaemieop', 'boring (재미+없다)'), P('다', 'da', 'dictionary form')],
  '맛있어요': [P('맛있', 'masit', 'delicious (맛+있다)'), P('어요', 'eoyo', 'polite ending')],
  '맛없어요': [P('맛없', 'maseops', 'tasteless (맛+없다)'), P('어요', 'eoyo', 'polite ending')],
};

// ── 4. Decomposition logic ────────────────────────────────────────────────────

function stemRomaji(dictEntry, hada) {
  const r = dictEntry.reading;
  if (hada) return r.endsWith('hada') ? r.slice(0, -4) : r.endsWith('da') ? r.slice(0, -2) : r;
  return r.endsWith('da') ? r.slice(0, -2) : r;
}

function tryHada(word) {
  for (const [sfx, sfxR, sfxM] of HADA_SUFFIXES) {
    if (word.length <= sfx.length || !word.endsWith(sfx)) continue;
    const noun = word.slice(0, -sfx.length);
    const nounEntry = DICT[noun];
    if (nounEntry) return [P(noun, nounEntry.reading, nounEntry.meaning), P(sfx, sfxR, sfxM)];
    const hadaEntry = DICT[noun + '하다'];
    if (hadaEntry) return [P(noun, stemRomaji(hadaEntry, true), hadaEntry.meaning), P(sfx, sfxR, sfxM)];
  }
  return null;
}

function tryVerb(word) {
  for (const [sfx, sfxR, sfxM] of VERB_SUFFIXES) {
    if (word.length <= sfx.length || !word.endsWith(sfx)) continue;
    const stem = word.slice(0, -sfx.length);
    const base = DICT[stem + '다'];
    if (!base) continue;
    return [P(stem, stemRomaji(base, false), base.meaning), P(sfx, sfxR, sfxM)];
  }
  return null;
}

// Contracted 요: 가다→가요, 만나다→만나요, 서다→서요 (open syllable + 아/어 fuses)
function tryContractedYo(word) {
  if (!word.endsWith('요') || word.length < 2) return null;
  const stem = word.slice(0, -1);
  const base = DICT[stem + '다'];
  if (!base) return null;
  const code = stem.codePointAt(stem.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return null;
  if ((code - 0xAC00) % 28 !== 0) return null;
  return [P(stem, stemRomaji(base, false), base.meaning), P('요', 'yo', 'polite ending')];
}

function decompose(word, entry) {
  if (entry.parts) return null;
  if (IRREGULAR_YO[word])    return IRREGULAR_YO[word];
  if (IRREGULAR_OTHER[word]) return IRREGULAR_OTHER[word];
  return tryHada(word) || tryVerb(word) || tryContractedYo(word);
}

// ── 5. Validate & report / apply ─────────────────────────────────────────────

const results = [];
for (const [word, entry] of Object.entries(DICT)) {
  const parts = decompose(word, entry);
  if (!parts) continue;
  const concat = parts.map(p => p.text).join('');
  if (concat !== word) {
    console.warn(`WARN: parts for '${word}' concat to '${concat}', skipping`);
    continue;
  }
  results.push({ word, parts });
}

if (!APPLY) {
  console.log(`Found ${results.length} words to annotate:\n`);
  for (const { word, parts } of results) {
    const preview = parts.map(p => `[${p.text}=${p.meaning}]`).join(' + ');
    console.log(`  ${word.padEnd(12)} → ${preview}`);
  }
  console.log('\nRun with --apply to write changes to workspace.js');
  process.exit(0);
}

let out = src;
for (const { word, parts } of results) {
  const pStr = 'parts:[' + parts.map(p =>
    `{text:'${p.text}',furigana:'${p.text}',romaji:'${p.romaji}',meaning:'${p.meaning.replace(/'/g, "\\'")}'}`
  ).join(',') + ']';

  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRe = new RegExp(
    `('${escaped}'\\s*:\\s*\\{reading:'[^']*',\\s*meaning:(?:'(?:[^'\\\\]|\\\\.)*'|"[^"]*"))(\\},?)`, 'm'
  );
  const m = lineRe.exec(out);
  if (!m) { console.warn(`WARN: no match for '${word}'`); continue; }
  out = out.slice(0, m.index + m[1].length) + ', ' + pStr + out.slice(m.index + m[1].length);
}

fs.writeFileSync(WS, out, 'utf8');
console.log(`Applied parts to ${results.length} entries in workspace.js`);
