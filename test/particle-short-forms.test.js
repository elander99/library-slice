// Verifies that grammatical particles accept short-form meaning answers.
// e.g. typing "topic" for は (meaning "topic particle") must be accepted.
//
// Run: node test/particle-short-forms.test.js

const fs   = require('fs');
const path = require('path');

function matchesMeaning(meaningStr, input) {
  const norm = s => s.replace(/[?!.,]+$/, '');
  const val  = input.trim().toLowerCase();
  const val_ns = val.replace(/\s+/g, '');
  const parts = meaningStr.replace(/\(.*?\)/g, '').toLowerCase()
    .split(/\s*[/,]\s*/).map(p => norm(p.trim())).filter(Boolean);
  const v = norm(val), v_ns = norm(val_ns);
  if (parts.some(p => v === p || v_ns === p.replace(/\s+/g, ''))) return true;
  // Accept head noun of "X particle" / "X marker": "topic particle" → "topic"
  return parts.some(p => {
    const m = p.match(/^(.+)\s+(particle|marker)$/);
    return m && (v === m[1] || v_ns === m[1].replace(/\s+/g, ''));
  });
}

// Extract all token meanings from a content file by regex.
function extractMeanings(filename) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'content', filename), 'utf8');
  return [...src.matchAll(/meaning:\s*"([^"]+)"/g)].map(m => m[1]);
}

const allMeanings = [
  ...extractMeanings('signs.js'),
  ...extractMeanings('signs_ko.js'),
  ...extractMeanings('world_signs.js'),
  ...extractMeanings('world_signs_ko.js'),
];

// ── Rules ────────────────────────────────────────────────────────────────────
// Each entry: { pattern, shortForm, label }
// Any meaning that contains `pattern` must also accept `shortForm`.
const rules = [
  { pattern: /\btopic\s+(particle|marker)/i,      shortForm: 'topic',      label: 'topic particle/marker → "topic"' },
  { pattern: /\bpossessive\s+particle/i,           shortForm: 'possessive', label: 'possessive particle → "possessive"' },
  { pattern: /\bobject\s+marker/i,                 shortForm: 'object',     label: 'object marker → "object"' },
];

// ── Run ──────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const failures = [];

for (const rule of rules) {
  const matching = allMeanings.filter(m => rule.pattern.test(m));
  if (matching.length === 0) {
    fail++;
    failures.push(`No meanings found matching pattern: ${rule.pattern}`);
    continue;
  }
  for (const meaning of matching) {
    const ok = matchesMeaning(meaning, rule.shortForm);
    if (ok) {
      pass++;
    } else {
      fail++;
      failures.push(`"${rule.shortForm}" should match "${meaning}" (${rule.label})`);
    }
  }
}

if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) console.log(`  ✗ ${f}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
