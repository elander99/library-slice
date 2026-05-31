// CONTENT: Signs
// All Japanese text, translations, and sign metadata live here.
// rule_id links to simulation logic in engine/sim.js — never embed rules here.
//
// meaning: slash-separated accepted answers (any variant matches).
//   Strip parens before comparing, so "(topic marker)" → not typeable — avoid.
//   First entry is the "canonical" form shown in the reveal.

const SIGNS = [
  {
    id: "outlet_rule",
    label: "コンセント使用について",
    label_en: "Outlet Policy",
    japanese: "コンセントのご使用は図書館業務に\n関連する場合のみ許可されています",
    translation: "Use of electrical outlets is permitted\nonly for library-related work.",
    rule_id: "outlet_requires_library_task",
    color: "#2d5a3d",
    tokens: [
      { text: "コンセント",   furigana: "コンセント",   romaji: "konsento",    meaning: "outlet" },
      { text: "の",           furigana: "の",           romaji: "no",          meaning: "possessive particle/possessive" },
      { text: "ご使用",       furigana: "ごしよう",     romaji: "goshiyou",    meaning: "use" },
      { text: "は",           furigana: "は",           romaji: "wa",          meaning: "topic particle/topic" },
      { text: "図書館",       furigana: "としょかん",   romaji: "toshokan",    meaning: "library" },
      { text: "業務",         furigana: "ぎょうむ",     romaji: "gyoumu",      meaning: "work" },
      { text: "に",           furigana: "に",           romaji: "ni",          meaning: "particle" },
      { text: "関連",     furigana: "かんれん",   romaji: "kanren",  meaning: "related" },
      { text: "する",     furigana: "する",       romaji: "suru",    meaning: "to do" },
      { text: "場合",     furigana: "ばあい",     romaji: "baai",    meaning: "when" },
      { text: "のみ",     furigana: "のみ",       romaji: "nomi",    meaning: "only" },
      { text: "許可",     furigana: "きょか",     romaji: "kyoka",   meaning: "permission" },
      { text: "されています", furigana: "されています", romaji: "sareteimasu", meaning: "is permitted" }
    ]
  },
  {
    id: "quiet_rule",
    label: "静粛のお願い",
    label_en: "Quiet Please",
    japanese: "館内では静粛にしてください\n携帯電話のご使用はご遠慮ください",
    translation: "Please be quiet inside.\nPlease refrain from using mobile phones.",
    rule_id: "no_phone_calls",
    color: "#3d2d5a",
    tokens: [
      { text: "館内",           furigana: "かんない",         romaji: "kannai",          meaning: "indoors" },
      { text: "では",           furigana: "では",             romaji: "dewa",            meaning: "inside" },
      { text: "静粛",           furigana: "せいしゅく",       romaji: "seishuku",        meaning: "silence" },
      { text: "に",             furigana: "に",               romaji: "ni",              meaning: "particle" },
      { text: "して",           furigana: "して",             romaji: "shite",           meaning: "doing" },
      { text: "ください",       furigana: "ください",         romaji: "kudasai",         meaning: "please" },
      { text: "携帯電話",       furigana: "けいたいでんわ",   romaji: "keitaidenwa",     meaning: "mobile phone" },
      { text: "の",             furigana: "の",               romaji: "no",              meaning: "possessive particle/possessive" },
      { text: "ご使用",         furigana: "ごしよう",         romaji: "goshiyou",        meaning: "use" },
      { text: "は",             furigana: "は",               romaji: "wa",              meaning: "topic particle/topic" },
      { text: "ご遠慮",   furigana: "ごえんりょ",   romaji: "goenryo",  meaning: "please refrain" },
      { text: "ください", furigana: "ください",   romaji: "kudasai",  meaning: "please" }
    ]
  },
  {
    id: "food_rule",
    label: "飲食禁止",
    label_en: "No Food or Drink",
    japanese: "館内での飲食は\n固くお断りします",
    translation: "Eating and drinking inside\nthe library is strictly prohibited.",
    rule_id: "no_food_drink",
    color: "#5a2d2d",
    tokens: [
      { text: "館内",   furigana: "かんない",   romaji: "kannai",     meaning: "indoors" },
      { text: "での",   furigana: "での",       romaji: "deno",       meaning: "inside" },
      { text: "飲食",   furigana: "いんしょく", romaji: "inshoku",    meaning: "eating and drinking" },
      { text: "は",     furigana: "は",         romaji: "wa",         meaning: "topic particle/topic" },
      { text: "固く",   furigana: "かたく",     romaji: "kataku",     meaning: "strictly" },
      { text: "お断り", furigana: "おことわり", romaji: "okotowari",  meaning: "prohibited" },
      { text: "します", furigana: "します",     romaji: "shimasu",    meaning: "we do" }
    ]
  }
];
