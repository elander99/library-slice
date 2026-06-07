  const ConvoPanel = (() => {
    const panel    = document.getElementById('convo-panel');
    const body_el  = document.getElementById('convo-body');
    const title_el = document.getElementById('convo-title');
    const close_btn = document.getElementById('convo-close');

    function open(convo_id) {
      if (typeof DialoguePanel !== 'undefined') DialoguePanel.openConvo(convo_id);
    }

    function close() { panel.classList.remove('open'); }
    close_btn.addEventListener('click', close);
    panel.addEventListener('click', e => { if (e.target === panel) close(); });

    return { open, close };
  })();
