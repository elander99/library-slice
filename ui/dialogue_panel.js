  const DialoguePanel = (() => {
    const dlg_el=document.getElementById("ws-dialogue"), avatar=document.getElementById("ws-dlg-avatar");
    const name_el=document.getElementById("ws-dlg-name"), body_el=document.getElementById("ws-dlg-body");
    const thinking=document.getElementById("ws-dlg-thinking");
    const inp=document.getElementById("ws-dlg-input"), send_btn=document.getElementById("ws-dlg-send");
    const close_btn=document.getElementById("ws-dlg-close");
    const copy_all_btn=document.getElementById("ws-dlg-copy-all");
    const _lookup_cache = {};

    let _copy_all_flash = null;
    copy_all_btn.addEventListener('click', () => {
      const lines = [];
      const npc_name = name_el.textContent || 'NPC';
      body_el.querySelectorAll('.dlg-turn').forEach(turn => {
        if (turn.classList.contains('dlg-turn-npc')) {
          lines.push(`${npc_name}: ${turn.dataset.jp || ''}`);
        } else if (turn.classList.contains('dlg-turn-player')) {
          const bubble = turn.querySelector('.dlg-turn-player-text');
          if (bubble) lines.push(`you: ${bubble.textContent}`);
        }
      });
      if (!lines.length) return;
      navigator.clipboard.writeText(lines.join('\n')).then(() => {
        copy_all_btn.textContent = '✓ copied';
        copy_all_btn.classList.add('copied');
        if (_copy_all_flash) clearTimeout(_copy_all_flash);
        _copy_all_flash = setTimeout(() => {
          copy_all_btn.textContent = '⎘ copy all';
          copy_all_btn.classList.remove('copied');
          _copy_all_flash = null;
        }, 1400);
      });
    });

    function _insert_at_cursor(word) {
      const start = inp.selectionStart ?? inp.value.length;
      const end   = inp.selectionEnd   ?? inp.value.length;
      inp.value = inp.value.slice(0, start) + word + inp.value.slice(end);
      inp.selectionStart = inp.selectionEnd = start + word.length;
      inp.focus();
    }

    inp.addEventListener("dragover", e => {
      if (e.dataTransfer.types.includes("dlg-word")) { e.preventDefault(); inp.classList.add("drag-over"); }
    });
    inp.addEventListener("dragleave", () => inp.classList.remove("drag-over"));
    inp.addEventListener("drop", e => {
      const word = e.dataTransfer.getData("dlg-word");
      if (!word) return;
      e.preventDefault(); inp.classList.remove("drag-over");
      _insert_at_cursor(word);
    });

    function _tokenize(text) {
      if (LANG.current === 'ko') {
        return text.replace(/[。、！？「」『』・…]/g,'').split(/\s+/).filter(Boolean);
      }
      const tokens = []; let buf = '', last = null;
      const script = c => { const n=c.charCodeAt(0);
        if (n>=0x4E00&&n<=0x9FFF||n>=0x3400&&n<=0x4DBF) return 'K';
        if (n>=0x3040&&n<=0x309F) return 'H';
        if (n>=0x30A0&&n<=0x30FF) return 'T';
        return 'O'; };
      for (const c of text) {
        if (/[\s。、！？「」『』・…]/.test(c)) { if (buf){tokens.push(buf);buf='';last=null;} continue; }
        const t=script(c); if (t!==last&&buf){tokens.push(buf);buf='';}
        buf+=c; last=t;
      }
      if (buf) tokens.push(buf);
      return tokens;
    }

    async function _lookup_word(word) {
      if (_lookup_cache[word]) return _lookup_cache[word];
      const lang_name = LANG.current==='ko'?'Korean':'Japanese';
      try {
        const res=await fetch(OLLAMA_URL,{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({model:OLLAMA_MODEL,keep_alive:-1,messages:[{role:'user',content:
            `${lang_name} word: "${word}"\nReply ONLY with JSON: {"reading":"romanization","meaning":"core English word or short phrase (3 words max)"}`
          }],stream:false,options:{temperature:0,num_predict:40}})});
        if (!res.ok) throw new Error();
        const raw=(await res.json()).message?.content?.trim()||'';
        let p=null; try{p=JSON.parse(raw);}catch{}
        if (!p){const m=raw.match(/\{[\s\S]*?\}/);if(m)try{p=JSON.parse(m[0]);}catch{}}
        if (p?.reading) { if (p.meaning) { p.meaning=_first_meaning(p.meaning); p.meaning=p.meaning.charAt(0).toLowerCase()+p.meaning.slice(1); } _lookup_cache[word]=p; return p; }
      } catch {}
      return null;
    }

    function _refresh_dlg_word_colors() {
      const known = _build_known_words();
      body_el.querySelectorAll('.dlg-word').forEach(span => {
        const turn = span.closest('[data-line-id]');
        if (!turn) return;
        const saved = NPC_LINE_PROGRESS.get(turn.dataset.lineId);
        const i = +span.dataset.wordIdx;
        const partCount = +span.dataset.partCount || 0;
        const done = partCount
          ? Array.from({length: partCount}, (_,pi) => saved[`${i}p${pi}`]||{}).every(r=>r.romaji&&r.meaning)
          : !!(saved[i]?.romaji && saved[i]?.meaning);
        const clean = span.textContent.replace(/[.!?,;:…]+$/, '');
        span.classList.toggle('done', done || known.has(clean));
      });
    }

    function _append_npc_turn(jp, en, tokens, already_revealed=false) {
      const turn = document.createElement('div');
      turn.className = 'dlg-turn dlg-turn-npc';
      turn.dataset.jp = jp;
      turn.dataset.en = en || '';
      turn.dataset.lineId = jp;
      if (already_revealed) turn.classList.add('complete');

      const jp_row = document.createElement('div');
      jp_row.className = 'dlg-npc-jp';
      let all_words = tokens ? tokens.map(t=>t.text) : _tokenize(jp);
      if (LANG.current === 'ko') {
        const split = WorkspacePanel.split_ko_words(all_words, tokens);
        all_words = split.words; tokens = split.defs;
      }
      if (!tokens) WorkspacePanel.prefetch(all_words);
      const line_saved = NPC_LINE_PROGRESS.get(jp);
      const _known_npc = _build_known_words();
      all_words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'dlg-word'; span.textContent = word; span.draggable = true;
        span.dataset.wordIdx = i;
        if (tokens && tokens[i]?.parts?.length) span.dataset.partCount = tokens[i].parts.length;
        const partCount = tokens && tokens[i]?.parts?.length;
        const isDone = partCount
          ? Array.from({length: partCount}, (_,pi) => line_saved[`${i}p${pi}`]||{}).every(r=>r.romaji&&r.meaning)
          : !!(line_saved[i]?.romaji && line_saved[i]?.meaning);
        const _clean = word.replace(/[.!?,;:…]+$/, '');
        if (isDone || _known_npc.has(_clean)) span.classList.add('done');
        span.addEventListener('dragstart', ev => {
          span.classList.add('drag-src');
          ev.dataTransfer.setData('dlg-word', word);
          ev.dataTransfer.effectAllowed = 'copy';
        });
        span.addEventListener('dragend', () => span.classList.remove('drag-src'));
        span.addEventListener('click', () => {
          body_el.querySelectorAll('.dlg-word.active').forEach(c=>c.classList.remove('active'));
          span.classList.add('active');
          WorkspacePanel.open_npc_sentence(jp, all_words, i, name_el.textContent, tokens, turn.dataset.en);
        });
        jp_row.appendChild(span);
      });
      turn.appendChild(jp_row);

      const copy_btn = document.createElement('button');
      copy_btn.className = 'dlg-copy-btn';
      copy_btn.textContent = 'copy';
      copy_btn.addEventListener('click', () => {
        navigator.clipboard.writeText(jp).then(() => {
          copy_btn.textContent = '✓';
          setTimeout(() => { copy_btn.textContent = 'copy'; }, 1200);
        });
      });
      turn.appendChild(copy_btn);

      // Room navigation row — detect room names mentioned in this NPC turn
      const _mentioned_rooms = Object.values(ROOM_DEFS)
        .filter(r => r.name_jp && jp.includes(r.name_jp) && r.id !== sim.state.room);
      if (_mentioned_rooms.length > 0) {
        const navRow = document.createElement('div'); navRow.className = 'dlg-nav-row';
        _mentioned_rooms.forEach(room => {
          const btn = document.createElement('button'); btn.className = 'dlg-nav-btn';
          btn.textContent = room.name_jp; btn.title = room.name_en;
          btn.addEventListener('click', () => { close(); sim.navigate_to_room(room.id); });
          navRow.appendChild(btn);
        });
        turn.appendChild(navRow);
      }

      body_el.insertBefore(turn, thinking);
      body_el.scrollTop = body_el.scrollHeight;
      WorkspacePanel.speak(jp);
    }

    function _append_player_turn(text) {
      const turn = document.createElement('div');
      turn.className = 'dlg-turn dlg-turn-player';
      const bubble = document.createElement('span');
      bubble.className = 'dlg-turn-player-text';
      let all_words = _tokenize(text);
      let _pdefs = null;
      if (LANG.current === 'ko') {
        const split = WorkspacePanel.split_ko_words(all_words, null);
        all_words = split.words; _pdefs = split.defs;
      }
      const label = LANG.current === 'ko' ? '나' : '私';
      all_words.forEach((word, i) => {
        if (i > 0) bubble.appendChild(document.createTextNode(' '));
        const span = document.createElement('span');
        span.className = 'dlg-player-word'; span.textContent = word;
        span.addEventListener('click', () => {
          bubble.querySelectorAll('.dlg-player-word.active').forEach(c => c.classList.remove('active'));
          span.classList.add('active');
          WorkspacePanel.open_npc_sentence(text, all_words, i, label, _pdefs, '');
        });
        bubble.appendChild(span);
      });
      if (!all_words.length) bubble.textContent = text;
      turn.appendChild(bubble);
      body_el.insertBefore(turn, thinking);
      body_el.scrollTop = body_el.scrollHeight;
    }
    let cur_npc_id=null; const _histories={};
    const _pending={};  // npc_id → {intent_id} when NPC asked a yes/no question
    function _is_affirmative(text) {
      const t=text.toLowerCase().trim().replace(/[!.?~\s]+$/,'');
      return ['네','내','응','좋아','좋아요','그래','그래요','물론','당연','물론이죠','당연하죠',
              'yes','yeah','ok','okay','sure','はい','うん','もちろん','ええ','오케이'].includes(t);
    }
    const OLLAMA_URL="/ollama/api/chat", OLLAMA_MODEL="llama3.1:8b";
    const DLG_KEY='library-slice-dlg-v1';
    const _dlg_store=(()=>{ try{return JSON.parse(localStorage.getItem(DLG_KEY)||'{}');}catch{return{};} })();
    function _save_dlg(npc_id){ _dlg_store[_hk(npc_id)]=_histories[_hk(npc_id)]||[]; try{localStorage.setItem(DLG_KEY,JSON.stringify(_dlg_store));}catch{} }
    function _save_revealed(npc_id, jp){ const k=_hk(npc_id)+'_rev'; if(!_dlg_store[k])_dlg_store[k]=[]; if(!_dlg_store[k].includes(jp))_dlg_store[k].push(jp); try{localStorage.setItem(DLG_KEY,JSON.stringify(_dlg_store));}catch{} }
    function _is_revealed(npc_id, jp){ return (_dlg_store[_hk(npc_id)+'_rev']||[]).includes(jp); }

    function _npc_current_activity(npc_id) {
      const ns = sim?.state?.npc_states?.[npc_id];
      if (ns?.say_en) return { ko: ns.say_ko, en: ns.say_en };
      const npc = NPC_DEFS[npc_id];
      if (npc?.activity_en) return { ko: npc.activity_ko, en: npc.activity_en };
      return null;
    }

    function _system_prompt(npc_id) {
      const npc=NPC_DEFS[npc_id];
      const facts=(NPC_KNOWLEDGE[npc_id]||[]).map(f=>"- "+f).join("\n");
      const ko = LANG.current === 'ko';
      const npc_name = ko && npc.name_ko ? npc.name_ko : npc.name_jp;
      const lang = ko ? 'Korean' : 'Japanese';
      const style = ko ? '존댓말' : '丁寧語';
      const reading_label = ko ? 'romanization' : 'romaji';
      const format = ko
        ? `{"jp": "Korean response", "en": "English translation"}`
        : `{"jp": "Japanese response", "en": "English translation", "tokens": [{"text": "word", "reading": "${reading_label}", "meaning": "English meaning"}]}`;
      const token_instruction = ko ? '' : '\n- The tokens array must list every word/morpheme in your Japanese response in order';
      const script_rule = ko ? '\n- Write the Korean response entirely in Hangul — do not use any Latin/English characters in the Korean field' : '';
      const act = _npc_current_activity(npc_id);
      const act_line = act ? `\n- Right now you are: ${act.en}` : '';
      return `You are ${npc_name} (${npc.name_en}). A visitor is speaking to you in ${lang}.\n\nWhat you know:\n${facts}${act_line}\n\nInstructions:\n- Stay in character as a polite ${lang} staff member using ${style}\n- Keep your response to 1–2 sentences maximum\n- Reply ONLY with valid JSON: ${format}${token_instruction}${script_rule}\n- CRITICAL: never invent or confirm the existence of specific books, items, rooms, services, or locations that are not explicitly listed in "What you know" above — say you don't know instead\n- If asked about something not covered above, say politely that you don't know or cannot confirm\n- Do not include any text outside the JSON`;
    }

    const _hk = (npc_id) => `${npc_id}_${LANG.current}`;

    async function _generate(npc_id, text) {
      const history=_histories[_hk(npc_id)]||[];
      try {
        const ctl=new AbortController(); const tid=setTimeout(()=>ctl.abort(),45000);
        const res=await fetch(OLLAMA_URL,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl.signal,
          body:JSON.stringify({model:OLLAMA_MODEL,keep_alive:-1,format:"json",messages:[{role:"system",content:_system_prompt(npc_id)},...history,{role:"user",content:text}],stream:false,options:{temperature:0.3,num_predict:LANG.current==='ko'?128:512}})});
        clearTimeout(tid);
        if (!res.ok) throw new Error('http '+res.status);
        const json=await res.json();
        const raw=json.message?.content||'';
        let parsed=null;
        try{parsed=JSON.parse(raw);}catch{}
        if (!parsed){const m=raw.match(/\{[\s\S]*\}/);if(m)try{parsed=JSON.parse(m[0]);}catch{}}
        if (parsed?.jp&&parsed?.en){
          _histories[_hk(npc_id)]=[...history,{role:"user",content:text},{role:"assistant",content:raw}];
          _save_dlg(npc_id);
          const toks=Array.isArray(parsed.tokens)?parsed.tokens.map(t=>({...t,meaning:_first_meaning(t.meaning)})):null;
          return {jp:parsed.jp,en:parsed.en,tokens:toks};
        }
        throw new Error('parse: '+raw.slice(0,120));
      } catch(err) {
        console.error('[NPC] failed — error:', err?.message, '| type:', err?.name, '| npc:', npc_id, '| url:', OLLAMA_URL);
        const intent_id=npc_fallback_classify(npc_id,text);
        const intent=NPC_DEFS[npc_id]?.intents[intent_id];
        if (intent) return {jp:(LANG.current==='ko'&&intent.ko?intent.ko:intent.jp),en:intent.en,tokens:null};
        if (LANG.current==='ko') return {jp:'죄송해요, 잘 이해하지 못했어요. 다시 한번 말씀해 주시겠어요?', en:"Sorry, I didn't quite understand. Could you say that again?", tokens:null};
        return null;
      }
    }

    async function _send() {
      if (!cur_npc_id) return;
      const text=inp.value.trim(); if (!text) return;
      inp.value=""; inp.disabled=true; send_btn.disabled=true;
      _append_player_turn(text);
      WorkspacePanel.speak(text);

      // Pending follow-up: fire scripted intent immediately, skip Ollama
      const pend=_pending[cur_npc_id];
      if (pend) {
        delete _pending[cur_npc_id];
        if (_is_affirmative(text)) {
          const intent=NPC_DEFS[cur_npc_id]?.intents[pend.intent_id];
          if (intent) {
            const jp=(LANG.current==='ko'&&intent.ko?intent.ko:intent.jp), en=intent.en;
            _histories[_hk(cur_npc_id)]=[...(_histories[_hk(cur_npc_id)]||[]),{role:"user",content:text},{role:"assistant",content:JSON.stringify({jp,en})}];
            _save_dlg(cur_npc_id);
            _append_npc_turn(jp, en, null);
            send_btn.disabled=false; inp.disabled=false; inp.focus();
            return;
          }
        }
      }

      thinking.classList.add("visible");
      body_el.scrollTop = body_el.scrollHeight;
      const response=await _generate(cur_npc_id,text);
      thinking.classList.remove("visible");
      if (response) _append_npc_turn(response.jp, response.en, response.tokens);
      send_btn.disabled=false; inp.disabled=false; inp.focus();
    }

    function openConvo(convo_id) {
      const convo = (typeof CONVERSATIONS !== 'undefined') && CONVERSATIONS[convo_id];
      if (!convo) return;
      cur_npc_id = convo_id;
      const ko = LANG.current === 'ko';
      document.getElementById("ws-panel").classList.remove("open");
      dlg_el.style.transform=''; dlg_el.style.left=''; dlg_el.style.top='';
      dlg_el.classList.add("open", "convo-mode");
      avatar.style.background='';
      name_el.textContent = ko ? convo.title_ko : convo.title_en;
      body_el.querySelectorAll('.dlg-turn').forEach(el => el.remove());
      thinking.classList.remove("visible");
      inp.disabled = true;

      const first_npc = convo.turns[0]?.npc_id;
      const _known_convo = _build_known_words();
      convo.turns.forEach(turn => {
        const is_right = turn.npc_id !== first_npc;
        const speaker_name = ko ? turn.name_ko : turn.name_en;
        const text = turn.ko;
        const raw_words = text.split(/\s+/);
        const _split = WorkspacePanel.split_ko_words(raw_words, null);
        const all_words = _split.words, all_defs = _split.defs;

        const turn_el = document.createElement('div');
        turn_el.className = 'dlg-turn' + (is_right ? ' dlg-turn-convo-right' : '');

        const speaker_el = document.createElement('div');
        speaker_el.className = 'dlg-convo-speaker';
        speaker_el.textContent = speaker_name;

        const already_revealed = _is_revealed(convo_id, turn.ko);

        const npc_el = document.createElement('div');
        npc_el.className = 'dlg-turn-npc';
        npc_el.dataset.jp = turn.ko;
        npc_el.dataset.en = turn.en;
        npc_el.dataset.lineId = turn.ko;
        if (already_revealed) npc_el.classList.add('complete');

        const jp_row = document.createElement('div');
        jp_row.className = 'dlg-npc-jp';
        const line_saved = NPC_LINE_PROGRESS.get(turn.ko);
        all_words.forEach((word, wi) => {
          const span = document.createElement('span');
          span.className = 'dlg-word'; span.textContent = word; span.draggable = true;
          span.dataset.wordIdx = wi;
          if (all_defs[wi]?.parts?.length) span.dataset.partCount = all_defs[wi].parts.length;
          const partCount = all_defs[wi]?.parts?.length || 0;
          const isDone = partCount
            ? Array.from({length: partCount}, (_,pi) => line_saved[`${wi}p${pi}`]||{}).every(r=>r.romaji&&r.meaning)
            : !!(line_saved[wi]?.romaji && line_saved[wi]?.meaning);
          const _clean_w = word.replace(/[.!?,;:…]+$/, '');
          if (isDone || _known_convo.has(_clean_w)) span.classList.add('done');
          span.addEventListener('dragstart', ev => { ev.dataTransfer.setData('dlg-word', word); ev.dataTransfer.effectAllowed = 'copy'; });
          span.addEventListener('click', () => {
            jp_row.querySelectorAll('.dlg-word.active').forEach(c => c.classList.remove('active'));
            span.classList.add('active');
            WorkspacePanel.open_npc_sentence(text, all_words, wi, speaker_name, all_defs, turn.en);
          });
          jp_row.appendChild(span);
        });
        npc_el.appendChild(jp_row);

        // Portrait canvas — crops the character sprite from the loaded spritesheet
        const portrait = document.createElement('canvas');
        portrait.className = 'dlg-convo-portrait';
        const dpr = window.devicePixelRatio || 1;
        portrait.width  = Math.round(32 * dpr);
        portrait.height = Math.round(64 * dpr);
        const spr = (typeof CHARS !== 'undefined') && CHARS[turn.npc_id];
        if (spr && typeof renderer !== 'undefined') {
          const pimg = renderer._imgs[spr.img];
          if (pimg && pimg.complete && pimg.naturalWidth) {
            const pctx = portrait.getContext('2d');
            pctx.imageSmoothingEnabled = false;
            pctx.drawImage(pimg, spr.sx, spr.sy, spr.sw, spr.sh, 0, 0, portrait.width, portrait.height);
          }
        }

        const row_el = document.createElement('div');
        row_el.className = 'dlg-convo-row';
        row_el.append(portrait, npc_el);

        turn_el.append(speaker_el, row_el);
        body_el.insertBefore(turn_el, thinking);
      });
    }

    function open(npc_id) {
      const npc=NPC_DEFS[npc_id]; if (!npc) return;
      cur_npc_id=npc_id;
      const _gt = sim.state.game_time;
      const _isBirthday = npc.birthday && _gt && npc.birthday.month === _gt.month && npc.birthday.day === _gt.day;
      const greeting = _isBirthday && npc.greeting_birthday
        ? (LANG.current==='ko' && npc.greeting_birthday_ko ? npc.greeting_birthday_ko : npc.greeting_birthday)
        : (LANG.current==='ko' && npc.greeting_ko ? npc.greeting_ko : npc.greeting);
      document.getElementById("ws-panel").classList.remove("open");
      // Reset to default centered position
      dlg_el.style.transform=''; dlg_el.style.left=''; dlg_el.style.top='';
      dlg_el.classList.remove("convo-mode");
      dlg_el.classList.add("open");
      inp.disabled = false;
      avatar.style.background=npc.color; name_el.textContent='';
      body_el.querySelectorAll('.dlg-turn').forEach(el => el.remove());
      if (greeting.follow_up) _pending[npc_id]={intent_id:greeting.follow_up};
      const saved=_dlg_store[_hk(npc_id)];
      // "established" = player has formally opened this dialogue before (greeting was sent)
      const established=saved?.some(m=>m.greeting||m.role==='user');
      if (established) {
        delete _pending[npc_id];  // pending only for fresh conversations
        _histories[_hk(npc_id)]=saved;
        for (const msg of saved) {
          if (msg.role==='assistant') {
            let p=null; try{p=JSON.parse(msg.content);}catch{}
            if (p?.jp) _append_npc_turn(p.jp, p.en, Array.isArray(p.tokens)?p.tokens:null, _is_revealed(npc_id, p.jp));
          } else if (msg.role==='user') {
            _append_player_turn(msg.content);
          }
        }
      } else {
        // First interactive open — show any ambient lines seen so far, then greeting
        const ambient=saved||[];
        for (const msg of ambient) {
          let p=null; try{p=JSON.parse(msg.content);}catch{}
          if (p?.jp) _append_npc_turn(p.jp, p.en, null, false);
        }
        const greeting_msg={role:"assistant",content:JSON.stringify({jp:greeting.jp,en:greeting.en}),greeting:true};
        _histories[_hk(npc_id)]=[...ambient,greeting_msg];
        _append_npc_turn(greeting.jp, greeting.en, null);
        _save_dlg(npc_id);
      }
      inp.placeholder = '';
      thinking.classList.remove("visible"); inp.value=""; inp.disabled=false; send_btn.disabled=false; inp.focus();
      _koKbdShow();
    }

    function close() {
      if (cur_npc_id) delete _pending[cur_npc_id];
      cur_npc_id=null; dlg_el.classList.remove("open", "convo-mode");
      inp.disabled = false;
      _koKbdReset();
    }

    send_btn.addEventListener("click",_send);
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")_send();});
    close_btn.addEventListener("click",close);

    // ── Korean virtual keyboard + IME ─────────────────────────────────────────
    const _koKbd = document.getElementById('ko-kbd');
    // Syllable composition tables (Unicode Hangul block: 0xAC00 + (cho*21+jung)*28 + jong)
    const _CHO  = {ㄱ:0,ㄲ:1,ㄴ:2,ㄷ:3,ㄸ:4,ㄹ:5,ㅁ:6,ㅂ:7,ㅃ:8,ㅅ:9,ㅆ:10,ㅇ:11,ㅈ:12,ㅉ:13,ㅊ:14,ㅋ:15,ㅌ:16,ㅍ:17,ㅎ:18};
    const _JUNG = {ㅏ:0,ㅐ:1,ㅑ:2,ㅒ:3,ㅓ:4,ㅔ:5,ㅕ:6,ㅖ:7,ㅗ:8,ㅘ:9,ㅙ:10,ㅚ:11,ㅛ:12,ㅜ:13,ㅝ:14,ㅞ:15,ㅟ:16,ㅠ:17,ㅡ:18,ㅢ:19,ㅣ:20};
    const _JONG = {ㄱ:1,ㄲ:2,ㄴ:4,ㄷ:7,ㄹ:8,ㅁ:16,ㅂ:17,ㅅ:19,ㅆ:20,ㅇ:21,ㅈ:22,ㅊ:23,ㅋ:24,ㅌ:25,ㅍ:26,ㅎ:27};
    const _J2C  = {1:0,2:1,4:2,7:3,8:5,16:6,17:7,19:9,20:10,21:11,22:12,23:14,24:15,25:16,26:17,27:18};
    const _CCH  = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
    const _CJONG = {}; // compound finals: {first_jong: {second_cho: result}}
    [[1,9,3],[4,12,5],[4,18,6],[8,0,9],[8,6,10],[8,7,11],[8,9,12],[8,16,13],[8,17,14],[8,18,15],[17,9,18]]
      .forEach(([j,c,r])=>{ (_CJONG[j]||(_CJONG[j]={}))[c]=r; });
    const _DJONG = {3:[1,9],5:[4,12],6:[4,18],9:[8,0],10:[8,6],11:[8,7],12:[8,9],13:[8,16],14:[8,17],15:[8,18],18:[17,9]};
    const _CJUNG = {8:{0:9,1:10,20:11},13:{4:14,5:15,20:16},18:{20:19}}; // compound vowels
    const _DJUNG = {9:8,10:8,11:8,14:13,15:13,16:13,19:18};
    const _syl = (c,v,f=0) => String.fromCharCode(0xAC00+(c*21+v)*28+f);

    let _ims = null; // {cho, jung(-1=consonant only), jong}
    let _koShifted = false;
    const _iv = () => inp.value;
    const _is = ch => { inp.value = _iv().slice(0,-1)+ch; };
    const _ip = ()  => { inp.value = _iv().slice(0,-1); };
    const _ia = ch  => { inp.value += ch; };

    function _imeType(jamo) {
      const isCons=jamo in _CHO, isVow=jamo in _JUNG;
      if (isCons) {
        const ci=_CHO[jamo];
        if (!_ims)                { _ims={cho:ci,jung:-1,jong:0}; _ia(_CCH[ci]); }
        else if (_ims.jung===-1)  { _ims={cho:ci,jung:-1,jong:0}; _ia(_CCH[ci]); }
        else if (_ims.jong===0)   { const ji=_JONG[jamo]||0; if(ji){_ims.jong=ji;_is(_syl(_ims.cho,_ims.jung,ji));}else{_ims={cho:ci,jung:-1,jong:0};_ia(_CCH[ci]);} }
        else { const comp=(_CJONG[_ims.jong]||{})[ci]; if(comp!==undefined){_ims.jong=comp;_is(_syl(_ims.cho,_ims.jung,comp));}else{_ims={cho:ci,jung:-1,jong:0};_ia(_CCH[ci]);} }
      } else if (isVow) {
        const vi=_JUNG[jamo];
        if (!_ims)               { _ims={cho:11,jung:vi,jong:0}; _ia(_syl(11,vi)); }
        else if (_ims.jung===-1) { _ims.jung=vi; _is(_syl(_ims.cho,vi)); }
        else if (_ims.jong===0)  { const cv=(_CJUNG[_ims.jung]||{})[vi]; if(cv!==undefined){_ims.jung=cv;_is(_syl(_ims.cho,cv));}else{_ims={cho:11,jung:vi,jong:0};_ia(_syl(11,vi));} }
        else { const d=_DJONG[_ims.jong]; if(d){_is(_syl(_ims.cho,_ims.jung,d[0]));_ims={cho:d[1],jung:vi,jong:0};_ia(_syl(d[1],vi));}else{const nc=_J2C[_ims.jong];_is(_syl(_ims.cho,_ims.jung,0));_ims={cho:nc,jung:vi,jong:0};_ia(_syl(nc,vi));} }
      }
    }
    function _imeBs() {
      if (!_ims) { _ip(); return; }
      if (_ims.jong) { const d=_DJONG[_ims.jong]; if(d){_ims.jong=d[0];_is(_syl(_ims.cho,_ims.jung,d[0]));}else{_ims.jong=0;_is(_syl(_ims.cho,_ims.jung,0));} }
      else if (_ims.jung!==-1) { const dv=_DJUNG[_ims.jung]; if(dv!==undefined){_ims.jung=dv;_is(_syl(_ims.cho,dv));}else{_ims.jung=-1;_is(_CCH[_ims.cho]);} }
      else { _ip(); _ims=null; }
    }
    function _koKbdSetShift(v) {
      _koShifted=v;
      document.getElementById('ko-shift').classList.toggle('active',v);
      _koKbd.querySelectorAll('.ko-key[data-ks]').forEach(k=>{ k.textContent=v?k.dataset.ks:k.dataset.k; });
    }
    function _koKbdReset() { _koKbd.classList.remove('visible'); _ims=null; _koKbdSetShift(false); }
    function _koKbdShow()  { if (LANG.current==='ko') _koKbd.classList.add('visible'); }

    // Prevent keys from stealing focus from input
    _koKbd.querySelectorAll('button').forEach(b=>{
      b.addEventListener('mousedown', e=>e.preventDefault());
      b.addEventListener('touchstart', e=>e.preventDefault(), {passive:false});
    });
    document.getElementById('ko-shift').addEventListener('click', ()=>_koKbdSetShift(!_koShifted));
    document.getElementById('ko-bs').addEventListener('click',    ()=>{ _imeBs(); inp.focus(); });
    document.getElementById('ko-space').addEventListener('click', ()=>{ _ims=null; _ia(' '); inp.focus(); });
    _koKbd.querySelectorAll('.ko-key[data-k]').forEach(k=>{
      k.addEventListener('click', ()=>{
        const jamo=_koShifted&&k.dataset.ks?k.dataset.ks:k.dataset.k;
        if (_koShifted&&k.dataset.ks) _koKbdSetShift(false);
        _imeType(jamo); inp.focus();
      });
    });
    inp.addEventListener('focus', _koKbdShow);
    inp.addEventListener('input', ()=>{ if (!inp.value) _ims=null; });

    function _reveal_translation(jp_text) {
      body_el.querySelectorAll('.dlg-turn-npc').forEach(turn => {
        if (turn.dataset.jp === jp_text) turn.classList.add('complete');
      });
      if (cur_npc_id) _save_revealed(cur_npc_id, jp_text);
    }

    // ── Drag to reposition ────────────────────────────────────────────────────
    const dlg_header = document.getElementById('ws-dlg-header');
    let _dlg_drag = null;
    dlg_header.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      e.preventDefault();
      const rect = dlg_el.getBoundingClientRect();
      dlg_el.style.transform = 'none';
      dlg_el.style.top  = rect.top  + 'px';
      dlg_el.style.left = rect.left + 'px';
      _dlg_drag = { ox: e.clientX - rect.left, oy: e.clientY - rect.top };
      dlg_header.setPointerCapture(e.pointerId);
      dlg_header.classList.add('dragging');
    });
    dlg_header.addEventListener('pointermove', e => {
      if (!_dlg_drag) return;
      const x = Math.max(0, Math.min(e.clientX - _dlg_drag.ox, window.innerWidth  - dlg_el.offsetWidth));
      const y = Math.max(0, Math.min(e.clientY - _dlg_drag.oy, window.innerHeight - dlg_el.offsetHeight));
      dlg_el.style.left = x + 'px';
      dlg_el.style.top  = y + 'px';
    });
    dlg_header.addEventListener('pointerup',     () => { _dlg_drag = null; dlg_header.classList.remove('dragging'); });
    dlg_header.addEventListener('pointercancel', () => { _dlg_drag = null; dlg_header.classList.remove('dragging'); });

    function hasFresh(npc_id) { return !_dlg_store[_hk(npc_id)]?.some(m=>m.greeting||m.role==='user'); }

    // Save an ambient speech-bubble line to this NPC's persistent history.
    // Called from input2d._advance_convo() each time a convo_bubble is shown.
    function addAmbient(npc_id, ko, en) {
      const hk=_hk(npc_id);
      const msg={role:'assistant',content:JSON.stringify({jp:ko,en}),ambient:true};
      const hist=[...(_dlg_store[hk]||[]),msg];
      _dlg_store[hk]=hist;
      if (_histories[hk]) _histories[hk]=hist; // sync if panel is open for this NPC
      try{localStorage.setItem(DLG_KEY,JSON.stringify(_dlg_store));}catch{}
    }

    return {open, openConvo, close, refreshWordColors: _refresh_dlg_word_colors, revealTranslation: _reveal_translation, hasFresh, addAmbient};
  })();
