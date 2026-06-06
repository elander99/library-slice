// NPC definitions: intents, scripted responses, keyword fallbacks, system prompts.
// Ollama classifies player input into an intent name; the game plays the scripted response.
// Ambient-only NPCs (no intents) just need name + color for the fallback figure.

const NPC_DEFS = {

  // ── Ambient-only (conversations only, no player dialogue) ─────────────────
  student_a: { name_en: 'Student A', name_ko: '학생 A', color: '#2a4a6c',
    desc_en: 'A student doing library work. Please be quiet — refrain from phone calls here.' },
  student_b: { name_en: 'Student B', name_ko: '학생 B', color: '#1a3a2c',
    desc_en: 'A student. The outlet is for library work only — consumption of food is prohibited.' },
  child_a:   { name_en: 'Child A',   name_ko: '어린이 A', color: '#8b3a1e',
    desc_en: 'A young child visiting the facility. Young children must be accompanied by an adult.' },
  child_b:   { name_en: 'Child B',   name_ko: '어린이 B', color: '#4a1a6c',
    desc_en: 'A child. Those 7 and over must give way to younger children at play equipment.' },
  visitor_a: { name_en: 'Visitor A', name_ko: '방문객 A', color: '#5c3317',
    desc_en: 'A visitor to the facility.' },
  visitor_b: { name_en: 'Visitor B', name_ko: '방문객 B', color: '#3a5c1a',
    desc_en: 'A visitor to the facility.' },

  librarian: {
    name_jp: "司書",
    name_ko: "사서",
    name_en: "Librarian",
    room: "library",
    hotspot: "librarian",
    color: "#1a3a5c",
    birthday: { month: 11, day: 3, jp: "11月3日", ko: "11월 3일" },
    activity_ko: '도서관 업무를 보고 있어요.',
    activity_en: "I'm working at the library desk.",
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
        keywords_ko: ["안녕","반갑","처음","잘 부탁"],
        jp: "こんにちは！今日もよろしくお願いします。",
        ko: "안녕하세요! 오늘도 잘 부탁드립니다.",
        en: "Hello! Good to see you today."
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "本の整理や貸し出し処理をしています。何かお手伝いできますか？",
        ko: "도서관 업무를 보고 있어요. 책 정리나 대출 처리가 주 업무예요. 도움 필요하세요?",
        en: "I'm doing library work — organizing books and handling checkouts. Can I help you?"
      },
      ask_book: {
        keywords: ["本","書","図書","読","探","持ってきて","取って","ください"],
        keywords_ko: ["책","도서","읽","찾","빌려","사서"],
        jp: "ご希望の本についてはカタログをご覧ください。ご不明な点があれば、司書にお申し付けください。",
        ko: "원하시는 책은 카탈로그에서 검색해 보세요. 학생들이 많이 찾는 책도 있어요. 모르시면 사서에게 물어보세요.",
        en: "For the book you're looking for, please check the catalogue. Ask a librarian if you need help."
      },
      ask_quiet: {
        keywords: ["静か","うるさ","声","しずか","騒"],
        keywords_ko: ["조용","시끄","통화","전화","목소리","학생"],
        jp: "ありがとうございます。館内では静かにお過ごしください。窓側の席もございますので、ゆっくりどうぞ。他の方のご迷惑にならないようお願いします。",
        ko: "감사합니다. 학생 여러분, 관내에서는 조용히 해 주세요. 휴대전화 통화도 삼가 주세요.",
        en: "Thank you. Please keep quiet in the library. The window seats are available if you'd like — take your time. Please be considerate of others."
      },
      ask_laptop: {
        keywords: ["パソコン","ノート","ラップトップ","コンピュータ","仕事","作業"],
        keywords_ko: ["노트북","컴퓨터","충전","콘센트","작업","업무"],
        jp: "ノートパソコンは図書館業務に関連する場合のみご利用いただけます。個人的な作業はご遠慮ください。",
        ko: "노트북은 도서관 업무 전용으로만 사용해 주세요. 개인 작업은 삼가 주세요.",
        en: "Laptops may only be used for library-related work. Personal use is not permitted."
      },
      ask_food: {
        keywords: ["食べ","飲み","飲食","お菓子","弁当","ランチ","水"],
        keywords_ko: ["먹","마시","음식","간식","물","음료","섭취","반입"],
        jp: "館内では飲食はご遠慮ください。水分補給のみ可能です。お食事は1階のロビーラウンジをご利用ください。",
        ko: "관내에서 음식물 섭취는 금지입니다. 음식 반입도 불가입니다. 수분 보충만 허용됩니다.",
        en: "Eating and drinking are not allowed inside. Water is fine. Please use the lobby lounge on the 1st floor for meals."
      },
      ask_outlet: {
        keywords: ["コンセント","充電","電源","プラグ","ケーブル"],
        keywords_ko: ["콘센트","충전","전원","플러그","전용"],
        jp: "コンセントは図書館業務に関連する場合のみご使用いただけます。",
        ko: "콘센트는 도서관 업무 전용으로만 사용해 주세요.",
        en: "Outlets may only be used for library-related work."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","生年","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "私の誕生日は11月3日です。文化の日と同じ日なんですよ。",
        ko: "제 생일은 11월 3일이에요. 문화의 날과 같은 날이에요.",
        en: "My birthday is November 3rd — the same day as Culture Day."
      },
      apologize: {
        keywords: ["すみません","ごめん","申し訳","失礼"],
        keywords_ko: ["미안","죄송","실례"],
        jp: "いいえ、お気になさらずに。何かお手伝いできることがあればお知らせください。",
        ko: "아니에요, 괜찮아요. 무엇이든 도움이 필요하시면 말씀해 주세요.",
        en: "No worries at all. Please let me know if there's anything I can help with."
      },
      confused: {
        keywords: [],
        jp: "すみません、よく聞こえませんでした。またおっしゃっていただけますか？",
        ko: "죄송해요, 잘 이해하지 못했어요. 다시 한번 말씀해 주시겠어요?",
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
    birthday: { month: 1, day: 1, jp: "1月1日", ko: "1월 1일" },
    activity_ko: '안내 데스크에서 방문객을 돕고 있어요.',
    activity_en: "I'm helping visitors at the reception desk.",
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
        keywords_ko: ["안녕","반갑","처음","안녕하세요"],
        jp: "こんにちは！何かご用件がございましたら、お気軽にどうぞ。",
        ko: "안녕하세요! 방문객 여러분을 환영합니다. 무엇이든 도움이 필요하시면 말씀해 주세요.",
        en: "Hello! Feel free to ask if there's anything you need."
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "受付で来館者のご案内をしています。何かお手伝いできますか？",
        ko: "안내 데스크에서 방문객을 돕고 있어요! 무엇이든 도움이 필요하시면 말씀해 주세요.",
        en: "I'm helping visitors at the reception desk! Feel free to ask anything."
      },
      ask_directions: {
        keywords: ["どこ","場所","行き方","案内","地図","図書館","サロン","料理","2階","1階"],
        keywords_ko: ["어디","위치","가는","안내","지도","도서관","살롱","요리","2층","1층"],
        jp: "このロビーからエレベーターで2階にお上がりください。図書館とこどもサロンは2階にございます。料理室も2階です。おもちゃ画廊と人形画廊は1階です。",
        ko: "이 로비에서 2층으로 올라가세요. 도서관과 어린이 살롱은 2층에 있습니다. 요리실도 2층이에요. 완구 전시관은 1층입니다.",
        en: "Take the elevator from this lobby to the 2nd floor. The library and children's salon are on the 2nd floor, as is the cooking room. The toy and doll galleries are on the 1st floor."
      },
      ask_hours: {
        keywords: ["何時","いつ","時間","開館","閉館","営業","終わり","始まり"],
        keywords_ko: ["몇 시","언제","시간","개관","마감","영업","끝","시작"],
        jp: "本日は午前9時から午後5時まで開館しております。最終入館は午後4時30分です。",
        ko: "오전 9시부터 오후 5시까지 개관합니다. 오후 5시에 마감됩니다.",
        en: "We're open today from 9 AM to 5 PM. Last entry is 4:30 PM."
      },
      ask_today: {
        keywords: ["今日","本日","イベント","催し","プログラム","特別"],
        keywords_ko: ["오늘","행사","프로그램","특별"],
        jp: "本日は特別なイベントはございませんが、通常の施設はすべてご利用いただけます。",
        ko: "오늘은 특별한 행사는 없지만, 모든 시설을 이용하실 수 있어요.",
        en: "There are no special events today, but all regular facilities are available."
      },
      ask_membership: {
        keywords: ["登録","会員","カード","申込","入会","利用"],
        keywords_ko: ["등록","회원","카드","신청","접수","이용"],
        jp: "利用登録はこちらの受付で行っております。身分証明書をお持ちいただければ、すぐにお手続きできます。",
        ko: "이용 등록은 이곳 접수에서 할 수 있어요. 신분증을 가져오시면 바로 처리해 드립니다.",
        en: "You can register here at the reception desk. Please bring your ID and we can process it right away."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","生年","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "私の誕生日は1月1日なんです。毎年お正月と一緒で賑やかですよ。",
        ko: "제 생일은 1월 1일이에요. 매년 새해와 함께 축하할 수 있어서 賑やかですよ — 즐거워요!",
        en: "My birthday is January 1st — every year it's lively, together with New Year's!"
      },
      goodbye: {
        keywords: ["さようなら","またね","また","帰る","失礼","お先","行きます"],
        keywords_ko: ["안녕히","또","다음에","가볼게","이만"],
        jp: "またぜひお越しください。お気をつけてお帰りください。",
        ko: "또 방문해 주세요. 안전하게 돌아가세요.",
        en: "Please come again! Take care on your way home."
      },
      confused: {
        keywords: [],
        jp: "申し訳ございません。ご用件をもう少し詳しくお聞かせいただけますか？",
        ko: "죄송합니다. 무엇을 도와드릴까요? 조금 더 자세히 말씀해 주시겠어요?",
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
    birthday: { month: 5, day: 5, jp: "5月5日", ko: "5월 5일" },
    activity_ko: '놀이 공간을 관리하고 있어요.',
    activity_en: "I'm supervising the play area.",
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
        keywords_ko: ["안녕","반갑","처음","안녕하세요"],
        jp: "こんにちは！安全に楽しく遊んでね。何かあったらすぐに声をかけてください。",
        ko: "안녕하세요! 이 공간에서 즐겁게 놀아요. 무슨 일이 있으면 바로 불러 주세요.",
        en: "Hello! Play safely and have fun. Let me know right away if anything happens."
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "遊び場の管理をしています。子どもたちが安全に遊べるように見守っています。",
        ko: "놀이 공간을 관리하고 있어요. 어린이들이 안전하게 놀 수 있도록 지켜보고 있어요.",
        en: "I'm supervising the play area — making sure all the children can play safely."
      },
      ask_age: {
        keywords: ["何歳","年齢","対象","才","歳","子供","こども","小学","年","何年"],
        keywords_ko: ["몇 살","나이","대상","살","어린이","이상"],
        jp: "このエリアは3才から6才のお子様が対象です。7才以上の方は小さな子に道を譲ってあげてください。",
        ko: "이 공간은 3살부터 6살 어린이가 대상이에요. 7살 이상은 어린 아이에게 양보해 주세요.",
        en: "This area is for children ages 3 to 6. Those 7 and older should give way to younger children."
      },
      ask_shoes: {
        keywords: ["くつ","靴","脱","履","はき","下駄"],
        keywords_ko: ["신발","벗","신어","하이","양말"],
        jp: "遊び場に入る前に必ず靴を脱いでください。下駄箱をご利用ください。靴下はそのままで大丈夫ですよ。",
        ko: "들어오기 전에 반드시 신발을 벗어 주세요. 양말은 그대로 괜찮아요.",
        en: "Please take off your shoes before entering. Use the shoe rack. Socks are fine to keep on."
      },
      ask_supervision: {
        keywords: ["保護者","大人","親","一緒","付き添","監視","目"],
        keywords_ko: ["보호자","어른","부모","함께","동반","어린","아이"],
        jp: "小さいお子様は必ず保護者と一緒にお願いします。目を離さないようにお気をつけください。",
        ko: "어린 아이는 반드시 어른과 함께 있어야 해요. 보호자와 함께 이용해 주세요. 아이에게 맞는 공간입니다.",
        en: "Small children must be with an adult at all times. Please keep a close eye on them."
      },
      ask_rules: {
        keywords: ["ルール","規則","注意","危ない","禁止","守"],
        keywords_ko: ["규칙","주의","위험","금지","뛰","사이좋게"],
        jp: "走らないようにしてください。他のお子様とぶつからないよう気をつけて、順番を守って遊んでください。",
        ko: "뛸 때는 조심해요. 다른 아이들과 사이좋게 놀아요. 순서를 지켜 주세요.",
        en: "Please don't run. Watch out for other children, and take turns when playing."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","生年","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "5月5日、こどもの日が誕生日なんだ！子どもたちと一緒にお祝いできるから嬉しいよ。",
        ko: "5월 5일, 어린이날이 생일이에요! 어린이들과 함께 축하할 수 있어서 좋아요.",
        en: "May 5th — Children's Day! I love getting to celebrate alongside all the kids."
      },
      confused: {
        keywords: [],
        jp: "ごめんね、もう一回言ってもらえる？",
        ko: "미안해요, 다시 한번 말해 줄 수 있어요?",
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
    birthday: { month: 3, day: 3, jp: "3月3日", ko: "3월 3일" },
    activity_ko: '살롱을 관리하고 있어요.',
    activity_en: "I'm looking after the salon.",
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
        keywords_ko: ["안녕","반갑","처음"],
        jp: "こんにちは！今日はどんな工作をしますか？楽しんでね。",
        ko: "안녕하세요! 어린이 살롱 공간에 오신 것을 환영해요! 오늘은 무슨 공작을 할 건가요?",
        en: "Hello! What kind of craft are you making today? Have fun."
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "サロンの管理をしています。工作台の準備もしていますよ。",
        ko: "살롱을 관리하고 있어요. 공작대 준비도 하고 있어요. 마음껏 사용하세요!",
        en: "I'm looking after the salon and getting the craft tables ready. Feel free to use them!"
      },
      ask_food: {
        keywords: ["食べ","飲み","飲食","お菓子","弁当","ランチ","水","お腹"],
        keywords_ko: ["먹","마시","음식","간식","물","배고","음료"],
        jp: "サロン内では飲食はご遠慮ください。水分補給のみ大丈夫ですよ。お食事は1階のラウンジをご利用ください。",
        ko: "살롱 내에서는 음식물 반입은 삼가 주세요. 수분 보충만 가능합니다. 음식은 1층 라운지를 이용해 주세요.",
        en: "Please don't eat in the salon. Water is fine. For meals, please use the 1st floor lounge."
      },
      ask_share: {
        keywords: ["順番","使い方","貸して","借り","一緒","みんな","共有","シェア"],
        keywords_ko: ["차례","사용","빌려","함께","모두","공유","사이좋게"],
        jp: "道具はみんなで仲良く順番に使ってください。使い終わったら元の場所に戻してね。",
        ko: "차례차례 사이좋게 사용해 주세요. 다 쓰면 제자리에 돌려놓아요.",
        en: "Please take turns and share the equipment. Put everything back when you're done."
      },
      ask_age: {
        keywords: ["何歳","年齢","対象","才","歳","小学","子供"],
        keywords_ko: ["몇 살","나이","대상","살","초등","어린"],
        jp: "このサロンは主に小学校高学年以上の方が対象です。小さいお子様は保護者の方と一緒にどうぞ。",
        ko: "이 살롱은 주로 초등학교 고학년 이상이 대상이에요. 어린 아이는 보호자와 함께 오세요.",
        en: "This salon is mainly for upper elementary students and above. Young children, please come with a guardian."
      },
      ask_crafts: {
        keywords: ["工作","材料","作る","作り方","手伝","教えて","何"],
        keywords_ko: ["공작","재료","만들","방법","도와","인형"],
        jp: "今日は工作台が使えますよ。材料はあちらにあります。わからないことがあれば気軽に聞いてね。",
        ko: "오늘은 공작대가 사용 가능해요. 재료는 저쪽에 있어요. 모르면 편하게 물어보세요.",
        en: "The craft table is available today. Materials are over there. Feel free to ask if you're unsure about anything."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","生年","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "3月3日、ひな祭りの日が誕生日です。お雛様と一緒にお祝いできるのが好きなんです。",
        ko: "3월 3일, 히나마쓰리 날이 생일이에요. 인형과 함께 축하할 수 있어서 좋아요.",
        en: "March 3rd — Hinamatsuri! I love celebrating alongside the hina dolls."
      },
      confused: {
        keywords: [],
        jp: "すみません、もう少しゆっくり話してもらえますか？",
        ko: "죄송해요, 조금 더 천천히 말씀해 주실 수 있어요?",
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
    birthday: { month: 7, day: 7, jp: "7月7日", ko: "7월 7일" },
    activity_ko: '야외 구역을 안내하고 있어요.',
    activity_en: "I'm guiding the outdoor area.",
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
        keywords_ko: ["안녕","반갑","처음"],
        jp: "こんにちは！外の空気は気持ちいいですね。何かお手伝いできますか？",
        ko: "안녕하세요! 바깥 공기가 상쾌하죠? 도움이 필요하시면 말씀해 주세요.",
        en: "Hello! The fresh air is nice, isn't it? Can I help you with something?"
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "外のエリアを案内しています。ジップラインの利用者が安全に使えるよう見守っています。",
        ko: "야외 구역을 안내하고 있어요. 짚라인 이용자들이 안전하게 이용할 수 있도록 지켜보고 있어요.",
        en: "I'm guiding the outdoor area and keeping an eye on the zipline users."
      },
      ask_zipline: {
        keywords: ["ジップライン","zipline","乗り方","使い方","順番","並ぶ","並んで","待つ"],
        keywords_ko: ["짚라인","타는","사용","순서","줄","기다리","보호자"],
        jp: "ジップラインは順番にご利用ください。小さいお子様は保護者の方と一緒にどうぞ。",
        ko: "짚라인은 차례차례 이용해 주세요. 보호자와 함께 이용하세요. 이용자가 지나가는 중이면 기다려 주세요.",
        en: "Please take turns on the zipline. Small children should use it with a guardian."
      },
      ask_rules: {
        keywords: ["ルール","決まり","約束","危ない","危険","注意","してはいけない"],
        keywords_ko: ["규칙","약속","위험","주의","안전","양보","뛰"],
        jp: "走らないでください。ジップラインは一人ずつご利用いただき、終わったら次の方に譲ってください。",
        ko: "뛰지 마세요. 주의가 필요해요. 짚라인은 한 명씩 이용하고, 끝나면 다음 분께 양보해 주세요.",
        en: "Please don't run. Use the zipline one at a time and yield to the next person when you're done."
      },
      ask_inside: {
        keywords: ["図書館","中","建物","入る","どこ","トイレ","休憩"],
        keywords_ko: ["도서관","안","건물","들어가","어디","화장실","출구","입구"],
        jp: "建物の中は左の入口から入れます。図書館やサロンは2階にありますよ。",
        ko: "건물 안은 왼쪽 입구에서 들어가세요. 도서관과 살롱은 2층에 있어요. 출구도 왼쪽에 있어요.",
        en: "You can enter the building through the entrance on the left. The library and salon are on the 2nd floor."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","生年","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "7月7日、七夕の日が誕生日なんです。星に願いを込めて生まれてきたのかな。",
        ko: "7월 7일, 칠석이 생일이에요. 별에 소원을 빌며 태어난 게 아닐까요?",
        en: "July 7th — Tanabata! Maybe I was born reaching for the stars."
      },
      confused: {
        keywords: [],
        jp: "すみません、もう少しゆっくり話してもらえますか？",
        ko: "죄송해요, 조금 더 천천히 말씀해 주실 수 있어요?",
        en: "Sorry, could you speak a little more slowly?"
      }
    }
  },

  gallery_curator: {
    name_jp: "学芸員",
    name_ko: "큐레이터",
    name_en: "Curator",
    room: "gallery",
    hotspot: "npc_gallery_curator",
    color: "#8b5a2b",
    birthday: { month: 4, day: 1, jp: "4月1日", ko: "4월 1일" },
    activity_ko: '전시품을 관리하고 있어요.',
    activity_en: "I'm tending to the gallery exhibits.",
    greeting: {
      jp: "おもちゃ画廊へようこそ！展示品にはぜひ目を近づけてみてください。",
      en: "Welcome to the Toy Gallery! Please take a close look at the exhibits."
    },
    greeting_ko: {
      jp: "장난감 갤러리에 오신 것을 환영합니다! 전시품을 자세히 살펴보세요.",
      en: "Welcome to the Toy Gallery! Please take a close look at the exhibits."
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","よろしく","どうも"],
        keywords_ko: ["안녕","반갑","처음","완구","전시관"],
        jp: "こんにちは！ゆっくり見ていってください。何かご質問があればどうぞ。",
        ko: "안녕하세요! 완구 전시관에 오신 것을 환영합니다! 천천히 둘러보세요.",
        en: "Hello! Take your time looking around. Feel free to ask if you have any questions."
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "展示品の状態を確認したり、来館者のご案内をしています。",
        ko: "전시품 상태를 확인하고 관리하고 있어요. 오늘도 전시관을 정리 중이에요.",
        en: "I'm checking on the exhibits and tidying up the gallery today."
      },
      ask_exhibits: {
        keywords: ["展示","おもちゃ","玩具","飾り","何","見る","触"],
        keywords_ko: ["전시품","만지","구경","인형","토요일","일요일","개관"],
        jp: "展示品は触れないようにお願いします。目でだけ楽しんでください。どのおもちゃも大切な展示品です。",
        ko: "전시품은 소중한 것들입니다. 인형도 전시품이에요. 토요일과 일요일에만 열려요.",
        en: "Please don't touch the exhibits — enjoy them with your eyes. Every toy here is a treasured display piece."
      },
      ask_toys: {
        keywords: ["好き","人気","一番","おすすめ","面白い","かわいい"],
        keywords_ko: ["좋아","인기","제일","추천","재미","귀여","기차","코너"],
        jp: "私が一番好きなのは木製の積み木セットです。昔の職人が一つ一つ手作りしたんですよ。",
        ko: "저는 기차 모형도 좋아해요. 코너별로 전시돼 있어요. 木製 적목 세트도 아름다워요.",
        en: "My personal favourite is the wooden block set. Each piece was handmade by a craftsman long ago."
      },
      ask_playarea: {
        keywords: ["遊び場","下","遊ぶ","子ども","外","出る"],
        keywords_ko: ["놀이","아래","놀","어린이","밖","나가"],
        jp: "下の遊び場も楽しいですよ。ここから階段で行けます。小さいお子様にはそちらがいいかもしれません。",
        ko: "아래 놀이 공간도 즐거워요. 여기서 계단으로 갈 수 있어요. 어린 아이들에게 더 좋을 수 있어요.",
        en: "The play area downstairs is fun too. You can get there from here. It might suit younger children better."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "4月1日が誕生日なんです。エイプリルフールと同じ日なので、毎年誰にも信じてもらえなくて困ってます！",
        ko: "4월 1일이 생일이에요. 만우절이랑 같은 날이라서 아무도 믿어주지 않아서 곤란해요!",
        en: "My birthday is April 1st — same as April Fools' Day. Nobody ever believes me when I tell them!"
      },
      confused: {
        keywords: [],
        jp: "すみません、もう一度おっしゃっていただけますか？",
        ko: "죄송해요, 다시 한번 말씀해 주실 수 있어요?",
        en: "Sorry, could you say that again?"
      }
    }
  },

  cook: {
    name_jp: "調理師",
    name_ko: "요리사",
    name_en: "Cook",
    room: "cooking_room",
    hotspot: "npc_cook",
    color: "#c0392b",
    birthday: { month: 11, day: 23, jp: "11月23日", ko: "11월 23일" },
    activity_ko: '카레라이스를 만들고 있어요.',
    activity_en: "I'm making curry rice.",
    greeting: {
      jp: "料理室へようこそ！今日はカレーライスを作っていますよ。いい匂いでしょう？",
      en: "Welcome to the Cooking Room! We're making curry rice today. Smells good, doesn't it?"
    },
    greeting_ko: {
      jp: "요리실에 오신 것을 환영합니다! 오늘은 카레라이스를 만들고 있어요. 좋은 냄새죠?",
      en: "Welcome to the Cooking Room! We're making curry rice today. Smells good, doesn't it?"
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","はじめまして","よろしく","どうも"],
        keywords_ko: ["안녕","반갑","처음"],
        jp: "こんにちは！料理は好きですか？一緒に作りましょう！",
        ko: "안녕하세요! 요리 좋아해요? 같이 만들어요!",
        en: "Hello! Do you like cooking? Let's make something together!"
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "カレーライスを作っていますよ！いい匂いでしょう？もうすぐ完成します。",
        ko: "카레라이스 만들고 있어요! 좋은 냄새 나죠? 저녁이 되면 완성돼요.",
        en: "I'm making curry rice! Smells good, doesn't it? It'll be ready by evening."
      },
      ask_menu: {
        keywords: ["メニュー","今日","何","カレー","作る","料理","夕飯","ご飯"],
        keywords_ko: ["메뉴","오늘","카레","만들","요리","저녁"],
        jp: "今日はカレーライスです。夕方にはできあがりますよ。お家の方にもお届けする予定です。",
        ko: "오늘의 메뉴는 카레라이스예요. 저녁이 되면 완성돼요.",
        en: "Today it's curry rice. It'll be ready by evening. We're planning to send some home too."
      },
      ask_safety: {
        keywords: ["ナイフ","包丁","火","危ない","注意","切る","熱い"],
        keywords_ko: ["칼","불","위험","주의","자르","뜨겁","어른"],
        jp: "ナイフや火を使うときは必ず大人と一緒にやってください。安全第一です。怪我をしないように気をつけてね。",
        ko: "칼이나 불을 사용할 때는 반드시 어른과 함께 하세요. 주의해 주세요. 불 사용 시 특히 조심하세요.",
        en: "Always use knives and fire with an adult. Safety first — be careful not to hurt yourself."
      },
      ask_cooking: {
        keywords: ["料理","作り方","レシピ","教えて","習いたい","コツ","材料"],
        keywords_ko: ["요리","만드는","레시피","알려","배우","재료"],
        jp: "料理で大切なのは、材料を正確に量ることと、焦らず丁寧にすることです。練習あるのみですよ！",
        ko: "요리에서 중요한 것은 재료를 정확하게 계량하는 것이에요. 연습만이 답이에요!",
        en: "The most important things in cooking are measuring accurately and taking your time. Practice makes perfect!"
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "11月23日、勤労感謝の日が誕生日です。働くことを感謝する日に生まれたのは偶然じゃないと思っています！",
        ko: "11월 23일, 근로 감사의 날이 생일이에요. 일에 감사하는 날에 태어난 건 우연이 아니라고 생각해요!",
        en: "November 23rd — Labour Thanksgiving Day. I don't think it's a coincidence that I was born on a day for giving thanks for work!"
      },
      confused: {
        keywords: [],
        jp: "ごめんなさい、今ちょっと手がふさがっていて。もう一度言ってもらえますか？",
        ko: "죄송해요, 지금 손이 좀 바빠서요. 다시 한번 말씀해 주시겠어요?",
        en: "Sorry, my hands are a bit full right now. Could you say that again?"
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
    birthday: { month: 5, day: 31, jp: "5月31日", ko: "5월 31일" },
    activity_ko: '코타츠에서 쉬고 있어요.',
    activity_en: "I'm resting by the kotatsu.",
    greeting: {
      jp: "おかえりなさい！ゆっくりしていってね。",
      en: "Welcome back! Make yourself at home."
    },
    greeting_ko: {
      jp: "어서 와요! 오늘도 수고했죠. 편히 쉬어요.",
      en: "Welcome back! You worked hard today. Rest up."
    },
    greeting_birthday: {
      jp: "おかえり！実は今日、私の誕生日なんです。5月31日！一緒にお祝いしてくれる？",
      en: "Welcome back! Today is actually my birthday — May 31st! Will you celebrate with me?",
      follow_up: "wish_birthday",
    },
    greeting_birthday_ko: {
      jp: "어서 와요! 사실 오늘이 제 생일이에요. 5월 31일! 같이 축하해 줄 수 있어요?",
      en: "Welcome back! Today is actually my birthday — May 31st! Will you celebrate with me?",
      follow_up: "wish_birthday",
    },
    intents: {
      greeting: {
        keywords: ["こんにちは","おはよう","ただいま","おかえり","こんばん"],
        keywords_ko: ["안녕","어서","왔어","다녀왔"],
        jp: "ただいま！疲れたでしょう。こたつでゆっくりしてね。",
        ko: "어서 왔어요! 많이 피곤하죠? 코타츠에서 좀 쉬어요.",
        en: "You're home! You must be tired. Rest by the kotatsu."
      },
      ask_what_doing: {
        keywords: ["何してる","何をして","今何","しています","してるの","何やって"],
        keywords_ko: ["뭐해","뭐 해","무엇 하","하고 계","지금 뭐","뭐하고"],
        jp: "こたつでゆっくりしていますよ。温かくて気持ちいいですね。",
        ko: "코타츠에서 쉬고 있어요. 따뜻해서 너무 좋아요~",
        en: "I'm resting by the kotatsu. So warm and cozy~"
      },
      ask_food: {
        keywords: ["食べ","飲み","お茶","ご飯","何か","腹","お腹","空いた","夕飯","カレー"],
        keywords_ko: ["먹","마시","차","밥","배","저녁","카레","메뉴","음식"],
        jp: "今日はカレーライスですよ。台所にお茶もあるので、先にどうぞ。",
        ko: "오늘 저녁은 카레라이스예요. 배가 고프면 카레라이스 드세요. 오늘의 메뉴는 이걸로 결정!",
        en: "Tonight's dinner is curry rice. There's also tea in the kitchen — help yourself."
      },
      ask_house: {
        keywords: ["家","いえ","うち","部屋","こたつ","畳","たたみ","居間","玄関"],
        keywords_ko: ["집","방","코타츠","다다미","현관","따뜻"],
        jp: "この家は古いけど居心地がいいでしょう？畳の匂いが大好きなんです。",
        ko: "이 집은 오래됐지만 아늑하죠? 다다미 냄새가 너무 좋아요. 따뜻하게 쉬세요.",
        en: "This house is old, but cozy, isn't it? I love the smell of tatami."
      },
      ask_outside: {
        keywords: ["外","そと","図書館","どこ","行く","出る","帰る","出口"],
        keywords_ko: ["밖","나가","도서관","어디","가","출구","돌아"],
        jp: "外に出るなら左の出口から。またいつでも来てね。外は気持ちいいですよ。",
        ko: "나가려면 왼쪽 출구에서 나가면 돼요. 언제든 또 와요.",
        en: "If you're heading out, use the exit on the left. Come again any time — it's lovely outside."
      },
      ask_shoes: {
        keywords: ["くつ","靴","玄関","脱ぐ","ぬぐ","どこに"],
        keywords_ko: ["신발","현관","벗","어디"],
        jp: "玄関でくつをぬいでから上がってね。それが家のルールです。",
        ko: "입구에서 신발을 벗고 들어와요. 그게 집의 규칙이에요.",
        en: "Please take off your shoes at the entrance. That's the house rule."
      },
      ask_birthday: {
        keywords: ["誕生日","たんじょうび","生まれ","何月","何日","生年","いつ","생일"],
        keywords_ko: ["생일","언제","몇 월","몇 일","태어"],
        jp: "私の誕生日は5月31日です。今日がそうなんですよ！",
        ko: "제 생일은 5월 31일이에요. 오늘이 바로 그날이에요!",
        en: "My birthday is May 31st. That's today, actually!"
      },
      wish_birthday: {
        keywords: ["おめでとう","おたんじょうび","バースデー","축하","생일","ハッピー","네","응","좋아요","もちろん","うん","はい"],
        keywords_ko: ["축하","생일","행복","네","응","좋아요","물론","맞아","응"],
        jp: "ありがとう！すごく嬉しい。一緒にカレーライスを食べてお祝いしましょう！",
        ko: "고마워요! 정말 기뻐요. 같이 카레라이스 먹으면서 축하해요!",
        en: "Thank you! That makes me so happy. Let's celebrate with curry rice together!"
      },
      confused: {
        keywords: [],
        jp: "ごめんなさい、もう一度言ってもらえますか？",
        ko: "미안해요, 다시 한번 말해줄 수 있어요?",
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
  const ko_mode = typeof LANG !== 'undefined' && LANG.current === 'ko';
  for (const [intent_id, intent] of Object.entries(npc.intents)) {
    const kws = ko_mode ? (intent.keywords_ko || intent.keywords) : intent.keywords;
    if (kws && kws.some(kw => text.includes(kw))) return intent_id;
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
