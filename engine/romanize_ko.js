// Revised Romanization of Korean — deterministic syllable-by-syllable conversion.
// Handles: basic syllable romanization, consonant linking (연음), aspiration (격음화),
// and ㄹ liquidization (유음화).
//
// Hangul syllable block: U+AC00–U+D7A3
//   code_point - 0xAC00 = (initial_idx × 21 + vowel_idx) × 28 + final_idx

const romanizeKo = (() => {

  function decomp(cp) {
    if (cp < 0xAC00 || cp > 0xD7A3) return null;
    const o = cp - 0xAC00;
    return { i: Math.floor(o / 588), v: Math.floor((o % 588) / 28), f: o % 28 };
  }

  // Initial consonants (초성, indices 0–18)
  const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];

  // Vowels (중성, indices 0–20)
  const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];

  // Final consonants as heard at word-end or before another consonant
  const JONG_SND = [
    '',   // 0  (none)
    'k',  // 1  ㄱ
    'k',  // 2  ㄲ
    'k',  // 3  ㄳ
    'n',  // 4  ㄴ
    'n',  // 5  ㄵ
    'n',  // 6  ㄶ
    't',  // 7  ㄷ
    'l',  // 8  ㄹ
    'k',  // 9  ㄺ
    'm',  // 10 ㄻ
    'p',  // 11 ㄼ
    'l',  // 12 ㄽ
    'l',  // 13 ㄾ
    'p',  // 14 ㄿ
    'l',  // 15 ㅀ
    'm',  // 16 ㅁ
    'p',  // 17 ㅂ
    'p',  // 18 ㅄ
    't',  // 19 ㅅ
    't',  // 20 ㅆ
    'ng', // 21 ㅇ
    't',  // 22 ㅈ
    't',  // 23 ㅊ
    'k',  // 24 ㅋ
    't',  // 25 ㅌ
    'p',  // 26 ㅍ
    '',   // 27 ㅎ  (silent at word-end; participates in aspiration)
  ];

  // Final consonants as initial of next syllable when linking to a vowel-initial syllable (연음화)
  // The next syllable's ㅇ is silent, so the final consonant moves there.
  const JONG_LINK = [
    '',    // 0  (none)
    'g',   // 1  ㄱ
    'kk',  // 2  ㄲ
    'g',   // 3  ㄳ  → ㄱ moves
    'n',   // 4  ㄴ
    'j',   // 5  ㄵ  → ㅈ moves
    'n',   // 6  ㄶ  → ㄴ moves (ㅎ absorbed)
    'd',   // 7  ㄷ
    'r',   // 8  ㄹ
    'g',   // 9  ㄺ  → ㄱ moves
    'm',   // 10 ㄻ  → ㅁ moves
    'b',   // 11 ㄼ  → ㅂ moves
    's',   // 12 ㄽ  → ㅅ moves
    't',   // 13 ㄾ  → ㅌ moves
    'p',   // 14 ㄿ  → ㅍ moves
    'h',   // 15 ㅀ  → ㅎ moves
    'm',   // 16 ㅁ
    'b',   // 17 ㅂ
    'b',   // 18 ㅄ  → ㅂ moves
    's',   // 19 ㅅ
    'ss',  // 20 ㅆ
    'ng',  // 21 ㅇ
    'j',   // 22 ㅈ
    'ch',  // 23 ㅊ
    'k',   // 24 ㅋ
    't',   // 25 ㅌ
    'p',   // 26 ㅍ
    'h',   // 27 ㅎ
  ];

  // Aspiration when final meets ㅎ initial (index 18): [final_idx] → aspirated romanization
  const ASPIRATE_BEFORE_H = { 1:'k', 7:'t', 17:'p', 22:'ch' };
  // Aspiration when ㅎ final (index 27) meets various initials: [initial_idx] → romanization
  const H_FINAL_ASPIRATE   = { 0:'k', 3:'t', 7:'p', 9:'ss', 12:'ch' };

  // Sino-Korean (한자어) digit → Hangul, so the phonological rules run correctly.
  // Digit sequences are replaced before the syllable loop; 십일 → samsibil etc.
  const _OH = ['','일','이','삼','사','오','육','칠','팔','구'];
  const _TH = ['','십','이십','삼십','사십','오십','육십','칠십','팔십','구십'];
  function _digits_to_hangul(n) {
    if (n === 0) return '공';
    let r = '';
    if (n >= 1000) { const t = Math.floor(n / 1000); r += (t > 1 ? _OH[t] : '') + '천'; n %= 1000; }
    if (n >= 100)  { const h = Math.floor(n / 100);  r += (h > 1 ? _OH[h] : '') + '백'; n %= 100; }
    if (n >= 10)   { r += _TH[Math.floor(n / 10)];   n %= 10; }
    if (n > 0)     { r += _OH[n]; }
    return r;
  }

  // Native Korean (고유어) counter forms for clock hours 1–24
  const _NATIVE_HOUR = [
    null,
    '한','두','세','네','다섯','여섯','일곱','여덟','아홉','열',
    '열한','열두','열세','열네','열다섯','열여섯','열일곱','열여덟','열아홉',
    '스무','스물한','스물두','스물세','스물네'
  ];

  return function romanize(text) {
    if (!text) return '';
    // N시 (clock hours) use native Korean numbers, not Sino-Korean
    text = text.replace(/(\d+)시/g, (_, num) => {
      const n = parseInt(num, 10);
      const native = (n >= 1 && n <= 24) ? _NATIVE_HOUR[n] : null;
      return (native ? native : _digits_to_hangul(n)) + '시';
    });
    // Replace remaining digit runs with Sino-Korean Hangul before processing
    text = text.replace(/\d+/g, m => _digits_to_hangul(parseInt(m, 10)));
    const syls = [...text].map(ch => ({ cp: ch.codePointAt(0), d: decomp(ch.codePointAt(0)), cho: null }));
    const out = [];

    for (let i = 0; i < syls.length; i++) {
      const { cp, d } = syls[i];

      if (!d) {
        const ch = String.fromCodePoint(cp);
        if (/\p{P}|\p{S}/u.test(ch)) continue; // skip punctuation and symbols
        out.push(ch);
        continue;
      }

      const p  = i > 0 ? syls[i - 1].d : null;
      const ns = i + 1 < syls.length ? syls[i + 1] : null;
      const nd = ns?.d ?? null;

      // ── Initial ────────────────────────────────────────────────────────
      let cho;
      if (syls[i].cho !== null) {
        // Overridden by previous syllable's aspiration/liquidization rule
        cho = syls[i].cho;
      } else if (p && p.f !== 0 && d.i === 11) {
        // Linking (연음): this silent ㅇ receives previous syllable's final
        cho = JONG_LINK[p.f];
      } else {
        cho = CHO[d.i];
      }

      // ── Vowel ──────────────────────────────────────────────────────────
      const jung = JUNG[d.v];

      // ── Final ──────────────────────────────────────────────────────────
      let jong = '';
      if (d.f !== 0) {
        if (nd && nd.i === 11) {
          // Next syllable's ㅇ is silent → final links (suppress here; cho override above handles next)
          jong = '';
        } else if (nd) {
          if (nd.i === 18) {
            // Final + ㅎ initial → aspiration
            const asp = ASPIRATE_BEFORE_H[d.f];
            if (asp !== undefined) { jong = ''; ns.cho = asp; }
            else jong = JONG_SND[d.f];
          } else if (d.f === 27) {
            // ㅎ final + consonant initial → aspiration or silent
            const asp = H_FINAL_ASPIRATE[nd.i];
            if (asp !== undefined) { jong = ''; ns.cho = asp; }
            else jong = ''; // ㅎ final is otherwise silent before consonants
          } else if (d.f === 8 && nd.i === 2) {
            // ㄹ final + ㄴ initial → ll (유음화)
            jong = 'l'; ns.cho = 'l';
          } else if (d.f === 4 && nd.i === 5) {
            // ㄴ final + ㄹ initial → ll (유음화)
            jong = 'l'; ns.cho = 'l';
          } else {
            jong = JONG_SND[d.f];
          }
        } else {
          jong = JONG_SND[d.f];
        }
      }

      out.push(cho + jung + jong);
    }

    return out.join('').toLowerCase();
  };
})();
