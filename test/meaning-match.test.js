// Tests for Korean vocabulary meaning matching.
// Run: node test/meaning-match.test.js

// Mirrors the matching logic from index.html _checkWhat()
function matchesMeaning(meaningStr, input) {
  const norm = s => s.replace(/[?!.,]+$/, "");
  const val = input.trim().toLowerCase();
  const val_ns = val.replace(/\s+/g, "");
  const parts = meaningStr.replace(/\(.*?\)/g, "").toLowerCase().split("/").map(p => norm(p.trim())).filter(Boolean);
  const v = norm(val), v_ns = norm(val_ns);
  return parts.some(p => v === p || v_ns === p.replace(/\s+/g, ""));
}

// Each case: [korean, meaning, input, shouldPass, note?]
// "shouldPass: true" = player types this and we want it accepted
const cases = [
  // ── Greetings ─────────────────────────────────────────────────────────────
  ['안녕하세요', 'hello (formal)',           'hello',         true],
  ['안녕하세요', 'hello (formal)',           'hello formal',  false, 'too specific'],
  ['안녕',      'hi / bye (informal)',      'hi',            true],
  ['안녕',      'hi / bye (informal)',      'bye',           true],
  ['안녕',      'hi / bye (informal)',      'hello',         false],

  // ── Requests / politeness ─────────────────────────────────────────────────
  ['어서',      'come / quickly',           'come',          true],
  ['어서',      'come / quickly',           'quickly',       true],
  ['오세요',    'please come',              'please come',   true],
  ['오세요',    'please come',              'come',          false, 'too vague — intentional'],
  ['주세요',    'please',                   'please',        true],
  ['가세요',    'please go / stay a while', 'please go',     true],
  ['가세요',    'please go / stay a while', 'stay a while',  true],
  ['말씀해',    'please say / speak',       'please say',    true],
  ['말씀해',    'please say / speak',       'speak',         true],
  ['주시겠어요','would you please?',        'would you please', true],

  // ── Questions ─────────────────────────────────────────────────────────────
  ['무엇을',    'what (object)',            'what',          true],
  ['무엇이',    'what (subject)',           'what',          true],
  ['도와드릴까요','shall I help you?',      'shall I help you', true],
  ['도와드릴까요','shall I help you?',      'help',          false, 'debatable — too short?'],
  ['어떻게',    'how',                      'how',           true],
  ['왜',        'why',                      'why',           true],
  ['언제',      'when',                     'when',          true],
  ['어디',      'where',                    'where',         true],
  ['누구',      'who',                      'who',           true],

  // ── Apologies ─────────────────────────────────────────────────────────────
  ["죄송해요",  "I'm sorry (formal) / sorry", "sorry",       true],
  ["죄송해요",  "I'm sorry (formal) / sorry", "I'm sorry",   true],
  ["미안해요",  "I'm sorry / sorry",          "sorry",       true],
  ["미안해요",  "I'm sorry / sorry",          "I'm sorry",   true],

  // ── Understanding ─────────────────────────────────────────────────────────
  ['알겠어요',  'I understand',             'I understand',  true],
  ['알겠어요',  'I understand',             'understand',    false, 'should this pass? debatable'],
  ['모르겠어요',"I don't know",             "I don't know",  true],
  ['모르겠어요',"I don't know",             "don't know",    false, 'debatable'],
  ['이해하지',  'understand (negative form)','understand',   true],

  // ── Responses / agreement ─────────────────────────────────────────────────
  ['네',        'yes',                      'yes',           true],
  ['아니요',    'no',                       'no',            true],
  ['아니에요',  "isn't / no",               "isn't",         true],
  ['아니에요',  "isn't / no",               "no",            true],
  ['그래요',    "I see / that's right",     "I see",         true],
  ['그래요',    "I see / that's right",     "that's right",  true],
  ['그래요',    "I see / that's right",     "see",           false, 'debatable'],
  ['맞아요',    "that's right / correct",   "correct",       true],
  ['맞아요',    "that's right / correct",   "that's right",  true],
  ['맞아요',    "that's right / correct",   "right",         false, 'debatable'],

  // ── Thanks ────────────────────────────────────────────────────────────────
  ['감사합니다','thank you (formal)',       'thank you',     true],
  ['감사해요',  'thank you',               'thank you',     true],
  ['고마워요',  'thank you (informal)',    'thank you',     true],
  ['고마워요',  'thank you (informal)',    'thanks',        false, 'debatable'],

  // ── OK / Fine ─────────────────────────────────────────────────────────────
  ['괜찮아요',  "it's okay / fine",        "it's okay",     true],
  ['괜찮아요',  "it's okay / fine",        "fine",          true],
  ['괜찮아요',  "it's okay / fine",        "okay",          false, 'should this pass?'],
  ['괜찮아',    "it's okay (informal)",    "it's okay",     true],
  ['괜찮아',    "it's okay (informal)",    "okay",          false, 'should this pass?'],

  // ── Common words ──────────────────────────────────────────────────────────
  ['좋아요',    'good / I like it',        'good',          true],
  ['좋아요',    'good / I like it',        'I like it',     true],
  ['있어요',    'there is / I have',       'there is',      true],
  ['있어요',    'there is / I have',       'I have',        true],
  ['없어요',    "there isn't / I don't have", "there isn't", true],
  ['없어요',    "there isn't / I don't have", "I don't have", true],
  ['잘',        'well / fine',             'well',          true],
  ['잘',        'well / fine',             'fine',          true],
  ['정말',      'really / truly',          'really',        true],
  ['정말',      'really / truly',          'truly',         true],
  ['조금',      'a little',               'a little',      true],
  ['많이',      'a lot / many',           'a lot',         true],
  ['많이',      'a lot / many',           'many',          true],
  ['빨리',      'quickly / fast',         'quickly',       true],
  ['빨리',      'quickly / fast',         'fast',          true],
  ['지금',      'now',                    'now',           true],
  ['여기',      'here',                   'here',          true],
  ['거기',      'there',                  'there',         true],
  ['오늘',      'today',                  'today',         true],
  ['다시',      'again',                  'again',         true],
  ['한번',      'once / one more time',   'once',          true],
  ['한번',      'once / one more time',   'one more time', true],
  ['잠깐만요',  'just a moment',          'just a moment', true],

  // ── Honorific/grammar words ───────────────────────────────────────────────
  ['오신',      '(who) came (honorific)',  'came',          true],
  ['것을',      'thing (object)',          'thing',         true],
  ['환영해요',  'welcome',                 'welcome',       true],
  ['환영합니다','welcome (formal)',        'welcome',       true],
  ['천천히',    'slowly / take your time','slowly',        true],
  ['천천히',    'slowly / take your time','take your time',true],
  ['즐기세요',  'please enjoy',           'please enjoy',  true],
  ['즐기세요',  'please enjoy',           'enjoy',         false, 'debatable'],
  ['즐겨',      'enjoy',                  'enjoy',         true],
  ['편히',      'comfortably',            'comfortably',   true],
  ['쉬다',      'to rest',               'to rest',       true],
  ['쉬다',      'to rest',               'rest',          false, 'debatable'],
  ['못했어요',  "couldn't / wasn't able to", "couldn't",   true],
  ['못했어요',  "couldn't / wasn't able to", "wasn't able to", true],
  ['날씨',      'weather',               'weather',       true],
  ['좋죠',      "nice, right?",          "nice, right?",  true],
  ['좋죠',      "nice, right?",          "nice",          false, 'debatable'],
  ['야외',      'outdoors',              'outdoors',      true],
  ['규칙을',    'rules (object)',        'rules',         true],
  ['지키며',    'while following',       'while following',true],
  ['재미있게',  'enjoyably / have fun',  'enjoyably',     true],
  ['재미있게',  'enjoyably / have fun',  'have fun',      true],
  ['놀아요',    'play / have fun',       'play',          true],
  ['놀아요',    'play / have fun',       'have fun',      true],
  ['놀러',      'to play / visit',       'to play',       true],
  ['놀러',      'to play / visit',       'visit',         true],
  ['어린이',    'child / children',      'child',         true],
  ['어린이',    'child / children',      'children',      true],
  ['살롱에',    'at the salon',          'at the salon',  true],
  ['오셨어요',  'did you come?',         'did you come?', true],
  ['도와줄까요','shall I help you?',     'shall I help you', true],

  // ── 가시고 (to be visible / to appear) ───────────────────────────────────
  ['가시고', 'to be visible / to appear / visible / appear', 'appear',        true],
  ['가시고', 'to be visible / to appear / visible / appear', 'to appear',     true],
  ['가시고', 'to be visible / to appear / visible / appear', 'visible',       true],
  ['가시고', 'to be visible / to appear / visible / appear', 'to be visible', true],
  ['가시고', 'to be visible / to appear / visible / appear', 'disappear',     false],
  ['가시고', 'to be visible / to appear / visible / appear', 'look',          false],

  // ── 저는 (I / as for me) ──────────────────────────────────────────────────
  ['저는', 'I',  'I',          true],
  ['저는', 'I',  'i',          true, 'case-insensitive'],
  ['저는', 'I',  'me',         false],
  ['저는', 'I',  'as for me',  false],

  // ── Long-meaning words: short core form must match; verbose inputs must not ──
  // The principle: meaning strings stay lean — player types the shortest natural form.
  ['콘센트',  'outlet / socket / power outlet / plug',                   'outlet',       true],
  ['콘센트',  'outlet / socket / power outlet / plug',                   'plug',         true],
  ['콘센트',  'outlet / socket / power outlet / plug',                   'electrical outlet', false, 'not in data — keep data lean'],
  ['휴대전화','mobile phone / cell phone / smartphone',                   'phone',        false, 'not in data as bare "phone"'],
  ['휴대전화','mobile phone / cell phone / smartphone',                   'mobile phone', true],
  ['휴대전화','mobile phone / cell phone / smartphone',                   'smartphone',   true],
  ['관내',    'inside / inside the building / indoors',                  'inside',       true],
  ['관내',    'inside / inside the building / indoors',                  'indoors',      true],
  ['관내',    'inside / inside the building / indoors',                  'in the building', false, 'not in data'],
  ['금지',    'prohibited / banned / forbidden / not allowed',           'prohibited',   true],
  ['금지',    'prohibited / banned / forbidden / not allowed',           'forbidden',    true],
  ['금지',    'prohibited / banned / forbidden / not allowed',           'not allowed',  true],
  ['금지',    'prohibited / banned / forbidden / not allowed',           'banned',       true],
  ['금지',    'prohibited / banned / forbidden / not allowed',           'off limits',   false, 'not in data'],
  ['마감',    'closed / deadline / end / finished / completed',          'closed',       true],
  ['마감',    'closed / deadline / end / finished / completed',          'deadline',     true],
  ['마감',    'closed / deadline / end / finished / completed',          'over',         false, 'not in data'],

  // ── 놀이공간 (play area — keep meaning short, not verbose) ───────────────
  ['놀이공간', 'play area',  'play area',             true],
  ['놀이공간', 'play area',  'playarea',              true, 'no-space variant'],
  ['놀이공간', 'play area',  'play space',            false, 'not in data — intentionally lean'],
  ['놀이공간', 'play area',  "children's play area",  false, 'not in data — intentionally lean'],
];

// ── Run ────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const failures = [];

for (const [korean, meaning, input, expected, note] of cases) {
  const got = matchesMeaning(meaning, input);
  if (got === expected) {
    pass++;
  } else {
    fail++;
    failures.push({ korean, meaning, input, expected, got, note });
  }
}

if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) {
    const label = f.expected ? '✗ should accept' : '✗ should reject';
    console.log(`  ${label} "${f.input}" for ${f.korean} (${f.meaning})${f.note ? ' — ' + f.note : ''}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
