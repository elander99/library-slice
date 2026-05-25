// NPC definitions: intents, scripted responses, keyword fallbacks, system prompts.
// Ollama classifies player input into an intent name; the game plays the scripted response.

const NPC_DEFS = {

  librarian: {
    name_jp: "司書",
    name_ko: "사서",
    name_en: "Librarian",
    room: "library",
    hotspot: "librarian",
    color: "#1a3a5c",
    greeting: {
      jp: "いらっしゃいませ。何かお手伝いできますか？",
      en: "Welcome. Can I help you with something?"
    },
    greeting_ko: {
      jp: "어서 오세요. 무엇을 도와드릴까요?",
      en: "Welcome. How can I help you?"
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","よろしく","どうも","こんばん"],
        jp: "こんにちは！今日もよろしくお願いします。",
        en: "Hello! Good to see you today."
      },
      ask_book: {
        keywords: ["本","書","図書","読","探","持ってきて","取って","ください"],
        jp: "ご希望の本についてはカタログをご覧ください。ご不明な点があれば、司書にお申し付けください。",
        en: "For the book you're looking for, please check the catalogue. Ask a librarian if you need help."
      },
      ask_quiet: {
        keywords: ["静か","うるさ","声","しずか","騒"],
        jp: "ありがとうございます。館内では静かにお過ごしください。他の方のご迷惑にならないようお願いします。",
        en: "Thank you. Please keep quiet in the library so as not to disturb others."
      },
      ask_laptop: {
        keywords: ["パソコン","ノート","ラップトップ","コンピュータ","仕事","作業"],
        jp: "ノートパソコンは図書館業務に関連する場合のみご利用いただけます。個人的な作業はご遠慮ください。",
        en: "Laptops may only be used for library-related work. Personal use is not permitted."
      },
      ask_food: {
        keywords: ["食べ","飲み","飲食","お菓子","弁当","ランチ","水"],
        jp: "館内では飲食はご遠慮ください。水分補給のみ可能です。お食事は1階のラウンジをご利用ください。",
        en: "Eating and drinking are not allowed inside. Water is fine. Please use the 1st floor lounge for meals."
      },
      ask_outlet: {
        keywords: ["コンセント","充電","電源","プラグ","ケーブル"],
        jp: "コンセントは図書館業務に関連する場合のみご使用いただけます。",
        en: "Outlets may only be used for library-related work."
      },
      apologize: {
        keywords: ["すみません","ごめん","申し訳","失礼"],
        jp: "いいえ、お気になさらずに。何かお手伝いできることがあればお知らせください。",
        en: "No worries at all. Please let me know if there's anything I can help with."
      },
      confused: {
        keywords: [],
        jp: "すみません、よく聞こえませんでした。もう一度おっしゃっていただけますか？",
        en: "Sorry, I didn't quite catch that. Could you say it again?"
      }
    }
  },

  receptionist: {
    name_jp: "受付係",
    name_ko: "안내 직원",
    name_en: "Receptionist",
    room: "lobby",
    hotspot: "npc_receptionist",
    color: "#5c3317",
    greeting: {
      jp: "こんにちは！富山県こどもみらい館へようこそ。何かお手伝いできますか？",
      en: "Hello! Welcome to Toyama Children's Future Hall. How can I help you?"
    },
    greeting_ko: {
      jp: "안녕하세요! 무엇을 도와드릴까요?",
      en: "Hello! How can I help you?"
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","よろしく","どうも"],
        jp: "こんにちは！何かご用件がございましたら、お気軽にどうぞ。",
        en: "Hello! Feel free to ask if there's anything you need."
      },
      ask_directions: {
        keywords: ["どこ","場所","行き方","案内","地図","図書館","サロン","料理","2階","1階"],
        jp: "図書館とこどもサロンは2階にございます。料理室と研修室も2階です。1階はおもちゃ画廊と人形画廊です。エレベーターをご利用ください。",
        en: "The library and children's salon are on the 2nd floor, as are the cooking room and training room. The 1st floor has the toy and doll galleries. Please use the elevator."
      },
      ask_hours: {
        keywords: ["何時","いつ","時間","開館","閉館","営業","終わり","始まり"],
        jp: "本日は午前9時から午後5時まで開館しております。最終入館は午後4時30分です。",
        en: "We're open today from 9 AM to 5 PM. Last entry is 4:30 PM."
      },
      ask_today: {
        keywords: ["今日","本日","イベント","催し","プログラム","特別"],
        jp: "本日は特別なイベントはございませんが、通常の施設はすべてご利用いただけます。",
        en: "There are no special events today, but all regular facilities are available."
      },
      ask_membership: {
        keywords: ["登録","会員","カード","申込","入会","利用"],
        jp: "利用登録はこちらの受付で行っております。身分証明書をお持ちいただければ、すぐにお手続きできます。",
        en: "You can register here at the reception desk. Please bring your ID and we can process it right away."
      },
      confused: {
        keywords: [],
        jp: "申し訳ございません。ご用件をもう少し詳しくお聞かせいただけますか？",
        en: "I'm sorry. Could you tell me a bit more about what you need?"
      }
    }
  },

  play_staff: {
    name_jp: "スタッフ",
    name_ko: "직원",
    name_en: "Play Area Staff",
    room: "play_area",
    hotspot: "npc_play_staff",
    color: "#2d6a4f",
    greeting: {
      jp: "こんにちは！今日は遊びに来てくれたの？楽しんでいってね！",
      en: "Hello! Did you come to play today? Have fun!"
    },
    greeting_ko: {
      jp: "안녕하세요! 오늘 놀러 오셨어요? 재미있게 놀아요!",
      en: "Hello! Did you come to play today? Have fun!"
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","よろしく"],
        jp: "こんにちは！安全に楽しく遊んでね。何かあったらすぐに声をかけてください。",
        en: "Hello! Play safely and have fun. Let me know right away if anything happens."
      },
      ask_age: {
        keywords: ["何歳","年齢","対象","才","歳","子供","こども","小学","年","何年"],
        jp: "このエリアは3才から6才のお子様が対象です。7才以上の方は小さな子に道を譲ってあげてください。",
        en: "This area is for children ages 3 to 6. Those 7 and older should give way to younger children."
      },
      ask_shoes: {
        keywords: ["くつ","靴","脱","履","はき","下駄"],
        jp: "遊び場に入る前に必ず靴を脱いでください。下駄箱をご利用ください。靴下はそのままで大丈夫ですよ。",
        en: "Please take off your shoes before entering. Use the shoe rack. Socks are fine to keep on."
      },
      ask_supervision: {
        keywords: ["保護者","大人","親","一緒","付き添","監視","目"],
        jp: "小さいお子様は必ず保護者と一緒にお願いします。目を離さないようにお気をつけください。",
        en: "Small children must be with an adult at all times. Please keep a close eye on them."
      },
      ask_rules: {
        keywords: ["ルール","規則","注意","危ない","禁止","守"],
        jp: "走らないようにしてください。他のお子様とぶつからないよう気をつけて、順番を守って遊んでください。",
        en: "Please don't run. Watch out for other children, and take turns when playing."
      },
      confused: {
        keywords: [],
        jp: "ごめんね、もう一回言ってもらえる？",
        en: "Sorry, could you say that again?"
      }
    }
  },

  salon_staff: {
    name_jp: "サロンスタッフ",
    name_ko: "살롱 직원",
    name_en: "Salon Staff",
    room: "salon",
    hotspot: "npc_salon_staff",
    color: "#5c1a5c",
    greeting: {
      jp: "こどもサロンへようこそ！ゆっくりしていってね。何かあったら声をかけてね。",
      en: "Welcome to the Children's Salon! Take your time. Just call if you need anything."
    },
    greeting_ko: {
      jp: "어린이 살롱에 오신 것을 환영해요! 천천히 즐기세요.",
      en: "Welcome to the Children's Salon! Take your time."
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","よろしく"],
        jp: "こんにちは！今日はどんな工作をしますか？楽しんでね。",
        en: "Hello! What kind of craft are you making today? Have fun."
      },
      ask_food: {
        keywords: ["食べ","飲み","飲食","お菓子","弁当","ランチ","水","お腹"],
        jp: "サロン内では飲食はご遠慮ください。水分補給のみ大丈夫ですよ。お食事は1階のラウンジをご利用ください。",
        en: "Please don't eat in the salon. Water is fine. For meals, please use the 1st floor lounge."
      },
      ask_share: {
        keywords: ["順番","使い方","貸して","借り","一緒","みんな","共有","シェア"],
        jp: "道具はみんなで仲良く順番に使ってください。使い終わったら元の場所に戻してね。",
        en: "Please take turns and share the equipment. Put everything back when you're done."
      },
      ask_age: {
        keywords: ["何歳","年齢","対象","才","歳","小学","子供"],
        jp: "このサロンは主に小学校高学年以上の方が対象です。小さいお子様は保護者の方と一緒にどうぞ。",
        en: "This salon is mainly for upper elementary students and above. Young children, please come with a guardian."
      },
      ask_crafts: {
        keywords: ["工作","材料","作る","作り方","手伝","教えて","何"],
        jp: "今日は工作台が使えますよ。材料はあちらにあります。わからないことがあれば気軽に聞いてね。",
        en: "The craft table is available today. Materials are over there. Feel free to ask if you're unsure about anything."
      },
      confused: {
        keywords: [],
        jp: "すみません、もう少しゆっくり話してもらえますか？",
        en: "Sorry, could you speak a little more slowly?"
      }
    }
  },

  outdoor_guide: {
    name_jp: "外スタッフ",
    name_ko: "야외 직원",
    name_en: "Outdoor Guide",
    room: "outdoor",
    hotspot: "npc_outdoor_guide",
    color: "#2d6a1f",
    greeting: {
      jp: "こんにちは！ジップラインをご利用の方は、順番をお守りください。",
      en: "Hello! If you're using the zipline, please wait your turn."
    },
    greeting_ko: {
      jp: "안녕하세요! 짚라인을 이용하시려면 차례를 지켜 주세요.",
      en: "Hello! Please wait your turn to use the zipline."
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","こんばん","どうも"],
        jp: "こんにちは！外の空気は気持ちいいですね。何かお手伝いできますか？",
        en: "Hello! The fresh air is nice, isn't it? Can I help you with something?"
      },
      ask_zipline: {
        keywords: ["ジップライン","zipline","乗り方","使い方","順番","並ぶ","並んで","待つ"],
        jp: "ジップラインは順番にご利用ください。小さいお子様は保護者の方と一緒にどうぞ。",
        en: "Please take turns on the zipline. Small children should use it with a guardian."
      },
      ask_rules: {
        keywords: ["ルール","決まり","約束","危ない","危険","注意","してはいけない"],
        jp: "走らないでください。ジップラインは一人ずつご利用いただき、終わったら次の方に譲ってください。",
        en: "Please don't run. Use the zipline one at a time and yield to the next person when you're done."
      },
      ask_inside: {
        keywords: ["図書館","中","建物","入る","どこ","トイレ","休憩"],
        jp: "建物の中は左の入口から入れます。図書館やサロンは2階にありますよ。",
        en: "You can enter the building through the entrance on the left. The library and salon are on the 2nd floor."
      },
      confused: {
        keywords: [],
        jp: "すみません、もう少しゆっくり話してもらえますか？",
        en: "Sorry, could you speak a little more slowly?"
      }
    }
  },

  house_resident: {
    name_jp: "住人",
    name_ko: "거주자",
    name_en: "Resident",
    room: "house",
    hotspot: "npc_house_resident",
    color: "#5c3a1e",
    greeting: {
      jp: "おかえりなさい！ゆっくりしていってね。",
      en: "Welcome back! Make yourself at home."
    },
    greeting_ko: {
      jp: "어서 오세요! 편히 쉬다 가세요.",
      en: "Welcome! Please relax and stay a while."
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","ただいま","おかえり","こんばん"],
        jp: "ただいま！疲れたでしょう。こたつでゆっくりしてね。",
        en: "You're home! You must be tired. Rest by the kotatsu."
      },
      ask_food: {
        keywords: ["食べ","飲み","お茶","ご飯","何か","腹","お腹","空いた","夕飯","カレー"],
        jp: "今日はカレーライスですよ。台所にお茶もあるので、先にどうぞ。",
        en: "Tonight's dinner is curry rice. There's also tea in the kitchen — help yourself."
      },
      ask_house: {
        keywords: ["家","いえ","うち","部屋","こたつ","畳","たたみ","居間","玄関"],
        jp: "この家は古いけど居心地がいいでしょう？畳の匂いが大好きなんです。",
        en: "This house is old, but cozy, isn't it? I love the smell of tatami."
      },
      ask_outside: {
        keywords: ["外","そと","図書館","どこ","行く","出る","帰る","出口"],
        jp: "外に出るなら左の出口から。外は気持ちいいですよ。",
        en: "If you're heading out, use the exit on the left. It's lovely outside."
      },
      ask_shoes: {
        keywords: ["くつ","靴","玄関","脱ぐ","ぬぐ","どこに"],
        jp: "玄関でくつをぬいでから上がってね。それが家のルールです。",
        en: "Please take off your shoes at the entrance. That's the house rule."
      },
      confused: {
        keywords: [],
        jp: "ごめんなさい、もう一度言ってもらえますか？",
        en: "Sorry, could you say that again?"
      }
    }
  },

};

// Maps hotspot ids to NPC ids
const NPC_HOTSPOT = {};
Object.values(NPC_DEFS).forEach(npc => { NPC_HOTSPOT[npc.hotspot] = npc.id || Object.keys(NPC_DEFS).find(k => NPC_DEFS[k] === npc); });

// Fallback classifier: keyword matching when Ollama is unavailable
function npc_fallback_classify(npc_id, text) {
  const npc = NPC_DEFS[npc_id];
  if (!npc) return "confused";
  for (const [intent_id, intent] of Object.entries(npc.intents)) {
    if (intent.keywords && intent.keywords.some(kw => text.includes(kw))) return intent_id;
  }
  return "confused";
}

// Build per-NPC system prompt for Ollama
function npc_system_prompt(npc_id) {
  const npc = NPC_DEFS[npc_id];
  if (!npc) return "";
  const intent_lines = Object.entries(npc.intents)
    .map(([id, intent]) => `- ${id}: player ${intent.keywords.length ? `mentions ${intent.keywords.slice(0,3).join(", ")} or similar` : "none of the above apply"}`)
    .join("\n");
  return `You classify player messages in a Japanese simulation game. The player is speaking to the ${npc.name_en}.

Choose the best intent from this list:
${intent_lines}

The player's message is in Japanese. Reply with ONLY the intent name — one word, no explanation, no punctuation.`;
}
