// Tests for Korean vocabulary meaning matching.
// Run: node test/meaning-match.test.js

// Mirrors the matching logic from index.html _checkWhat()
function matchesMeaning(meaningStr, input) {
  const norm = s => s.replace(/[?!.,]+$/, "");
  // Strip trailing -s for singular↔plural (not -ss, min 4 chars: "toys"→"toy", "books"→"book")
  const depl = s => s.endsWith('s') && !s.endsWith('ss') && s.length > 3 ? s.slice(0, -1) : s;
  const val = input.trim().toLowerCase();
  const val_ns = val.replace(/\s+/g, "");
  const parts = meaningStr.replace(/\(.*?\)/g, "").toLowerCase().split("/").map(p => norm(p.trim())).filter(Boolean);
  const v = norm(val), v_ns = norm(val_ns);
  if (parts.some(p => v === p || v_ns === p.replace(/\s+/g, ""))) return true;
  // Accept head noun of "X particle" / "X marker": "topic particle" → "topic"
  if (parts.some(p => {
    const m = p.match(/^(.+)\s+(particle|marker)$/);
    return m && (v === m[1] || v_ns === m[1].replace(/\s+/g, ""));
  })) return true;
  // Accept singular↔plural
  if (parts.some(p => depl(v) === depl(p) || depl(v_ns) === depl(p.replace(/\s+/g, "")))) return true;
  // Accept base form of -es verb conjugations: does→do, goes→go, watches→watch
  return parts.some(p => {
    if (!p.endsWith('es') || p.length <= 3) return false;
    const base = p.slice(0, -2);
    return base.length >= 2 && (v === base || v_ns === base);
  });
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

  // ── Particles: short form (head noun) must be accepted ───────────────────
  ['은',        'topic particle',          'topic',         true],
  ['는',        'topic particle',          'topic',         true],
  ['은',        'topic particle',          'topic particle',true, 'full form also accepted'],
  ['은',        'topic particle',          'particle',      false, 'bare "particle" too vague'],
  ['이',        'possessive particle',     'possessive',    true],
  ['의',        'possessive particle',     'possessive',    true],
  ['을',        'object marker',           'object',        true],
  ['을',        'object marker',           'object marker', true, 'full form also accepted'],
  ['을',        'object marker',           'marker',        false, 'bare "marker" too vague'],

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

  // ── outlet sign tokens (signs_ko.js: outlet_rule) ────────────────────────
  ['도서관',     'library',          'library',        true],
  ['도서',       'books',            'books',          true],
  ['관',         'building',         'building',       true],
  ['업무',       'work',             'work',           true],
  ['전용',       'exclusively for',  'exclusively for',true],
  ['사용',       'use',              'use',            true],
  ['해',         'please do',        'please do',      true],

  // ── quiet sign tokens (signs_ko.js: quiet_rule) ──────────────────────────
  ['관내',       'indoors',          'indoors',        true],
  ['관내',       'indoors',          'inside',         false, '"indoors" is the full meaning'],
  ['조용히',     'quietly',          'quietly',        true],
  ['통화',       'phone call',       'phone call',     true],
  ['통화',       'phone call',       'call',           false, '"phone call" is the full meaning'],
  ['삼가',       'refrain',          'refrain',        true],
  ['삼가',       'refrain',          'hold back',      false, 'not in sign data — use KO_FALLBACK for npc'],

  // ── food sign tokens (signs_ko.js: food_rule) ────────────────────────────
  ['음식물',     'food and drink',   'food and drink', true],
  ['음식물',     'food and drink',   'food',           false, 'too vague — whole compound means food-and-drink'],
  ['음식',       'food',             'food',           true],
  ['물',         'substance',        'substance',      true],
  ['섭취',       'consumption',      'consumption',    true],
  ['금지',       'prohibited',       'prohibited',     true],
  ['금지',       'prohibited',       'forbidden',      false, 'sign just says "prohibited"; forbidden is KO_FALLBACK only'],
  ['되어',       'become',           'become',         true],
  ['있습니다',   'there is',         'there is',       true],

  // ── lobby directory tokens (world_signs_ko.js: lobby_directory) ──────────
  ['어린이',     'child',            'child',          true],
  ['어린이',     'child',            'children',       false, 'sign just says "child"'],
  ['살롱',       'salon',            'salon',          true],
  ['요리실',     'cooking room',     'cooking room',   true],
  ['요리',       'cooking',          'cooking',        true],
  ['실',         'room',             'room',           true],
  ['완구',       'toys',             'toys',           true],
  ['전시관',     'exhibition hall',  'exhibition hall',true],
  ['전시',       'exhibition',       'exhibition',     true],

  // ── lobby reception tokens (world_signs_ko.js: lobby_reception) ──────────
  ['오늘',       'today',            'today',          true],
  ['접수',       'reception',        'reception',      true],
  ['마감',       'closed',           'closed',         true],
  ['되었습니다', 'done / has been done', 'done',          true],
  ['되었습니다', 'done / has been done', 'has been done', true],

  // ── play area tokens (world_signs_ko.js: play_shoes / play_supervision / play_age) ──
  ['신발',       'shoes',            'shoes',          true],
  ['벗어',       'take off',         'take off',       true],
  ['어린',       'young',            'young',          true],
  ['아이',       'child',            'child',          true],
  ['어른',       'adult',            'adult',          true],
  ['함께',       'together',         'together',       true],
  ['부터',       'from',             'from',           true],
  ['6살',        '6 years old',      '6 years old',    true],
  ['까지',       'until',            'until',          true],
  ['위한',       'for',              'for',            true],
  ['공간',       'area',             'area',           true],

  // ── salon tokens (world_signs_ko.js: salon_share / salon_food) ───────────
  ['차례차례',   'in turns',         'in turns',       true],
  ['사이좋게',   'friendly',         'friendly',       true],
  ['반입',       'bringing in',      'bringing in',    true],
  ['수분',       'water',            'water',          true],
  ['보충',       'replenishment',    'replenishment',  true],
  ['가능',       'allowed/possible/ok/okay', 'allowed', true],
  ['가능',       'allowed/possible/ok/okay', 'ok',     true],
  ['가능',       'allowed/possible/ok/okay', 'possible',true],
  ['합니다',     'is',               'is',             true],

  // ── gallery tokens (world_signs_ko.js: gallery_dolls / gallery_care / gallery_trains) ──
  ['인형',         'doll',                  'doll',           true],
  ['인형',         'doll',                  'figure',         false, 'not in data'],
  ['코너',         'corner / section',       'corner',         true],
  ['코너',         'corner / section',       'section',        true],
  ['전시품',       'exhibits',              'exhibits',       true],
  ['전시품',       'exhibits',              'display items',  false, 'not in data'],
  ['만지지',       "don't touch",           "don't touch",    true],
  ['만지지',       "don't touch",           'touch',          false, 'sign means don\'t touch'],
  ['마세요',       "please don't",          "please don't",   true],
  ['마세요',       "please don't",          "don't",          false, 'too vague'],
  ['기차',         'train',                 'train',          true],
  ['기차',         'train',                 'locomotive',     false, 'not in data'],
  ['토요일',       'Saturday',              'saturday',       true, 'case-insensitive'],
  ['일요일',       'Sunday',                'sunday',         true, 'case-insensitive'],
  ['10시',         '10 o\'clock',           '10 o\'clock',    true],
  ['17시',         '17 o\'clock / 5pm',     '17 o\'clock',    true],
  ['17시',         '17 o\'clock / 5pm',     '5pm',            true],
  ['개관',         'open',                  'open',           true],

  // ── singular↔plural (matching logic, not data changes) ──────────────────
  // Meaning has plural → player types singular
  ['전시품', 'exhibits',          'exhibit', true,  'singular of plural meaning'],
  ['도서',   'books',             'book',    true,  'singular of plural meaning'],
  ['신발',   'shoes',             'shoe',    true,  'singular of plural meaning'],
  ['완구',   'toys',              'toy',     true,  'singular of plural meaning'],
  ['규칙을', 'rules (object)',    'rule',    true,  'singular of plural meaning'],
  // Meaning has singular → player types plural
  ['인형',   'doll',              'dolls',   true,  'plural of singular meaning'],
  ['기차',   'train',             'trains',  true,  'plural of singular meaning'],
  // Irregular plural must NOT accidentally pass (children≠child via -s rule)
  ['어린이', 'child',             'children',false, 'irregular plural — not covered by -s rule'],

  // ── -es verb conjugation → base form ─────────────────────────────────────
  // does → do (irregular; -s strip gives 'doe', which is wrong)
  ['해요',   'does',              'do',      true,  '-es verb: does→do'],
  ['해요',   'does (polite)',     'do',      true,  '-es verb with paren: does→do'],
  ['해요',   'do / does (polite)','do',      true,  'fallback meaning: do matches directly'],
  // goes → go
  ['가요',   'goes',              'go',      true,  '-es verb: goes→go'],
  // watches → watch
  ['봐요',   'watches',          'watch',   true,  '-es verb: watches→watch'],
  // plain plural -s still works (not a false negative for the -es rule)
  ['책',     'books',             'book',    true,  'plain -s plural unaffected'],

  // ── 살펴보세요 (NPC dialogue: 갤러리 curator) ──────────────────────────────
  // 살펴보다 = compound verb (살피다 + 보다); kept as one token, not split.
  // "look" must be an explicit variant (test harness has no depolite stripping).
  ['살펴보세요', 'please take a look / please look / look', 'please take a look',true],
  ['살펴보세요', 'please take a look / please look / look', 'please look',       true],
  ['살펴보세요', 'please take a look / please look / look', 'look',              true],
  ['살펴보세요', 'please take a look / please look / look', 'see',               false, 'too different'],

  // ── cooking tokens (world_signs_ko.js: cooking_safety / cooking_schedule) ──
  ['칼',           'knife',                 'knife',          true],
  ['이나',         'or',                    'or',             true],
  ['불',           'fire',                  'fire',           true],
  ['사용할 때는',  'when using',            'when using',     true],
  ['사용할 때는',  'when using',            'using',          false, 'needs "when"'],
  ['조심하세요',   'be careful / careful',  'be careful',     true],
  ['조심하세요',   'be careful / careful',  'careful',        true],
  ['메뉴',         'menu',                  'menu',           true],
  ['카레라이스',   'curry rice',            'curry rice',     true],
  ['입니다',       'is',                    'is',             true],

  // ── gallery welcome tokens (world_signs_ko.js: gallery_welcome) ──────────
  // 갤러리: Llama generated "Art gallery or exhibition space" — too verbose.
  // Data must use lean "gallery"; verbose form must NOT secretly match.
  ['갤러리', 'gallery', 'gallery',                        true],
  ['갤러리', 'Art gallery or exhibition space', 'gallery', false, 'verbose Llama output — keep data lean'],

  // ── outdoor tokens (world_signs_ko.js: outdoor_zipline / outdoor_yield) ──
  ['짚라인',     'zipline',          'zipline',        true],
  ['이용자',     'user',             'user',           true],
  ['이용',       'use',              'use',            true],
  ['자',         'person',           'person',         true],
  ['지나가',     'pass',             'pass',           true],
  ['주의',       'caution',          'caution',        true],
  ['7살',        '7 years old',      '7 years old',    true],
  ['이상',       'and over',         'and over',       true],
  ['양보',       'give way',         'give way',       true],
];

// ── _first_meaning: trims raw LLM output before storing ───────────────────
// Mirrors _first_meaning() in index.html.
// Splits on commas, slashes, and " or " — takes the first (shortest lead) alternative.
function firstMeaning(s) {
  return s ? s.split(/\s*[,\/]\s*|\s+or\s+/)[0] : s;
}

const fm_cases = [
  // normal inputs unchanged
  ["gallery",                          "gallery"],
  ["search / look up",                 "search"],
  ["come, quickly",                    "come"],
  // "or"-separated LLM output: first alternative only
  ["Art gallery or exhibition space",  "Art gallery"],
  ["yes or no",                        "yes"],
  ["reading or browsing",              "reading"],
  // combined separators
  ["gallery, hall / space or room",    "gallery"],
  // edge cases
  ["",                                 ""],
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

for (const [input, expected] of fm_cases) {
  const got = firstMeaning(input);
  if (got === expected) {
    pass++;
  } else {
    fail++;
    failures.push({ korean: '_first_meaning', meaning: input, input, expected, got });
  }
}

if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) {
    const label = f.expected ? '✗ should accept' : '✗ should reject';
    if (f.korean === '_first_meaning') {
      console.log(`  ✗ _first_meaning("${f.meaning}") → "${f.got}", expected "${f.expected}"`);
    } else {
      console.log(`  ${label} "${f.input}" for ${f.korean} (${f.meaning})${f.note ? ' — ' + f.note : ''}`);
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
