const SpeechBubble = (() => {
  const el       = document.getElementById('speech-bubble');
  const text_el  = document.getElementById('speech-bubble-text');
  const close_el = document.getElementById('speech-bubble-close');

  let _visible = false;
  let _dragging = false;
  let _drag_ox = 0, _drag_oy = 0;
  let _anchor_x = 0, _anchor_y = 0;
  let _user_dx = 0, _user_dy = 0; // persistent offset applied by user drag
  let _alert_key = null;
  let _cur_text = null;

  function _render_words(text, meta) {
    text_el.innerHTML = '';
    const words = text.split(/\s+/);
    words.forEach((word, wi) => {
      if (wi > 0) text_el.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'sb-word';
      span.textContent = word;
      span.addEventListener('click', e => {
        e.stopPropagation();
        if (_dragging) return;
        const npc = typeof NPC_DEFS !== 'undefined' ? NPC_DEFS[meta?.npc_id] : null;
        const ko = typeof LANG !== 'undefined' && LANG.current === 'ko';
        const _name_known = typeof JOURNAL_PROGRESS !== 'undefined' && JOURNAL_PROGRESS.get(meta?.npc_id).met;
        const npc_label = _name_known ? (ko ? (npc?.name_ko || '') : (npc?.name_en || '')) : '';
        if (typeof WorkspacePanel !== 'undefined')
          WorkspacePanel.open_npc_sentence(text, words, wi, npc_label, null, meta?.text_en || '');
      });
      text_el.appendChild(span);
    });
  }

  function _reposition() {
    const bw = el.offsetWidth, bh = el.offsetHeight;
    const HUD_H = 60, WS_H = 200;
    const nat_x = _anchor_x + _user_dx - bw / 2;
    const nat_y = _anchor_y + _user_dy - bh - 14;
    const x = Math.min(Math.max(nat_x, 8), window.innerWidth  - bw - 8);
    const y = Math.min(Math.max(nat_y, HUD_H), window.innerHeight - bh - WS_H);
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }

  // Called every frame by render2d when alert is active.
  // alert may have { key } (looks up DIALOGUE) or { text } (raw string).
  // meta (optional): { npc_id, text_en } — used for word-click context.
  function update(alert, screen_x, screen_y, meta) {
    let text, text_en;
    if (alert.text) {
      text = alert.text;
      text_en = meta?.text_en || '';
    } else {
      const dl = DIALOGUE[alert.key];
      if (!dl) return;
      text = LANG.current === 'ko' && dl.korean ? dl.korean : dl.japanese;
      text_en = dl.english || '';
    }
    const cache_key = alert.key || alert.text;
    if (text !== _cur_text) {
      _cur_text = text;
      _render_words(text, meta ? { ...meta, text_en } : { text_en });
    }
    if (cache_key !== _alert_key) {
      _alert_key = cache_key;
      _user_dx = 0; _user_dy = 0;
    }
    _anchor_x = screen_x;
    _anchor_y = screen_y;
    if (!_visible) { _visible = true; el.classList.add('visible'); }
    if (!_dragging) _reposition();
  }

  function hide() {
    if (!_visible) return;
    _visible = false; _dragging = false; _alert_key = null; _cur_text = null;
    el.classList.remove('visible', 'sb-dragging');
  }

  // Dragging
  el.addEventListener('pointerdown', e => {
    if (e.target === close_el) return;
    e.preventDefault();
    _dragging = true;
    el.setPointerCapture(e.pointerId);
    _drag_ox = e.clientX - el.offsetLeft;
    _drag_oy = e.clientY - el.offsetTop;
    el.classList.add('sb-dragging');
  });

  el.addEventListener('pointermove', e => {
    if (!_dragging) return;
    const bw = el.offsetWidth, bh = el.offsetHeight;
    const HUD_H = 60, WS_H = 200;
    const nx = e.clientX - _drag_ox;
    const ny = e.clientY - _drag_oy;
    const x = Math.min(Math.max(nx, 8), window.innerWidth  - bw - 8);
    const y = Math.min(Math.max(ny, HUD_H), window.innerHeight - bh - WS_H);
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    // Track user offset so reposition() respects where user dragged it
    _user_dx = (x + bw / 2) - _anchor_x;
    _user_dy = (y + bh + 14) - _anchor_y;
  });

  el.addEventListener('pointerup', () => {
    _dragging = false;
    el.classList.remove('sb-dragging');
  });

  close_el.addEventListener('click', () => {
    if (typeof sim !== 'undefined') {
      sim.state.librarian.alert = null;
      sim.state.convo_bubble = null;
    }
    hide();
  });

  return { update, hide };
})();
