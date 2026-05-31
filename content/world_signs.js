// Signs for non-library rooms
const WORLD_SIGNS = [

  // --- LOBBY ---
  {
    id: "lobby_directory",
    label: "フロア案内",
    color: "#1a3a5c",
    japanese: "図書館・こどもサロン\n料理室・おもちゃ画廊",
    translation: "Library · Children's Salon / Cooking Room · Toy Gallery",
    tokens: [
      { text: "図書館",   furigana: "としょかん",   romaji: "toshokan",     meaning: "library" },
      { text: "サロン",   furigana: "サロン",       romaji: "saron",        meaning: "salon" },
      { text: "料理室",   furigana: "りょうりしつ", romaji: "ryourishitsu", meaning: "cooking room" },
      { text: "画廊",     furigana: "がろう",       romaji: "garou",        meaning: "gallery" },
    ]
  },
  {
    id: "lobby_reception",
    label: "受付",
    color: "#5c3317",
    japanese: "本日の受付は\n終了しました",
    translation: "Today's reception is closed.",
    tokens: [
      { text: "本日",   furigana: "ほんじつ",     romaji: "honjitsu",  meaning: "today" },
      { text: "受付",   furigana: "うけつけ",     romaji: "uketsuke",  meaning: "reception" },
      { text: "終了",   furigana: "しゅうりょう", romaji: "shuuryou",  meaning: "closed" },
    ]
  },

  // --- PLAY AREA ---
  {
    id: "play_shoes",
    label: "くつ",
    color: "#8b3a1e",
    japanese: "くつを\nぬぎましょう",
    translation: "Please remove your shoes.",
    tokens: [
      { text: "くつ",         furigana: "くつ",         romaji: "kutsu",      meaning: "shoes" },
      { text: "ぬぎましょう", furigana: "ぬぎましょう", romaji: "nugimashou", meaning: "please remove" },
    ]
  },
  {
    id: "play_supervision",
    label: "保護者同伴",
    color: "#2a4a6c",
    japanese: "小さいお子様は\n大人と一緒に",
    translation: "Young children must be accompanied by an adult.",
    tokens: [
      { text: "小さい", furigana: "ちいさい",   romaji: "chiisai",  meaning: "small" },
      { text: "お子様", furigana: "おこさま",   romaji: "okosama",  meaning: "child" },
      { text: "大人",   furigana: "おとな",     romaji: "otona",    meaning: "adult" },
      { text: "一緒に", furigana: "いっしょに", romaji: "issho ni", meaning: "together" },
    ]
  },
  {
    id: "play_age",
    label: "対象年齢",
    color: "#2d6a4f",
    japanese: "3才から6才まで\nのこどもたちが\n対象です",
    translation: "Intended for children ages 3 to 6.",
    tokens: [
      { text: "3",      furigana: "さん",       romaji: "san",     meaning: "three" },
      { text: "才",     furigana: "さい",       romaji: "sai",     meaning: "years old" },
      { text: "から",   furigana: "から",       romaji: "kara",    meaning: "from" },
      { text: "6",      furigana: "ろく",       romaji: "roku",    meaning: "six" },
      { text: "才",     furigana: "さい",       romaji: "sai",     meaning: "years old" },
      { text: "まで",   furigana: "まで",       romaji: "made",    meaning: "until" },
      { text: "こども", furigana: "こども",     romaji: "kodomo",  meaning: "child" },
      { text: "対象",   furigana: "たいしょう", romaji: "taishou", meaning: "intended for" },
    ]
  },

  // --- SALON ---
  {
    id: "salon_share",
    label: "おねがい",
    color: "#5c1a5c",
    japanese: "順番に仲よく\n使いましょう",
    translation: "Please take turns and be friendly.",
    tokens: [
      { text: "順番に",       furigana: "じゅんばんに",   romaji: "junban ni",    meaning: "in turns" },
      { text: "仲よく",       furigana: "なかよく",       romaji: "nakayoku",     meaning: "friendly" },
      { text: "使いましょう", furigana: "つかいましょう", romaji: "tsukaimashou", meaning: "please use" },
    ]
  },
  {
    id: "salon_food",
    label: "飲食について",
    color: "#8b3a1e",
    japanese: "飲食はご遠慮\nください\n水分補給は可",
    translation: "Please refrain from eating and drinking. Water is permitted.",
    tokens: [
      { text: "飲食",     furigana: "いんしょく",       romaji: "inshoku",       meaning: "eating and drinking" },
      { text: "ご遠慮",   furigana: "ごえんりょ",       romaji: "goenryo",       meaning: "please refrain" },
      { text: "ください", furigana: "ください",         romaji: "kudasai",       meaning: "please" },
      { text: "水分補給", furigana: "すいぶんほきゅう", romaji: "suibun hokyuu", meaning: "hydration" },
      { text: "可",       furigana: "か",               romaji: "ka",            meaning: "allowed" },
    ]
  },

  // --- OUTDOOR ---
  {
    id: "outdoor_zipline",
    label: "ジップライン",
    color: "#c0392b",
    japanese: "ジップラインに\n乗っている人が\n通ります\n気をつけて！",
    translation: "Zipline riders are passing through — watch out!",
    tokens: [
      { text: "ジップライン", furigana: "ジップライン", romaji: "jippurain",     meaning: "zipline" },
      { text: "乗っている",   furigana: "のっている",   romaji: "notte iru",     meaning: "riding" },
      { text: "人",           furigana: "ひと",         romaji: "hito",          meaning: "person" },
      { text: "通ります",     furigana: "とおります",   romaji: "toorimasu",     meaning: "will pass" },
      { text: "気をつけて",   furigana: "きをつけて",   romaji: "ki wo tsukete", meaning: "watch out" },
    ]
  },
  {
    id: "outdoor_yield",
    label: "ゆずりあい",
    color: "#b8860b",
    japanese: "7才以上の方は\n小さな子に\n道を譲って",
    translation: "Those 7 and older, please give way to younger children.",
    tokens: [
      { text: "7才",    furigana: "ななさい", romaji: "nana sai", meaning: "7 years old" },
      { text: "以上",   furigana: "いじょう", romaji: "ijou",     meaning: "and over" },
      { text: "方",     furigana: "かた",     romaji: "kata",     meaning: "person" },
      { text: "小さな", furigana: "ちいさな", romaji: "chiisana", meaning: "small" },
      { text: "子",     furigana: "こ",       romaji: "ko",       meaning: "child" },
      { text: "道",     furigana: "みち",     romaji: "michi",    meaning: "path" },
      { text: "譲って", furigana: "ゆずって", romaji: "yuzutte",  meaning: "give way" },
    ]
  },

  // --- HOUSE ---
  {
    id: "house_entrance",
    label: "玄関",
    color: "#8b3a1e",
    japanese: "おかえりなさい\nくつをおぬぎ\nください",
    translation: "Welcome back — please remove your shoes.",
    tokens: [
      { text: "おかえりなさい", furigana: "おかえりなさい", romaji: "okaerinasai", meaning: "welcome back" },
      { text: "くつ",           furigana: "くつ",           romaji: "kutsu",       meaning: "shoes" },
      { text: "を",             furigana: "を",             romaji: "wo",          meaning: "object marker/object" },
      { text: "おぬぎ",         furigana: "おぬぎ",         romaji: "onugi",       meaning: "please remove" },
      { text: "ください",       furigana: "ください",       romaji: "kudasai",     meaning: "please" },
    ]
  },
  {
    id: "house_kotatsu",
    label: "居間",
    color: "#3a2810",
    japanese: "こたつで\nあたたまろう",
    translation: "Let's warm up at the kotatsu.",
    tokens: [
      { text: "こたつ",       furigana: "こたつ",       romaji: "kotatsu",      meaning: "kotatsu" },
      { text: "で",           furigana: "で",           romaji: "de",           meaning: "at" },
      { text: "あたたまろう", furigana: "あたたまろう", romaji: "atatamaro u",  meaning: "let's warm up" },
    ]
  },
  {
    id: "house_kitchen",
    label: "台所",
    color: "#1a3a5c",
    japanese: "今日の夕飯は\nカレーライスです",
    translation: "Today's dinner is curry rice.",
    tokens: [
      { text: "今日",         furigana: "きょう",         romaji: "kyou",          meaning: "today" },
      { text: "の",           furigana: "の",             romaji: "no",            meaning: "possessive particle/possessive" },
      { text: "夕飯",         furigana: "ゆうはん",       romaji: "yuuhan",        meaning: "dinner" },
      { text: "は",           furigana: "は",             romaji: "wa",            meaning: "topic particle/topic" },
      { text: "カレーライス", furigana: "カレーライス",   romaji: "karee raisu",   meaning: "curry rice" },
      { text: "です",         furigana: "です",           romaji: "desu",          meaning: "is" },
    ]
  },
];
