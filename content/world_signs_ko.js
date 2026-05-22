// Korean world signs (lobby, play area, salon, outdoor) — same IDs as world_signs.js.

const WORLD_SIGNS_KO = [

  // --- LOBBY ---
  {
    id: "lobby_directory",
    label: "층 안내",
    color: "#1a3a5c",
    japanese: "도서관 · 어린이 살롱\n요리실 · 완구 전시관",
    tokens: [
      { text: "도서관", furigana: "도서관", romaji: "doseogwan", meaning: "library" },
      { text: "어린이", furigana: "어린이", romaji: "eorini",    meaning: "child / children" },
      { text: "살롱",   furigana: "살롱",   romaji: "sallong",   meaning: "salon / lounge" },
      { text: "요리실", furigana: "요리실", romaji: "yorisil",   meaning: "cooking room / kitchen" },
      { text: "완구",   furigana: "완구",   romaji: "wangu",     meaning: "toys / playthings / toy" },
      { text: "전시관", furigana: "전시관", romaji: "jeonshigwan", meaning: "exhibition hall / gallery / display hall" },
    ]
  },
  {
    id: "lobby_reception",
    label: "접수",
    color: "#5c3317",
    japanese: "오늘의 접수는\n마감되었습니다",
    tokens: [
      { text: "오늘", furigana: "오늘", romaji: "oneul",  meaning: "today / this day" },
      { text: "접수", furigana: "접수", romaji: "jeopsu", meaning: "reception / front desk / check-in / registration" },
      { text: "마감", furigana: "마감", romaji: "magam",  meaning: "closed / deadline / end / finished / completed" },
    ]
  },

  // --- PLAY AREA ---
  {
    id: "play_shoes",
    label: "신발",
    color: "#8b3a1e",
    japanese: "신발을\n벗어 주세요",
    tokens: [
      { text: "신발",   furigana: "신발",   romaji: "sinbal", meaning: "shoes / footwear" },
      { text: "벗어",   furigana: "벗어",   romaji: "beoseo", meaning: "take off / remove" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo", meaning: "please / please do" },
    ]
  },
  {
    id: "play_supervision",
    label: "보호자 동반",
    color: "#2a4a6c",
    japanese: "어린 아이는\n어른과 함께",
    tokens: [
      { text: "어린", furigana: "어린", romaji: "eorin",   meaning: "young / little / small" },
      { text: "아이", furigana: "아이", romaji: "ai",      meaning: "child / children / kid" },
      { text: "어른", furigana: "어른", romaji: "eoreun",  meaning: "adult / grown-up" },
      { text: "함께", furigana: "함께", romaji: "hamkke",  meaning: "together / with / along with" },
    ]
  },
  {
    id: "play_age",
    label: "대상 연령",
    color: "#2d6a4f",
    japanese: "3살부터 6살까지\n어린이를 위한 공간",
    tokens: [
      { text: "살",     furigana: "살",     romaji: "sal",     meaning: "years old / age" },
      { text: "부터",   furigana: "부터",   romaji: "buteo",   meaning: "from / starting from / since" },
      { text: "까지",   furigana: "까지",   romaji: "kkaji",   meaning: "until / up to / through" },
      { text: "어린이", furigana: "어린이", romaji: "eorini",  meaning: "child / children" },
      { text: "위한",   furigana: "위한",   romaji: "wihan",   meaning: "for / intended for / for the sake of" },
      { text: "공간",   furigana: "공간",   romaji: "gonggan", meaning: "space / area / place" },
    ]
  },

  // --- SALON ---
  {
    id: "salon_share",
    label: "부탁드립니다",
    color: "#5c1a5c",
    japanese: "차례차례 사이좋게\n사용해 주세요",
    tokens: [
      { text: "차례차례", furigana: "차례차례", romaji: "charyecharye", meaning: "in turns / one by one / taking turns" },
      { text: "사이좋게", furigana: "사이좋게", romaji: "saijokke",     meaning: "friendly / harmoniously / nicely / amicably" },
      { text: "사용",     furigana: "사용",     romaji: "sayong",       meaning: "use / usage" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",       meaning: "please / please do" },
    ]
  },
  {
    id: "salon_food",
    label: "음식물 안내",
    color: "#8b3a1e",
    japanese: "음식물 반입은 삼가 주세요\n수분 보충은 가능합니다",
    tokens: [
      { text: "음식물",   furigana: "음식물",   romaji: "eumsigmul",   meaning: "food and drink / food or drink / refreshments" },
      { text: "반입",     furigana: "반입",     romaji: "banip",       meaning: "bringing in / bringing inside / carrying in" },
      { text: "삼가",     furigana: "삼가",     romaji: "samga",       meaning: "refrain / please refrain / hold back" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",      meaning: "please / please do" },
      { text: "수분",     furigana: "수분",     romaji: "subun",       meaning: "water / hydration / moisture" },
      { text: "보충",     furigana: "보충",     romaji: "bochung",     meaning: "replenishment / supplement / refill" },
      { text: "가능",     furigana: "가능",     romaji: "ganeung",     meaning: "possible / allowed / OK / permissible" },
      { text: "합니다",   furigana: "합니다",   romaji: "hamnida",     meaning: "is / does (formal sentence ending)" },
    ]
  },

  // --- OUTDOOR ---
  {
    id: "outdoor_zipline",
    label: "짚라인",
    color: "#c0392b",
    japanese: "짚라인 이용자가 지나가요\n주의하세요!",
    tokens: [
      { text: "짚라인",   furigana: "짚라인",   romaji: "jiprain",  meaning: "zipline" },
      { text: "이용자",   furigana: "이용자",   romaji: "iyongja",  meaning: "user / rider / person using" },
      { text: "지나가",   furigana: "지나가",   romaji: "jinaga",   meaning: "pass / go through / pass by" },
      { text: "주의",     furigana: "주의",     romaji: "juui",     meaning: "caution / attention / careful / warning / watch out" },
    ]
  },
  {
    id: "outdoor_yield",
    label: "양보",
    color: "#b8860b",
    japanese: "7살 이상은 어린 아이에게\n양보해 주세요",
    tokens: [
      { text: "7살",    furigana: "7살",    romaji: "ilgop sal", meaning: "7 years old / age 7" },
      { text: "이상",   furigana: "이상",   romaji: "isang",     meaning: "and over / or more / above" },
      { text: "은",     furigana: "은",     romaji: "eun",    meaning: "topic marker (after consonant)" },
      { text: "어린",   furigana: "어린",   romaji: "eorin",  meaning: "young / little / small" },
      { text: "아이",   furigana: "아이",   romaji: "ai",     meaning: "child / children / kid" },
      { text: "에게",   furigana: "에게",   romaji: "ege",    meaning: "to / for (animate objects)" },
      { text: "양보",   furigana: "양보",   romaji: "yangbo", meaning: "yield / give way / concession" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo", meaning: "please / please do" },
    ]
  },
];
