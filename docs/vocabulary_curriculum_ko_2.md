# Vocabulary Curriculum — Korean Words 101–200

Each word appears **three times** in the world, across different rooms and media.

## What the Second 100 Adds

The first 100 words built the grammatical scaffolding: particles, polite endings, rules
vocabulary, place names, people, and the objects the player physically sees. A player
who knows those 100 can read most signs and follow the gist of NPC speech.

The second 100 words extend in four directions:

1. **Connective grammar** — how clauses link. The player can read individual sentences;
   now they learn the words that connect them: because, but, so, if, then.

2. **Question words and demonstratives** — what/where/when/why/how and this/that/here/there.
   These are essential for comprehending NPC questions and multi-turn dialogues.

3. **Core verbs and adjectives** — the ~20 highest-frequency action words and descriptors
   in the game's ambient conversations. Many already appear in the content.

4. **Social scripts and numbers** — the expressions players need to feel comfortable
   initiating interaction: thank you, sorry, excuse me, one moment please.

The morpheme tier (197–200) continues the first curriculum's strategy of teaching Sino-Korean
roots that unlock many words at once. Cross-references to first-100 words show how new
morphemes extend what was already learned.

---

## Media Key

| Code | Meaning |
|------|---------|
| **S** | Wall sign |
| **C** | Ambient conversation |
| **N** | NPC dialogue |
| **O** | Scene object / lore hotspot |
| ✓ | Already in content |
| + | Needs to be added |

---

## Tier 11 — Connective Grammar: Linking Clauses (101–110)

**Teaching note**: The first 100 words show how a sentence *ends*; this tier shows
how sentences *connect*. Korean connective endings attach to the verb stem and
signal the relationship between clauses. This tier covers the ten most common
connective forms the player encounters in ambient conversations and NPC dialogue.

---

### 101. -(으)면 — if / when [conditional]

*Attaches to verb stems: 하다 → 하면, 있다 → 있으면, 오다 → 오면.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | C `cooking_lesson_chat` | 요리**하면** 재미있겠지? | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 칼이나 불 조심**하면** 돼 | ✓ |
| 3 | House | N `house_resident` ask_food | 배가 고프**면** 카레라이스 드세요 | ✓ |

---

### 102. -(아/어)서 — because / and then [causal-sequential]

*Two uses: reason (배고파서 = because I'm hungry) and sequence (가서 = went and then).
Context distinguishes them; both are the same form.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | C `gallery_explore_chat` | 오늘 마감 전에 와**서** 다행이다! | ✓ |
| 2 | House | N `house_resident` ask_house | 따뜻해**서** 너무 좋아요~ | ✓ |
| 3 | Lobby | N `receptionist` birthday | 새해와 함께 축하할 수 있어**서** 즐거워요 | ✓ |

---

### 103. -지만 — but [concessive]

*Acknowledges the preceding clause, then qualifies it.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_events | 특별한 행사는 없**지만**, 모든 시설을 이용하실 수 있어요 | ✓ |
| 2 | House | N `house_resident` ask_house | 이 집은 오래됐**지만** 아늑하죠? | ✓ |
| 3 | Outdoor | C `outdoor_chat` | 규칙은 있**지만** 재미있어! |✓ |

---

### 104. -(으)ㄴ/는데 — but / while / context [background clause]

*Sets up context for what follows. 있**는데** (while there is…), 좋**은데** (it's
good, but…). One of the most frequent clause connectors in Korean speech.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | C `cooking_lesson_chat` | 처음인**데**... 좀 긴장돼 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 저 큐레이터한테 뭘 물어볼 수 있는지 알아? (interrogative 는데) | ✓ |
| 3 | Lobby | C `lobby_chat` | 처음 왔는**데**, 저 안내 직원한테 뭘 물어볼 수 있어? | ✓ |

---

### 105. -고 — and / then / while [additive connective]

*Connects two verb phrases: 먹**고** 가요 (eat and go), 관리**하고** 있어요 (managing).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_job | 책 정리나 대출 처리가 주 업무예요. 도움 필요하세요? (두 동작 -고 연결) | ✓ |
| 2 | Salon | N `salon_staff` ask_crafts | 공작대 준비**도** 하**고** 있어요 | ✓ |
| 3 | House | C `house_welcome_chat` | 오늘 저녁 뭐야? 카레라이스야! 요리실에서 만들**고** 왔어 |✓ |

---

### 106. 그래서 — so / therefore

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_outlet_chat` | 도서관 업무 전용이야. **그래서** 개인 작업은 안 돼. |✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 이용자가 지나가는 중이야. **그래서** 기다려야 해. |✓ |
| 3 | Salon | C `salon_food_chat` | 반입은 안 돼. **그래서** 밖에서 먹어야 해. |✓ |

---

### 107. 그런데 — but / by the way

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 고마워. **그런데** 여기 통화하면 안 되지? | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **근데** 전시품이라서 만지지 마. | ✓ (근데 = 그런데 shortened) |
| 3 | House | C `house_welcome_chat` | 코타츠도 있어서 좋아. **그런데** 저녁이 뭐야? |✓ |

*교학 노트: 그런데 → 근데 is a very common colloquial contraction. The player hears
근데 and should recognize it as 그런데.*

---

### 108. 그리고 — and [additive discourse connector]

*Joins sentences or lists: A. 그리고 B. (Unlike -고, 그리고 stands between full sentences.)*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_directions | 도서관과 어린이 살롱은 2층에 있습니다. **그리고** 요리실도 2층이에요. | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | 인형도 전시품이에요. **그리고** 토요일과 일요일에만 열려요. | ✓ |
| 3 | Play Area | N `play_staff` ask_rules | 뛸 때는 조심해요. **그리고** 다른 아이들과 사이좋게 놀아요. | ✓ |

---

### 109. 그럼 / 그러면 — then / in that case

*Response connector: "Given what you just said, then…"*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_craft_chat` | **그럼** 상자에 카드 같이 넣어서 주면 더 멋지겠다! | ✓ |
| 2 | Library | C `library_outlet_chat` | **그럼** 사서 선생님한테 물어보는 게 좋을 것 같아 | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | **그럼** 같이 기다리자! |✓ |

---

### 110. 때문에 — because of / due to [noun-based reason]

*Attaches to a noun: 규칙 때문에 (because of the rules). Contrast with -(아/어)서 which
attaches to a verb stem.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | 이용자 **때문에** 기다려야 해 |✓ |
| 2 | Library | C `library_study_chat` | 규칙 **때문에** 통화 못 해 |✓ |
| 3 | Gallery | N `gallery_curator` birthday | 만우절이랑 같은 날이라서 아무도 믿어주지 않아서 곤란해요! (연결 구조 이해 강화) | ✓ |

---

## Tier 12 — Question Words & Demonstratives (111–122)

**Teaching note**: Question words in Korean don't move to the front of the sentence
the way they do in English. 어디 있어? (where is it?) has the same word order as a
statement. This makes question words easy to use once you know the vocabulary.

---

### 111. 뭐 / 무엇 — what

*뭐 is the spoken contraction of 무엇. Signs use 무엇; conversations use 뭐.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | C `lobby_chat` | 저 안내 직원한테 **뭘** 물어볼 수 있어? | ✓ |
| 2 | Salon | N `salon_staff` greeting | 오늘은 **무슨** 공작을 할 건가요? | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 저 요리사가 오늘 **뭘** 만드는지 알아? | ✓ |

---

### 112. 어디 — where

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 이 교과서 **어디** 있는지 알아? | ✓ |
| 2 | Lobby | C `lobby_chat` | 시설 위치나 가는 방법 물어봐. 2층에 **뭐**가 있는지도 알려줄 거야. | ✓ |
| 3 | House | N `house_resident` ask_outside | 나가려면 **어디로** 가야 해요? |✓ |

---

### 113. 언제 — when

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | C `lobby_chat` | 생일이 **언제**인지도 궁금한데 | ✓ |
| 2 | Gallery | S `gallery_trains` | 개관 시간이 **언제**인지 확인 (implied by hours sign) | ✓ |
| 3 | House | N `house_resident` greeting | **언제든** 또 와요 | ✓ |

---

### 114. 왜 — why

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_outlet_chat` | **왜** 개인 작업은 안 돼? |✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | **왜** 기다려야 해? |✓ |
| 3 | Gallery | N `gallery_curator` birthday | 아무도 믿어주지 않아서 곤란해요! (**왜** 물어보는 게 자연스러운 상황) | ✓ (question context) |

---

### 115. 어떻게 — how

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | 짚라인 **어떻게** 타는지 물어봐도 될까? | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 칼 **어떻게** 사용해야 해? |✓ |
| 3 | Library | N `librarian` ask_book | **어떻게** 찾으면 되나요? (검색 방법) |✓ |

---

### 116. 얼마나 — how much / how long

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_hours | 영업 시간이 **얼마나** 남았어요? |✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | **얼마나** 기다려야 해? |✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시관이 **얼마나** 넓어? |✓ |

---

### 117. 몇 — how many / which number

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 대상 연령이 **몇** 살인지 (3살~6살) | ✓ (implied) |
| 2 | Lobby | N `receptionist` ask_hours | 지금 **몇** 시예요? |✓ |
| 3 | Gallery | S `gallery_trains` | **몇** 층인지 (완구 전시관) |✓ |

---

### 118. 이 — this [demonstrative modifier]

*이 + noun = this noun. Contrast: 이 책 (this book) vs 그 책 (that book).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | C `gallery_explore_chat` | **이** 완구들 진짜 신기하다! | ✓ |
| 2 | House | N `house_resident` ask_house | **이** 집은 오래됐지만 아늑하죠? | ✓ |
| 3 | Play Area | N `play_staff` greeting | **이** 공간에서 즐겁게 놀아요 | ✓ |

---

### 119. 그 — that [demonstrative modifier, near listener]

*그 points toward something the listener knows or has just mentioned.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_play_chat` | **그**네 자리 비어 있어! 빨리 가자! | ✓ |
| 2 | Library | C `library_study_chat` | **그**런데 여기 통화하면 안 되지? (그런데 = 그 + 런데 compound) | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **그래**도 요리하면 재미있겠지? (그래도 = 그 base) | ✓ |

---

### 120. 여기 — here

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_outlet_chat` | **여기서** 노트북 충전해도 될까? | ✓ |
| 2 | Library | C `library_study_chat` | **여기** 통화하면 안 되지? | ✓ |
| 3 | Lobby | N `receptionist` ask_membership | 이용 등록은 **이곳** 접수에서 할 수 있어요 | ✓ (이곳 = 이 + 곳, similar to 여기) |

---

### 121. 거기 — there [near listener]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | N `salon_staff` ask_crafts | 재료는 **저쪽**에 있어요 (저쪽 ≈ over there, distinction with 거기) | ✓ |
| 2 | Library | N `librarian` ask_book | **거기** 서가에서 찾아보세요 |✓ |
| 3 | House | N `house_resident` ask_kitchen | 부엌에 차도 있어요. **거기** 가보세요. |✓ |

---

### 122. 저기 — over there [more distant]

*Three-way distinction: 여기 (here, near speaker) / 거기 (there, near listener) / 저기 (over there, distant from both).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 잠깐, **저기** 표지판 봐봐 | ✓ |
| 2 | Library | C `library_study_chat` | **저** 표지판 봐봐. 휴대전화 통화는 삼가 주세요 | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 표지판에도 **저기** 조심하세요! 라고 써 있잖아 | ✓ |

---

## Tier 13 — Ability, Permission & Obligation (123–130)

**Teaching note**: Korean expresses ability, want, and necessity through clause-final
patterns, not separate modal verbs. This tier teaches the four most common patterns
the player encounters when rules and permissions are discussed.

---

### 123. -(으)ㄹ 수 있다 — can / is possible

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | C `gallery_explore_chat` | 큐레이터한테 뭘 물어볼 **수 있는지** 알아? | ✓ |
| 2 | Play Area | N `play_staff` ask_safety | 어린이들이 안전하게 놀 **수 있도록** 지켜보고 있어요 | ✓ |
| 3 | Salon | N `salon_staff` ask_crafts | 오늘은 공작대가 사용 가능해요. → 사용**할 수 있**어요 (paraphrase) |✓ |

---

### 124. -(으)ㄹ 수 없다 — cannot / is impossible

*The negative of 123. 수 없다 expresses that something is beyond one's ability
or is not permitted.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_outlet | 개인 작업에는 사용**할 수 없**습니다 |✓ |
| 2 | Library | C `library_outlet_chat` | 그냥 쓰면 금지야 → 그냥 **쓸 수 없**어 |✓ |
| 3 | Salon | C `salon_food_chat` | 간식 먹어도 될까? → 안 돼, 먹**을 수 없**어 |✓ |

---

### 125. -고 싶다 — want to

*Expresses desire: V-고 싶다 (I want to V).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_chat` | 짚라인 꼭 타볼 **거야** → 타**고 싶어** (equivalent) |✓ |
| 2 | House | C `house_welcome_chat` | 코타츠에서 쉬**고 싶**어 |✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시관 오**고 싶**었는데 드디어 왔네! |✓ |

---

### 126. -(아/어)야 하다 — must / have to

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | 잠깐, 줄 서**야 해** | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 7살 이상은 어린 아이에게 양보해**야 해** | ✓ |
| 3 | Play Area | N `play_staff` ask_supervision | 반드시 보호자와 함께 있어**야 해**요 | ✓ |

---

### 127. 안 [negation] — not [pre-verbal negation]

*안 precedes the verb: 안 먹다, 안 돼, 안 되지. Contrast: -지 않다 is the
post-verbal form. Both mean "not"; 안 is more colloquial.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 반입도 섭취도 **안** 돼 | ✓ |
| 2 | Library | C `library_study_chat` | 여기 통화하면 **안** 되지? | ✓ |
| 3 | Salon | C `salon_food_chat` | 음식물 섭취도 **안** 되는 건가요? | ✓ |

*Note: The spatial 안 (inside, word 157) is a different word with the same spelling.
Context distinguishes them: before a verb = negation; after a noun = spatial.*

---

### 128. 못 [negation] — cannot [inability or external constraint]

*Contrast with 안: 안 먹다 = choosing not to eat; 못 먹다 = unable to eat.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 규칙 때문에 통화 **못** 해 |✓ |
| 2 | Cook | N `cook` fallback | 죄송해요, 지금 손이 좀 바빠서요 → 바빠서 지금 **못** 도와요 |✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 아직 타**지 못해**. 줄 서야 해 |✓ |

---

### 129. 필요하다 — to need / to be necessary

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` greeting | 도움이 **필요**하시면 말씀해 주세요 | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | 주의가 **필요**해요 | ✓ |
| 3 | Play Area | N `play_staff` fallback | 도움이 **필요**하면 불러 줘요 |✓ |

---

### 130. 되다 — to become / to be okay / to work out

*One of the most versatile Korean verbs. 돼요 = it works/it's okay; 됩니다 = formal.
Appears in 안 돼 (not okay), 가능합니다 (is possible = 됩니다 paraphrase).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 수분 보충은 가능하**대** → 물은 마셔도 **돼** | ✓ |
| 2 | House | N `house_resident` ask_food | 저녁이 **되면** 완성돼요 (when dinner time comes) | ✓ |
| 3 | Lobby | N `receptionist` ask_membership | 신분증을 가져오시면 바로 처리해 드립니다 → 바로 **됩니다** | ✓ |

---

## Tier 14 — Core Action Verbs (131–144)

**Teaching note**: These are the ~14 highest-frequency action verbs in the game's
Korean content. Most already appear in conversations; several are embedded in
polite forms like 주세요 or 들어가세요 that the player has already seen.

---

### 131. 가다 — to go

*가다 → 가요, 가세요, 갔어요. Already appears in many forms.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | C `lobby_chat` | 2층에 뭐가 있는지도 알려줄 거야 → 같이 **가자** |✓ |
| 2 | House | N `receptionist` farewell | 안전하게 돌아**가세요** | ✓ |
| 3 | House | C `house_welcome_chat` | 주방에서 요리하**고** 있는 것 같아요. 저도 **가서** 도와줄게요. | ✓ |

---

### 132. 오다 — to come

*오다 → 와요, 오세요, 왔어요. Appears in 어서 오세요 (word 20, first 100).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_welcome` | 어서 **오세요**! | ✓ |
| 2 | House | N `house_resident` greeting | 어서 **왔어요**! 많이 피곤하죠? | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 오늘 마감 전에 **와서** 다행이다! | ✓ |

---

### 133. 먹다 — to eat

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 음식은 나중에 **먹을게** | ✓ |
| 2 | Library | S `food_rule` | 음식물 섭취는 금지 → 먹으면 안 돼 (paraphrase on sign) | ✓ |
| 3 | House | N `house_resident` birthday | 같이 카레라이스 **먹으면서** 축하해요! | ✓ |

---

### 134. 마시다 — to drink

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 물도 **마셔도** 돼 | ✓ |
| 2 | Salon | S `salon_food` | 수분 보충만 가능합니다 → 물은 **마실 수** 있어요 | ✓ |
| 3 | House | N `house_resident` ask_food | 부엌에 차도 있어요 → 차도 **마셔도** 돼요 |✓ |

---

### 135. 보다 — to see / look / watch

*봐봐 (look! look!) is the most colloquial form; 보세요 is polite.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 저 표지판 **봐봐** | ✓ |
| 2 | Salon | C `salon_food_chat` | 저기 표지판 **봐봐** | ✓ |
| 3 | Gallery | N `gallery_curator` greeting | 천천히 둘러**보세요** | ✓ |

---

### 136. 읽다 — to read

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_outlet_chat` | 책 **읽는** 건 도서관 업무에 포함될까? | ✓ |
| 2 | Library | N `librarian` ask_book | 원하시는 책은 카탈로그에서 검색해 보세요 → 책을 **읽으러** 왔죠? |✓ |
| 3 | Library | O `textbook` lore | Reading it here is why you came → 여기서 **읽는** 게 목적 | ✓ |

---

### 137. 찾다 — to find / look for

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_book | 학생들이 많이 **찾는** 책도 있어요 | ✓ |
| 2 | Library | N `librarian` ask_book | 모르시면 사서에게 물어보세요 → 원하는 책을 **찾을 수** 없으면 | ✓ |
| 3 | Library | C `library_study_chat` | 이 교과서 어디 있는지 알아? → 카탈로그에서 **찾아봐** |✓ |

---

### 138. 만들다 — to make / create

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | C `cooking_lesson_chat` | 저 요리사가 오늘 뭘 **만드는지** 알아? | ✓ |
| 2 | House | C `house_welcome_chat` | 카레라이스야! 요리실에서 **만들**고 왔어 | ✓ |
| 3 | Salon | C `salon_craft_chat` | 오늘은 뭐 **만들** 거야? 나는 작은 상자 **만들어**볼까 해 | ✓ |

---

### 139. 놀다 — to play

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` ask_rules | 다른 아이들과 사이좋게 **놀아요** | ✓ |
| 2 | Play Area | N `play_staff` greeting | 이 공간에서 즐겁게 **놀아요** | ✓ |
| 3 | Outdoor | C `outdoor_play_chat` | 같이 **해보자**! (그네, 놀이 context) | ✓ |

---

### 140. 뛰다 — to run / jump

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` ask_rules | **뛸** 때는 조심해요 | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | **뛰지** 마세요 | ✓ |
| 3 | Outdoor | C `outdoor_chat` | 공원 정말 넓다! 어디까지 **달려**갈 수 있을까? | ✓ (달리다 ≈ 뛰다) |

---

### 141. 앉다 — to sit

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | N `house_resident` greeting | 많이 피곤하죠? 코타츠에서 좀 쉬어요 → 여기 **앉아요** |✓ |
| 2 | Outdoor | C `outdoor_chat` | 벤치에 **앉아서** 기다리자 |✓ |
| 3 | Library | C `library_study_chat` | 자리에 **앉아서** 공부하자 |✓ |

---

### 142. 말하다 — to say / speak

*말씀 is the honorific noun form; 말하다 is the plain verb. Both appear in the content.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` greeting | 도움이 필요하시면 **말씀**해 주세요 | ✓ |
| 2 | Librarian | N `librarian` fallback | 다시 한번 **말씀**해 주시겠어요? | ✓ |
| 3 | Play Area | N `play_staff` greeting | 무슨 일이 있으면 바로 불러 주세요 → 바로 **말해** 주세요 | ✓ |

---

### 143. 알다 — to know / understand

*알다 → 알아요, 알겠어요 (word 90, first 100), 알려줄게. Teaches that 알겠어요
(I understand) is the future-form of 알다.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 이 교과서 어디 있는지 **알아**? | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 직원이니까 잘 **알 거야** | ✓ |
| 3 | Lobby | C `lobby_chat` | 2층에 뭐가 있는지도 **알려**줄 거야 | ✓ |

---

### 144. 모르다 — to not know

*The irregular opposite of 알다. 몰라, 모르면, 모릅니다.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_book | **모르**시면 사서에게 물어보세요 | ✓ |
| 2 | Salon | N `salon_staff` ask_crafts | **모르**면 편하게 물어보세요 | ✓ |
| 3 | House | C `house_welcome_chat` | 아직 **몰라** → 직접 물어봐! |✓ |

---

## Tier 15 — Core Adjectives (145–154)

**Teaching note**: Korean adjectives work differently from English ones: they can
end sentences directly (좋아요, 작아요) without a separate "to be" verb. This tier
teaches the 10 most useful adjectives in the game world, many of which are already
the base forms of adverbs taught in the first 100 (조용히 → 조용하다, 따뜻하게 → 따뜻하다).

---

### 145. 좋다 — to be good / nice / to like

*좋다 → 좋아요, 좋아!, 좋겠다, 좋은. One of the highest-frequency Korean words.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | N `house_resident` ask_house | 따뜻해서 너무 **좋아요**~ | ✓ |
| 2 | Play Area | N `play_staff` birthday | 어린이들과 함께 축하할 수 있어서 **좋아요** | ✓ |
| 3 | Outdoor | C `outdoor_chat` | 오늘 같이 가줄래? → **좋아**! | ✓ |

---

### 146. 넓다 — to be wide / spacious

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_chat` | 여기 공원 정말 **넓다**! | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 전시관이 **넓어서** 다 보려면 시간이 걸려 |✓ |
| 3 | Lobby | N `receptionist` greeting | 건물이 **넓**으니 안내 데스크에서 물어보세요 |✓ |

---

### 147. 작다 — to be small / little

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | **작은** 아이들은 보호자와 함께 해야 하는 거 아냐? | ✓ |
| 2 | Salon | C `salon_craft_chat` | 나는 **작은** 상자 만들어볼까 해 | ✓ |
| 3 | Play Area | N `play_staff` ask_age | 3살부터 6살까지의 **작은** 어린이가 대상이에요 |✓ |

---

### 148. 많다 — to be many / much

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_book | 학생들이 **많이** 찾는 책도 있어요 | ✓ |
| 2 | Outdoor | C `outdoor_chat` | 공원에 사람이 **많다**! |✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | 전시품이 **많아서** 천천히 보세요 |✓ |

---

### 149. 재미있다 — to be fun / interesting

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | C `cooking_lesson_chat` | 요리하면 **재미있**겠지? | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **재미있는** 얘기 해줄 거야 | ✓ |
| 3 | Salon | N `salon_staff` ask_crafts | 연습하면 **재미있**을 거예요 |✓ |

---

### 150. 조용하다 — to be quiet

*Base form of 조용히 (adverb, word 86 in first 100). Teaches how -히 adverbs
derive from -하다 adjectives.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | 관내에서 **조용히** 해 주세요 → 기본형: **조용하다** | ✓ |
| 2 | Library | N `librarian` ask_quiet | **조용히** 해 주세요 → 이 공간은 **조용한** 공간이에요 |✓ |
| 3 | Library | C `library_study_chat` | 알겠어. **조용히** 공부하자 | ✓ |

---

### 151. 따뜻하다 — to be warm

*Base form of 따뜻하게 (adverb, word 87 in first 100).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | N `house_resident` ask_house | **따뜻하게** 쉬세요 | ✓ |
| 2 | House | N `house_resident` ask_kotatsu | **따뜻해서** 너무 좋아요~ | ✓ |
| 3 | House | C `house_welcome_chat` | 코타츠도 있어서 **따뜻하게** 지내기 좋다 | ✓ |

---

### 152. 괜찮다 — to be okay / fine

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` ask_shoes | 양말은 그대로 **괜찮아**요 | ✓ |
| 2 | Library | N `librarian` fallback | 아니에요, **괜찮아**요. 무엇이든 도움이 필요하시면 | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **괜찮아**! 아이와 어른이 함께 하면 재미있을 거야 | ✓ |

---

### 153. 바쁘다 — to be busy

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | N `cook` fallback | 죄송해요, 지금 손이 좀 **바빠서**요 | ✓ |
| 2 | Cooking Room | N `cook` ask_cooking | 카레라이스 만들고 있어요! → 요즘 **바빠요** |✓ |
| 3 | Library | N `librarian` ask_job | 책 정리나 대출 처리가 주 업무예요 → **바쁜** 일이에요 |✓ |

---

### 154. 상쾌하다 — to be refreshing / fresh

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | N `outdoor_guide` greeting | 바깥 공기가 **상쾌**하죠? | ✓ |
| 2 | Street | C or N | 오늘 날씨가 **상쾌하**네요! |✓ |
| 3 | Outdoor | C `outdoor_chat` | 공원에 오니까 **상쾌하다**! |✓ |

---

## Tier 16 — Spatial & Building Language (155–163)

**Teaching note**: This tier completes the player's spatial vocabulary for navigating
the building. Words 155–160 form a three-dimensional set of opposites; words 161–163
are specific to the 2-storey building layout. Note that 안 (inside, 157) is a
different word from 안 (negation, 127) — context distinguishes them.

---

### 155. 위 — above / on top / upstairs

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | N `gallery_curator` ask_play | 아래 놀이 공간도 즐거워요 → 여기는 **위층** | ✓ (implicit) |
| 2 | House | N `house_resident` ask_kitchen | 서랍 **위에** 차가 있어요 |✓ |
| 3 | Lobby | N `receptionist` ask_directions | 2층에 올라가세요 → **위층**에 있어요 |✓ |

---

### 156. 아래 / 밑 — below / under / downstairs

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | N `gallery_curator` ask_play | **아래** 놀이 공간도 즐거워요 | ✓ |
| 2 | Gallery | N `gallery_curator` ask_play | 여기서 계단으로 갈 수 있어요 → **아래층**으로 | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | 도마 **밑에** 행주를 깔아 주세요 |✓ |

---

### 157. 안 [spatial] — inside / interior

*Homonym of 안 (negation, word 127). 건물 안 = inside the building; 안 돼 = not okay.
A noun phrase before 안 = spatial; 안 before a verb = negation.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | N `outdoor_guide` ask_inside | 건물 **안**은 왼쪽 입구에서 들어가세요 | ✓ |
| 2 | Library | S `quiet_rule` | 관내에서 조용히 → 관 **안**에서 | ✓ (관내 = 관+내) |
| 3 | Salon | S `salon_food` | 살롱 내에서는 → 살롱 **안에서**는 | ✓ |

---

### 158. 밖 / 바깥 — outside / exterior

*바깥 is more formal; 밖 is more colloquial. Both refer to the same thing.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | N `outdoor_guide` greeting | **바깥** 공기가 상쾌하죠? | ✓ |
| 2 | Salon | C `salon_food_chat` | 음식은 **밖에서** 먹어야 해 |✓ |
| 3 | Library | N `librarian` ask_food | 음식은 **밖에서** 드세요 |✓ |

---

### 159. 앞 — in front / front side

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | 줄 서야 해 → 내 **앞에** 줄이 있어 |✓ |
| 2 | Lobby | N `receptionist` ask_directions | **앞으로** 가면 입구가 있어요 |✓ |
| 3 | House | S `house_entrance` | 현관 **앞에서** 신발을 벗어 주세요 |✓ |

---

### 160. 뒤 — behind / back

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | 내 **뒤에** 줄이 있어. 기다려 줘 |✓ |
| 2 | Library | N `librarian` ask_book | 서가 **뒤쪽에** 있을 수도 있어요 |✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | 저 **뒤에** 더 있어요. 천천히 보세요 |✓ |

---

### 161. 층 — floor / storey [as noun]

*층 is also a counter (1층, 2층) but here taught as a standalone noun.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_directions | 2**층**으로 올라가세요. 도서관과 어린이 살롱은 2**층**에 있습니다 | ✓ |
| 2 | Gallery | N `gallery_curator` ask_play | 아래 놀이 공간도 즐거워요. 여기서 계단으로 갈 수 있어요 → 아래 **층**으로 | ✓ |
| 3 | Lobby | N `receptionist` ask_directions | 완구 전시관은 1**층**입니다 | ✓ |

---

### 162. 왼쪽 — left side

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | N `outdoor_guide` ask_inside | **왼쪽** 입구에서 들어가세요 | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_inside | 출구도 **왼쪽**에 있어요 | ✓ |
| 3 | Lobby | N `receptionist` ask_directions | 나가실 때는 **왼쪽**으로 |✓ |

---

### 163. 오른쪽 — right side

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_directions (jp field) | 오른쪽으로 가세요 → **오른쪽**으로 가세요 | + (add to ko:) |
| 2 | Street | C or sign | 건물은 **오른쪽**에 있어요 |✓ |
| 3 | Gallery | N `gallery_curator` ask_toys | **오른쪽** 코너에 기차 모형이 있어요 |✓ |

---

## Tier 17 — Expanded Time Vocabulary (164–172)

**Teaching note**: The first 100 covered 오늘 (today), 저녁 (evening), the days of the
week (Saturday/Sunday), o'clock (시), and time ranges (부터/까지). This tier fills
the time vocabulary around those anchors: morning/afternoon/night, tomorrow/yesterday,
weekday/weekend, and time-as-duration (시간).

---

### 164. 아침 — morning / breakfast

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | N `cook` ask_cooking | 저녁이 되면 완성돼요 → **아침**부터 준비했어요 |✓ |
| 2 | House | C `house_welcome_chat` | **아침**에 일어나면 코타츠에서 따뜻하게 쉬자 |✓ |
| 3 | Lobby | N `receptionist` ask_hours | 오전 9시부터 → **아침** 9시부터 개관합니다 (paraphrase) |✓ |

---

### 165. 점심 — noon / lunch

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | C `cooking_lesson_chat` | **점심** 먹고 요리 교실에 왔어요 |✓ |
| 2 | Salon | C `salon_food_chat` | **점심**은 밖에서 먹어야 해 |✓ |
| 3 | House | N `house_resident` ask_food | 오늘 **점심**은 뭐예요? — 저녁은 카레라이스예요 |✓ |

---

### 166. 밤 — night

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | N `house_resident` ask_house | **밤**에는 코타츠에서 따뜻하게 쉬어요 |✓ |
| 2 | House | C `house_welcome_chat` | **밤**이 되면 별이 잘 보여요 |✓ |
| 3 | Outdoor | N `outdoor_guide` birthday | 칠석날 **밤**에 별에 소원을 빌어요 | ✓ (context) |

---

### 167. 내일 — tomorrow

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | 토요일에 또 와요 → **내일**도 개관해요? |✓ |
| 2 | Lobby | N `receptionist` ask_hours | **내일**도 같은 시간에 개관합니다 |✓ |
| 3 | Cooking Room | N `cook` ask_schedule | **내일**의 메뉴는 다를 수 있어요 |✓ |

---

### 168. 어제 — yesterday

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | C `gallery_explore_chat` | **어제** 오고 싶었는데 오늘 왔어 |✓ |
| 2 | House | C `house_welcome_chat` | **어제** 만든 카레라이스야 |✓ |
| 3 | Library | C `library_study_chat` | **어제** 이 책 찾았어? |✓ |

---

### 169. 주말 — weekend

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | C `gallery_explore_chat` | 토요일이랑 일요일에만 개관한대 → **주말**에만 열려 | ✓ (토/일 already there, 주말 rephrases it) |
| 2 | Gallery | N `gallery_curator` ask_exhibits | **주말**에만 열려요 |✓ |
| 3 | Lobby | N `receptionist` ask_hours | **주말**에는 방문객이 많아요 |✓ |

---

### 170. 평일 — weekday

*Contrast with 주말. Gallery is closed on weekdays; this contrast teaches both words.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | C `gallery_explore_chat` | 전시관은 **평일**에는 문을 닫아요 |✓ |
| 2 | Gallery | N `gallery_curator` ask_hours | **평일**에는 개관하지 않아요 |✓ |
| 3 | Lobby | N `receptionist` ask_hours | **평일**에도 방문하실 수 있어요 |✓ |

---

### 171. 매일 — every day

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` birthday | **매년** 새해와 함께 축하할 수 있어서 (매 = every, connects to 매일) | ✓ |
| 2 | Library | N `librarian` ask_job | 도서관 업무를 **매일** 하고 있어요 |✓ |
| 3 | Cooking Room | N `cook` ask_cooking | **매일** 새로운 메뉴를 만들어요 |✓ |

---

### 172. 시간 — time [as duration or noun, not o'clock]

*Contrast with 시 (o'clock, word 97). 9시 = 9 o'clock; 시간이 걸려요 = it takes time.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | N `gallery_curator` greeting | 천천히 둘러보세요 → **시간**을 내서 봐 주세요 |✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 얼마나 기다려야 해? → **시간**이 걸려요 |✓ |
| 3 | Lobby | N `receptionist` ask_hours | 영업 **시간**은 오전 9시부터 오후 5시까지예요 |✓ |

---

## Tier 18 — Social Scripts & Expressions (173–183)

**Teaching note**: These are the expressions that oil social interaction. The game's
NPCs already use most of them. Learning these as fixed phrases first, then understanding
their grammatical structure, is the most efficient path for beginners.

---

### 173. 감사합니다 — thank you [formal]

*감사 (感謝) = gratitude; -합니다 = formal verb ending. Contrast with 고마워요 (174).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_quiet | **감사합니다**. 학생 여러분, 관내에서는 조용히 | ✓ |
| 2 | House | N `house_resident` birthday | **고마워요**! 정말 기뻐요 (informal form, contrast) | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 레시피 알려줘서 **감사해요** |✓ |

---

### 174. 고마워(요) — thanks [casual/polite]

*Plain form 고마워; polite form 고마워요; formal is 감사합니다 (173).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | **고마워**. 그런데 여기 통화하면 안 되지? | ✓ |
| 2 | House | N `house_resident` birthday | **고마워요**! 정말 기뻐요 | ✓ |
| 3 | Salon | C `salon_food_chat` | ありがとう! 다행이다 → 한국어로는 **고마워**! | ✓ (the ありがとう line) |

---

### 175. 죄송합니다 / 죄송해요 — I'm sorry [formal]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` fallback | **죄송합니다**. 무엇을 도와드릴까요? | ✓ |
| 2 | Library | N `librarian` fallback | **죄송해요**, 잘 이해하지 못했어요 | ✓ |
| 3 | Salon | N `salon_staff` fallback | **죄송해요**, 조금 더 천천히 말씀해 주실 수 있어요? | ✓ |

---

### 176. 미안해(요) — sorry [casual/polite]

*Less formal than 죄송합니다. Used between friends or with children.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` fallback | **미안해요**, 다시 한번 말해 줄 수 있어요? | ✓ |
| 2 | House | N `house_resident` fallback | **미안해요**, 다시 한번 말해줄 수 있어요? | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | **미안**! 내 차례인 줄 알았어 |✓ |

---

### 177. 실례합니다 — excuse me [polite interruption]

*Used when interrupting someone or asking for attention. 실례 (失禮) = rudeness.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | C `lobby_chat` | **실례합니다**, 여기가 안내 데스크인가요? |✓ |
| 2 | Library | C `library_study_chat` | **실례해요**, 이 책 제가 봐도 될까요? |✓ |
| 3 | Gallery | C `gallery_explore_chat` | **실례합니다**, 큐레이터님! 질문이 있어요 |✓ |

---

### 178. 잠깐(만요) — just a moment / wait

*잠깐 = briefly; 잠깐만요 = please wait just a moment.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | **잠깐**, 줄 서야 해 | ✓ |
| 2 | Cooking Room | N `cook` fallback | **잠깐만요**, 지금 손이 좀 바빠서요 | ✓ (paraphrase) |
| 3 | Gallery | C `gallery_explore_chat` | **잠깐**, 저기 큐레이터한테 물어보자! |✓ |

---

### 179. 괜찮아요 — it's okay / are you okay?

*Both a reassurance (it's fine) and a question (are you all right?). Tone distinguishes them.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` fallback | 아니에요, **괜찮아요** | ✓ |
| 2 | Play Area | N `play_staff` ask_shoes | 양말은 그대로 **괜찮아요** | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **괜찮아**! 아이와 어른이 함께 하면 재미있을 거야 | ✓ |

---

### 180. 환영합니다 — welcome [formal]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` greeting | 방문객 여러분을 **환영합니다** | ✓ |
| 2 | Gallery | N `gallery_curator` greeting | 완구 전시관에 오신 것을 **환영합니다** | ✓ |
| 3 | Salon | N `salon_staff` greeting | 어린이 살롱 공간에 오신 것을 **환영해요** | ✓ |

---

### 181. 잘 부탁드립니다 — pleased to meet you / I'm in your care

*A fixed social phrase expressing reliance or goodwill. 잘 = well, 부탁 = request/favor, 드립니다 = humble giving.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` greeting | 오늘도 **잘 부탁드립니다** | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 요리 교실 처음인데 **잘 부탁해요**! |✓ |
| 3 | Lobby | C `lobby_chat` | 직접 인사하면서 물어보면 친절하게 알려줄 거야 → **잘 부탁드립니다**라고 해봐 |✓ |

---

### 182. 그렇군요 / 그렇구나 — I see / oh, is that so

*Expresses new understanding. 그렇군요 = polite; 그렇구나 = casual. Both from 그렇다 (to be like that).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 아, **그렇군요**! 음식물 섭취도 안 되는 건가요? | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **그렇구나**. 오늘 마감 전에 와서 다행이다! | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 아, 맞아. **그렇구나** — 차례차례 해야 하는구나 | ✓ |

---

### 183. 다시 — again / once more

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` fallback | **다시** 한번 말씀해 주시겠어요? | ✓ |
| 2 | Play Area | N `play_staff` fallback | **다시** 한번 말해 줄 수 있어요? | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | また やろう！ → 한국어로 **다시** 하자! | ✓ |

---

## Tier 19 — Numbers & Counters (184–193)

**Teaching note**: Korean has two number systems: Sino-Korean (일/이/삼…) used for
dates, floors, times, and money; and native Korean (하나/둘/셋…) used for counting
objects, age (up to 99), and expressing quantity colloquially. The player has already
seen Sino-Korean numbers embedded in times and dates throughout the game.

---

### 184. 일/이/삼/사/오 (1–5 Sino-Korean)

*These already appear in dates and floor numbers throughout the NPC birthdays.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` birthday | **1**월 **1**일이에요 (일월 일일) | ✓ |
| 2 | Salon | N `salon_staff` birthday | **3**월 **3**일이에요 → **삼**월 **삼**일 | ✓ |
| 3 | Play Area | N `play_staff` birthday | **5**월 **5**일, 어린이날 → **오**월 **오**일 | ✓ |

---

### 185. 육/칠/팔/구/십 (6–10 Sino-Korean)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_yield` | **7**살 이상은 → **칠** 살 이상 | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 오전 **9**시부터 오후 **5**시까지 → **구**시 | ✓ |
| 3 | Gallery | S `gallery_trains` | **10**시〜**17**시 개관 → **십**시, **십칠**시 | ✓ |

---

### 186. 오전 / 오후 — AM / PM

*오전 = before noon (午前); 오후 = after noon (午後). Sino-Korean compounds.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_hours | **오전** 9시부터 **오후** 5시까지 개관합니다 | ✓ |
| 2 | Gallery | S `gallery_trains` | 10시〜17시 개관 → **오전** 10시부터 **오후** 5시 | ✓ |
| 3 | Lobby | C `lobby_chat` | **오전**에 방문하는 게 좋아? **오후**에는 사람이 더 많아 |✓ |

---

### 187. 하나/둘/셋/넷/다섯 (1–5 native Korean)

*Native Korean counting words, used for counting objects and colloquial quantity.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` ask_age | 이 공간에는 아이들이 **몇** 명 있어요? **다섯** 명 정도요 |✓ |
| 2 | Cooking Room | N `cook` ask_cooking | 재료가 **셋** 있어요 — 당근, 감자, 양파 |✓ |
| 3 | Salon | C `salon_craft_chat` | **하나**, **둘**, **셋** — 만들었어! |✓ |

---

### 188. 여섯/일곱/여덟/아홉/열 (6–10 native Korean)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3살부터 6살 → 세 살부터 **여섯** 살까지 (spoken form) |✓ |
| 2 | Outdoor | S `outdoor_yield` | 7살 이상 → **일곱** 살 이상 (spoken form) |✓ |
| 3 | Gallery | S `gallery_trains` | **열** 시부터 개관 (10시 = 열 시 in native Korean) |✓ |

---

### 189. 개 — counter for objects [general]

*개 follows a number: 하나 → 한 개, 둘 → 두 개. Used for most concrete objects.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | N `cook` ask_cooking | 당근 세 **개** 넣어요 |✓ |
| 2 | Gallery | C `gallery_explore_chat` | 전시품이 몇 **개** 있어요? |✓ |
| 3 | Salon | C `salon_craft_chat` | 상자 한 **개** 만들었어! |✓ |

---

### 190. 명 — counter for people

*명 follows a number: 한 명, 두 명, 세 명.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` ask_supervision | 어른 한 **명**이 함께 있어야 해요 |✓ |
| 2 | Outdoor | N `outdoor_guide` ask_zipline | 짚라인은 한 **명**씩 이용하세요 | ✓ (한 명씩 in original) |
| 3 | Lobby | C `lobby_chat` | 안내 직원이 몇 **명** 있어요? |✓ |

---

### 191. 권 — counter for books

*권 follows a number: 책 한 권, 두 권.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 교과서 한 **권** 찾고 있어 |✓ |
| 2 | Library | N `librarian` ask_book | 원하시는 책 한 **권** 찾아드릴게요 |✓ |
| 3 | Library | O `bookshelf_obj` lore | 책 두 **권**을 빌릴 수 있어요 |✓ |

---

### 192. 번 — ordinal / instance counter

*번 is used for ordered items (1번, 2번 = first, second) and for number of times (한 번 = once, 두 번 = twice).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` fallback | 다시 한 **번** 말씀해 주시겠어요? | ✓ |
| 2 | Play Area | N `play_staff` fallback | 다시 한 **번** 말해 줄 수 있어요? | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 한 **번** 더 타고 싶어! |✓ |

---

### 193. 살 vs 세 — native vs Sino-Korean age counters

*살 (word 63, first 100) is native Korean for age in speech. 세 (歲) is the Sino-Korean form, used in formal or written contexts.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3**살**부터 6**살**까지 | ✓ (살, from first 100) |
| 2 | Outdoor | S `outdoor_yield` | 7**살** 이상은 → 만 7**세** 이상 (formal alternate) |✓ |
| 3 | Play Area | N `play_staff` ask_age | 3**살**이에요? 이 공간에서 놀 수 있어요! | ✓ |

---

## Tier 20 — Sino-Korean Morpheme Recognition (194–200)

**Teaching note**: Korean vocabulary is ~60% Sino-Korean. A small number of high-frequency
morphemes unlock many new words at once. This tier picks 7 morphemes that each appear
in at least two words already in the curriculum — letting the player see patterns across
the vocabulary they've already learned.

For each entry, the table shows the morpheme in known words first, then new target words
it unlocks.

---

### 194. 실 (室) — room [building unit]

*Already seen in 요리실 (word 51). Appears in everyday places the player recognizes.*

| Known word | New words unlocked |
|---|---|
| 요리실 (cooking room, #51) | 화장실 (bathroom), 교실 (classroom), 대기실 (waiting room) |

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_welcome` | **요리실**에 어서 오세요! | ✓ |
| 2 | All | N any NPC fallback | 화장**실**은 어디에 있어요? |✓ |
| 3 | Play Area | C or N | 교**실** 느낌이 나네요! |✓ |

---

### 195. 자 (者) — person [doer suffix]

*Already seen in 이용자 (word 64). Identifies who performs or experiences an action.*

| Known word | New words unlocked |
|---|---|
| 이용자 (user/rider, #64) | 방문자 (visitor), 독자 (reader), 작가 (author/maker), 담당자 (person in charge) |

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 짚라인 이용**자**가 지나가요 | ✓ |
| 2 | Lobby | N `receptionist` ask_membership | 담당**자**에게 연락해 드릴게요 |✓ |
| 3 | Library | O `bookshelf_obj` lore | 독**자**들이 검색해서 찾아요 |✓ |

---

### 196. 물 (物) — thing / substance [object suffix]

*Already seen in 음식물 (food items, word 70). Identifies a category of objects.*

| Known word | New words unlocked |
|---|---|
| 음식물 (food/drink, #70) | 물건 (thing/object), 선물 (gift), 인물 (person/figure), 금지물 (prohibited item) |

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | 음식**물** 섭취는 금지 | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | 금지**물**을 가져오지 마세요 |✓ |
| 3 | House | N `house_resident` birthday | 선**물**이에요! 같이 먹어요 |✓ |

---

### 197. 간 (間) — between / interval / space

*Appears in 공간 (word 54) and 시간 (word 172). Also in 기간, 중간, 사이.*

| Known word | New words unlocked |
|---|---|
| 공간 (space, #54), 시간 (time, #172) | 기간 (period), 중간 (middle), 사이 (between/among) |

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` greeting | 이 공**간**에서 즐겁게 놀아요 | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 영업 시**간**은 오전 9시부터요 | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | 개관 기**간** 동안 전시돼 있어요 |✓ |

---

### 198. 전 (專/前) — exclusive / before

*Appears in 전용 (word 30, exclusive-use) and 오전 (word 186, AM = before noon).
Also in 이전 (before), 전시 (exhibition = display in advance).*

| Known word | New words unlocked |
|---|---|
| 전용 (exclusively for, #30), 오전 (AM, #186) | 이전 (previous/before), 전시 (exhibition), 전문 (specialty/expert) |

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 도서관 업무 **전용**으로 사용해 주세요 | ✓ |
| 2 | Gallery | S `gallery_welcome` | 완구 **전시**관에 오신 것을 환영합니다 | ✓ |
| 3 | Lobby | N `receptionist` ask_hours | **오전** 9시부터 개관합니다 | ✓ |

---

### 199. 특별 (特別) — special

*특별한 (special) already appears in the receptionist's dialogue. It also bridges
Japanese (特別 tokuбэцу) for players studying both.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_events | 오늘은 **특별한** 행사는 없지만, 모든 시설을 이용하실 수 있어요 | ✓ |
| 2 | Gallery | N `gallery_curator` ask_hours | 주말에만 열리는 **특별한** 전시관이에요 |✓ |
| 3 | Cooking Room | N `cook` ask_cooking | 오늘은 **특별한** 메뉴예요! |✓ |

---

### 200. 안전 (安全) — safety / safe

*안전하게 돌아가세요 already in the receptionist farewell. Bridges Japanese 安全 (anzen)
for players who have studied both languages. A fitting final word: the game's world
begins at the entrance and this word escorts the player home safely.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` farewell | **안전하게** 돌아가세요 | ✓ |
| 2 | Outdoor | S `outdoor_safety` | **안전**하게 이용해 주세요 | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | **안전** 제일! 어른과 함께 하세요 | ✓ |

---

## Pedagogical Notes — Words 101–200

### Connective grammar vs vocabulary

Tiers 11 and 13 teach grammatical patterns rather than content words. The approach
mirrors the first curriculum's handling of particles (Tier 1) and polite endings
(Tier 3): treat them as vocabulary items that have fixed forms and consistent meaning.
The player sees them as lexical chunks (-(으)면 = "if"; -고 싶다 = "want to") before
decomposing them grammatically.

### The 안 homonym problem

안 appears twice: as a negation adverb (#127, before a verb) and as a spatial noun
(#157, after a noun). Both are common enough to teach in the first 200 words. Signal
which sense is active:
- V를 안 해요 = "I don't do V" (negation)
- N 안에 있어요 = "It's inside N" (spatial)

### Adjective-adverb pairs

Several adjectives in Tier 15 are the base forms of adverbs already in the first 100:
- 조용하다 (#150) → 조용히 (#86)
- 따뜻하다 (#151) → 따뜻하게 (#87)
- 사이좋다 (implicitly) → 사이좋게 (#48)

When the player encounters these adjectives, the game can surface the connection:
"You know 조용히 already — 조용하다 is its base form."

### Number system parallel

The Sino-Korean and native Korean number systems parallel the Korean-Japanese vocabulary
split the player has already experienced. Just as 도서관 and 書棚 coexist in the library,
일/이/삼 and 하나/둘/셋 coexist in age counting (살vs세), object counting (개), and time.
The strategy: anchor Sino-Korean numbers in signs (which use formal notation) and native
Korean numbers in conversations (which use spoken forms).

### Morpheme recognition as the multiplier

The final tier demonstrates a learning leverage point: a player who knows 자 (者) can
correctly guess that 독자 means "reader," 담당자 means "person in charge," and 이용자
(already known from word 64) means "user." Each morpheme in Tier 20 unlocks 3–6
additional words for free. This is the highest-ROI strategy for intermediate Korean
vocabulary acquisition.

### Cross-language connections (Japanese learners)

Many Tier 20 words have transparent Japanese equivalents:
- 안전 (安全) = 安全 (anzen in Japanese)
- 특별 (特別) = 特別 (tokubetsu)
- 전용 (專用) = 専用 (senyou)
- 시간 (時間) = 時間 (jikan)
- 공간 (空間) = 空間 (kuukan)

For a player who has studied Japanese, recognizing these as cognates dramatically
reduces the learning burden of the Korean vocabulary.
