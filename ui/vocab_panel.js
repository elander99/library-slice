  const VocabPanel = (() => {
    const STORE_KEY = 'vocab-list-v1';
    const panel      = document.getElementById("vocab-panel");
    const content    = document.getElementById("vocab-content");
    const logContent = document.getElementById("vocab-log-content");
    const btn        = document.getElementById("vocab-btn");
    const closeBtn   = document.getElementById("vocab-close");
    const sortBtn    = document.getElementById("vocab-sort-btn");
    const searchInput = document.getElementById("vocab-search");
    const titleEl    = document.getElementById("vocab-title");
    const tabWords   = document.getElementById("vocab-tab-words");
    const tabLog     = document.getElementById("vocab-tab-log");
    const dlg_inp  = document.getElementById("ws-dlg-input");
    const dlg_open = () => document.getElementById("ws-dialogue").classList.contains("open");

    let _cur_tab = 'words';

    let _words = []; // [{ text, reading, meaning }]

    function _load() {
      try { _words = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { _words = []; }
    }
    function _save() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(_words)); } catch {}
    }

    function _lookup(text) {
      const ko = LANG.current === 'ko';
      const signs = ko ? [...SIGNS_KO, ...WORLD_SIGNS_KO] : [...SIGNS, ...WORLD_SIGNS];
      for (const sign of signs) {
        for (const tok of (sign.tokens || [])) {
          const check = (t) => t.text === text ? { text, reading: t.romaji || t.furigana || '', meaning: t.meaning ? t.meaning.split('/')[0].trim().toLowerCase() : '' } : null;
          const found = check(tok) || (tok.parts || []).reduce((a, p) => a || check(p), null);
          if (found) return found;
        }
      }
      if (ko && _KO_FALLBACK[text]) {
        const def = _KO_FALLBACK[text];
        return { text, reading: def.reading || '', meaning: def.meaning ? def.meaning.split('/')[0].trim().toLowerCase() : '' };
      }
      const npe = NPC_VOCAB.getAll().find(e => e.text === text);
      if (npe) return { text, reading: npe.reading || '', meaning: npe.meaning ? npe.meaning.split('/')[0].trim().toLowerCase() : '' };
      return { text, reading: '', meaning: '' };
    }

    function _play_add_sound() {
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        [[880, 0, 0.22], [1320, 0.11, 0.28]].forEach(([freq, delay, dur]) => {
          const osc = ac.createOscillator(), g = ac.createGain();
          osc.connect(g); g.connect(ac.destination);
          osc.type = 'sine'; osc.frequency.value = freq;
          const t = ac.currentTime + delay;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.15, t + 0.012);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          osc.start(t); osc.stop(t + dur);
        });
      } catch {}
    }

    function _sort() {
      _words.sort((a, b) => a.text.localeCompare(b.text, 'ko'));
    }
    function _add(text) {
      if (_words.some(w => w.text === text)) return;
      _words.push(_lookup(text));
      _sort();
      _play_add_sound();
      _save(); _render();
    }
    function _remove(text) {
      _words = _words.filter(w => w.text !== text);
      _save(); _render();
    }
    function _refresh(text) {
      _load();
      const entry = _words.find(w => w.text === text);
      if (!entry || (entry.reading && entry.meaning)) return;
      const fresh = _lookup(text);
      let changed = false;
      if (!entry.reading && fresh.reading) { entry.reading = fresh.reading; changed = true; }
      if (!entry.meaning && fresh.meaning) { entry.meaning = fresh.meaning; changed = true; }
      if (changed) { _save(); _render(); }
    }

    function _render() {
      const ko = LANG.current === 'ko';
      titleEl.textContent = ko ? '단어장 — Word List' : '単語帳 — Word List';
      const counterEl = document.getElementById('vocab-counter');
      if (ko && counterEl) {
        const npcMap = new Map(NPC_VOCAB.getAll().map(e => [e.text, e]));
        const total = _words.length;
        const found = _words.filter(w => { const e = npcMap.get(w.text); return e && e.romaji && e.meaning_unlocked; }).length;
        counterEl.textContent = `${found} / ${total} words found`;
        counterEl.style.display = total ? '' : 'none';
      } else if (counterEl) {
        counterEl.style.display = 'none';
      }
sortBtn.style.display  = _words.length ? '' : 'none';
      content.innerHTML = '';

      if (!_words.length) {
        const hint = document.createElement('div');
        hint.id = 'vocab-drop-hint';
        hint.textContent = 'Drag word chips here\nto add them to your list.';
        hint.style.whiteSpace = 'pre-line';
        content.appendChild(hint);
        return;
      }

      const q = searchInput.value.trim().toLowerCase();
      let visible = q ? _words.filter(w => (w.text + ' ' + w.reading + ' ' + w.meaning).toLowerCase().includes(q)) : _words.slice();

      const CHO_CHARS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
      function _cho(text) {
        const cp = text && text.codePointAt(0);
        return (cp >= 0xAC00 && cp <= 0xD7A3) ? CHO_CHARS[Math.floor((cp - 0xAC00) / 588)] : null;
      }

      let _drag_idx = null;

      let lastCho = null;
      let prevWord = null;
      visible.forEach((w, vi) => {
        if (ko) {
          const wcho = _cho(w.text);
          if (wcho && wcho !== lastCho) {
            const div = document.createElement('div');
            div.className = 'vocab-cho-divider';
            div.textContent = wcho;
            content.appendChild(div);
            lastCho = wcho;
          }
        }

        const misplaced = ko && prevWord !== null && w.text.localeCompare(prevWord.text, 'ko') < 0;
        if (ko) prevWord = w;

        const row = document.createElement('div');
        row.className = 'vocab-row' + (misplaced ? ' vocab-row-misplaced' : '');
        row.dataset.idx = String(_words.indexOf(w));

        const handle = document.createElement('span');
        handle.className = 'vocab-drag-handle'; handle.textContent = '⠿'; handle.title = 'Drag to reorder';
        handle.draggable = true;
        handle.addEventListener('dragstart', e => {
          _drag_idx = _words.indexOf(w);
          e.dataTransfer.setData('vocab-reorder', String(_drag_idx));
          e.dataTransfer.effectAllowed = 'move';
          e.stopPropagation();
        });
        handle.addEventListener('dragend', () => {
          _drag_idx = null;
          content.querySelectorAll('.vocab-row').forEach(r => r.classList.remove('drag-over-above','drag-over-below'));
        });

        row.addEventListener('dragover', e => {
          if (!e.dataTransfer.types.includes('vocab-reorder')) return;
          e.preventDefault(); e.dataTransfer.dropEffect = 'move';
          const half = row.getBoundingClientRect().top + row.offsetHeight / 2;
          content.querySelectorAll('.vocab-row').forEach(r => r.classList.remove('drag-over-above','drag-over-below'));
          row.classList.add(e.clientY < half ? 'drag-over-above' : 'drag-over-below');
        });
        row.addEventListener('dragleave', e => {
          if (!row.contains(e.relatedTarget)) row.classList.remove('drag-over-above','drag-over-below');
        });
        row.addEventListener('drop', e => {
          if (!e.dataTransfer.types.includes('vocab-reorder')) return;
          e.preventDefault(); e.stopPropagation();
          row.classList.remove('drag-over-above','drag-over-below');
          const from = _drag_idx;
          if (from === null) return;
          const toWord = w;
          let toIdx = _words.indexOf(toWord);
          const half = row.getBoundingClientRect().top + row.offsetHeight / 2;
          if (e.clientY >= half) toIdx++;
          if (from === toIdx || from === toIdx - 1) return;
          const [moved] = _words.splice(from, 1);
          const insertAt = from < toIdx ? toIdx - 1 : toIdx;
          _words.splice(insertAt, 0, moved);
          _save(); _render();
        });

        const jp = document.createElement('span');
        jp.className = 'vocab-jp'; jp.textContent = w.text;
        jp.draggable = true;
        jp.addEventListener('dragstart', e => {
          e.dataTransfer.setData('dlg-word', w.text);
          e.dataTransfer.effectAllowed = 'copy';
          e.stopPropagation();
        });
        jp.addEventListener('click', () => {
          if (!dlg_open()) return;
          const s = dlg_inp.selectionStart ?? dlg_inp.value.length;
          const en = dlg_inp.selectionEnd ?? dlg_inp.value.length;
          dlg_inp.value = dlg_inp.value.slice(0, s) + w.text + dlg_inp.value.slice(en);
          dlg_inp.selectionStart = dlg_inp.selectionEnd = s + w.text.length;
          close_panel(); dlg_inp.focus();
        });

        const reading = document.createElement('span');
        reading.className = 'vocab-reading' + (w.reading ? '' : ' locked');
        reading.textContent = w.reading || '—';

        const meaning = document.createElement('span');
        meaning.className = 'vocab-meaning' + (w.meaning ? '' : ' locked');
        meaning.textContent = w.meaning || '—';
        if (w.meaning) {
          meaning.draggable = true;
          meaning.addEventListener('dragstart', e => {
            meaning.classList.add('drag-src');
            e.dataTransfer.setData('obj-label', w.meaning);
            e.dataTransfer.effectAllowed = 'copy';
            e.stopPropagation();
          });
          meaning.addEventListener('dragend', () => meaning.classList.remove('drag-src'));
        }

        const rm = document.createElement('button');
        rm.className = 'vocab-remove-btn'; rm.textContent = '×'; rm.title = 'Remove';
        rm.addEventListener('click', e => { e.stopPropagation(); _remove(w.text); });

        row.append(handle, jp, reading, meaning, rm);
        content.appendChild(row);
      });

      if (q && !visible.length) {
        const nm = document.createElement('p');
        nm.style.cssText = 'font-size:12px;color:#444;text-align:center;margin-top:40px;';
        nm.textContent = 'No matches.';
        content.appendChild(nm);
      }
    }

    function _render_log() {
      logContent.innerHTML = '';
      const q = searchInput.value.trim().toLowerCase();
      const sign_ids  = ENCOUNTER_PROGRESS.get_signs();
      const convo_ids = ENCOUNTER_PROGRESS.get_convos();

      if (!sign_ids.length && !convo_ids.length) {
        const empty = document.createElement('div');
        empty.className = 'vocab-log-empty';
        empty.textContent = 'Interact with signs and witness\nconversations to build your log.';
        logContent.appendChild(empty);
        return;
      }

      function _sign_text(s) {
        return [(s.label_en || s.label || ''), (s.japanese || '').replace(/\n/g, ' '), (s.translation || '')].join(' ').toLowerCase();
      }
      function _convo_text(c) {
        return [(c.title_en || ''), (c.title_ko || '')].join(' ').toLowerCase();
      }

      const vis_signs  = q ? sign_ids.filter(id  => { const s = SIGN_BY_ID[id];  return s && _sign_text(s).includes(q);  }) : sign_ids;
      const vis_convos = q ? convo_ids.filter(id => { const c = (typeof CONVERSATIONS !== 'undefined') && CONVERSATIONS[id]; return c && _convo_text(c).includes(q); }) : convo_ids;

      if (vis_signs.length) {
        const hdr = document.createElement('div');
        hdr.className = 'vocab-log-section-header';
        hdr.textContent = `Signs (${vis_signs.length})`;
        logContent.appendChild(hdr);

        vis_signs.forEach(id => {
          const s = SIGN_BY_ID[id]; if (!s) return;
          const label = s.label_en || s.label || id;
          const jp    = (s.japanese || '').split('\n')[0];

          const row = document.createElement('div');
          row.className = 'vocab-log-entry';
          const labelEl = document.createElement('span');
          labelEl.className = 'vocab-log-label';
          labelEl.textContent = label;
          const jpEl = document.createElement('span');
          jpEl.className = 'vocab-log-jp';
          jpEl.textContent = jp;
          row.append(labelEl, jpEl);
          row.addEventListener('click', () => {
            close_panel();
            if (typeof WorkspacePanel !== 'undefined') WorkspacePanel.open(id);
          });
          logContent.appendChild(row);
        });
      }

      if (vis_convos.length) {
        const hdr = document.createElement('div');
        hdr.className = 'vocab-log-section-header';
        hdr.textContent = `Conversations (${vis_convos.length})`;
        logContent.appendChild(hdr);

        vis_convos.forEach(id => {
          const c = (typeof CONVERSATIONS !== 'undefined') && CONVERSATIONS[id]; if (!c) return;
          const ko    = typeof LANG !== 'undefined' && LANG.current === 'ko';
          const title = ko ? (c.title_ko || c.title_en || id) : (c.title_en || c.title_ko || id);

          const row = document.createElement('div');
          row.className = 'vocab-log-entry';
          const labelEl = document.createElement('span');
          labelEl.className = 'vocab-log-label';
          labelEl.textContent = title;
          const countEl = document.createElement('span');
          countEl.className = 'vocab-log-jp';
          countEl.textContent = `${c.turns.length} lines`;
          row.append(labelEl, countEl);
          row.addEventListener('click', () => {
            close_panel();
            if (typeof DialoguePanel !== 'undefined') DialoguePanel.openConvo(id);
          });
          logContent.appendChild(row);
        });
      }

      if (q && !vis_signs.length && !vis_convos.length) {
        const nm = document.createElement('p');
        nm.style.cssText = 'font-size:12px;color:#444;text-align:center;margin-top:40px;';
        nm.textContent = 'No matches.';
        logContent.appendChild(nm);
      }
    }

    function _switch_tab(tab) {
      _cur_tab = tab;
      tabWords.classList.toggle('vocab-tab-active', tab === 'words');
      tabLog.classList.toggle('vocab-tab-active', tab === 'log');
      content.style.display    = tab === 'words' ? '' : 'none';
      logContent.style.display = tab === 'log'   ? '' : 'none';
      if (tab === 'words') {
        searchInput.placeholder = 'filter or type Korean + Enter to add…';
        sortBtn.style.display = _words.length ? '' : 'none';
        _render();
      } else {
        searchInput.placeholder = 'filter signs and conversations…';
        sortBtn.style.display = 'none';
        _render_log();
      }
    }

    tabWords.addEventListener('click', () => _switch_tab('words'));
    tabLog.addEventListener('click',   () => _switch_tab('log'));

    // Drop words onto the panel
    panel.addEventListener('dragover', e => {
      if (e.dataTransfer.types.includes('dlg-word')) { e.preventDefault(); panel.classList.add('drop-active'); }
    });
    panel.addEventListener('dragleave', e => {
      if (!panel.contains(e.relatedTarget)) panel.classList.remove('drop-active');
    });
    panel.addEventListener('drop', e => {
      const word = e.dataTransfer.getData('dlg-word');
      if (!word) return;
      e.preventDefault(); panel.classList.remove('drop-active');
      _add(word);
    });

    // Panel repositioning (drag header to snap left/right/top)
    const ANCHOR_KEY = 'vocab-anchor-v1';
    const snap_el = document.createElement('div'); snap_el.id = 'vocab-snap-preview'; snap_el.dataset.zone = ''; document.body.appendChild(snap_el);
    let _drag = null, _anchor = localStorage.getItem(ANCHOR_KEY) || 'left';
    function _apply_anchor(a) { _anchor = a; panel.dataset.anchor = a; try { localStorage.setItem(ANCHOR_KEY, a); } catch {} }
    function _snap_zone(x, y) { const sw = window.innerWidth, sh = window.innerHeight; if (x < sw*0.3) return 'left'; if (x > sw*0.7) return 'right'; if (y < sh*0.3) return 'top'; return null; }
    _apply_anchor(_anchor);
    document.getElementById('vocab-header').addEventListener('mousedown', e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      e.preventDefault(); _drag = { moved: false, x0: e.clientX, y0: e.clientY };
    });
    window.addEventListener('mousemove', e => {
      if (!_drag) return;
      if (!_drag.moved && Math.hypot(e.clientX-_drag.x0, e.clientY-_drag.y0) < 8) return;
      _drag.moved = true; panel.classList.add('dragging');
      snap_el.dataset.zone = _snap_zone(e.clientX, e.clientY) || '';
    });
    window.addEventListener('mouseup', e => {
      if (!_drag) return;
      const moved = _drag.moved; _drag = null; panel.classList.remove('dragging'); snap_el.dataset.zone = '';
      if (moved) { const z = _snap_zone(e.clientX, e.clientY); if (z) _apply_anchor(z); }
    });

    const statusEl = document.getElementById('vocab-add-status');
    let _status_timer = null;
    function _set_status(msg, color) {
      statusEl.textContent = msg; statusEl.style.color = color; statusEl.style.opacity = '1';
      clearTimeout(_status_timer);
      _status_timer = setTimeout(() => { statusEl.style.opacity = '0'; }, 2000);
    }

    function _isKorean(s) { return /[가-힣ᄀ-ᇿ㄰-㆏]/.test(s); }

    searchInput.addEventListener('keydown', async e => {
      if (e.key !== 'Enter') return;
      if (_cur_tab !== 'words') return;
      const text = searchInput.value.trim();
      if (!text || !_isKorean(text)) return;
      e.preventDefault();
      // Already in list?
      if (_words.some(w => w.text === text)) { _set_status('already in list', '#8a6838'); return; }
      // Try sync lookup first
      const sync = _lookup(text);
      if (sync.reading || sync.meaning) { _add(text); searchInput.value = ''; _render(); _set_status('added: ' + (sync.meaning || sync.reading), '#2d6a4f'); return; }
      // Try async (Ollama)
      _set_status('looking up…', '#8a6838');
      try {
        const def = await WorkspacePanel.lookup(text);
        if (def && (def.reading || def.meaning)) {
          _words.push({ text, reading: def.reading || '', meaning: def.meaning ? def.meaning.split('/')[0].trim().toLowerCase() : '' });
          _play_add_sound(); _save(); _render();
          searchInput.value = ''; _set_status('added: ' + (def.meaning || def.reading), '#2d6a4f');
        } else {
          _set_status('not found', '#c0392b');
        }
      } catch { _set_status('not found', '#c0392b'); }
    });

    searchInput.addEventListener('dragover', e => {
      if (e.dataTransfer.types.includes('dlg-word')) { e.preventDefault(); searchInput.classList.add('drag-over'); }
    });
    searchInput.addEventListener('dragleave', () => searchInput.classList.remove('drag-over'));
    searchInput.addEventListener('drop', e => {
      const word = e.dataTransfer.getData('dlg-word');
      if (!word) return;
      e.preventDefault(); e.stopPropagation();
      searchInput.classList.remove('drag-over');
      searchInput.value = word;
      searchInput.dispatchEvent(new Event('input'));
      searchInput.focus();
    });
    searchInput.addEventListener('input', () => { if (_cur_tab === 'words') _render(); else _render_log(); });
    sortBtn.addEventListener('click', () => { _sort(); _save(); _render(); });
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close_panel);
    panel.addEventListener('click', e => { if (e.target === panel) close_panel(); });

    function open() {
      _load();
      searchInput.value = '';
      if (_cur_tab === 'words') { sortBtn.style.display = _words.length ? '' : 'none'; _render(); }
      else _render_log();
      panel.classList.add('open');
    }
    function close_panel() { panel.classList.remove('open'); }
    return { open, close: close_panel, add: _add, refresh: _refresh };
  })();
