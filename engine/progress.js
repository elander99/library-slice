if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
    const ra=Array.isArray(r)?r:[r,r,r,r];
    const[tl,tr,br,bl]=ra.length===4?ra:[ra[0],ra[0],ra[0],ra[0]];
    this.moveTo(x+tl,y); this.lineTo(x+w-tr,y);
    this.quadraticCurveTo(x+w,y,x+w,y+tr); this.lineTo(x+w,y+h-br);
    this.quadraticCurveTo(x+w,y+h,x+w-br,y+h); this.lineTo(x+bl,y+h);
    this.quadraticCurveTo(x,y+h,x,y+h-bl); this.lineTo(x,y+tl);
    this.quadraticCurveTo(x,y,x+tl,y); this.closePath(); return this;
  };
}

const WORD_PROGRESS = (() => {
  const KEY_PREFIX = "library-slice-progress-v1";
  function _key() { return KEY_PREFIX + '-' + LANG.current; }
  let _data = {};
  try { _data = JSON.parse(localStorage.getItem(_key()) || "{}"); } catch {}
  function _flush() { try { localStorage.setItem(_key(), JSON.stringify(_data)); } catch {} }
  return {
    getSign(id) { return _data[id] || {}; },
    getAll()    { return _data; },
    unlock(id, idx, key) {
      _data[id] = _data[id] || {}; _data[id][idx] = _data[id][idx] || {};
      _data[id][idx][key] = true; _flush();
    },
    unlock_part(id, tok_idx, part_idx, key) {
      const k = `${tok_idx}p${part_idx}`;
      _data[id] = _data[id] || {}; _data[id][k] = _data[id][k] || {};
      _data[id][k][key] = true; _flush();
    },
    reload() {
      try { _data = JSON.parse(localStorage.getItem(_key()) || "{}"); } catch { _data = {}; }
    }
  };
})();

const NPC_LINE_PROGRESS = (() => {
  const KEY = 'library-slice-npc-lines-v1';
  let _data = {};
  try { _data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
  function _flush() { try { localStorage.setItem(KEY, JSON.stringify(_data)); } catch {} }
  return {
    has(line_id) { return !!(line_id && line_id in _data); },
    get(line_id) { return line_id ? (_data[line_id] || {}) : {}; },
    save(line_id, results) { if (!line_id) return; _data[line_id] = {}; Object.keys(results).forEach(k => { _data[line_id][k] = {...results[k]}; }); _flush(); }
  };
})();

const NPC_VOCAB = (() => {
  const KEY = 'library-slice-npc-vocab-v1';
  const _norm = s => s ? s.split(/\s*[/,]\s*|\s+or\s+/)[0].trim() : s;
  let _entries = [];
  try { _entries = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch {}
  _entries.forEach(e => { if (e.meaning) e.meaning = _norm(e.meaning); });
  function _flush() { try { localStorage.setItem(KEY, JSON.stringify(_entries)); } catch {} }
  return {
    getAll() { return _entries; },
    add(token, key) {
      let e = _entries.find(x => x.text === token.text);
      const isNew = !e;
      if (!e) { e = {text:token.text, reading:'', meaning:'', romaji:false, meaning_unlocked:false}; _entries.push(e); }
      if (token.romaji && !e.reading) e.reading = token.romaji;
      if (token.meaning && !e.meaning) e.meaning = _norm(token.meaning);
      if (key === 'romaji') e.romaji = true;
      if (key === 'meaning' && e.meaning) e.meaning_unlocked = true;
      _flush();
      if (isNew) SoundFX.vocab();
      if (key === 'meaning' && e.meaning && typeof VocabPanel !== 'undefined') VocabPanel.refresh(e.text);
    }
  };
})();

const JOURNAL_PROGRESS = (() => {
  const KEY = 'library-slice-journal-v1';
  let _data = {};
  try { _data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
  function _flush() { try { localStorage.setItem(KEY, JSON.stringify(_data)); } catch {} }

  function _get(npc_id) {
    if (!_data[npc_id]) _data[npc_id] = {};
    return _data[npc_id];
  }

  return {
    mark_seen(npc_id, room_id) {
      const e = _get(npc_id);
      e.seen = true;
      if (room_id) { e.rooms = e.rooms || []; if (!e.rooms.includes(room_id)) e.rooms.push(room_id); }
      _flush();
      if (typeof JournalPanel !== 'undefined') JournalPanel.refresh();
    },
    mark_met(npc_id) {
      const e = _get(npc_id);
      e.seen = true; e.met = true;
      if (typeof NPC_DEFS !== 'undefined' && NPC_DEFS[npc_id]?.room) {
        e.rooms = e.rooms || [];
        if (!e.rooms.includes(NPC_DEFS[npc_id].room)) e.rooms.push(NPC_DEFS[npc_id].room);
      }
      _flush();
      if (typeof JournalPanel !== 'undefined') JournalPanel.refresh();
    },
    confirm_jp(npc_id) {
      _get(npc_id).jp_confirmed = true; _flush();
      if (typeof JournalPanel !== 'undefined') JournalPanel.refresh();
    },
    confirm_birthday(npc_id) {
      _get(npc_id).birthday_confirmed = true; _flush();
      if (typeof JournalPanel !== 'undefined') JournalPanel.refresh();
    },
    set_notes(npc_id, text) { _get(npc_id).notes = text; _flush(); },
    get(npc_id) { return _data[npc_id] || {}; },
  };
})();

const ENCOUNTER_PROGRESS = (() => {
  const KEY = 'library-slice-encounters-v1';
  let _data = { signs: [], convos: [] };
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) _data = d; } catch {}
  if (!Array.isArray(_data.signs))  _data.signs  = [];
  if (!Array.isArray(_data.convos)) _data.convos = [];
  function _flush() { try { localStorage.setItem(KEY, JSON.stringify(_data)); } catch {} }
  return {
    mark_sign(sign_id)   { if (!_data.signs.includes(sign_id))   { _data.signs.push(sign_id);   _flush(); } },
    mark_convo(convo_id) { if (!_data.convos.includes(convo_id)) { _data.convos.push(convo_id); _flush(); } },
    get_signs()  { return _data.signs.slice(); },
    get_convos() { return _data.convos.slice(); },
  };
})();
