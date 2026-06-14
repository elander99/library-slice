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
//
// House assignments (sleeping):
//   house_a (Family House):  Yuki, Haruto, Mei, Nana   — exit at street cols [8,9]
//   house_b (Student House): Aiko, Riku, Sora           — exit at street cols [27,28]
//   house_c (Adult House):   Takeshi, Kenji, Hana       — exit at street cols [47,48]
//   house   (Player's Home): visitor_a, visitor_b       — unchanged

const NPC_SCHEDULES = {

  // ── Yuki ─── elementary student, studious weekdays, playful weekends ──────
  yuki: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:4, row:7, ambient:true,
      goals:[ { col:4, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:4, row:7, ambient:true,
      goals:[
        { col:4,  row:7,  pause_ms:8000, say_ko:'잘 잤어요!',          say_en:'Slept well!'          },
        { col:8,  row:22, pause_ms:4000, say_ko:'세수하러 갔다 왔어요.', say_en:'Back from washing up.' },
        { col:4,  row:7,  pause_ms:6000, say_ko:'오늘도 준비 완료!',    say_en:'Ready for the day!'   },
      ],
    },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:11, row:7, ambient:true,
      goals:[ { col:11, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:11, row:7, ambient:true,
      goals:[
        { col:11, row:7,  pause_ms:8000, say_ko:'일어났어요!',          say_en:'Up and at it!'        },
        { col:8,  row:22, pause_ms:4000, say_ko:'아침 준비 중이에요.',   say_en:'Getting ready.'       },
        { col:11, row:7,  pause_ms:6000, say_ko:'오늘도 열심히!',       say_en:'Let\'s work hard today!' },
      ],
    },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:18, row:7, ambient:true,
      goals:[ { col:18, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:18, row:7, ambient:true,
      goals:[
        { col:18, row:7,  pause_ms:8000, say_ko:'일어났어요!',          say_en:'I\'m up!'           },
        { col:8,  row:22, pause_ms:4000, say_ko:'세수하고 왔어요.',      say_en:'Washed my face!'    },
        { col:18, row:7,  pause_ms:6000, say_ko:'얼른 놀고 싶어요!',    say_en:'I want to play soon!' },
      ],
    },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:4, row:7, ambient:true,
      goals:[ { col:4, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_c', col:4, row:7, ambient:true,
      goals:[
        { col:4,  row:7,  pause_ms:8000, say_ko:'좋은 아침이에요.',        say_en:'Good morning.'              },
        { col:47, row:22, pause_ms:4000, say_ko:'아침 준비 중이에요.',      say_en:'Getting ready for the day.' },
        { col:4,  row:7,  pause_ms:6000, say_ko:'오늘도 좋은 하루!',       say_en:'Have a good day today!'     },
      ],
    },
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
      room: 'house_c', col: 27, row: 13, ambient: true,
      goals: [
        { col:27, row:13, pause_ms: 9000, say_ko:'주말 아침은 집에서 느긋하게.',    say_en:'Relaxing at home on weekend morning.' },
        { col:47, row:18, pause_ms: 7000, say_ko:'아침밥 준비할게요.',             say_en:'Getting breakfast ready.'       },
        { col:27, row:13, pause_ms: 8000, say_ko:'코타츠에서 신문 읽어요.',         say_en:'Reading the paper at the kotatsu.' },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:18, row:7, ambient:true,
      goals:[ { col:18, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_b', col:18, row:7, ambient:true,
      goals:[
        { col:18, row:7,  pause_ms:8000, say_ko:'일어났어요.',            say_en:'Woke up.'             },
        { col:27, row:22, pause_ms:4000, say_ko:'준비하고 있어요.',        say_en:'Getting ready.'       },
        { col:18, row:7,  pause_ms:6000, say_ko:'오늘도 뭔가 만들어봐야지!', say_en:'Time to make something today!' },
      ],
    },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:4, row:7, ambient:true,
      goals:[ { col:4, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_b', col:4, row:7, ambient:true,
      goals:[
        { col:4,  row:7,  pause_ms:9000, say_ko:'아침이에요. 공부해야죠.',        say_en:'Morning. Time to study.'        },
        { col:27, row:22, pause_ms:4000, say_ko:'얼굴 씻고 왔어요.',             say_en:'Back from washing up.'          },
        { col:4,  row:7,  pause_ms:6000, say_ko:'오늘도 열심히 할게요!',         say_en:'Going to work hard today!'      },
      ],
    },
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
      room: 'house_b', col: 25, row: 14, ambient: true,
      goals: [
        { col:25, row:14, pause_ms:10000, say_ko:'주말엔 집에서 공부해요.',          say_en:'Studying at home on weekends.'  },
        { col:46, row: 5, pause_ms: 6000, say_ko:'차 마시면서 잠깐 쉬어요.',         say_en:'Taking a tea break.'            },
        { col: 4, row: 7, pause_ms: 5000, say_ko:'이불 쪽에서 잠깐 누울게요.',       say_en:'Lying down for just a minute.'  },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:11, row:7, ambient:true,
      goals:[ { col:11, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_c', col:11, row:7, ambient:true,
      goals:[
        { col:11, row:7,  pause_ms:8000, say_ko:'좋은 아침이에요.',        say_en:'Good morning.'              },
        { col:47, row:22, pause_ms:4000, say_ko:'아침 준비 중이에요.',      say_en:'Getting ready for the day.' },
        { col:11, row:7,  pause_ms:6000, say_ko:'오늘도 좋은 하루!',       say_en:'Have a good day today!'     },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 10, hour_end: 12,
      room: 'lobby', col: 50, row: 15, ambient: true, convo: 'lobby_intro_chat',
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:25, row:7, ambient:true,
      goals:[ { col:25, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:25, row:7, ambient:true,
      goals:[
        { col:25, row:7,  pause_ms:8000, say_ko:'일어났어요!',         say_en:'I\'m up!'           },
        { col:8,  row:22, pause_ms:4000, say_ko:'세수하고 왔어요.',     say_en:'Washed my face!'    },
        { col:25, row:7,  pause_ms:6000, say_ko:'오늘도 뛰어놀 거예요!', say_en:'Running around today!' },
      ],
    },
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
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:11, row:7, ambient:true,
      goals:[ { col:11, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_b', col:11, row:7, ambient:true,
      goals:[
        { col:11, row:7,  pause_ms:8000, say_ko:'일어났어요.',            say_en:'Woke up.'             },
        { col:27, row:22, pause_ms:4000, say_ko:'준비하고 있어요.',        say_en:'Getting ready.'       },
        { col:11, row:7,  pause_ms:6000, say_ko:'오늘도 잘 부탁해요!',    say_en:'Best of luck today!'  },
      ],
    },
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
      room: 'house_b', col: 35, row: 14, ambient: true,
      goals: [
        { col:35, row:14, pause_ms: 9000, say_ko:'집에서 쉬면서 오늘 마무리해요.',    say_en:'Winding down at home after the day.' },
        { col:46, row: 5, pause_ms: 6000, say_ko:'코타츠에서 따뜻하게 쉬어요.',       say_en:'Warming up at the kotatsu.'     },
        { col:25, row:12, pause_ms: 8000, say_ko:'오늘 하루 뭐 했나 생각해요.',       say_en:'Thinking about what I did today.' },
      ],
    },
  ],

  // ── Hana ─── community helper, lobby and cooking room ────────────────────
  hana: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:18, row:7, ambient:true,
      goals:[ { col:18, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_c', col:18, row:7, ambient:true,
      goals:[
        { col:18, row:7,  pause_ms:8000, say_ko:'좋은 아침이에요.',        say_en:'Good morning.'              },
        { col:47, row:22, pause_ms:4000, say_ko:'아침 준비 중이에요.',      say_en:'Getting ready for the day.' },
        { col:18, row:7,  pause_ms:6000, say_ko:'오늘도 좋은 하루!',       say_en:'Have a good day today!'     },
      ],
    },
    {
      days: [1,2,3,4,5], hour_start: 9, hour_end: 11,
      room: 'lobby', col: 30, row: 20, ambient: true, convo: 'lobby_intro_chat',
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

  // ── Librarian ─── devoted to books, lives in house_b ────────────────────
  librarian: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:24, row:7, ambient:true,
      goals:[ { col:24, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_b', col:24, row:7, ambient:true,
      goals: [
        { col:24, row:7,  pause_ms:5000, say_ko:'일어났어요. 도서관 준비해야죠.',    say_en:'Up. Have to get the library ready.'      },
        { col:46, row:5,  pause_ms:6000, say_ko:'코타츠에서 아침 먹어요.',           say_en:'Having breakfast at the kotatsu.'        },
        { col:24, row:7,  pause_ms:4000, say_ko:'출근할 시간이에요.',                say_en:'Time to head in.'                        },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:9, hour_end:18,
      room:'library', col:35, row:20, ambient:true,
      goals: [
        { col:35, row:20, pause_ms:14000, say_ko:'도서관 업무 중이에요.',             say_en:'Working at the library desk.'            },
        { col:51, row: 5, pause_ms: 5000, say_ko:'상단 서가 정리하고 있어요.',        say_en:'Organizing the upper shelves.'           },
        { col:51, row:22, pause_ms: 4000, say_ko:'하단 서가도 확인하고 있어요.',      say_en:'Checking the lower shelves.'             },
        { col:18, row:12, pause_ms: 4000, say_ko:'반납 도서 정리 중이에요.',          say_en:'Sorting returned books.'                 },
        { col:35, row:20, pause_ms:12000, say_ko:'대출 처리하고 있어요.',             say_en:'Processing checkouts.'                   },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_b', col:46, row:5, ambient:true,
      goals: [
        { col:46, row:5,  pause_ms:6000, say_ko:'퇴근했어요. 코타츠에서 쉬어요.',    say_en:'Back home. Resting at the kotatsu.'      },
        { col:47, row:21, pause_ms:5000, say_ko:'저녁 먹어야겠어요.',               say_en:'Time to have dinner.'                    },
        { col:24, row:7,  pause_ms:8000, say_ko:'오늘도 수고했어요.',               say_en:'Good work today.'                        },
      ],
    },
  ],

  // ── Receptionist ─── cheerful and organized, lives in house_c ────────────
  receptionist: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:25, row:7, ambient:true,
      goals:[ { col:25, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_c', col:25, row:7, ambient:true,
      goals: [
        { col:25, row:7,  pause_ms:5000, say_ko:'좋은 아침이에요!',                  say_en:'Good morning!'                           },
        { col:27, row:10, pause_ms:5000, say_ko:'코타츠에서 아침 먹어요.',           say_en:'Having breakfast at the kotatsu.'        },
        { col:25, row:7,  pause_ms:4000, say_ko:'오늘도 열심히 안내할게요.',          say_en:'I\'ll guide visitors well today.'        },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:9, hour_end:18,
      room:'lobby', col:40, row:10, ambient:true,
      goals: [
        { col:40, row:10, pause_ms:14000, say_ko:'안내 업무 중이에요.',               say_en:'On duty at the reception desk.'          },
        { col: 5, row:13, pause_ms: 5000, say_ko:'입구 쪽 확인하고 있어요.',          say_en:'Checking near the entrance.'             },
        { col:30, row:20, pause_ms: 4000, say_ko:'로비 순찰하고 있어요.',             say_en:'Doing rounds in the lobby.'              },
        { col:40, row:10, pause_ms:12000, say_ko:'방문객 안내하고 있어요.',           say_en:'Guiding visitors.'                       },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_c', col:27, row:10, ambient:true,
      goals: [
        { col:27, row:10, pause_ms:7000, say_ko:'집에 왔어요. 코타츠 너무 편해요.',   say_en:'Home at last. The kotatsu is so cozy.'   },
        { col:46, row:15, pause_ms:5000, say_ko:'저녁 먹어야겠어요.',               say_en:'Time for dinner.'                        },
        { col:25, row:7,  pause_ms:7000, say_ko:'오늘 안내가 잘 됐어요.',           say_en:'Guiding went well today.'               },
      ],
    },
  ],

  // ── Play staff ─── energetic, loves working with kids, lives in house_a ──
  play_staff: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:32, row:7, ambient:true,
      goals:[ { col:32, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:32, row:7, ambient:true,
      goals: [
        { col:32, row:7,  pause_ms:4000, say_ko:'일어났어요!',                       say_en:'I\'m up!'                                },
        { col:37, row:10, pause_ms:5000, say_ko:'코타츠에서 빨리 먹고 가야죠.',      say_en:'Quick breakfast at the kotatsu.'         },
        { col:32, row:7,  pause_ms:4000, say_ko:'아이들이 기다리고 있을 텐데!',      say_en:'The kids are probably waiting!'          },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:9, hour_end:17,
      room:'play_area', col:40, row:10, ambient:true,
      goals: [
        { col:40, row:10, pause_ms:12000, say_ko:'아이들 잘 노는지 보고 있어요.',     say_en:'Watching the kids play safely.'          },
        { col:10, row:10, pause_ms: 5000, say_ko:'그네 쪽 확인하러 갔어요.',         say_en:'Checking on the swings.'                 },
        { col:30, row:18, pause_ms: 4000, say_ko:'놀이 구역 한 바퀴 돌아요.',        say_en:'Walking the play area perimeter.'        },
        { col:40, row:10, pause_ms:10000, say_ko:'오늘도 안전하게 놀고 있어요.',      say_en:'Playing safely today too.'              },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:17, hour_end:21,
      room:'house_a', col:37, row:10, ambient:true,
      goals: [
        { col:37, row:10, pause_ms:7000, say_ko:'퇴근하고 코타츠에서 쉬어요.',       say_en:'Relaxing at the kotatsu after work.'     },
        { col:48, row:17, pause_ms:5000, say_ko:'저녁 먹을게요.',                   say_en:'Having dinner.'                          },
        { col:32, row:7,  pause_ms:7000, say_ko:'오늘도 즐거운 하루였어요.',        say_en:'What a fun day.'                        },
      ],
    },
  ],

  // ── Salon staff ─── creative and calm, lives in house_b ──────────────────
  salon_staff: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:31, row:7, ambient:true,
      goals:[ { col:31, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:10,
      room:'house_b', col:31, row:7, ambient:true,
      goals: [
        { col:31, row:7,  pause_ms:6000, say_ko:'천천히 일어났어요.',                 say_en:'Taking my time waking up.'               },
        { col:46, row:5,  pause_ms:7000, say_ko:'코타츠에서 여유롭게 아침 먹어요.',  say_en:'A leisurely breakfast at the kotatsu.'  },
        { col:31, row:7,  pause_ms:4000, say_ko:'오늘은 어떤 작품을 만들까요?',      say_en:'What should I make today?'               },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:10, hour_end:18,
      room:'salon', col:50, row:20, ambient:true,
      goals: [
        { col:50, row:20, pause_ms:12000, say_ko:'살롱 업무 보고 있어요.',             say_en:'Working at the salon.'                   },
        { col: 5, row: 5, pause_ms: 5000, say_ko:'재료 확인하고 있어요.',             say_en:'Checking the craft supplies.'            },
        { col:27, row:15, pause_ms: 4000, say_ko:'테이블 정리하고 있어요.',           say_en:'Tidying up the tables.'                  },
        { col:50, row:20, pause_ms:10000, say_ko:'만드시는 분들 도와드리고 있어요.',  say_en:'Helping people with their crafts.'       },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_b', col:46, row:5, ambient:true,
      goals: [
        { col:46, row:5,  pause_ms:7000, say_ko:'집에서 편히 쉬고 있어요.',           say_en:'Relaxing comfortably at home.'           },
        { col:47, row:21, pause_ms:5000, say_ko:'저녁 먹고 있어요.',                 say_en:'Having dinner.'                          },
        { col:31, row:7,  pause_ms:7000, say_ko:'오늘 작품 잘 나왔어요.',           say_en:'Today\'s creations turned out well.'    },
      ],
    },
  ],

  // ── Outdoor guide ─── nature lover, early riser, lives in house_c ─────────
  outdoor_guide: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:32, row:7, ambient:true,
      goals:[ { col:32, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:8,
      room:'house_c', col:32, row:7, ambient:true,
      goals: [
        { col:32, row:7,  pause_ms:3000, say_ko:'일찍 일어났어요. 야외가 기다려요!', say_en:'Up early. The outdoors is calling!'      },
        { col:27, row:10, pause_ms:3000, say_ko:'빨리 먹고 나가야겠어요.',           say_en:'Eating quickly before heading out.'      },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:8, hour_end:18,
      room:'outdoor', col:30, row:18, ambient:true,
      goals: [
        { col:30, row:18, pause_ms:12000, say_ko:'야외 공간 안내 중이에요.',          say_en:'Guiding visitors in the outdoor area.'   },
        { col: 5, row:11, pause_ms: 5000, say_ko:'벤치 쪽 확인하러 갔어요.',         say_en:'Checking on the benches.'               },
        { col:30, row:13, pause_ms: 4000, say_ko:'길을 따라 걷고 있어요.',           say_en:'Walking along the path.'                 },
        { col:30, row:18, pause_ms:10000, say_ko:'야외 공기 마시며 안내해요.',        say_en:'Guiding while enjoying the fresh air.'   },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_c', col:27, row:10, ambient:true,
      goals: [
        { col:27, row:10, pause_ms:7000, say_ko:'오늘도 야외에서 잘 안내했어요.',     say_en:'Another great day guiding outdoors.'     },
        { col:46, row:15, pause_ms:5000, say_ko:'저녁 먹어요.',                      say_en:'Having dinner.'                          },
        { col:32, row:7,  pause_ms:7000, say_ko:'내일도 일찍 일어나야겠어요.',       say_en:'Have to wake up early again tomorrow.'  },
      ],
    },
  ],

  // ── Gallery curator ─── cultured, intellectual, lives in house_c ──────────
  gallery_curator: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:32, row:15, ambient:true,
      goals:[ { col:32, row:15, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:10,
      room:'house_c', col:32, row:15, ambient:true,
      goals: [
        { col:32, row:15, pause_ms:5000, say_ko:'천천히 일어났어요.',                 say_en:'Taking my time waking up.'               },
        { col:27, row:10, pause_ms:6000, say_ko:'코타츠에서 조용히 아침 먹어요.',    say_en:'A quiet breakfast at the kotatsu.'       },
        { col:32, row:15, pause_ms:5000, say_ko:'오늘 전시 구성 생각하고 있어요.',   say_en:'Thinking about the exhibit layout.'      },
      ],
    },
    { days:[1,2,3,4,5], hour_start:10, hour_end:17,
      room:'library', col:35, row:12, ambient:true, convo:'library_study_chat',
      goals: [
        { col:35, row:12, pause_ms:14000, say_ko:'전시 자료 조사하고 있어요.',         say_en:'Researching exhibition materials.'        },
        { col:51, row: 5, pause_ms: 5000, say_ko:'미술 관련 서적 찾고 있어요.',       say_en:'Looking for art and design books.'       },
        { col:15, row:20, pause_ms: 6000, say_ko:'도록 참고하고 있어요.',             say_en:'Consulting the art catalogues.'          },
        { col:35, row:12, pause_ms:10000, say_ko:'다음 전시 준비 중이에요.',          say_en:'Preparing for the next exhibition.'      },
      ],
    },
    { days:[0,6], hour_start:10, hour_end:17,
      room:'gallery', col:30, row:20, ambient:true,
      goals: [
        { col:30, row:20, pause_ms:12000, say_ko:'전시품 관리하고 있어요.',            say_en:'Managing the exhibits.'                  },
        { col:10, row:11, pause_ms: 6000, say_ko:'왼쪽 전시품 점검하고 있어요.',      say_en:'Inspecting the left-side exhibits.'      },
        { col:50, row:11, pause_ms: 6000, say_ko:'오른쪽 전시품도 확인해요.',         say_en:'Checking the right-side exhibits.'       },
        { col:30, row:20, pause_ms:10000, say_ko:'방문객들 안내하고 있어요.',          say_en:'Guiding visitors.'                       },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:17, hour_end:21,
      room:'house_c', col:27, row:10, ambient:true,
      goals: [
        { col:27, row:10, pause_ms:7000, say_ko:'예술에 대해 생각하며 쉬어요.',       say_en:'Resting and thinking about art.'         },
        { col:46, row:15, pause_ms:5000, say_ko:'저녁 먹으면서 아이디어 떠올려요.',  say_en:'Getting ideas over dinner.'              },
        { col:32, row:15, pause_ms:7000, say_ko:'오늘도 좋은 하루였어요.',           say_en:'Another good day.'                       },
      ],
    },
  ],

  // ── Cook ─── warm and nurturing, passionate about food, lives in house_c ──
  cook: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_c', col:25, row:15, ambient:true,
      goals:[ { col:25, row:15, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:10,
      room:'house_c', col:25, row:15, ambient:true,
      goals: [
        { col:25, row:15, pause_ms:4000, say_ko:'일어나자마자 요리 생각이 나요!',     say_en:'First thing I think of is cooking!'      },
        { col:47, row: 3, pause_ms:6000, say_ko:'아침밥 준비하고 있어요.',            say_en:'Preparing breakfast.'                    },
        { col:25, row:15, pause_ms:5000, say_ko:'오늘도 맛있는 거 만들 거예요.',      say_en:'Going to make something delicious today.' },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:10, hour_end:17,
      room:'cooking_room', col:30, row:14, ambient:true,
      goals: [
        { col:30, row:14, pause_ms:12000, say_ko:'오늘 요리 준비하고 있어요.',         say_en:'Preparing today\'s dish.'                },
        { col:14, row:10, pause_ms: 5000, say_ko:'육수 끓이고 있어요.',               say_en:'Simmering the broth.'                    },
        { col:46, row:10, pause_ms: 4000, say_ko:'양념 확인하고 있어요.',             say_en:'Checking the seasonings.'               },
        { col:30, row:18, pause_ms: 5000, say_ko:'하단 조리대도 사용 중이에요.',      say_en:'Using the lower station too.'            },
        { col:30, row:14, pause_ms:10000, say_ko:'거의 다 됐어요! 맛있을 거예요.',    say_en:'Almost done! It\'ll be delicious.'       },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:17, hour_end:21,
      room:'house_c', col:47, row: 3, ambient:true,
      goals: [
        { col:47, row: 3, pause_ms:6000, say_ko:'집에서도 저녁 준비해요.',            say_en:'Making dinner at home too.'              },
        { col:46, row:15, pause_ms:7000, say_ko:'다 같이 먹어요.',                   say_en:'Eating together with everyone.'          },
        { col:25, row:15, pause_ms:7000, say_ko:'역시 집밥이 최고예요.',             say_en:'Home cooking is the best.'              },
      ],
    },
  ],

  // ── Student A ─── diligent, studies every day, lives in house_a ──────────
  student_a: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:39, row:7, ambient:true,
      goals:[ { col:39, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:39, row:7, ambient:true,
      goals: [
        { col:39, row:7,  pause_ms:5000, say_ko:'일어났어요. 오늘도 공부해야죠.',     say_en:'Up. Time to study again today.'          },
        { col:37, row:10, pause_ms:5000, say_ko:'코타츠에서 간단히 아침 먹어요.',    say_en:'A quick breakfast at the kotatsu.'       },
        { col:39, row:7,  pause_ms:4000, say_ko:'도서관 가야겠어요.',                say_en:'Better head to the library.'             },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:20, hour_end:21,
      room:'house_a', col:37, row:10, ambient:true,
      goals: [
        { col:37, row:10, pause_ms:7000, say_ko:'오늘도 공부 열심히 했어요.',        say_en:'Studied hard again today.'               },
        { col:48, row:17, pause_ms:5000, say_ko:'저녁 먹어야겠어요.',               say_en:'Time for dinner.'                        },
        { col:39, row:7,  pause_ms:7000, say_ko:'내일도 도서관 가야죠.',            say_en:'Back to the library tomorrow.'          },
      ],
    },
  ],

  // ── Student B ─── methodical, steady hours, lives in house_b ─────────────
  student_b: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:38, row:7, ambient:true,
      goals:[ { col:38, row:7, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_b', col:38, row:7, ambient:true,
      goals: [
        { col:38, row:7,  pause_ms:5000, say_ko:'오늘도 도서관에 가야 해요.',        say_en:'Have to go to the library again today.'  },
        { col:46, row:5,  pause_ms:5000, say_ko:'코타츠에서 아침 먹어요.',           say_en:'Having breakfast at the kotatsu.'        },
        { col:38, row:7,  pause_ms:4000, say_ko:'오늘 리포트 꼭 끝내야겠어요.',     say_en:'Have to finish that report today.'       },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_b', col:46, row:5, ambient:true,
      goals: [
        { col:46, row:5,  pause_ms:7000, say_ko:'오늘 공부 잘 됐어요.',             say_en:'Studying went well today.'               },
        { col:47, row:21, pause_ms:5000, say_ko:'저녁 먹으면서 복습해요.',           say_en:'Reviewing while I eat dinner.'           },
        { col:38, row:7,  pause_ms:7000, say_ko:'내일도 열심히 해야죠.',            say_en:'Have to work hard again tomorrow.'       },
      ],
    },
  ],

  // ── Child A ─── adventurous, zipline fan, lives in house_a ───────────────
  child_a: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_a', col:33, row:15, ambient:true,
      goals:[ { col:33, row:15, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_a', col:33, row:15, ambient:true,
      goals: [
        { col:33, row:15, pause_ms:4000, say_ko:'일어났어요! 오늘도 놀러 갈 거예요!', say_en:'I\'m up! Going to play again today!'     },
        { col:37, row:10, pause_ms:4000, say_ko:'빨리 먹고 나가야 해요!',            say_en:'Have to eat fast and go outside!'        },
        { col:33, row:15, pause_ms:3000, say_ko:'짚라인 타고 싶어요!',               say_en:'I want to ride the zipline!'             },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_a', col:37, row:10, ambient:true,
      goals: [
        { col:37, row:10, pause_ms:6000, say_ko:'오늘 짚라인 몇 번이나 탔어요!',     say_en:'I rode the zipline so many times today!' },
        { col:48, row:17, pause_ms:5000, say_ko:'배고파요. 밥 먹어요!',              say_en:'I\'m hungry. Time to eat!'               },
        { col:33, row:15, pause_ms:6000, say_ko:'내일 또 타러 갈 거예요!',           say_en:'Going back to ride again tomorrow!'      },
      ],
    },
  ],

  // ── Child B ─── curious explorer, lives in house_b ───────────────────────
  child_b: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:7,
      room:'house_b', col:25, row:16, ambient:true,
      goals:[ { col:25, row:16, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:9,
      room:'house_b', col:25, row:16, ambient:true,
      goals: [
        { col:25, row:16, pause_ms:4000, say_ko:'오늘은 어디 갈까요?',               say_en:'Where should I go today?'                },
        { col:46, row:5,  pause_ms:4000, say_ko:'코타츠에서 밥 먹어요.',             say_en:'Having breakfast at the kotatsu.'        },
        { col:25, row:16, pause_ms:4000, say_ko:'빨리 나가고 싶어요!',               say_en:'I want to go out already!'               },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house_b', col:46, row:5, ambient:true,
      goals: [
        { col:46, row:5,  pause_ms:6000, say_ko:'오늘 밖에서 많이 놀았어요.',        say_en:'I played outside a lot today.'           },
        { col:47, row:21, pause_ms:5000, say_ko:'피곤해요. 밥 먹고 자야겠어요.',     say_en:'I\'m tired. Eat dinner then sleep.'      },
        { col:25, row:16, pause_ms:6000, say_ko:'내일 또 놀러 갈 거예요!',          say_en:'Going out to play again tomorrow!'       },
      ],
    },
  ],

  // ── House visitors ─── stay at player's house ────────────────────────────
  visitor_a: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:9,
      room:'house', col:26, row:9, ambient:true,
      goals:[ { col:26, row:9, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:10,
      room:'house', col:18, row:9, ambient:true, convo:'house_welcome_chat',
      goals: [
        { col:18, row:9,  pause_ms:5000, say_ko:'아, 벌써 아침이네요.',             say_en:'Oh, it\'s morning already.'            },
        { col:7,  row:9,  pause_ms:4000, say_ko:'슬리퍼 찾아야겠어요.',             say_en:'Time to find my slippers.'             },
        { col:25, row:12, pause_ms:8000, say_ko:'코타츠에서 아침 먹을게요.',         say_en:'I\'ll have breakfast at the kotatsu.' },
        { col:47, row:7,  pause_ms:5000, say_ko:'아침 준비 도와드릴게요.',           say_en:'Let me help with breakfast.'           },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:10, hour_end:14,
      room:'library', col:35, row:12, ambient:true, convo:'library_study_chat',
      goals: [
        { col:35, row:12, pause_ms:12000, say_ko:'오늘도 책 읽으러 왔어요.',         say_en:'Here to read again today.'            },
        { col:51, row: 5, pause_ms: 5000, say_ko:'위쪽 서가에 뭐가 있을까요?',      say_en:'Wonder what\'s on the upper shelves.' },
        { col:15, row:20, pause_ms: 7000, say_ko:'이쪽도 볼 책이 많네요.',           say_en:'So many books to browse over here.'  },
        { col:35, row:12, pause_ms:10000, say_ko:'이 책 정말 재미있어요.',            say_en:'This book is really interesting.'    },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:14, hour_end:18,
      room:'gallery', col:30, row:20, ambient:true, convo:'gallery_explore_chat',
      goals: [
        { col:30, row:20, pause_ms:10000, say_ko:'갤러리는 올 때마다 좋아요.',        say_en:'I love this gallery every time I visit.' },
        { col:10, row:11, pause_ms: 7000, say_ko:'이 인형들 정말 정교해요.',          say_en:'These dolls are so finely made.'      },
        { col:50, row: 5, pause_ms: 6000, say_ko:'저쪽 전시도 꼭 봐야죠.',           say_en:'I have to see that exhibit too.'      },
        { col:30, row:20, pause_ms: 8000, say_ko:'다음에 또 올게요.',                say_en:'I\'ll definitely come back.'          },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:18, hour_end:21,
      room:'house', col:47, row:13, ambient:true, convo:'house_welcome_chat',
      goals: [
        { col:47, row:13, pause_ms: 6000, say_ko:'저녁 준비 도와드릴까요?',           say_en:'Can I help with dinner?'              },
        { col:47, row:20, pause_ms: 5000, say_ko:'밥상 차리는 것 도와드릴게요.',      say_en:'Let me help set the table.'           },
        { col:25, row:12, pause_ms: 9000, say_ko:'코타츠에서 밥 먹을게요.',           say_en:'I\'ll eat at the kotatsu.'            },
        { col:25, row:14, pause_ms: 7000, say_ko:'오늘 하루도 정말 좋았어요.',        say_en:'Today was really wonderful.'          },
      ],
    },
  ],

  visitor_b: [
    { days:[0,1,2,3,4,5,6], hour_start:21, hour_end:9,
      room:'house', col:30, row:9, ambient:true,
      goals:[ { col:30, row:9, pause_ms:60000 } ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:7, hour_end:10,
      room:'house', col:30, row:12, ambient:true, convo:'house_activity_chat',
      goals: [
        { col:30, row:12, pause_ms: 7000, say_ko:'좋은 아침이에요!',                say_en:'Good morning!'                        },
        { col:7,  row:9,  pause_ms: 3000, say_ko:'신발 여기 두면 되죠?',             say_en:'Shoes go here, right?'                },
        { col:47, row:7,  pause_ms: 6000, say_ko:'뭐 드릴까요? 제가 끓여드릴게요!',  say_en:'What can I get you? I\'ll make it!'  },
        { col:30, row:12, pause_ms: 8000, say_ko:'역시 아침은 코타츠가 최고예요.',    say_en:'Nothing beats the kotatsu in the morning.' },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:10, hour_end:13,
      room:'outdoor', col:25, row:13, ambient:true, convo:'outdoor_nature_chat',
      goals: [
        { col:25, row:13, pause_ms: 6000, say_ko:'밖에 나오니까 상쾌해요!',           say_en:'It feels so refreshing outside!'      },
        { col: 5, row:11, pause_ms: 5000, say_ko:'벤치에서 잠깐 쉴게요.',             say_en:'I\'ll rest on the bench a moment.'   },
        { col:45, row:15, pause_ms: 7000, say_ko:'저쪽까지 걸어볼게요.',              say_en:'I\'ll walk all the way over there.'  },
        { col:25, row:13, pause_ms: 8000, say_ko:'이 길 정말 좋아요.',               say_en:'I really love this path.'            },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:13, hour_end:17,
      room:'salon', col:20, row:13, ambient:true, convo:'salon_craft_chat',
      goals: [
        { col:20, row:13, pause_ms: 9000, say_ko:'살롱에서 뭔가 만들어볼게요.',        say_en:'Time to make something at the salon.' },
        { col: 5, row: 5, pause_ms: 5000, say_ko:'재료가 엄청 많네요!',               say_en:'There are so many materials here!'   },
        { col:50, row:13, pause_ms: 7000, say_ko:'저쪽 자리도 괜찮아 보여요.',         say_en:'That spot over there looks good too.' },
        { col:20, row:13, pause_ms:10000, say_ko:'완성되면 보여드릴게요!',             say_en:'I\'ll show you when it\'s done!'     },
      ],
    },
    { days:[0,1,2,3,4,5,6], hour_start:17, hour_end:21,
      room:'house', col:47, row:20, ambient:true, convo:'house_activity_chat',
      goals: [
        { col:47, row:20, pause_ms: 5000, say_ko:'배고파요! 뭐 먹을 거예요?',         say_en:'I\'m hungry! What are we eating?'    },
        { col:47, row:13, pause_ms: 6000, say_ko:'같이 요리할까요?',                  say_en:'Should we cook together?'            },
        { col:30, row:12, pause_ms: 9000, say_ko:'코타츠에서 기다릴게요.',             say_en:'I\'ll wait at the kotatsu.'          },
        { col:25, row:14, pause_ms: 7000, say_ko:'오늘 하루 너무 재미있었어요.',       say_en:'Today was so much fun.'             },
      ],
    },
  ],
};
