// Signs for non-library rooms
const WORLD_SIGNS = [

  // --- LOBBY ---
  {
    id: "lobby_directory",
    label: "フロア案内",
    color: "#1a3a5c",
    japanese: "図書館・こどもサロン\n料理室・おもちゃ画廊",
    tokens: [
      { text: "図書館",   furigana: "としょかん",   romaji: "toshokan",     meaning: "library" },
      { text: "サロン",   furigana: "サロン",       romaji: "saron",        meaning: "salon / lounge" },
      { text: "料理室",   furigana: "りょうりしつ", romaji: "ryourishitsu", meaning: "cooking room / kitchen" },
      { text: "画廊",     furigana: "がろう",       romaji: "garou",        meaning: "gallery" },
    ]
  },
  {
    id: "lobby_reception",
    label: "受付",
    color: "#5c3317",
    japanese: "本日の受付は\n終了しました",
    tokens: [
      { text: "本日",   furigana: "ほんじつ",     romaji: "honjitsu",  meaning: "today / this day" },
      { text: "受付",   furigana: "うけつけ",     romaji: "uketsuke",  meaning: "reception / front desk / check-in" },
      { text: "終了",   furigana: "しゅうりょう", romaji: "shuuryou",  meaning: "end / finished / closed / completion" },
    ]
  },

  // --- PLAY AREA ---
  {
    id: "play_shoes",
    label: "くつ",
    color: "#8b3a1e",
    japanese: "くつを\nぬぎましょう",
    tokens: [
      { text: "くつ",         furigana: "くつ",         romaji: "kutsu",      meaning: "shoes / footwear" },
      { text: "ぬぎましょう", furigana: "ぬぎましょう", romaji: "nugimashou", meaning: "let's take off / please remove" },
    ]
  },
  {
    id: "play_supervision",
    label: "保護者同伴",
    color: "#2a4a6c",
    japanese: "小さいお子様は\n大人と一緒に",
    tokens: [
      { text: "小さい", furigana: "ちいさい",   romaji: "chiisai",  meaning: "small / little / young" },
      { text: "お子様", furigana: "おこさま",   romaji: "okosama",  meaning: "child / children (polite)" },
      { text: "大人",   furigana: "おとな",     romaji: "otona",    meaning: "adult / grown-up" },
      { text: "一緒に", furigana: "いっしょに", romaji: "issho ni", meaning: "together / with" },
    ]
  },
  {
    id: "play_age",
    label: "対象年齢",
    color: "#2d6a4f",
    japanese: "3才から6才まで\nのこどもたちが\n対象です",
    tokens: [
      { text: "才",     furigana: "さい",       romaji: "sai",     meaning: "years old / age" },
      { text: "から",   furigana: "から",       romaji: "kara",    meaning: "from / since" },
      { text: "まで",   furigana: "まで",       romaji: "made",    meaning: "until / up to" },
      { text: "こども", furigana: "こども",     romaji: "kodomo",  meaning: "child / children" },
      { text: "対象",   furigana: "たいしょう", romaji: "taishou", meaning: "target / intended for / subject" },
    ]
  },

  // --- SALON ---
  {
    id: "salon_share",
    label: "おねがい",
    color: "#5c1a5c",
    japanese: "順番に仲よく\n使いましょう",
    tokens: [
      { text: "順番に",       furigana: "じゅんばんに",   romaji: "junban ni",    meaning: "in turns / taking turns / in order" },
      { text: "仲よく",       furigana: "なかよく",       romaji: "nakayoku",     meaning: "friendly / harmoniously / together" },
      { text: "使いましょう", furigana: "つかいましょう", romaji: "tsukaimashou", meaning: "let's use / please use" },
    ]
  },
  {
    id: "salon_food",
    label: "飲食について",
    color: "#8b3a1e",
    japanese: "飲食はご遠慮\nください\n水分補給は可",
    tokens: [
      { text: "飲食",     furigana: "いんしょく",       romaji: "inshoku",       meaning: "eating and drinking / food and drink" },
      { text: "ご遠慮",   furigana: "ごえんりょ",       romaji: "goenryo",       meaning: "refrain / please hold back" },
      { text: "ください", furigana: "ください",         romaji: "kudasai",       meaning: "please" },
      { text: "水分補給", furigana: "すいぶんほきゅう", romaji: "suibun hokyuu", meaning: "hydration / drinking water" },
      { text: "可",       furigana: "か",               romaji: "ka",            meaning: "allowed / permitted / OK" },
    ]
  },

  // --- OUTDOOR ---
  {
    id: "outdoor_zipline",
    label: "ジップライン",
    color: "#c0392b",
    japanese: "ジップラインに\n乗っている人が\n通ります\n気をつけて！",
    tokens: [
      { text: "ジップライン", furigana: "ジップライン", romaji: "jippurain",     meaning: "zipline" },
      { text: "乗っている",   furigana: "のっている",   romaji: "notte iru",     meaning: "riding / on board / currently on" },
      { text: "人",           furigana: "ひと",         romaji: "hito",          meaning: "person / people" },
      { text: "通ります",     furigana: "とおります",   romaji: "toorimasu",     meaning: "will pass / passes through" },
      { text: "気をつけて",   furigana: "きをつけて",   romaji: "ki wo tsukete", meaning: "be careful / watch out" },
    ]
  },
  {
    id: "outdoor_yield",
    label: "ゆずりあい",
    color: "#b8860b",
    japanese: "7才以上の方は\n小さな子に\n道を譲って",
    tokens: [
      { text: "7才",    furigana: "ななさい", romaji: "nana sai", meaning: "7 years old / age 7" },
      { text: "以上",   furigana: "いじょう", romaji: "ijou",     meaning: "and over / or more / above" },
      { text: "方",     furigana: "かた",     romaji: "kata",     meaning: "person / people (polite)" },
      { text: "小さな", furigana: "ちいさな", romaji: "chiisana", meaning: "small / little" },
      { text: "子",     furigana: "こ",       romaji: "ko",       meaning: "child / kid" },
      { text: "道",     furigana: "みち",     romaji: "michi",    meaning: "path / way / road" },
      { text: "譲って", furigana: "ゆずって", romaji: "yuzutte",  meaning: "give way / yield / let pass" },
    ]
  },

  // --- HOUSE ---
  {
    id: "house_entrance",
    label: "玄関",
    color: "#8b3a1e",
    japanese: "おかえりなさい\nくつをおぬぎ\nください",
    tokens: [
      { text: "おかえりなさい", furigana: "おかえりなさい", romaji: "okaerinasai", meaning: "welcome back / you're home" },
      { text: "くつ",           furigana: "くつ",           romaji: "kutsu",       meaning: "shoes / footwear" },
      { text: "を",             furigana: "を",             romaji: "wo",          meaning: "object marker / particle" },
      { text: "おぬぎ",         furigana: "おぬぎ",         romaji: "onugi",       meaning: "take off / remove (polite)" },
      { text: "ください",       furigana: "ください",       romaji: "kudasai",     meaning: "please" },
    ]
  },
  {
    id: "house_kotatsu",
    label: "居間",
    color: "#3a2810",
    japanese: "こたつで\nあたたまろう",
    tokens: [
      { text: "こたつ",       furigana: "こたつ",       romaji: "kotatsu",      meaning: "kotatsu / heated table / low table" },
      { text: "で",           furigana: "で",           romaji: "de",           meaning: "at / in / by means of / particle" },
      { text: "あたたまろう", furigana: "あたたまろう", romaji: "atatamaro u",  meaning: "let's warm up / let's get cozy" },
    ]
  },
  {
    id: "house_kitchen",
    label: "台所",
    color: "#1a3a5c",
    japanese: "今日の夕飯は\nカレーライスです",
    tokens: [
      { text: "今日",         furigana: "きょう",         romaji: "kyou",          meaning: "today / this day" },
      { text: "の",           furigana: "の",             romaji: "no",            meaning: "possessive / of / particle" },
      { text: "夕飯",         furigana: "ゆうはん",       romaji: "yuuhan",        meaning: "dinner / evening meal / supper" },
      { text: "は",           furigana: "は",             romaji: "wa",            meaning: "topic marker / particle" },
      { text: "カレーライス", furigana: "カレーライス",   romaji: "karee raisu",   meaning: "curry rice / Japanese curry" },
      { text: "です",         furigana: "です",           romaji: "desu",          meaning: "is / are / it is / copula" },
    ]
  },
];
