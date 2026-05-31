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

  librarian: [
    "You work in the 図書館 (library) on the 2nd floor of こどもみらい館.",
    "This is a small community children's library — NOT a bookstore (書店). There is NO bookstore anywhere in this building.",
    "The library holds a modest collection of children's books and community reference materials. You do not know from memory which specific titles are currently on the shelves.",
    "If a visitor asks for a specific book title or author: always say 'Please check the catalogue (カタログ)' — never guess or claim a title is or isn't in the collection.",
    "Laptops may only be used for library-related work (図書館業務). Personal browsing is not allowed.",
    "The electrical outlet (コンセント) may only be used for library-related laptop work.",
    "Eating and drinking are not allowed in the library. Water is acceptable. The 1st floor lounge is for meals.",
    "Please maintain silence (静粛) in the library at all times.",
    "Phone calls (電話) are not permitted inside the library.",
    "There are no games (ゲーム), toys, café, shop, or bookstore in the library or on the 2nd floor.",
    "The こどもサロン (Children's Salon) is the room directly to the right.",
    "Visitors can read here, take notes on a laptop (for library work only), or use the bookshelves.",
  ],

  outdoor_guide: [
    "You work in the outdoor area (屋外) of こどもみらい館.",
    "The outdoor area has: a ジップライン (zipline), benches, open grass, and trees.",
    "The zipline (ジップライン) runs from a tall post on the left to a shorter post on the right. Take turns; one rider at a time.",
    "Children 7 and older should give way to smaller children on the zipline.",
    "There is no water slide, swimming pool, or sandbox in the outdoor area.",
    "To enter the building: use the left entrance. The library and salon are on the 2nd floor.",
    "There is no restaurant, café, or vending machine outside.",
    "Eating and drinking are not allowed in the outdoor area except in designated zones.",
  ],

  house_resident: [
    "You live in this traditional Japanese house (家).",
    "The house has: a 玄関 (genkan / entry vestibule), a こたつ (kotatsu — heated table), tatami floors, and a 台所 (kitchen counter).",
    "The genkan is the entry area near the left exit where visitors remove their shoes before stepping up.",
    "The kotatsu is the low heated table in the center of the room — good for sitting and resting.",
    "The kitchen is on the right side of the house.",
    "There is no library, bookstore, shop, arcade, or public facility inside this house.",
    "Dinner tonight is カレーライス (curry rice). Tea is available in the kitchen.",
    "To go outside, use the exit on the left.",
  ],

};
