// Scripted conversation turns must NOT show English translations inline.
// The .dlg-convo-en element lives inside .dlg-turn-npc; CSS hides it by default
// and reveals it when the player completes the sentence (.complete class).

const fs   = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function getCSSProp(selector, prop) {
  const esc = selector.replace(/[#.()\[\]:]/g, '\\$&');
  const re  = new RegExp(esc + '\\s*\\{[^}]*?\\b' + prop + '\\s*:\\s*([^;\\n}]+)', 's');
  const m   = html.match(re);
  return m ? m[1].trim() : null;
}

function extractFnBody(fnHeader) {
  const start = html.indexOf(fnHeader);
  if (start === -1) return null;
  let depth = 0, i = start, body = '';
  while (i < html.length) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (depth === 0) { body = html.slice(start, i + 1); break; } }
    i++;
  }
  return body;
}

// ── CSS: .dlg-convo-en is hidden by default ──────────────────────────────────

test('.dlg-convo-en is hidden by default (display:none)', () => {
  const display = getCSSProp('.dlg-convo-en', 'display');
  expect(display).toBe('none');
});

// ── CSS: English appears when sentence is completed ──────────────────────────

test('.dlg-turn-npc.complete .dlg-convo-en becomes visible when completed', () => {
  const display = getCSSProp('.dlg-turn-npc.complete .dlg-convo-en', 'display');
  expect(display).not.toBeNull();
  expect(display).not.toBe('none');
});

// ── Code: openConvo sets dataset.jp on npc_el for revealTranslation ──────────

test('openConvo sets dataset.jp on npc_el so revealTranslation can find it', () => {
  const body = extractFnBody('function openConvo(');
  expect(body).not.toBeNull();
  expect(body).toMatch(/npc_el\.dataset\.jp/);
});

// ── Code: openConvo uses convo_id as the tracking key ────────────────────────

test('openConvo assigns cur_npc_id = convo_id so revelations are persisted', () => {
  const body = extractFnBody('function openConvo(');
  expect(body).not.toBeNull();
  expect(body).toMatch(/cur_npc_id\s*=\s*convo_id/);
});

// ── Particle ordering: 밖에서/밖에 must precede 에서/에 ──────────────────────
// Without this, "카레라이스밖에서" splits as base="카레라이스밖", suffix="에서"
// instead of the correct base="카레라이스", suffix="밖에서".

test('_KO_PARTICLES lists 밖에서 before 에서 so compound-location words split correctly', () => {
  const start = html.indexOf('_KO_PARTICLES');
  const end   = html.indexOf('];', start);
  const list  = html.slice(start, end);
  const idx밖에서 = list.indexOf("'밖에서'");
  const idx에서   = list.indexOf("'에서'");
  expect(idx밖에서).toBeGreaterThan(-1);
  expect(idx에서).toBeGreaterThan(-1);
  expect(idx밖에서).toBeLessThan(idx에서);
});

test('_KO_PARTICLES lists 밖에 before 에 so standalone 밖에 splits correctly', () => {
  const start = html.indexOf('_KO_PARTICLES');
  const end   = html.indexOf('];', start);
  const list  = html.slice(start, end);
  const idx밖에 = list.indexOf("'밖에'");
  // Find '에' as a standalone particle (not part of '에서','에게', etc.)
  const idx에 = list.match(/'에'/)?.index ?? -1;
  expect(idx밖에).toBeGreaterThan(-1);
  expect(idx밖에).toBeLessThan(idx에 === -1 ? Infinity : idx에);
});
