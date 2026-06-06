// TDD: _first_meaning must reduce LLM-returned space-separated synonym lists to a single word.
// Extracts the live function from index.html so any regression in the source is caught here.

const fs   = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extractFirstMeaning() {
  const start = src.indexOf('function _first_meaning(s)');
  if (start === -1) throw new Error('_first_meaning not found in index.html');
  let depth = 0, i = start;
  while (i < src.length) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
    i++;
  }
  const fnSrc = src.slice(start, i + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${fnSrc})`)();
}

const _first_meaning = extractFirstMeaning();

describe('_first_meaning — existing separator rules (must not regress)', () => {
  test('single word unchanged',              () => expect(_first_meaning('warm')).toBe('warm'));
  test('slash-separated → first',            () => expect(_first_meaning('warmth/heat')).toBe('warmth'));
  test('slash with spaces → first',          () => expect(_first_meaning('go / leave')).toBe('go'));
  test('comma-separated → first',            () => expect(_first_meaning('warmth, heat')).toBe('warmth'));
  test('" or "-separated → first',           () => expect(_first_meaning('warmth or heat')).toBe('warmth'));
  test('null → null',                        () => expect(_first_meaning(null)).toBe(null));
  test('empty string → empty string',        () => expect(_first_meaning('')).toBe(''));
});

describe('_first_meaning — space-separated synonyms reduced to first word', () => {
  // The reported bug: 따뜻 looked up → model returns "warmth comfort heat"
  test('"warmth comfort heat" → "warmth"',   () => expect(_first_meaning('warmth comfort heat')).toBe('warmth'));
  test('"warm comfortable cozy" → "warm"',   () => expect(_first_meaning('warm comfortable cozy')).toBe('warm'));
  test('"fast quick swift" → "fast"',        () => expect(_first_meaning('fast quick swift')).toBe('fast'));
});

describe('_first_meaning — multi-word phrases with connectors kept intact', () => {
  // Two-word compounds must never be split
  test('"mobile phone" unchanged',           () => expect(_first_meaning('mobile phone')).toBe('mobile phone'));
  test('"phone call" unchanged',             () => expect(_first_meaning('phone call')).toBe('phone call'));
  test('"there is" unchanged',               () => expect(_first_meaning('there is')).toBe('there is'));
  // Three-word phrases where a connector is present must not be split
  test('"food and drink" unchanged',         () => expect(_first_meaning('food and drink')).toBe('food and drink'));
  test('"please be quiet" unchanged',        () => expect(_first_meaning('please be quiet')).toBe('please be quiet'));
  test('"in and out" unchanged',             () => expect(_first_meaning('in and out')).toBe('in and out'));
});
