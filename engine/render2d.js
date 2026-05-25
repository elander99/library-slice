// Top-down tile renderer.

class Renderer2D {
  constructor(canvas, sim) {
    this.canvas = canvas;
    this.sim    = sim;
    this.ctx    = canvas.getContext('2d');
    this._dpr   = window.devicePixelRatio || 1;
    this._imgs  = {};          // loaded Image objects keyed by SHEET key
    this._room_cache = null;   // last drawn room id
    this.notifications = [];
    this.log_entries   = [];
    this.action_menu   = null;
    this.sign_panel    = null;

    this.FONT_JP   = "'Noto Serif JP', 'Noto Sans KR', serif";
    this.FONT_MONO = "'DM Mono', 'Noto Sans KR', monospace";
    this.HUD_H     = 52;
    this.WS_H      = 180;      // workspace panel height

    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._load_sheets();
  }

  _resize() {
    const dpr = this._dpr;
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width  = this.W * dpr;
    this.canvas.height = this.H * dpr;
    this.canvas.style.width  = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    // Viewport fills from HUD to bottom; workspace panel overlays transparently
    this.VP_Y = this.HUD_H;
    this.VP_H = this.H - this.HUD_H;
    this.VP_W = this.W;
  }

  _load_sheets() {
    const SHEET_PATHS = {
      interior:  'art/tileset_interior.png',
      interior2: 'art/tileset_interior_2.png',
      terrain:   'art/tileset_terrain.png',
      terrain2:  'art/tileset_terrain_2.png',
      terrain3:  'art/tileset_terrain_3.png',
      water:     'art/tileset_water.png',
      people:    'art/tileset_people.png',
      people2:   'art/tileset_people_2.png',
      people3:   'art/tileset_people_3.png',
      trees:     'art/tileset_trees.png',
      library:   'art/tileset_library.png',
      school:    'art/tileset_school.png',
      infra:     'art/tileset_infrastructure.png',
      toys:      'art/tileset_toys.png',
      buildings: 'art/tileset_buildings.png',
    };
    for (const [k, src] of Object.entries(SHEET_PATHS)) {
      const img = new Image();
      img.src = src;
      this._imgs[k] = img;
    }
  }

  // ── Camera ────────────────────────────────────────────────────────────────

  _camera(s) {
    const room = ROOM_MAP_DATA[s.room];
    if (!room) return { cx:0, cy:0 };
    const map_px_w = room.cols * TS;
    const map_px_h = room.rows * TS;
    const dpr = this._dpr;
    let cx = s.px - this.VP_W / 2;
    let cy = s.py - this.VP_H / 2;
    cx = Math.max(0, Math.min(cx, map_px_w - this.VP_W));
    cy = Math.max(0, Math.min(cy, map_px_h - this.VP_H));
    // Snap to physical pixel so tile edges always land on whole screen pixels
    cx = Math.round(cx * dpr) / dpr;
    cy = Math.round(cy * dpr) / dpr;
    return { cx, cy };
  }

  // ── Unified blit ─────────────────────────────────────────────────────────
  // Single draw call for all sprite types. Source size: tw/th (T16) or sw/sh (T, trees),
  // defaulting to 32. Dest size: dw/dh from def, defaulting to TS×TS.
  // DPR-snaps destination so tile edges land on physical pixels.

  _blit(def, dx, dy) {
    if (!def) return;
    const sw  = def.tw ?? def.sw ?? 32;
    const sh  = def.th ?? def.sh ?? 32;
    const dw  = def.dw ?? TS;
    const dh  = def.dh ?? TS;
    const img = this._imgs[def.img];
    const dpr = this._dpr;
    const fdx = Math.round(dx * dpr) / dpr;
    const fdy = Math.round(dy * dpr) / dpr;
    if (img && img.complete && img.naturalWidth > 0) {
      this.ctx.drawImage(img, def.sx, def.sy, sw, sh, fdx, fdy, dw, dh);
    } else {
      this.ctx.fillStyle = def.color || '#888';
      this.ctx.fillRect(fdx, fdy, dw, dh);
    }
  }

  _draw_tile(tile_key, dx, dy) {
    if (!tile_key) return;
    this._blit(TILES[tile_key], dx, dy);
  }

  _draw_patch_tile(ptile, dx, dy) {
    this._blit(ptile, dx, dy);
  }

  // ── Autotile / 9-patch helpers ────────────────────────────────────────────

  // Returns true if (col,row) is a floor (walkable, non-solid) cell
  _tile_is_floor(room, col, row) {
    if (col < 0 || row < 0 || col >= room.cols || row >= room.rows) return false;
    const code = room.tiles[row][col];
    if (!code || code === '') return true;
    const def = TILES[code];
    return def ? !def.solid : true;
  }

  // Given a 9-patch group and the map position, return the right tile descriptor
  // by checking which cardinal/diagonal neighbors are floor tiles.
  _pick_patch(patch, room, col, row) {
    const N  = this._tile_is_floor(room, col,   row - 1);
    const S  = this._tile_is_floor(room, col,   row + 1);
    const E  = this._tile_is_floor(room, col + 1, row);
    const W  = this._tile_is_floor(room, col - 1, row);
    const NE = this._tile_is_floor(room, col + 1, row - 1);
    const NW = this._tile_is_floor(room, col - 1, row - 1);
    const SE = this._tile_is_floor(room, col + 1, row + 1);
    const SW = this._tile_is_floor(room, col - 1, row + 1);

    // Cardinal neighbors take priority (edge tiles)
    if (S && !N) return patch.TC;  // floor below → top-centre edge
    if (N && !S) return patch.BC;  // floor above → bottom-centre edge
    if (E && !W) return patch.ML;  // floor right → middle-left edge
    if (W && !E) return patch.MR;  // floor left  → middle-right edge

    // No cardinal floor → check diagonals for outer corners
    if (SE) return patch.TL;
    if (SW) return patch.TR;
    if (NE) return patch.BL;
    if (NW) return patch.BR;

    return patch.MC; // fully surrounded — interior wall fill
  }

  _draw_floor_tile(room, col, row, dx, dy) {
    const variants = FLOOR_VARIANTS[room.floor];
    if (variants) {
      const h = (Math.imul(col ^ (col << 5), 0x9e3779b9) ^ Math.imul(row ^ (row << 7), 0x85ebca6b)) >>> 0;
      this._draw_tile(variants[h % variants.length], dx, dy);
    } else {
      this._draw_tile(room.floor, dx, dy);
    }
  }

  // Draw a tree sprite at world pixel (wx,wy) — trees are taller than one tile.
  // wx,wy = bottom-center of tree trunk. Sprite drawn upward from that point.
  // Uses _blit so dw/dh (2× source) are applied consistently with other tiles.
  _draw_tree(spr, wx, wy, cam) {
    const dw = spr.dw ?? spr.sw;
    const dh = spr.dh ?? spr.sh;
    const dx = wx - cam.cx - dw / 2;
    const dy = wy - cam.cy - dh;
    this._blit(spr, dx, dy);
  }

  // ── Draw sprite (character/object) ────────────────────────────────────────

  _draw_sprite(spr, dx, dy, w, h) {
    const img = this._imgs[spr.img];
    const dw = w || TS, dh = h || TS;
    if (img && img.complete && img.naturalWidth > 0) {
      ctx_save_restore(this.ctx, () =>
        this.ctx.drawImage(img, spr.sx, spr.sy, spr.sw || 32, spr.sh || 32, dx, dy, dw, dh)
      );
    }
  }

  // ── Main draw ─────────────────────────────────────────────────────────────

  draw() {
    const ctx = this.ctx;
    const dpr = this._dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this.W, this.H);

    const s   = this.sim.state;
    const cam = this._camera(s);
    const room = ROOM_MAP_DATA[s.room];

    this._consume_reactions();

    // Clip to viewport
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, this.VP_Y, this.VP_W, this.VP_H);
    ctx.clip();
    ctx.translate(0, this.VP_Y);

    if (room) {
      this._draw_map(room, cam);
      this._draw_objects(room, cam, s);
      this._draw_npcs(room, cam, s);
      this._draw_player(cam, s);
      this._flush_trees(cam);
      this._draw_sign_hotspots(room, cam);
    }

    this._draw_notifications(cam, s);

    // Per-room ambient tint (subtle mood colour)
    if (room) this._draw_room_tint(s.room);

    // Vignette — darken viewport edges for depth and focus
    this._draw_vignette();

    // Transition fade
    if (s.transition) {
      const alpha = Math.min(s.transition.alpha, 1);
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(-cam.cx, -cam.cy, room ? room.cols*TS : 800, room ? room.rows*TS : 600);
    }

    ctx.restore();

    this._draw_hud(s);
    if (this.action_menu) this._draw_action_menu();
    if (s.session_ended)  this._draw_end_screen(s);
  }

  // ── Map tiles ─────────────────────────────────────────────────────────────

  _draw_map(room, cam) {
    const { cx, cy } = cam;
    this._tree_draws = [];   // collect tree draw calls; render after characters
    this._tree_room  = room; // needed by _flush_trees for southernmost-tile check
    const TREE_CODE = { TREE:'leafy_lg', TREE2:'pine', TREE3:'shrub' };
    const wall_patch = room.wall_patch ? NINE_PATCH[room.wall_patch] : null;

    for (let row = 0; row < room.rows; row++) {
      for (let col = 0; col < room.cols; col++) {
        const dx = col*TS - cx, dy = row*TS - cy;
        if (dx > -TS && dx < this.VP_W + TS && dy > -TS && dy < this.VP_H + TS) {
          this._draw_floor_tile(room, col, row, dx, dy);
          const code = room.tiles[row][col];
          if (code) {
            // 9-patch autotile: select the right border tile based on neighbors
            if ((code === 'WALL' || code === 'WALL2') && wall_patch) {
              this._draw_patch_tile(this._pick_patch(wall_patch, room, col, row), dx, dy);
            } else {
              const tree_spr = TREE_SPRITES[TREE_CODE[code]];
              if (tree_spr) {
                // Defer tree draw so it renders on top; store col/row for base pass
                this._tree_draws.push({ spr: tree_spr, wx: col*TS + TS/2, wy: (row+1)*TS, col, row });
              } else {
                this._draw_tile(code, dx, dy);
              }
            }
          }
        }
      }
    }
  }

  _flush_trees(cam) {
    if (!this._tree_draws) return;
    // Sort by wy so southerly trees draw on top
    this._tree_draws.sort((a, b) => a.wy - b.wy);

    // Tree sprites (shadows are baked into the sprite art)
    for (const { spr, wx, wy } of this._tree_draws) {
      this._draw_tree(spr, wx, wy, cam);
    }
    this._tree_draws = [];
  }

  // ── Interactive objects (library items on desk) ───────────────────────────

  _draw_objects(room, cam, s) {
    if (!room.objects) return;
    const ctx = this.ctx;
    const { cx, cy } = cam;
    for (const obj of room.objects) {
      const dx = obj.col*TS - cx, dy = obj.row*TS - cy;
      // Draw simple colored icons as placeholders (sprite tuning TODO)
      ctx.fillStyle = this._obj_color(obj.id, s);
      ctx.fillRect(dx+4, dy+4, TS-8, TS-8);
      ctx.fillStyle = '#fff';
      ctx.font = `12px ${this.FONT_MONO}`;
      ctx.textAlign = 'center';
      ctx.fillText(this._obj_label(obj.id, s), dx+TS/2, dy+TS-4);
    }
  }

  _obj_color(id, s) {
    if (id==='laptop')   return s.laptop.on ? '#1a3a5c' : '#2a2a2a';
    if (id==='textbook') return '#2a4a6c';
    if (id==='phone')    return s.phone.on_call ? '#c0392b' : '#1a1a1a';
    if (id==='snack')    return s.snack.eaten ? '#555' : '#8b6914';
    if (id==='outlet')   return '#e0ddd5';
    return '#888';
  }

  _obj_label(id, s) {
    if (id==='laptop')   return `💻${Math.round(s.laptop.battery)}%`;
    if (id==='textbook') return `📖${Math.round(s.textbook.progress)}%`;
    if (id==='phone')    return '📱';
    if (id==='snack')    return s.snack.eaten ? '' : '🍘';
    if (id==='outlet')   return '⚡';
    return id;
  }

  // ── NPC sprites ───────────────────────────────────────────────────────────

  _draw_npcs(room, cam, s) {
    if (!room.npcs) return;
    const ctx  = this.ctx;
    const { cx, cy } = cam;
    for (const npc_def of room.npcs) {
      const wx = npc_def.col*TS + TS/2;
      const wy = npc_def.row*TS + TS;
      const dx = wx - cx, dy = wy - cy;
      const spr = CHARS[npc_def.npc_id] || CHARS.librarian;
      const img = this._imgs[spr.img];
      const dw = spr.dw || spr.sw, dh = spr.dh || spr.sh;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, spr.sx, spr.sy, spr.sw, spr.sh, dx - dw/2, dy - dh, dw, dh);
      } else {
        // Fallback: colored figure
        const npc = NPC_DEFS[npc_def.npc_id];
        ctx.fillStyle = npc ? npc.color : '#888';
        ctx.fillRect(dx-8, dy-30, 16, 30);
        ctx.fillStyle = '#e0c090';
        ctx.beginPath(); ctx.arc(dx, dy-34, 7, 0, Math.PI*2); ctx.fill();
      }

      // Name tag above the sprite
      const npc = NPC_DEFS[npc_def.npc_id];
      if (npc) {
        const npc_name = LANG.current === 'ko' && npc.name_ko ? npc.name_ko : npc.name_jp;
        ctx.fillStyle = 'rgba(20,16,10,0.75)';
        ctx.fillRect(dx-32, dy-dh-13, 64, 15);
        ctx.fillStyle = '#b8860b';
        ctx.font = `12px ${this.FONT_MONO}`;
        ctx.textAlign = 'center';
        ctx.fillText(npc_name, dx, dy-dh);
      }

      // Speech bubble
      if (npc_def.npc_id === 'librarian' && s.librarian.alert) {
        this._draw_bubble(s.librarian.alert, dx, dy - 38, ctx);
      } else if (npc_def.npc_id === 'librarian') {
        this._bubble_close_btn = null;
      }
    }
  }

  _draw_bubble(alert, bx, by, ctx) {
    const dl = DIALOGUE[alert.key];
    if (!dl) return;
    const text = LANG.current === 'ko' && dl.korean ? dl.korean : dl.japanese;
    const bw = 200, bh = 44;
    const px = Math.min(Math.max(bx - bw/2, 4), this.VP_W - bw - 4);
    const py = by - bh - 10;
    // Store X button rect in full screen coords for click detection
    const XS = 14;
    this._bubble_close_btn = { x: px + bw - XS - 4, y: py + 4 + this.VP_Y, w: XS, h: XS };
    ctx.fillStyle = 'rgba(250,248,240,0.97)';
    ctx.strokeStyle = '#5c3317';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(px, py, bw, bh, 6); ctx.fill(); ctx.stroke();
    // X button
    const xbx = px + bw - XS - 4, xby = py + 4;
    ctx.fillStyle = 'rgba(92,51,23,0.18)';
    ctx.beginPath(); ctx.roundRect(xbx, xby, XS, XS, 3); ctx.fill();
    ctx.strokeStyle = '#5c3317'; ctx.lineWidth = 1.5;
    const cx = xbx + XS/2, cy = xby + XS/2, d = 3.5;
    ctx.beginPath(); ctx.moveTo(cx-d,cy-d); ctx.lineTo(cx+d,cy+d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+d,cy-d); ctx.lineTo(cx-d,cy+d); ctx.stroke();
    ctx.fillStyle = '#1a1209';
    ctx.font = `12px ${this.FONT_JP}`;
    ctx.textAlign = 'center';
    ctx.fillText(text, px+bw/2, py+26, bw-24);
  }

  // ── Player sprite ─────────────────────────────────────────────────────────

  _draw_player(cam, s) {
    const ctx = this.ctx;
    const dx = s.px - cam.cx;
    const dy = s.py - cam.cy;
    const spr = CHARS.player;
    const img = this._imgs[spr.img];
    const dw = spr.dw || spr.sw, dh = spr.dh || spr.sh;
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, spr.sx, spr.sy, spr.sw, spr.sh, dx - dw/2, dy - dh, dw, dh);
    } else {
      // Fallback
      ctx.fillStyle = '#3a4a6c';
      ctx.fillRect(dx-7, dy-28, 14, 28);
      ctx.fillStyle = '#e0c090';
      ctx.beginPath(); ctx.arc(dx, dy-32, 8, 0, Math.PI*2); ctx.fill();
    }
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(dx, dy, 8, 3, 0, 0, Math.PI*2); ctx.fill();
  }

  // ── Sign hotspots (visual indicator on wall) ──────────────────────────────

  _draw_sign_hotspots(room, cam) {
    if (!room.signs) return;
    const ctx = this.ctx;
    const { cx, cy } = cam;
    const hx = this._hover_x ?? -9999;
    const hy = (this._hover_y ?? -9999) - this.VP_Y;
    let any_hov = false;
    let tooltip = null;
    this._sign_world_rects = {};

    const FONT_SZ = 12, LINE_H = 17, PAD_X = 8, PAD_Y = 5;

    for (const sg of room.signs) {
      const sign = SIGN_BY_ID[sg.sign_id];
      if (!sign) continue;

      const text = sign.japanese || sign.tokens.map(t => t.text).join('');
      const lines = text.split('\n');

      ctx.font = `${FONT_SZ}px ${this.FONT_JP}`;
      const max_line_w = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
      const sw = max_line_w + PAD_X * 2;
      const sh = lines.length * LINE_H + PAD_Y * 2 - (LINE_H - FONT_SZ);

      // World-space rect centred on the sign tile
      const wx_c   = sg.col * TS + TS / 2;
      const wy_top = sg.row * TS + 2;
      const wx_l   = wx_c - sw / 2;
      this._sign_world_rects[sg.sign_id] = { x: wx_l, y: wy_top, w: sw, h: sh };

      const sdx = wx_l - cx, sdy = wy_top - cy;
      const is_hov = hx >= sdx && hx <= sdx + sw && hy >= sdy && hy <= sdy + sh;
      if (is_hov) { any_hov = true; tooltip = { sdx, sdy, sw, sign }; }

      // Sign background
      ctx.fillStyle = sign.color || 'rgba(100,40,20,0.88)';
      ctx.beginPath(); ctx.roundRect(sdx, sdy, sw, sh, 3); ctx.fill();

      if (is_hov) {
        ctx.save();
        ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 2;
        ctx.shadowColor = '#b8860b'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.roundRect(sdx, sdy, sw, sh, 3); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = 'rgba(184,134,11,0.12)';
        ctx.beginPath(); ctx.roundRect(sdx, sdy, sw, sh, 3); ctx.fill();
      }

      // Sign text
      ctx.font = `${FONT_SZ}px ${this.FONT_JP}`;
      ctx.fillStyle = '#f5f0e8';
      ctx.textAlign = 'center';
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], sdx + sw / 2, sdy + PAD_Y + FONT_SZ + i * LINE_H);
      }
    }

    if (tooltip) {
      const { sdx, sdy, sw, sign } = tooltip;
      const label = sign.label_en || sign.label || sign.id;
      ctx.font = `12px ${this.FONT_MONO}`;
      const tw = ctx.measureText(label).width + 16;
      const th = 22;
      const tx = Math.max(2, Math.min(sdx + sw / 2 - tw / 2, this.VP_W - tw - 2));
      const ty = sdy - th - 4;
      ctx.fillStyle = 'rgba(20,16,10,0.92)';
      ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b8860b'; ctx.textAlign = 'left';
      ctx.fillText(label, tx + 8, ty + 15);
    }

    this.canvas.style.cursor = any_hov ? 'pointer' : '';
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  _draw_hud(s) {
    const ctx = this.ctx;
    const W = this.W, H = this.HUD_H;
    ctx.fillStyle = 'rgba(20,18,14,0.94)';
    ctx.fillRect(0, 0, W, H);

    const BAR_X=16, BAR_Y=14, BAR_W=200, BAR_H=16;
    ctx.fillStyle='#333'; ctx.fillRect(BAR_X,BAR_Y,BAR_W,BAR_H);
    const pct = s.juujitsukan/100;
    ctx.fillStyle = pct>0.6?'#2d6a4f':pct>0.3?'#b8860b':'#c0392b';
    ctx.fillRect(BAR_X, BAR_Y, Math.floor(BAR_W*pct), BAR_H);
    ctx.strokeStyle='#555'; ctx.lineWidth=1; ctx.strokeRect(BAR_X,BAR_Y,BAR_W,BAR_H);
    ctx.fillStyle='#f5f0e8'; ctx.font=`12px ${this.FONT_MONO}`;
    ctx.textAlign='left';
    ctx.fillText('充実感', BAR_X, BAR_Y-2);
    ctx.fillText(`${Math.round(s.juujitsukan)}`, BAR_X+BAR_W+6, BAR_Y+12);

    const room = ROOM_MAP_DATA[s.room];
    if (room) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#b8860b';
      ctx.font = `15px ${this.FONT_JP}`;
      ctx.fillText(LANG.current === 'ko' && room.name_ko ? room.name_ko : room.name_jp, W/2, 21);
      ctx.fillStyle = '#d4b890';
      ctx.font = `12px ${this.FONT_MONO}`;
      ctx.fillText(room.name_en.toUpperCase(), W/2, 40);
    }

    if (s.room==='library') {
      const gx = W-220;
      ctx.font=`12px ${this.FONT_MONO}`; ctx.textAlign='left';
      [{g:s.goals.study,t:'Read textbook',y:16},{g:s.goals.notes,t:'Take notes',y:34}].forEach(({g,t,y})=>{
        ctx.fillStyle = g.complete?'#2d6a4f':'#c8c0b0';
        ctx.fillText((g.complete?'✓ ':'○ ')+t, gx, y);
        if (!g.complete && g.progress>0) {
          ctx.fillStyle='#333'; ctx.fillRect(gx+98,y-10,90,3);
          ctx.fillStyle='#2d6a4f'; ctx.fillRect(gx+98,y-10,Math.floor(90*g.progress/100),3);
        }
      });
    }

    ctx.textAlign='right'; ctx.fillStyle='#aaa'; ctx.font=`12px ${this.FONT_MONO}`;
    ctx.fillText('WASD/arrows · click to move · E to interact', W-10, H-6);
  }

  // ── Action menu ───────────────────────────────────────────────────────────

  _draw_action_menu() {
    const menu = this.action_menu;
    if (!menu || !menu.items.length) return;
    const ctx = this.ctx;
    const ITEM_H=28, PAD=10, mw=200;
    const mh = menu.items.length*ITEM_H + PAD*2;
    const mx = Math.min(menu.x, this.W-mw-4);
    const my = Math.min(menu.y, this.H-this.WS_H-mh-4);

    ctx.fillStyle='rgba(0,0,0,0.35)';  ctx.fillRect(mx+3,my+3,mw,mh);
    ctx.fillStyle='rgba(28,22,14,0.97)'; ctx.strokeStyle='#8b6914'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(mx,my,mw,mh,6); ctx.fill(); ctx.stroke();

    menu.items.forEach((item,i)=>{
      const iy = my+PAD+i*ITEM_H;
      const ir = {x:mx+4,y:iy,w:mw-8,h:ITEM_H-2};
      menu._item_rects = menu._item_rects||[];
      menu._item_rects[i] = ir;
      const hov = this._pt_in(ir, this._hover_x||0, this._hover_y||0);
      if (hov){ctx.fillStyle='rgba(184,134,11,0.25)'; ctx.beginPath(); ctx.roundRect(ir.x,ir.y,ir.w,ir.h,4); ctx.fill();}
      ctx.fillStyle = hov?'#b8860b':'#f5f0e8';
      ctx.font=`13px ${this.FONT_MONO}`; ctx.textAlign='left';
      ctx.fillText(DIALOGUE.actions[item.label_key]||item.label_key, mx+PAD+8, iy+ITEM_H-8);
    });
  }

  // ── Floating notifications ────────────────────────────────────────────────

  _draw_notifications(cam, s) {
    const ctx = this.ctx;
    const dx = s.px - cam.cx, dy = s.py - cam.cy - 40;
    this.notifications.slice(-1).forEach(n=>{
      const alpha=Math.min(1,n.ttl/30);
      ctx.globalAlpha=alpha;
      ctx.fillStyle=n.type==='violation'?'#c0392b':n.type==='goal'?'#2d6a4f':'#888';
      ctx.font=`bold 12px ${this.FONT_MONO}`; ctx.textAlign='center';
      ctx.fillText(n.text, dx, dy-(1-n.ttl/180)*20);
    });
    ctx.globalAlpha=1;
  }

  // ── End screen ────────────────────────────────────────────────────────────

  _draw_end_screen(s) {
    const ctx=this.ctx;
    ctx.fillStyle='rgba(10,8,4,0.85)'; ctx.fillRect(0,0,this.W,this.H);
    const pw=420,ph=260,px=(this.W-pw)/2,py=(this.H-ph)/2;
    ctx.fillStyle='#1a1209'; ctx.strokeStyle='#b8860b'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    const high=s.juujitsukan>=60;
    const dl=high?DIALOGUE.session_end_high:DIALOGUE.session_end_low;
    ctx.fillStyle='#b8860b'; ctx.font=`26px ${this.FONT_JP}`; ctx.textAlign='center';
    ctx.fillText(LANG.current === 'ko' && dl.korean ? dl.korean : dl.japanese, px+pw/2, py+60);
    ctx.fillStyle='#f5f0e8'; ctx.font=`13px ${this.FONT_MONO}`;
    ctx.fillText(dl.english, px+pw/2, py+90);
    ctx.fillStyle=s.juujitsukan>60?'#2d6a4f':s.juujitsukan>30?'#b8860b':'#c0392b';
    ctx.font=`44px ${this.FONT_MONO}`;
    ctx.fillText(Math.round(s.juujitsukan), px+pw/2, py+160);
    const rb={x:px+pw/2-60,y:py+ph-46,w:120,h:30};
    this._end_btn=rb;
    const hov=this._pt_in(rb,this._hover_x||0,this._hover_y||0);
    ctx.fillStyle=hov?'#b8860b':'#333'; ctx.strokeStyle='#b8860b'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(rb.x,rb.y,rb.w,rb.h,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle=hov?'#1a1209':'#f5f0e8'; ctx.font=`13px ${this.FONT_MONO}`;
    ctx.fillText('Play again', rb.x+rb.w/2, rb.y+20);
  }

  // ── Atmosphere ────────────────────────────────────────────────────────────

  _draw_vignette() {
    const ctx = this.ctx;
    const cx = this.VP_W / 2, cy = this.VP_H / 2;
    const inner = Math.min(this.VP_W, this.VP_H) * 0.22;
    const outer = Math.max(this.VP_W, this.VP_H) * 0.82;
    const g = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.48)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.VP_W, this.VP_H);
  }

  _draw_room_tint(room_id) {
    const TINTS = {
      library:   'rgba(190,130, 40,0.055)',
      lobby:     'rgba(180,200,230,0.04)',
      play_area: 'rgba( 30,110, 10,0.05)',
      salon:     'rgba(170, 90,170,0.04)',
      outdoor:   'rgba( 60,150,220,0.06)',
      house:     'rgba(200,150, 80,0.07)',
    };
    const t = TINTS[room_id];
    if (!t) return;
    this.ctx.fillStyle = t;
    this.ctx.fillRect(0, 0, this.VP_W, this.VP_H);
  }

  // ── Reactions ─────────────────────────────────────────────────────────────

  _consume_reactions() {
    this.sim.reactions.splice(0).forEach(r=>{
      let text='', type=r.type;
      if (r.type==='violation') text=DIALOGUE.violations[r.key]||r.key;
      else if (r.type==='goal') text=DIALOGUE[r.key]?DIALOGUE[r.key].english:r.key;
      else if (r.type==='info' && r.key==='laptop_dead') text='Laptop battery died.', type='info';
      if (text){
        this.log_entries.unshift({text,type});
        if(this.log_entries.length>3) this.log_entries.pop();
        this.notifications.push({text,type,ttl:180,id:r.id});
      }
    });
    this.notifications=this.notifications.map(n=>({...n,ttl:n.ttl-1})).filter(n=>n.ttl>0);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _pt_in(r, x, y) { return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h; }

  // World-to-screen conversion (for interaction hit tests from Input2D)
  world_to_screen(wx, wy, cam) {
    return { x: wx - cam.cx, y: wy - cam.cy + this.VP_Y };
  }
}

function ctx_save_restore(ctx, fn) { ctx.save(); fn(); ctx.restore(); }

if (typeof module !== 'undefined') module.exports = { Renderer2D };
