// Top-down tile renderer.

class Renderer2D {
  constructor(canvas, sim) {
    this.canvas = canvas;
    this.sim    = sim;
    this.ctx    = canvas.getContext('2d');
    this._dpr   = window.devicePixelRatio || 1;
    this._imgs  = {};          // loaded Image objects keyed by SHEET key
    this._room_cache = null;   // last drawn room id
    this._known_words = null;  // cache of words the player has fully answered
    this.notifications = [];
    this.log_entries   = [];
    this.action_menu   = null;
    this.sign_panel    = null;
    this.lore_popup    = null;

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
    const panel_w = window._left_panel_w || 0;
    this.W = window.innerWidth - panel_w;
    this.H = window.innerHeight;
    this.canvas.width  = this.W * dpr;
    this.canvas.height = this.H * dpr;
    this.canvas.style.width  = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this.canvas.style.left   = panel_w ? panel_w + 'px' : '';
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
      infra3:    'art/tileset_infrastructure_3.png',
      toys:      'art/tileset_toys.png',
      buildings: 'art/tileset_buildings.png',
      houses:    'art/tileset_houses.png',
      signs:     'art/tileset_signs.png',
      signs2:    'art/tileset_signs_2.png',
      signs3:    'art/tileset_signs_3.png',
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
  // Single draw call for all sprite types.
  // Source size: tw/th (T16) or sw/sh (chars/trees), defaulting to 16 (all tilesets are 16×16 art).
  // Dest size: dw/dh from def, defaulting to TS (32px — always 2× upscale from 16px art).
  // DPR-snaps destination so tile edges land on physical pixels.

  _blit(def, dx, dy) {
    if (!def) return;
    const sw  = def.tw ?? def.sw ?? 16;
    const sh  = def.th ?? def.sh ?? 16;
    const dw  = def.dw ?? TS;
    const dh  = def.dh ?? TS;
    const img = this._imgs[def.img];
    const dpr = this._dpr;
    const fdx = Math.round(dx * dpr) / dpr;
    const fdy = Math.round(dy * dpr) / dpr;
    if (img && img.complete && img.naturalWidth > 0) {
      if (def.flipX || def.flipY) {
        this.ctx.save();
        this.ctx.translate(fdx + (def.flipX ? dw : 0), fdy + (def.flipY ? dh : 0));
        this.ctx.scale(def.flipX ? -1 : 1, def.flipY ? -1 : 1);
        this.ctx.drawImage(img, def.sx, def.sy, sw, sh, 0, 0, dw, dh);
        this.ctx.restore();
      } else {
        this.ctx.drawImage(img, def.sx, def.sy, sw, sh, fdx, fdy, dw, dh);
      }
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

  // Returns true if (col,row) is a sand-path tile
  _tile_is_sand(room, col, row) {
    if (col < 0 || row < 0 || col >= room.cols || row >= room.rows) return false;
    return room.tiles[row][col] === 'F_SAND';
  }

  // Pick the correct tile from the sand_path 9-patch based on which
  // cardinal neighbors are also sand — corners first, then edges, then center.
  _pick_sand_patch(patch, room, col, row) {
    const N = this._tile_is_sand(room, col,     row - 1);
    const S = this._tile_is_sand(room, col,     row + 1);
    const E = this._tile_is_sand(room, col + 1, row);
    const W = this._tile_is_sand(room, col - 1, row);
    if (!N && !W) return patch.TL;
    if (!N && !E) return patch.TR;
    if (!S && !W) return patch.BL;
    if (!S && !E) return patch.BR;
    if (!N)       return patch.TC;
    if (!S)       return patch.BC;
    if (!W)       return patch.ML;
    if (!E)       return patch.MR;
    return patch.MC;
  }

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
    if (room.floor === 'F_TATAMI') {
      if ((col + row) % 2 === 0) {
        this._draw_tile(this._tile_is_floor(room, col + 1, row) ? 'F_TATAMI' : 'F_TATAMI_C', dx, dy);
      } else {
        this._draw_tile(this._tile_is_floor(room, col - 1, row) ? 'F_TATAMI_B' : 'F_TATAMI_C', dx, dy);
      }
      return;
    }
    const variants = FLOOR_VARIANTS[room.floor];
    if (variants) {
      const h = (Math.imul(col ^ (col << 5), 0x9e3779b9) ^ Math.imul(row ^ (row << 7), 0x85ebca6b)) >>> 0;
      this._draw_tile(variants[h % variants.length], dx, dy);
    } else {
      this._draw_tile(room.floor, dx, dy);
    }
  }

  // Draw a white brightening overlay on the currently hovered tile/object/sign.
  _draw_hover_highlight(cam) {
    const h = this._hover_highlight;
    if (!h) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(h.wx - cam.cx, h.wy - cam.cy, h.ww, h.wh);
    ctx.restore();
  }

  // Draw a tree sprite at world pixel (wx,wy) — trees are taller than one tile.
  // wx,wy = bottom-center of tree trunk. Sprite drawn upward from that point.
  // ay: display pixels from sprite top to ground contact (bottom of last opaque row).
  //   Defaults to dh (sprite bottom), but tree sprites define ay to skip their
  //   transparent footer so the visible content aligns with the tile anchor.
  _draw_tree(spr, wx, wy, cam) {
    const dw = spr.dw ?? spr.sw;
    const dh = spr.dh ?? spr.sh;
    const ay = spr.ay ?? dh;
    const dx = wx - cam.cx - dw / 2;
    const dy = wy - cam.cy - ay;
    this._blit(spr, dx, dy);
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
      if (room.id === 'street') this._draw_road_markings(room, cam);
      this._draw_hover_highlight(cam);
      this._draw_objects(room, cam, s);
      this._draw_npcs(room, cam, s);
      this._draw_player(cam, s);
      this._flush_trees(cam);
      if (this._zipline_obj) this._draw_zipline_cable(cam);
      this._draw_sign_hotspots(room, cam);
    }

    this._draw_notifications(cam, s);

    // Per-room ambient tint (subtle mood colour)
    if (room) this._draw_room_tint(s.room);

    // Time-of-day darkness with localized streetlight illumination
    if (s.game_time) this._draw_night_lighting(s.game_time, s.room, cam, room);

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
    if (this.show_calendar) this._draw_calendar(s);
    if (this.lore_popup)    this._draw_lore_popup();
    if (this.action_menu)   this._draw_action_menu();
    if (s.session_ended)  this._draw_end_screen(s);
  }

  // ── Map tiles ─────────────────────────────────────────────────────────────

  _draw_map(room, cam) {
    const { cx, cy } = cam;
    this._tree_draws = [];   // collect tree draw calls; render after characters
    this._tree_room  = room; // needed by _flush_trees for southernmost-tile check
    const TREE_CODE = { TREE:'leafy_lg', TREE2:'pine', TREE3:'shrub' };
    const wall_patch = room.wall_patch ? NINE_PATCH[room.wall_patch] : null;
    const sand_patch = NINE_PATCH.sand_path;

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
            } else if (code === 'F_SAND') {
              this._draw_patch_tile(this._pick_sand_patch(sand_patch, room, col, row), dx, dy);
            } else {
              const tree_spr = TREE_SPRITES[TREE_CODE[code]];
              if (tree_spr) {
                // Only draw the sprite for the southernmost tile in a column of tree tiles.
                // Tiles above it are collision-only; the one sprite covers the full column.
                const code_below = (row + 1 < room.rows) ? room.tiles[row + 1]?.[col] : null;
                if (!code_below || !TREE_CODE[code_below]) {
                  // Cull on sprite bounds, not tile bounds — the tile dy check above is too
                  // tight for tall trees and causes the canopy to flicker at the viewport edge.
                  const spr_ay = tree_spr.ay ?? (tree_spr.dh ?? tree_spr.sh);
                  const spr_dh = tree_spr.dh ?? tree_spr.sh;
                  const spr_top = dy + TS - spr_ay;
                  const spr_bot = spr_top + spr_dh;
                  if (spr_bot > -TS && spr_top < this.VP_H + TS) {
                    this._tree_draws.push({ spr: tree_spr, wx: col*TS + TS/2, wy: (row+1)*TS, col, row });
                  }
                }
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

    // Tree sprites and deferred objects (streetlights, etc.)
    for (const item of this._tree_draws) {
      if (item.draw_fn) item.draw_fn();
      else this._draw_tree(item.spr, item.wx, item.wy, cam);
    }
    this._tree_draws = [];
  }

  // ── Interactive objects (library items on desk) ───────────────────────────

  _draw_objects(room, cam, s) {
    if (!room.objects) return;
    const ctx = this.ctx;
    const { cx, cy } = cam;
    this._zipline_obj = null;
    for (const obj of room.objects) {
      if (obj.id === 'zipline') {
        this._zipline_obj = obj;
        this._draw_zipline_posts(obj, cx, cy, ctx);
        continue;
      }
      if (obj.id === 'streetlight') {
        // Defer alongside houses so depth-sorting places lamp in front of house facades.
        const _obj = obj, _cx = cx, _cy = cy, _gt = s.game_time;
        this._tree_draws.push({
          wy: (obj.row + 1) * TS,
          wx: obj.col * TS + TS / 2,
          draw_fn: () => this._draw_streetlight(_obj, _cx, _cy, ctx, _gt),
        });
        continue;
      }
      if (obj.id === 'house_facade') {
        const spr = HOUSE_SPRITES[obj.sprite];
        if (spr) {
          const wx = (obj.col + 1) * TS;
          const wy = (obj.row + 1) * TS;
          this._tree_draws.push({ spr, wx, wy });
        }
        continue;
      }
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

  _draw_zipline_posts(obj, cx, cy, ctx) {
    const sdx = obj.col     * TS + TS/2 - cx;
    const sdy = obj.row     * TS + TS   - cy;
    const edx = obj.end_col * TS + TS/2 - cx;
    const edy = obj.end_row * TS + TS   - cy;
    const START_H = 64, END_H = 44;

    // Start post (tall — high end of zip)
    ctx.fillStyle = '#3a2410';
    ctx.fillRect(sdx - 5, sdy - START_H, 10, START_H);
    ctx.fillStyle = '#6a4420';
    ctx.fillRect(sdx - 14, sdy - START_H + 2, 11, 7);  // left bracket
    ctx.fillRect(sdx +  3, sdy - START_H + 2, 11, 7);  // right bracket
    ctx.fillStyle = '#b8960a';
    ctx.fillRect(sdx - 6, sdy - START_H - 3, 12, 5);   // gold cap

    // End post (shorter — low end)
    ctx.fillStyle = '#3a2410';
    ctx.fillRect(edx - 5, edy - END_H, 10, END_H);
    ctx.fillStyle = '#b8960a';
    ctx.fillRect(edx - 6, edy - END_H - 3, 12, 5);
  }

  // Cable and rider drawn after trees so the line appears overhead
  _draw_zipline_cable(cam) {
    const obj = this._zipline_obj;
    if (!obj) return;
    const ctx  = this.ctx;
    const { cx, cy } = cam;
    const s = this.sim.state;
    const START_H = 64, END_H = 44;

    const sdx = obj.col     * TS + TS/2 - cx;
    const sdy = obj.row     * TS + TS   - cy;
    const edx = obj.end_col * TS + TS/2 - cx;
    const edy = obj.end_row * TS + TS   - cy;

    const csy = sdy - START_H;  // cable y at start post
    const cey = edy - END_H;    // cable y at end post

    // Drop-shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(sdx, csy + 3); ctx.lineTo(edx, cey + 3); ctx.stroke();

    // Main cable
    ctx.strokeStyle = '#2a1e08';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sdx, csy); ctx.lineTo(edx, cey); ctx.stroke();

    // Highlight
    ctx.strokeStyle = '#7a6840';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sdx, csy - 1); ctx.lineTo(edx, cey - 1); ctx.stroke();

    // Find any NPC currently riding — drawn on the cable at their zipline_t progress
    const room = ROOM_MAP_DATA[s.room];
    const rider = room?.npcs?.find(n => s.npc_states?.[n.npc_id]?.activity === 'zipline_ride');
    if (!rider) return;

    const rst = s.npc_states[rider.npc_id];
    const t   = Math.min(rst.zipline_t, 1);
    const rx  = sdx + (edx - sdx) * t;
    const ry  = csy + (cey - csy) * t;
    const spr = CHARS[rider.npc_id] || CHARS.child_a;
    const dw  = spr.dw ?? TS;

    // Grip handle
    ctx.fillStyle = '#1a1010';
    ctx.fillRect(rx - 2, ry - 8, 4, 10);
    // Person sprite — head just below grip
    this._blit(spr, rx - dw / 2, ry - 8);
  }

  _draw_road_markings(room, cam) {
    const ctx = this.ctx;
    const { cx, cy } = cam;
    const rw = room.cols * TS;

    // Flat asphalt fill over rows 10-16 — replaces the textured tile floor
    ctx.save();
    ctx.fillStyle = '#787980';
    ctx.fillRect(-cx, 10 * TS - cy, rw, 7 * TS);
    ctx.restore();

    // Double yellow centre line at the lane boundary (rows 13/14)
    const CL_Y = 13 * TS - cy;
    ctx.save();
    ctx.fillStyle = 'rgba(240,200,40,0.9)';
    ctx.fillRect(-cx, CL_Y,           rw, 3);  // top line
    ctx.fillRect(-cx, CL_Y + TS - 3,  rw, 3);  // bottom line
    ctx.restore();

    // White dashed edge lines just inside the kerbs
    const TOP_Y = 10 * TS - cy;
    const BOT_Y = 16 * TS - cy;
    const DASH = TS * 3, GAP = TS * 2;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let col = 0; col < room.cols; col++) {
      if ((col * TS) % (DASH + GAP) < DASH) {
        const x = col * TS - cx;
        ctx.fillRect(x, TOP_Y + 4,        TS, 2);
        ctx.fillRect(x, BOT_Y + TS - 6,   TS, 2);
      }
    }
    ctx.restore();
  }

  _draw_streetlight(obj, cx, cy, ctx, gt) {
    const bx = obj.col * TS - cx + TS / 2;
    const by = obj.row * TS - cy + TS;
    const POLE_H = 80;
    const hour = gt ? gt.hour + gt.minute / 60 : 12;
    const isNight = hour >= 19 || hour < 6;
    const isDusk  = !isNight && (hour >= 17.5 || hour < 7);

    // Glow halo — drawn first so pole renders on top
    if (isNight || isDusk) {
      const glowAlpha = isNight ? 0.38 : 0.18;
      const gx = bx + 12, gy = by - POLE_H - 2;
      const grd = ctx.createRadialGradient(gx, gy, 3, gx, gy, 44);
      grd.addColorStop(0, `rgba(255,230,110,${glowAlpha})`);
      grd.addColorStop(1, 'rgba(255,230,110,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(gx, gy, 44, 0, Math.PI * 2);
      ctx.fill();
    }

    // Base plate
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(bx - 5, by - 5, 10, 5);
    // Pole
    ctx.fillStyle = '#2e2e3e';
    ctx.fillRect(bx - 3, by - POLE_H, 6, POLE_H - 5);
    // Horizontal arm
    ctx.fillRect(bx - 2, by - POLE_H + 2, 20, 4);
    // Lamp housing cap
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(bx + 12, by - POLE_H - 6, 16, 5);
    // Lamp glass
    ctx.fillStyle = isNight ? '#fff5a0' : (isDusk ? '#ffe88a' : '#d0c890');
    ctx.fillRect(bx + 12, by - POLE_H - 1, 16, 7);
    // Bottom reflector
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(bx + 10, by - POLE_H + 5, 20, 3);
  }

  _obj_color(id, s) {
    if (id==='laptop')   return s.laptop.on ? '#1a3a5c' : '#2a2a2a';
    if (id==='textbook') return '#2a4a6c';
    if (id==='phone')    return s.phone.on_call ? '#c0392b' : '#1a1a1a';
    if (id==='snack')    return s.snack.eaten ? '#555' : '#8b6914';
    if (id==='outlet')      return '#e0ddd5';
    if (id==='bed')         return s.bed?.sleeping ? '#7a9abf' : '#e8c898';
    if (id==='curry_pot')   return '#b05a1a';
    if (id==='rice_cooker') return '#c8c8c0';
    if (id==='ningyou')     return '#c0392b';
    if (id==='matryoshka')  return '#e67e22';
    if (id==='teddy_bear')  return '#8b6914';
    if (id==='board_game')  return '#1a3a5c';
    if (id==='toy_train')   return '#2d6a4f';
    if (id==='yoyo')        return '#8b3a1e';
    return '#888';
  }

  _obj_label(id, s) {
    if (id==='laptop')      return `💻${Math.round(s.laptop.battery)}%`;
    if (id==='textbook')    return `📖${Math.round(s.textbook.progress)}%`;
    if (id==='phone')       return '📱';
    if (id==='snack')       return s.snack.eaten ? '' : '🍘';
    if (id==='bed')         return s.bed?.sleeping ? '💤' : '🛏️';
    if (id==='outlet')      return '⚡';
    if (id==='curry_pot')   return '🍛';
    if (id==='rice_cooker') return '🍚';
    if (id==='ningyou')     return '🎎';
    if (id==='matryoshka')  return '🪆';
    if (id==='teddy_bear')  return '🧸';
    if (id==='board_game')  return '🎲';
    if (id==='toy_train')   return '🚂';
    if (id==='yoyo')        return '🪀';
    return (typeof ENTITY_DEFS !== 'undefined' && ENTITY_DEFS[id]?.icon) || '';
  }

  // ── NPC sprites ───────────────────────────────────────────────────────────

  _draw_npcs(room, cam, s) {
    const ctx  = this.ctx;
    const { cx, cy } = cam;
    this._npc_chat_btns = {};
    this._ambient_npc_rects = {};
    this._prop_rects = {};
    let _bubble_shown = false, _sb_shown = false;
    const all_npcs = [...(room.npcs || []), ...(s.extra_npcs || [])];
    for (const npc_def of all_npcs) {
      const npc_st = s.npc_states?.[npc_def.npc_id];
      if (npc_st?.activity === 'zipline_ride') continue; // drawn on the cable
      if (s.absent_room_npcs?.has(npc_def.npc_id)) continue;
      const wx = npc_st ? npc_st.px : (npc_def.col*TS + TS/2);
      const wy = npc_st ? npc_st.py : (npc_def.row*TS + TS);
      const dx = wx - cx, dy = wy - cy;
      const spr = CHARS[npc_def.npc_id] || CHARS.librarian;
      const img = this._imgs[spr.img];
      const dw = spr.dw ?? TS, dh = spr.dh ?? (TS * 2);
      const flip_spr = npc_st?.facing_left ? { ...spr, flipX: !spr.flipX } : spr;
      this._blit(flip_spr, dx - dw/2, dy - dh);
      if (!img || !img.complete || !img.naturalWidth) {
        // Fallback: colored figure
        const npc = NPC_DEFS[npc_def.npc_id];
        ctx.fillStyle = npc ? npc.color : '#888';
        ctx.fillRect(dx-8, dy-30, 16, 30);
        ctx.fillStyle = '#e0c090';
        ctx.beginPath(); ctx.arc(dx, dy-34, 7, 0, Math.PI*2); ctx.fill();
      }

      // Ambient visitors: show prop emoji + name bubble; advance conversation on click
      if (npc_def.ambient) {
        if (npc_def.prop) {
          ctx.save();
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(npc_def.prop, dx, dy - dh + 2);
          ctx.restore();
          this._prop_rects[npc_def.npc_id] = { x: dx - 14, y: this.VP_Y + dy - dh - 16, w: 28, h: 24 };
        }
        // Draw name chat-indicator bubble (same style as interactive NPCs)
        this._draw_chat_indicator(npc_def.npc_id, dx, dy - dh, ctx);
        // Store screen-space body rect — use dynamic position for roaming NPCs
        const dyn_col = npc_st ? Math.round((npc_st.px - TS/2) / TS) : npc_def.col;
        const dyn_row = npc_st ? Math.round((npc_st.py - TS) / TS)   : npc_def.row;
        this._ambient_npc_rects[npc_def.npc_id] = {
          wx, wy, col: dyn_col, row: dyn_row,
          sx: dx - dw/2, sy: this.VP_Y + dy - dh, sw: dw, sh: dh
        };
        // Show speech bubble when this NPC is the active conversation speaker
        const cb = s.convo_bubble;
        if (cb && cb.npc_id === npc_def.npc_id) {
          const text = (LANG.current === 'ko' ? cb.text_ko : cb.text_en) || cb.text_ko;
          if (typeof SpeechBubble !== 'undefined') {
            SpeechBubble.update({ text }, dx, dy - dh + this.VP_Y, { npc_id: cb.npc_id, text_en: cb.text_en });
            _bubble_shown = true; _sb_shown = true;
          }
        }
        continue;
      }

      // Chat bubble indicator (clickable to open dialogue)
      const _has_new = typeof DialoguePanel !== 'undefined' && DialoguePanel.hasFresh(npc_def.npc_id);
      this._draw_chat_indicator(npc_def.npc_id, dx, dy - dh, ctx, _has_new);

      // Speech bubble: rule violations (librarian only) or room closing (host NPC)
      const _alert = (s.room_alert?.npc_id === npc_def.npc_id) ? s.room_alert
                   : (npc_def.npc_id === 'librarian' && s.librarian.alert) ? s.librarian.alert
                   : null;
      if (_alert) {
        _bubble_shown = true;
        this._draw_bubble(_alert, dx, dy - dh, ctx);
      }
    }
    if (!_sb_shown && typeof SpeechBubble !== 'undefined') SpeechBubble.hide();
    if (!_bubble_shown) {
      this._bubble_close_btn = null;
    }
  }

  _draw_chat_indicator(npc_id, cx, headY, ctx, has_new = false) {
    const bw = 42, bh = 26, tail = 8, r = 9;

    ctx.save();
    const bx = cx - bw / 2;
    const by = headY - bh - tail - 4;

    // Hover check (hover coords are screen-space; bubble y is viewport-local → add VP_Y)
    const hx = this._hover_x, hy = this._hover_y;
    const hovered = hx != null && hy != null &&
      hx >= bx && hx <= bx + bw &&
      hy >= by + this.VP_Y && hy <= by + this.VP_Y + bh + tail + 4;

    const bg  = hovered ? 'rgba(255,250,232,1.0)' : 'rgba(250,248,240,0.93)';
    const str = hovered ? 'rgba(150,75,10,0.9)'   : 'rgba(80,45,15,0.4)';
    const lw  = hovered ? 1.8 : 1;

    if (hovered) { ctx.shadowColor = 'rgba(160,80,10,0.28)'; ctx.shadowBlur = 10; }

    // Bubble body
    ctx.fillStyle = bg; ctx.strokeStyle = str; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, r); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;

    // Tail fill (covers bubble bottom border line)
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(cx - 6, by + bh - 1);
    ctx.lineTo(cx, by + bh + tail);
    ctx.lineTo(cx + 6, by + bh - 1);
    ctx.closePath(); ctx.fill();
    // Tail stroke
    ctx.strokeStyle = str; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(cx - 6, by + bh);
    ctx.lineTo(cx, by + bh + tail);
    ctx.lineTo(cx + 6, by + bh);
    ctx.stroke();

    if (has_new) {
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#c0392b';
      ctx.fillText('!', cx, by + bh / 2);
    }

    ctx.restore();

    // Store clickable area in screen coords (viewport-local y → screen y)
    this._npc_chat_btns[npc_id] = { x: bx, y: by + this.VP_Y, w: bw, h: bh + tail + 4 };
  }

  _draw_bubble(alert, bx, by, ctx) {
    const dl = DIALOGUE[alert.key];
    if (!dl) return;
    const text = LANG.current === 'ko' && dl.korean ? dl.korean : dl.japanese;
    const dpr = this._dpr;
    const bw = 200, bh = 44, tail = 8, r = 8;
    const px = Math.round(Math.min(Math.max(bx - bw/2, 4), this.VP_W - bw - 4) * dpr) / dpr;
    const py = Math.round((by - bh - tail - 4) * dpr) / dpr;
    const bg = 'rgba(250,248,240,0.97)', str = 'rgba(80,45,15,0.4)';
    // Store X button rect in full screen coords for click detection
    const XS = 14;
    this._bubble_close_btn = { x: px + bw - XS - 4, y: py + 4 + this.VP_Y, w: XS, h: XS };
    ctx.save();
    ctx.fillStyle = bg; ctx.strokeStyle = str; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(px, py, bw, bh, r); ctx.fill(); ctx.stroke();
    // Tail fill
    const tx = Math.min(Math.max(bx, px + 10), px + bw - 10);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(tx - 6, py + bh - 1);
    ctx.lineTo(tx, py + bh + tail);
    ctx.lineTo(tx + 6, py + bh - 1);
    ctx.closePath(); ctx.fill();
    // Tail stroke
    ctx.strokeStyle = str; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx - 6, py + bh);
    ctx.lineTo(tx, py + bh + tail);
    ctx.lineTo(tx + 6, py + bh);
    ctx.stroke();
    // X button
    const xbx = px + bw - XS - 4, xby = py + 4;
    ctx.fillStyle = 'rgba(92,51,23,0.18)';
    ctx.beginPath(); ctx.roundRect(xbx, xby, XS, XS, 3); ctx.fill();
    ctx.strokeStyle = str; ctx.lineWidth = 1.5;
    const ccx = xbx + XS/2, ccy = xby + XS/2, d = 3.5;
    ctx.beginPath(); ctx.moveTo(ccx-d,ccy-d); ctx.lineTo(ccx+d,ccy+d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ccx+d,ccy-d); ctx.lineTo(ccx-d,ccy+d); ctx.stroke();
    ctx.fillStyle = '#1a1209';
    ctx.font = `12px ${this.FONT_JP}`;
    ctx.textAlign = 'center';
    ctx.fillText(text, px+bw/2, py+26, bw-24);
    ctx.restore();
  }

  // ── Player sprite ─────────────────────────────────────────────────────────

  _draw_player(cam, s) {
    const ctx = this.ctx;
    const dx = s.px - cam.cx;
    const dy = s.py - cam.cy;
    const spr = CHARS.player;
    const img = this._imgs[spr.img];
    const dw = spr.dw ?? TS, dh = spr.dh ?? (TS * 2);
    this._blit(spr, dx - dw/2, dy - dh);
    if (!img || !img.complete || !img.naturalWidth) {
      // Fallback
      ctx.fillStyle = '#3a4a6c';
      ctx.fillRect(dx-7, dy-28, 14, 28);
      ctx.fillStyle = '#e0c090';
      ctx.beginPath(); ctx.arc(dx, dy-32, 8, 0, Math.PI*2); ctx.fill();
    }
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(dx, dy, 8, 3, 0, 0, Math.PI*2); ctx.fill();
    // Sleep indicator
    if (s.bed?.sleeping) {
      ctx.font = `16px ${this.FONT_JP}`;
      ctx.textAlign = 'center';
      ctx.fillText('💤', dx, dy - dh - 4);
    }
  }

  // ── Sign hotspots (visual indicator on wall) ──────────────────────────────

  _draw_sign_hotspots(room, cam) {
    if (!room.signs) return;
    const ctx = this.ctx;
    const { cx, cy } = cam;
    const hx = this._hover_x ?? -9999;
    const hy = (this._hover_y ?? -9999) - this.VP_Y;
    let any_hov = false;
    this._sign_world_rects = {};

    const FONT_SZ = 15, LINE_H = 22, PAD_X = 12, PAD_Y = 7;

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
      if (is_hov) { any_hov = true; }

      const yo = 0;

      // Mounting posts (drawn first, behind everything)
      const POST_W = 6, POST_H = 20;
      const post_y = sdy + yo + sh;
      ctx.fillStyle = '#3a2a18';
      if (sw > 80) {
        ctx.fillRect(sdx + sw * 0.25 - POST_W / 2, post_y, POST_W, POST_H);
        ctx.fillRect(sdx + sw * 0.75 - POST_W / 2, post_y, POST_W, POST_H);
        ctx.fillRect(sdx + sw * 0.25 - POST_W * 1.5, post_y + POST_H - 3, POST_W * 3, 3);
        ctx.fillRect(sdx + sw * 0.75 - POST_W * 1.5, post_y + POST_H - 3, POST_W * 3, 3);
      } else {
        ctx.fillRect(sdx + sw / 2 - POST_W / 2, post_y, POST_W, POST_H);
        ctx.fillRect(sdx + sw / 2 - POST_W * 1.5, post_y + POST_H - 3, POST_W * 3, 3);
      }

      // Sign panel: one flat colour with a drop shadow for depth
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.38)';
      ctx.shadowBlur = 9;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = sign.color || '#5a3a1a';
      ctx.beginPath(); ctx.roundRect(sdx, sdy + yo, sw, sh, 3); ctx.fill();
      ctx.restore();

      // Subtle inner highlight edge
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(sdx + 0.5, sdy + yo + 0.5, sw - 1, sh - 1, 2.5); ctx.stroke();

      if (is_hov) {
        ctx.save();
        ctx.strokeStyle = '#c89a1a'; ctx.lineWidth = 2;
        ctx.shadowColor = '#b8860b'; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.roundRect(sdx - 4, sdy + yo - 4, sw + 8, sh + 8, 5); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = 'rgba(184,134,11,0.12)';
        ctx.beginPath(); ctx.roundRect(sdx - 4, sdy + yo - 4, sw + 8, sh + 8, 5); ctx.fill();
      }

      // Sign text — per-token colouring to match the workspace panel
      ctx.font = `${FONT_SZ}px ${this.FONT_JP}`;
      ctx.textAlign = 'left';

      // Build a char→token-index map over the full text
      const tokens = sign.tokens || [];
      const prog = (typeof WORD_PROGRESS !== 'undefined') ? WORD_PROGRESS.getSign(sign.id) : {};
      const char_tok = new Int32Array(text.length).fill(-1);
      let sp = 0;
      for (let ti = 0; ti < tokens.length; ti++) {
        const tt = tokens[ti].text;
        const fi = text.indexOf(tt, sp);
        if (fi !== -1) { char_tok.fill(ti, fi, fi + tt.length); sp = fi + tt.length; }
      }

      // Helper: colour for a given token index
      const tok_col = ti => {
        if (ti < 0) return '#f5f0e8';
        const tok = tokens[ti];
        const hp = tok.parts && tok.parts.length > 0;
        const ro = hp ? tok.parts.every((_,pi) => (prog[`${ti}p${pi}`]||{}).romaji)
                      : !!(prog[ti]||{}).romaji;
        const me = hp ? tok.parts.every((_,pi) => (prog[`${ti}p${pi}`]||{}).meaning)
                      : !!(prog[ti]||{}).meaning;
        if (ro && me) return '#52c98e'; // fully done — jade
        if (ro)       return '#c8981a'; // reading done — gold
        return '#f5f0e8';              // untouched — default
      };

      // Draw each line as coloured segments
      let char_off = 0;
      for (let li = 0; li < lines.length; li++) {
        const ln = lines[li];
        const lw = ctx.measureText(ln).width;
        let x = sdx + (sw - lw) / 2; // centre the line
        const y = sdy + yo + PAD_Y + FONT_SZ + li * LINE_H;

        // Collect runs of consecutive same-token characters
        let i = 0;
        while (i < ln.length) {
          const cur_ti = char_tok[char_off + i];
          let j = i + 1;
          while (j < ln.length && char_tok[char_off + j] === cur_ti) j++;
          const seg = ln.slice(i, j);
          ctx.fillStyle = tok_col(cur_ti);
          ctx.fillText(seg, x, y);
          x += ctx.measureText(seg).width;
          i = j;
        }
        char_off += ln.length + 1; // +1 for '\n'
      }
      ctx.textAlign = 'center'; // restore default
    }

  }


  // ── HUD ───────────────────────────────────────────────────────────────────

  _draw_lore_popup() {
    const ctx  = this.ctx;
    const p    = this.lore_popup;
    const fade = Math.min(1, p.ttl / 40);
    ctx.globalAlpha = fade;

    const pw = 500, ph = 64;
    const px = (this.W - pw) / 2;
    const py = this.H - this.WS_H - ph - 14;

    ctx.fillStyle = 'rgba(15,12,8,0.95)';
    ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill();
    ctx.strokeStyle = '#4a3010'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f5f0e8';
    ctx.font = `13px ${this.FONT_MONO}`;
    ctx.fillText(p.l1, px + pw / 2, py + 22);
    ctx.fillStyle = '#999';
    ctx.font = `11px ${this.FONT_MONO}`;
    ctx.fillText(p.l2, px + pw / 2, py + 44);

    ctx.globalAlpha = 1;
    p.ttl--;
    if (p.ttl <= 0) this.lore_popup = null;
  }

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
    const _jlabel = LANG.current === 'ko' ? '충실감' : '充実感';
    ctx.fillText(_jlabel, BAR_X, BAR_Y-2);
    ctx.fillText(`${Math.round(s.juujitsukan)}`, BAR_X+BAR_W+6, BAR_Y+12);
    const _jlw = ctx.measureText(_jlabel).width;
    this._juujitsukan_btn = {x: BAR_X-2, y: BAR_Y-13, w: _jlw+4, h: 13, text: _jlabel, en: 'fulfillment'};

    const room = ROOM_MAP_DATA[s.room];
    if (room) {
      const room_text = LANG.current === 'ko' && room.name_ko ? room.name_ko : room.name_jp;
      this._hud_room_btn = {x:W/2-75,y:4,w:150,h:26,text:room_text,en:room.name_en};
      const rhov = this._pt_in(this._hud_room_btn, this._hover_x||0, this._hover_y||0);
      ctx.textAlign = 'center';
      ctx.fillStyle = rhov ? '#d4a010' : '#b8860b';
      ctx.font = `15px ${this.FONT_JP}`;
      ctx.fillText(room_text, W/2, 21);
      ctx.fillStyle = '#d4b890';
      ctx.font = `12px ${this.FONT_MONO}`;
      ctx.fillText(room.name_en.toUpperCase(), W/2, 40);
    } else {
      this._hud_room_btn = null;
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

    // Time-of-day widget (top-right; click to toggle calendar)
    if (s.game_time) this._draw_time_widget(s.game_time, W);

  }

  // ── Time-of-day widget ────────────────────────────────────────────────────

  _draw_time_widget(gt, W) {
    const ctx = this.ctx;
    const PW = 100, PH = 46, px = W - PW - 4, py = 3;

    // Panel
    ctx.fillStyle = 'rgba(22,16,8,0.82)';
    ctx.beginPath(); ctx.roundRect(px, py, PW, PH, 5); ctx.fill();
    ctx.strokeStyle = 'rgba(160,120,20,0.55)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, PW, PH, 5); ctx.stroke();

    // Time  (12-hour)
    const h12 = gt.hour % 12 || 12;
    const mm  = String(gt.minute).padStart(2, '0');
    const ampm = gt.hour < 12 ? 'AM' : 'PM';
    ctx.textAlign = 'left'; ctx.fillStyle = '#f5f0e8';
    ctx.font = `bold 14px ${this.FONT_MONO}`;
    ctx.fillText(`${h12}:${mm}`, px + 8, py + 15);
    ctx.fillStyle = '#b8860b'; ctx.font = `9px ${this.FONT_MONO}`;
    ctx.fillText(ampm, px + 8 + 44, py + 15);

    // Date + day-of-week
    const DOW_JP      = ['日','月','火','水','木','金','土'];
    const DOW_KO      = ['일','월','화','수','목','금','토'];
    const DOW_JP_FULL = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];
    const DOW_KO_FULL = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
    const DOW_EN      = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dow = new Date(gt.year, gt.month-1, gt.day).getDay();
    const dowStr = LANG.current === 'ko' ? DOW_KO[dow] : DOW_JP[dow];
    const dowFull = LANG.current === 'ko' ? DOW_KO_FULL[dow] : DOW_JP_FULL[dow];
    ctx.fillStyle = this._get_known().has(dowFull) ? '#52c98e' : '#c8b080';
    ctx.font = `10px ${this.FONT_MONO}`;
    ctx.fillText(`${dowStr} · ${gt.month}/${gt.day}`, px + 8, py + 28);
    this._time_dow_btn = {x: px+6, y: py+17, w: PW-12, h: 13,
      text: LANG.current==='ko' ? DOW_KO_FULL[dow] : DOW_JP_FULL[dow], en: DOW_EN[dow]};

    // Sun / moon track
    const TX = px + 8, TY = py + 40, TW = PW - 16;
    const t = gt.hour + gt.minute / 60;
    const DAY_START = 6, DAY_END = 20;
    const isDay = t >= DAY_START && t < DAY_END;

    // Dim track
    ctx.strokeStyle = 'rgba(180,150,80,0.22)'; ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(TX, TY); ctx.lineTo(TX + TW, TY); ctx.stroke();

    // Dawn/dusk tick marks
    ctx.strokeStyle = 'rgba(180,120,30,0.4)'; ctx.lineWidth = 1;
    [TX, TX + TW].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, TY - 3); ctx.lineTo(x, TY + 3); ctx.stroke();
    });

    if (isDay) {
      const prog = (t - DAY_START) / (DAY_END - DAY_START);
      const sx   = TX + prog * TW;
      // Elapsed track glow
      ctx.strokeStyle = 'rgba(240,190,50,0.45)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(TX, TY); ctx.lineTo(sx, TY); ctx.stroke();
      // Glow halo
      ctx.fillStyle = 'rgba(245,200,60,0.18)';
      ctx.beginPath(); ctx.arc(sx, TY, 9, 0, Math.PI * 2); ctx.fill();
      // Sun disc
      ctx.fillStyle = '#f5c840';
      ctx.beginPath(); ctx.arc(sx, TY, 5, 0, Math.PI * 2); ctx.fill();
    } else {
      const nightLen = 24 - DAY_END + DAY_START;
      const nt  = t >= DAY_END ? t - DAY_END : t + (24 - DAY_END);
      const mx  = TX + (nt / nightLen) * TW;
      // Moon (crescent via clipping)
      ctx.fillStyle = '#ccd6e8';
      ctx.beginPath(); ctx.arc(mx, TY, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(22,16,8,0.95)';
      ctx.beginPath(); ctx.arc(mx + 2, TY - 1, 3, 0, Math.PI * 2); ctx.fill();
    }

    ctx.lineCap = 'butt';
    this._clock_rect = { x: px, y: py, w: PW, h: PH };
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
    const ko = typeof LANG !== 'undefined' && LANG.current === 'ko';
    this._notif_btn = null;
    this.notifications.slice(-1).forEach(n=>{
      const alpha=Math.min(1,n.ttl/30);
      ctx.globalAlpha=alpha;
      ctx.fillStyle=n.type==='violation'?'#c0392b':n.type==='goal'?'#2d6a4f':'#888';
      ctx.font=`bold 12px ${this.FONT_MONO}`; ctx.textAlign='center';
      const drift=(1-n.ttl/180)*20;
      ctx.fillText(n.text, dx, dy-drift);
      if (ko && n.type !== 'violation') {
        const tw=ctx.measureText(n.text).width;
        this._notif_btn={x:dx-tw/2-4, y:this.VP_Y+dy-drift-14, w:tw+8, h:18, text:n.text};
      }
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
    const msg=LANG.current==='ko'&&dl.korean?dl.korean:dl.japanese;
    const mrect={x:px+10,y:py+33,w:pw-20,h:38};
    this._end_msg_btn={...mrect,text:msg,en:dl.english};
    const mhov=this._pt_in(mrect,this._hover_x||0,this._hover_y||0);
    ctx.fillStyle=mhov?'#d4a010':'#b8860b'; ctx.font=`26px ${this.FONT_JP}`; ctx.textAlign='center';
    ctx.fillText(msg, px+pw/2, py+60);
    if(mhov){const tw=ctx.measureText(msg).width;ctx.fillRect(px+pw/2-tw/2,py+64,tw,1.5);}
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
      library:      'rgba(190,130, 40,0.055)',
      lobby:        'rgba(180,200,230,0.04)',
      play_area:    'rgba( 30,110, 10,0.05)',
      salon:        'rgba(170, 90,170,0.04)',
      outdoor:      'rgba( 60,150,220,0.06)',
      street:       'rgba( 50,130,200,0.05)',
      house:        'rgba(200,150, 80,0.07)',
      gallery:      'rgba(200,170, 90,0.06)',
      cooking_room: 'rgba(220,100, 40,0.06)',
    };
    const t = TINTS[room_id];
    if (!t) return;
    this.ctx.fillStyle = t;
    this.ctx.fillRect(0, 0, this.VP_W, this.VP_H);
  }

  // ── Night lighting with streetlight pools ────────────────────────────────

  _sky_rgba(gt, room_id) {
    const t = gt.hour + gt.minute / 60;
    const KF = [
      [ 0,   5,  8, 40, 0.65],
      [ 5,   5,  8, 40, 0.65],
      [ 6,  255, 80, 10, 0.35],
      [ 7.5, 255,180, 60, 0.10],
      [ 9,   0,  0,  0, 0.00],
      [16,   0,  0,  0, 0.00],
      [17.5, 255, 80, 10, 0.28],
      [19,  80,  20,100, 0.45],
      [21,   5,  8, 40, 0.65],
      [24,   5,  8, 40, 0.65],
    ];
    let i = 0;
    while (i < KF.length - 2 && KF[i + 1][0] <= t) i++;
    const [t0,r0,g0,b0,a0] = KF[i];
    const [t1,r1,g1,b1,a1] = KF[i + 1];
    const f = t1 > t0 ? (t - t0) / (t1 - t0) : 0;
    const r = Math.round(r0 + f * (r1 - r0));
    const g = Math.round(g0 + f * (g1 - g0));
    const b = Math.round(b0 + f * (b1 - b0));
    const isOutdoor = room_id === 'outdoor' || room_id === 'street';
    const a = (a0 + f * (a1 - a0)) * (isOutdoor ? 1.0 : 0.45);
    return { r, g, b, a };
  }

  _draw_night_lighting(gt, room_id, cam, room) {
    const { r, g, b, a } = this._sky_rgba(gt, room_id);
    if (a < 0.005) return;

    const lights = (room?.objects || []).filter(o => o.id === 'streetlight');

    // Rooms without streetlights: flat sky overlay
    if (!lights.length) {
      this.ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
      this.ctx.fillRect(0, 0, this.VP_W, this.VP_H);
      return;
    }

    // Build / resize the offscreen darkness canvas
    const LW = this.VP_W, LH = this.VP_H;
    if (!this._lc || this._lc.width !== LW || this._lc.height !== LH) {
      this._lc   = Object.assign(document.createElement('canvas'), { width: LW, height: LH });
      this._lctx = this._lc.getContext('2d');
    }
    const lctx = this._lctx;

    // Reset then fill darkness (clearRect needed so dest-out holes don't accumulate)
    lctx.clearRect(0, 0, LW, LH);
    lctx.globalCompositeOperation = 'source-over';
    lctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
    lctx.fillRect(0, 0, LW, LH);

    // Punch a transparent light pool at each lamp
    lctx.globalCompositeOperation = 'destination-out';
    const POLE_H = 80;
    const LIGHT_R = 220; // radius in CSS px

    for (const obj of lights) {
      // Lamp-head world position → viewport-space position
      const lx = (obj.col * TS + TS / 2 + 12) - cam.cx;
      const ly = (obj.row * TS + TS - POLE_H - 2) - cam.cy;

      lctx.save();
      // Translate center to a point between lamp head and ground so the cone
      // is wider at ground level than directly above.
      lctx.translate(lx, ly + LIGHT_R * 0.28);
      lctx.scale(1, 1.6); // taller ellipse → teardrop cone shape

      const grad = lctx.createRadialGradient(0, 0, 8, 0, 0, LIGHT_R);
      grad.addColorStop(0,    'rgba(0,0,0,1.00)');
      grad.addColorStop(0.25, 'rgba(0,0,0,0.92)');
      grad.addColorStop(0.55, 'rgba(0,0,0,0.55)');
      grad.addColorStop(0.80, 'rgba(0,0,0,0.18)');
      grad.addColorStop(1,    'rgba(0,0,0,0.00)');
      lctx.fillStyle = grad;
      lctx.beginPath(); lctx.arc(0, 0, LIGHT_R, 0, Math.PI * 2); lctx.fill();
      lctx.restore();
    }

    // Composite the darkness-with-holes onto the main canvas
    const ctx = this.ctx;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this._lc, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.restore();

    // Warm amber glow inside each lit cone (lamp colour tint)
    const warmBase = Math.min(a * 0.3, 0.18);
    if (warmBase < 0.005) return;
    const WARM_R = LIGHT_R * 0.85;

    for (const obj of lights) {
      const lx = (obj.col * TS + TS / 2 + 12) - cam.cx;
      const ly = (obj.row * TS + TS - POLE_H - 2) - cam.cy;

      ctx.save();
      ctx.translate(lx, ly + WARM_R * 0.28);
      ctx.scale(1, 1.6);

      const wg = ctx.createRadialGradient(0, 0, 0, 0, 0, WARM_R);
      wg.addColorStop(0,   `rgba(255,210,80,${(warmBase * 2.2).toFixed(3)})`);
      wg.addColorStop(0.4, `rgba(255,170,40,${warmBase.toFixed(3)})`);
      wg.addColorStop(1,   'rgba(255,120,0,0)');
      ctx.fillStyle = wg;
      ctx.beginPath(); ctx.arc(0, 0, WARM_R, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // ── Sky overlay (time of day) — used by rooms without streetlights ──────────

  _draw_sky_overlay(gt, room_id) {
    const { r, g, b, a } = this._sky_rgba(gt, room_id);
    if (a < 0.005) return;
    this.ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
    this.ctx.fillRect(0, 0, this.VP_W, this.VP_H);
  }

  // ── Calendar popup ────────────────────────────────────────────────────────

  _draw_calendar(s) {
    const ctx = this.ctx;
    const gt  = s.game_time;
    const CW=34, CH=28, PAD=14;
    const COLS=7, HEADER=44;
    const panelW = COLS*CW + PAD*2;
    const rows   = Math.ceil((new Date(gt.year,gt.month-1,1).getDay() + new Date(gt.year,gt.month,0).getDate()) / 7);
    const panelH = HEADER + rows*CH + PAD*2;
    const px = Math.round(this.W/2 - panelW/2);
    const py = Math.round((this.VP_Y + this.VP_H)/2 - panelH/2) + this.VP_Y;

    // Panel background
    ctx.fillStyle='rgba(20,16,10,0.92)';
    ctx.beginPath(); ctx.roundRect(px-1,py-1,panelW+2,panelH+2,8); ctx.fill();
    ctx.strokeStyle='#8b6914'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(px,py,panelW,panelH,7); ctx.stroke();

    // Month/year header
    const MONTH_JP=['','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const MONTH_KO=['','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    const MONTH_EN=['','January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthText = LANG.current==='ko' ? MONTH_KO[gt.month] : MONTH_JP[gt.month];
    const label = monthText + ' ' + gt.year;
    ctx.textAlign='center'; ctx.fillStyle='#f5f0e8'; ctx.font=`bold 15px ${this.FONT_JP}`;
    ctx.fillText(label, px+panelW/2, py+PAD+13);
    this._cal_month_btn = {x: px+20, y: py+4, w: panelW-40, h: PAD+18, text: monthText, en: MONTH_EN[gt.month]};

    // X close button (top-right)
    const XS=16, xbx=px+panelW-XS-6, xby=py+6;
    this._calendar_close_btn = { x: xbx, y: xby+this.VP_Y, w: XS, h: XS };
    ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.strokeStyle='#8b6914'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(xbx,xby,XS,XS,3); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#c0a060'; ctx.lineWidth=1.5;
    const xm=xbx+XS/2, ym=xby+XS/2, d=3.5;
    ctx.beginPath(); ctx.moveTo(xm-d,ym-d); ctx.lineTo(xm+d,ym+d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xm+d,ym-d); ctx.lineTo(xm-d,ym+d); ctx.stroke();

    // Day-of-week headers (Sun first, matching Japan)
    const CAL_DOW_JP      = ['日','月','火','水','木','金','土'];
    const CAL_DOW_KO      = ['일','월','화','수','목','금','토'];
    const CAL_DOW_JP_FULL = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];
    const CAL_DOW_KO_FULL = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
    const CAL_DOW_EN      = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const DOW = LANG.current==='ko' ? CAL_DOW_KO : CAL_DOW_JP;
    const DOW_FULL = LANG.current==='ko' ? CAL_DOW_KO_FULL : CAL_DOW_JP_FULL;
    ctx.font=`11px ${this.FONT_JP}`; ctx.textAlign='center';
    this._cal_dow_btns = [];
    const _cal_known = this._get_known();
    for (let d=0;d<7;d++) {
      const _dow_known = _cal_known.has(DOW_FULL[d]);
      ctx.fillStyle = _dow_known ? '#52c98e' : (d===0?'#c0392b':d===6?'#2255aa':'#a09070');
      ctx.fillText(DOW[d], px+PAD+d*CW+CW/2, py+HEADER);
      this._cal_dow_btns[d] = {x: px+PAD+d*CW+2, y: py+HEADER-14, w: CW-4, h: 18, text: DOW_FULL[d], en: CAL_DOW_EN[d]};
    }

    // Collect birthday dates for this month
    const bdays = {};
    if (typeof NPC_DEFS !== 'undefined') {
      for (const [,npc] of Object.entries(NPC_DEFS)) {
        if (npc.birthday && npc.birthday.month === gt.month) {
          if (!bdays[npc.birthday.day]) bdays[npc.birthday.day] = [];
          bdays[npc.birthday.day].push(npc.color);
        }
      }
    }

    // Day cells
    const startDow = new Date(gt.year, gt.month-1, 1).getDay();
    const daysInMonth = new Date(gt.year, gt.month, 0).getDate();
    this._cal_day_btns = [];
    for (let day=1; day<=daysInMonth; day++) {
      const slot  = startDow + day - 1;
      const col   = slot % 7;
      const row   = Math.floor(slot / 7);
      const cx_   = px + PAD + col*CW + CW/2;
      const cy_   = py + HEADER + PAD + row*CH + CH/2;
      const isToday = day===gt.day;
      const dayText = LANG.current==='ko' ? `${MONTH_KO[gt.month]}${day}일` : `${MONTH_JP[gt.month]}${day}日`;
      const dayEn   = `${MONTH_EN[gt.month]} ${day}`;
      this._cal_day_btns[day] = {x: cx_-CW/2+2, y: cy_-CH/2+1, w: CW-4, h: CH-2, text: dayText, en: dayEn};

      if (isToday) {
        ctx.fillStyle='rgba(184,134,11,0.30)';
        ctx.beginPath(); ctx.roundRect(cx_-CW/2+2, cy_-CH/2+1, CW-4, CH-2, 4); ctx.fill();
      }

      ctx.textAlign='center';
      ctx.font = `${isToday?'bold ':' '}12px ${this.FONT_MONO}`;
      ctx.fillStyle = col===0?'#e06050':col===6?'#4477cc':(isToday?'#f5d060':'#d4c8b0');
      ctx.fillText(String(day), cx_, cy_+4);

      // Birthday dots below the number
      const dots = bdays[day];
      if (dots) {
        dots.forEach((col_, di) => {
          ctx.fillStyle = col_;
          ctx.beginPath();
          ctx.arc(cx_ + (di-(dots.length-1)/2)*5, cy_+10, 2.5, 0, Math.PI*2);
          ctx.fill();
        });
      }
    }
  }

  // ── Reactions ─────────────────────────────────────────────────────────────

  _consume_reactions() {
    const ko = typeof LANG !== 'undefined' && LANG.current === 'ko';
    this.sim.reactions.splice(0).forEach(r=>{
      let text='', type=r.type;
      if (r.type==='violation') text=DIALOGUE.violations[r.key]||r.key;
      else if (r.type==='goal') {
        const d=DIALOGUE[r.key]; text=d?(ko&&d.korean?d.korean:d.english):r.key;
      }
      else if (r.type==='info') {
        if (r.key==='laptop_dead')  text=ko?'배터리가 방전되었습니다.':'Laptop battery died.';
        if (r.key==='go_to_sleep')  text=ko?'💤 잠들었어요...':'💤 Falling asleep...';
        if (r.key==='wake_up')      text=ko?'☀️ 일어났어요!':'☀️ Feeling refreshed!';
        // closing/room events are handled as NPC speech bubbles, not log entries
      }
      if (text){
        this.log_entries.unshift({text,type});
        if(this.log_entries.length>3) this.log_entries.pop();
        this.notifications.push({text,type,ttl:180,id:r.id});
      }
    });
    this.notifications=this.notifications.map(n=>({...n,ttl:n.ttl-1})).filter(n=>n.ttl>0);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _get_known() {
    if (!this._known_words && typeof _build_known_words !== 'undefined')
      this._known_words = _build_known_words();
    return this._known_words || new Set();
  }

  _pt_in(r, x, y) { return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h; }

  // World-to-screen conversion (for interaction hit tests from Input2D)
  world_to_screen(wx, wy, cam) {
    return { x: wx - cam.cx, y: wy - cam.cy + this.VP_Y };
  }
}

function ctx_save_restore(ctx, fn) { ctx.save(); fn(); ctx.restore(); }

if (typeof module !== 'undefined') module.exports = { Renderer2D };
