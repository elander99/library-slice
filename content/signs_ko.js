// Korean library signs — same IDs as signs.js so SIGN_BY_ID can be hot-swapped.
// token.furigana = hangul (same as text — Korean is already phonetic).
// token.romaji   = Revised Romanization, accepted as the "reading" answer.
// token.meaning  = English meanings, slash-separated.
// Every content word AND grammatical particle on the sign has a chip.

const SIGNS_KO = [
  {
    id: "outlet_rule",
    label: "콘센트 사용 규칙",
    label_en: "Outlet Policy",
    japanese: "콘센트는 도서관 업무\n전용으로 사용해 주세요",
    translation: "Please use outlets for library work only.",
    rule_id: "outlet_requires_library_task",
    color: "#2d5a3d",
    tokens: [
      { text: "콘센트", furigana: "콘센트", romaji: "konsenteu", meaning: "outlet / socket / power outlet / plug" },
      { text: "는",     furigana: "는",     romaji: "neun",      meaning: "topic marker (after vowel)" },
      { text: "도서관", furigana: "도서관", romaji: "doseogwan", meaning: "library" },
      { text: "업무",   furigana: "업무",   romaji: "eommu",     meaning: "work / duties / business / operations" },
      { text: "전용",   furigana: "전용",   romaji: "jeonyong",  meaning: "exclusively for / dedicated / reserved for" },
      { text: "으로",   furigana: "으로",   romaji: "euro",      meaning: "by / for / as (direction/means particle)" },
      { text: "사용",   furigana: "사용",   romaji: "sayong",    meaning: "use / usage / using" },
      { text: "해",     furigana: "해",     romaji: "hae",       meaning: "do / please do (casual form of 하다)" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo",    meaning: "please / please do" },
    ]
  },
  {
    id: "quiet_rule",
    label: "정숙 안내",
    label_en: "Quiet Please",
    japanese: "관내에서 조용히 해 주세요\n휴대전화 통화는 삼가 주세요",
    translation: "Please be quiet inside.\nPlease refrain from phone calls.",
    rule_id: "no_phone_calls",
    color: "#3d2d5a",
    tokens: [
      { text: "관내",     furigana: "관내",     romaji: "gwannae",       meaning: "inside / inside the building / indoors" },
      { text: "에서",     furigana: "에서",     romaji: "eseo",          meaning: "at / in / from (location particle)" },
      { text: "조용히",   furigana: "조용히",   romaji: "joyonghi",      meaning: "quietly / silently / please be quiet" },
      { text: "해",       furigana: "해",       romaji: "hae",           meaning: "do / please do (casual form of 하다)" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",        meaning: "please / please do" },
      { text: "휴대전화", furigana: "휴대전화", romaji: "hyudaejeonhwa", meaning: "mobile phone / cell phone / smartphone" },
      { text: "통화",     furigana: "통화",     romaji: "tonghwa",       meaning: "phone call / call / calling" },
      { text: "는",       furigana: "는",       romaji: "neun",          meaning: "topic marker (after vowel)" },
      { text: "삼가",     furigana: "삼가",     romaji: "samga",         meaning: "refrain / please refrain / hold back" },
    ]
  },
  {
    id: "food_rule",
    label: "음식물 반입 금지",
    label_en: "No Food or Drink",
    japanese: "관내에서 음식물 섭취는\n금지되어 있습니다",
    translation: "Eating and drinking inside is strictly prohibited.",
    rule_id: "no_food_drink",
    color: "#5a2d2d",
    tokens: [
      { text: "관내",     furigana: "관내",     romaji: "gwannae",   meaning: "inside / in the building / indoors" },
      { text: "에서",     furigana: "에서",     romaji: "eseo",      meaning: "at / in / from (location particle)" },
      { text: "음식물",   furigana: "음식물",   romaji: "eumsigmul", meaning: "food and drink / food or drink / refreshments" },
      { text: "섭취",     furigana: "섭취",     romaji: "seopchwi",  meaning: "consumption / intake / eating and drinking" },
      { text: "는",       furigana: "는",       romaji: "neun",      meaning: "topic marker (after vowel)" },
      { text: "금지",     furigana: "금지",     romaji: "geunji",    meaning: "prohibited / banned / forbidden / not allowed" },
      { text: "되어",     furigana: "되어",     romaji: "dweo",      meaning: "become / is (passive connector)" },
      { text: "있습니다", furigana: "있습니다", romaji: "itsseumnida", meaning: "is / exists / there is (formal)" },
    ]
  }
];
