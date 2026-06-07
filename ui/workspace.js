function _fmt_read(furi, rom) {
  const f=furi||'', r=rom||'';
  return (f && r && f!==r) ? `${f}  [${r}]` : (f||r);
}

function _first_meaning(s) {
  if (!s) return s;
  const first = s.split(/\s*[,\/]\s*|\s+or\s+/)[0];
  const words = first.trim().split(/\s+/);
  if (words.length < 3) return first;
  // If 3+ words and none is a connector/function word, LLM returned space-separated synonyms — keep only first
  const conn = /^(and|or|a|an|the|to|is|are|be|not|for|in|at|of|on|by|but|do|no|so|please|with|as|from|its|up|can|may|will|would|should|have|has|had|am|was|were|been|get|go|ll|i|you|we|they|he|she|it)$/i;
  return words.some(w => conn.test(w)) ? first : words[0];
}

let _KO_FALLBACK; // populated by WorkspacePanel, shared with VocabPanel

const WorkspacePanel = (() => {
    const panel_el  = document.getElementById("ws-panel");
    const ws_el     = document.getElementById("workspace");
    const empty_el  = document.getElementById("ws-empty");
    const chips_row = document.getElementById("ws-chips-row");
    // Drag-to-scroll the chips row (pointer drag on desktop; touch scrolls natively via overflow-x)
    let _cr_sx=0, _cr_sl=0, _cr_down=false, _cr_moved=false;
    chips_row.addEventListener('pointerdown', e => {
      if (e.target===inp || e.button) return;
      if (e.target.closest('.ws-token')) return; // let HTML5 drag handle token dragging
      _cr_down=true; _cr_moved=false; _cr_sx=e.clientX; _cr_sl=chips_row.scrollLeft;
      chips_row.classList.add('dragging');
    });
    document.addEventListener('pointermove', e => {
      if (!_cr_down) return;
      const dx=e.clientX-_cr_sx;
      if (Math.abs(dx)>4) _cr_moved=true;
      chips_row.scrollLeft=_cr_sl-dx;
    });
    const _cr_up=()=>{ _cr_down=false; chips_row.classList.remove('dragging'); };
    document.addEventListener('pointerup',     _cr_up);
    document.addEventListener('pointercancel', _cr_up);
    // Swallow click if we moved, so dragging doesn't accidentally select a word
    chips_row.addEventListener('click', e=>{ if (_cr_moved){ e.stopPropagation(); _cr_moved=false; } }, true);

    // ── Drag-to-slot: drop obj-label (English meaning) onto a meaning slot ──
    chips_row.addEventListener('dragover', e => {
      if (!e.dataTransfer.types.includes('obj-label')) return;
      const slot = e.target?.closest?.('.ws-token-meaning.slot-empty, .ws-part-meaning.slot-empty');
      if (!slot) {
        chips_row.querySelectorAll('.slot-drop-over').forEach(s => s.classList.remove('slot-drop-over'));
        return;
      }
      e.preventDefault();
      chips_row.querySelectorAll('.slot-drop-over').forEach(s => { if (s !== slot) s.classList.remove('slot-drop-over'); });
      slot.classList.add('slot-drop-over');
    });
    chips_row.addEventListener('dragleave', e => {
      if (!e.relatedTarget || !chips_row.contains(e.relatedTarget))
        chips_row.querySelectorAll('.slot-drop-over').forEach(s => s.classList.remove('slot-drop-over'));
    });
    chips_row.addEventListener('drop', e => {
      chips_row.querySelectorAll('.slot-drop-over').forEach(s => s.classList.remove('slot-drop-over'));
      const word = e.dataTransfer.getData('obj-label');
      if (!word) return;
      const slot = e.target?.closest?.('.ws-token-meaning.slot-empty, .ws-part-meaning.slot-empty');
      if (!slot) return;
      e.preventDefault();
      const tok_idx  = +slot.dataset.tokIdx;
      const part_idx = slot.dataset.partIdx !== undefined ? +slot.dataset.partIdx : null;
      _select(tok_idx, part_idx, 'meaning');
      inp.value = word;
      inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    });

    const lbl_el    = document.getElementById("ws-sign-label");
    const speak_all = document.getElementById("ws-speak-all");
    const voice_pick = document.getElementById("ws-voice-pick");
    const inp       = document.getElementById("ws-input");
    inp.addEventListener("mousedown", e => e.stopPropagation());
    inp.addEventListener("click",     e => e.stopPropagation());
    let _inp_pd = false;
    inp.addEventListener("pointerdown", () => { _inp_pd = true; });
    document.addEventListener("pointerup", () => { _inp_pd = false; });
    inp.addEventListener("dragover", e => {
      if (!e.dataTransfer.types.includes('obj-label')) return;
      if (inp.parentElement?.dataset?.field !== 'meaning') return;
      e.preventDefault(); inp.classList.add('drag-over');
    });
    inp.addEventListener("dragleave", () => inp.classList.remove('drag-over'));
    inp.addEventListener("drop", e => {
      const word = e.dataTransfer.getData('obj-label');
      if (!word || inp.parentElement?.dataset?.field !== 'meaning') return;
      e.preventDefault(); inp.classList.remove('drag-over');
      inp.value = word;
      inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    });
    const fb        = document.getElementById("ws-feedback");
    const hint_read = document.getElementById("ws-hint-read");
    const hint_mean = document.getElementById("ws-hint-mean");
    const lkp       = document.getElementById("ws-lookup");
    const lkp_bar   = document.getElementById("ws-lookup-bar");
    const copy_btn  = document.getElementById("ws-copy-sentence");

    function _show_hint(reading, meaning) {
      hint_read.textContent = reading || '';
      hint_mean.textContent = meaning  || '';
    }
    function _clear_hint() {
      hint_read.textContent=''; hint_mean.textContent='';
    }

    let cur_sign_id = null, cur_word_idx = null, cur_part_idx = null, word_results = {}, _lkp_timer = null, _checking = false;
    let _npc_line_id = null;
    let _active_field = null; // 'romaji' | 'meaning'
    let _hint_by_key = {}; // res_key → {reading, meaning} — persists lookup results per word
    let _npc_defs = {};
    let _player_translations = {}; // sentence text → English translation

    function _copy_text(text, flashEl) {
      if (!text) return;
      navigator.clipboard.writeText(text).catch(() => {
        const ta=document.createElement("textarea"); ta.value=text;
        ta.style.cssText="position:fixed;top:-999px;left:-999px;opacity:0;";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      });
      if (flashEl) {
        flashEl.classList.add("flash","ws-popup-copied");
        setTimeout(() => flashEl.classList.remove("flash","ws-popup-copied"), 900);
      }
    }

    const OLLAMA_URL = "/ollama/api/chat", OLLAMA_MODEL = "llama3.1:8b";

    async function _llama_judge_meaning(token, player_input, on_status) {
      const ctl = new AbortController();
      const tid = setTimeout(() => ctl.abort(), 60000);
      let elapsed = 0;
      const pulse = setInterval(() => { elapsed++; on_status?.(`asking LLM… ${elapsed}s`); }, 1000);
      try {
        const lang = LANG.current === 'ko' ? 'Korean' : 'Japanese';
        on_status?.('asking LLM…');
        const res = await fetch(OLLAMA_URL, { method:"POST", headers:{"Content-Type":"application/json"},
          signal: ctl.signal,
          body: JSON.stringify({ model:OLLAMA_MODEL, messages:[{role:"user", content:
            `${lang} word: ${token.text}\nAccepted meanings: ${token.meaning}\nStudent answer: ${player_input}\nIs the student's answer close enough in meaning to be marked correct? Reply yes or no only.`
          }], stream:false, keep_alive:-1, options:{temperature:0, num_predict:5} }) });
        clearTimeout(tid); clearInterval(pulse);
        if (!res.ok) { on_status?.(`LLM error: HTTP ${res.status}`); return false; }
        const reply = (await res.json()).message?.content?.trim() || '';
        const ok = reply.toLowerCase().startsWith("yes");
        on_status?.(`LLM: ${ok ? '✓ correct' : '✗ wrong'}`);
        return ok;
      } catch(e) {
        clearTimeout(tid); clearInterval(pulse);
        on_status?.(e.name === 'AbortError' ? 'LLM timed out' : `LLM error: ${e.message}`);
        return false;
      }
    }

    function _normRomaji(s) { return s.toLowerCase().replace(/[-\s]+/g,"").replace(/ou/g,"o").replace(/uu/g,"u").replace(/aa/g,"a"); }
    function _isNumericToken(token) { return /^\d+$/.test(token.text); }
    function _checkWhat(word, raw, res) {
      const val=raw.trim().toLowerCase(), val_ns=val.replace(/\s+/g,"");
      if (!val) return null;
      if (!res.romaji) {
        if (word.romaji && _normRomaji(val_ns)===_normRomaji(word.romaji)) return "romaji";
        if (val_ns===(word.furigana||"").toLowerCase()) return "romaji";
      }
      if (!res.meaning) {
        const norm=s=>s.replace(/[?!.,]+$/,"");
        const depolite=s=>s.replace(/^(please|to|is)\s+/,'');
        const parts=word.meaning.replace(/\(.*?\)/g,"").toLowerCase().split(/\s*[/,]\s*/).map(p=>depolite(norm(p.trim()))).filter(Boolean);
        const v=depolite(norm(val)), v_ns=depolite(norm(val_ns));
        if (parts.some(p=>v===p||v_ns===p.replace(/\s+/g,""))) return "meaning";
        // Accept base adjective/adverb form of -ly adverbs:
        //   quietly→quiet  slowly→slow  strictly→strict  comfortably→comfortable
        if (parts.some(p => {
          if (p.length < 6 || !p.endsWith('ly')) return false;
          const base = p.endsWith('ably') ? p.slice(0,-4)+'able'
                     : p.endsWith('ibly') ? p.slice(0,-4)+'ible'
                     : p.slice(0,-2);
          return base.length >= 4 && base !== 'friend' && (v===base || v_ns===base);
        })) return "meaning";
        // Accept base verb of -ing gerunds; split on " and " within a part first.
        if (parts.some(p=>p.split(' and ').some(piece=>{
          if (piece.endsWith('ing')) {
            const base=piece.slice(0,-3);
            if (base.length>=3&&(v===base||v_ns===base)) return true;
            const baseE=base+'e';
            return base.length>=2&&baseE!=='please'&&(v===baseE||v_ns===baseE);
          }
          // Compound gerund: "bringing in" → accept "bring in"
          const words=piece.split(' ');
          if (words.length>=2&&words[0].endsWith('ing')) {
            const gerund=words[0], rest=words.slice(1).join(' ');
            const base=gerund.slice(0,-3);
            if (base.length>=3&&(v===base+' '+rest||v_ns===(base+rest))) return true;
            const baseE=base+'e';
            if (base.length>=2&&(v===baseE+' '+rest||v_ns===(baseE+rest))) return true;
          }
          return false;
        }))) return "meaning";
        // Accept head noun of "X particle" / "X marker": "topic particle" → "topic"
        if (parts.some(p => {
          const m = p.match(/^(.+)\s+(particle|marker)$/);
          return m && (v === m[1] || v_ns === m[1].replace(/\s+/g,''));
        })) return "meaning";
        // Accept singular↔plural: strip trailing -s (not -ss, min 4 chars)
        {const depl=s=>s.endsWith('s')&&!s.endsWith('ss')&&s.length>3?s.slice(0,-1):s;
        if (parts.some(p=>depl(v)===depl(p)||depl(v_ns)===depl(p.replace(/\s+/g,'')))) return "meaning";}
        // Accept base form of -es verb conjugations: does→do, goes→go, watches→watch
        if (parts.some(p=>{
          if (!p.endsWith('es')||p.length<=3) return false;
          const base=p.slice(0,-2);
          return base.length>=2&&(v===base||v_ns===base);
        })) return "meaning";
        // Accept base verb of -ment nominalizations: replenishment→replenish, movement→move.
        if (parts.some(p=>{
          if (!p.endsWith('ment')) return false;
          const base=p.slice(0,-4);
          return base.length>=4&&(v===base||v_ns===base);
        })) return "meaning";
        // Accept base verb of -ed past participles (depolite already strips "is "):
        //   allowed→allow  prohibited→prohibit  closed→close  related→relate  permitted→permit
        if (parts.some(p=>{
          if (p.endsWith('ed')) {
            const base=p.slice(0,-2);
            if (base.length>=3&&(v===base||v_ns===base)) return true;
            if (base.length>=2&&base[base.length-1]===base[base.length-2]) {
              const base2=base.slice(0,-1);
              if (base2.length>=3&&(v===base2||v_ns===base2)) return true;
            }
          }
          if (p.endsWith('d')) {
            const base=p.slice(0,-1);
            if (base.endsWith('e')&&base.length>=4&&(v===base||v_ns===base)) return true;
          }
          return false;
        })) return "meaning";
      }
      return null;
    }

    function _update_lkp() {
      const cd=sim.state.phone.lookup_cooldown;
      lkp.disabled=cd>0||cur_word_idx==null;
      lkp.textContent=cd>0?`📱 ${cd}s`:'📱 look up';
      lkp_bar.style.width=cd>0?`${(cd/60)*100}%`:'0%';
    }
    function _start_lkp_timer() {
      if (_lkp_timer) return;
      _lkp_timer=setInterval(()=>{ _update_lkp(); if(sim.state.phone.lookup_cooldown<=0){clearInterval(_lkp_timer);_lkp_timer=null;} },1000);
    }

    function _render_chips() {
      // Rescue inp from being removed along with old chips
      panel_el.appendChild(inp); inp.style.display='none';
      [...chips_row.querySelectorAll(".ws-merged-chip")].forEach(c=>c.remove());
      const merged=document.createElement("div"); merged.className="ws-merged-chip";
      const sign=SIGN_BY_ID[cur_sign_id]; if (!sign) return;
      const tokens=sign.tokens||[];
      const full=(sign.japanese||tokens.map(t=>t.text).join('')).replace(/\n/g,' ');
      let pos=0, tok_idx=0;

      // Helper: place inp in a slot (reading or meaning)
      function _placeInp(slotEl) {
        slotEl.appendChild(inp);
        inp.style.display='';
      }

      while (pos<=full.length && tok_idx<tokens.length) {
        const token=tokens[tok_idx];
        const found=full.indexOf(token.text, pos);
        if (found===-1) { tok_idx++; continue; }
        if (found>pos) {
          const p=document.createElement("span"); p.className="ws-particle";
          p.textContent=full.slice(pos,found); merged.appendChild(p);
        }
        const span=document.createElement("span"); span.className="ws-token";
        const res=word_results[tok_idx]||{};
        const hasParts=token.parts&&token.parts.length>0;
        const isDone=hasParts
          ? token.parts.every((_,pi)=>{ const r=word_results[`${tok_idx}p${pi}`]||{}; return r.romaji&&r.meaning; })
          : (res.romaji&&res.meaning);
        if (isDone) span.classList.add("done");
        span.dataset.tokSpan=tok_idx;
        if (hasParts) span.dataset.hasParts='1';
        const _i=tok_idx;

        if (!hasParts) {
          if (tok_idx===cur_word_idx&&cur_part_idx==null) span.classList.add("selected");

          // — reading slot (above kanji) —
          const rspan=document.createElement("span"); rspan.className="ws-token-reading";
          rspan.dataset.tokIdx=tok_idx; rspan.dataset.field='romaji';
          if (res.romaji&&(token.romaji||token.furigana)) {
            rspan.textContent=token.romaji||token.furigana;
          } else if (tok_idx===cur_word_idx&&cur_part_idx==null&&_active_field==='romaji') {
            rspan.classList.add("slot-active"); _placeInp(rspan);
          } else if (!res.romaji) {
            rspan.classList.add("slot-empty");
            const rClick=e=>{ e.stopPropagation(); _select(_i,null,'romaji'); };
            rspan.addEventListener("click",rClick); rspan._slotClick=rClick;
          }
          if (isDone) { rspan.draggable=true; rspan.addEventListener('dragstart',e=>e.preventDefault()); }
          span.appendChild(rspan);

          // — kanji text —
          const textNode=document.createElement("span"); textNode.textContent=token.text;
          span.appendChild(textNode);

          // — meaning slot (below kanji) —
          const mspan=document.createElement("span"); mspan.className="ws-token-meaning";
          mspan.dataset.tokIdx=tok_idx; mspan.dataset.field='meaning';
          if (res.meaning) {
            if (token.meaning) { const raw=Array.isArray(token.meaning)?token.meaning[0]:token.meaning; mspan.textContent=raw.split("/")[0].trim(); }
            mspan.classList.add("slot-done");
          } else if (tok_idx===cur_word_idx&&cur_part_idx==null&&_active_field==='meaning') {
            mspan.classList.add("slot-active"); _placeInp(mspan);
          } else {
            mspan.classList.add("slot-empty");
            const mClick=e=>{ e.stopPropagation(); _select(_i,null,'meaning'); };
            mspan.addEventListener("click",mClick); mspan._slotClick=mClick;
          }
          if (isDone) { mspan.draggable=true; mspan.addEventListener('dragstart',e=>e.preventDefault()); }
          span.appendChild(mspan);

        } else {
          const allPRomaji=token.parts.every((_,pi)=>(word_results[`${tok_idx}p${pi}`]||{}).romaji);
          const allPMeaning=token.parts.every((_,pi)=>(word_results[`${tok_idx}p${pi}`]||{}).meaning);

          // — whole-word reading slot (above parts row) —
          // Always appended so compound tokens maintain consistent height with
          // simple tokens (align-items:center on .ws-merged-chip requires equal
          // reading-slot heights or the Korean text rows won't line up).
          const wrspan=document.createElement("span"); wrspan.className="ws-token-reading";
          wrspan.dataset.tokIdx=tok_idx; wrspan.dataset.field='romaji'; wrspan.dataset.whole='1';
          if (tok_idx===cur_word_idx&&cur_part_idx===-1&&_active_field==='romaji') {
            wrspan.classList.add("slot-active"); _placeInp(wrspan);
          } else if (!allPRomaji) {
            wrspan.classList.add("slot-empty");
            const wrClick=e=>{ e.stopPropagation(); _select(_i,-1,'romaji'); };
            wrspan.addEventListener("click",wrClick); wrspan._slotClick=wrClick;
          } else {
            wrspan.classList.add("slot-spacer");
          }
          span.appendChild(wrspan);

          // — parts token: each part gets its own reading + meaning slots —
          const partsRow=document.createElement("span"); partsRow.className="ws-token-parts";
          token.parts.forEach((part,pi)=>{
            const pres=word_results[`${tok_idx}p${pi}`]||{};
            const pspan=document.createElement("span"); pspan.className="ws-part";
            if (pres.romaji&&pres.meaning) pspan.classList.add("done");
            if (tok_idx===cur_word_idx&&pi===cur_part_idx) pspan.classList.add("selected");
            pspan.dataset.tokSpan=tok_idx; pspan.dataset.partSpan=pi;
            const _pi=pi;

            // part reading slot
            const prspan=document.createElement("span"); prspan.className="ws-part-reading";
            prspan.dataset.tokIdx=tok_idx; prspan.dataset.partIdx=pi; prspan.dataset.field='romaji';
            if (pres.romaji&&(part.romaji||part.furigana)) {
              prspan.textContent=part.romaji||part.furigana||'';
            } else if (tok_idx===cur_word_idx&&pi===cur_part_idx&&_active_field==='romaji') {
              prspan.classList.add("slot-active"); _placeInp(prspan);
            } else if (!pres.romaji) {
              prspan.classList.add("slot-empty");
              const prClick=e=>{ e.stopPropagation(); _select(_i,_pi,'romaji'); };
              prspan.addEventListener("click",prClick); prspan._slotClick=prClick;
            }
            if (isDone) { prspan.draggable=true; prspan.addEventListener('dragstart',e=>e.preventDefault()); }
            pspan.appendChild(prspan);

            // part kanji text
            const ptspan=document.createElement("span"); ptspan.textContent=part.text;
            pspan.appendChild(ptspan);

            // part meaning slot
            const pmspan=document.createElement("span"); pmspan.className="ws-part-meaning";
            pmspan.dataset.tokIdx=tok_idx; pmspan.dataset.partIdx=pi; pmspan.dataset.field='meaning';
            if (pres.meaning) {
              if (part.meaning) { const raw=Array.isArray(part.meaning)?part.meaning[0]:part.meaning; pmspan.textContent=raw.split("/")[0].trim(); }
              pmspan.classList.add("slot-done");
            } else if (tok_idx===cur_word_idx&&pi===cur_part_idx&&_active_field==='meaning') {
              pmspan.classList.add("slot-active"); _placeInp(pmspan);
            } else {
              pmspan.classList.add("slot-empty");
              const pmClick=e=>{ e.stopPropagation(); _select(_i,_pi,'meaning'); };
              pmspan.addEventListener("click",pmClick); pmspan._slotClick=pmClick;
            }
            if (isDone) { pmspan.draggable=true; pmspan.addEventListener('dragstart',e=>e.preventDefault()); }
            pspan.appendChild(pmspan);

            pspan.addEventListener("click",e=>{ e.stopPropagation(); _select(_i,_pi); });
            partsRow.appendChild(pspan);
          });
          span.appendChild(partsRow);

          // — whole-word meaning slot (below parts row) —
          const wmspan=document.createElement("span"); wmspan.className="ws-token-meaning";
          wmspan.dataset.tokIdx=tok_idx; wmspan.dataset.field='meaning'; wmspan.dataset.whole='1';
          if (allPMeaning) {
            if (token.meaning) { const raw=Array.isArray(token.meaning)?token.meaning[0]:token.meaning; wmspan.textContent=raw.split("/")[0].trim(); }
            wmspan.classList.add("slot-done");
          } else if (tok_idx===cur_word_idx&&cur_part_idx===-1&&_active_field==='meaning') {
            wmspan.classList.add("slot-active"); _placeInp(wmspan);
          } else {
            wmspan.classList.add("slot-empty");
            const wmClick=e=>{ e.stopPropagation(); _select(_i,-1,'meaning'); };
            wmspan.addEventListener("click",wmClick); wmspan._slotClick=wmClick;
          }
          if (isDone) { wmspan.draggable=true; wmspan.addEventListener('dragstart',e=>e.preventDefault()); }
          span.appendChild(wmspan);
        }

        // copy badge
        const copyBtn=document.createElement("span"); copyBtn.className="ws-token-copy-btn"; copyBtn.textContent="⎘";
        copyBtn.title="copy"; copyBtn.addEventListener("click",e=>{
          e.stopPropagation(); _copy_text(token.text, copyBtn);
        });
        span.appendChild(copyBtn);
        // navigation button (wayfinding tokens only)
        if (token.points_to) {
          const dest=ROOM_DEFS[token.points_to];
          const navBtn=document.createElement("button"); navBtn.className="ws-nav-btn";
          navBtn.textContent="→ "+(dest?dest.name_en:token.points_to);
          navBtn.addEventListener("click",e=>{ e.stopPropagation(); clear(); sim.navigate_to_room(token.points_to); });
          span.appendChild(navBtn);
        }
        span.draggable=true;
        span.addEventListener("dragstart",e=>{ if(_inp_pd){e.preventDefault();return;} span.classList.add("drag-src"); e.dataTransfer.setData("dlg-word",token.text); e.dataTransfer.effectAllowed="copy"; });
        span.addEventListener("dragend",()=>span.classList.remove("drag-src"));
        span.addEventListener("click",()=>{
          if (hasParts) {
            // find first undone part + field
            let fi=-1, ff='romaji';
            for (let pi=0;pi<token.parts.length;pi++) {
              const r=word_results[`${_i}p${pi}`]||{};
              if (!r.romaji){fi=pi;ff='romaji';break;}
              if (!r.meaning){fi=pi;ff='meaning';break;}
            }
            _select(_i, fi>=0?fi:0, ff);
          } else {
            const r=word_results[_i]||{};
            _select(_i, null, !r.romaji?'romaji':'meaning');
          }
        });
        merged.appendChild(span);
        pos=found+token.text.length; tok_idx++;
      }
      if (pos<full.length) {
        const p=document.createElement("span"); p.className="ws-particle";
        p.textContent=full.slice(pos); merged.appendChild(p);
      }
      chips_row.appendChild(merged);
    }

    function _activate_slot_inplace(idx, part_idx, field) {
      const merged=chips_row.querySelector('.ws-merged-chip');
      if (!merged) return false;
      const isWholeSlot=part_idx===-1;
      const isPartSlot=part_idx!=null&&part_idx>=0;
      const newSlot=isWholeSlot
        ? merged.querySelector(`[data-tok-idx="${idx}"][data-whole="1"][data-field="${field}"]`)
        : isPartSlot
          ? merged.querySelector(`[data-tok-idx="${idx}"][data-part-idx="${part_idx}"][data-field="${field}"]`)
          : merged.querySelector(`[data-tok-idx="${idx}"][data-field="${field}"]:not([data-part-idx]):not([data-whole])`);
      if (!newSlot||newSlot.classList.contains('slot-done')) return false;
      const oldSlot=merged.querySelector('.slot-active');
      // Activate new slot (moves inp away from old slot automatically)
      if (!newSlot.classList.contains('slot-active')) {
        inp.style.opacity='0';
        newSlot.classList.remove('slot-empty');
        newSlot.appendChild(inp);
        inp.style.display='';
        // Force reflow so browser records the pre-active height, enabling the min-height transition
        void newSlot.getBoundingClientRect();
        newSlot.classList.add('slot-active');
        requestAnimationFrame(()=>{ inp.style.opacity=''; });
      }
      // Deactivate old slot
      if (oldSlot&&oldSlot!==newSlot) {
        oldSlot.classList.remove('slot-active');
        oldSlot.classList.add('slot-empty');
        if (oldSlot._slotClick) oldSlot.addEventListener('click',oldSlot._slotClick);
      }
      // Update selected state
      merged.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));
      if (isWholeSlot) {
        const tokSpan=merged.querySelector(`.ws-token[data-tok-span="${idx}"]`);
        if (tokSpan) tokSpan.classList.add('selected');
      } else if (part_idx==null) {
        const tokSpan=merged.querySelector(`.ws-token[data-tok-span="${idx}"]:not([data-has-parts])`);
        if (tokSpan) tokSpan.classList.add('selected');
      } else {
        const partSpan=merged.querySelector(`.ws-part[data-tok-span="${idx}"][data-part-span="${part_idx}"]`);
        if (partSpan) partSpan.classList.add('selected');
      }
      return true;
    }

    _KO_FALLBACK = {
      // ── copula ────────────────────────────────────────────────────────────
      '이에요':    {reading:'ieyo',            meaning:'is'},
      '예요':      {reading:'yeyo',            meaning:'is'},
      // ── birthday ──────────────────────────────────────────────────────────
      '생일':      {reading:'saengil',         meaning:'birthday'},
      // ── months (N월) ──────────────────────────────────────────────────────
      '1월':  {reading:'irwol',    meaning:'January',   parts:[{text:'1', furigana:'1', romaji:'il',   meaning:'one'   },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '2월':  {reading:'iwol',     meaning:'February',  parts:[{text:'2', furigana:'2', romaji:'i',    meaning:'two'   },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '3월':  {reading:'samwol',   meaning:'March',     parts:[{text:'3', furigana:'3', romaji:'sam',  meaning:'three' },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '4월':  {reading:'sawol',    meaning:'April',     parts:[{text:'4', furigana:'4', romaji:'sa',   meaning:'four'  },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '5월':  {reading:'owol',     meaning:'May',       parts:[{text:'5', furigana:'5', romaji:'o',    meaning:'five'  },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '6월':  {reading:'yuwol',    meaning:'June',      parts:[{text:'6', furigana:'6', romaji:'yuk',  meaning:'six'   },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '7월':  {reading:'chirwol',  meaning:'July',      parts:[{text:'7', furigana:'7', romaji:'chil', meaning:'seven' },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '8월':  {reading:'parwol',   meaning:'August',    parts:[{text:'8', furigana:'8', romaji:'pal',  meaning:'eight' },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '9월':  {reading:'guwol',    meaning:'September', parts:[{text:'9', furigana:'9', romaji:'gu',   meaning:'nine'  },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '10월': {reading:'siwol',    meaning:'October',   parts:[{text:'10',furigana:'10',romaji:'sip',  meaning:'ten'   },{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '11월': {reading:'sibirwol', meaning:'November',  parts:[{text:'11',furigana:'11',romaji:'sibil',meaning:'eleven'},{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '12월': {reading:'sibiwol',  meaning:'December',  parts:[{text:'12',furigana:'12',romaji:'sibi', meaning:'twelve'},{text:'월',furigana:'월',romaji:'wol',meaning:'month'}]},
      '월':   {reading:'wol',        meaning:'month'},
      // ── days (N일) ────────────────────────────────────────────────────────
      '일':   {reading:'il',         meaning:'day'},
      // ── greetings & conversation ──────────────────────────────────────────
      '안녕하세요':{reading:'annyeonghaseyo',   meaning:'hello (formal)'},
      '안녕':      {reading:'annyeong',         meaning:'hi / bye (informal)'},
      '어서':      {reading:'eoseo',            meaning:'come / quickly'},
      '오세요':    {reading:'oseyo',            meaning:'please come'},
      '무엇을':    {reading:'mueoseul',         meaning:'what (object)'},
      '무엇이':    {reading:'mueosi',           meaning:'what (subject)'},
      '도와드릴까요':{reading:'dowadeurilkkayo',meaning:'shall I help you?'},
      '도와줄까요': {reading:'dowajulkkayo',    meaning:'shall I help you?'},
      '도와줄게요': {reading:'dowajulgeyo',     meaning:"I'll help you"},
      '오늘':      {reading:'oneul',            meaning:'today'},
      '놀러':      {reading:'nolleo',           meaning:'play / visit / hang out'},
      '오셨어요':  {reading:'osyeosseoyo',      meaning:'did you come?'},
      '재미있게':  {reading:'jaemiitge',        meaning:'enjoyably / have fun'},
      '놀아요':    {reading:'norayo',           meaning:'play / have fun'},
      '오신':      {reading:'osin',             meaning:'(who) came (honorific)'},
      '것':        {reading:'geot',             meaning:'thing / fact / it (bound noun)'},
      '것을':      {reading:'geoseul',          meaning:'thing (object)'},
      '것이':      {reading:'geosi',            meaning:'thing (subject)'},
      '것은':      {reading:'geoseun',          meaning:'thing (topic)'},
      '것도':      {reading:'geotdo',           meaning:'thing (also)'},
      '게':        {reading:'ge',               meaning:'thing / it (contracted 것이)'},
      '걸':        {reading:'geol',             meaning:'thing / it (contracted 것을)'},
      '환영해요':  {reading:'hwanyeonghaeyo',   meaning:'welcome'},
      '환영합니다': {reading:'hwanyeonghamnida',meaning:'welcome (formal)'},
      '천천히':    {reading:'cheoncheonhi',     meaning:'slowly / take your time'},
      '즐기세요':  {reading:'jeulgiseyo',       meaning:'please enjoy'},
      '살펴보세요': {reading:'salpyeoboseyo',   meaning:'please take a look / please look / look'},
      '즐겨':      {reading:'jeulgeo',          meaning:'enjoy'},
      '편히':      {reading:'pyeonhi',          meaning:'comfortably'},
      '쉬다':      {reading:'swida',            meaning:'rest / relax / take a break'},
      '가세요':    {reading:'gaseyo',           meaning:'please go / stay a while'},
      '날씨':      {reading:'nalssi',           meaning:'weather'},
      '좋죠':      {reading:'jochyo',           meaning:"nice, right?"},
      '야외':      {reading:'yaoe',             meaning:'outdoors'},
      '규칙을':    {reading:'gyuchikceul',      meaning:'rules (object)'},
      '지키며':    {reading:'jikyimyeo',        meaning:'while following'},
      '주세요':    {reading:'juseyo',           meaning:'please'},
      '잘':        {reading:'jal',              meaning:'well / fine'},
      '죄송해요':  {reading:'joesonghaeyo',     meaning:"I'm sorry (formal) / sorry"},
      '미안해요':  {reading:'mianhaeyo',        meaning:"I'm sorry / sorry"},
      '이해하지':  {reading:'ihaehaji',         meaning:'understand (negative form)'},
      '못했어요':  {reading:'mothaesseoyo',     meaning:"couldn't / wasn't able to"},
      '다시':      {reading:'dasi',             meaning:'again'},
      '한번':      {reading:'hanbeon',          meaning:'once / one more time'},
      '말씀해':    {reading:'malsseum-hae',     meaning:'please say / speak'},
      '주시겠어요':{reading:'jusigesseoyo',     meaning:'would you please?'},
      '네':        {reading:'ne',               meaning:'yes'},
      '아':        {reading:'a',               meaning:'ah (exclamation)'},
      '아니요':    {reading:'aniyo',            meaning:'no'},
      '아니에요':  {reading:'anieyo',           meaning:"isn't / no"},
      '감사합니다':{reading:'gamsahamnida',     meaning:'thank you (formal)'},
      '감사해요':  {reading:'gamsahaeyo',       meaning:'thank you'},
      '고마워요':  {reading:'gomawoyo',         meaning:'thank you (informal)'},
      '괜찮아요':  {reading:'gwaenchanayo',     meaning:"it's okay / fine"},
      '괜찮아':    {reading:'gwaenchana',       meaning:"it's okay (informal)"},
      '알겠어요':  {reading:'algeseoyo',        meaning:'I understand'},
      '모르겠어요':{reading:'moreugeseoyo',     meaning:"I don't know"},
      '좋아요':    {reading:'joayo',            meaning:'good / I like it'},
      '좋겠다':    {reading:'jokkeda',          meaning:'sounds nice / that\'s nice / how nice / nice'},
      '있어요':    {reading:'isseoyo',          meaning:'there is / is / are / exist / exists / have / has / I have'},
      '없어요':    {reading:'eopseoyo',         meaning:"there isn't / I don't have"},
      '그래요':    {reading:'geuraeyo',         meaning:"I see / that's right"},
      '맞아요':    {reading:'majayo',           meaning:"that's right / correct"},
      '여기':      {reading:'yeogi',            meaning:'here'},
      '거기':      {reading:'geogi',            meaning:'there'},
      '지금':      {reading:'jigeum',           meaning:'now'},
      '정말':      {reading:'jeongmal',         meaning:'really / truly'},
      '조금':      {reading:'jogeum',           meaning:'a little'},
      '많이':      {reading:'mani',             meaning:'a lot / many'},
      '빨리':      {reading:'ppalli',           meaning:'quickly / fast'},
      '잠깐만요':  {reading:'jamkkanmanyo',     meaning:'just a moment'},
      '어떻게':    {reading:'eotteoke',         meaning:'how'},
      '왜':        {reading:'wae',              meaning:'why'},
      '언제':      {reading:'eonje',            meaning:'when'},
      '어디':      {reading:'eodi',             meaning:'where'},
      '누구':      {reading:'nugu',             meaning:'who'},
      '저는':      {reading:'jeoneun',          meaning:'I'},
      '놀이공간':  {reading:'noligonggan',      meaning:'play area'},
      '가시고':    {reading:'gasigo',           meaning:'go (honorific)'},
      // ── rules / instructions ──────────────────────────────────────────────
      '지켜':      {reading:'jikyeo',           meaning:'protect / keep / follow (rules)'},
      '지켜요':    {reading:'jikyeoyo',         meaning:'protects / keeps (polite)'},
      '지켜줘':    {reading:'jikyeojwo',        meaning:'please protect / keep for me'},
      '지키세요':  {reading:'jikiséyo',         meaning:'please follow / please keep'},
      '지키고':    {reading:'jikigo',           meaning:'following / keeping (and…)'},
      '조용히':    {reading:'joyonghi',         meaning:'quietly / silently / please be quiet'},
      '삼가':      {reading:'samga',            meaning:'refrain / hold back'},
      '삼가세요':  {reading:'samgaseyo',        meaning:'please refrain / please hold back'},
      '금지':      {reading:'geunji',           meaning:'prohibited / banned / forbidden / not allowed'},
      '주목':      {reading:'jumok',            meaning:'attention'},
      '주의':      {reading:'juui',             meaning:'caution / attention / careful / warning'},
      '양보':      {reading:'yangbo',           meaning:'yield / give way / let pass / make way / priority'},
      '반입':      {reading:'banip',            meaning:'bringing in / bringing inside / carrying in'},
      '가능':      {reading:'ganeung',          meaning:'possible / allowed / OK / permissible'},
      '합니다':    {reading:'hamnida',          meaning:'is / does (formal sentence ending)'},
      '있습니다':  {reading:'itsseumnida',      meaning:'is / exists / there is (formal)'},
      '되어':      {reading:'dweo',             meaning:'become / is (passive connector)'},
      '되었습니다': {reading:'dwaesseumnida',    meaning:'has been done'},
      '되었어요':  {reading:'dwaesseoyo',        meaning:'has been done (polite)'},
      // ── library / books ───────────────────────────────────────────────────
      '저자':      {reading:'jeoja',            meaning:'author / writer'},
      '저자명':    {reading:'jeojaMyeong',      meaning:'author name / author'},
      '제목':      {reading:'jemok',            meaning:'title'},
      '책':        {reading:'chaek',            meaning:'book'},
      '책을':      {reading:'chaegeul',         meaning:'book (object)'},
      '책이':      {reading:'chaegi',           meaning:'book (subject)'},
      '책은':      {reading:'chaegeun',         meaning:'book (topic)'},
      '출판사':    {reading:'chulpansa',        meaning:'publisher / publishing company'},
      '출판':      {reading:'chulpan',          meaning:'publication / publish'},
      '대출':      {reading:'daechul',          meaning:'borrow / loan / checkout'},
      '반납':      {reading:'bannap',           meaning:'return / give back'},
      '반납하다':  {reading:'bannapada',        meaning:'return / give back'},
      '열람':      {reading:'yeollam',          meaning:'reading / browsing (in library)'},
      '열람실':    {reading:'yeollamsil',       meaning:'reading room'},
      '자료':      {reading:'jaryo',            meaning:'material / resource / data'},
      '검색':      {reading:'geomsaek',         meaning:'search / look up'},
      '사서':      {reading:'saseo',            meaning:'librarian'},
      '책장':      {reading:'chaekjang',        meaning:'bookshelf'},
      '서가':      {reading:'seoga',            meaning:'bookshelf / stacks'},
      '층':        {reading:'cheung',           meaning:'floor / level / story'},
      '관람':      {reading:'gwallam',          meaning:'viewing / browsing'},
      // ── particles ─────────────────────────────────────────────────────────
      '은':        {reading:'eun',              meaning:'topic particle'},
      '는':        {reading:'neun',             meaning:'topic particle'},
      '이':        {reading:'i',               meaning:'subject particle / this'},
      '가':        {reading:'ga',              meaning:'subject particle'},
      '을':        {reading:'eul',              meaning:'object marker'},
      '를':        {reading:'reul',             meaning:'object marker'},
      '와':        {reading:'wa',              meaning:'and / with'},
      '과':        {reading:'gwa',             meaning:'and / with'},
      '도':        {reading:'do',              meaning:'also / too'},
      '만':        {reading:'man',             meaning:'only'},
      '의':        {reading:'ui',              meaning:"possessive ('s)"},
      '에':        {reading:'e',               meaning:'at / in / to'},
      '로':        {reading:'ro',              meaning:'to / by / with'},
      // ── home / host vocabulary ────────────────────────────────────────────
      '주인':      {reading:'juin',             meaning:'owner / host / master'},
      '집주인':    {reading:'jipjuin',          meaning:'landlord / homeowner / host'},
      // ── library sign ──────────────────────────────────────────────────────

      '콘센트':    {reading:'konsenteu',        meaning:'outlet'},
      '도서관':    {reading:'doseogwan',        meaning:'library'},
      '도서':      {reading:'doseo',            meaning:'books / reading material / literature'},
      '관':        {reading:'gwan',             meaning:'building / hall / institute'},
      '업무':      {reading:'eommu',            meaning:'work / duties / business / operations'},
      '전용':      {reading:'jeonyong',         meaning:'exclusively for / dedicated / reserved for'},
      '사용':      {reading:'sayong',           meaning:'use / usage / using'},
      '해':        {reading:'hae',              meaning:'do / please do (casual form of 하다)'},
      '하세요':    {reading:'haseyo',          meaning:'please do / are you doing (polite honorific)'},
      '해요':      {reading:'haeyo',           meaning:'do / does (polite)'},
      '하다':      {reading:'hada',            meaning:'do / make / act'},
      '하면':      {reading:'hamyeon',         meaning:'if you do / when you do'},
      '하고':      {reading:'hago',            meaning:'doing / and'},
      '해서':      {reading:'haeseo',          meaning:'doing / because'},
      '하시면':    {reading:'hasimyeon',       meaning:'if you do (honorific)'},
      '했어요':    {reading:'haesseoyo',       meaning:'did (past polite)'},
      '했습니다':  {reading:'haesseumnida',    meaning:'did (past formal)'},
      '하겠어요':  {reading:'hagesseoyo',      meaning:'will do (polite)'},
      '하겠습니다':{reading:'hagesseumnida',   meaning:'will do (formal)'},
      '하십시오':  {reading:'hasipsio',        meaning:'please do (formal honorific)'},
      '겠어요':    {reading:'gesseoyo',        meaning:'will / intend to (polite)'},
      '겠습니다':  {reading:'gesseumnida',     meaning:'will / intend to (formal)'},
      '습니다':    {reading:'seumnida',        meaning:'is / does (formal sentence ending)'},
      '관내':      {reading:'gwannae',          meaning:'inside the building / indoors'},
      '휴대전화':  {reading:'hyudaejeonhwa',    meaning:'mobile phone'},
      '휴대':      {reading:'hyudae',           meaning:'portable / handheld / carry'},
      '전화':      {reading:'jeonhwa',          meaning:'telephone / phone / call'},
      '통화':      {reading:'tonghwa',          meaning:'phone call / call / calling'},
      '음식물':    {reading:'eumsigmul',        meaning:'food and drink / refreshments'},
      '음식':      {reading:'eumsik',           meaning:'food / food and drink'},
      '물':        {reading:'mul',              meaning:'water / substance (suffix 物)'},
      '섭취':      {reading:'seopchwi',         meaning:'consumption / intake / eating and drinking'},
      // ── children's area signs ─────────────────────────────────────────────
      '어린이':    {reading:'eorini',           meaning:'child / children'},
      '어린':      {reading:'eorin',            meaning:'young / little / small'},
      '아이':      {reading:'ai',               meaning:'child / children / kid'},
      '어른':      {reading:'eoreun',           meaning:'adult / grown-up'},
      '갤러리':    {reading:'gaelreori',         meaning:'gallery'},
      '살롱':      {reading:'sallong',          meaning:'salon / lounge'},
      '살롱에':    {reading:'sallonge',         meaning:'at the salon'},
      '요리실':    {reading:'yorisil',          meaning:'cooking room / kitchen'},
      '요리':      {reading:'yori',             meaning:'cooking / cuisine'},
      '실':        {reading:'sil',              meaning:'room / chamber / office'},
      '완구':      {reading:'wangu',            meaning:'toys'},
      '전시관':    {reading:'jeonshigwan',      meaning:'exhibition hall'},
      '전시':      {reading:'jeonsi',           meaning:'exhibition / display / showcase'},
      '접수':      {reading:'jeopsu',           meaning:'reception / front desk / check-in / registration'},
      '마감':      {reading:'magam',            meaning:'closed / deadline / end / finished'},
      '신발':      {reading:'sinbal',           meaning:'shoes / footwear'},
      '벗어':      {reading:'beoseo',           meaning:'take off'},
      '함께':      {reading:'hamkke',           meaning:'together / with / along with'},
      '위한':      {reading:'wihan',            meaning:'for / intended for / for the sake of'},
      '공간':      {reading:'gonggan',          meaning:'space / area / place'},
      '차례차례':  {reading:'charyecharye',     meaning:'in turns / one by one / taking turns'},
      '사이좋게':  {reading:'saijokke',         meaning:'friendly / harmoniously / nicely / amicably'},
      '수분':      {reading:'subun',            meaning:'water / hydration / moisture'},
      '보충':      {reading:'bochung',          meaning:'replenishment / supplement / refill'},
      '이상':      {reading:'isang',            meaning:'and over / or older / or more / at least / above'},
      // ── zipline sign ──────────────────────────────────────────────────────
      '짚라인':    {reading:'jiprain',          meaning:'zipline'},
      '짚라인을':  {reading:'jiprainerul',      meaning:'zipline (object)'},
      '이용':      {reading:'iyong',            meaning:'use / utilization / usage'},
      '이용하시려면':{reading:'iyong hashiryeomyeon', meaning:'if you want to use (honorific)'},
      '이용자':    {reading:'iyongja',          meaning:'user'},
      '자':        {reading:'ja',               meaning:'person / one who (suffix)'},
      '지나가':    {reading:'jinaga',           meaning:'pass / go through / pass by'},
      '차례':      {reading:'charye',           meaning:"turn / one's turn / order"},
      '차례를':    {reading:'charyereul',       meaning:"turn / one's turn (object)"},
      // ── age markers (signs) ───────────────────────────────────────────────
      '살':        {reading:'sal',              meaning:'years old / age (counter)'},
      '3살':       {reading:'se sal',           meaning:'3 years old'},
      '6살':       {reading:'yeoseot sal',      meaning:'6 years old'},
      '7살':       {reading:'ilgop sal',        meaning:'7 years old'},
      // ── common polite request forms ───────────────────────────────────────
      '들어주세요':  {reading:'deureojuseyo',    meaning:'please listen'},
      '들어':       {reading:'deureo',           meaning:'listen / enter'},
      '들어요':     {reading:'deuleoyo',         meaning:'listens / enters (polite)'},
      '들다':       {reading:'deulda',           meaning:'listen / enter / hold'},
      '보여주세요':  {reading:'boyeojuseyo',     meaning:'please show'},
      '알려주세요':  {reading:'allyeojuseyo',    meaning:'please let me know'},
      '도와주세요':  {reading:'dowajuseyo',      meaning:'please help me'},
      // ── open-ended conversation vocabulary ───────────────────────────────
      // These words appear in free NPC dialogue and must not be sent to the LLM
      // which may hallucinate wrong definitions based on recent conversation context.
      '평화':      {reading:'pyeonghwa',       meaning:'peace'},
      '전쟁':      {reading:'jeonjaeng',       meaning:'war'},
      '소설':      {reading:'soseol',          meaning:'novel / fiction'},
      '동화':      {reading:'donghwa',         meaning:'fairy tale / children\'s story'},
      '그림책':    {reading:'geurimchaek',     meaning:'picture book'},
      '시':        {reading:'si',              meaning:'poem / poetry'},
      '이름':      {reading:'ireum',           meaning:'name'},
      '이름이':    {reading:'ireumi',          meaning:'name (subject)'},
      '이름을':    {reading:'ireumul',         meaning:'name (object)'},
      '이름은':    {reading:'ireumeon',        meaning:'name (topic)'},
      '작가':      {reading:'jakga',           meaning:'author / writer'},
      '작가님':    {reading:'jakganim',        meaning:'author (honorific)'},
      '서점':      {reading:'seojeom',         meaning:'bookstore'},
      '찾다':      {reading:'chatda',          meaning:'find / look for / search'},
      '찾아요':    {reading:'chajayo',         meaning:'find / look for (polite)'},
      '찾고':      {reading:'chatgo',          meaning:'looking for / finding (and…)'},
      '찾고 있어요':{reading:'chatgo isseoyo', meaning:'I am looking for'},
      '읽다':      {reading:'ikda',            meaning:'read'},
      '읽어요':    {reading:'igeoyo',          meaning:'read (polite)'},
      '읽었어요':  {reading:'igeosseoyo',      meaning:'read (past polite)'},
      '빌리다':    {reading:'billida',         meaning:'borrow / lend'},
      '빌려요':    {reading:'billyeoyo',       meaning:'borrow (polite)'},
      '빌릴':      {reading:'billil',          meaning:'borrow (future/adjective form)'},
      '반납하다':  {reading:'bannapada',       meaning:'return (a borrowed item)'},
      '반납해요':  {reading:'bannaphaeyo',     meaning:'return (polite)'},
      '어떤':      {reading:'eotteon',         meaning:'what kind of / which / what sort of'},
      '뭐':        {reading:'mwo',             meaning:'what (informal)'},
      '무슨':      {reading:'museun',          meaning:'what / which (before a noun)'},
      '어느':      {reading:'eoneu',           meaning:'which'},
      '알다':      {reading:'alda',            meaning:'know / understand'},
      '알아요':    {reading:'arayo',           meaning:'I know (polite)'},
      '모르다':    {reading:'moreuda',         meaning:'not know / don\'t know'},
      '몰라요':    {reading:'mollayo',         meaning:'I don\'t know (polite)'},
      '좋아하다':  {reading:'joahada',         meaning:'like / enjoy'},
      '좋아해요':  {reading:'joahaeyo',        meaning:'I like (polite)'},
      '재미있다':  {reading:'jaemiitda',       meaning:'interesting / fun'},
      '재미있어요':{reading:'jaemiisseoyo',    meaning:'interesting / fun (polite)'},
      '재미없다':  {reading:'jaemieoptda',     meaning:'boring / not interesting'},
      '어렵다':    {reading:'eoryeopda',       meaning:'difficult / hard'},
      '어려워요':  {reading:'eoryeowoyo',      meaning:'difficult (polite)'},
      '쉽다':      {reading:'swipda',          meaning:'easy'},
      '쉬워요':    {reading:'swiwoyo',         meaning:'easy (polite)'},
      '가다':      {reading:'gada',            meaning:'go'},
      '가요':      {reading:'gayo',            meaning:'go (polite)'},
      '오다':      {reading:'oda',             meaning:'come'},
      '와요':      {reading:'wayo',            meaning:'come (polite)'},
      '먹다':      {reading:'meokda',          meaning:'eat'},
      '먹어요':    {reading:'meogeoyo',        meaning:'eat (polite)'},
      '마시다':    {reading:'masida',          meaning:'drink'},
      '마셔요':    {reading:'masyeoyo',        meaning:'drink (polite)'},
      '보다':      {reading:'boda',            meaning:'see / look / watch'},
      '봐요':      {reading:'bwayo',           meaning:'see / look (polite)'},
      '듣다':      {reading:'deutda',          meaning:'listen / hear'},
      '들어요':    {reading:'deuleoyo',        meaning:'listen (polite)'},
      '말하다':    {reading:'malhada',         meaning:'say / speak / tell'},
      '말해요':    {reading:'malhaeyo',        meaning:'say / speak (polite)'},
      '쓰다':      {reading:'sseuda',          meaning:'write / use'},
      '써요':      {reading:'sseoyo',          meaning:'write (polite)'},
      '배우다':    {reading:'baeuda',          meaning:'learn / study'},
      '배워요':    {reading:'baeoyo',          meaning:'learn (polite)'},
      '내일':      {reading:'naeil',           meaning:'tomorrow'},
      '어제':      {reading:'eoje',            meaning:'yesterday'},
      '그냥':      {reading:'geunyang',        meaning:'just / simply / as-is'},
      '같아요':    {reading:'gatayo',          meaning:'seems like / looks like / I think'},
      '맞아요':    {reading:'majayo',          meaning:"that's right / correct"},
      '아직':      {reading:'ajik',            meaning:'yet / still / not yet'},
      '벌써':      {reading:'beolsseo',        meaning:'already'},
      '다시':      {reading:'dasi',            meaning:'again'},
      '같이':      {reading:'gachi',           meaning:'together / like / same as'},
      // ── pronouns & demonstratives ────────────────────────────────────────
      '나':        {reading:'na',             meaning:'I / me (informal)'},
      '저':        {reading:'jeo',            meaning:'I / me (formal)'},
      '우리':      {reading:'uri',            meaning:'we / our'},
      '너':        {reading:'neo',            meaning:'you (informal)'},
      '이것':      {reading:'igeot',          meaning:'this'},
      '그것':      {reading:'geugeot',        meaning:'that'},
      '저것':      {reading:'jeogeot',        meaning:'that (over there)'},
      '저기':      {reading:'jeogi',          meaning:'over there'},
      '이쪽':      {reading:'ijjok',          meaning:'this way / this side'},
      '그쪽':      {reading:'geujjok',        meaning:'that way / that side'},
      // ── directions & position ────────────────────────────────────────────
      '앞':        {reading:'ap',             meaning:'front / ahead'},
      '뒤':        {reading:'dwi',            meaning:'back / behind'},
      '위':        {reading:'wi',             meaning:'above / up / on top'},
      '아래':      {reading:'arae',           meaning:'below / down / under'},
      '왼쪽':      {reading:'oenjjok',        meaning:'left'},
      '오른쪽':    {reading:'oreunjjok',      meaning:'right'},
      '밖':        {reading:'bak',            meaning:'outside'},
      '옆':        {reading:'yeop',           meaning:'beside / next to'},
      // ── people ───────────────────────────────────────────────────────────
      '사람':      {reading:'saram',          meaning:'person'},
      '친구':      {reading:'chingu',         meaning:'friend'},
      '가족':      {reading:'gajok',          meaning:'family'},
      '엄마':      {reading:'eomma',          meaning:'mom / mother'},
      '아빠':      {reading:'appa',           meaning:'dad / father'},
      '선생님':    {reading:'seonsaengnim',   meaning:'teacher'},
      '학생':      {reading:'haksaeng',       meaning:'student'},
      // ── places ───────────────────────────────────────────────────────────
      '학교':      {reading:'hakgyo',         meaning:'school'},
      '집':        {reading:'jip',            meaning:'house / home'},
      '방':        {reading:'bang',           meaning:'room'},
      '화장실':    {reading:'hwajangsil',     meaning:'restroom / bathroom'},
      '공원':      {reading:'gongwon',        meaning:'park'},
      // ── time ─────────────────────────────────────────────────────────────
      '아침':      {reading:'achim',          meaning:'morning'},
      '점심':      {reading:'jeomsim',        meaning:'lunch / noon'},
      '저녁':      {reading:'jeonyeok',       meaning:'evening / dinner'},
      '밤':        {reading:'bam',            meaning:'night'},
      '매일':      {reading:'maeil',          meaning:'every day'},
      '항상':      {reading:'hangsang',       meaning:'always'},
      '가끔':      {reading:'gakkeum',        meaning:'sometimes'},
      '나중에':    {reading:'najunge',        meaning:'later'},
      // ── adjectives / states ──────────────────────────────────────────────
      '커요':      {reading:'keoyo',          meaning:'big / large'},
      '작아요':    {reading:'jagayo',         meaning:'small'},
      '나빠요':    {reading:'nappayo',        meaning:'bad'},
      '예뻐요':    {reading:'yeppeoyo',       meaning:'pretty / beautiful'},
      '귀여워요':  {reading:'gwiyeowoyo',     meaning:'cute'},
      '따뜻해요':  {reading:'ttatteuthaeyo',  meaning:'warm'},
      '차가워요':  {reading:'chagawoyo',      meaning:'cold'},
      '배고파요':  {reading:'baegopayo',      meaning:'hungry'},
      '피곤해요':  {reading:'pigonhaeyo',     meaning:'tired'},
      '바빠요':    {reading:'bappayo',        meaning:'busy'},
      // ── emotions ─────────────────────────────────────────────────────────
      '기분':      {reading:'gibun',          meaning:'feeling / mood'},
      '행복해요':  {reading:'haengbokhaeyo',  meaning:'happy'},
      '슬퍼요':    {reading:'seulpeoyo',      meaning:'sad'},
      '무서워요':  {reading:'museowoyo',      meaning:'scared'},
      '신나요':    {reading:'sinnayo',        meaning:'excited'},
      // ── connectors ───────────────────────────────────────────────────────
      '그리고':    {reading:'geurigo',        meaning:'and / and then'},
      '하지만':    {reading:'hajiman',        meaning:'but / however'},
      '그래서':    {reading:'geuraeseo',      meaning:'so / therefore'},
      '아니면':    {reading:'animyeon',       meaning:'or / otherwise'},
      '그럼':      {reading:'geureom',        meaning:'then / well then'},
      '그런데':    {reading:'geureonde',      meaning:'but / by the way'},
      // ── adverbs ──────────────────────────────────────────────────────────
      '너무':      {reading:'neomu',          meaning:'too / very'},
      '아주':      {reading:'aju',            meaning:'very / quite'},
      '더':        {reading:'deo',            meaning:'more'},
      '덜':        {reading:'deol',           meaning:'less'},
      '모두':      {reading:'modu',           meaning:'all / everyone'},
      '혼자':      {reading:'honja',          meaning:'alone'},
      '또':        {reading:'tto',            meaning:'also / again'},
      // ── food & drink ─────────────────────────────────────────────────────
      '밥':        {reading:'bap',            meaning:'rice / meal'},
      '차':        {reading:'cha',            meaning:'tea'},
      '과일':      {reading:'gwail',          meaning:'fruit'},
      '채소':      {reading:'chaeso',         meaning:'vegetable'},
      '간식':      {reading:'gansik',         meaning:'snack'},
      // ── native Korean numbers 1–10 ───────────────────────────────────────
      '하나':      {reading:'hana',           meaning:'one'},
      '둘':        {reading:'dul',            meaning:'two'},
      '셋':        {reading:'set',            meaning:'three'},
      '넷':        {reading:'net',            meaning:'four'},
      '다섯':      {reading:'daseot',         meaning:'five'},
      '여섯':      {reading:'yeoseot',        meaning:'six'},
      '일곱':      {reading:'ilgop',          meaning:'seven'},
      '여덟':      {reading:'yeodeol',        meaning:'eight'},
      '아홉':      {reading:'ahop',           meaning:'nine'},
      '열':        {reading:'yeol',           meaning:'ten'},
      // ── everyday verbs (polite form) ─────────────────────────────────────
      '앉아요':    {reading:'anjayo',         meaning:'sit'},
      '서요':      {reading:'seoyo',          meaning:'stand'},
      '자요':      {reading:'jayo',           meaning:'sleep'},
      '일어나요':  {reading:'ireonayo',       meaning:'wake up / get up'},
      '만들어요':  {reading:'mandeuleoyo',    meaning:'make / create'},
      '줘요':      {reading:'jwoyo',          meaning:'give'},
      '받아요':    {reading:'badayo',         meaning:'receive / get'},
      '열어요':    {reading:'yeoreoyo',       meaning:'open'},
      '닫아요':    {reading:'datayo',         meaning:'close'},
      '나가요':    {reading:'nagayo',         meaning:'go out / exit'},
      '들어가요':  {reading:'deureogayo',     meaning:'go in / enter'},
      '기다려요':  {reading:'gidaryeoyo',     meaning:'wait'},
      '시작해요':  {reading:'sijakhaeyo',     meaning:'start / begin'},
      '끝나요':    {reading:'kkeutnayo',      meaning:'end / finish'},
      '도와요':    {reading:'dowayo',         meaning:'help'},
      '축하해요':  {reading:'chukhahaeyo',    meaning:'congratulate'},
      '힘내요':    {reading:'himnaeyo',       meaning:'cheer up / hang in there'},
      '웃어요':    {reading:'useoyo',         meaning:'laugh / smile'},
      '울어요':    {reading:'ureoyo',         meaning:'cry'},
      // ── days of the week ───────────────────────────────────────────────────
      '월요일':    {reading:'woryoil',        meaning:'Monday'},
      '화요일':    {reading:'hwayoil',        meaning:'Tuesday'},
      '수요일':    {reading:'suyoil',         meaning:'Wednesday'},
      '목요일':    {reading:'mogyoil',        meaning:'Thursday'},
      '금요일':    {reading:'geumyoil',       meaning:'Friday'},
      '토요일':    {reading:'toyoil',         meaning:'Saturday'},
      '일요일':    {reading:'iryoil',         meaning:'Sunday'},
      '요일':      {reading:'yoil',           meaning:'day of the week'},
      // ── seasons ────────────────────────────────────────────────────────────
      '봄':        {reading:'bom',            meaning:'spring'},
      '여름':      {reading:'yeoreum',        meaning:'summer'},
      '가을':      {reading:'gaeul',          meaning:'autumn / fall'},
      '겨울':      {reading:'gyeoul',         meaning:'winter'},
      // ── time ───────────────────────────────────────────────────────────────
      '시간':      {reading:'sigan',          meaning:'time / hour'},
      '분':        {reading:'bun',            meaning:'minute'},
      '초':        {reading:'cho',            meaning:'second'},
      '주':        {reading:'ju',             meaning:'week'},
      '년':        {reading:'nyeon',          meaning:'year'},
      '이번':      {reading:'ibeon',          meaning:'this time / this'},
      '다음':      {reading:'daeum',          meaning:'next'},
      '지난':      {reading:'jinan',          meaning:'last / past'},
      '때':        {reading:'ttae',           meaning:'time / when / moment'},
      '동안':      {reading:'dongan',         meaning:'during / for (a period)'},
      '후':        {reading:'hu',             meaning:'after'},
      '전':        {reading:'jeon',           meaning:'before / ago'},
      '처음':      {reading:'cheoeum',        meaning:'first / for the first time'},
      '마지막':    {reading:'majimak',        meaning:'last / final'},
      '끝':        {reading:'kkeut',          meaning:'end'},
      '시작':      {reading:'sijak',          meaning:'beginning / start'},
      '다음에':    {reading:'daume',          meaning:'next time / later'},
      // ── colors ─────────────────────────────────────────────────────────────
      '빨간':      {reading:'palgan',         meaning:'red'},
      '파란':      {reading:'paran',          meaning:'blue'},
      '노란':      {reading:'noran',          meaning:'yellow'},
      '초록':      {reading:'chorok',         meaning:'green'},
      '흰':        {reading:'hwin',           meaning:'white'},
      '검은':      {reading:'geomeon',        meaning:'black'},
      '주황':      {reading:'juhwang',        meaning:'orange'},
      '보라':      {reading:'bora',           meaning:'purple'},
      '분홍':      {reading:'bunhong',        meaning:'pink'},
      '갈색':      {reading:'galsaek',        meaning:'brown'},
      '회색':      {reading:'hoesaek',        meaning:'gray'},
      '빨개요':    {reading:'palgaeyo',       meaning:'is red'},
      '파래요':    {reading:'paraeyo',        meaning:'is blue'},
      '노래요':    {reading:'noraeyo',        meaning:'is yellow'},
      '초록색':    {reading:'choroksaek',     meaning:'green (color)'},
      // ── body parts ─────────────────────────────────────────────────────────
      '머리':      {reading:'meori',          meaning:'head / hair'},
      '눈':        {reading:'nun',            meaning:'eye / snow'},
      '코':        {reading:'ko',             meaning:'nose'},
      '입':        {reading:'ip',             meaning:'mouth'},
      '귀':        {reading:'gwi',            meaning:'ear'},
      '손':        {reading:'son',            meaning:'hand'},
      '발':        {reading:'bal',            meaning:'foot'},
      '팔':        {reading:'pal',            meaning:'arm'},
      '다리':      {reading:'dari',           meaning:'leg'},
      '배':        {reading:'bae',            meaning:'belly / stomach / boat'},
      '등':        {reading:'deung',          meaning:'back'},
      '얼굴':      {reading:'eolgul',         meaning:'face'},
      '목':        {reading:'mok',            meaning:'neck / throat'},
      '이빨':      {reading:'ippal',           meaning:'tooth / teeth'},
      // ── clothing ───────────────────────────────────────────────────────────
      '옷':        {reading:'ot',             meaning:'clothes / clothing'},
      '바지':      {reading:'baji',           meaning:'pants / trousers'},
      '셔츠':      {reading:'syeocheu',       meaning:'shirt'},
      '모자':      {reading:'moja',           meaning:'hat / cap'},
      '가방':      {reading:'gabang',         meaning:'bag'},
      '양말':      {reading:'yangmal',        meaning:'socks'},
      '치마':      {reading:'chima',          meaning:'skirt'},
      '코트':      {reading:'koteu',          meaning:'coat'},
      '장갑':      {reading:'janggap',        meaning:'gloves'},
      '스카프':    {reading:'seukApeu',       meaning:'scarf'},
      // ── animals ────────────────────────────────────────────────────────────
      '개':        {reading:'gae',            meaning:'dog'},
      '고양이':    {reading:'goyangi',        meaning:'cat'},
      '새':        {reading:'sae',            meaning:'bird'},
      '물고기':    {reading:'mulgogi',        meaning:'fish'},
      '토끼':      {reading:'tokki',          meaning:'rabbit'},
      '곰':        {reading:'gom',            meaning:'bear'},
      '사자':      {reading:'saja',           meaning:'lion'},
      '호랑이':    {reading:'horangi',        meaning:'tiger'},
      '코끼리':    {reading:'kokkiri',        meaning:'elephant'},
      '원숭이':    {reading:'wonsungi',       meaning:'monkey'},
      '돼지':      {reading:'dwaeji',         meaning:'pig'},
      '말':        {reading:'mal',            meaning:'horse / word / speech'},
      '마리':      {reading:'mari',           meaning:'animal (counter)'},
      // ── toys & gallery ─────────────────────────────────────────────────────
      '장난감':    {reading:'jangnangam',     meaning:'toy'},
      '인형':      {reading:'inhyeong',       meaning:'doll / figure'},
      '기차':      {reading:'gicha',          meaning:'train'},
      '자동차':    {reading:'jadongcha',      meaning:'car / automobile'},
      '블록':      {reading:'beullok',        meaning:'blocks (building toy)'},
      '퍼즐':      {reading:'peojeu',         meaning:'puzzle'},
      '로봇':      {reading:'robot',          meaning:'robot'},
      '공':        {reading:'gong',           meaning:'ball'},
      '팽이':      {reading:'paengi',         meaning:'spinning top'},
      '연':        {reading:'yeon',           meaning:'kite'},
      '수집':      {reading:'sujip',          meaning:'collection / collecting'},
      '진열':      {reading:'jinyeol',        meaning:'display / arrangement'},
      '전통':      {reading:'jeontong',       meaning:'tradition / traditional'},
      '오래된':    {reading:'oraedoen',       meaning:'old / vintage / antique'},
      '소중한':    {reading:'sojunghan',      meaning:'precious / valuable'},
      '만지다':    {reading:'manjida',        meaning:'touch / handle'},
      '만져요':    {reading:'manjyeoyo',      meaning:'touch (polite)'},
      '구경하다':  {reading:'gugyeonghada',   meaning:'look around / browse'},
      '구경해요':  {reading:'gugyeonghaeyo',  meaning:'look around (polite)'},
      '보물':      {reading:'bomul',          meaning:'treasure'},
      '역사':      {reading:'yeoksa',         meaning:'history'},
      '문화':      {reading:'munhwa',         meaning:'culture'},
      '예술':      {reading:'yesul',          meaning:'art'},
      // ── cooking room ───────────────────────────────────────────────────────
      '요리하다':  {reading:'yorihada',       meaning:'cook / prepare food'},
      '요리해요':  {reading:'yorihaeyo',      meaning:'cook (polite)'},
      '재료':      {reading:'jaeryo',         meaning:'ingredient / material'},
      '냄비':      {reading:'naembi',         meaning:'pot / saucepan'},
      '칼':        {reading:'kal',            meaning:'knife'},
      '접시':      {reading:'jeopsi',         meaning:'plate / dish'},
      '숟가락':    {reading:'sutgarak',       meaning:'spoon'},
      '젓가락':    {reading:'jeotgarak',      meaning:'chopsticks'},
      '포크':      {reading:'pokeu',          meaning:'fork'},
      '컵':        {reading:'keop',           meaning:'cup'},
      '그릇':      {reading:'geureut',        meaning:'bowl / vessel'},
      '맛있다':    {reading:'masitda',        meaning:'delicious / tasty'},
      '맛있어요':  {reading:'massisseoyo',    meaning:'delicious (polite)'},
      '맛없어요':  {reading:'maseopsseoyo',   meaning:'tasteless / not tasty'},
      '달다':      {reading:'dalda',          meaning:'sweet'},
      '달아요':    {reading:'darayo',         meaning:'sweet (polite)'},
      '짜다':      {reading:'jjada',          meaning:'salty'},
      '짜요':      {reading:'jjayo',          meaning:'salty (polite)'},
      '맵다':      {reading:'maepda',         meaning:'spicy / hot'},
      '매워요':    {reading:'maewoyo',        meaning:'spicy (polite)'},
      '시다':      {reading:'sida',           meaning:'sour'},
      '씻다':      {reading:'ssitda',         meaning:'wash'},
      '씻어요':    {reading:'ssiseoyo',       meaning:'wash (polite)'},
      '썰다':      {reading:'sseolda',        meaning:'cut / slice'},
      '볶다':      {reading:'bokda',          meaning:'stir-fry'},
      '끓이다':    {reading:'kkeurida',       meaning:'boil'},
      '굽다':      {reading:'gupda',          meaning:'grill / bake'},
      '맛':        {reading:'mat',            meaning:'taste / flavor'},
      '냄새':      {reading:'naemsae',        meaning:'smell / odor'},
      '레시피':    {reading:'resipi',         meaning:'recipe'},
      // ── shopping & money ───────────────────────────────────────────────────
      '돈':        {reading:'don',            meaning:'money'},
      '가격':      {reading:'gagyeok',        meaning:'price'},
      '비싸요':    {reading:'bissayo',        meaning:'expensive'},
      '싸요':      {reading:'ssayo',          meaning:'cheap / inexpensive'},
      '사다':      {reading:'sada',           meaning:'buy'},
      '사요':      {reading:'sayo',           meaning:'buy (polite)'},
      '팔다':      {reading:'palda',          meaning:'sell'},
      '팔아요':    {reading:'parayo',         meaning:'sell (polite)'},
      '영수증':    {reading:'yeongsujeung',   meaning:'receipt'},
      '거스름돈':  {reading:'geoseureudon',   meaning:'change (money)'},
      '할인':      {reading:'harin',          meaning:'discount'},
      '무료':      {reading:'muryo',          meaning:'free / no charge'},
      '유료':      {reading:'yuryo',          meaning:'paid / for a fee'},
      // ── transportation ─────────────────────────────────────────────────────
      '버스':      {reading:'beoseu',         meaning:'bus'},
      '지하철':    {reading:'jihacheol',      meaning:'subway / metro'},
      '택시':      {reading:'taeksi',         meaning:'taxi'},
      '비행기':    {reading:'bihaenggi',      meaning:'airplane'},
      '자전거':    {reading:'jajeongeo',      meaning:'bicycle'},
      '걷다':      {reading:'geotda',         meaning:'walk'},
      '걸어요':    {reading:'georeoyo',       meaning:'walk (polite)'},
      '타다':      {reading:'tada',           meaning:'ride / board / get on'},
      '타요':      {reading:'tayo',           meaning:'ride (polite)'},
      // ── more places ────────────────────────────────────────────────────────
      '병원':      {reading:'byeongwon',      meaning:'hospital / clinic'},
      '약국':      {reading:'yakguk',         meaning:'pharmacy'},
      '식당':      {reading:'sikdang',        meaning:'restaurant'},
      '가게':      {reading:'gage',           meaning:'store / shop'},
      '마트':      {reading:'mateu',          meaning:'supermarket / mart'},
      '시장':      {reading:'sijang',         meaning:'market'},
      '역':        {reading:'yeok',           meaning:'station'},
      '공항':      {reading:'gonghang',       meaning:'airport'},
      '호텔':      {reading:'hotel',          meaning:'hotel'},
      '카페':      {reading:'kape',           meaning:'cafe / coffee shop'},
      '박물관':    {reading:'bangmulgwan',    meaning:'museum'},
      '미술관':    {reading:'misulgwan',      meaning:'art museum / gallery'},
      '동물원':    {reading:'dongmurwon',     meaning:'zoo'},
      // ── nature ─────────────────────────────────────────────────────────────
      '하늘':      {reading:'haneul',         meaning:'sky'},
      '바다':      {reading:'bada',           meaning:'sea / ocean'},
      '산':        {reading:'san',            meaning:'mountain'},
      '강':        {reading:'gang',           meaning:'river'},
      '꽃':        {reading:'kkot',           meaning:'flower'},
      '나무':      {reading:'namu',           meaning:'tree'},
      '별':        {reading:'byeol',          meaning:'star'},
      '달':        {reading:'dal',            meaning:'moon'},
      '해':        {reading:'hae',            meaning:'sun / year'},
      '비':        {reading:'bi',             meaning:'rain'},
      '바람':      {reading:'param',          meaning:'wind'},
      '구름':      {reading:'gureum',         meaning:'cloud'},
      '땅':        {reading:'ttang',          meaning:'ground / earth / land'},
      '숲':        {reading:'sup',            meaning:'forest / woods'},
      '돌':        {reading:'dol',            meaning:'stone / rock'},
      // ── house & furniture ──────────────────────────────────────────────────
      '의자':      {reading:'uija',           meaning:'chair'},
      '테이블':    {reading:'teibeu',         meaning:'table'},
      '침대':      {reading:'chimdae',        meaning:'bed'},
      '문':        {reading:'mun',            meaning:'door'},
      '창문':      {reading:'changmun',       meaning:'window'},
      '부엌':      {reading:'bueok',          meaning:'kitchen'},
      '소파':      {reading:'sopa',           meaning:'sofa / couch'},
      '거울':      {reading:'geoul',          meaning:'mirror'},
      '시계':      {reading:'sigye',          meaning:'clock / watch'},
      '냉장고':    {reading:'naengjanggo',    meaning:'refrigerator'},
      '전등':      {reading:'jeondeung',      meaning:'light / lamp'},
      '복도':      {reading:'bokdo',          meaning:'corridor / hallway'},
      // ── more verbs ─────────────────────────────────────────────────────────
      '원하다':    {reading:'wonhada',        meaning:'want'},
      '원해요':    {reading:'wonhaeyo',       meaning:'want (polite)'},
      '생각하다':  {reading:'saenggakhada',   meaning:'think'},
      '생각해요':  {reading:'saenggakhaeyo',  meaning:'think (polite)'},
      '느끼다':    {reading:'neukkida',       meaning:'feel'},
      '느껴요':    {reading:'neukkyeoyo',     meaning:'feel (polite)'},
      '사랑하다':  {reading:'saranghada',     meaning:'love'},
      '사랑해요':  {reading:'saranghaeyo',    meaning:'love (polite)'},
      '싫어하다':  {reading:'sirheohada',     meaning:'dislike / hate'},
      '싫어해요':  {reading:'sirheohaeoyo',   meaning:'dislike (polite)'},
      '달리다':    {reading:'dallida',        meaning:'run'},
      '달려요':    {reading:'dallyeoyo',      meaning:'run (polite)'},
      '뛰다':      {reading:'ttwida',         meaning:'run / jump'},
      '뛰어요':    {reading:'ttwioyo',        meaning:'run / jump (polite)'},
      '공부하다':  {reading:'gongbuhada',     meaning:'study'},
      '공부해요':  {reading:'gongbuhaeyo',    meaning:'study (polite)'},
      '물어보다':  {reading:'mureoboda',      meaning:'ask'},
      '물어봐요':  {reading:'mureobwayo',     meaning:'ask (polite)'},
      '대답하다':  {reading:'daedaphada',     meaning:'answer / reply'},
      '대답해요':  {reading:'daedaphaeyo',    meaning:'answer (polite)'},
      '가르치다':  {reading:'gareuchida',     meaning:'teach'},
      '가르쳐요':  {reading:'gareuchyeoyo',   meaning:'teach (polite)'},
      '기억하다':  {reading:'gieokada',       meaning:'remember'},
      '기억해요':  {reading:'gieokhaeyo',     meaning:'remember (polite)'},
      '잊다':      {reading:'itda',           meaning:'forget'},
      '잊어요':    {reading:'ijeoyo',         meaning:'forget (polite)'},
      '부르다':    {reading:'bureuda',        meaning:'call / sing'},
      '불러요':    {reading:'bulleoyo',       meaning:'call / sing (polite)'},
      '보내다':    {reading:'bonaeda',        meaning:'send'},
      '보내요':    {reading:'bonaeoyo',       meaning:'send (polite)'},
      '준비하다':  {reading:'junbihada',      meaning:'prepare'},
      '준비해요':  {reading:'junbihaeyo',     meaning:'prepare (polite)'},
      '걱정하다':  {reading:'geokjeonghada',  meaning:'worry'},
      '걱정해요':  {reading:'geokjeonghaeyo', meaning:'worry (polite)'},
      '고르다':    {reading:'goreuda',        meaning:'choose / select'},
      '골라요':    {reading:'gollayo',        meaning:'choose (polite)'},
      '설명하다':  {reading:'seolmyeonghada', meaning:'explain'},
      '설명해요':  {reading:'seolmyeonghaeyo',meaning:'explain (polite)'},
      '소개하다':  {reading:'sogaehada',      meaning:'introduce'},
      '소개해요':  {reading:'sogaehaeyo',     meaning:'introduce (polite)'},
      '확인하다':  {reading:'hwakinada',      meaning:'confirm / check'},
      '확인해요':  {reading:'hwakinhaeyo',    meaning:'confirm (polite)'},
      '청소하다':  {reading:'cheongsohada',   meaning:'clean'},
      '청소해요':  {reading:'cheongsohaeyo',  meaning:'clean (polite)'},
      '만나다':    {reading:'mannada',        meaning:'meet'},
      '만나요':    {reading:'mannayo',        meaning:'meet (polite)'},
      // ── verb & adjective roots (dictionary forms) ──────────────────────────
      '크다':      {reading:'keuda',          meaning:'big / large'},
      '작다':      {reading:'jakda',          meaning:'small'},
      '좋다':      {reading:'jota',           meaning:'good'},
      '나쁘다':    {reading:'nappuda',        meaning:'bad'},
      '예쁘다':    {reading:'yeppuda',        meaning:'pretty'},
      '귀엽다':    {reading:'gwiyeopda',      meaning:'cute'},
      '따뜻하다':  {reading:'ttatteuthada',   meaning:'warm'},
      '차갑다':    {reading:'chagapda',       meaning:'cold (to touch)'},
      '배고프다':  {reading:'baegopuda',      meaning:'hungry'},
      '피곤하다':  {reading:'pigonhada',      meaning:'tired'},
      '바쁘다':    {reading:'bappuda',        meaning:'busy'},
      '행복하다':  {reading:'haengbokhada',   meaning:'happy'},
      '슬프다':    {reading:'seulpeuda',      meaning:'sad'},
      '무섭다':    {reading:'museopda',       meaning:'scary / frightening'},
      '앉다':      {reading:'anda',           meaning:'sit'},
      '서다':      {reading:'seoda',          meaning:'stand'},
      '자다':      {reading:'jada',           meaning:'sleep'},
      '일어나다':  {reading:'ireonada',       meaning:'wake up / get up'},
      '만들다':    {reading:'mandeulda',      meaning:'make'},
      '주다':      {reading:'juda',           meaning:'give'},
      '열다':      {reading:'yeolda',         meaning:'open'},
      '닫다':      {reading:'datda',          meaning:'close'},
      '나가다':    {reading:'nagada',         meaning:'go out / leave'},
      '들어가다':  {reading:'deureogada',     meaning:'enter / go in'},
      '기다리다':  {reading:'gidarida',       meaning:'wait'},
      '시작하다':  {reading:'sijakhada',      meaning:'start / begin'},
      // ── more adjectives (polite forms) ─────────────────────────────────────
      '새로워요':  {reading:'saeroweoyo',     meaning:'new / fresh'},
      '특별해요':  {reading:'teukbyeolhaeyo', meaning:'special'},
      '신기해요':  {reading:'singihaeyo',     meaning:'amazing / fascinating'},
      '멋있어요':  {reading:'meositsseoyo',   meaning:'cool / stylish / awesome'},
      '아파요':    {reading:'apayo',          meaning:'hurt / painful / sick'},
      '건강해요':  {reading:'geonganghaeyo',  meaning:'healthy'},
      '조용해요':  {reading:'joyonghaeyo',    meaning:'quiet'},
      '시끄러워요':{reading:'sikkeureowoyo',  meaning:'noisy / loud'},
      '빨라요':    {reading:'ppallayo',       meaning:'fast / quick'},
      '느려요':    {reading:'neuryeoyo',      meaning:'slow'},
      '높아요':    {reading:'nopayo',         meaning:'high / tall'},
      '낮아요':    {reading:'najayo',         meaning:'low'},
      '길어요':    {reading:'gireoyo',        meaning:'long'},
      '짧아요':    {reading:'jjarbayo',       meaning:'short'},
      '무거워요':  {reading:'mugeowoyo',      meaning:'heavy'},
      '가벼워요':  {reading:'gabyeowoyo',     meaning:'light (in weight)'},
      '밝아요':    {reading:'balgayo',        meaning:'bright'},
      '어두워요':  {reading:'eoduwoyo',       meaning:'dark'},
      '맑아요':    {reading:'malgayo',        meaning:'clear / sunny'},
      '깨끗해요':  {reading:'kkaekkuthaeyo',  meaning:'clean'},
      '더러워요':  {reading:'deoreowoyo',     meaning:'dirty'},
      '넓어요':    {reading:'neolbeoyo',      meaning:'wide / spacious'},
      '좁아요':    {reading:'jobayo',         meaning:'narrow / cramped'},
      '많아요':    {reading:'manayo',         meaning:'many / a lot'},
      '적어요':    {reading:'jeogeoyo',       meaning:'few / not many'},
      '복잡해요':  {reading:'bokjaphaeyo',    meaning:'complicated / crowded'},
      '간단해요':  {reading:'gandanhaeyo',    meaning:'simple'},
      '중요해요':  {reading:'jungyohaeyo',    meaning:'important'},
      '충분해요':  {reading:'chungbunhaeyo',  meaning:'enough / sufficient'},
      // ── school & learning ──────────────────────────────────────────────────
      '공부':      {reading:'gongbu',         meaning:'study / studying'},
      '숙제':      {reading:'sukje',          meaning:'homework'},
      '시험':      {reading:'siheom',         meaning:'test / exam'},
      '교실':      {reading:'gyosil',         meaning:'classroom'},
      '연필':      {reading:'yeonpil',        meaning:'pencil'},
      '지우개':    {reading:'jiugae',         meaning:'eraser'},
      '종이':      {reading:'jongi',          meaning:'paper'},
      '색연필':    {reading:'saegyeonpil',    meaning:'colored pencil / crayon'},
      '가위':      {reading:'gawi',           meaning:'scissors'},
      '단어':      {reading:'daneo',          meaning:'word / vocabulary'},
      '문장':      {reading:'munjang',        meaning:'sentence'},
      '숫자':      {reading:'sutja',          meaning:'number / digit'},
      '글자':      {reading:'geulja',         meaning:'letter / character'},
      // ── family & people ────────────────────────────────────────────────────
      '할머니':    {reading:'halmeoni',       meaning:'grandmother'},
      '할아버지':  {reading:'harabeoji',      meaning:'grandfather'},
      '오빠':      {reading:'oppa',           meaning:"older brother (female speaker's)"},
      '언니':      {reading:'eonni',          meaning:"older sister (female speaker's)"},
      '형':        {reading:'hyeong',         meaning:"older brother (male speaker's)"},
      '누나':      {reading:'nuna',           meaning:"older sister (male speaker's)"},
      '동생':      {reading:'dongsaeng',      meaning:'younger sibling'},
      '아기':      {reading:'agi',            meaning:'baby'},
      '아저씨':    {reading:'ajeossi',        meaning:'middle-aged man / sir'},
      '아줌마':    {reading:'ajumma',         meaning:"middle-aged woman / ma'am"},
      // ── social & events ────────────────────────────────────────────────────
      '파티':      {reading:'pati',           meaning:'party'},
      '선물':      {reading:'seonmul',        meaning:'gift / present'},
      '초대':      {reading:'chodae',         meaning:'invitation / invite'},
      '약속':      {reading:'yaksok',         meaning:'promise / appointment'},
      '행사':      {reading:'haengsa',        meaning:'event'},
      '축제':      {reading:'chukje',         meaning:'festival'},
      '대회':      {reading:'daehoe',         meaning:'competition / contest'},
      '팀':        {reading:'tim',            meaning:'team'},
      // ── weather ────────────────────────────────────────────────────────────
      '흐려요':    {reading:'heuryeoyo',      meaning:'cloudy'},
      '덥다':      {reading:'deoptda',        meaning:'hot (weather)'},
      '더워요':    {reading:'deowoyo',        meaning:'hot (polite)'},
      '춥다':      {reading:'chupda',         meaning:'cold (weather)'},
      '추워요':    {reading:'chuwoyo',        meaning:'cold (polite)'},
      '습해요':    {reading:'seupaeyo',       meaning:'humid'},
      // ── expressions & phrases ──────────────────────────────────────────────
      '물론':      {reading:'mulleon',        meaning:'of course'},
      '사실':      {reading:'sasil',          meaning:'actually / in fact / truth'},
      '혹시':      {reading:'hoksi',          meaning:'by any chance / perhaps'},
      '드디어':    {reading:'deudio',         meaning:'finally / at last'},
      '역시':      {reading:'yeoksi',         meaning:'as expected / indeed / also'},
      '게다가':    {reading:'gedaga',         meaning:'moreover / on top of that'},
      '그러나':    {reading:'geureona',       meaning:'however / but'},
      '따라서':    {reading:'ttaraseo',       meaning:'therefore / accordingly'},
      '그러면':    {reading:'geureomyeon',    meaning:'in that case / if so'},
      '왜냐하면':  {reading:'waenyahamyeon',  meaning:'because / the reason is'},
      '갑자기':    {reading:'gapjagi',        meaning:'suddenly'},
      '바로':      {reading:'baro',           meaning:'right away / directly'},
      '특히':      {reading:'teuki',          meaning:'especially / particularly'},
      '계속':      {reading:'gyesok',         meaning:'continue / continuously'},
      // ── particles (for lookup) ─────────────────────────────────────────────
      '에서':      {reading:'eseo',           meaning:'at / in / from (place marker)'},
      '에게':      {reading:'ege',            meaning:'to / for (person marker)'},
      '한테':      {reading:'hante',          meaning:'to / from (informal person marker)'},
      '께':        {reading:'kke',            meaning:'to (honorific person marker)'},
      '처럼':      {reading:'cheoreom',       meaning:'like / as / similar to'},
      '만큼':      {reading:'mankeum',        meaning:'as much as / to the extent of'},
      '마다':      {reading:'mada',           meaning:'every / each'},
      '으로':      {reading:'euro',           meaning:'to / toward / by means of'},
      '부터':      {reading:'buteo',          meaning:'from / since'},
      '까지':      {reading:'kkaji',          meaning:'until / up to / as far as'},
      '라고':      {reading:'rago',           meaning:'called / named (quotation)'},
      '보다':      {reading:'boda',           meaning:'than / compared to / see / watch'},
      // ── sport & play ───────────────────────────────────────────────────────
      '운동':      {reading:'undong',         meaning:'exercise / sport'},
      '운동하다':  {reading:'undonghada',     meaning:'exercise'},
      '수영':      {reading:'suyeong',        meaning:'swimming'},
      '축구':      {reading:'chukgu',         meaning:'soccer / football'},
      '야구':      {reading:'yagu',           meaning:'baseball'},
      '농구':      {reading:'nonggu',         meaning:'basketball'},
      '달리기':    {reading:'dalligi',        meaning:'running'},
      '그네':      {reading:'geune',          meaning:'swing (playground)'},
      '미끄럼틀':  {reading:'mikkeureomt',    meaning:'slide (playground)'},
      // ── music & media ──────────────────────────────────────────────────────
      '음악':      {reading:'eumak',          meaning:'music'},
      '노래':      {reading:'norae',          meaning:'song'},
      '노래하다':  {reading:'noraehada',      meaning:'sing'},
      '영화':      {reading:'yeonghwa',       meaning:'movie / film'},
      '그림':      {reading:'geurim',         meaning:'picture / drawing / painting'},
      '그리다':    {reading:'geurida',        meaning:'draw / paint'},
      '만화':      {reading:'manhwa',         meaning:'comics / manhwa'},
      '게임':      {reading:'geim',           meaning:'game'},
      // ── health & safety ────────────────────────────────────────────────────
      '건강':      {reading:'geongang',       meaning:'health'},
      '약':        {reading:'yak',            meaning:'medicine / drug'},
      '의사':      {reading:'uisa',           meaning:'doctor'},
      '간호사':    {reading:'ganhosa',        meaning:'nurse'},
      '조심하다':  {reading:'josimhada',      meaning:'be careful / watch out'},
      '조심해요':  {reading:'josimhaeyo',     meaning:'be careful (polite)'},
      '위험':      {reading:'wiheom',         meaning:'danger / dangerous'},
      '안전':      {reading:'anjeon',         meaning:'safety / safe'},
      // ── building & navigation ──────────────────────────────────────────────
      '입구':      {reading:'ipgu',           meaning:'entrance'},
      '출구':      {reading:'chulgu',         meaning:'exit'},
      '비상구':    {reading:'bisanggu',       meaning:'emergency exit'},
      '엘리베이터':{reading:'ellibeiteo',     meaning:'elevator / lift'},
      '안내':      {reading:'annae',          meaning:'guide / information / directions'},
      '직원':      {reading:'jigwon',         meaning:'staff / employee'},
      '문제':      {reading:'munje',          meaning:'problem / question'},
      '정보':      {reading:'jeongbo',        meaning:'information'},
      '게시판':    {reading:'gesipan',        meaning:'bulletin board / notice board'},
      '표지판':    {reading:'pyojipan',       meaning:'sign / signboard'},
      // ── counter words ──────────────────────────────────────────────────────
      '명':        {reading:'myeong',         meaning:'person (counter)'},
      '권':        {reading:'gwon',           meaning:'volume / book (counter)'},
      '장':        {reading:'jang',           meaning:'sheet / page (counter)'},
      '번':        {reading:'beon',           meaning:'time / number / turn'},
      '번째':      {reading:'beonjjae',       meaning:'(ordinal suffix) -st / -nd / -th'},
      '잔':        {reading:'jan',            meaning:'cup / glass (counter)'},
      '병':        {reading:'byeong',         meaning:'bottle'},
      '봉지':      {reading:'bongji',         meaning:'bag / packet'},
    };
    // Compound verb endings listed longest-first so the greedy match works correctly
    const _KO_PARTICLES = [
      '하시려면','하려면','하시겠어요','하겠습니다','하겠어요','했습니다','했어요',
      '하십시오','하시면','하세요','합니까','합니다','해요','해서','하면','하다','하고',
      '시려면','겠습니다','겠어요','습니다','었어요','았어요','이에요','으면','려면',
      // Compound postpositions — must come before their embedded short particles
      '밖에서','밖에도','밖에','밖으로',
      '으로부터','으로서도','으로서','으로도','으로만','으로는',
      '에서부터','에서도','에서만','에서는',
      '에서','에게','으로','까지도','까지만','까지','부터','이라','라고','이나','으나','이고','이면','예요',
      '에도','에만','에는',
      '로서','로부터','로도','로만','로는',
      '한테서','한테도','한테',
      '를','을','가','이','는','은','에','로','와','과','도','만','의',
    ];
    const _KO_NO_SPLIT = new Set([
      '안녕하세요','안녕하십시오','감사합니다','감사해요','죄송합니다','죄송해요',
      '괜찮아요','괜찮습니다','실례합니다','어서오세요','잘부탁합니다',
    ]);
    function _ko_base_raw(w) {
      for (const p of _KO_PARTICLES) {
        if (w.length > p.length && w.endsWith(p)) return w.slice(0, -p.length);
      }
      return null;
    }
    function _ko_base(w) {
      if (_KO_NO_SPLIT.has(w)) return null;
      return _ko_base_raw(w);
    }
    function _ko_split_words(words, defs) {
      const out_words = [], out_defs = [];
      words.forEach((w, i) => {
        const clean = w.replace(/[.!?,;:…]+$/, '');
        const punct = w.slice(clean.length);
        if (_KO_NO_SPLIT.has(clean)) {
          // Treat as atomic — no subpart breakdown for common set phrases
          out_words.push(w);
          out_defs.push(defs ? (defs[i] || {text:w, reading:'', meaning:''}) : {text:w, reading:'', meaning:''});
        } else {
          const base = _ko_base_raw(clean);
          if (base) {
            const particle = clean.slice(base.length);
            out_words.push(w);
            out_defs.push({
              text: clean, reading: romanizeKo(clean), meaning: _KO_FALLBACK?.[clean]?.meaning || '',
              parts: [
                {text: base,     reading: romanizeKo(base),     meaning: _KO_FALLBACK?.[base]?.meaning     || ''},
                {text: particle, reading: romanizeKo(particle), meaning: _KO_FALLBACK?.[particle]?.meaning || ''},
              ]
            });
          } else {
            out_words.push(w);
            const _fb = _KO_FALLBACK?.[clean];
            const _def = defs ? (defs[i] || {text:w, reading:romanizeKo(clean), meaning:''}) : {text:w, reading:romanizeKo(clean), meaning:''};
            if (_fb?.parts) _def.parts = _fb.parts;
            out_defs.push(_def);
          }
        }
      });
      return {words: out_words, defs: out_defs};
    }
    function _sign_lookup(text) {
      for (const id of Object.keys(SIGN_BY_ID)) {
        const sign = SIGN_BY_ID[id]; if (!sign.tokens) continue;
        for (const tok of sign.tokens) {
          if (tok.text === text && (tok.romaji||tok.furigana) && tok.meaning)
            return {reading: tok.romaji||tok.furigana, meaning: tok.meaning};
        }
      }
      return null;
    }
    // Strip comma- or slash-separated synonyms from LLM-returned meanings — pick only the first.
    async function _npc_lookup(word, on_status) {
      const clean=word.replace(/^[.!?,\s]+|[.!?,\s]+$/g,'');
      if (LANG.current==='ko'&&_KO_FALLBACK[clean]) { const def={reading:romanizeKo(clean),meaning:_KO_FALLBACK[clean].meaning}; _npc_defs[clean]=def; return def; }
      if (_npc_defs[clean]?.reading) return _npc_defs[clean];
      if (LANG.current==='ko') {
        const base=_ko_base(clean);
        if (base&&_KO_FALLBACK[base])  { const d={reading:romanizeKo(clean),meaning:_KO_FALLBACK[base].meaning}; _npc_defs[clean]=d; return d; }
        const sd=_sign_lookup(clean);  if (sd) { const d={reading:romanizeKo(clean),meaning:sd.meaning}; _npc_defs[clean]=d; return d; }
        if (base) { const sb=_sign_lookup(base); if (sb) { const d={reading:romanizeKo(clean),meaning:sb.meaning}; _npc_defs[clean]=d; return d; } }
      } else {
        const sd=_sign_lookup(clean);  if (sd) { _npc_defs[clean]=sd; return sd; }
      }
      const lang_name = LANG.current==='ko'?'Korean':'Japanese';
      let elapsed=0;
      const pulse=on_status?setInterval(()=>{ elapsed++; on_status(`looking up… ${elapsed}s`); },1000):null;
      on_status?.('looking up…');
      try {
        const ctl=new AbortController(); const tid=setTimeout(()=>ctl.abort(),15000);
        const res=await fetch(OLLAMA_URL,{method:'POST',headers:{'Content-Type':'application/json'},signal:ctl.signal,
          body:JSON.stringify({model:OLLAMA_MODEL,keep_alive:-1,messages:[{role:'user',content:
            `${lang_name} word: "${clean}"\nReply ONLY with JSON: {"reading":"romanization","meaning":"core English word or short phrase (3 words max)"}`
          }],stream:false,options:{temperature:0,num_predict:40}})});
        clearTimeout(tid); if(pulse)clearInterval(pulse);
        if (!res.ok) throw new Error();
        const raw=(await res.json()).message?.content?.trim()||'';
        let p=null; try{p=JSON.parse(raw);}catch{}
        if (!p){const m=raw.match(/\{[\s\S]*\}/);if(m)try{p=JSON.parse(m[0]);}catch{}}
        const reading=LANG.current==='ko' ? romanizeKo(clean) : (p?.reading||p?.romanization||p?.pronunciation||'').toLowerCase();
        const meaning=_first_meaning(p?.meaning||p?.translation||p?.english||'');
        if (reading||meaning){const def={reading,meaning};_npc_defs[clean]=def;return def;}
      } catch { if(pulse)clearInterval(pulse); }
      return null;
    }

    async function _fetch_player_translation(text, tokens) {
      if (_player_translations[text]) return _player_translations[text];
      try {
        const ctl=new AbortController(); const tid=setTimeout(()=>ctl.abort(),10000);
        const res=await fetch(OLLAMA_URL,{method:'POST',headers:{'Content-Type':'application/json'},signal:ctl.signal,
          body:JSON.stringify({model:OLLAMA_MODEL,keep_alive:-1,messages:[{role:'user',content:
            `Translate this Korean sentence to natural English. Reply ONLY with the translation, no other text.\nKorean: "${text}"`
          }],stream:false,options:{temperature:0,num_predict:60}})});
        clearTimeout(tid);
        if (res.ok) { const raw=(await res.json()).message?.content?.trim()||''; if(raw){_player_translations[text]=raw;return raw;} }
      } catch {}
      const parts=tokens.map(t=>(t.meaning||'').split(/\s*[\/,]\s*/)[0]).filter(Boolean);
      const fb=parts.length ? parts.join(' / ') : null;
      if (fb) _player_translations[text]=fb;
      return fb;
    }

    function _populate_voices() {
      const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('ko'));
      voice_pick.innerHTML = '';
      const googleIdx = voices.findIndex(v => v.name.toLowerCase().includes('google'));
      voices.forEach((v, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = v.name;
        if (i === (googleIdx >= 0 ? googleIdx : 0)) opt.selected = true;
        voice_pick.appendChild(opt);
      });
    }
    _populate_voices();
    speechSynthesis.addEventListener('voiceschanged', _populate_voices);

    const _NATIVE_HOUR_KO = [null,'한','두','세','네','다섯','여섯','일곱','여덟','아홉','열','열한','열두','열세','열네','열다섯','열여섯','열일곱','열여덟','열아홉','스무','스물한','스물두','스물세','스물네'];
    function _speak(text) {
      if (!window.speechSynthesis) return;
      speechSynthesis.cancel();
      if (LANG.current === 'ko') text = text.replace(/(\d+)시/g, (_,n) => { const h=_NATIVE_HOUR_KO[+n]; return (h||n)+'시'; });
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      if (LANG.current === 'ko') {
        u.lang = 'ko-KR';
        const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('ko'));
        const chosen = voices[parseInt(voice_pick.value)];
        if (chosen) u.voice = chosen;
      } else {
        u.lang = 'ja-JP';
      }
      speechSynthesis.speak(u);
    }

    function _select(idx, part_idx=null, field=null) {
      cur_word_idx=idx; cur_part_idx=part_idx;
      const sign=SIGN_BY_ID[cur_sign_id], token=sign.tokens[idx];
      const active=(part_idx!=null&&part_idx>=0&&token.parts)?token.parts[part_idx]:token;
      const res_key=(part_idx!=null&&part_idx>=0)?`${idx}p${part_idx}`:idx;
      const res=word_results[res_key]||{};
      if (!field) field=!res.romaji?'romaji':'meaning';
      _active_field=field;
      _speak(active.text);
      inp.placeholder=field==='meaning'?'english meaning…':'';
      inp.value=""; inp.className=""; fb.textContent=""; fb.style.color="";
      const _res_key_sel=part_idx!=null?`${idx}p${part_idx}`:idx;
      const _saved_hint=_hint_by_key[_res_key_sel];
      if (_saved_hint) _show_hint(_saved_hint.reading, _saved_hint.meaning); else _clear_hint();
      if (!_activate_slot_inplace(idx, part_idx, _active_field)) _render_chips();
      _update_lkp();
      if (inp.parentElement!==panel_el) inp.focus();
      if (cur_sign_id==='__npc__') {
        if (part_idx!=null&&part_idx>=0&&token.parts) {
          const part=token.parts[part_idx];
          if (!part.romaji&&!part.furigana) {
            _npc_lookup(part.text).then(def=>{
              if (def&&cur_word_idx===idx&&cur_part_idx===part_idx&&cur_sign_id==='__npc__') {
                part.romaji=def.reading; part.furigana=def.reading; part.meaning=def.meaning;
              }
            });
          }
        } else if (part_idx==null&&!token.parts&&!token.romaji&&!token.furigana) {
          _npc_lookup(token.text).then(def=>{
            if (def&&cur_word_idx===idx&&cur_sign_id==='__npc__') {
              token.romaji=def.reading; token.furigana=def.reading; token.meaning=def.meaning;
            }
          });
        }
      }
    }

    function open_npc_sentence(jp_text, words, clicked_idx, npc_label, token_defs, en_text) {
      const tokens=words.map((text,i)=>{
        const td=token_defs&&token_defs[i];
        const _reading=LANG.current==='ko' ? romanizeKo(text) : (td?.reading||'').toLowerCase();
        if (td?.meaning) {
          const clean=text.replace(/^[.!?,\s]+|[.!?,\s]+$/g,'');
          if (clean) _npc_defs[clean]={reading:_reading,meaning:td?.meaning||''};
        }
        const tok={text, furigana:_reading, romaji:_reading, meaning:td?.meaning||''};
        if (td?.parts) tok.parts=td.parts;
        return tok;
      });
      _npc_line_id = jp_text || words.join('');
      SIGN_BY_ID['__npc__']={id:'__npc__', label:npc_label||'', japanese:jp_text||words.join(''), tokens, translation:en_text||''};
      open('__npc__');
      const _ct=tokens[clicked_idx];
      if (_ct?.parts?.length) {
        let fi=0,ff='romaji';
        for (let pi=0;pi<_ct.parts.length;pi++){const r=word_results[`${clicked_idx}p${pi}`]||{};if(!r.romaji){fi=pi;ff='romaji';break;}if(!r.meaning){fi=pi;ff='meaning';break;}}
        _select(clicked_idx,fi,ff);
      } else { _select(clicked_idx); }
    }

    function open(sign_id) {
      chips_row.style.display='';
      const sign=SIGN_BY_ID[sign_id]; if (!sign) return;
      cur_sign_id=sign_id; cur_word_idx=null; cur_part_idx=null; _active_field=null; _hint_by_key={};
      const saved=sign_id==='__npc__'?NPC_LINE_PROGRESS.get(_npc_line_id):WORD_PROGRESS.getSign(sign_id); word_results={};
      Object.keys(saved).forEach(k=>{
        if (/^\d+$/.test(k)) word_results[+k]={...saved[k]};
        else word_results[k]={...saved[k]};
      });
      sign.tokens.forEach((tok,i)=>{
        if (_isNumericToken(tok)) { word_results[i]=word_results[i]||{}; word_results[i].meaning=true; }
        if (tok.parts) tok.parts.forEach((part,pi)=>{
          if (_isNumericToken(part)) { const pk=`${i}p${pi}`; word_results[pk]=word_results[pk]||{}; word_results[pk].meaning=true; }
        });
      });
      // Migration: tokens that were saved as atomic before parts were added
      if (sign_id!=='__npc__') sign.tokens.forEach((tok,i)=>{
        if (!tok.parts||!tok.parts.length) return;
        const atomicRes=word_results[i]||{};
        if (!atomicRes.romaji&&!atomicRes.meaning) return;
        tok.parts.forEach((_,pi)=>{
          const pk=`${i}p${pi}`;
          word_results[pk]=word_results[pk]||{};
          if (atomicRes.romaji&&!word_results[pk].romaji) { word_results[pk].romaji=true; WORD_PROGRESS.unlock_part(sign_id,i,pi,'romaji'); }
          if (atomicRes.meaning&&!word_results[pk].meaning) { word_results[pk].meaning=true; WORD_PROGRESS.unlock_part(sign_id,i,pi,'meaning'); }
        });
      });
      if (sign_id==='__npc__') {
        const vocab=NPC_VOCAB.getAll(), sign=SIGN_BY_ID['__npc__'];
        if (sign) sign.tokens.forEach((tok,i)=>{
          if (tok.parts) {
            tok.parts.forEach((part,pi)=>{
              const e=vocab.find(v=>v.text===part.text);
              if (e) {
                if (e.romaji&&e.reading)          { part.romaji=e.reading; part.furigana=e.reading; }
                if (e.meaning_unlocked&&e.meaning) { part.meaning=e.meaning; }
              }
            });
          } else {
            const e=vocab.find(v=>v.text===tok.text);
            if (e) {
              if (e.romaji&&e.reading)          { tok.romaji=e.reading; tok.furigana=e.reading; }
              if (e.meaning_unlocked&&e.meaning) { tok.meaning=e.meaning; }
            }
          }
        });
      }
      lbl_el.textContent=sign.label||'';
      const koMode=LANG.current==='ko';
      speak_all.style.display=koMode?'':'none';
      fb.textContent=""; fb.style.color=""; hint_read.textContent=""; hint_mean.textContent="";
      empty_el.style.display="none";
      if (sign_id!=='__npc__') document.getElementById("ws-dialogue").classList.remove("open");
      panel_el.classList.add("open"); ws_el.classList.add("active");
      ws_el.classList.remove('done');
      const transl_el=document.getElementById("ws-translation");
      transl_el.classList.remove('visible'); transl_el.textContent='';
      if (sign_id!=='__npc__') renderer.sign_panel={sign_id};
      _render_chips(); _update_lkp();
      // Show done state immediately if already completed (saved progress)
      const alreadyDone=sign&&sign.tokens.every((t,i)=>{
        if (t.parts&&t.parts.length) return t.parts.every((_,pi)=>{ const r=word_results[`${i}p${pi}`]||{}; return r.romaji&&r.meaning; });
        const r=word_results[i]||{}; return r.romaji&&r.meaning;
      });
      if (alreadyDone) {
        const _cached=sign.translation||_player_translations[sign.japanese]||'';
        if (_cached) {
          ws_el.classList.add('done');
          transl_el.textContent=_cached;
          transl_el.classList.add('visible');
        } else if (cur_sign_id==='__npc__' && sign.japanese) {
          ws_el.classList.add('done');
          _fetch_player_translation(sign.japanese, sign.tokens).then(en=>{
            if (en) { transl_el.textContent=en; transl_el.classList.add('visible'); }
          });
        }
      }
    }

    function clear() {
      chips_row.style.display='';
      cur_sign_id=null; cur_word_idx=null; cur_part_idx=null; _active_field=null;
      panel_el.classList.remove("open"); ws_el.classList.remove("active"); ws_el.classList.remove("done");
      empty_el.style.display="";
      renderer.sign_panel=null;
    }

    function _accept(token, matched, res) {
      res[matched]=true;
      if (cur_sign_id!=='__npc__') {
        if (cur_part_idx!=null&&cur_part_idx>=0) {
          WORD_PROGRESS.unlock_part(cur_sign_id,cur_word_idx,cur_part_idx,matched);
        } else if (cur_part_idx===-1) {
          // Whole-word answer: save token-level and propagate to all parts
          WORD_PROGRESS.unlock(cur_sign_id,cur_word_idx,matched);
          const _wsign=SIGN_BY_ID[cur_sign_id], _wtok=_wsign.tokens[cur_word_idx];
          if (_wtok?.parts) _wtok.parts.forEach((_,pi)=>{
            const pk=`${cur_word_idx}p${pi}`;
            word_results[pk]=word_results[pk]||{}; word_results[pk][matched]=true;
            WORD_PROGRESS.unlock_part(cur_sign_id,cur_word_idx,pi,matched);
          });
        } else {
          WORD_PROGRESS.unlock(cur_sign_id,cur_word_idx,matched);
        }
        if (typeof MapPanel !== 'undefined' && document.getElementById('map-panel')?.classList.contains('open')) MapPanel.refresh();
      } else { NPC_VOCAB.add(token, matched); NPC_LINE_PROGRESS.save(_npc_line_id, word_results); }
      // Advance to the other slot if one was just answered
      if (matched==='romaji'&&!res.meaning) { _active_field='meaning'; inp.placeholder=''; }
      if (matched==='meaning'&&!res.romaji) { _active_field='romaji';  inp.placeholder=''; }
      inp.value=""; inp.className="correct";
      setTimeout(()=>{ inp.className=""; },500);
      fb.textContent=""; fb.style.color="";
      _render_chips();
      if (cur_sign_id==='__npc__') DialoguePanel.refreshWordColors();
      const sign=SIGN_BY_ID[cur_sign_id];
      const allDone=sign&&sign.tokens.every((t,i)=>{
        if (t.parts&&t.parts.length) return t.parts.every((_,pi)=>{ const r=word_results[`${i}p${pi}`]||{}; return r.romaji&&r.meaning; });
        const r=word_results[i]||{}; return r.romaji&&r.meaning;
      });
      if (allDone) {
        ws_el.classList.add('done');
        const transl_el=document.getElementById("ws-translation");
        if (sign.translation) {
          transl_el.textContent=sign.translation;
          setTimeout(()=>transl_el.classList.add('visible'),20);
        } else if (cur_sign_id==='__npc__' && sign.japanese) {
          _fetch_player_translation(sign.japanese, sign.tokens).then(en=>{
            if (en) { transl_el.textContent=en; setTimeout(()=>transl_el.classList.add('visible'),20); }
          });
        }
        if (cur_sign_id==='__npc__') DialoguePanel.revealTranslation(sign.japanese);
        SoundFX.chime();
      } else { SoundFX.ding(); if (inp.parentElement!==panel_el) inp.focus(); }
    }

    inp.addEventListener("keydown", async e => {
      if (e.key==="Escape"){inp.blur();return;}
      if (e.key==="Tab") {
        e.preventDefault();
        const merged=chips_row.querySelector('.ws-merged-chip');
        if (!merged) return;
        const openSlots=[...merged.querySelectorAll('[data-field].slot-empty,[data-field].slot-active')];
        if (openSlots.length===0) return;
        const activeIdx=openSlots.findIndex(el=>el.classList.contains('slot-active'));
        const step=e.shiftKey?-1:1;
        const nextIdx=activeIdx===-1?(e.shiftKey?openSlots.length-1:0):(activeIdx+step+openSlots.length)%openSlots.length;
        const next=openSlots[nextIdx];
        const tok_idx=+next.dataset.tokIdx;
        const part_idx=next.dataset.whole==='1'?-1:(next.dataset.partIdx!==undefined?+next.dataset.partIdx:null);
        _select(tok_idx,part_idx,next.dataset.field);
        return;
      }
      if (e.key!=="Enter") return;
      if (cur_sign_id==null||cur_word_idx==null||_checking) return;
      const sign=SIGN_BY_ID[cur_sign_id], token=sign.tokens[cur_word_idx];
      const active=(cur_part_idx!=null&&cur_part_idx>=0&&token.parts)?token.parts[cur_part_idx]:token;
      const res_key=(cur_part_idx!=null&&cur_part_idx>=0)?`${cur_word_idx}p${cur_part_idx}`:cur_word_idx;
      word_results[res_key]=word_results[res_key]||{};
      const res=word_results[res_key], raw=inp.value;
      // Auto-match: pre-fill from NPC_VOCAB only (confirmed correct answers, not LLM guesses)
      const _kve=NPC_VOCAB.getAll().find(e=>e.text===active.text&&e.romaji&&e.meaning_unlocked);
      if (_kve) {
        if (!active.romaji&&_kve.reading)  { active.romaji=_kve.reading; active.furigana=_kve.reading; }
        if (!active.meaning&&_kve.meaning) { active.meaning=_kve.meaning; }
      }
      const matched=_checkWhat(active,raw,res);
      if (matched) { _accept(active,matched,res); }
      else if (res.romaji&&!res.meaning) {
        // Empty input: reject immediately — never reach LLM with blank answer
        if (!raw.trim()) { inp.className="wrong"; setTimeout(()=>{inp.className="";},700); inp.focus(); return; }
        // If the meaning is unknown (NPC token without a definition), look it up before judging
        if (cur_sign_id==='__npc__' && !active.meaning) {
          _checking=true;
          const def=await _npc_lookup(active.text, msg=>{ fb.textContent=msg; fb.style.color='#b8860b'; });
          _checking=false;
          if (def && def.meaning) {
            active.meaning=def.meaning;
            if (!active.romaji) { active.romaji=def.reading; active.furigana=def.reading; }
          } else {
            // No definition found; treat the player's typed answer as the canonical meaning
            active.meaning=raw.trim();
          }
          const m2=_checkWhat(active,raw,res);
          if (m2) { inp.value=""; _accept(active,m2,res); return; }
          if (!active.meaning) { inp.className="wrong"; setTimeout(()=>{inp.className="";},700); inp.focus(); return; }
        }
        _checking=true; fb.textContent="checking…"; fb.style.color="#b8860b";
        const ok=await _llama_judge_meaning(active,raw.trim(), msg=>{ fb.textContent=msg; fb.style.color="#b8860b"; });
        _checking=false;
        if (ok){ inp.value=""; _accept(active,"meaning",res); }
        else { inp.className="wrong"; setTimeout(()=>{inp.className="";},700); inp.focus(); }
      } else { inp.className="wrong"; setTimeout(()=>{inp.className="";},700); }
    });

    speak_all.addEventListener("click", () => {
      const sign = SIGN_BY_ID[cur_sign_id]; if (!sign) return;
      _speak(sign.japanese.replace(/\n/g, ' '));
    });

    let _copy_flash = null;
    copy_btn.addEventListener("click", () => {
      const sign = SIGN_BY_ID[cur_sign_id]; if (!sign) return;
      const tokens = sign.tokens || [];
      const text = (sign.japanese || tokens.map(t => t.text).join('')).replace(/\n/g, ' ');
      _copy_text(text, null);
      copy_btn.textContent = "✓";
      copy_btn.classList.add("copied");
      if (_copy_flash) clearTimeout(_copy_flash);
      _copy_flash = setTimeout(() => {
        copy_btn.textContent = "⎘";
        copy_btn.classList.remove("copied");
        _copy_flash = null;
      }, 1400);
    });

    lkp.addEventListener("click", async () => {
      if (cur_sign_id==null||cur_word_idx==null) return;
      const _token=SIGN_BY_ID[cur_sign_id==='__npc__'?'__npc__':cur_sign_id].tokens[cur_word_idx];
      const active=(cur_part_idx!=null&&cur_part_idx>=0&&_token.parts)?_token.parts[cur_part_idx]:_token;
      const res_key=(cur_part_idx!=null&&cur_part_idx>=0)?`${cur_word_idx}p${cur_part_idx}`:cur_word_idx;
      word_results[res_key]=word_results[res_key]||{};
      const res=word_results[res_key];
      if (res.romaji&&res.meaning) return;
      if (sim.state.phone.lookup_cooldown>0) return;
      if (cur_sign_id==='__npc__') {
        if ((!active.romaji&&!active.furigana)||!active.meaning) {
          lkp.disabled=true;
          const def=await _npc_lookup(active.text, msg=>{ fb.textContent=msg; fb.style.color='#b8860b'; });
          lkp.disabled=false;
          if (def) { if(!active.romaji)active.romaji=def.reading; if(!active.furigana)active.furigana=def.reading; if(!active.meaning)active.meaning=def.meaning; }
        }
        const reading=active.romaji||active.furigana;
        const meaning=(active.meaning||'').split(/\s*[/,]\s*/)[0].trim().replace(/^to\s+/i,'');
        fb.textContent=''; fb.style.color='';
        if (!reading&&!meaning) { fb.textContent='not found'; fb.style.color='#888'; _update_lkp(); return; }
        const _hr=_fmt_read(active.furigana||reading,reading);
        _hint_by_key[res_key]={reading:_hr, meaning};
        _show_hint(_hr, meaning);
        sim.perform("use_phone_lookup"); _update_lkp(); _start_lkp_timer();
        if (inp.parentElement!==panel_el) inp.focus();
        return;
      }
      // non-NPC: show reading+meaning as hint only — player must still type to get credit
      const reading=active.romaji||active.furigana;
      const meaning=(active.meaning||'').split(/\s*[/,]\s*/)[0].trim().replace(/^to\s+/i,'');
      const _hr2=_fmt_read(active.furigana,reading);
      _hint_by_key[res_key]={reading:_hr2, meaning};
      _show_hint(_hr2, meaning);
      sim.perform("use_phone_lookup"); _update_lkp(); _start_lkp_timer();
      if (inp.parentElement!==panel_el) inp.focus();
    });

    return { open, clear, open_npc_sentence, speak: _speak, prefetch: words => words.forEach(w => _npc_lookup(w)), split_ko_words: _ko_split_words, lookup: _npc_lookup };
  })();
