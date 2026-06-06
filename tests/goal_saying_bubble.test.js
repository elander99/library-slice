// TDD: Goal sayings (goal.say_ko) must NOT set convo_bubble.
//
// convo_bubble is the sim-state field that render2d checks to decide whether
// to show a speech bubble floating above an NPC's head.  When _advance_convo
// detects a goal saying it must NOT write to convo_bubble — the saying should
// be stored in ambient history via addAmbient, but nothing should float above
// the NPC.  Only scripted conversation turns (from CONVERSATIONS) may set
// convo_bubble.

const { _advance_convo } = require('../engine/input2d.js');

// ── fixtures ─────────────────────────────────────────────────────────────────

function makeState(goal_idx = 0) {
  return {
    state: {
      convo_bubble: null,
      npc_states: { visitor_b: { goal_idx, px: 100, py: 100 } }
    }
  };
}

const GOALS_WITH_SAY = [
  { col: 48, row: 11, pause_ms: 12000, say_ko: '집중해서 일하는 중이에요.', say_en: 'Working, trying to focus.' },
  { col: 51, row: 20, pause_ms:  3000, say_ko: '아래쪽 책 보고 있어요.',    say_en: 'Looking at the lower shelves.' },
];

const NPC_DEF = {
  npc_id: 'visitor_b', ambient: true,
  convo:  'library_outlet_chat',
  goals:  GOALS_WITH_SAY,
};

const ROOM = { npcs: [NPC_DEF] };

const MOCK_CONVERSATIONS = {
  library_outlet_chat: {
    title_ko: '콘센트 대화',
    turns: [
      { npc_id: 'visitor_a', name_ko: '방문객 A', name_en: 'Visitor A', ko: '노트북 충전해도 될까?',    en: 'Can I charge my laptop?' },
      { npc_id: 'visitor_b', name_ko: '방문객 B', name_en: 'Visitor B', ko: '도서관 업무에만 쓰세요.', en: 'Library use only.' },
    ]
  }
};

// ── setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  global.CONVERSATIONS = MOCK_CONVERSATIONS;
  global.DialoguePanel  = { addAmbient: jest.fn() };
});

afterEach(() => {
  delete global.CONVERSATIONS;
  delete global.DialoguePanel;
});

// ── goal saying: no convo_bubble ──────────────────────────────────────────────

describe('_advance_convo: goal saying leaves convo_bubble null', () => {
  test('convo_bubble is null after goal[0] (say_ko present)', () => {
    const S = makeState(0);
    _advance_convo(S, ROOM, 'visitor_b');
    expect(S.state.convo_bubble).toBeNull();
  });

  test('convo_bubble is null after goal[1] (say_ko present)', () => {
    const S = makeState(1);
    _advance_convo(S, ROOM, 'visitor_b');
    expect(S.state.convo_bubble).toBeNull();
  });
});

// ── goal saying: addAmbient is still called ───────────────────────────────────

describe('_advance_convo: goal saying is still forwarded to addAmbient', () => {
  test('addAmbient receives npc_id, ko text, en text for goal[0]', () => {
    const S = makeState(0);
    _advance_convo(S, ROOM, 'visitor_b');
    expect(global.DialoguePanel.addAmbient).toHaveBeenCalledWith(
      'visitor_b',
      '집중해서 일하는 중이에요.',
      'Working, trying to focus.'
    );
  });

  test('addAmbient receives the correct say_ko for goal[1]', () => {
    const S = makeState(1);
    _advance_convo(S, ROOM, 'visitor_b');
    expect(global.DialoguePanel.addAmbient).toHaveBeenCalledWith(
      'visitor_b',
      '아래쪽 책 보고 있어요.',
      'Looking at the lower shelves.'
    );
  });
});

// ── silent goal: falls through to convo path and sets convo_bubble ────────────

describe('_advance_convo: goal without say_ko falls through to conversation', () => {
  test('convo_bubble is set from the conversation when goal has no say_ko', () => {
    const silent_npc_def = {
      ...NPC_DEF,
      goals: [{ col: 48, row: 11, pause_ms: 5000 }]  // no say_ko
    };
    const S = makeState(0);
    _advance_convo(S, { npcs: [silent_npc_def] }, 'visitor_b');
    expect(S.state.convo_bubble).not.toBeNull();
    expect(S.state.convo_bubble).toHaveProperty('convo_id', 'library_outlet_chat');
  });
});
