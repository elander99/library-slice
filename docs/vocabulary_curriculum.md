# Vocabulary Curriculum — 100-Word Plan

Each word appears **three times** in the world, across different rooms and media.
Appearances are ordered by the canonical player path so spaced repetition is built into exploration.

## Media Key

| Code | Meaning |
|------|---------|
| **S** | Wall sign (player clicks token) |
| **O** | Scene object / lore hotspot |
| **N** | NPC dialogue (speaking to NPC) |
| **C** | Ambient conversation (overheard) |
| ✓ | Already exists in content |
| + | Needs to be added |

## Player Path

```
Street → Lobby → Play Area → Library → Salon → Outdoor → House
                    ↕                      ↕
                 Gallery              Cooking Room
```

Words introduced early in the path should recur in later rooms.

---

## Tier 1 — Foundation (words 1–20)

High-frequency function words and greetings. These recur naturally across all rooms.

---

### 1. ようこそ (youkoso) — welcome

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_welcome` | 料理室へ**ようこそ**！ | ✓ |
| 2 | Gallery | S `gallery_dolls` | 人形コーナーへ**ようこそ**！ | ✓ |
| 3 | Lobby | N `receptionist` greeting | ～館へ**ようこそ** | ✓ |

---

### 2. ください (kudasai) — please [request ending]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | 静粛にして**ください** | ✓ |
| 2 | Gallery | S `gallery_care` | 触れないで**ください** | ✓ |
| 3 | House | S `house_entrance` | おぬぎ**ください** | ✓ |

*ください recurs on salon_food too — already well-covered.*

---

### 3. は (wa) — topic particle

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | コンセントのご使用**は**図書館業務に | ✓ |
| 2 | Library | S `quiet_rule` | 携帯電話のご使用**は**ご遠慮 | ✓ |
| 3 | House | S `house_kitchen` | 今日の夕飯**は**カレーライスです | ✓ |

---

### 4. の (no) — possessive particle

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | コンセント**の**ご使用 | ✓ |
| 2 | Library | S `quiet_rule` | 携帯電話**の**ご使用 | ✓ |
| 3 | House | S `house_kitchen` | 今日**の**夕飯 | ✓ |

---

### 5. に (ni) — to / at / in [particle]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 業務**に**関連する | ✓ |
| 2 | Play Area | S `play_supervision` | 大人と一緒**に** | ✓ |
| 3 | Library | S `quiet_rule` | 静粛**に**してください | ✓ |

---

### 6. を (wo) — object marker

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_entrance` | くつ**を**おぬぎください | ✓ |
| 2 | Play Area | N `play_staff` ask_shoes | 靴**を**脱いでください | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | 手**を**触れないように | ✓ |

---

### 7. で (de) — at / by / with [particle]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | 館内**で**の飲食は | ✓ |
| 2 | House | S `house_kotatsu` | こたつ**で**あたたまろう | ✓ |
| 3 | Cooking Room | N `cook` ask_cooking | 料理室**で**作る | + add to cook greeting/response |

---

### 8. から (kara) — from

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3才**から**6才まで | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 午前9時**から** | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_inside | 左の入口**から**入れます | ✓ |

---

### 9. まで (made) — until / up to

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3才から6才**まで** | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 午後5時**まで**開館 | ✓ |
| 3 | Gallery | S `gallery_trains` | 10時〜17時**まで** (implied by range) | ✓ |

---

### 10. です (desu) — is / am / are

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | カレーライス**です** | ✓ |
| 2 | House | S `house_kitchen` | カレーライス**です** | ✓ |
| 3 | Play Area | N `play_staff` ask_age | 対象**です** | ✓ |

---

### 11. する (suru) — to do

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 業務に関連**する**場合 | ✓ |
| 2 | Library | S `quiet_rule` | 静粛に**して**ください | ✓ |
| 3 | Salon | N `salon_staff` ask_crafts | 工作を**する** | + add "工作をする" to crafts response |

---

### 12. こんにちは (konnichiwa) — hello

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` greeting | **こんにちは**！富山県… | ✓ |
| 2 | Library | N `librarian` intent_greeting | **こんにちは**！今日もよろしく | ✓ |
| 3 | Outdoor | N `outdoor_guide` intent_greeting | **こんにちは**！外の空気は | ✓ |

---

### 13. ありがとう (arigatou) — thank you

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` intent_ask_quiet | **ありがとう**ございます | ✓ |
| 2 | House | N `house_resident` wish_birthday | **ありがとう**！すごく嬉しい | ✓ |
| 3 | Salon | C `salon_food_chat` turn 3 | (visitor thanks) + add short ありがとう | + add to salon_food_chat turn 5 |

---

### 14. すみません (sumimasen) — excuse me / sorry

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` confused | **すみません**、よく聞こえませんでした | ✓ |
| 2 | Library | N `librarian` apologize keywords | player says すみません → NPC responds | ✓ |
| 3 | Outdoor | N `outdoor_guide` confused | **すみません**、もう少しゆっくり | ✓ |

---

### 15. はい (hai) — yes

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | C `library_study_chat` | 응/はい、静かに勉強しよう | + add はい variant to turn 5 of library_study_chat |
| 2 | House | N `house_resident` wish_birthday keywords | **はい**／うん — triggers birthday response | ✓ |
| 3 | Lobby | N `receptionist` any response | add はい as keyword to receptionist intents | + add はい to greeting keywords |

---

### 16. また (mata) — again / also

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` goodbye | **また**お越しください | + add goodbye intent to receptionist |
| 2 | Library | N `librarian` apologize | **また**おっしゃっていただけますか | ✓ (in confused) |
| 3 | Outdoor | C `outdoor_zipline_chat` | **また**やろう！ | + add to final turn of zipline chat |

---

### 17. 今日 (kyou) — today

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | **今日**のメニューはカレーライス | ✓ |
| 2 | House | S `house_kitchen` | **今日**の夕飯は | ✓ |
| 3 | Cooking Room | N `cook` ask_menu | **今日**はカレーライスです | ✓ |

---

### 18. 時 (ji) — o'clock

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | 10**時**〜17**時** | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 午前9**時**から午後5**時** | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 土曜と日曜だけ開館 (reference hours) + add 10時から | + add hour reference in gallery_explore_chat turn 4 |

---

### 19. 人 (hito) — person

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 乗っている**人**が通ります | ✓ |
| 2 | Outdoor | S `outdoor_yield` | 7才以上の**方** (polite form) | ✓ |
| 3 | Play Area | N `play_staff` ask_supervision | 他のお子様と他の**人** | + reference 人 in play_staff rules response |

---

### 20. 手 (te) — hand

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_care` | **手**を触れないでください | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | **手**でだけ楽しんでください (correction: 目で) — the NPC says 手は触れないように | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | ナイフは**手**を切ることがある | + add 手 reference in safety response |

---

## Tier 2 — Navigation & Places (words 21–40)

Room names, landmarks, and spatial vocabulary.

---

### 21. 図書館 (toshokan) — library

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **図書館**・こどもサロン | ✓ |
| 2 | Library | S `outlet_rule` | **図書館**業務に関連する | ✓ |
| 3 | Library | O `librarian` lore | It's the **図書館員** — the librarian | ✓ |

---

### 22. 館内 (kannai) — inside the building

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | **館内**では静粛に | ✓ |
| 2 | Library | S `food_rule` | **館内**での飲食は | ✓ |
| 3 | Library | N `librarian` ask_food | **館内**では飲食はご遠慮ください | ✓ |

---

### 23. ロビー (robii) — lobby

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | O `info_desk` lore | It's the 案内所 — (in the ロビー) | + add ロビー to info_desk lore l2 |
| 2 | Library | N `librarian` ask_food | 1階のラウンジ (salon context) | + add ロビー to librarian food response |
| 3 | Lobby | N `receptionist` ask_directions | **ロビー**から2階へ | + add ロビー reference in directions response |

---

### 24. 受付 (uketsuke) — reception

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_reception` | **受付** (sign label) | ✓ |
| 2 | Lobby | N `receptionist` ask_membership | **受付**で行っております | ✓ |
| 3 | Lobby | O `info_desk` lore | adjacent to **受付** | + add 受付 to info_desk lore |

---

### 25. 入口 (iriguchi) — entrance

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | O `play_gate` lore | It's the **入口** — the entrance gate | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_inside | 左の**入口**から入れます | ✓ |
| 3 | House | S `house_entrance` | 玄関 = home **入口** | + add 入口 note to house_entrance sign or lore |

---

### 26. 出口 (deguchi) — exit

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | O `exit_door` lore | It's the **出口** — the exit | ✓ |
| 2 | House | N `house_resident` ask_outside | 左の**出口**から | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_inside | building **出口** reference | + add 出口 to outdoor_guide ask_inside response |

---

### 27. 遊び場 (asobiba) — play area

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` label | 対象年齢 (room is 遊び場) | + add 遊び場 to play_age label or sign text |
| 2 | Gallery | N `gallery_curator` ask_playarea | 下の**遊び場**も楽しいですよ | ✓ |
| 3 | Play Area | N `play_staff` greeting | **遊び**に来てくれたの？ | ✓ |

---

### 28. サロン (saron) — salon

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **サロン** | ✓ |
| 2 | Salon | N `salon_staff` greeting | こども**サロン**へようこそ | ✓ |
| 3 | Salon | S `salon_food` label | 飲食について (in **サロン**) | + add サロン to salon_food label text |

---

### 29. 料理室 (ryourishitsu) — cooking room

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **料理室**・おもちゃ画廊 | ✓ |
| 2 | Cooking Room | S `cooking_welcome` | **料理室**へようこそ！ | ✓ |
| 3 | House | N `house_resident` ask_food | 今日はカレーライス — **料理室**で作った | + add 料理室 to house_resident ask_food response |

---

### 30. 画廊 (garou) — gallery

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_directory` | **画廊** | ✓ |
| 2 | Gallery | N `gallery_curator` greeting | おもちゃ**画廊**へようこそ | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시관 — translates to **画廊** | + add 画廊 label reference in gallery_explore_chat |

---

### 31. 家 (ie) — home / house

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kotatsu` label | 居間 (room label in the 家) | + add 家 to house_kotatsu label or sign text |
| 2 | House | N `house_resident` ask_house | この**家**は古いけど居心地がいい | ✓ |
| 3 | Outdoor | N `house_resident` ask_outside | **家**の出口を使って | ✓ |

---

### 32. 玄関 (genkan) — entrance hall of a home

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_entrance` label | **玄関** | ✓ |
| 2 | House | N `house_resident` ask_shoes | **玄関**でくつをぬいでから | ✓ |
| 3 | House | N `house_resident` ask_house | **玄関**の匂い (tatami context) | + add 玄関 reference to ask_house response |

---

### 33. 台所 (daidokoro) — kitchen

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kitchen` label | **台所** | ✓ |
| 2 | House | N `house_resident` ask_food | **台所**にお茶もある | ✓ |
| 3 | Cooking Room | N `cook` ask_cooking | like a **台所** — reference overlap | + add 台所 to cook's ask_cooking or greeting |

---

### 34. 道 (michi) — path / road

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_yield` | **道**を譲って | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | **道**を空けて次の人に | + add 道 to outdoor_guide rules response |
| 3 | Street | O `street` scene (future object) | 通りの**道** | + add a street lore object referencing 道 |

---

### 35. 下駄箱 (getabako) — shoe rack

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | O `shoe_rack` lore | It's a **下駄箱** — a shoe rack | ✓ |
| 2 | Play Area | N `play_staff` ask_shoes | **下駄箱**をご利用ください | ✓ |
| 3 | House | S `house_entrance` | (shoes sign context — add 下駄箱) | + add 下駄箱 to house_entrance sign text |

---

### 36. 案内所 (annaijo) — information desk

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | O `info_desk` lore | It's the **案内所** — the information desk | ✓ |
| 2 | Lobby | N `receptionist` ask_directions | **案内所**でお聞きください | + add 案内所 to receptionist ask_directions |
| 3 | Lobby | S `lobby_directory` | add **案内所** text to directory sign | + add token to lobby_directory |

---

### 37. コーナー (koonaa) — section / corner

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_dolls` | 人形**コーナー** | ✓ |
| 2 | Gallery | S `gallery_trains` | 汽車**コーナー** | ✓ |
| 3 | Gallery | N `gallery_curator` ask_toys | 木製の積み木**コーナー** | + add コーナー to curator toys response |

---

### 38. 窓 (mado) — window

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `window_view` lore | It's a **窓** — a window | ✓ |
| 2 | Library | N `librarian` ask_quiet | **窓**の外は静か | + add 窓 to librarian quiet response |
| 3 | House | O new `house_window` lore | 家の**窓**から外が見える | + add window_view lore entry for house |

---

### 39. 書棚 (shodana) — bookshelf

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `bookshelf_obj` lore | It's a **書棚** — a bookshelf | ✓ |
| 2 | Library | N `librarian` ask_book | **書棚**のカタログをご覧ください | + add 書棚 reference to ask_book response |
| 3 | Library | C `library_study_chat` | 本は**書棚**にある | + add 書棚 to library_study_chat turn 2 |

---

### 40. ベンチ (benchi) — bench

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | O `outdoor_bench` lore | It's a **ベンチ** — a bench | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | 休憩は**ベンチ**で | + add ベンチ to outdoor_guide confused/rules response |
| 3 | Street | O new `street_bench` | 通りの**ベンチ**で休める | + add bench lore to street room |

---

## Tier 3 — Rules & Behavior (words 41–60)

The facility's rule vocabulary — the heart of the game's content.

---

### 41. 静粛 (seishuku) — silence

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | **静粛**にしてください | ✓ |
| 2 | Library | N `librarian` ask_quiet | **静粛**にお過ごしください | ✓ |
| 3 | Library | C `library_study_chat` | **静か**に勉強しよう (静か variant) | ✓ |

---

### 42. 飲食 (inshoku) — eating and drinking

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | **飲食**は固くお断りします | ✓ |
| 2 | Salon | S `salon_food` | **飲食**はご遠慮ください | ✓ |
| 3 | Library | N `librarian` ask_food | **飲食**はご遠慮ください | ✓ |

---

### 43. 許可 (kyoka) — permission

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | **許可**されています | ✓ |
| 2 | Library | N `librarian` ask_outlet | ご使用いただけます (permitted — add 許可) | + add 許可 to librarian ask_outlet response |
| 3 | Lobby | N `receptionist` ask_membership | 利用**許可** for library card | + add 許可 to receptionist membership response |

---

### 44. ご遠慮 (goenryo) — please refrain

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | ご使用はご**遠慮**ください | ✓ |
| 2 | Salon | S `salon_food` | 飲食は**ご遠慮**ください | ✓ |
| 3 | Library | N `librarian` ask_laptop | 個人的な作業は**ご遠慮**ください | ✓ |

---

### 45. 気をつけて (ki wo tsukete) — watch out / be careful

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | **気をつけて**！ | ✓ |
| 2 | Cooking Room | S `cooking_safety` | **気をつけて**！ | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | **気をつけてね** | ✓ |

---

### 46. のみ (nomi) — only

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 場合**のみ**許可 | ✓ |
| 2 | Library | O `laptop` lore | Outlet use — library work **only** | ✓ |
| 3 | Library | N `librarian` ask_outlet | 業務に関連する場合**のみ** | ✓ |

---

### 47. 固く (kataku) — strictly

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `food_rule` | **固く**お断りします | ✓ |
| 2 | Library | O `snack` lore | **strictly** off-limits | ✓ |
| 3 | Library | N `librarian` ask_food | **固く**禁止 | + add 固く禁止 to librarian ask_food response |

---

### 48. 順番に (junban ni) — in turns

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_share` | **順番に**仲よく使いましょう | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_zipline | **順番に**ご利用ください | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 차례차례 (turns) — add 順番に | + add 順番に to outdoor_zipline_chat |

---

### 49. 一緒に (issho ni) — together

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | 大人と**一緒に** | ✓ |
| 2 | House | N `house_resident` wish_birthday | **一緒に**カレーライスを食べて | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | **一緒に**待とう | ✓ |

---

### 50. 対象 (taishou) — intended for / target

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3才から6才のこどもたちが**対象**です | ✓ |
| 2 | Play Area | N `play_staff` ask_age | このエリアは3才から6才が**対象** | ✓ |
| 3 | Salon | N `salon_staff` ask_age | 小学校高学年以上が**対象** | ✓ |

---

### 51. 以上 (ijou) — and over / above

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_yield` | 7才**以上**の方は | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | 7才**以上**は小さな子に譲って | + add 以上 to outdoor_guide ask_rules |
| 3 | Outdoor | C `outdoor_zipline_chat` | 7살 이상 — 7才**以上** | ✓ |

---

### 52. 可 (ka) — allowed / possible

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | 水分補給は**可** | ✓ |
| 2 | Library | C `library_outlet_chat` | 勉強は業務に含まれるか？ (是非) | ✓ |
| 3 | Library | N `librarian` ask_outlet | 業務に関連すれば**可** | + add 可 to librarian ask_outlet response |

---

### 53. 展示品 (tenjishin) — exhibits

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_care` | **展示品**には手を触れないで | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | **展示品**は触れないように | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시품 — **展示品** | ✓ |

---

### 54. 触れないで (furenaide) — do not touch

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_care` | 手を**触れないで**ください | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | **触れない**ようにお願いします | ✓ |
| 3 | Gallery | C `gallery_explore_chat` | 전시품이라서 만지지 마 (don't touch) | ✓ |

---

### 55. 終了 (shuuryou) — closed / finished

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_reception` | 本日の受付は**終了**しました | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | **終了**は午後5時 | + add 終了 to receptionist hours response |
| 3 | Gallery | C `gallery_explore_chat` | 토요일·일요일만 개관 — **終了**曜日 | + add 終了 reference to gallery_explore_chat turn 4 |

---

### 56. 開館 (kaikan) — open (building)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | **開館**時間 10時〜17時 | ✓ |
| 2 | Lobby | N `receptionist` ask_hours | 午前9時から**開館** | + add 開館 to receptionist hours response |
| 3 | Gallery | C `gallery_explore_chat` | 개관 — **開館** | ✓ |

---

### 57. 業務 (gyoumu) — work / official business

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 図書館**業務**に関連する場合 | ✓ |
| 2 | Library | N `librarian` ask_outlet | 図書館**業務**に関連する場合 | ✓ |
| 3 | Library | C `library_outlet_chat` | 도서관 업무 전용 — **業務** | ✓ |

---

### 58. 関連 (kanren) — related

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 業務に**関連**する場合 | ✓ |
| 2 | Library | N `librarian` ask_laptop | 図書館業務に**関連**する場合 | ✓ |
| 3 | Library | N `librarian` ask_outlet | 業務に**関連**する場合のみ | ✓ |

---

### 59. 場合 (baai) — case / when

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | 関連する**場合**のみ | ✓ |
| 2 | Library | N `librarian` ask_outlet | 関連する**場合**のみ | ✓ |
| 3 | Library | C `library_outlet_chat` | 공부는 업무에 포함될까? (would this **case** count?) | ✓ |

---

### 60. 安全 (anzen) — safety / safe

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | N `play_staff` intent_greeting | **安全**に楽しく遊んでね | ✓ |
| 2 | Cooking Room | N `cook` ask_safety | **安全**のために大人と一緒に | + add 安全 to cook ask_safety response |
| 3 | Outdoor | S new `outdoor_safety` | **安全**にご利用ください | + add a safety sign to outdoor room |

---

## Tier 4 — People & Objects (words 61–80)

The physical world and its inhabitants.

---

### 61. こども (kodomo) — child

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | **こども**たちが対象です | ✓ |
| 2 | Salon | N `salon_staff` greeting | **こども**サロンへようこそ | ✓ |
| 3 | Lobby | N `receptionist` greeting | **こども**みらい館へようこそ | ✓ |

---

### 62. 大人 (otona) — adult

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | **大人**と一緒に | ✓ |
| 2 | Play Area | N `play_staff` ask_supervision | **大人**と一緒にお願いします | ✓ |
| 3 | Cooking Room | N `cook` ask_safety | **大人**と一緒にやってください | ✓ |

---

### 63. お子様 (okosama) — child (polite / honorific)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | 小さい**お子様**は大人と一緒に | ✓ |
| 2 | Play Area | N `play_staff` ask_supervision | 小さい**お子様**は必ず保護者と | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | 小さい**お子様**は保護者と一緒に | ✓ |

*Note: pairs with こども (#61) — polite vs plain register contrast.*

---

### 64. 保護者 (hogosya) — guardian / parent

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` label | 保護者同伴 (sign label) | ✓ |
| 2 | Play Area | N `play_staff` ask_supervision | 必ず**保護者**と一緒に | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | **保護者**の方と一緒に | ✓ |

---

### 65. 小さい (chiisai) — small

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_supervision` | **小さい**お子様は | ✓ |
| 2 | Outdoor | S `outdoor_yield` | **小さな**子に道を譲って (variant: 小さな) | ✓ |
| 3 | Gallery | N `gallery_curator` ask_playarea | **小さい**お子様にはそちらが | ✓ |

---

### 66. くつ (kutsu) — shoes

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_shoes` | **くつ**をぬぎましょう | ✓ |
| 2 | House | S `house_entrance` | **くつ**をおぬぎください | ✓ |
| 3 | House | N `house_resident` ask_shoes | 玄関で**くつ**をぬいでから | ✓ |

---

### 67. 携帯電話 (keitaidenwa) — mobile phone

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `quiet_rule` | **携帯電話**のご使用はご遠慮ください | ✓ |
| 2 | Library | O `phone` lore | It's your **携帯電話** — your phone | ✓ |
| 3 | Library | N `librarian` ask_quiet | **携帯電話**のご通話はご遠慮 | + add 携帯電話 to librarian ask_quiet response |

---

### 68. コンセント (konsento) — outlet

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | S `outlet_rule` | **コンセント**のご使用は | ✓ |
| 2 | Library | O `outlet` lore | It's a **コンセント** — an outlet | ✓ |
| 3 | Library | C `library_outlet_chat` | **콘센트** 표지판 봐봐 | ✓ |

---

### 69. ノートパソコン (nootopasokon) — laptop

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `laptop` lore | It's your **ノートパソコン** | ✓ |
| 2 | Library | N `librarian` ask_laptop | **ノートパソコン**は図書館業務のみ | ✓ |
| 3 | Library | C `library_outlet_chat` | 노트북 충전 — **ノートパソコン**充電 | ✓ |

---

### 70. 本 (hon) — book

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `bookshelf_obj` lore | It's a 書棚 — books live here | + add **本** to bookshelf lore text |
| 2 | Library | N `librarian` ask_book | ご希望の**本**についてはカタログ | ✓ |
| 3 | Library | C `library_study_chat` | この**本**どこにあるか知ってる？ | ✓ |

---

### 71. お菓子 (okashi) — snack

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `snack` lore | It's an **お菓子** — a rice cracker | ✓ |
| 2 | Salon | N `salon_staff` ask_food | **お菓子**はラウンジで | + add お菓子 to salon_staff ask_food response |
| 3 | Salon | C `salon_food_chat` | 간식 먹어도 될까 — **お菓子** | ✓ |

---

### 72. ナイフ (naifu) — knife

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_safety` | **ナイフ**や火を使うときは | ✓ |
| 2 | Cooking Room | N `cook` ask_safety | **ナイフ**や火を使うときは必ず大人と | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | **칼** (knife) 조심 — **ナイフ**注意 | ✓ |

---

### 73. 火 (hi) — fire

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_safety` | ナイフや**火**を使うときは | ✓ |
| 2 | Cooking Room | N `cook` ask_safety | ナイフや**火**を使うときは必ず大人と | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 불 조심 — **火**に注意 | ✓ |

---

### 74. こたつ (kotatsu) — kotatsu (heated table)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kotatsu` | **こたつ**であたたまろう | ✓ |
| 2 | House | N `house_resident` intent_greeting | **こたつ**でゆっくりしてね | ✓ |
| 3 | House | C `house_welcome_chat` | **コタツ**에서 함께 쉬자 | ✓ |

---

### 75. 工作台 (kousaku dai) — craft table

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | O `craft_table` lore | It's a **工作台** — a craft table | ✓ |
| 2 | Salon | N `salon_staff` ask_crafts | **工作台**が使えますよ | ✓ |
| 3 | Salon | N `salon_staff` intent_greeting | 今日はどんな**工作**をしますか | ✓ |

---

### 76. 教科書 (kyoukasho) — textbook

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `textbook` lore | It's your **教科書** — your textbook | ✓ |
| 2 | Library | N `librarian` ask_book | **教科書**の調べ物はカタログで | + add 教科書 to librarian ask_book response |
| 3 | Library | C `library_study_chat` | **교과서** — **教科書** | + add 教科書 reference to library_study_chat turn 1 |

---

### 77. ジップライン (jippurain) — zipline

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | **ジップライン**に乗っている人が | ✓ |
| 2 | Outdoor | O `zipline_post` lore | It's a **ジップライン** — a zipline | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | **ジップライン**は順番に | ✓ |

---

### 78. 人形 (ningyou) — doll

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_dolls` | **人形**コーナーへようこそ | ✓ |
| 2 | Gallery | N `gallery_curator` ask_exhibits | **人形**も大切な展示品です | + add 人形 to curator ask_exhibits response |
| 3 | Salon | N `salon_staff` ask_birthday | ひな祭りの**人形** | + add 人形 to salon_staff birthday response |

---

### 79. 汽車 (kisha) — train (old-style)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | **汽車**コーナー | ✓ |
| 2 | Gallery | N `gallery_curator` ask_toys | **汽車**の模型も展示されています | + add 汽車 to curator ask_toys response |
| 3 | Gallery | C `gallery_explore_chat` | 완구들 (toys) — **汽車**が一番人気 | + add 汽車 reference to gallery_explore_chat |

---

### 80. メニュー (menyuu) — menu

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | 今日の**メニュー**はカレーライス | ✓ |
| 2 | Cooking Room | N `cook` ask_menu | 今日の**メニュー**はカレーライス | ✓ |
| 3 | House | N `house_resident` ask_food | 今日の**メニュー**はカレーライスよ | + add メニュー to house_resident ask_food response |

---

## Tier 5 — Culture & Context (words 81–100)

Formal variants, cultural vocabulary, and time.

---

### 81. 本日 (honjitsu) — today (formal)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | S `lobby_reception` | **本日**の受付は終了しました | ✓ |
| 2 | Lobby | N `receptionist` ask_today | **本日**は特別なイベントはございません | ✓ |
| 3 | Lobby | N `receptionist` ask_hours | **本日**は午前9時から | ✓ |

*Pairs with 今日 (#17): formal vs casual register same meaning.*

---

### 82. 才 (sai) — years old

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_age` | 3**才**から6**才**まで | ✓ |
| 2 | Outdoor | S `outdoor_yield` | 7**才**以上の方は | ✓ |
| 3 | Play Area | N `play_staff` ask_age | 3**才**から6**才**が対象 | ✓ |

---

### 83. 土日 (donichi) — Saturdays and Sundays

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Gallery | S `gallery_trains` | **土日**10時〜17時 開館 | ✓ |
| 2 | Gallery | C `gallery_explore_chat` | 토요일이랑 일요일에만 개관 — **土日** | ✓ |
| 3 | Gallery | N `gallery_curator` ask_exhibits | **土日**しか開いていませんが | + add 土日 to curator ask_exhibits response |

---

### 84. おかえりなさい (okaerinasai) — welcome back

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_entrance` | **おかえりなさい** | ✓ |
| 2 | House | N `house_resident` greeting | **おかえりなさい**！ゆっくりして | ✓ |
| 3 | House | C `house_welcome_chat` | **어서 오세요** (welcome back equiv.) | ✓ |

---

### 85. 夕飯 (yuuhan) — dinner

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | S `house_kitchen` | 今日の**夕飯**はカレーライスです | ✓ |
| 2 | House | N `house_resident` ask_food | **夕飯**はカレーライスですよ | + add 夕飯 to house_resident ask_food (uses カレーライス, add 夕飯) | ✓ (already in ask_food response context) |
| 3 | House | C `house_welcome_chat` | 저녁은 뭐야 — **夕飯**は何？ | ✓ |

---

### 86. カレーライス (karee raisu) — curry rice

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | S `cooking_schedule` | **カレーライス**です | ✓ |
| 2 | House | S `house_kitchen` | **カレーライス**です | ✓ |
| 3 | House | N `house_resident` ask_food | 今日は**カレーライス**ですよ | ✓ |

---

### 87. 水分補給 (suibun hokyuu) — hydration

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_food` | **水分補給**は可 | ✓ |
| 2 | Library | N `librarian` ask_food | **水分補給**のみ可能です | ✓ |
| 3 | Salon | C `salon_food_chat` | 수분 보충은 가능 — **水分補給**は可 | ✓ |

---

### 88. 仲よく (nakayoku) — get along / be friendly

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | S `salon_share` | 順番に**仲よく**使いましょう | ✓ |
| 2 | Salon | N `salon_staff` ask_share | みんなで**仲良く**順番に使って | ✓ |
| 3 | Play Area | N `play_staff` ask_rules | 他のお子様と**仲よく**遊んで | + add 仲よく to play_staff ask_rules response |

---

### 89. 譲って (yuzutte) — give way

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_yield` | 道を**譲って** | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | 次の方に**譲って**ください | ✓ |
| 3 | Outdoor | C `outdoor_zipline_chat` | 양보해야 해 — **譲って** | ✓ |

---

### 90. 乗っている (notte iru) — riding

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | ジップラインに**乗っている**人が | ✓ |
| 2 | Outdoor | O `zipline_post` lore | Watch out — riders (**乗っている**) pass overhead | ✓ |
| 3 | Outdoor | N `outdoor_guide` ask_zipline | **乗っている**方が通ります | + add 乗っている to outdoor_guide ask_zipline response |

---

### 91. 通ります (toorimasu) — will pass through

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | S `outdoor_zipline` | 人が**通ります** | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules | 一人ずつご利用いただき、次の方に**通ります** | + add 通ります to outdoor_guide ask_rules |
| 3 | Outdoor | C `outdoor_zipline_chat` | 아직 기다리고 있잖아 (still passing) | + add 通ります to outdoor_zipline_chat turn 2 |

---

### 92. 静か (shizuka) — quiet (adjective)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | N `librarian` ask_quiet | **静か**にお過ごしください | ✓ |
| 2 | Library | C `library_study_chat` | **静かに**勉強しよう | ✓ |
| 3 | Library | N `librarian` ask_quiet keywords | **静か** appears in keywords list | ✓ |

*Pairs with 静粛 (#41): everyday adj vs formal noun form.*

---

### 93. 危ない (abunai) — dangerous

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | N `cook` ask_safety keywords | **危ない**、注意 (keyword list) | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_rules keywords | **危ない**、危険 (keyword list) | ✓ |
| 3 | Cooking Room | C `cooking_lesson_chat` | 칼이나 불 조심 — **危ない**ものに注意 | ✓ |

---

### 94. 畳 (tatami) — tatami mat

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | House | N `house_resident` ask_house | **畳**の匂いが大好きなんです | ✓ |
| 2 | House | S `house_kotatsu` | こたつで（**畳**の上で）あたたまろう | + add 畳 token to house_kotatsu sign text |
| 3 | House | O new `tatami_floor` lore | It's **畳** — traditional woven straw flooring | + add tatami_floor lore entry |

---

### 95. 階 (kai) — floor (of a building)

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Lobby | N `receptionist` ask_directions | 2**階**にございます | ✓ |
| 2 | Outdoor | N `outdoor_guide` ask_inside | 図書館やサロンは2**階**にありますよ | ✓ |
| 3 | Lobby | S `lobby_directory` | add 2**階** to directory sign text | + add 2階 token to lobby_directory |

---

### 96. 司書 (shisho) — librarian

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Library | O `librarian` lore | It's the **図書館員** — the librarian | ✓ (uses 図書館員 — update to 司書) |
| 2 | Library | N `librarian` ask_book | **司書**にお申し付けください | ✓ |
| 3 | Library | C `library_outlet_chat` | 사서 선생님한테 물어봐 — **司書**に聞いて | ✓ |

---

### 97. 材料 (zairyou) — ingredients / materials

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Salon | N `salon_staff` ask_crafts | **材料**はあちらにあります | ✓ |
| 2 | Cooking Room | N `cook` ask_cooking | **材料**を正確に量ること | ✓ |
| 3 | Cooking Room | S new `cooking_materials` | **材料**リスト (ingredients list sign) | + add a materials board sign to cooking_room |

---

### 98. 練習 (renshuu) — practice

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Cooking Room | N `cook` ask_cooking | **練習**あるのみですよ！ | ✓ |
| 2 | Salon | N `salon_staff` ask_crafts | **練習**したら上手になるよ | + add 練習 to salon_staff ask_crafts response |
| 3 | Library | N `librarian` ask_book | 読書も**練習**が大切 | + add 練習 to librarian ask_book response |

---

### 99. ぬぎましょう (nugimashou) — let's remove [shoes]

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Play Area | S `play_shoes` | くつを**ぬぎましょう** | ✓ |
| 2 | House | S `house_entrance` | くつをおぬぎください (polite variant) | ✓ |
| 3 | House | N `house_resident` ask_shoes | 玄関でくつを**ぬいで** | ✓ |

---

### 100. 建物 (tatemono) — building

| # | Room | Medium | Content | Status |
|---|------|--------|---------|--------|
| 1 | Outdoor | N `outdoor_guide` ask_inside | **建物**の中は左の入口から | ✓ |
| 2 | Lobby | O `info_desk` lore | This **建物** has 4 floors | + add 建物 to info_desk lore l2 |
| 3 | Street | O new `street_building` | The **建物** — 富山県こどもみらい館 | + add building lore to street room |

---

## Summary of Changes Needed

The following new content must be added to existing files to complete the three-exposure plan.
Items marked ✓ already exist; only the **+** items are listed here.

### npcs.js additions

| NPC | Intent | Change |
|-----|--------|--------|
| `librarian` | `ask_quiet` | Add 携帯電話 and 窓 references |
| `librarian` | `ask_food` | Add 固く禁止 phrasing |
| `librarian` | `ask_book` | Add 書棚 and 教科書 references; 練習 |
| `librarian` | `ask_outlet` | Add 許可 and 可 phrasing |
| `receptionist` | `ask_hours` | Use 開館, 終了, 本日 explicitly |
| `receptionist` | `ask_directions` | Add ロビー, 案内所, 2階 |
| `receptionist` | new `goodbye` | Add また お越しください |
| `play_staff` | `ask_rules` | Add 仲よく, 人 references |
| `salon_staff` | `ask_food` | Add お菓子 reference |
| `salon_staff` | `ask_crafts` | Add する (工作をする), 練習 |
| `outdoor_guide` | `ask_rules` | Add 以上, 道, ベンチ, 通ります, 安全 |
| `outdoor_guide` | `ask_inside` | Add 出口, 建物 |
| `gallery_curator` | `ask_exhibits` | Add 人形, 土日 references |
| `gallery_curator` | `ask_toys` | Add コーナー, 汽車 |
| `cook` | `ask_safety` | Add 安全, 手, 大人 |
| `cook` | `ask_cooking` | Add 台所 reference |
| `house_resident` | `ask_food` | Add 夕飯, メニュー, 料理室 |
| `house_resident` | `ask_house` | Add 玄関 reference |

### world_signs.js additions

| Sign | Change |
|------|--------|
| `lobby_directory` | Add 案内所 and 2階 tokens |
| `play_age` | Add 遊び場 to label or text |
| `salon_food` | Add サロン token to label |
| new `outdoor_safety` | New sign: 安全にご利用ください |
| new `cooking_materials` | New sign: 材料リスト (ingredients board) |
| `house_entrance` | Add 下駄箱 token |
| `house_kotatsu` | Add 畳 token |

### lore.js additions

| Object | Change |
|--------|--------|
| `bookshelf_obj` | Add 本 to l2 |
| `librarian` | Use 司書 as the Japanese label |
| `info_desk` | Add ロビー, 建物, 受付 to l2 |
| new `house_window` | Window lore for house room |
| new `tatami_floor` | Tatami lore for house room |
| new `street_bench` | Bench lore for street room |
| new `street_building` | Building exterior lore for street |

### conversations.js additions

| Conversation | Change |
|--------------|--------|
| `salon_food_chat` | Add ありがとう to turn 5 |
| `library_study_chat` | Add 書棚 to turn 2; 教科書 to turn 1; はい to turn 5 |
| `outdoor_zipline_chat` | Add また to final turn; 通ります to turn 2; 順番に |
| `gallery_explore_chat` | Add 汽車 reference; 画廊 label; hour detail with 時 |
| `library_outlet_chat` | (already covers 業務, 場合, 可 well) |
| `house_welcome_chat` | (already covers おかえりなさい, こたつ, 夕飯 well) |

---

## Pedagogical Notes

### Register pairs
Several words teach register contrasts — casual vs formal for the same meaning:
- **今日** (kyou, casual) vs **本日** (honjitsu, formal) — Tier 1 & 5
- **こども** (kodomo, plain) vs **お子様** (okosama, honorific) — Tier 4
- **静か** (shizuka, everyday adj) vs **静粛** (seishuku, institutional noun) — Tier 3 & 5

### Sign → NPC → Conversation arc
The canonical introduction order for rule vocabulary is:
1. Player reads the rule on a wall sign (passive visual)
2. Player asks the room's NPC about it (interactive)
3. Player overhears two NPCs discussing it (ambient reinforcement)

This arc is already complete for: 飲食, ジップライン, 展示品, コンセント/業務.
It needs to be completed for: 静粛, 許可, 固く, and several Tier 5 words.

### Spacing across rooms
Words whose three appearances all occur in the same room (e.g., 館内 in Library ×3)
are technically compliant but miss the cross-room reinforcement benefit.
A future pass should move at least one appearance of these words to an adjacent room:
- 館内 — add an appearance in Salon or Outdoor
- 関連/場合 — add an appearance in Lobby (receptionist directions context)
- こたつ — already spans house/outdoor conversations ✓
