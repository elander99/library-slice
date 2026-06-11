  const MapPanel = (() => {
    const panel    = document.getElementById('map-panel');
    const content  = document.getElementById('map-content');
    const btn      = document.getElementById('map-btn');
    const close_btn = document.getElementById('map-close');
    const zoom_btn  = document.getElementById('map-zoom');
    const title_el = document.getElementById('map-title');
    const minimap_el = document.getElementById('map-minimap');

    const ROOM_ORDER = ['street','lobby','play_area','gallery','library','salon','cooking_room','outdoor','house'];

    // ── Minimap ──────────────────────────────────────────────────────────────
    const MINI_LABELS = {
      jp: { street:'通り', lobby:'ロビー', play_area:'遊び場', library:'図書館', salon:'サロン', outdoor:'屋外', house:'家', gallery:'画廊', cooking_room:'料理室' },
      ko: { street:'거리', lobby:'로비', play_area:'놀이터', library:'도서관', salon:'살롱', outdoor:'야외', house:'집', gallery:'갤러리', cooking_room:'요리실' },
    };

    // Grid positions: col (0–6 left-right), row (0=top, 1=main, 2=bottom)
    const MINI_LAYOUT = {
      street:       { col:0, row:1 },
      lobby:        { col:1, row:1 },
      play_area:    { col:2, row:1 },
      library:      { col:3, row:1 },
      salon:        { col:4, row:1 },
      outdoor:      { col:5, row:1 },
      house:        { col:6, row:1 },
      gallery:      { col:2, row:0 },
      cooking_room: { col:4, row:2 },
    };

    const MINI_EDGES = [
      ['street','lobby'],['lobby','play_area'],['play_area','library'],
      ['library','salon'],['salon','outdoor'],['outdoor','house'],
      ['play_area','gallery'],['salon','cooking_room'],
    ];

    function _warp_to_room(room_id) {
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
      if (target_col === null && room_signs.length > 0) target_col = room_signs[0].col;
      const warp_px = ((target_col !== null ? target_col : 10) + 0.5) * TS;
      sim.warp_to(room_id, warp_px, 7 * TS);
      close_panel();
    }

    function _render_minimap() {
      const ko = LANG.current === 'ko';
      const labels = ko ? MINI_LABELS.ko : MINI_LABELS.jp;
      const current = sim.state.room;

      const BW = 52, BH = 36, GX = 12, GY = 42, PAD = 8;
      const px = col => PAD + col * (BW + GX);
      const py = row => PAD + row * (BH + GY);
      const cx = col => px(col) + BW / 2;
      const cy = row => py(row) + BH / 2;

      const SVG_W = px(6) + BW + PAD;
      const SVG_H = py(2) + BH + PAD;

      let lines = '';
      let rooms = '';

      // Connection lines (drawn under room boxes)
      for (const [a, b] of MINI_EDGES) {
        const la = MINI_LAYOUT[a], lb = MINI_LAYOUT[b];
        const ax = cx(la.col), ay = cy(la.row);
        const bx = cx(lb.col), by = cy(lb.row);
        lines += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>`;
      }

      // House↔Street loop connection shown as dashed arc below
      const arc_y = py(1) + BH + 16;
      lines += `<path d="M${cx(6)} ${py(1) + BH} Q${cx(3)} ${arc_y} ${cx(0)} ${py(1) + BH}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="3 3"/>`;

      // Room boxes
      for (const [id, pos] of Object.entries(MINI_LAYOUT)) {
        const room = ROOM_MAP_DATA[id];
        if (!room) continue;
        const x = px(pos.col), y = py(pos.row);
        const is_here = id === current;
        const { done, total } = _sign_progress(id);
        const pct = total > 0 ? done / total : 0;

        const stroke      = is_here ? '#c49a1a' : 'rgba(255,255,255,0.14)';
        const stroke_w    = is_here ? 1.5 : 1;
        const bg          = is_here ? 'rgba(196,154,26,0.15)' : 'rgba(255,255,255,0.04)';
        const label_color = is_here ? '#c49a1a' : 'rgba(255,255,255,0.55)';
        const bar_color   = pct >= 1 ? '#2d6a4f' : 'rgba(45,106,79,0.55)';

        rooms += `<g data-room="${id}" style="cursor:pointer">`;
        rooms += `<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="3" fill="${bg}" stroke="${stroke}" stroke-width="${stroke_w}"/>`;

        // Progress bar at bottom of box
        if (total > 0) {
          rooms += `<rect x="${x}" y="${y + BH - 4}" width="${BW}" height="4" rx="0" fill="rgba(255,255,255,0.04)"/>`;
          if (pct > 0) {
            rooms += `<rect x="${x}" y="${y + BH - 4}" width="${(BW * pct).toFixed(1)}" height="4" rx="0" fill="${bar_color}"/>`;
          }
        }

        // Room label
        rooms += `<text x="${cx(pos.col)}" y="${y + BH / 2 - 2}" text-anchor="middle" dominant-baseline="middle" fill="${label_color}" font-size="9" font-family="'Noto Serif JP',serif" style="pointer-events:none">${labels[id] || id}</text>`;

        // Current-location dot
        if (is_here) {
          rooms += `<circle cx="${x + BW - 5}" cy="${y + 5}" r="3" fill="#c49a1a"/>`;
        }

        rooms += '</g>';
      }

      minimap_el.innerHTML = `<svg viewBox="0 0 ${SVG_W} ${SVG_H}" style="width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">${lines}${rooms}</svg>`;

      minimap_el.querySelectorAll('[data-room]').forEach(g => {
        g.addEventListener('click', () => _warp_to_room(g.dataset.room));
      });
    }

    // ── Progress helper ───────────────────────────────────────────────────────
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

      _render_minimap();

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

        row.addEventListener('click', () => _warp_to_room(room_id));

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
    zoom_btn.addEventListener('click', () => panel.classList.toggle('zoomed'));
    panel.addEventListener('click', e => { if (e.target === panel) close_panel(); });
    return { open, close: close_panel, refresh: _render };
  })();
