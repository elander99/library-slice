// CONTENT: Entity definitions and initial states
// Metadata (labels, icons, descriptions) lives here.
// Simulation behavior lives in engine/sim.js.

const ENTITY_DEFS = {
  laptop: {
    label: "ノートパソコン",
    label_en: "Laptop",
    icon: "💻",
    desc_en: "Your laptop. Battery at {battery}%.",
    initial: { battery: 42, on: false, plugged_in: false, task: null }
  },
  outlet: {
    label: "コンセント",
    label_en: "Outlet",
    icon: "⚡",
    desc_en: "A wall outlet. Governed by the outlet policy sign.",
    initial: { in_use: false }
  },
  textbook: {
    label: "教科書",
    label_en: "Textbook",
    icon: "📖",
    desc_en: "A Japanese textbook. Read it to complete your study goal.",
    initial: { in_hand: false, progress: 0 }
  },
  phone: {
    label: "携帯電話",
    label_en: "Phone",
    icon: "📱",
    desc_en: "Your phone. Be careful about the library's phone policy.",
    initial: { on_call: false, lookup_cooldown: 0 }
  },
  snack: {
    label: "お菓子",
    label_en: "Snack",
    icon: "🍘",
    desc_en: "A rice cracker from the convenience store. Delicious.",
    initial: { eaten: false }
  },
  librarian: {
    label: "図書館員",
    label_en: "Librarian",
    icon: "👩",
    desc_en: "The librarian. She keeps an eye on things.",
    initial: { mood: "neutral", alert: null }
  }
};
