// Fixed overlay buttons (vocab, settings) must sit above the workspace panel so they
// never cover interactive elements inside it.  The workspace is 190px tall when active,
// so any fixed button that could coincide with panel content needs bottom >= 190px.

const fs   = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Extract the first `bottom: <N>px` value from the primary CSS rule block for a selector.
// Uses the `s` (dotAll) flag so the block can span multiple lines.
function getBottomPx(selector) {
  const escaped = selector.replace(/[#.[\]]/g, '\\$&');
  const re = new RegExp(escaped + '\\s*\\{[^}]*?bottom\\s*:\\s*(\\d+)px', 's');
  const m = html.match(re);
  return m ? parseInt(m[1], 10) : null;
}

function getHeightPx(selector) {
  const escaped = selector.replace(/[#.[\]]/g, '\\$&');
  const re = new RegExp(escaped + '\\s*\\{[^}]*?height\\s*:\\s*(\\d+)px', 's');
  const m = html.match(re);
  return m ? parseInt(m[1], 10) : null;
}

const WORKSPACE_HEIGHT = getHeightPx('#workspace.active');

test('workspace active height is 190px', () => {
  expect(WORKSPACE_HEIGHT).toBe(190);
});

test('#settings-btn bottom clears the workspace panel', () => {
  const bottom = getBottomPx('#settings-btn');
  expect(bottom).not.toBeNull();
  expect(bottom).toBeGreaterThanOrEqual(WORKSPACE_HEIGHT);
});

test('#vocab-btn bottom clears the workspace panel', () => {
  const bottom = getBottomPx('#vocab-btn');
  expect(bottom).not.toBeNull();
  expect(bottom).toBeGreaterThanOrEqual(WORKSPACE_HEIGHT);
});
