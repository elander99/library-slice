// Teaching language tracker: 'ja' (Japanese) or 'ko' (Korean).
// LANG.current drives which sign data and NPC greetings are active.

const LANG = {
  current: (() => {
    try { return localStorage.getItem('lib2d-lang') || 'ja'; } catch { return 'ja'; }
  })(),
  set(lang) {
    this.current = lang;
    try { localStorage.setItem('lib2d-lang', lang); } catch {}
  }
};
