// CONTENT: NPC dialogue and notification text
// All human-readable strings live here.
// Nothing in this file contains game logic.

const DIALOGUE = {
  outlet_notice: {
    japanese: "あの、コンセントは図書館業務のみにお使いください。",
    korean:   "저, 콘센트는 도서관 업무용으로만 사용해 주세요.",
    english: "Excuse me — the outlet is for library use only."
  },
  phone_notice: {
    japanese: "お静かにお願いします。携帯電話はご遠慮ください。",
    korean:   "조용히 해 주세요. 도서관에서 통화는 삼가 주세요.",
    english: "Please keep it down. No phone calls in the library."
  },
  food_notice: {
    japanese: "申し訳ありませんが、館内での飲食はご遠慮ください。",
    korean:   "죄송합니다만, 관내에서 음식물 섭취는 금지되어 있습니다.",
    english: "I'm sorry, but eating inside the library is not permitted."
  },
  librarian_greeting: {
    japanese: "いらっしゃいませ。ごゆっくりどうぞ。",
    korean:   "어서 오세요. 편하게 이용해 주세요.",
    english: "Welcome. Please take your time."
  },
  goal_complete: {
    japanese: "よく頑張りました！",
    korean:   "잘 하셨어요! 학습 목표 달성!",
    english: "Well done! Study goal complete."
  },
  notes_complete: {
    japanese: "ノートが完成しました！",
    korean:   "필기 완료!",
    english: "Notes complete! +15 充実感"
  },
  session_end_high: {
    japanese: "充実した時間でした。また来てください。",
    korean:   "충실한 시간이었습니다. 또 오세요.",
    english: "A fulfilling session. Please come again."
  },
  session_end_low: {
    japanese: "次回はルールをお守りください。",
    korean:   "다음에는 규칙을 잘 지켜 주세요.",
    english: "Please observe the library rules next time."
  },

  // Violation notification text (shown in the log)
  violations: {
    outlet_requires_library_task: "The librarian noticed your laptop use.",
    no_phone_calls: "Everyone in the room looked over.",
    no_food_drink: "The librarian asked you to stop."
  },

  // Action menu labels (button text)
  actions: {
    turn_on_laptop: "Turn on",
    turn_off_laptop: "Turn off",
    plug_in_laptop: "Plug into outlet",
    unplug_laptop: "Unplug",
    set_task_library: "Use for library work",
    set_task_personal: "Browse internet",
    pick_up_textbook: "Pick up",
    put_down_textbook: "Put down",
    start_reading: "Read",
    stop_reading: "Stop reading",
    make_call: "Make a call",
    end_call: "End call",
    eat_snack: "Eat snack",
    talk_to_librarian: "Say hello"
  }
};
