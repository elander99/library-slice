// TDD: The HUD room-name label (e.g. 거리 on the street screen) must be
// draggable as a Korean word chip so the player can drop it onto the vocab panel.
//
// Currently the dragstart handler only sets 'obj-label' (English), which
// lets the player drop the English name onto meaning slots.  In Korean mode
// the Korean text must also be emitted as 'dlg-word' so VocabPanel.drop
// can catch it and add 거리 to the word list.
//
// Contract (all three assertions must pass):
//   1. dragstart checks LANG.current for Korean mode
//   2. dragstart sets 'dlg-word' (the data-transfer key the vocab panel listens on)
//   3. it sources the word text from _hud_room_btn.text (the Korean label)

const fs   = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'engine', 'input2d.js'), 'utf8');

// Narrow to the dragstart handler so we don't get false positives from
// other parts of the file.
const dragStartIdx = src.indexOf("'dragstart'");
const dragEnd      = src.indexOf("this._drag_down = null;", dragStartIdx + 1);
const dragSrc      = src.slice(dragStartIdx, dragEnd + 24);

describe('street label drag: HUD room button emits dlg-word in Korean mode', () => {
  test('dragstart handler checks LANG.current for Korean', () => {
    expect(dragSrc).toMatch(/LANG\s*\.\s*current\s*===?\s*['"]ko['"]/);
  });

  test("dragstart handler calls e.dataTransfer.setData('dlg-word', ...)", () => {
    expect(dragSrc).toMatch(/setData\s*\(\s*['"]dlg-word['"]/);
  });

  test('dlg-word value is sourced from _hud_room_btn.text (the Korean label)', () => {
    expect(dragSrc).toMatch(/_hud_room_btn\s*\.\s*text/);
  });
});
