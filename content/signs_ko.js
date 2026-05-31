// Korean library signs — same IDs as signs.js so SIGN_BY_ID can be hot-swapped.
// token.furigana = hangul (same as text — Korean is already phonetic).
// token.romaji   = Revised Romanization, accepted as the "reading" answer.
// token.meaning  = English meanings, slash-separated.
// Every content word AND grammatical particle on the sign has a chip.

const SIGNS_KO = [
  {
    id: "outlet_rule",
    label_en: "Outlet Policy",
    japanese: "콘센트는 도서관 업무\n전용으로 사용해 주세요",
    translation: "Please use outlets for library work only.",
    rule_id: "outlet_requires_library_task",
    color: "#2d5a3d",
    tokens: [
      { text: "콘센트", furigana: "콘센트", romaji: "konsenteu", meaning: "outlet" },
      { text: "는",     furigana: "는",     romaji: "neun",      meaning: "topic marker (after vowel)/topic" },
      { text: "도서관", furigana: "도서관", romaji: "doseogwan", meaning: "library", parts: [
        { text: "도서", furigana: "도서", romaji: "doseo",  meaning: "books" },
        { text: "관",   furigana: "관",   romaji: "gwan",   meaning: "building" },
      ]},
      { text: "업무",   furigana: "업무",   romaji: "eommu",     meaning: "work" },
      { text: "전용",   furigana: "전용",   romaji: "jeonyong",  meaning: "exclusively for" },
      { text: "으로",   furigana: "으로",   romaji: "euro",      meaning: "by" },
      { text: "사용",   furigana: "사용",   romaji: "sayong",    meaning: "use" },
      { text: "해",     furigana: "해",     romaji: "hae",       meaning: "please do" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo",    meaning: "please" },
    ]
  },
  {
    id: "quiet_rule",
    label_en: "Quiet Please",
    japanese: "관내에서 조용히 해 주세요\n휴대전화 통화는 삼가 주세요",
    translation: "Please be quiet inside.\nPlease refrain from phone calls.",
    rule_id: "no_phone_calls",
    color: "#3d2d5a",
    tokens: [
      { text: "관내",     furigana: "관내",     romaji: "gwannae",       meaning: "indoors" },
      { text: "에서",     furigana: "에서",     romaji: "eseo",          meaning: "at" },
      { text: "조용히",   furigana: "조용히",   romaji: "joyonghi",      meaning: "quietly" },
      { text: "해",       furigana: "해",       romaji: "hae",           meaning: "please do" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",        meaning: "please" },
      { text: "휴대전화", furigana: "휴대전화", romaji: "hyudaejeonhwa", meaning: "mobile phone", parts: [
        { text: "휴대", furigana: "휴대", romaji: "hyudae",  meaning: "portable" },
        { text: "전화", furigana: "전화", romaji: "jeonhwa", meaning: "phone" },
      ]},
      { text: "통화",     furigana: "통화",     romaji: "tonghwa",       meaning: "phone call" },
      { text: "는",       furigana: "는",       romaji: "neun",          meaning: "topic marker (after vowel)/topic" },
      { text: "삼가",     furigana: "삼가",     romaji: "samga",         meaning: "refrain" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",        meaning: "please" },
    ]
  },
  {
    id: "food_rule",
    label_en: "No Food or Drink",
    japanese: "관내에서 음식물 섭취는\n금지되어 있습니다",
    translation: "Eating and drinking inside is strictly prohibited.",
    rule_id: "no_food_drink",
    color: "#5a2d2d",
    tokens: [
      { text: "관내",     furigana: "관내",     romaji: "gwannae",   meaning: "indoors" },
      { text: "에서",     furigana: "에서",     romaji: "eseo",      meaning: "at" },
      { text: "음식물",   furigana: "음식물",   romaji: "eumsigmul", meaning: "food and drink", parts: [
        { text: "음식", furigana: "음식", romaji: "eumsik", meaning: "food" },
        { text: "물",   furigana: "물",   romaji: "mul",    meaning: "substance" },
      ]},
      { text: "섭취",     furigana: "섭취",     romaji: "seopchwi",  meaning: "consumption" },
      { text: "는",       furigana: "는",       romaji: "neun",      meaning: "topic marker (after vowel)/topic" },
      { text: "금지",     furigana: "금지",     romaji: "geunji",    meaning: "prohibited" },
      { text: "되어",     furigana: "되어",     romaji: "dweo",      meaning: "become" },
      { text: "있습니다", furigana: "있습니다", romaji: "itsseumnida", meaning: "there is" },
    ]
  }
];
