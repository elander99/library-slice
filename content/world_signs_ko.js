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
      { text: "오늘",       furigana: "오늘",       romaji: "oneul",         meaning: "today" },
      { text: "의",         furigana: "의",         romaji: "ui",            meaning: "possessive" },
      { text: "접수",       furigana: "접수",       romaji: "jeopsu",        meaning: "reception" },
      { text: "는",         furigana: "는",         romaji: "neun",          meaning: "topic particle" },
      { text: "마감",       furigana: "마감",       romaji: "magam",         meaning: "closed" },
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
      { text: "을",     furigana: "을",     romaji: "eul",    meaning: "object particle" },
      { text: "벗어",   furigana: "벗어",   romaji: "beoseo", meaning: "take off" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo", meaning: "please" },
    ]
  },
  {
    id: "play_supervision",
    color: "#2a4a6c",
    japanese: "어린 아이는\n어른과 함께\n보호자 동반",
    translation: "Young children must be with an adult. Guardian required.",
    tokens: [
      { text: "어린",   furigana: "어린",   romaji: "eorin",   meaning: "young" },
      { text: "아이",   furigana: "아이",   romaji: "ai",      meaning: "child" },
      { text: "는",     furigana: "는",     romaji: "neun",    meaning: "topic particle" },
      { text: "어른",   furigana: "어른",   romaji: "eoreun",  meaning: "adult" },
      { text: "과",     furigana: "과",     romaji: "gwa",     meaning: "and / with (conjunction)" },
      { text: "함께",   furigana: "함께",   romaji: "hamkke",  meaning: "together" },
      { text: "보호자", furigana: "보호자", romaji: "bohoja",  meaning: "guardian", parts: [
        { text: "보호", furigana: "보호", romaji: "boho", meaning: "protection" },
        { text: "자",   furigana: "자",   romaji: "ja",   meaning: "person" },
      ]},
      { text: "동반",   furigana: "동반",   romaji: "dongban", meaning: "accompanied by" },
    ]
  },
  {
    id: "play_age",
    color: "#2d6a4f",
    japanese: "3살부터 6살까지\n어린이를 위한 공간입니다",
    translation: "A space for children ages 3 to 6.",
    tokens: [
      { text: "3살",    furigana: "3살",    romaji: "se sal",      meaning: "3 years old" },
      { text: "부터",   furigana: "부터",   romaji: "buteo",       meaning: "from" },
      { text: "6살",    furigana: "6살",    romaji: "yeoseot sal", meaning: "6 years old" },
      { text: "까지",   furigana: "까지",   romaji: "kkaji",       meaning: "until" },
      { text: "어린이", furigana: "어린이", romaji: "eorini",  meaning: "child" },
      { text: "를",     furigana: "를",     romaji: "reul",    meaning: "object particle" },
      { text: "위한",   furigana: "위한",   romaji: "wihan",   meaning: "for" },
      { text: "공간", furigana: "공간", romaji: "gonggan", meaning: "area", parts: [
        { text: "공", furigana: "공", romaji: "gong", meaning: "empty / open" },
        { text: "간", furigana: "간", romaji: "gan",  meaning: "space / between" },
      ]},
      { text: "입니다", furigana: "입니다", romaji: "imnida", meaning: "is" },
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
      { text: "해",       furigana: "해",       romaji: "hae",          meaning: "please do" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",       meaning: "please" },
    ]
  },
  {
    id: "salon_food",
    color: "#8b3a1e",
    japanese: "음식물 반입은 삼가 주세요\n수분 보충만 가능합니다",
    translation: "Please do not bring food or drink. Only water is permitted.",
    tokens: [
      { text: "음식물", furigana: "음식물", romaji: "eumsigmul", meaning: "food and drink", parts: [
        { text: "음식", furigana: "음식", romaji: "eumsig", meaning: "food" },
        { text: "물",   furigana: "물",   romaji: "mul",    meaning: "substance" },
      ]},
      { text: "반입", furigana: "반입", romaji: "banip", meaning: "bringing in", parts: [
        { text: "반", furigana: "반", romaji: "ban", meaning: "carry / transport" },
        { text: "입", furigana: "입", romaji: "ip",  meaning: "entry / in" },
      ]},
      { text: "은",       furigana: "은",       romaji: "eun",       meaning: "topic particle" },
      { text: "삼가",     furigana: "삼가",     romaji: "samga",     meaning: "refrain" },
      { text: "주세요",   furigana: "주세요",   romaji: "juseyo",    meaning: "please" },
      { text: "수분", furigana: "수분", romaji: "subun", meaning: "water", parts: [
        { text: "수", furigana: "수", romaji: "su",  meaning: "water" },
        { text: "분", furigana: "분", romaji: "bun", meaning: "content / portion" },
      ]},
      { text: "보충", furigana: "보충", romaji: "bochung", meaning: "replenishment", parts: [
        { text: "보", furigana: "보", romaji: "bo",   meaning: "supplement" },
        { text: "충", furigana: "충", romaji: "chung", meaning: "fill / supply" },
      ]},
      { text: "만", furigana: "만", romaji: "man", meaning: "only" },
      { text: "가능", furigana: "가능", romaji: "ganeung", meaning: "allowed/possible/ok/okay", parts: [
        { text: "가", furigana: "가", romaji: "ga",    meaning: "possible / permissible" },
        { text: "능", furigana: "능", romaji: "neung", meaning: "ability / capable" },
      ]},
      { text: "합니다",   furigana: "합니다",   romaji: "hamnida",   meaning: "is" },
    ]
  },

  // --- OUTDOOR ---
  {
    id: "outdoor_zipline",
    color: "#c0392b",
    japanese: "짚라인 이용자가 지나가요\n주의하세요!",
    translation: "Zipline riders are passing through — watch out!",
    tokens: [
      { text: "짚라인",   furigana: "짚라인",   romaji: "jiprain", meaning: "zipline" },
      { text: "이용자",   furigana: "이용자",   romaji: "iyongja", meaning: "user", parts: [
        { text: "이용", furigana: "이용", romaji: "iyong", meaning: "use" },
        { text: "자",   furigana: "자",   romaji: "ja",    meaning: "person" },
      ]},
      { text: "가",       furigana: "가",       romaji: "ga",      meaning: "subject particle" },
      { text: "지나가",   furigana: "지나가",   romaji: "jinaga",  meaning: "pass" },
      { text: "요",       furigana: "요",       romaji: "yo",      meaning: "polite ending" },
      { text: "주의",     furigana: "주의",     romaji: "juui",    meaning: "caution" },
      { text: "하세요",   furigana: "하세요",   romaji: "haseyo",  meaning: "please do" },
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
      { text: "은",     furigana: "은",     romaji: "eun",       meaning: "topic particle" },
      { text: "어린",   furigana: "어린",   romaji: "eorin",     meaning: "young" },
      { text: "아이",   furigana: "아이",   romaji: "ai",        meaning: "child" },
      { text: "에게",   furigana: "에게",   romaji: "ege",       meaning: "to" },
      { text: "양보",   furigana: "양보",   romaji: "yangbo",    meaning: "give way" },
      { text: "해",     furigana: "해",     romaji: "hae",       meaning: "please do" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo",    meaning: "please" },
    ]
  },

  // --- GALLERY ---
  {
    id: "gallery_dolls",
    color: "#8b3a1e",
    japanese: "인형 코너에\n어서 오세요!",
    translation: "Welcome to the Doll Section!",
    tokens: [
      { text: "인형", furigana: "인형", romaji: "inhyeong", meaning: "doll", parts: [
        { text: "인", furigana: "인", romaji: "in",     meaning: "person" },
        { text: "형", furigana: "형", romaji: "hyeong", meaning: "shape / form" },
      ]},
      { text: "코너",   furigana: "코너",   romaji: "koneo",    meaning: "corner / section" },
      { text: "에",     furigana: "에",     romaji: "e",        meaning: "to" },
      { text: "어서",   furigana: "어서",   romaji: "eoseo",    meaning: "come" },
      { text: "오세요", furigana: "오세요", romaji: "oseyo",    meaning: "please come" },
    ]
  },
  {
    id: "gallery_care",
    color: "#1a3a5c",
    japanese: "전시품은\n만지지\n마세요",
    translation: "Please do not touch the exhibits.",
    tokens: [
      { text: "전시품", furigana: "전시품", romaji: "jeonshipum", meaning: "exhibits", parts: [
        { text: "전시", furigana: "전시", romaji: "jeonsi", meaning: "exhibition" },
        { text: "품",   furigana: "품",   romaji: "pum",    meaning: "item" },
      ]},
      { text: "은",     furigana: "은",     romaji: "eun",       meaning: "topic particle" },
      { text: "만지지", furigana: "만지지", romaji: "manjiji",   meaning: "don't touch" },
      { text: "마세요", furigana: "마세요", romaji: "maseyo",    meaning: "please don't" },
    ]
  },
  {
    id: "gallery_trains",
    color: "#2d6a4f",
    japanese: "기차 코너\n토요일·일요일\n10시부터 17시까지 개관",
    translation: "Train Section — Open Sat/Sun 10am to 5pm.",
    tokens: [
      { text: "기차", furigana: "기차", romaji: "gicha", meaning: "train", parts: [
        { text: "기", furigana: "기", romaji: "gi",  meaning: "steam / machine" },
        { text: "차", furigana: "차", romaji: "cha", meaning: "vehicle" },
      ]},
      { text: "코너",   furigana: "코너",   romaji: "koneo",       meaning: "corner / section" },
      { text: "토요일", furigana: "토요일", romaji: "toyoil", meaning: "Saturday", parts: [
        { text: "토요", furigana: "토요", romaji: "toyo", meaning: "Saturday (土曜)" },
        { text: "일",   furigana: "일",   romaji: "il",   meaning: "day" },
      ]},
      { text: "일요일", furigana: "일요일", romaji: "iryoil", meaning: "Sunday", parts: [
        { text: "일요", furigana: "일요", romaji: "iryo", meaning: "Sunday (日曜)" },
        { text: "일",   furigana: "일",   romaji: "il",   meaning: "day" },
      ]},
      { text: "10시",   furigana: "10시",   romaji: "yeolsi",      meaning: "10 o'clock" },
      { text: "부터",   furigana: "부터",   romaji: "buteo",        meaning: "from" },
      { text: "17시",   furigana: "17시",   romaji: "yeorilgopsi", meaning: "17 o'clock / 5pm" },
      { text: "까지",   furigana: "까지",   romaji: "kkaji",        meaning: "until" },
      { text: "개관", furigana: "개관", romaji: "gaegwan", meaning: "open (for business)", parts: [
        { text: "개", furigana: "개", romaji: "gae",  meaning: "open" },
        { text: "관", furigana: "관", romaji: "gwan", meaning: "building" },
      ]},
    ]
  },

  // --- HOUSE ---
  {
    id: "house_entrance",
    color: "#8b3a1e",
    japanese: "입구 — 어서 오세요\n신발을 벗어 주세요",
    translation: "Entrance — Welcome. Please remove your shoes.",
    tokens: [
      { text: "입구",   furigana: "입구",   romaji: "ipgu",   meaning: "entrance", parts: [
        { text: "입", furigana: "입", romaji: "ip",  meaning: "enter" },
        { text: "구", furigana: "구", romaji: "gu",  meaning: "opening / mouth" },
      ]},
      { text: "어서",   furigana: "어서",   romaji: "eoseo",  meaning: "come" },
      { text: "오세요", furigana: "오세요", romaji: "oseyo",  meaning: "please come" },
      { text: "신발",   furigana: "신발",   romaji: "sinbal", meaning: "shoes" },
      { text: "을",     furigana: "을",     romaji: "eul",    meaning: "object particle" },
      { text: "벗어",   furigana: "벗어",   romaji: "beoseo", meaning: "take off" },
      { text: "주세요", furigana: "주세요", romaji: "juseyo", meaning: "please" },
    ]
  },
  {
    id: "house_kotatsu",
    color: "#3a2810",
    japanese: "코타츠에서\n따뜻하게 지내요",
    translation: "Stay warm at the kotatsu.",
    tokens: [
      { text: "코타츠에서", furigana: "코타츠에서", romaji: "kotatsu eseo", meaning: "at the kotatsu",
        parts: [
          { text: "코타츠", furigana: "코타츠", romaji: "kotatsu", meaning: "kotatsu" },
          { text: "에서",   furigana: "에서",   romaji: "eseo",    meaning: "at" },
        ]
      },
      { text: "따뜻하게", furigana: "따뜻하게", romaji: "ttatteutage", meaning: "warmly" },
      { text: "지내요",   furigana: "지내요",   romaji: "jinaeyo",     meaning: "stay / spend time" },
    ]
  },
  {
    id: "house_kitchen",
    color: "#1a3a5c",
    japanese: "오늘 저녁은\n카레라이스입니다",
    translation: "Tonight's dinner is curry rice.",
    tokens: [
      { text: "오늘",       furigana: "오늘",       romaji: "oneul",      meaning: "today" },
      { text: "저녁",       furigana: "저녁",       romaji: "jeonyeok",   meaning: "evening / dinner" },
      { text: "은",         furigana: "은",         romaji: "eun",        meaning: "topic particle" },
      { text: "카레라이스", furigana: "카레라이스", romaji: "kareraiseu", meaning: "curry rice" },
      { text: "입니다",     furigana: "입니다",     romaji: "imnida",     meaning: "is" },
    ]
  },
  {
    id: "house_menu_only",
    color: "#3a2810",
    japanese: "카레라이스밖에\n없어요",
    translation: "We only have curry rice.",
    tokens: [
      { text: "카레라이스밖에", furigana: "카레라이스밖에", romaji: "kareraiseu bakke", meaning: "only curry rice / nothing but curry rice",
        parts: [
          { text: "카레라이스", furigana: "카레라이스", romaji: "kareraiseu", meaning: "curry rice" },
          { text: "밖에",       furigana: "밖에",       romaji: "bakke",      meaning: "only / nothing but" },
        ]
      },
      { text: "없어요", furigana: "없어요", romaji: "eopseoyo", meaning: "there isn't / none / no" },
    ]
  },

  // --- COOKING ROOM ---
  {
    id: "cooking_welcome",
    color: "#5c3317",
    japanese: "요리실에\n어서 오세요!",
    translation: "Welcome to the Cooking Room!",
    tokens: [
      { text: "요리실", furigana: "요리실", romaji: "yorisil", meaning: "cooking room", parts: [
        { text: "요리", furigana: "요리", romaji: "yori", meaning: "cooking" },
        { text: "실",   furigana: "실",   romaji: "sil",  meaning: "room" },
      ]},
      { text: "에",     furigana: "에",     romaji: "e",      meaning: "to" },
      { text: "어서",   furigana: "어서",   romaji: "eoseo",  meaning: "come" },
      { text: "오세요", furigana: "오세요", romaji: "oseyo",  meaning: "please come" },
    ]
  },
  {
    id: "cooking_safety",
    color: "#c0392b",
    japanese: "칼이나 불을\n사용할 때는\n조심하세요!",
    translation: "Be careful when using knives or fire!",
    tokens: [
      { text: "칼",           furigana: "칼",           romaji: "kal",                meaning: "knife" },
      { text: "이나",         furigana: "이나",         romaji: "ina",                meaning: "or" },
      { text: "불",           furigana: "불",           romaji: "bul",                meaning: "fire" },
      { text: "을",           furigana: "을",           romaji: "eul",                meaning: "object particle" },
      { text: "사용할", furigana: "사용할", romaji: "sayonghal", meaning: "using / will use", parts: [
        { text: "사용", furigana: "사용", romaji: "sayong", meaning: "use" },
        { text: "할",   furigana: "할",   romaji: "hal",    meaning: "will do (future)" },
      ]},
      { text: "때는",   furigana: "때는",   romaji: "ttaeneun",  meaning: "when / at the time of" },
      { text: "조심하세요", furigana: "조심하세요", romaji: "josim haseyo", meaning: "be careful", parts: [
        { text: "조심",   furigana: "조심",   romaji: "josim",  meaning: "caution / care" },
        { text: "하세요", furigana: "하세요", romaji: "haseyo", meaning: "please do" },
      ]},
    ]
  },
  {
    id: "cooking_schedule",
    color: "#1a3a5c",
    japanese: "오늘의 메뉴는\n카레라이스입니다",
    translation: "Today's menu is curry rice.",
    tokens: [
      { text: "오늘",       furigana: "오늘",       romaji: "oneul",      meaning: "today" },
      { text: "의",         furigana: "의",         romaji: "ui",         meaning: "possessive" },
      { text: "메뉴",       furigana: "메뉴",       romaji: "menyu",      meaning: "menu" },
      { text: "는",         furigana: "는",         romaji: "neun",       meaning: "topic particle" },
      { text: "카레라이스", furigana: "카레라이스", romaji: "kareraiseu", meaning: "curry rice" },
      { text: "입니다",     furigana: "입니다",     romaji: "imnida",     meaning: "is" },
    ]
  },

  // --- STREET ---
  {
    id: "street_mirai",
    color: "#1a3a6c",
    japanese: "도야마현\n어린이 미래관",
    translation: "Toyama Prefecture / Children's Future Hall",
    tokens: [
      { text: "도야마현", furigana: "도야마현", romaji: "doyama hyeon", meaning: "Toyama Prefecture", parts: [
        { text: "도야마", furigana: "도야마", romaji: "doyama", meaning: "Toyama (place name)" },
        { text: "현",     furigana: "현",     romaji: "hyeon",  meaning: "prefecture" },
      ]},
      { text: "어린이",   furigana: "어린이",   romaji: "eorini",       meaning: "child" },
      { text: "미래관", furigana: "미래관", romaji: "miraegwan", meaning: "Future Hall", parts: [
        { text: "미래", furigana: "미래", romaji: "mirae", meaning: "future" },
        { text: "관",   furigana: "관",   romaji: "gwan",  meaning: "building" },
      ]},
    ]
  },
  {
    id: "street_yield",
    color: "#9a6800",
    japanese: "나가는 분께\n양보합시다!",
    translation: "Please yield to people exiting.",
    tokens: [
      { text: "나가는", furigana: "나가는", romaji: "naganeun", meaning: "going out / to leave", parts: [
        { text: "나가", furigana: "나가", romaji: "naga", meaning: "exit / go out" },
        { text: "는",   furigana: "는",   romaji: "neun", meaning: "present modifier" },
      ]},
      { text: "분",     furigana: "분",     romaji: "bun",      meaning: "person" },
      { text: "께",     furigana: "께",     romaji: "kke",      meaning: "to (honorific)" },
      { text: "양보합시다", furigana: "양보합시다", romaji: "yangbo hapsida", meaning: "let's yield", parts: [
        { text: "양보",   furigana: "양보",   romaji: "yangbo",   meaning: "give way" },
        { text: "합시다", furigana: "합시다", romaji: "hapsida",  meaning: "let's do (formal)" },
      ]},
    ]
  },
  {
    id: "street_themes",
    color: "#2d5a3d",
    japanese: "모임·놀이·배움",
    translation: "Gathering · Play · Learning",
    tokens: [
      { text: "모임", furigana: "모임", romaji: "moim",  meaning: "gathering" },
      { text: "놀이", furigana: "놀이", romaji: "nori",  meaning: "play" },
      { text: "배움", furigana: "배움", romaji: "baeum", meaning: "learning" },
    ]
  },
  {
    id: "street_discovery",
    color: "#5a1a2a",
    japanese: "발견과 창조\n어린이의 미래",
    translation: "Discovery and Creation / Children's Future",
    tokens: [
      { text: "발견", furigana: "발견", romaji: "balgyeon", meaning: "discovery", parts: [
        { text: "발", furigana: "발", romaji: "bal",  meaning: "discover / put forth" },
        { text: "견", furigana: "견", romaji: "gyeon", meaning: "see / find" },
      ]},
      { text: "과", furigana: "과", romaji: "gwa", meaning: "and (conjunction)" },
      { text: "창조", furigana: "창조", romaji: "changjo", meaning: "creation", parts: [
        { text: "창", furigana: "창", romaji: "chang", meaning: "create / begin" },
        { text: "조", furigana: "조", romaji: "jo",    meaning: "make / build" },
      ]},
      { text: "어린이", furigana: "어린이", romaji: "eorini", meaning: "child" },
      { text: "의",     furigana: "의",     romaji: "ui",     meaning: "possessive" },
      { text: "미래", furigana: "미래", romaji: "mirae", meaning: "future", parts: [
        { text: "미", furigana: "미", romaji: "mi",  meaning: "not yet" },
        { text: "래", furigana: "래", romaji: "rae", meaning: "come" },
      ]},
    ]
  },
];
