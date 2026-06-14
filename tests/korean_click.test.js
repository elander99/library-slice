// TDD: Any Korean text visible in the game must be clickable and open
// the workspace panel so the player can look up reading and meaning.
//
// Three surfaces are tested:
//   1. openConvo — DialoguePanel.openConvo() renders NPC-to-NPC conversations
//   2. SpeechBubble — the floating bubble above an ambient NPC's head
//   3. input2d click routing — ambient NPC clicks must open the conversation view

const fs   = require('fs');
const path = require('path');

const dialogueSrc    = fs.readFileSync(path.join(__dirname, '..', 'ui', 'dialogue_panel.js'), 'utf8');
const speechBubbleSrc = fs.readFileSync(path.join(__dirname, '..', 'ui', 'speech_bubble.js'), 'utf8');
const input2d        = fs.readFileSync(path.join(__dirname, '..', 'engine', 'input2d.js'), 'utf8');

// Extract source of openConvo function from dialogue_panel.js
const openConvoStart = dialogueSrc.indexOf('function openConvo');
const openConvoEnd   = (() => {
  let depth = 0, i = openConvoStart;
  while (i < dialogueSrc.length) {
    if (dialogueSrc[i] === '{') depth++;
    else if (dialogueSrc[i] === '}') { depth--; if (depth === 0) return i + 1; }
    i++;
  }
  return dialogueSrc.length;
})();
const openConvoSrc = openConvoStart === -1 ? '' : dialogueSrc.slice(openConvoStart, openConvoEnd);

// ── 1. openConvo word rendering ──────────────────────────────────────────────
// DialoguePanel.openConvo() renders each Korean turn with individually
// clickable word spans that open the workspace panel.

describe('openConvo: Korean conversation words are individually clickable', () => {
  test('each turn word is wrapped in a span with class dlg-word', () => {
    expect(openConvoSrc).toMatch(/className\s*=\s*['"]dlg-word['"]/);
  });

  test('dlg-word spans have a click event listener', () => {
    expect(openConvoSrc).toMatch(/addEventListener\s*\(\s*['"]click['"]/);
  });

  test('the click handler calls WorkspacePanel.open_npc_sentence', () => {
    expect(openConvoSrc).toMatch(/WorkspacePanel\.open_npc_sentence/);
  });
});

// ── 2. SpeechBubble ──────────────────────────────────────────────────────────

describe('SpeechBubble: ambient conversation words are individually clickable', () => {
  test('each word is wrapped in a span with class sb-word', () => {
    expect(speechBubbleSrc).toMatch(/className\s*=\s*['"]sb-word['"]/);
  });

  test('sb-word spans have a click event listener', () => {
    expect(speechBubbleSrc).toMatch(/addEventListener\s*\(\s*['"]click['"]/);
  });

  test('the click handler calls WorkspacePanel.open_npc_sentence', () => {
    expect(speechBubbleSrc).toMatch(/WorkspacePanel\.open_npc_sentence/);
  });
});

// ── 3. input2d routing ───────────────────────────────────────────────────────
// When the player clicks an ambient NPC that has a scripted conversation
// (npc_def.convo), input2d must open the full conversation view so all turns
// are visible and every Korean word is clickable.

describe('input2d: clicking an ambient NPC with a convo opens the conversation view', () => {
  test('ambient NPC click path calls DialoguePanel.openConvo', () => {
    expect(input2d).toMatch(/DialoguePanel\.openConvo\s*\(/);
  });

  test('DialoguePanel.openConvo is passed the convo id from npc_def', () => {
    // Accept npc_def?.convo or npc_def.convo as first arg (may have trailing args)
    expect(input2d).toMatch(
      /DialoguePanel\.openConvo\s*\(\s*npc_def\s*\??\.convo\b|DialoguePanel\.openConvo\s*\(\s*convo_id\b/
    );
  });
});
