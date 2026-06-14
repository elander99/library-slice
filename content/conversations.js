// Scripted two-person conversations observed in each room.
// Each turn: npc_id links to the speaker, ko/en are the lines.
// Words are space-split for interactive vocabulary chips.

const CONVERSATIONS = {

  // ── Salon: visitors discover the food rule ────────────────────────────────
  salon_food_chat: {
    title_ko: '살롱 대화',
    title_en: 'Salon Chat',
    turns: [
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '아, 배가 고프다. 간식 먹어도 될까?',
        en: "I'm hungry. Can I have a snack?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '잠깐, 저기 표지판 봐봐. 음식이나 음료 반입은 삼가야 해.',
        en: "Wait, look at that sign. We should refrain from bringing food or drinks."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '아, 그렇군요! 음식물 섭취도 안 되는 건가요?',
        en: "Oh I see! Does that mean eating and drinking is off-limits too?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '맞아. 반입도 섭취도 안 돼. 수분 보충은 가능하대. 물도 마셔도 돼.',
        en: "Right — no bringing food in, no eating either. But water is permitted."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: 'ありがとう! 다행이다. 음식은 나중에 먹을게.',
        en: "ありがとう! What a relief. I'll eat later."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '음식을 가져오면 안 되고, 먹어도 안 돼. 그래서 밖에서 먹어야 해.',
        en: "No bringing food in, and no eating either. So you have to eat outside."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '아, 그럼 살롱 안에서는 먹을 수 없구나. 점심은 밖에서 먹자.',
        en: "So you can't eat inside the salon. Let's have lunch outside."
      },
    ]
  },

  // ── Library: two students, one finds out about the quiet rule ─────────────
  library_study_chat: {
    title_ko: '도서관 대화',
    title_en: 'Library Chat',
    turns: [
      {
        npc_id: 'student_a', name_ko: '서준', name_en: 'Student A',
        ko: '이 교과서(教科書) 어디 있는지 알아?',
        en: "Do you know where this textbook is?"
      },
      {
        npc_id: 'student_b', name_ko: '지원', name_en: 'Student B',
        ko: '카탈로그에서 검색해봐. 찾아봐 — 바로 알 수 있어. 책도 저 書棚에 있어.',
        en: "Search the catalogue and look it up — you'll find it quickly. The books are in the 書棚 over there too."
      },
      {
        npc_id: 'student_a', name_ko: '서준', name_en: 'Student A',
        ko: '고마워. 그런데 여기 통화하면 안 되지?',
        en: "Thanks. We can't make calls here, right?"
      },
      {
        npc_id: 'student_b', name_ko: '지원', name_en: 'Student B',
        ko: '응, 저 표지판 봐봐. 휴대전화 통화는 삼가 주세요.',
        en: "Right, look at that sign — please refrain from phone calls."
      },
      {
        npc_id: 'student_a', name_ko: '서준', name_en: 'Student A',
        ko: 'はい/알겠어, 조용히 공부하자.',
        en: "はい/알겠어, let's study quietly."
      },
      {
        npc_id: 'student_b', name_ko: '지원', name_en: 'Student B',
        ko: '끝나면 출구에서 만나자.',
        en: "When we're done, let's meet at the exit."
      },
      {
        npc_id: 'student_a', name_ko: '서준', name_en: 'Student A',
        ko: '그런데 왜 여기서 충전을 못 해? 콘센트 있잖아.',
        en: "But why can't you charge here? There's an outlet right there."
      },
      {
        npc_id: 'student_b', name_ko: '지원', name_en: 'Student B',
        ko: '도서관 업무 때문에 전용이야. 개인 용도로는 사용할 수 없어.',
        en: "It's reserved because of library work rules. You can't use it for personal things."
      },
    ]
  },

  // ── Outdoor: two children at the zipline queue ────────────────────────────
  outdoor_zipline_chat: {
    title_ko: '짚라인 대화',
    title_en: 'Zipline Chat',
    turns: [
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '야, 이제 내 차례야!',
        en: "Hey, it's my turn now!"
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '잠깐, 줄 서야 해. 짚라인 이용자가 通ります — 아직 기다리고 있잖아.',
        en: "Wait, you have to line up. The zipline user is 通ります — still waiting."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '아, 맞아. 順番に — 차례차례 해야 하는구나.',
        en: "Oh right. 順番に — we need to take turns."
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '응. 7살 이상은 어린 아이에게 양보해야 해.',
        en: "Right. Those 7 and older should yield to younger children."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '알겠어! 기다려도 돼, 같이 있자.',
        en: "Got it! We can wait — let's stay together."
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '작은 아이들은 보호자와 함께 해야 하는 거 아냐?',
        en: "Don't small kids need to do this with a guardian?"
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '야외 직원한테 짚라인 어떻게 타는지 물어봐도 될까?',
        en: "Can I ask the outdoor staff how to use the zipline?"
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '응! 규칙이나 나이도 물어봐. また やろう！ 직원이니까 잘 알 거야.',
        en: "Yes! Ask about the rules and the age limit. また やろう！ The staff will know."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '얼마나 기다려야 해? 빨리 타고 싶어!',
        en: "How long do we have to wait? I want to ride it so badly!"
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '이용자 때문에 조금 기다려야 해. 아직 못 탔잖아.',
        en: "You have to wait a bit because of the rider ahead. We haven't gone yet."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '그럼 벤치에 앉아서 기다리자!',
        en: "Then let's sit on the bench and wait!"
      },
    ]
  },


  // ── Gallery: children discover the no-touch rule ──────────────────────────
  gallery_explore_chat: {
    title_ko: '전시관 대화',
    title_en: 'Gallery Chat',
    turns: [
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '와, 汽車(기차) 코너도 있네! 이 완구들 진짜 신기하다!',
        en: "Wow, there's even a 汽車(기차) train section! These toys are so interesting!"
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '맞아! 근데 전시품이라서 만지지 마.',
        en: "Right! But they're exhibits, so don't touch."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '아, 표지판에도 있네. 전시품은 만지지 마세요.',
        en: "Oh, the sign says it too. Please don't touch the exhibits."
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '전시관은 토요일이랑 일요일에만, 10시부터 17시까지 개관한대.',
        en: "The exhibition hall is only open Saturdays and Sundays, from 10 to 5."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '그렇구나. 오늘 마감 전에 와서 다행이다!',
        en: "I see. Lucky we came before closing today!"
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '전시관이 얼마나 넓어? 다 보려면 시간이 걸리겠다.',
        en: "How big is this exhibition hall? It'll take a while to see everything."
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '주말에만 열리니까, 오늘 다 봐야 해! 앞쪽 코너부터 보자.',
        en: "It's only open on weekends, so we need to see it all today! Let's start from the front section."
      },
      {
        npc_id: 'child_b', name_ko: '민서', name_en: 'Child B',
        ko: '저 큐레이터한테 뭘 물어볼 수 있는지 알아?',
        en: "Do you know what you can ask the curator over there?"
      },
      {
        npc_id: 'child_a', name_ko: '유나', name_en: 'Child A',
        ko: '이 画廊에서 좋아하는 전시품이 뭔지 물어봐! 재미있는 얘기 해줄 거야.',
        en: "Ask what their favourite exhibit is in this 画廊! They'll have interesting things to say."
      },
    ]
  },

  // ── Cooking Room: first-timer learns the safety rules ────────────────────
  cooking_lesson_chat: {
    title_ko: '요리실 대화',
    title_en: 'Cooking Room Chat',
    turns: [
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '요리 교실 처음인데... 좀 긴장돼.',
        en: "It's my first cooking class... I'm a bit nervous."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '괜찮아! 아이와 어른이 함께 하면 재미있을 거야. 칼이나 불 조심하면 돼.',
        en: "It's fine! When kids and adults do it together it's fun. Just be careful with knives or fire."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '칼 사용할 때 주의해야겠다.',
        en: "I'll need to be cautious when using knives."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '응. 표지판에도 조심하세요! 라고 써 있잖아.',
        en: "Yeah — the sign says be careful! right there."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '알겠어. 그래도 요리하면 재미있겠지?',
        en: "Got it. Still, cooking will be fun, won't it?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '저 요리사가 오늘 뭘 만드는지 알아?',
        en: "Do you know what the cook is making today?"
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '직접 가서 물어봐! 레시피도 알려줄 거야. 칼이나 불 조심하는 법도.',
        en: "Go ask them directly! They'll tell you the recipe — and how to be safe with knives and fire."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '어떻게 만드는지 알려달라고 해봐. 처음이라서 잘 모르잖아.',
        en: "Ask them to show you how to make it. You don't know since it's your first time."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '응! 요리 배우고 싶었어. 잘 부탁드립니다! 라고 하면서 물어볼게.',
        en: "Yeah! I've been wanting to learn to cook. I'll ask them politely — よろしくお願いします style!"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '레시피 알려줘서 감사해요! 다음에 또 연습해 보자.',
        en: "Thank you for sharing the recipe! Let's practice again next time."
      },
    ]
  },

  // ── Library: students debate the outlet policy ────────────────────────────
  library_outlet_chat: {
    title_ko: '콘센트 대화',
    title_en: 'Outlet Chat',
    turns: [
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '여기서 노트북 충전해도 될까?',
        en: "Can I charge my laptop here?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '콘센트 표지판 봐봐. 도서관 업무에만 사용해 주세요, 라고 써 있어. 도서관 업무 전용이야. 그래서 개인 작업은 안 돼.',
        en: "Look at the outlet sign. It says library work only. It's reserved for library use — so personal work isn't allowed."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '아, 전용이구나. 책 읽는 건 도서관 업무에 포함될까?',
        en: "Oh, only for that. Would reading books count as library work?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '글쎄... 사서 선생님한테 물어보는 게 좋을 것 같아.',
        en: "Hmm... I think it's better to ask the librarian."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '그렇게 할게. 가능하면 다행이겠다!',
        en: "I'll do that. It'd be a relief if it's allowed!"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '그런데 왜 도서관 업무 전용이야? 콘센트가 많지 않아서?',
        en: "But why is it only for library work? Because there aren't many outlets?"
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '아마 그래서 전용으로 한 거겠지. 모두 쓸 수 없으니까.',
        en: "Probably that's why they made it exclusive. Not everyone can use it."
      },
    ]
  },

  // ── House: a guest arrives and settles in ────────────────────────────────
  house_welcome_chat: {
    title_ko: '집 대화',
    title_en: 'House Chat',
    turns: [
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '어서 오세요! 신발 벗어요.',
        en: "Welcome! Please take off your shoes."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '고마워. 코타츠도 있어서 따뜻하게 지내기 좋다, 여기.',
        en: "Thanks. There's even a kotatsu — it's nice and warm to stay in here."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '코타츠에서 함께 쉬자!',
        en: "Let's rest together at the kotatsu!"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '좋아! 저녁은 뭐야?',
        en: "Sounds good! What's for dinner?"
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '카레라이스야! 요리실에서 만들고 왔어.',
        en: "Curry rice! I made it in the cooking room and came right back."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '맛있겠다! 나중에 나갈 때 출구가 어디야?',
        en: "Sounds delicious! When we leave later, where's the exit?"
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '왼쪽 출구에서 나가면 돼.',
        en: "You exit through the one on the left."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '아침에는 뭐 먹었어? 아직 배가 좀 고픈 것 같아.',
        en: "What did you have for breakfast? I'm still a bit hungry."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '점심은 아직이야. 밤이 되기 전에 저녁 먹자! 카레라이스 있잖아.',
        en: "Lunch isn't until later. Let's eat dinner before it gets too late — we have curry rice!"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '화장실이 어디에 있는지 알아? 아직 몰라서.',
        en: "Do you know where the bathroom is? I still don't know."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '나도 몰라. 집 주인한테 직접 물어봐!',
        en: "I don't know either. Just ask the host directly!"
      },
    ]
  },

  // ── House: housemates ask what each other is doing ───────────────────────
  house_activity_chat: {
    title_ko: '뭐 해요?',
    title_en: 'What Are You Doing?',
    turns: [
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '뭐 해요?',
        en: "What are you doing?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '코타츠에서 쉬고 있어요. 따뜻해요!',
        en: "I'm resting at the kotatsu. It's so warm!"
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '좋겠다. 집 주인은 지금 뭐 하고 있어요?',
        en: "Sounds nice. What is the host doing right now?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '주방에서 요리하고 있는 것 같아요.',
        en: "They seem to be cooking in the kitchen."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '저도 가서 도와줄게요.',
        en: "I'll go help them."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '같이 가요!',
        en: "Let's go together!"
      },
    ]
  },

  // ── Lobby: two visitors figure out what to ask the receptionist ──────────
  lobby_visitor_chat: {
    title_ko: '로비 대화',
    title_en: 'Lobby Chat',
    turns: [
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '실례합니다! 저 안내 직원이 맞아요? 뭘 물어볼 수 있어?',
        en: "Excuse me! Is that the information desk? What can I ask them?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '맞아! 잘 부탁드립니다, 라고 인사하고 물어봐. 친절하게 알려줄 거야.',
        en: "Yes! Greet them politely — 잘 부탁드립니다 — then ask. They'll be happy to help."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '처음 왔는데, 저 안내 직원한테 뭘 물어볼 수 있어?',
        en: "I've never been here before — what can I ask that receptionist?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '시설 위치나 가는 방법 물어봐. 2층에 뭐가 있는지도 알려줄 거야.',
        en: "Ask about where things are and how to get there. They can tell you what's on the 2nd floor too."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '좋아! 그럼 물어보고 2층으로 같이 가자.',
        en: "Great! Then let's ask and go up to the 2nd floor together."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '오전에 오는 게 좋아. 오후에는 사람이 더 많거든.',
        en: "It's better to come in the morning. There are more people in the afternoon."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '오늘 특별 행사가 있는지도 알고 싶어.',
        en: "I'd also like to know if there are any special events today."
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '회원 등록도 여기서 한대. 신분증 있으면 바로 해줘.',
        en: "You can register for membership here too. Bring your ID and they'll do it right away."
      },
      {
        npc_id: 'visitor_a', name_ko: '하린', name_en: 'Harin',
        ko: '생일이 언제인지도 궁금한데. 물어봐도 될까?',
        en: "I'm also curious when their birthday is. Would it be okay to ask?"
      },
      {
        npc_id: 'visitor_b', name_ko: '유진', name_en: 'Yujin',
        ko: '물어봐! 직접 인사하면서 물어보면 친절하게 알려줄 거야.',
        en: "Go for it! Say hello and ask — I'm sure they'll be happy to tell you."
      },
    ]
  },

  outdoor_nature_chat: {
    title_ko: '야외 이야기',
    title_en: 'Outdoor Chat',
    turns: [
      {
        npc_id: 'nana', name_ko: '나나', name_en: 'Nana',
        ko: '여기 공원 정말 넓다! 어디까지 달려갈 수 있을까?',
        en: "This park is huge! I wonder how far I can run?"
      },
      {
        npc_id: 'riku', name_ko: '리쿠', name_en: 'Riku',
        ko: '저 짚라인 탄 적 있어? 되게 빠르다더라!',
        en: "Have you tried the zipline? I heard it's really fast!"
      },
      {
        npc_id: 'nana', name_ko: '나나', name_en: 'Nana',
        ko: '아직! 근데 꼭 타볼 거야. 오늘 같이 가줄래?',
        en: "Not yet! But I definitely want to. Will you come with me today?"
      },
    ]
  },

  play_area_kids_chat: {
    title_ko: '놀이터 이야기',
    title_en: 'Playground Chat',
    turns: [
      {
        npc_id: 'yuki', name_ko: '유키', name_en: 'Yuki',
        ko: '그네 자리 비어 있어! 빨리 가자!',
        en: "The swing is free! Let's go!"
      },
      {
        npc_id: 'haruto', name_ko: '하루토', name_en: 'Haruto',
        ko: '나 그네 제일 높이 탈 수 있어. 한번 볼래?',
        en: "I can swing the highest. Want to see?"
      },
      {
        npc_id: 'yuki', name_ko: '유키', name_en: 'Yuki',
        ko: '좋아! 나도 질 수 없지. 같이 해보자!',
        en: "You're on! I'm not going to lose. Let's go!"
      },
    ]
  },

  lobby_intro_chat: {
    title_ko: '로비 첫인사',
    title_en: 'Lobby Introduction',
    turns: [
      {
        npc_id: 'hana', name_ko: '하나', name_en: 'Hana',
        ko: '어서 오세요! 처음 뵙겠습니다. 저는 하나예요.',
        en: "Welcome! This is our first meeting — I'm Hana."
      },
      {
        npc_id: 'kenji', name_ko: '겐지', name_en: 'Kenji',
        ko: '반갑습니다. 저는 겐지라고 해요. はじめまして。',
        en: "Nice to meet you. I go by Kenji. はじめまして。"
      },
      {
        npc_id: 'hana', name_ko: '하나', name_en: 'Hana',
        ko: '겐지 씨, 이름에 한자가 있어요? 어떻게 써요?',
        en: "Kenji-san, are there kanji in your name? How do you write it?"
      },
      {
        npc_id: 'kenji', name_ko: '겐지', name_en: 'Kenji',
        ko: '네, 健二예요. 건강할 건, 두 이. 하나 씨는요?',
        en: "Yes — 健二. 健 for health, 二 for two. What about you, Hana-san?"
      },
      {
        npc_id: 'hana', name_ko: '하나', name_en: 'Hana',
        ko: '저는 花예요. 꽃 화. 잘 부탁해요!',
        en: "Mine is 花 — the flower character. よろしくお願いします!"
      },
      {
        npc_id: 'kenji', name_ko: '겐지', name_en: 'Kenji',
        ko: '저도요. よろしくお願いします。 이름 잘 기억할게요.',
        en: "Likewise. よろしくお願いします. I'll be sure to remember your name."
      },
    ]
  },

  salon_craft_chat: {
    title_ko: '살롱 이야기',
    title_en: 'Salon Chat',
    turns: [
      {
        npc_id: 'sora', name_ko: '소라', name_en: 'Sora',
        ko: '오늘은 뭐 만들 거야? 나는 작은 상자 만들어볼까 해.',
        en: "What are you making today? I'm thinking of making a little box."
      },
      {
        npc_id: 'riku', name_ko: '리쿠', name_en: 'Riku',
        ko: '상자? 멋지다! 나는 카드 만들까 해. 생일 선물로.',
        en: "A box? Nice! I'm going to make a card — as a birthday gift."
      },
      {
        npc_id: 'sora', name_ko: '소라', name_en: 'Sora',
        ko: '그럼 상자에 카드 같이 넣어서 주면 더 멋지겠다!',
        en: "Then put the card in the box — that would make an even better gift!"
      },
    ]
  },

};
