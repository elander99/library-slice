# Vocabulary Curriculum — Korean 100-Word Plan

Each word appears **three times** in the world, across different rooms and media.

## Why Korean needs a different tier structure

Japanese and Korean share Tier 3–5 vocabulary (rules, people, objects) but differ
fundamentally at the grammatical level. Korean's most important teaching targets are:

1. **Particle alternation** — every particle has two forms depending on whether the
   preceding syllable ends in a consonant or vowel. This is not a meaning distinction;
   it is a phonological one. Learning this rule is more important than memorising
   either form in isolation.

2. **에 vs 에서** — both translate as "at/in" but 에 marks destination or static
   location, while 에서 marks where an action takes place. This contrast appears on
   signs in the very first rooms the player visits.

3. **Polite endings** — Korean expresses politeness through verb endings, not separate
   honorific vocabulary. 주세요, 마세요, 하세요, 입니다, 합니다 each pattern with a
   verb stem and the player encounters all of them on the game's signs.

The tier structure below leads with these three before moving to content vocabulary.

---

## Media Key

| Code | Meaning |
|------|---------|
| **S** | Wall sign (Korean text, player clicks token) |
| **C** | Ambient conversation (already in Korean) |
| **N** | NPC name label / NPC dialogue (ko fields) |
| **O** | Scene object / lore hotspot |
| ✓ | Already exists in content |
| + | Needs to be added |

## Player Path

```
Street → Lobby → Play Area → Library → Salon → Outdoor → House
                    ↕                      ↕
                 Gallery              Cooking Room
```

---

## Tier 1 — Topic / Subject / Object Particle Pairs (words 1–12)

**Teaching note**: Each pair is one learning item, not two. The rule is:
- after a consonant-final syllable → first form (은, 이, 을, 과, 으로)
- after a vowel-final syllable → second form (는, 가, 를, 와, 로)

The player should see both forms of each pair before considering it learned.

---

### 1. 은/는 — topic particle

*은 after consonant (음식물 반입**은**), 는 after vowel (메뉴**는**).*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Salon | S `salon_food` | 음식물 반입**은** 삼가 (consonant-final) | ✓ |
| 2 | Cooking Room | S `cooking_schedule` | 메뉴**는** 카레라이스 (vowel-final) | ✓ |
| 3 | Library | C `library_study_chat` | 휴대전화 통화**는** 삼가 주세요 | ✓ |

*Both forms appear in content — contrast is teach-able from existing signs.*

---

### 2. 이/가 — subject particle

*이 after consonant, 가 after vowel.*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 이용자**가** 지나가요 (vowel-final) | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 내 차례**야** → 아직 기다리고 있잖아 (natural subject) | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시품**이**라서 만지지 마 (consonant-final) | ✓ |

---

### 3. 을/를 — object particle

*을 after consonant (신발**을**), 를 after vowel (어린이**를**).*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Play Area | S `play_shoes` | 신발**을** 벗어 주세요 (consonant-final) | ✓ |
| 2 | Play Area | S `play_age` | 어린이**를** 위한 공간 (vowel-final) | ✓ |
| 3 | Cooking Room | S `cooking_safety` | 칼이나 불**을** 사용할 때는 (consonant-final) | ✓ |

---

### 4. 과/와 — and / with

*과 after consonant (어른**과**), 와 after vowel.*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Play Area | S `play_supervision` | 어른**과** 함께 (consonant-final) | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 아이**와** 어른이 함께 하면 (vowel-final) | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 보호자**와** 함께 해야 하는 거 아냐? (vowel-final) | ✓ |

---

### 5. 으로/로 — by / toward / as

*으로 after consonant (전용**으로**), 로 after vowel or ㄹ.*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Library | S `outlet_rule` | 전용**으로** 사용해 주세요 (consonant-final) | ✓ |
| 2 | Lobby | N `receptionist` ask_directions | 오른쪽**으로** 가세요 | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_inside | 왼쪽 입구**로** 들어가세요 (vowel-final) | ✓ |

---

### 6. 이나/나 — or

*이나 after consonant (칼**이나**), 나 after vowel.*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Cooking Room | S `cooking_safety` | 칼**이나** 불을 사용할 때는 | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 칼**이나** 불 조심하면 돼 | ✓ |
| 3 | Salon | C `salon_food_chat` | 음식**이나** 음료 반입은 삼가야 해 | ✓ |

---

### 7. 의 — possessive

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Cooking Room | S `cooking_schedule` | 오늘**의** 메뉴는 | ✓ |
| 2 | Lobby | S `lobby_reception` | 오늘**의** 접수는 마감 | ✓ |
| 3 | House | N `house_resident` | 오늘**의** 저녁 | ✓ response |

---

### 8. 에게 — to / toward (person)

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Outdoor | S `outdoor_yield` | 어린 아이**에게** 양보해 주세요 | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 어린 아이**에게** 양보해야 해 | ✓ |
| 3 | Play Area | N `play_staff` ask_supervision | 아이**에게** 맞는 공간입니다 | ✓ |

---

### 9. 부터 — from (starting point)

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Play Area | S `play_age` | 3살**부터** 6살까지 | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 오전 9시**부터** 오후 5시까지 | ✓ |
| 3 | Gallery | S `gallery_trains` | 10시**부터** 17시까지 개관 | ✓ |

---

### 10. 까지 — until / up to

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Play Area | S `play_age` | 3살부터 6살**까지** | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 오후 5시**까지** 개관 | ✓ |
| 3 | Gallery | S `gallery_trains` | 17시**까지** 개관 | ✓ |

---

### 11. 도 — also / too

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Salon | C `salon_food_chat` | 물**도** 마셔도 돼 (water too) | ✓ |
| 2 | Library | C `library_study_chat` | 카탈로그**도** 있어 | ✓ |
| 3 | House | C `house_welcome_chat` | 코타츠**도** 있어서 따뜻하게 지내기 좋다 | ✓ |

*도 is extremely frequent; adding it to 3 conversations is low effort.*

---

### 12. 만 — only

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Gallery | C `gallery_explore_chat` | 토요일이랑 일요일**에만** 개관 | ✓ |
| 2 | Library | S `outlet_rule` | 전용**으로만** 사용해 주세요 | ✓ |
| 3 | Salon | S `salon_food` | 수분 보충**만** 가능합니다 | ✓ |

---

## Tier 2 — Location Particles: 에 vs 에서 (words 13–16)

This pair deserves its own mini-tier because the semantic distinction is the single most
common confusion point for Korean learners who have studied Japanese (where に and で
map onto 에 and 에서 respectively, but differently).

**Rule**:
- **에** = static location (something exists/is there) OR destination (going to)
- **에서** = dynamic location (action happens there)

---

### 13. 에 — at (destination / existence)

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Cooking Room | S `cooking_welcome` | 요리실**에** 어서 오세요 (destination) | ✓ |
| 2 | Gallery | S `gallery_dolls` | 인형 코너**에** 어서 오세요 (destination) | ✓ |
| 3 | Lobby | N `receptionist` ask_directions | 2층**에** 있습니다 (existence) | ✓ |

---

### 14. 에서 — at (location of action)

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | Library | S `quiet_rule` | 관내**에서** 조용히 해 주세요 (action) | ✓ |
| 2 | House | S `house_kotatsu` | 코타츠**에서** 따뜻하게 지내요 (action) | ✓ |
| 3 | Library | C `library_study_chat` | 카탈로그**에서** 검색해봐 (action) | ✓ |

---

### 15. 에 vs 에서 (contrast drill)

*This word slot is a teaching note, not a new word — it flags where the contrast
should be made explicit in the player's encounter sequence.*

| # | Room | Medium | Teaching moment | Status |
|---|------|--------|----------------|--------|
| 1 | Cooking Room → Library | S both | 요리실**에** 오세요 then 관내**에서** 조용히 | ✓ both |
| 2 | House | S `house_kotatsu` + `house_entrance` | **에서** 지내요 vs 신발**을** | ✓ |
| 3 | Gallery | S `gallery_dolls` + ambient | 코너**에** 오세요 vs 관내**에서** | ✓ |

*These contrasting pairs should appear in the same room or adjacent rooms where possible.*

---

### 16. 에서 — from (place of origin)

*에서 has a second use: the origin of movement ("from a place"). This is the same particle but a different sense.*

| # | Room | Medium | Demonstrates | Status |
|---|------|--------|-------------|--------|
| 1 | House | C `house_welcome_chat` | 요리실**에서** 만들었어 (made from/in) | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_inside | 왼쪽 입구**에서** 들어가요 | ✓ |
| 3 | Lobby | N `receptionist` ask_directions | 1층**에서** 2층으로 | ✓ |

---

## Tier 3 — Polite Endings (words 17–28)

Korean politeness is grammatical — the verb ending determines register, not a separate
word. The player encounters the 합니다체 (formal written) on signs and the 해요체
(spoken polite) in conversations.

---

### 17. 주세요 — please do [V-아/어 주세요]

*The most frequent polite request form on the signs.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_shoes` | 벗어 **주세요** | ✓ |
| 2 | Library | S `quiet_rule` | 조용히 해 **주세요** | ✓ |
| 3 | Salon | S `salon_share` | 사용해 **주세요** | ✓ |

*주세요 appears on nearly every sign — well covered.*

---

### 18. 마세요 — please don't [V-지 마세요]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_care` | 만지지 **마세요** | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 만지지 마 (casual form) | ✓ |
| 3 | Library | S `quiet_rule` | 통화하지 **마세요** | ✓ |

---

### 19. 하세요 — please do [honorific imperative V-하세요]

*Distinct from 주세요: used with action-noun compounds like 조심, 주의.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 주의**하세요**! | ✓ |
| 2 | Cooking Room | S `cooking_safety` | 조심**하세요**! | ✓ |
| 3 | Lobby | N `receptionist` greeting | 이용**하세요** (please use) | ✓ |

---

### 20. 오세요 — please come [V-오세요, honorific of 오다]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_welcome` | 어서 **오세요**! | ✓ |
| 2 | Gallery | S `gallery_dolls` | 어서 **오세요**! | ✓ |
| 3 | House | S `house_entrance` | 어서 **오세요** | ✓ |

---

### 21. 입니다 — is / am / are [formal copula, after noun]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | 카레라이스**입니다** | ✓ |
| 2 | House | S `house_kitchen` | 카레라이스**입니다** | ✓ |
| 3 | Play Area | S `play_age` | 어린이를 위한 공간**입니다** | ✓ |

---

### 22. 합니다 — does / is [formal verb ending, after V-stem]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | 가능**합니다** | ✓ |
| 2 | Lobby | N `receptionist` greeting | 도와드릴까요? (합니다체 register) | ✓ |
| 3 | Lobby | S `lobby_reception` | 마감되었**습니다** | ✓ |

---

### 23. 있습니다 — there is / exists [formal]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | 금지되어 **있습니다** | ✓ |
| 2 | Lobby | N `receptionist` ask_directions | 2층에 **있습니다** | ✓ |
| 3 | Library | C `library_study_chat` | 저쪽에 **있어** (casual form) | ✓ |

*Contrast formal 있습니다 (sign) vs casual 있어 (conversation) is already there.*

---

### 24. 요 — polite sentence-ending particle

*Added to verb stems to make them polite without the full 합니다 register.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 지나가**요** | ✓ |
| 2 | House | S `house_kotatsu` | 지내**요** | ✓ |
| 3 | Salon | C `salon_food_chat` | 그렇군**요**! 음식물 섭취도 안 되는 건가**요**? | ✓ |

---

### 25. 때는 — when / at the time of [V-(으)ㄹ 때는]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_safety` | 사용할 **때는** 조심하세요 | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 칼 사용할 **때** 주의해야겠다 | ✓ |
| 3 | Play Area | N `play_staff` ask_rules | 뛸 **때는** 조심해 | ✓ |

---

### 26. 아/어도 돼요 — it's okay to / may [permission form]

*Seen in conversations; important for understanding the salon food rule.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 물은 마셔**도 돼** | ✓ |
| 2 | Salon | C `salon_food_chat` | 간식 먹어**도 될까** | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 기다려**도 돼**, 같이 있자 | ✓ |

---

### 27. 지? — right? / isn't it? [confirmation-seeking ending]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 통화하면 안 되**지**? | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 차례차례 해야 하는구나 (related) | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 재미있겠**지**? | ✓ |

---

### 28. (으)ㄹ게요 — I will / I'll do [volitional]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 음식은 나중에 먹**을게** | ✓ |
| 2 | Library | C `library_outlet_chat` | 그렇게 할**게** | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 같이 기다리**자** (related intent) | ✓ |

---

## Tier 4 — Rules & Behavior Vocabulary (words 29–48)

---

### 29. 금지 (geunji) — prohibited

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | 섭취는 **금지**되어 있습니다 | ✓ |
| 2 | Library | N `librarian` ask_food | **금지**입니다 | ✓ |
| 3 | Library | C `library_outlet_chat` | 그냥 쓰면 **금지**야 | ✓ |

---

### 30. 전용 (jeonyong) — exclusively for / reserved for

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 도서관 업무 **전용**으로 | ✓ |
| 2 | Library | C `library_outlet_chat` | 도서관 업무 **전용**으로 사용해 주세요 | ✓ |
| 3 | Library | N `librarian` ask_outlet | 업무 **전용** | ✓ |

---

### 31. 가능 (ganeung) — possible / allowed / okay

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | 수분 보충은 **가능**합니다 | ✓ |
| 2 | Salon | C `salon_food_chat` | 수분 보충은 **가능**하대 | ✓ |
| 3 | Library | C `library_outlet_chat` | **가능**하면 좋겠다! | ✓ |

---

### 32. 삼가 (samga) — refrain / hold back [삼가다]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | 음식물 반입은 **삼가** 주세요 | ✓ |
| 2 | Library | S `quiet_rule` | 통화는 **삼가** 주세요 | ✓ |
| 3 | Salon | C `salon_food_chat` | 음식물 반입은 **삼가야** 해 | ✓ |

---

### 33. 주의 (juui) — caution / watch out

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | **주의**하세요! | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | **주의**가 필요해요 | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | **주의**해 주세요 | ✓ |

---

### 34. 조심 (josim) — carefulness / be careful [조심하다]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_safety` | **조심**하세요! | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 칼이나 불 **조심**하면 돼 | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 칼 사용할 때 **주의**해야겠다 (near-synonym) | ✓ |

---

### 35. 양보 (yangbo) — give way / yield

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_yield` | 어린 아이에게 **양보**해 주세요 | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 어린 아이에게 **양보**해야 해 | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_rules | **양보**해 주세요 | ✓ |

---

### 36. 차례차례 (charyecharye) — in turns [reduplication]

*Teaching note: 차례 (turn) doubled = the action repeated, a native Korean pattern.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_share` | **차례차례** 사이좋게 사용해 주세요 | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 차례차례 해야 하는구나 | ✓ |
| 3 | Salon | N `salon_staff` ask_share | **차례차례** 사용해 주세요 | ✓ |

---

### 37. 반입 (banip) — bringing in / carrying in

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | 음식물 **반입**은 삼가 주세요 | ✓ |
| 2 | Salon | C `salon_food_chat` | 음식물 **반입**은 삼가야 해 | ✓ |
| 3 | Library | N `librarian` ask_food | 음식 **반입** 불가입니다 | ✓ |

---

### 38. 이상 (isang) — and over / above

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_yield` | 7살 **이상**은 | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 7살 **이상**은 양보해야 해 | ✓ |
| 3 | Play Area | N `play_staff` ask_age | 7살 **이상**은 양보를 | ✓ |

---

### 39. 개관 (gaegwan) — open (of a building)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | 토요일·일요일 **개관** | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 토요일이랑 일요일에만 **개관**한대 | ✓ |
| 3 | Lobby | N `receptionist` ask_hours | 오전 9시부터 **개관** | ✓ |

---

### 40. 마감 (magam) — closed / deadline reached

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_reception` | 오늘의 접수는 **마감**되었습니다 | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 오후 5시에 **마감**됩니다 | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 오늘 **마감** 전에 와서 다행이다! | ✓ |

---

### 41. 섭취 (seopchwi) — consumption / intake [food/drink]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | 음식물 **섭취**는 금지 | ✓ |
| 2 | Salon | C `salon_food_chat` | 반입도 **섭취**도 안 돼 | ✓ |
| 3 | Library | N `librarian` ask_food | **섭취**는 금지입니다 | ✓ |

---

### 42. 이용 (iyong) — use / utilization [이용하다]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 콘센트는 도서관 업무 전용으로 사용 (**이용**의 동의어) | ✓ (사용 variant) |
| 2 | Outdoor | S `outdoor_zipline` | 짚라인 **이용**자가 지나가요 | ✓ (in 이용자) |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | 짚라인을 **이용**하시려면 | ✓ |

---

### 43. 통화 (tonghwa) — phone call

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | 휴대전화 **통화**는 삼가 주세요 | ✓ |
| 2 | Library | C `library_study_chat` | 여기 **통화**하면 안 되지? | ✓ |
| 3 | Library | C `library_study_chat` | 휴대전화 **통화**는 삼가 주세요 | ✓ |

---

### 44. 업무 (eommu) — work / official business

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 도서관 **업무** 전용으로 | ✓ |
| 2 | Library | C `library_outlet_chat` | 도서관 **업무** 전용 | ✓ |
| 3 | Library | C `library_outlet_chat` | 공부는 **업무**에 포함될까? | ✓ |

---

### 45. 표지판 (pyojipan) — sign / notice board

*A meta-word — the game's own medium.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 저기 **표지판** 봐봐 | ✓ |
| 2 | Library | C `library_study_chat` | 저 **표지판** 봐봐 | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **표지판**에도 조심하세요! | ✓ |

---

### 46. 함께 (hamkke) — together

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | 어른과 **함께** | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 같이 기다리자 (**함께** synonym) | ✓ |
| 3 | House | C `house_welcome_chat` | 코타츠에서 **함께** 쉬자 | ✓ |

---

### 47. 검색 (geomsaek) — search / look up

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 카탈로그에서 **검색**해봐 | ✓ |
| 2 | Library | N `librarian` ask_book | 카탈로그에서 **검색**해 보세요 | ✓ |
| 3 | Library | O `bookshelf_obj` lore | **검색** for books in catalogue | ✓ |

---

### 48. 사이좋게 (saijokke) — friendly / nicely [getting along]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_share` | 차례차례 **사이좋게** 사용해 주세요 | ✓ |
| 2 | Salon | N `salon_staff` ask_share | **사이좋게** 사용해 주세요 | ✓ |
| 3 | Play Area | N `play_staff` ask_rules | 다른 아이들과 **사이좋게** 놀아요 | ✓ |

---

## Tier 5 — Places & Navigation (words 49–58)

---

### 49. 도서관 (doseogwan) — library [도서 books + 관 building]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **도서관** · 어린이 살롱 | ✓ |
| 2 | Library | S `outlet_rule` | **도서관** 업무 전용으로 | ✓ |
| 3 | Library | C `library_study_chat` | **도서관** 대화 (context) | ✓ |

*Parts 도서 + 관 should be surfaced here: 관 recurs in 전시관, 개관.*

---

### 50. 관내 (gwannae) — inside the building

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | **관내**에서 조용히 해 주세요 | ✓ |
| 2 | Library | S `food_rule` | **관내**에서 음식물 섭취는 | ✓ |
| 3 | Library | N `librarian` ask_food | **관내**에서는 금지입니다 | ✓ |

---

### 51. 요리실 (yorisil) — cooking room [요리 cooking + 실 room]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **요리실** · 완구 전시관 | ✓ |
| 2 | Cooking Room | S `cooking_welcome` | **요리실**에 어서 오세요! | ✓ |
| 3 | House | C `house_welcome_chat` | 카레라이스야! **요리실**에서 만들었어 | ✓ |

---

### 52. 전시관 (jeonshigwan) — exhibition hall [전시 exhibition + 관 building]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | 완구 **전시관** | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **전시관**은 토요일이랑 일요일에만 | ✓ |
| 3 | Gallery | N `gallery_curator` greeting | **전시관**에 오신 것을 환영합니다 | ✓ |

---

### 53. 전시품 (jeonshipum) — exhibits [전시 exhibition + 품 item]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_care` | **전시품**은 만지지 마세요 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **전시품**이라서 만지지 마 | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | **전시품**은 소중한 것들입니다 | ✓ |

---

### 54. 공간 (gonggan) — space / area

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 어린이를 위한 **공간** | ✓ |
| 2 | Play Area | N `play_staff` greeting | 이 **공간**에서 즐겁게 놀아요 | ✓ |
| 3 | Salon | N `salon_staff` greeting | 어린이 살롱 **공간**에 오신 것을 | ✓ |

---

### 55. 입구 (ipgu) — entrance

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | O `play_gate` lore | It's the 入口/**입구** — entrance gate | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_inside | 왼쪽 **입구**에서 들어가세요 | ✓ |
| 3 | House | S `house_entrance` | **입구** — 어서 오세요 | ✓ |

---

### 56. 출구 (chulgu) — exit

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | O `exit_door` lore | It's the 出口/**출구** — exit | ✓ |
| 2 | House | N `house_resident` ask_outside | 왼쪽 **출구**에서 나가세요 | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_inside | **출구**는 왼쪽에 있어요 | ✓ |

---

### 57. 코너 (koneo) — corner / section

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_dolls` | 인형 **코너**에 어서 오세요 | ✓ |
| 2 | Gallery | S `gallery_trains` | 기차 **코너** | ✓ |
| 3 | Gallery | N `gallery_curator` ask_toys | **코너**별로 전시돼 있어요 | ✓ |

---

### 58. 살롱 (sallong) — salon

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | 어린이 **살롱** | ✓ |
| 2 | Salon | N `salon_staff` greeting | 어린이 **살롱**에 오신 것을 환영해요 | ✓ |
| 3 | Salon | C `salon_food_chat` | **살롱** 대화 (title) | ✓ |

---

## Tier 6 — People & Age (words 59–68)

---

### 59. 어린이 (eorini) — child [noun form]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | **어린이**를 위한 공간 | ✓ |
| 2 | Lobby | S `lobby_directory` | **어린이** 살롱 | ✓ |
| 3 | Salon | N `salon_staff` greeting | **어린이** 살롱에 오신 것을 | ✓ |

---

### 60. 어린 (eorin) — young [attributive adjective]

*Note: 어린이 = noun, 어린 = adjective modifying a noun.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | **어린** 아이는 어른과 함께 | ✓ |
| 2 | Outdoor | S `outdoor_yield` | **어린** 아이에게 양보해 주세요 | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | **어린** 아이에게 양보해야 해 | ✓ |

---

### 61. 아이 (ai) — child [casual native Korean]

*Three-way synonym set: 아이 (casual) vs 어린이 (standard) vs 어린 아이 (young child).*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | 어린 **아이**는 어른과 함께 | ✓ |
| 2 | Outdoor | S `outdoor_yield` | 어린 **아이**에게 양보 | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 어린 **아이**에게 양보해야 해 | ✓ |

---

### 62. 어른 (eoreun) — adult

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | **어른**과 함께 | ✓ |
| 2 | Play Area | N `play_staff` ask_supervision | **어른**과 함께 있어야 해요 | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | 반드시 **어른**과 함께 하세요 | ✓ |

---

### 63. 살 (sal) — years old [native Korean age counter]

*살 is native Korean; 세 (歲) is Sino-Korean — both used, 살 more common in speech.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3**살**부터 6**살**까지 | ✓ |
| 2 | Outdoor | S `outdoor_yield` | 7**살** 이상은 | ✓ |
| 3 | Play Area | N `play_staff` ask_age | 3**살**부터 6**살**이 대상이에요 | ✓ |

---

### 64. 이용자 (iyongja) — user / rider [이용 use + 자 person]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 짚라인 **이용자**가 지나가요 | ✓ |
| 2 | Outdoor | N `outdoor_guide` greeting | 짚라인을 **이용**하실 분은 | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 짚라인 **이용자**가 기다리고 있잖아 | ✓ |

---

### 65. 보호자 (bohoja) — guardian / parent

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` label | **보호자** 동반 (sign line) | ✓ |
| 2 | Play Area | N `play_staff` ask_supervision | 반드시 **보호자**와 함께 | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | **보호자**와 함께 이용하세요 | ✓ |

---

### 66. 사서 (saseyo) — librarian

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` name_ko | 사서 (NPC name label) | ✓ |
| 2 | Library | C `library_outlet_chat` | **사서** 선생님한테 물어보는 게 | ✓ |
| 3 | Library | N `librarian` ask_book | **사서**에게 물어보세요 | ✓ response |

---

### 67. 방문객 (bangmungaek) — visitor / guest

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | **방문객** A, **방문객** B (speaker labels) | ✓ |
| 2 | Library | C `library_outlet_chat` | **방문객** A, **방문객** B | ✓ |
| 3 | Lobby | N `receptionist` greeting | **방문객** 여러분을 환영합니다 | ✓ |

---

### 68. 학생 (haksaeng) — student

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | **학생** A, **학생** B (speaker labels) | ✓ |
| 2 | Library | N `librarian` ask_quiet | **학생** 여러분, 조용히 | ✓ |
| 3 | Library | N `librarian` ask_book | **학생**들이 많이 찾는 책입니다 | ✓ |

---

## Tier 7 — Objects & Content Words (words 69–82)

---

### 69. 신발 (sinbal) — shoes

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_shoes` | **신발**을 벗어 주세요 | ✓ |
| 2 | House | S `house_entrance` | **신발**을 벗어 주세요 | ✓ |
| 3 | House | C `house_welcome_chat` | **신발** 벗어요 | ✓ |

---

### 70. 음식물 (eumsigmul) — food and drink [음식 food + 물 substance]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | **음식물** 섭취는 금지 | ✓ |
| 2 | Salon | S `salon_food` | **음식물** 반입은 삼가 주세요 | ✓ |
| 3 | Salon | C `salon_food_chat` | **음식물** 반입은 삼가야 해 | ✓ |

---

### 71. 휴대전화 (hyudaejeonhwa) — mobile phone [휴대 portable + 전화 phone]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | **휴대전화** 통화는 삼가 주세요 | ✓ |
| 2 | Library | C `library_study_chat` | **휴대전화** 통화는 삼가 주세요 | ✓ |
| 3 | Library | O `phone` lore | It's your **휴대전화** | ✓ |

---

### 72. 짚라인 (jiprain) — zipline

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | **짚라인** 이용자가 지나가요 | ✓ |
| 2 | Outdoor | N `outdoor_guide` greeting | **짚라인**을 이용하시려면 | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 이제 내 차례야! (짚라인 context) | ✓ |

---

### 73. 인형 (inhyeong) — doll

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_dolls` | **인형** 코너에 어서 오세요 | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | **인형**도 전시품이에요 | ✓ |
| 3 | Salon | N `salon_staff` ask_birthday | 히나마츠리 **인형** | ✓ |

---

### 74. 기차 (gicha) — train

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | **기차** 코너 | ✓ |
| 2 | Gallery | N `gallery_curator` ask_toys | **기차** 모형도 있어요 | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | **기차** 코너도 있네! | ✓ |

---

### 75. 완구 (wangu) — toys

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **완구** 전시관 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 이 **완구**들 진짜 신기하다! | ✓ |
| 3 | Gallery | N `gallery_curator` greeting | **완구** 전시관에 오신 것을 | ✓ |

---

### 76. 칼 (kal) — knife

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_safety` | **칼**이나 불을 사용할 때는 | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | **칼**이나 불 조심하면 돼 | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **칼** 사용할 때 주의해야겠다 | ✓ |

---

### 77. 불 (bul) — fire

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_safety` | 칼이나 **불**을 사용할 때는 | ✓ |
| 2 | Cooking Room | C `cooking_lesson_chat` | 칼이나 **불** 조심하면 돼 | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | **불** 사용 시 주의하세요 | ✓ |

---

### 78. 코타츠 (kotatsu) — kotatsu

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kotatsu` | **코타츠**에서 따뜻하게 지내요 | ✓ |
| 2 | House | C `house_welcome_chat` | **코타츠**에서 함께 쉬자! | ✓ |
| 3 | House | N `house_resident` greeting | **코타츠**에서 쉬어요 | ✓ |

---

### 79. 카레라이스 (kareraiseu) — curry rice

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | **카레라이스**입니다 | ✓ |
| 2 | House | S `house_kitchen` | **카레라이스**입니다 | ✓ |
| 3 | House | C `house_welcome_chat` | **카레라이스**야! 요리실에서 만들었어 | ✓ |

---

### 80. 메뉴 (menyu) — menu

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | 오늘의 **메뉴**는 카레라이스 | ✓ |
| 2 | Cooking Room | N `cook` ask_menu | 오늘의 **메뉴**는 카레라이스예요 | ✓ |
| 3 | House | N `house_resident` ask_food | 오늘 **메뉴**는 카레라이스야 | ✓ |

---

### 81. 접수 (jeopsu) — reception / registration

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_reception` | 오늘의 **접수**는 마감되었습니다 | ✓ |
| 2 | Lobby | N `receptionist` ask_membership | **접수**는 여기에서 | ✓ |
| 3 | Lobby | O `info_desk` lore | **접수** and info here | ✓ |

---

### 82. 책 (chaek) — book

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 이 **책** 어디 있는지 알아? | ✓ |
| 2 | Library | N `librarian` ask_book | 원하시는 **책**은 카탈로그에서 | ✓ |
| 3 | Library | O `bookshelf_obj` lore | **책**/본 — books | ✓ |

---

## Tier 8 — Actions, States & Adverbs (words 83–92)

---

### 83. 벗다 (beotda) — to remove / take off [벗어 주세요]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_shoes` | 신발을 **벗어** 주세요 | ✓ |
| 2 | House | S `house_entrance` | 신발을 **벗어** 주세요 | ✓ |
| 3 | House | C `house_welcome_chat` | 신발 **벗어**요 | ✓ |

---

### 84. 지나가다 (jinagada) — to pass / go by [지나가요]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 이용자가 **지나가**요 | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 아직 기다리고 있잖아 (waiting for person to **pass**) | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | 이용자가 **지나가**는 중이에요 | ✓ |

---

### 85. 만지다 (manjida) — to touch [만지지 마세요]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_care` | **만지지** 마세요 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **만지지** 마 | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | **만지지** 마세요 | ✓ |

---

### 86. 조용히 (joyonghi) — quietly [adverb]

*Pairs with 조용하다 (adj: quiet). 조용히 is the adverb form used on signs.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | **조용히** 해 주세요 | ✓ |
| 2 | Library | C `library_study_chat` | **조용히** 공부하자 | ✓ |
| 3 | Library | N `librarian` ask_quiet | **조용히** 해 주세요 | ✓ |

---

### 87. 따뜻하게 (ttatteutage) — warmly / in a warm way

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kotatsu` | 코타츠에서 **따뜻하게** 지내요 | ✓ |
| 2 | House | C `house_welcome_chat` | **따뜻하게** 지내기 좋다 | ✓ |
| 3 | House | N `house_resident` ask_house | **따뜻하게** 쉬세요 | ✓ |

---

### 88. 배고프다 (baegopuda) — to be hungry

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | 아, **배가 고프다** | ✓ |
| 2 | House | C `house_welcome_chat` | 저녁은 뭐야? (hungry context) | ✓ |
| 3 | House | N `house_resident` ask_food | **배가 고프**면 카레라이스 | ✓ |

---

### 89. 다행이다 (dahaengida) — what a relief / lucky

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | C `salon_food_chat` | **다행이다**. 음식은 나중에 먹을게. | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 그렇구나. 그럼 오늘 와서 **다행이다**! | ✓ |
| 3 | Library | C `library_outlet_chat` | 가능하면 **다행이겠다**! | ✓ |

---

### 90. 알겠어요 (algesseoyo) — I understand / got it

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | **알겠어**. 조용히 공부하자. | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | **알겠어**! 같이 기다리자. | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **알겠어**. 그래도 요리하면 재미있겠지? | ✓ |

---

### 91. 사용하다 (sayonghada) — to use [사용해 주세요]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 전용으로 **사용**해 주세요 | ✓ |
| 2 | Salon | S `salon_share` | **사용**해 주세요 | ✓ |
| 3 | Cooking Room | S `cooking_safety` | **사용**할 때는 조심하세요 | ✓ |

---

### 92. 기다리다 (gidarida) — to wait

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | C `outdoor_zipline_chat` | 아직 **기다리**고 있잖아 | ✓ |
| 2 | Outdoor | C `outdoor_zipline_chat` | 같이 **기다리**자 | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | **기다려** 주세요 | ✓ |

---

## Tier 9 — Time & Numbers (words 93–97)

---

### 93. 오늘 (oneul) — today [native Korean]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_reception` | **오늘**의 접수는 마감 | ✓ |
| 2 | Cooking Room | S `cooking_schedule` | **오늘**의 메뉴는 | ✓ |
| 3 | House | S `house_kitchen` | **오늘** 저녁은 | ✓ |

---

### 94. 저녁 (jeonyeok) — evening / dinner

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kitchen` | 오늘 **저녁**은 카레라이스입니다 | ✓ |
| 2 | House | C `house_welcome_chat` | **저녁**은 뭐야? | ✓ |
| 3 | House | N `house_resident` ask_food | **저녁**은 카레라이스예요 | ✓ |

---

### 95. 토요일 (toyoil) — Saturday

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | **토요일**·일요일 10시〜17시 개관 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | **토요일**이랑 일요일에만 개관한대 | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | **토요일**과 일요일에만 열려요 | ✓ |

---

### 96. 일요일 (iryoil) — Sunday

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | 토요일·**일요일** 10시〜17시 개관 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 토요일이랑 **일요일**에만 개관 | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | 토요일과 **일요일**에만 열려요 | ✓ |

---

### 97. 시 (si) — o'clock / hour

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | 10**시**〜17**시** 개관 | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 오전 9**시**부터 오후 5**시**까지 | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 10**시**부터 17**시**까지 개관한대 | ✓ |

---

## Tier 10 — Culture, Compounds & Register (words 98–100)

---

### 98. 도서 (doseo) — books [Sino-Korean root: appears in 도서관]

*This is a morpheme, not a standalone word. Teach it through the 도서관 parts[] breakdown.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **도서**관 (parts chip visible) | ✓ |
| 2 | Library | S `outlet_rule` | **도서**관 업무 (parts chip) | ✓ |
| 3 | Library | C `library_study_chat` | **도서관** 대화 | ✓ |

---

### 99. 관 (gwan) — building / hall [Sino-Korean suffix]

*The 관 recurs: 도서**관**, 전시**관**, 개**관** — each time the building meaning is visible.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | 도서**관** + 전시**관** (both on one sign) | ✓ |
| 2 | Gallery | S `gallery_trains` | 개**관** (to open — same morpheme as a verb) | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시**관**은 토요일에만 개관 | ✓ |

---

### 100. 수분 보충 (subun bochung) — hydration / water replenishment

*A formal compound that appears in both the sign and the ambient conversation — a good
example of the formal register used on facility notices vs casual speech.*

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | **수분 보충**은 가능합니다 | ✓ |
| 2 | Salon | C `salon_food_chat` | **수분 보충**은 가능하대 | ✓ |
| 3 | Library | N `librarian` ask_food | **수분 보충**만 허용됩니다 | ✓ |

---

## Pedagogical Notes — Korean-specific

### The particle alternation rule

Words 1–6 all follow the same rule: consonant-final → heavier form (은, 이, 을, 과, 으로),
vowel-final → lighter form (는, 가, 를, 와, 로). The game can surface this as a pattern
note when the player first encounters the second form of a pair — "you've seen 은 before;
this word ends in a vowel, so it takes 는 instead."

### 에 vs 에서

Words 13–16 require explicit contrast. The clearest minimal pairs in the existing content:
- 요리실**에** 어서 오세요 (destination → 에)
- 관내**에서** 조용히 해 주세요 (where the action happens → 에서)
- 코타츠**에서** 따뜻하게 지내요 (where you spend time → 에서)

These three sentences cover both distinctions and appear in adjacent rooms on the path
(Cooking Room → Library → House), making the contrast teach-able through exploration order.

### Formal vs casual register

The game naturally exposes both:
- **합니다체** (formal, written): signs use 입니다, 합니다, 있습니다, 하세요, 주세요
- **해요체** (informal polite): NPC greetings use 해요, 있어요, 드릴까요
- **해체** (casual): conversations use 있어, 봐봐, 먹을게, 알겠어

This three-level contrast can be made explicit by pairing each rule vocabulary item
(금지되어 있**습니다**) with its conversation equivalent (먹으면 안 **돼**).

### Compound nouns (parts[])

Korean signs already use `parts[]` to break down compounds (도서관 → 도서 + 관,
휴대전화 → 휴대 + 전화, 음식물 → 음식 + 물, 전시품 → 전시 + 품, 요리실 → 요리 + 실).
Words 49, 52, 53, 70, 71, 98, 99 exploit this data to teach morpheme recognition —
a high-leverage strategy for building vocabulary from a small number of roots.

### Cross-language connections (Japanese learners)

For players who have also studied the Japanese side:
- 은/는 ↔ は (topic particle — same function, different form)
- 이/가 ↔ が (subject particle)
- 을/를 ↔ を (object particle)
- 에 ↔ に (direction/destination) and 에서 ↔ で (location of action)
- 의 ↔ の (possessive)

The Korean alternation (consonant vs vowel forms) has no Japanese parallel — it is the
biggest new concept for Japanese learners approaching Korean, and deserves prominent
placement as the opening tier.
