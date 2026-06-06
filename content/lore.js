// CONTENT: Scene lore
// Short English descriptions shown when clicking scene objects.
// Every token from the wall signs appears here with its English meaning.
// Format: English (Japanese) so the connection is immediately readable.
//
// Token distribution:
//   outlet    → 関連(related) する(to do) する のみ に 場合 許可
//   librarian → される(passive) ています(ongoing) 静粛 館内
//   phone     → ご遠慮(refrain) ください(please) 館内では
//   window    → 館内 して ください 静粛
//   bookshelf → 図書館 業務 飲食
//   laptop    → コンセント ご使用 のみ
//   snack     → 飲食 での 固く お断りします
//   textbook  → (no sign vocab needed)

const SCENE_LORE = {
  window_view: {
    l1: "It's a 窓 — a window.",
    l2: "Inside, keep it quiet, please."
  },
  house_window: {
    l1: "It's a 窓 — a window.",
    l2: "The view outside is peaceful. A moment to breathe."
  },
  bookshelf_obj: {
    l1: "It's a 書棚/서가 — a bookshelf.",
    l2: "本/책 — books. 검색 (search) the catalogue to find them. Library work only."
  },
  laptop: {
    l1: "It's your ノートパソコン.",
    l2: "Outlet use — library work only."
  },
  outlet: {
    l1: "It's a コンセント — an outlet.",
    l2: "Related work only — for cases permitted."
  },
  textbook: {
    l1: "It's your 教科書 — your textbook.",
    l2: "Reading it here is why you came."
  },
  phone: {
    l1: "It's your 携帯電話/휴대전화 — your phone.",
    l2: "In the building: 통화 (phone calls) — refrain, please."
  },
  snack: {
    l1: "It's an お菓子 — a rice cracker.",
    l2: "Eating/drinking in here — strictly off-limits."
  },
  librarian: {
    l1: "It's the 図書館員 — the librarian.",
    l2: "Ensures it is done, ongoing — quiet inside."
  },

  // Lobby
  info_desk: {
    l1: "It's the 案内所 — the information desk.",
    l2: "In the ロビー — the lobby. 접수 (reception) and info. Floor maps, event schedules, lost-and-found."
  },
  exit_door: {
    l1: "It's the 出口/출구 — the exit.",
    l2: "The main entrance and exit for the building."
  },

  // Play area
  shoe_rack: {
    l1: "It's a 下駄箱 — a shoe rack.",
    l2: "Remove your shoes before entering the play area."
  },
  play_gate: {
    l1: "It's the 入口/입구 — the entrance gate.",
    l2: "Small children must be accompanied by an adult."
  },

  // Salon
  craft_table: {
    l1: "It's a 工作台 — a craft table.",
    l2: "The salon hosts various craft activities. Take turns."
  },
  salon_seat: {
    l1: "It's a 椅子 — a chair.",
    l2: "The salon is mainly for upper elementary students and adults."
  },
  visitor_a: {
    l1: "It's 음식물 — food.",
    l2: "음식물 반입은 삼가 주세요 — no food in the salon."
  },
  visitor_b: {
    l1: "It's 음식물 — a drink.",
    l2: "음식물 반입은 삼가 주세요 — no drinks in the salon."
  },

  // Outdoor
  outdoor_bench: {
    l1: "It's a ベンチ — a bench.",
    l2: "A good spot to rest and watch the zipline."
  },
  zipline_post: {
    l1: "It's a ジップライン — a zipline.",
    l2: "Watch out — riders pass overhead. Stay clear of the path."
  },
};
