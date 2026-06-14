const JournalPanel = (() => {
  const RESIDENTS = ['yuki','haruto','mei','nana','sora','riku','aiko','kenji','takeshi','hana'];
  const STAFF = ['librarian','receptionist','play_staff','salon_staff','outdoor_guide','gallery_curator','cook','house_resident'];

  const ROOM_LABELS = {
    lobby:'로비', library:'도서관', salon:'살롱', outdoor:'야외',
    play_area:'놀이터', gallery:'갤러리', cooking_room:'요리실',
    house:'하우스', house_a:'가족 집', house_b:'학생 집', house_c:'어른 집',
    street:'거리',
  };

  const panel   = document.getElementById('journal-panel');
  const content = document.getElementById('journal-content');
  const btn     = document.getElementById('journal-btn');
  const close_btn = document.getElementById('journal-close');
  const progress_el = document.getElementById('journal-progress-indicator');

  btn.addEventListener('click', open);
  close_btn.addEventListener('click', close);

  function open()  { panel.classList.add('open'); _render(); }
  function close() { panel.classList.remove('open'); }
  function refresh() { if (panel.classList.contains('open')) _render(); }

  function _check_jp(npc_id, input) {
    const npc = NPC_DEFS[npc_id];
    return !!(npc?.name_jp && input.trim() === npc.name_jp.trim());
  }

  function _check_birthday(npc_id, input) {
    const npc = NPC_DEFS[npc_id];
    if (!npc?.birthday) return false;
    const { month, day, jp, ko } = npc.birthday;
    const s = input.trim().replace(/\s+/g, '');
    return s === jp || s === ko.replace(/\s/g,'') ||
           s === `${month}/${day}` || s === `${month}-${day}` || s === `${month}月${day}日`;
  }

  function _room_tags(rooms) {
    if (!rooms?.length) return '';
    return rooms.map(r => `<span class="jnl-tag">${ROOM_LABELS[r] || r}</span>`).join('');
  }

  function _fill_field(npc_id, type, placeholder) {
    const prog = JOURNAL_PROGRESS.get(npc_id);
    const confirmed = prog[`${type}_confirmed`];
    const npc = NPC_DEFS[npc_id];
    const correct_val = type === 'jp' ? npc?.name_jp : npc?.birthday?.jp;
    if (confirmed) {
      return `<span class="jnl-confirmed">${correct_val}<span class="jnl-check"> ✓</span></span>`;
    }
    return `<span class="jnl-fill-row" data-npc="${npc_id}" data-type="${type}">` +
           `<input class="jnl-fill-input" type="text" placeholder="${placeholder}" autocomplete="off" spellcheck="false">` +
           `<button class="jnl-fill-btn">→</button></span>`;
  }

  function _card(npc_id, is_resident) {
    const npc = NPC_DEFS[npc_id];
    if (!npc) return '';
    const prog = JOURNAL_PROGRESS.get(npc_id);
    const revealed = is_resident ? !!prog.seen : !!prog.met;

    if (!revealed) {
      return `<div class="jnl-card jnl-card-unknown">` +
             `<div class="jnl-card-head"><span class="jnl-dot" style="background:${npc.color}"></span>` +
             `<span class="jnl-name-unknown">？？？</span></div>` +
             `<div class="jnl-unseen-hint">${is_resident ? '이 인물을 찾아보세요' : '이 직원에게 말을 걸어보세요'}</div></div>`;
    }

    const name_ko = npc.name_ko || npc.name_en;
    const name_en = npc.name_en;
    const rooms_html = _room_tags(prog.rooms);
    const notes_val = (prog.notes || '').replace(/"/g, '&quot;');

    let fill_html = '';
    if (is_resident && npc.name_jp) {
      fill_html = `<div class="jnl-field-row">` +
                  `<span class="jnl-field-label">일본어 이름</span>` +
                  `${_fill_field(npc_id, 'jp', npc.name_jp[0] + '…')}</div>`;
    } else if (!is_resident && npc.birthday) {
      fill_html = `<div class="jnl-field-row">` +
                  `<span class="jnl-field-label">생일</span>` +
                  `${_fill_field(npc_id, 'birthday', '月/日')}</div>`;
    }

    return `<div class="jnl-card jnl-card-seen">` +
           `<div class="jnl-card-head">` +
           `<span class="jnl-dot" style="background:${npc.color}"></span>` +
           `<span class="jnl-name">${name_ko}</span>` +
           `<span class="jnl-name-en">${name_en}</span></div>` +
           (rooms_html ? `<div class="jnl-rooms">${rooms_html}</div>` : '') +
           fill_html +
           `<div class="jnl-notes-row"><textarea class="jnl-notes" data-npc="${npc_id}" rows="2" placeholder="메모…" spellcheck="false">${notes_val}</textarea></div>` +
           `</div>`;
  }

  function _render() {
    const all_ids = [...RESIDENTS, ...STAFF];
    const confirmed = all_ids.filter(id => {
      const prog = JOURNAL_PROGRESS.get(id);
      const npc = NPC_DEFS[id];
      return RESIDENTS.includes(id) ? !!prog.jp_confirmed : !!(npc?.birthday && prog.birthday_confirmed);
    }).length;
    const total = all_ids.filter(id => {
      const npc = NPC_DEFS[id];
      return RESIDENTS.includes(id) ? !!npc?.name_jp : !!npc?.birthday;
    }).length;

    progress_el.textContent = `${confirmed} / ${total}`;

    content.innerHTML =
      `<div class="jnl-section-head">주민 · Residents</div>` +
      RESIDENTS.map(id => _card(id, true)).join('') +
      `<div class="jnl-section-head">직원 · Staff</div>` +
      STAFF.map(id => _card(id, false)).join('');

    content.querySelectorAll('.jnl-fill-row').forEach(row => {
      const inp = row.querySelector('.jnl-fill-input');
      const fbtn = row.querySelector('.jnl-fill-btn');
      const npc_id = row.dataset.npc;
      const type   = row.dataset.type;
      function submit() {
        const ok = type === 'jp' ? _check_jp(npc_id, inp.value) : _check_birthday(npc_id, inp.value);
        if (ok) {
          if (type === 'jp') JOURNAL_PROGRESS.confirm_jp(npc_id);
          else JOURNAL_PROGRESS.confirm_birthday(npc_id);
        } else {
          row.classList.add('jnl-wrong');
          setTimeout(() => row.classList.remove('jnl-wrong'), 500);
          inp.select();
        }
      }
      fbtn.addEventListener('click', submit);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    });

    content.querySelectorAll('.jnl-notes').forEach(ta => {
      ta.addEventListener('blur', () => JOURNAL_PROGRESS.set_notes(ta.dataset.npc, ta.value));
    });
  }

  return { open, close, refresh };
})();
