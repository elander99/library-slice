  const canvas = document.getElementById("game");


  const sim      = new Sim2D();
  const renderer = new Renderer2D(canvas, sim);
  const input    = new Input2D(canvas, sim, renderer);

  document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("map-btn").style.display = "block";
    document.getElementById("vocab-btn").style.display = "block";
    document.getElementById("journal-btn").style.display = "block";
    document.getElementById("settings-btn").style.display = "block";
    sim.start();
  });

  // ── Teaching language switch ───────────────────────────────────────────────

  function _migrateAtomicProgress() {
    for (const id of Object.keys(SIGN_BY_ID)) {
      const sign = SIGN_BY_ID[id];
      if (!sign.tokens) continue;
      const prog = WORD_PROGRESS.getSign(id);
      sign.tokens.forEach((tok, i) => {
        if (!tok.parts || !tok.parts.length) return;
        const atomicRes = prog[i] || {};
        if (!atomicRes.romaji && !atomicRes.meaning) return;
        tok.parts.forEach((_, pi) => {
          const pk = `${i}p${pi}`;
          const partRes = prog[pk] || {};
          if (atomicRes.romaji && !partRes.romaji) WORD_PROGRESS.unlock_part(id, i, pi, 'romaji');
          if (atomicRes.meaning && !partRes.meaning) WORD_PROGRESS.unlock_part(id, i, pi, 'meaning');
        });
      });
    }
  }

  function switchTeachingLang(lang) {
    try {
      LANG.set(lang);
      // Hot-swap SIGN_BY_ID: delete all current entries, re-populate from the right set
      Object.keys(SIGN_BY_ID).forEach(k => delete SIGN_BY_ID[k]);
      const signs = lang === 'ko' ? [...SIGNS_KO, ...WORLD_SIGNS_KO] : [...SIGNS, ...WORLD_SIGNS];
      signs.forEach(s => { SIGN_BY_ID[s.id] = s; });
      // Reload per-language vocab progress
      WORD_PROGRESS.reload();
      // Migrate any tokens that were saved as atomic before parts were added
      _migrateAtomicProgress();
      // Close any open panels so stale sign data isn't shown
      WorkspacePanel.clear();
    } catch(e) { console.error('switchTeachingLang error:', e); }

    // Update button: show the OTHER language as the switch target
    const btn = document.getElementById('lang-btn');
    if (btn) {
      btn.textContent   = lang === 'ko' ? '日本語' : '한국어';
      btn.style.color   = lang === 'ko' ? '#c0392b' : '#555';
      btn.style.borderColor = lang === 'ko' ? '#c0392b' : '#3a2810';
    }
    const h1 = document.querySelector('#start-screen h1');
    if (h1) h1.textContent = lang === 'ko' ? '도서관' : '図書館';
  }

  document.getElementById('lang-btn').addEventListener('click', () => {
    switchTeachingLang(LANG.current === 'ko' ? 'ja' : 'ko');
  });

  // Apply saved teaching language on load
  switchTeachingLang(LANG.current);

  // ── Game loop ──────────────────────────────────────────────────────────────
  let _last_t = 0;
  let _room_prev = null;

  function loop(now) {
    const dt = Math.min((now - _last_t) / 1000, 0.05);
    _last_t = now;

    if (sim.state.session_active) {
      input.update(dt, now);
      sim.tick_npcs(dt);

      if (sim.state.transition) {
        const changed = sim.advance_transition(dt);
        if (changed) {
          WorkspacePanel.clear();
          DialoguePanel.close();
        }
      }
    }

    renderer.draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
