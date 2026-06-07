  const SettingsPanel = (() => {
    const panel=document.getElementById("settings-panel");
    const btn=document.getElementById("settings-btn");
    const close=document.getElementById("settings-close");
    const voice_row=document.getElementById("settings-voice-row");
    const reset_pos_btn=document.getElementById("settings-reset-pos");
    function open() {
      voice_row.style.display = LANG.current==='ko' ? '' : 'none';
      panel.classList.add("open");
    }
    function close_panel() { panel.classList.remove("open"); }
    btn.addEventListener("click", open);
    close.addEventListener("click", close_panel);
    panel.addEventListener("click", e=>{ if(e.target===panel) close_panel(); });
    reset_pos_btn.addEventListener("click", () => {
      sim.reset_position();
      close_panel();
    });
    return { open, close: close_panel };
  })();
