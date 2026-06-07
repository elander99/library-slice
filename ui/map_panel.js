  const MapPanel = (() => {
    const panel    = document.getElementById('map-panel');
    const content  = document.getElementById('map-content');
    const btn      = document.getElementById('map-btn');
    const close_btn = document.getElementById('map-close');
    const title_el = document.getElementById('map-title');

    const ROOM_ORDER = ['street','lobby','play_area','gallery','library','salon','cooking_room','outdoor','house'];

    function _sign_progress(room_id) {
      const room = ROOM_MAP_DATA[room_id];
      if (!room) return { done: 0, total: 0 };
      let done = 0, total = 0;
      for (const sr of (room.signs || [])) {
        const sign = SIGN_BY_ID[sr.sign_id];
        if (!sign) continue;
        const prog = WORD_PROGRESS.getSign(sr.sign_id);
        (sign.tokens || []).forEach((tok, i) => {
          total++;
          if (tok.parts && tok.parts.length) {
            // Compound token: progress lives on part keys ("0p0", "0p1", …), not the token key
            if (tok.parts.some((_, pi) => { const r = prog[`${i}p${pi}`] || {}; return r.romaji || r.meaning; }))
              done++;
          } else {
            const r = prog[i] || {};
            if (r.romaji || r.meaning) done++;
          }
        });
      }
      return { done, total };
    }

    function _render() {
      const ko = LANG.current === 'ko';
      title_el.textContent = ko ? '진행 상황' : '進捗マップ';
      const current = sim.state.room;
      content.innerHTML = '';
      for (const room_id of ROOM_ORDER) {
        const room = ROOM_MAP_DATA[room_id];
        if (!room) continue;
        const { done, total } = _sign_progress(room_id);
        const pct = total > 0 ? Math.round(done / total * 100) : 0;
        const is_here = room_id === current;

        const row = document.createElement('div');
        row.className = 'map-room-row';

        const hdr = document.createElement('div');
        hdr.className = 'map-room-header';

        const name = document.createElement('span');
        name.className = 'map-room-name' + (is_here ? ' current' : '');
        name.textContent = (is_here ? '▶ ' : '') + (ko ? room.name_ko : room.name_jp);

        const right = document.createElement('span');
        right.style.cssText = 'display:flex;align-items:baseline;gap:8px;';

        const count = document.createElement('span');
        count.className = 'map-room-sub';
        count.textContent = total > 0 ? `${done}/${total}` : '';

        const pct_el = document.createElement('span');
        pct_el.className = 'map-room-pct';
        pct_el.textContent = total > 0 ? `${pct}%` : '—';

        right.append(count, pct_el);
        hdr.append(name, right);

        const bar = document.createElement('div');
        bar.className = 'map-room-bar';
        const fill = document.createElement('div');
        fill.className = 'map-room-fill' + (pct === 100 && total > 0 ? ' done' : '');
        fill.style.width = pct + '%';
        bar.appendChild(fill);

        row.append(hdr, bar);

        row.addEventListener('click', () => {
          // Find first sign in the room that has any incomplete token
          const rm = ROOM_MAP_DATA[room_id];
          const room_signs = rm ? (rm.signs || []) : [];
          let target_col = null;
          for (const sr of room_signs) {
            const sign = SIGN_BY_ID[sr.sign_id];
            if (!sign) continue;
            const prog = WORD_PROGRESS.getSign(sr.sign_id);
            const incomplete = (sign.tokens || []).some((tok, i) => {
              const r = prog[i] || {};
              return !r.romaji || !r.meaning;
            });
            if (incomplete) { target_col = sr.col; break; }
          }
          // Fall back to first sign if all done
          if (target_col === null && room_signs.length > 0) target_col = room_signs[0].col;
          const warp_px = ((target_col !== null ? target_col : 10) + 0.5) * TS;
          sim.warp_to(room_id, warp_px, 7 * TS);
          close_panel();
        });

        content.appendChild(row);
      }
    }

    // Panel repositioning (same snap behaviour as VocabPanel)
    const ANCHOR_KEY = 'map-anchor-v1';
    let _drag = null, _anchor = localStorage.getItem(ANCHOR_KEY) || 'left';
    function _apply_anchor(a) { _anchor = a; panel.dataset.anchor = a; try { localStorage.setItem(ANCHOR_KEY, a); } catch {} }
    function _snap_zone(x, y) { const sw = window.innerWidth, sh = window.innerHeight; if (x < sw*0.3) return 'left'; if (x > sw*0.7) return 'right'; return null; }
    _apply_anchor(_anchor);
    document.getElementById('map-header').addEventListener('mousedown', e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      e.preventDefault(); _drag = { moved: false, x0: e.clientX, y0: e.clientY };
    });
    window.addEventListener('mousemove', e => {
      if (!_drag) return;
      if (!_drag.moved && Math.hypot(e.clientX-_drag.x0, e.clientY-_drag.y0) < 8) return;
      _drag.moved = true; panel.classList.add('dragging');
    });
    window.addEventListener('mouseup', e => {
      if (!_drag) return;
      const moved = _drag.moved; _drag = null; panel.classList.remove('dragging');
      if (moved) { const z = _snap_zone(e.clientX, e.clientY); if (z) _apply_anchor(z); }
    });

    function open() { _render(); panel.classList.add('open'); }
    function close_panel() { panel.classList.remove('open'); }
    btn.addEventListener('click', open);
    close_btn.addEventListener('click', close_panel);
    panel.addEventListener('click', e => { if (e.target === panel) close_panel(); });
    return { open, close: close_panel, refresh: _render };
  })();
