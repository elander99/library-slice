const ObjectDescPopup = (() => {
  const popup  = document.getElementById('obj-popup');
  const wordEl = document.getElementById('obj-popup-word');
  const enEl   = document.getElementById('obj-popup-en');
  const descEl = document.getElementById('obj-popup-desc');
  let _timer   = null;

  function show(target_word, en_word, sx, sy, desc) {
    if (_timer) { clearTimeout(_timer); _timer = null; }
    wordEl.textContent = target_word;
    enEl.innerHTML = '';
    (en_word || '').split(/\s+/).filter(Boolean).forEach(w => {
      const span = document.createElement('span');
      span.className = 'obj-word';
      span.textContent = w;
      span.draggable = true;
      span.addEventListener('dragstart', e => {
        span.classList.add('drag-src');
        e.dataTransfer.setData('obj-label', w);
        e.dataTransfer.effectAllowed = 'copy';
      });
      span.addEventListener('dragend', () => span.classList.remove('drag-src'));
      enEl.appendChild(span);
    });
    descEl.textContent = desc || '';
    descEl.style.display = desc ? '' : 'none';
    popup.style.left = '-9999px'; popup.style.top = '-9999px';
    popup.classList.add('visible');
    const pw = popup.offsetWidth, ph = popup.offsetHeight;
    const x = Math.min(Math.max(sx - pw / 2, 8), window.innerWidth  - pw - 8);
    const y = Math.max(sy - ph - 20, 60);
    popup.style.left = x + 'px';
    popup.style.top  = y + 'px';
    _timer = setTimeout(hide, 5000);
  }

  function hide() {
    popup.classList.remove('visible');
    if (_timer) { clearTimeout(_timer); _timer = null; }
  }

  function show_for(id, sx, sy) {
    const npc = NPC_DEFS[id];
    if (npc) {
      const known = typeof JOURNAL_PROGRESS !== 'undefined' && JOURNAL_PROGRESS.get(id).met;
      const word = known ? (LANG.current === 'ko' && npc.name_ko ? npc.name_ko : npc.name_jp) : '？？？';
      show(word, known ? npc.name_en : '', sx, sy, npc.desc_en);
      return;
    }
    const def = ENTITY_DEFS[id];
    if (def) {
      const word = LANG.current === 'ko' && def.label_ko ? def.label_ko : def.label;
      show(word, def.label_en, sx, sy, def.desc_en);
      return;
    }
    const tile = TILE_DEFS[id];
    if (tile) {
      const word = LANG.current === 'ko' && tile.label_ko ? tile.label_ko : tile.label;
      show(word, tile.label_en, sx, sy, tile.desc_en);
    }
  }

  return { show, show_for, hide };
})();
