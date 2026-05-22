// CONTENT: NPC dialogue and notification text
// All human-readable strings live here.
// Nothing in this file contains game logic.

const DIALOGUE = {
  outlet_notice: {
    japanese: "あの、コンセントは図書館業務のみにお使いください。",
    english: "Excuse me — the outlet is for library use only."
  },
  phone_notice: {
    japanese: "お静かにお願いします。携帯電話はご遠慮ください。",
    english: "Please keep it down. No phone calls in the library."
  },
  food_notice: {
    japanese: "申し訳ありませんが、館内での飲食はご遠慮ください。",
    english: "I'm sorry, but eating inside the library is not permitted."
  },
  librarian_greeting: {
    japanese: "いらっしゃいませ。ごゆっくりどうぞ。",
    english: "Welcome. Please take your time."
  },
  goal_complete: {
    japanese: "よく頑張りました！",
    english: "Well done! Study goal complete."
  },
  notes_complete: {
    japanese: "ノートが完成しました！",
    english: "Notes complete! +15 充実感"
  },
  session_end_high: {
    japanese: "充実した時間でした。また来てください。",
    english: "A fulfilling session. Please come again."
  },
  session_end_low: {
    japanese: "次回はルールをお守りください。",
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
