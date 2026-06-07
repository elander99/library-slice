const SoundFX = (() => {
  let _ctx = null;
  function _ac() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    return _ctx;
  }
  function _tone(freq, dur, vol, delay, type) {
    try {
      const ac = _ac();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
      gain.gain.setValueAtTime(vol, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + dur);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + dur + 0.01);
    } catch(e) {}
  }
  return {
    ding()  { _tone(880, 0.18, 0.2, 0); },
    chime() {
      [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]].forEach(([f, d]) => _tone(f, 0.4, 0.18, d));
    },
    vocab() {
      [[660, 0], [990, 0.12]].forEach(([f, d]) => _tone(f, 0.25, 0.15, d));
    }
  };
})();
