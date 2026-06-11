// Scheduled NPCs: 10 characters with weekly routines.
// Loaded after tiles.js (CHARS, TS) and npcs.js (NPC_DEFS), before sim2d.js.

// ── New character definitions ─────────────────────────────────────────────────
Object.assign(NPC_DEFS, {
  yuki:   { name_jp: '由紀',   name_ko: '유키',  name_en: 'Yuki',   color: '#7a3a8c', desc_en: 'An elementary school girl who loves reading.' },
  haruto: { name_jp: 'はると', name_ko: '하루토', name_en: 'Haruto', color: '#2a5a8c', desc_en: 'A middle school boy who likes cooking class.' },
  mei:    { name_jp: '芽衣',   name_ko: '메이',  name_en: 'Mei',    color: '#c04060', desc_en: 'A lively young child who loves to play.' },
  takeshi:{ name_jp: '健',     name_ko: '다케시', name_en: 'Takeshi',color: '#4a5a3a', desc_en: 'A parent dropping off and picking up their child.' },
  sora:   { name_jp: '空',     name_ko: '소라',  name_en: 'Sora',   color: '#20788c', desc_en: 'A craft-loving teenager always making something.' },
  aiko:   { name_jp: '愛子',   name_ko: '아이코', name_en: 'Aiko',   color: '#8c6020', desc_en: 'A diligent student who spends long hours in the library.' },
  kenji:  { name_jp: '健二',   name_ko: '겐지',  name_en: 'Kenji',  color: '#3a3a6c', desc_en: 'An art and culture enthusiast who visits on weekends.' },
  nana:   { name_jp: '奈々',   name_ko: '나나',  name_en: 'Nana',   color: '#c06820', desc_en: 'A spirited young child who loves the outdoors.' },
  riku:   { name_jp: '陸',     name_ko: '리쿠',  name_en: 'Riku',   color: '#2a6a4a', desc_en: 'A social student who moves between the library, salon, and outdoor.' },
  hana:   { name_jp: '花',     name_ko: '하나',  name_en: 'Hana',   color: '#8c2060', desc_en: 'A community-minded young adult who helps wherever she can.' },
});

// ── Sprite assignments for new characters ─────────────────────────────────────
// people.png sprite grid: 16px wide × 32px tall characters.
Object.assign(CHARS, {
  yuki:    P(128,  64),   // row 2, col 8
  haruto:  P(144,  64),   // row 2, col 9
  mei:     P(160,  64),   // row 2, col 10
  takeshi: P( 16,  32),   // row 1, col 1
  sora:    P( 32,  32),   // row 1, col 2
  aiko:    P(176,  64),   // row 2, col 11
  kenji:   P( 96,  32),   // row 1, col 6
  nana:    P(192,  64),   // row 2, col 12
  riku:    P(112,  32),   // row 1, col 7
  hana:    P(208,  64),   // row 2, col 13
});

// ── Weekly schedule data ───────────────────────────────────────────────────────
// Each entry: { days, hour_start, hour_end, room, col, row, ambient, convo, prop, goals }
// days: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
// col/row: NPC spawn position for this block.
// Goals use the same format as maps.js NPC goals arrays.

const NPC_SCHEDULES = {

  // ── Yuki ─── elementary student, studious weekdays, playful weekends ──────
  yuki: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 15,
      room: 'library', col: 25, row: 12, ambient: true, convo: 'library_study_chat',
      goals: [
        { col:25, row:12, pause_ms:14000, say_ko:'숙제 하고 있어요.',              say_en:'Doing my homework.'             },
        { col:51, row: 5, pause_ms: 4000, say_ko:'읽고 싶은 책 찾고 있어요.',      say_en:'Looking for a book to read.'    },
        { col:40, row:20, pause_ms: 5000, say_ko:'여기 그림책이 있어요!',           say_en:'There are picture books here!'  },
        { col:25, row:12, pause_ms:10000, say_ko:'자리로 돌아가요.',              say_en:'Heading back to my seat.'       },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 15, hour_end: 18,
      room: 'play_area', col: 15, row: 15, ambient: true, convo: 'play_area_kids_chat',
      goals: [
        { col:15, row:15, pause_ms: 6000, say_ko:'드디어 놀 시간이에요!',           say_en:'Finally time to play!'          },
        { col:10, row:11, pause_ms: 8000, say_ko:'그네 타고 싶어요!',              say_en:'I want to go on the swings!'    },
        { col:35, row:18, pause_ms: 5000, say_ko:'달리기 시합할래요?',             say_en:'Want to race?'                  },
        { col:15, row:15, pause_ms: 7000, say_ko:'좀 쉬어요.',                    say_en:'Taking a little break.'         },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 14,
      room: 'outdoor', col: 20, row: 13, ambient: true, convo: 'outdoor_nature_chat',
      goals: [
        { col:20, row:13, pause_ms: 8000, say_ko:'공원에서 뛰어놀아요!',           say_en:'Playing in the park!'           },
        { col: 5, row:11, pause_ms: 5000, say_ko:'벤치에서 쉬어요.',              say_en:'Resting on the bench.'          },
        { col:40, row:13, pause_ms: 6000, say_ko:'저쪽 길도 가봐요!',             say_en:'Let\'s explore that path!'      },
        { col:20, row:13, pause_ms: 9000, say_ko:'여기가 제일 좋아요.',            say_en:'This spot is the best.'         },
      ],
    },
    {
      days: [0,6], hour_start: 14, hour_end: 17,
      room: 'play_area', col: 35, row: 15, ambient: true, convo: 'play_area_kids_chat',
      goals: [
        { col:35, row:15, pause_ms: 5000, say_ko:'오후에도 신나게 놀아요!',         say_en:'Playing hard in the afternoon!' },
        { col:25, row:11, pause_ms: 7000, say_ko:'아까보다 더 세게 뛸 수 있어요!', say_en:'I can run even faster now!'     },
        { col:45, row:20, pause_ms: 6000, say_ko:'저기 가볼게요.',                 say_en:'Let me check over there.'       },
      ],
    },
  ],

  // ── Haruto ─── middle schooler, library mornings, cooking afternoons ──────
  haruto: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 12,
      room: 'library', col: 40, row: 12, ambient: true, convo: 'library_study_chat',
      goals: [
        { col:40, row:12, pause_ms:12000, say_ko:'수학 문제 풀고 있어요.',          say_en:'Working on math problems.'      },
        { col:51, row:20, pause_ms: 3000, say_ko:'모르는 단어 찾고 있어요.',        say_en:'Looking up a word I don\'t know.' },
        { col:15, row:12, pause_ms: 4000, say_ko:'잠깐 딴 자리에서 공부할게요.',    say_en:'Trying a different seat for a bit.' },
        { col:40, row:12, pause_ms: 9000, say_ko:'집중해서 풀어야겠어요.',          say_en:'Got to focus and get this done.' },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 12, hour_end: 16,
      room: 'cooking_room', col: 30, row: 14, ambient: true, convo: 'cooking_lesson_chat',
      goals: [
        { col:30, row:14, pause_ms: 8000, say_ko:'오늘은 뭐 만들어요?',            say_en:'What are we making today?'      },
        { col:14, row: 6, pause_ms: 5000, say_ko:'재료 준비하고 있어요.',           say_en:'Getting the ingredients ready.' },
        { col:45, row:14, pause_ms: 6000, say_ko:'저쪽 조리대도 볼게요.',           say_en:'Checking out that station too.' },
        { col:30, row:21, pause_ms: 7000, say_ko:'진짜 맛있는 냄새가 나요!',        say_en:'It smells so good in here!'     },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 14,
      room: 'play_area', col: 45, row: 18, ambient: true, convo: 'play_area_kids_chat',
      goals: [
        { col:45, row:18, pause_ms: 6000, say_ko:'주말에는 신나게 놀아야 해요!',    say_en:'Gotta enjoy the weekend!'       },
        { col:10, row:12, pause_ms: 8000, say_ko:'그네 자리 잡았어요!',            say_en:'Got the swing!'                 },
        { col:35, row:22, pause_ms: 5000, say_ko:'여기 잔디에 누워볼게요.',         say_en:'Gonna lie down on the grass.' },
      ],
    },
    {
      days: [0,6], hour_start: 14, hour_end: 17,
      room: 'outdoor', col: 35, row: 13, ambient: true, convo: 'outdoor_nature_chat',
      goals: [
        { col:35, row:13, pause_ms: 7000, say_ko:'야외 공기 정말 좋아요.',          say_en:'The outdoor air is so fresh.'   },
        { col:10, row:13, pause_ms: 5000, say_ko:'공원 전체 한 바퀴 돌아볼게요.',   say_en:'Going to walk around the whole park.' },
        { col:45, row:18, pause_ms: 6000, say_ko:'저쪽 나무 아래에서 쉬어요.',      say_en:'Resting under that tree.'       },
      ],
    },
  ],

  // ── Mei ─── young child, mostly play area all week ───────────────────────
  mei: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 10,
      room: 'lobby', col: 30, row: 17, ambient: true, convo: 'lobby_visitor_chat',
      goals: [
        { col:30, row:17, pause_ms: 6000, say_ko:'엄마 기다리고 있어요.',           say_en:'Waiting for my mom.'            },
        { col:10, row:17, pause_ms: 5000, say_ko:'로비 구경하고 있어요.',           say_en:'Looking around the lobby.'      },
        { col:30, row:17, pause_ms: 7000, say_ko:'어서 놀러 가고 싶어요!',          say_en:'I want to go play already!'     },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 10, hour_end: 16,
      room: 'play_area', col: 10, row: 15, ambient: true, prop: '⭐',
      goals: [
        { col:10, row:15, pause_ms: 5000, say_ko:'놀이터 최고예요!',               say_en:'The playground is the best!'    },
        { col:10, row:11, pause_ms: 8000, say_ko:'그네 탈 거예요!',                say_en:'I\'m going on the swings!'      },
        { col:30, row:18, pause_ms: 4000, say_ko:'달리기 해요!',                  say_en:'Let\'s run!'                    },
        { col:45, row:15, pause_ms: 6000, say_ko:'저기도 가볼게요.',               say_en:'I\'m going over there!'         },
        { col:10, row:15, pause_ms: 5000, say_ko:'또 그네 탈 거예요!',             say_en:'Going on the swings again!'     },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 15,
      room: 'play_area', col: 25, row: 18, ambient: true, prop: '⭐',
      goals: [
        { col:25, row:18, pause_ms: 6000, say_ko:'오늘도 신나게 놀거예요!',         say_en:'Having fun today too!'          },
        { col:10, row:11, pause_ms: 9000, say_ko:'그네 몇 번이나 탈 수 있을까요?', say_en:'How many times can I swing?'    },
        { col:40, row:22, pause_ms: 5000, say_ko:'저기 풀밭에 뛰어갈게요!',        say_en:'Running out to the grass!'      },
      ],
    },
    {
      days: [0,6], hour_start: 15, hour_end: 18,
      room: 'outdoor', col: 20, row: 18, ambient: true, prop: '⭐',
      goals: [
        { col:20, row:18, pause_ms: 5000, say_ko:'바깥이 너무 좋아요!',            say_en:'I love being outside!'          },
        { col:10, row:13, pause_ms: 6000, say_ko:'길 따라 걸어요!',               say_en:'Walking along the path!'        },
        { col:40, row:13, pause_ms: 7000, say_ko:'저기까지 달려볼게요!',           say_en:'Racing to that spot!'           },
      ],
    },
  ],

  // ── Takeshi ─── parent, weekday drop-off/pickup pattern ──────────────────
  takeshi: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 10,
      room: 'lobby', col: 15, row: 20, ambient: true, convo: 'lobby_visitor_chat',
      goals: [
        { col:15, row:20, pause_ms: 5000, say_ko:'아이 데려다주고 잠깐 있어요.',    say_en:'Just dropped off the kids, hanging out a bit.' },
        { col:40, row:18, pause_ms: 5000, say_ko:'안내 데스크 쪽 볼게요.',         say_en:'Checking out the front desk area.' },
        { col:10, row: 8, pause_ms: 6000, say_ko:'잠깐 벤치에 앉을게요.',          say_en:'Sitting on the bench for a moment.' },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 10, hour_end: 16,
      room: 'street', col: 30, row: 4, ambient: true,
      goals: [
        { col:30, row: 4, pause_ms: 9000, say_ko:'장 보러 나왔어요.',              say_en:'Out running errands.'           },
        { col:20, row:22, pause_ms: 6000, say_ko:'남쪽 인도도 걸어볼게요.',         say_en:'Walking down the south sidewalk.' },
        { col:50, row: 4, pause_ms: 7000, say_ko:'거리 구경하고 있어요.',           say_en:'Taking in the street scene.'    },
        { col:10, row:22, pause_ms: 5000, say_ko:'저쪽도 한 번 가볼게요.',          say_en:'Checking out that side too.'    },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 16, hour_end: 18,
      room: 'lobby', col: 40, row: 17, ambient: true, convo: 'lobby_visitor_chat',
      goals: [
        { col:40, row:17, pause_ms: 8000, say_ko:'아이 데리러 왔어요.',            say_en:'Here to pick up the kids.'      },
        { col:55, row: 8, pause_ms: 5000, say_ko:'오래 기다리는 것 같네요.',        say_en:'Seems like a bit of a wait.'    },
        { col:40, row:17, pause_ms: 7000, say_ko:'조금만 더 기다릴게요.',           say_en:'I\'ll wait a bit longer.'       },
      ],
    },
    {
      days: [0,6], hour_start: 9, hour_end: 11,
      room: 'house', col: 35, row: 14, ambient: true,
      goals: [
        { col:35, row:14, pause_ms: 9000, say_ko:'주말 아침은 집에서 느긋하게.',    say_en:'Relaxing at home on weekend morning.' },
        { col:47, row:14, pause_ms: 7000, say_ko:'아침밥 준비할게요.',             say_en:'Getting breakfast ready.'       },
        { col:25, row:14, pause_ms: 8000, say_ko:'코타츠에서 신문 읽어요.',         say_en:'Reading the paper at the kotatsu.' },
      ],
    },
    {
      days: [0,6], hour_start: 11, hour_end: 14,
      room: 'outdoor', col: 33, row: 15, ambient: true,
      goals: [
        { col:33, row:15, pause_ms: 8000, say_ko:'아이들이랑 공원 왔어요.',         say_en:'At the park with the kids.'     },
        { col: 5, row:11, pause_ms: 6000, say_ko:'벤치에서 쉬면서 봐요.',           say_en:'Watching from the bench.'       },
        { col:20, row:13, pause_ms: 7000, say_ko:'같이 걸어볼까요?',              say_en:'Want to take a walk together?'  },
      ],
    },
    {
      days: [0,6], hour_start: 14, hour_end: 16,
      room: 'street', col: 20, row: 4, ambient: true,
      goals: [
        { col:20, row: 4, pause_ms: 8000, say_ko:'주말 산책 중이에요.',            say_en:'Out for a weekend walk.'        },
        { col:45, row:22, pause_ms: 6000, say_ko:'날씨 좋은 날 산책이 최고죠.',     say_en:'Nothing beats a walk on a nice day.' },
        { col:30, row: 4, pause_ms: 7000, say_ko:'이 거리 자주 오게 되네요.',       say_en:'I keep coming back to this street.' },
      ],
    },
  ],

  // ── Sora ─── craft teen, salon weekdays; gallery weekends ────────────────
  sora: [
    {
      days: [1,2,3,4,5], hour_start: 10, hour_end: 18,
      room: 'salon', col: 35, row: 13, ambient: true, convo: 'salon_craft_chat',
      goals: [
        { col:35, row:13, pause_ms:12000, say_ko:'오늘은 뭐 만들까 고민 중이에요.', say_en:'Thinking about what to make today.' },
        { col: 5, row: 5, pause_ms: 5000, say_ko:'재료 골라야 해요.',              say_en:'Picking out materials.'         },
        { col:15, row:13, pause_ms: 8000, say_ko:'이 테이블이 작업하기 좋아요.',    say_en:'This table is great for crafting.' },
        { col:50, row:13, pause_ms: 6000, say_ko:'다른 쪽 재료도 써볼게요.',        say_en:'Going to try materials from the other side.' },
        { col:35, row:13, pause_ms:10000, say_ko:'거의 다 됐어요!',               say_en:'Almost done!'                   },
      ],
    },
    {
      days: [6], hour_start: 10, hour_end: 17,
      room: 'gallery', col: 30, row: 20, ambient: true, convo: 'gallery_explore_chat',
      goals: [
        { col:30, row:20, pause_ms: 8000, say_ko:'토요일은 갤러리 오는 날이에요!',  say_en:'Saturday is gallery day!'       },
        { col:10, row: 5, pause_ms: 5000, say_ko:'이 장난감들 정말 예쁘네요.',      say_en:'These toys are so beautifully made.' },
        { col:50, row:20, pause_ms: 6000, say_ko:'저쪽 전시도 꼭 봐야 해요.',      say_en:'Got to check out that exhibit too.' },
        { col:30, row: 5, pause_ms: 7000, say_ko:'디자인 참고하고 싶어요.',         say_en:'Taking design inspiration.'    },
      ],
    },
    {
      days: [0], hour_start: 10, hour_end: 17,
      room: 'gallery', col: 15, row: 20, ambient: true, convo: 'gallery_explore_chat',
      goals: [
        { col:15, row:20, pause_ms: 7000, say_ko:'일요일도 갤러리 왔어요!',         say_en:'At the gallery on Sunday too!'  },
        { col:45, row:20, pause_ms: 6000, say_ko:'기차 모형 정말 멋있어요.',         say_en:'These model trains are amazing.' },
        { col:30, row: 5, pause_ms: 8000, say_ko:'인형들 만드는 법 궁금해요.',       say_en:'I wonder how these dolls are made.' },
        { col:15, row:20, pause_ms: 5000, say_ko:'또 오고 싶어요.',                say_en:'I want to come back again.'     },
      ],
    },
  ],

  // ── Aiko ─── dedicated student, long library hours ────────────────────────
  aiko: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 19,
      room: 'library', col: 15, row: 20, ambient: true, convo: 'library_study_chat',
      goals: [
        { col:15, row:20, pause_ms:16000, say_ko:'시험 준비 중이에요. 조용히 해주세요.', say_en:'Studying for exams. Please be quiet.' },
        { col:51, row: 8, pause_ms: 4000, say_ko:'참고 도서 확인하러 왔어요.',       say_en:'Checking the reference section.' },
        { col:40, row:20, pause_ms: 5000, say_ko:'이쪽 자리로 바꿔볼게요.',          say_en:'Switching to this seat for a while.' },
        { col: 8, row:20, pause_ms: 3000, say_ko:'잠깐 스트레칭하고 왔어요.',         say_en:'Just stretching my legs for a moment.' },
        { col:15, row:20, pause_ms:14000, say_ko:'다시 집중할게요.',               say_en:'Back to focusing.'              },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 13,
      room: 'house', col: 25, row: 14, ambient: true,
      goals: [
        { col:25, row:14, pause_ms:10000, say_ko:'주말엔 집에서 공부해요.',          say_en:'Studying at home on weekends.'  },
        { col:47, row:14, pause_ms: 6000, say_ko:'차 마시면서 잠깐 쉬어요.',         say_en:'Taking a tea break.'            },
        { col:13, row: 4, pause_ms: 5000, say_ko:'이불에서 잠깐 누울게요.',          say_en:'Lying down for just a minute.'  },
        { col:25, row:14, pause_ms:10000, say_ko:'다시 공부해야겠어요.',             say_en:'I should get back to studying.' },
      ],
    },
    {
      days: [0,6], hour_start: 13, hour_end: 18,
      room: 'library', col: 25, row: 20, ambient: true, convo: 'library_study_chat',
      goals: [
        { col:25, row:20, pause_ms:15000, say_ko:'오후에도 도서관에서 공부해요.',     say_en:'Studying at the library in the afternoon too.' },
        { col:51, row:12, pause_ms: 3000, say_ko:'새 책 찾고 있어요.',              say_en:'Looking for a new book.'        },
        { col:25, row:20, pause_ms:12000, say_ko:'이 자리가 제일 집중이 잘 돼요.',   say_en:'This seat is best for concentration.' },
      ],
    },
  ],

  // ── Kenji ─── gallery lover, weekdays in lobby/library ───────────────────
  kenji: [
    {
      days: [1,2,3,4,5], hour_start: 10, hour_end: 12,
      room: 'lobby', col: 50, row: 15, ambient: true, convo: 'lobby_visitor_chat',
      goals: [
        { col:50, row:15, pause_ms: 7000, say_ko:'여기서 지인 기다리고 있어요.',     say_en:'Waiting for someone here.'      },
        { col:30, row:20, pause_ms: 5000, say_ko:'안내판 자세히 보고 있어요.',       say_en:'Looking at the information board.' },
        { col:57, row: 8, pause_ms: 6000, say_ko:'창문 쪽 벤치에 앉을게요.',         say_en:'Sitting by the window bench.'   },
        { col:50, row:15, pause_ms: 8000, say_ko:'아직 안 오셨나요?',               say_en:'Haven\'t shown up yet?'         },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 12, hour_end: 17,
      room: 'library', col: 40, row: 20, ambient: true, convo: 'library_study_chat',
      goals: [
        { col:40, row:20, pause_ms:11000, say_ko:'미술 관련 책 읽고 있어요.',        say_en:'Reading books about art.'       },
        { col:51, row: 5, pause_ms: 5000, say_ko:'상단 서가에 좋은 책 있어요.',      say_en:'Good books on the top shelves.' },
        { col:15, row:12, pause_ms: 6000, say_ko:'이쪽에도 볼 책 있어요.',           say_en:'More books to browse over here.' },
        { col:40, row:20, pause_ms:10000, say_ko:'이 작가 작품이 정말 좋아요.',       say_en:'This author\'s work is really something.' },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 17,
      room: 'gallery', col: 45, row: 20, ambient: true, convo: 'gallery_explore_chat',
      goals: [
        { col:45, row:20, pause_ms:10000, say_ko:'주말엔 꼭 갤러리에 와요.',          say_en:'I always come to the gallery on weekends.' },
        { col:10, row:11, pause_ms: 7000, say_ko:'이 인형들 정말 정교해요.',          say_en:'These dolls are so intricate.'  },
        { col:51, row:11, pause_ms: 6000, say_ko:'기차 모형 수집이 취미예요.',         say_en:'Collecting model trains is my hobby.' },
        { col:30, row:20, pause_ms: 9000, say_ko:'다음에 또 와서 자세히 볼게요.',      say_en:'Coming back for a closer look next time.' },
      ],
    },
  ],

  // ── Nana ─── spirited young child, outdoor and play area ─────────────────
  nana: [
    {
      days: [1,2,3,4,5], hour_start: 10, hour_end: 14,
      room: 'outdoor', col: 10, row: 13, ambient: true, prop: '🌿', convo: 'outdoor_nature_chat',
      goals: [
        { col:10, row:13, pause_ms: 4000, say_ko:'밖에 나왔어요!',                 say_en:'Outside!'                       },
        { col:40, row:13, pause_ms: 5000, say_ko:'저기까지 달려갈 거예요!',          say_en:'Running all the way over there!' },
        { col:29, row:15, pause_ms: 6000, say_ko:'벤치에서 잠깐 쉬어요.',            say_en:'Resting on the bench!'          },
        { col:10, row:18, pause_ms: 4000, say_ko:'저기도 탐험할 거예요!',            say_en:'Exploring over there!'          },
        { col:10, row:13, pause_ms: 5000, say_ko:'또 달릴 거예요!',                say_en:'Running again!'                 },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 14, hour_end: 17,
      room: 'play_area', col: 15, row: 18, ambient: true, prop: '🌿',
      goals: [
        { col:15, row:18, pause_ms: 5000, say_ko:'이제 놀이터 갈 거예요!',           say_en:'Time for the playground!'       },
        { col:10, row:11, pause_ms: 7000, say_ko:'그네 제일 높이 탈 거예요!',        say_en:'Going to swing the highest!'    },
        { col:35, row:22, pause_ms: 4000, say_ko:'저기 풀밭에서 뒹굴 거예요!',       say_en:'Rolling in the grass over there!' },
        { col:15, row:18, pause_ms: 5000, say_ko:'엄청 빨리 달릴 수 있어요!',        say_en:'I can run really fast!'         },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 17,
      room: 'outdoor', col: 20, row: 18, ambient: true, prop: '🌿', convo: 'outdoor_nature_chat',
      goals: [
        { col:20, row:18, pause_ms: 4000, say_ko:'주말엔 하루 종일 놀 거예요!',       say_en:'Playing all day on the weekend!' },
        { col: 5, row:11, pause_ms: 6000, say_ko:'벤치에서 잠깐만 쉴 거예요.',        say_en:'Just a tiny rest on the bench.' },
        { col:45, row:13, pause_ms: 5000, say_ko:'저쪽 끝까지 달릴 거예요!',         say_en:'Racing to the far end!'         },
        { col:20, row:13, pause_ms: 4000, say_ko:'이길이 제일 좋아요.',              say_en:'This path is the best.'         },
        { col:10, row:18, pause_ms: 5000, say_ko:'또 뛰어놀 거예요!',               say_en:'Running around again!'          },
      ],
    },
  ],

  // ── Riku ─── social student, cycles library → salon → outdoor ────────────
  riku: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 12,
      room: 'library', col: 25, row: 12, ambient: true, convo: 'library_study_chat',
      goals: [
        { col:25, row:12, pause_ms:10000, say_ko:'오전엔 집중해서 공부해요.',         say_en:'Studying hard in the morning.'  },
        { col:51, row:15, pause_ms: 4000, say_ko:'서가 쭉 훑어봐요.',               say_en:'Browsing through the shelves.' },
        { col:40, row:12, pause_ms: 7000, say_ko:'저기서도 공부해봐요.',              say_en:'Trying studying from over there.' },
        { col:25, row:12, pause_ms: 9000, say_ko:'좋은 자리 여기예요.',              say_en:'This is a good spot.'           },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 12, hour_end: 15,
      room: 'salon', col: 25, row: 13, ambient: true, convo: 'salon_craft_chat',
      goals: [
        { col:25, row:13, pause_ms: 8000, say_ko:'점심 먹고 살롱에 왔어요.',          say_en:'Came to the salon after lunch.' },
        { col:45, row:13, pause_ms: 5000, say_ko:'이쪽 재료도 구경해요.',             say_en:'Checking out the materials here.' },
        { col:15, row:13, pause_ms: 7000, say_ko:'간단한 거 만들어볼게요.',            say_en:'Going to make something simple.' },
        { col:25, row:13, pause_ms: 6000, say_ko:'친구들이랑 같이 있으면 좋아요.',     say_en:'It\'s nice being here with everyone.' },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 15, hour_end: 18,
      room: 'outdoor', col: 30, row: 13, ambient: true, convo: 'outdoor_nature_chat',
      goals: [
        { col:30, row:13, pause_ms: 7000, say_ko:'오후엔 바깥 바람 맞으러 나와요.',   say_en:'Coming out for fresh air in the afternoon.' },
        { col:10, row:13, pause_ms: 5000, say_ko:'산책하면서 생각 정리해요.',          say_en:'Sorting out my thoughts on a walk.' },
        { col:45, row:18, pause_ms: 6000, say_ko:'여기 나무 그늘이 시원해요.',         say_en:'Nice and cool in the shade here.' },
        { col:29, row:15, pause_ms: 5000, say_ko:'벤치에서 쉬면서 오늘 마무리해요.',  say_en:'Ending the day with a rest on the bench.' },
      ],
    },
    {
      days: [0,6], hour_start: 11, hour_end: 15,
      room: 'cooking_room', col: 14, row: 14, ambient: true, convo: 'cooking_lesson_chat',
      goals: [
        { col:14, row:14, pause_ms: 8000, say_ko:'주말엔 요리 배우러 와요.',          say_en:'Coming to learn cooking on weekends.' },
        { col:30, row: 6, pause_ms: 5000, say_ko:'재료 준비하는 것 보고 있어요.',     say_en:'Watching the ingredients being prepped.' },
        { col:45, row:14, pause_ms: 6000, say_ko:'저 조리대도 써보고 싶어요!',         say_en:'I want to try that station too!' },
        { col:14, row:21, pause_ms: 7000, say_ko:'다음엔 제가 직접 해볼게요.',         say_en:'I\'ll try it myself next time.' },
      ],
    },
    {
      days: [0,6], hour_start: 15, hour_end: 18,
      room: 'house', col: 35, row: 14, ambient: true,
      goals: [
        { col:35, row:14, pause_ms: 9000, say_ko:'집에서 쉬면서 오늘 마무리해요.',    say_en:'Winding down at home after the day.' },
        { col:47, row:20, pause_ms: 6000, say_ko:'저녁 준비 도와드릴게요.',           say_en:'Helping get dinner ready.'      },
        { col:25, row:12, pause_ms: 8000, say_ko:'코타츠에서 따뜻하게 쉬어요.',       say_en:'Warming up at the kotatsu.'     },
      ],
    },
  ],

  // ── Hana ─── community helper, lobby and cooking room ────────────────────
  hana: [
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 11,
      room: 'lobby', col: 30, row: 20, ambient: true, convo: 'lobby_visitor_chat',
      goals: [
        { col:30, row:20, pause_ms: 8000, say_ko:'안내 도우미로 오늘 봉사해요.',      say_en:'Volunteering as a guide today.' },
        { col:10, row:15, pause_ms: 5000, say_ko:'오신 분들 맞이하고 있어요.',         say_en:'Welcoming people as they arrive.' },
        { col:50, row:15, pause_ms: 6000, say_ko:'궁금한 게 있으면 물어보세요.',       say_en:'Ask me if you need any help!'   },
        { col:30, row:20, pause_ms: 8000, say_ko:'즐거운 하루 되세요!',              say_en:'Have a great day, everyone!'    },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 11, hour_end: 16,
      room: 'cooking_room', col: 45, row: 14, ambient: true, prop: '🍜', convo: 'cooking_lesson_chat',
      goals: [
        { col:45, row:14, pause_ms: 9000, say_ko:'오늘 요리 수업 도와드려요.',         say_en:'Helping with today\'s cooking class.' },
        { col:14, row: 6, pause_ms: 5000, say_ko:'재료 준비하고 있어요.',             say_en:'Getting the ingredients ready.' },
        { col:30, row:14, pause_ms: 7000, say_ko:'이쪽도 확인해볼게요.',              say_en:'Checking on this side too.'     },
        { col:45, row:21, pause_ms: 6000, say_ko:'잘 되고 있는지 봐요.',              say_en:'Seeing how everything is going.' },
        { col:45, row:14, pause_ms: 8000, say_ko:'맛있게 만들어 봐요!',              say_en:'Let\'s make it delicious!'      },
      ],
    },
    {
      days: [0,6], hour_start: 10, hour_end: 13,
      room: 'outdoor', col: 15, row: 13, ambient: true, prop: '🍜',
      goals: [
        { col:15, row:13, pause_ms: 8000, say_ko:'주말엔 야외에서 자원봉사해요.',      say_en:'Volunteering outdoors on weekends.' },
        { col:29, row:15, pause_ms: 6000, say_ko:'벤치 주변 정리해요.',              say_en:'Tidying up around the benches.' },
        { col:45, row:13, pause_ms: 5000, say_ko:'공원이 깨끗해야 다들 좋죠.',        say_en:'A clean park is good for everyone.' },
        { col:15, row:13, pause_ms: 7000, say_ko:'즐겁게 봉사할 수 있어서 좋아요.',   say_en:'Happy to volunteer here.'       },
      ],
    },
    {
      days: [0,6], hour_start: 13, hour_end: 16,
      room: 'street', col: 30, row: 22, ambient: true, prop: '🍜',
      goals: [
        { col:30, row:22, pause_ms: 7000, say_ko:'점심 먹으러 거리 나왔어요.',         say_en:'Out on the street for lunch.'   },
        { col:10, row: 4, pause_ms: 5000, say_ko:'북쪽 인도 구경해요.',              say_en:'Exploring the north sidewalk.'  },
        { col:50, row:22, pause_ms: 6000, say_ko:'주차장 쪽에 뭐가 있나 봐요.',       say_en:'Checking out the parking lot area.' },
        { col:30, row: 4, pause_ms: 7000, say_ko:'여기 거리가 참 예쁘죠?',           say_en:'This is quite a lovely street, isn\'t it?' },
      ],
    },
    {
      days: [0,6], hour_start: 16, hour_end: 18,
      room: 'lobby', col: 20, row: 17, ambient: true, convo: 'lobby_visitor_chat',
      goals: [
        { col:20, row:17, pause_ms: 8000, say_ko:'저녁엔 로비에서 마무리해요.',        say_en:'Wrapping up for the evening in the lobby.' },
        { col:40, row:20, pause_ms: 5000, say_ko:'오늘 하루 수고했어요!',             say_en:'Great work today, everyone!'    },
        { col:20, row:17, pause_ms: 7000, say_ko:'내일 또 봬요!',                   say_en:'See you all again tomorrow!'    },
      ],
    },
  ],
};
