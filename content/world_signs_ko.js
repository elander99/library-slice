// Korean world signs (lobby, play area, salon, outdoor) — same IDs as world_signs.js.

const WORLD_SIGNS_KO = [

  // --- LOBBY ---
  {
    id: "lobby_directory",
    color: "#1a3a5c",
    japanese: "도서관 · 어린이 살롱\n요리실 · 완구 전시관",
    translation: "Library · Children's Salon / Cooking Room · Toy Gallery",
    tokens: [
      { text: "도서관", furigana: "도서관", romaji: "doseogwan", meaning: "library", parts: [
        { text: "도서", furigana: "도서", romaji: "doseo", meaning: "books" },
        { text: "관",   furigana: "관",   romaji: "gwan",  meaning: "building" },
      ]},
      { text: "어린이", furigana: "어린이", romaji: "eorini",    meaning: "child" },
      { text: "살롱",   furigana: "살롱",   romaji: "sallong",   meaning: "salon" },
      { text: "요리실", furigana: "요리실", romaji: "yorisil",     meaning: "cooking room", parts: [
        { text: "요리", furigana: "요리", romaji: "yori", meaning: "cooking" },
        { text: "실",   furigana: "실",   romaji: "sil",  meaning: "room" },
      ]},
      { text: "완구",   furigana: "완구",   romaji: "wangu",     meaning: "toys" },
      { text: "전시관", furigana: "전시관", romaji: "jeonshigwan", meaning: "exhibition hall", parts: [
        { text: "전시", furigana: "전시", romaji: "jeonsi", meaning: "exhibition" },
        { text: "관",   furigana: "관",   romaji: "gwan",   meaning: "building" },
      ]},
    ]
  },
  {
    id: "lobby_reception",
    color: "#5c3317",
    japanese: "오늘의 접수는\n마감되었습니다",
    translation: "Today's reception is closed.",
    tokens: [
      { text: "오늘", furigana: "오늘", romaji: "oneul",  meaning: "today" },
      { text: "접수", furigana: "접수", romaji: "jeopsu", meaning: "reception" },
      { text: "마감", furigana: "마감", romaji: "magam",  meaning: "closed" },
      { text: "되었습니다", furigana: "되었습니다", romaji: "dwaesseumnida", meaning: "has been done" },
    ]
  },

  // --- PLAY AREA ---
  {
    id: "play_shoes",
    color: "#8b3a1e",
    japanese: "신발을\n벗어 주세요",
    translation: "Please remove your shoes.",
    tokens: [
      { text: "신발",   furigana: "신발",   romaji: "sinbal", meaning: "shoes" },
      { text: "벗어",   furigana: "벗어",   romaji: "beoseo", meaning: "take off" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo", meaning: "please" },
    ]
  },
  {
    id: "play_supervision",
    color: "#2a4a6c",
    japanese: "어린 아이는\n어른과 함께",
    translation: "Young children must be accompanied by an adult.",
    tokens: [
      { text: "어린", furigana: "어린", romaji: "eorin",   meaning: "young" },
      { text: "아이", furigana: "아이", romaji: "ai",      meaning: "child" },
      { text: "어른", furigana: "어른", romaji: "eoreun",  meaning: "adult" },
      { text: "함께", furigana: "함께", romaji: "hamkke",  meaning: "together" },
    ]
  },
  {
    id: "play_age",
    color: "#2d6a4f",
    japanese: "3살부터 6살까지\n어린이를 위한 공간",
    translation: "A space for children ages 3 to 6.",
    tokens: [
      { text: "3살",    furigana: "3살",    romaji: "se sal",      meaning: "3 years old" },
      { text: "부터",   furigana: "부터",   romaji: "buteo",       meaning: "from" },
      { text: "6살",    furigana: "6살",    romaji: "yeoseot sal", meaning: "6 years old" },
      { text: "까지",   furigana: "까지",   romaji: "kkaji",       meaning: "until" },
      { text: "어린이", furigana: "어린이", romaji: "eorini",  meaning: "child" },
      { text: "위한",   furigana: "위한",   romaji: "wihan",   meaning: "for" },
      { text: "공간",   furigana: "공간",   romaji: "gonggan", meaning: "area" },
    ]
  },

  // --- SALON ---
  {
    id: "salon_share",
    color: "#5c1a5c",
    japanese: "차례차례 사이좋게\n사용해 주세요",
    translation: "Please take turns and be considerate.",
    tokens: [
      { text: "차례차례", furigana: "차례차례", romaji: "charyecharye", meaning: "in turns" },
      { text: "사이좋게", furigana: "사이좋게", romaji: "saijokke",     meaning: "friendly" },
      { text: "사용",     furigana: "사용",     romaji: "sayong",       meaning: "use" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",       meaning: "please" },
    ]
  },
  {
    id: "salon_food",
    color: "#8b3a1e",
    japanese: "음식물 반입은 삼가 주세요\n수분 보충은 가능합니다",
    translation: "Please do not bring food or drink. Water is permitted.",
    tokens: [
      { text: "음식물",   furigana: "음식물",   romaji: "eumsigmul",   meaning: "food and drink" },
      { text: "반입",     furigana: "반입",     romaji: "banip",       meaning: "bringing in" },
      { text: "삼가",     furigana: "삼가",     romaji: "samga",       meaning: "please refrain" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",      meaning: "please" },
      { text: "수분",     furigana: "수분",     romaji: "subun",       meaning: "water" },
      { text: "보충",     furigana: "보충",     romaji: "bochung",     meaning: "replenishment" },
      { text: "가능",     furigana: "가능",     romaji: "ganeung",     meaning: "allowed" },
      { text: "합니다",   furigana: "합니다",   romaji: "hamnida",     meaning: "is" },
    ]
  },

  // --- OUTDOOR ---
  {
    id: "outdoor_zipline",
    color: "#c0392b",
    japanese: "짚라인 이용자가 지나가요\n주의하세요!",
    translation: "Zipline riders are passing through — watch out!",
    tokens: [
      { text: "짚라인",   furigana: "짚라인",   romaji: "jiprain",  meaning: "zipline" },
      { text: "이용자",   furigana: "이용자",   romaji: "iyongja",  meaning: "user", parts: [
        { text: "이용", furigana: "이용", romaji: "iyong", meaning: "use" },
        { text: "자",   furigana: "자",   romaji: "ja",    meaning: "person" },
      ]},
      { text: "지나가",   furigana: "지나가",   romaji: "jinaga",   meaning: "pass" },
      { text: "주의",     furigana: "주의",     romaji: "juui",     meaning: "caution" },
    ]
  },
  {
    id: "outdoor_yield",
    color: "#b8860b",
    japanese: "7살 이상은 어린 아이에게\n양보해 주세요",
    translation: "Children 7 and older, please give way to younger children.",
    tokens: [
      { text: "7살",    furigana: "7살",    romaji: "ilgop sal", meaning: "7 years old" },
      { text: "이상",   furigana: "이상",   romaji: "isang",     meaning: "and over" },
      { text: "은",     furigana: "은",     romaji: "eun",       meaning: "topic particle/topic" },
      { text: "어린",   furigana: "어린",   romaji: "eorin",     meaning: "young" },
      { text: "아이",   furigana: "아이",   romaji: "ai",        meaning: "child" },
      { text: "에게",   furigana: "에게",   romaji: "ege",       meaning: "to" },
      { text: "양보",   furigana: "양보",   romaji: "yangbo",    meaning: "give way" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo",    meaning: "please" },
    ]
  },
];
