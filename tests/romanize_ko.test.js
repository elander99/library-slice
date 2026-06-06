// Tests for romanizeKo digit-to-Sino-Korean conversion.
// Numerals like "31" should never pass through as "31" — they should be
// converted to Sino-Korean Hangul first so the phonological rules run.

const fs   = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'engine', 'romanize_ko.js'), 'utf8');
// eslint-disable-next-line no-new-func
const romanizeKo = new Function(src + '; return romanizeKo')();

describe('romanizeKo — digit conversion (Sino-Korean)', () => {
  // Stand-alone digits
  test('0  → gong',    () => expect(romanizeKo('0')).toBe('gong'));
  test('1  → il',      () => expect(romanizeKo('1')).toBe('il'));
  test('9  → gu',      () => expect(romanizeKo('9')).toBe('gu'));
  test('10 → sip',     () => expect(romanizeKo('10')).toBe('sip'));

  // 연음 (linking) between digits and following syllables
  // 11 = 십일 → ㅂ of 십 links into ㅇ of 일 → "sibil"
  test('11 → sibil',     () => expect(romanizeKo('11')).toBe('sibil'));
  // 12 = 십이 → ㅂ links into ㅇ of 이 → "sibi"
  test('12 → sibi',      () => expect(romanizeKo('12')).toBe('sibi'));
  // 20 = 이십 → "isip"
  test('20 → isip',      () => expect(romanizeKo('20')).toBe('isip'));
  // 31 = 삼십일 → ㅂ links → "samsibil"
  test('31 → samsibil',  () => expect(romanizeKo('31')).toBe('samsibil'));

  // Embedded in a word — the original bug
  // 31일 = 삼십일(31) + 일(日) → 삼십일일 → ㄹ of first 일 links into second 일 → "samsibilril"
  test('31일 does not contain raw digit', () => expect(romanizeKo('31일')).not.toMatch(/\d/));
  test('31일 → samsibiril',               () => expect(romanizeKo('31일')).toBe('samsibiril'));

  // Larger numbers
  test('100 → baek',      () => expect(romanizeKo('100')).toBe('baek'));
  test('200 → ibaek',     () => expect(romanizeKo('200')).toBe('ibaek'));
  test('1000 → cheon',    () => expect(romanizeKo('1000')).toBe('cheon'));
  test('2024 → icheonisipsa',   () => expect(romanizeKo('2024')).toBe('icheonisipsa'));
});
