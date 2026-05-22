// Per-NPC knowledge bases for generative dialogue.
// Facts are passed as context to Llama so NPCs can answer open-ended questions.

const NPC_KNOWLEDGE = {

  receptionist: [
    "This building is 富山県こどもみらい館 (Toyama Children's Future Hall) in Toyama City.",
    "1F (this floor): reception desk, おもちゃ画廊 (Toy Gallery — display of historic and artistic toys), 人形画廊 (Doll Gallery — display of traditional dolls).",
    "2F: 図書館 (library), こどもサロン (Children's Salon — craft and art activities), 料理室 (cooking room — scheduled classes), 研修室 (training room — workshops).",
    "Outdoor area: ジップライン (zipline), benches, open grass space.",
    "Opening hours: 9:00–17:00. Last entry 16:30. Closed on Tuesdays (火曜日).",
    "Elevator (エレベーター) is available to reach the 2nd floor.",
    "There are no video games, arcade games, or electronic game machines (ビデオゲーム, ゲーム機, テレビゲーム) anywhere in this building.",
    "The toys (おもちゃ) in the Toy Gallery are display exhibits — they are not for playing with.",
    "For hands-on play, the 遊び場 (play area) is on this floor between the lobby and the library.",
    "Visitor registration (利用登録) is handled here at the reception desk; bring your ID.",
    "There is no cafeteria or restaurant; eating is only permitted in designated lounge areas.",
    "Admission is free.",
  ],

  play_staff: [
    "You work in the 遊び場 (play area / soft play zone) between the lobby and the library.",
    "The play area has soft play structures, a ball pit area, and climbing equipment for young children.",
    "Age guidance: mainly for children ages 3 to 6. Children 7 and above should give way to smaller children.",
    "Shoes must be removed at the 下駄箱 (shoe rack) before entering. Socks are fine to keep on.",
    "Small children must be accompanied by a guardian (保護者) at all times.",
    "Do not run; take turns with equipment.",
    "There are no video games or electronic games (ゲーム, ゲーム機) in the play area.",
    "Physical toys on display can be found in the おもちゃ画廊 (Toy Gallery) in the lobby — but those are exhibits, not for play.",
    "For craft activities, the こどもサロン (Children's Salon) is on the 2nd floor.",
    "The ジップライン (zipline) is outside in the outdoor area.",
  ],

  salon_staff: [
    "You work in the こどもサロン (Children's Salon) on the 2nd floor.",
    "The salon is mainly for upper elementary school students (小学校高学年) and older; younger children are welcome with a guardian.",
    "There are 工作台 (craft tables) with art and craft supplies: scissors, glue, paper, cardstock, coloring materials.",
    "Different craft activities run on different days; today the craft table is open for free use.",
    "Eating and drinking are not allowed in the salon. Water is fine. The 1st floor lounge is for meals.",
    "Share tools and equipment; return everything to its place when done.",
    "There are no video games or electronic games (ゲーム) in the salon.",
    "The 図書館 (library) is directly to the left.",
    "The outdoor play area and ジップライン (zipline) are accessible by going through the library and past the salon.",
  ],

  outdoor_guide: [
    "You are a guide for the outdoor play area of 富山県こどもみらい館.",
    "The main attraction is the ジップライン (zipline), which runs diagonally across the outdoor area.",
    "The zipline is for elementary school students (小学生) and above. Preschoolers (未就学児) need an adult with them.",
    "Always follow staff instructions before and during zipline use.",
    "Never stand under the zipline cable — passing riders are a serious hazard.",
    "Do not run on the outdoor area surfaces — it is easy to fall.",
    "There are ベンチ (benches) for resting. Toilets (トイレ) are inside the building.",
    "Stay hydrated, especially in warm weather.",
    "There are trees, open grass, and general outdoor space for free play.",
    "There are no electronic games (ゲーム) or toys in the outdoor area; it is an active outdoor play space.",
  ],

  librarian: [
    "You work in the 図書館 (library) on the 2nd floor.",
    "The library has bookshelves with a range of books. Use the catalogue (カタログ) to find specific titles.",
    "Laptops may only be used for library-related work (図書館業務). Personal browsing is not allowed.",
    "The electrical outlet (コンセント) may only be used for library-related laptop work.",
    "Eating and drinking are not allowed in the library. Water is acceptable. The 1st floor lounge is for meals.",
    "Please maintain silence (静粛) in the library at all times.",
    "Phone calls (電話) are not permitted inside the library.",
    "There are no games (ゲーム) or toys in the library.",
    "The こどもサロン (Children's Salon) is the room directly to the right.",
    "Visitors can read here, take notes on a laptop (for library work only), or use the bookshelves.",
  ],

};
