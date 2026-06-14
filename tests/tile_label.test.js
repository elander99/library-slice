// TDD: tile_label_for — resolves a map tile code + room default floor to a TILE_DEFS entry.
//
// Contract:
//   tile_label_for(tile_code, room_floor) → TILE_DEFS entry | null
//
//   tile_code === '' means "default floor for this room" — resolves via room_floor.
//   tile_code === null/undefined → null (nothing clicked).
//   Unknown tile code (no TILE_DEF entry) → null.
//
// This powers the "click anything to see what it is" feature: the tile click
// handler passes room.tiles[tr][tc] and room.floor; this function resolves
// the label so ObjectDescPopup can show it.

const { tile_label_for, TILE_DEFS } = require('../content/entities.js');

// ── Street room (floor = F_GRASS, road lanes = F_ROAD, sidewalk = F_STONE) ──────

describe('tile_label_for: street room tiles', () => {
  test('F_ROAD tile returns Road label', () => {
    const def = tile_label_for('F_ROAD', 'F_GRASS');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('road');
    expect(def.label_ko).toBeTruthy();
  });

  test('F_STONE tile returns Sidewalk label', () => {
    const def = tile_label_for('F_STONE', 'F_GRASS');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('sidewalk');
  });

  test('road curb top has a label', () => {
    const def = tile_label_for('F_ROAD_CURB_T', 'F_STONE');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
    expect(def.label_ko).toBeTruthy();
  });

  test('road curb bottom has a label', () => {
    const def = tile_label_for('F_ROAD_CURB_B', 'F_STONE');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });
});

// ── Outdoor / play area (floor = F_GRASS) ────────────────────────────────────

describe('tile_label_for: outdoor tiles', () => {
  test('grass floor (empty tile in F_GRASS room) returns Grass label', () => {
    const def = tile_label_for('', 'F_GRASS');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('grass');
    expect(def.label_ko).toBeTruthy();
  });

  test('F_GRASS tile directly returns Grass label', () => {
    const def = tile_label_for('F_GRASS', 'F_STONE');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('grass');
  });

  test('tree tile already in TILE_DEFS still resolves', () => {
    const def = tile_label_for('TREE', 'F_GRASS');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('tree');
  });

  test('sandy path tile has a label', () => {
    const def = tile_label_for('F_SAND', 'F_GRASS');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
    expect(def.label_ko).toBeTruthy();
  });

  test('light pavement tile has a label', () => {
    const def = tile_label_for('F_LIGHT', 'F_GRASS');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });
});

// ── Library / indoor rooms (wood floors) ─────────────────────────────────────

describe('tile_label_for: indoor floor tiles', () => {
  test('library wood floor (empty tile in F_WOOD room) has a label', () => {
    const def = tile_label_for('', 'F_WOOD');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
    expect(def.label_ko).toBeTruthy();
  });

  test('F_WOOD2 floor tile has a label', () => {
    const def = tile_label_for('F_WOOD2', 'F_WOOD');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });

  test('library-specific floor F_LIB has a label', () => {
    const def = tile_label_for('F_LIB', 'F_WOOD');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });

  test('lobby gray floor F_GRAY has a label', () => {
    const def = tile_label_for('', 'F_GRAY');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });

  test('library blue floor F_BLUE has a label', () => {
    const def = tile_label_for('F_BLUE', 'F_WOOD');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });
});

// ── House (tatami floors) ─────────────────────────────────────────────────────

describe('tile_label_for: house tiles', () => {
  test('tatami floor has Korean label 다다미', () => {
    const def = tile_label_for('', 'F_TATAMI');
    expect(def).not.toBeNull();
    expect(def.label_ko).toBe('다다미');
  });

  test('F_TATAMI tile directly returns tatami label', () => {
    const def = tile_label_for('F_TATAMI', 'F_WOOD');
    expect(def).not.toBeNull();
    expect(def.label_ko).toBe('다다미');
  });

  test('F_TATAMI_B variant has label', () => {
    const def = tile_label_for('F_TATAMI_B', 'F_TATAMI');
    expect(def).not.toBeNull();
    expect(def.label_ko).toBe('다다미');
  });

  test('wall tile returns Wall label', () => {
    const def = tile_label_for('WALL', 'F_WOOD');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('wall');
    expect(def.label_ko).toBeTruthy();
  });

  test('WALL2 variant has wall label', () => {
    const def = tile_label_for('WALL2', 'F_TATAMI');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toContain('wall');
  });

  test('BED tile used in house map has a label', () => {
    const def = tile_label_for('BED', 'F_TATAMI');
    expect(def).not.toBeNull();
    expect(def.label_en.toLowerCase()).toMatch(/futon|bed/);
    expect(def.label_ko).toBeTruthy();
  });

  test('tan floor tiles have labels', () => {
    expect(tile_label_for('F_TAN', 'F_WOOD')).not.toBeNull();
    expect(tile_label_for('F_TAN_B', 'F_WOOD')).not.toBeNull();
    expect(tile_label_for('F_TAN_C', 'F_WOOD')).not.toBeNull();
  });
});

// ── Salon / school rooms ──────────────────────────────────────────────────────

describe('tile_label_for: salon and school tiles', () => {
  test('salon floor has a label', () => {
    const def = tile_label_for('', 'F_SALON');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });

  test('school floor has a label', () => {
    const def = tile_label_for('', 'F_SCHOOL');
    expect(def).not.toBeNull();
    expect(def.label_en.length).toBeGreaterThan(0);
  });
});

// ── Null / unknown inputs ─────────────────────────────────────────────────────

describe('tile_label_for: null / unknown inputs', () => {
  test('null tile_code returns null', () => {
    expect(tile_label_for(null, 'F_WOOD')).toBeNull();
  });

  test('undefined tile_code returns null', () => {
    expect(tile_label_for(undefined, 'F_WOOD')).toBeNull();
  });

  test('unknown tile code returns null', () => {
    expect(tile_label_for('NOT_A_REAL_TILE', 'F_WOOD')).toBeNull();
  });

  test('empty code with unknown room_floor returns null', () => {
    expect(tile_label_for('', 'NO_SUCH_FLOOR')).toBeNull();
  });
});

// ── TILE_DEFS completeness: every entry must have all three labels ─────────────

describe('TILE_DEFS completeness', () => {
  test('every TILE_DEFS entry has label, label_ko, label_en, and desc_en', () => {
    const missing = [];
    for (const [code, def] of Object.entries(TILE_DEFS)) {
      if (!def.label)    missing.push(`${code}: missing label`);
      if (!def.label_ko) missing.push(`${code}: missing label_ko`);
      if (!def.label_en) missing.push(`${code}: missing label_en`);
      if (!def.desc_en)  missing.push(`${code}: missing desc_en`);
    }
    expect(missing).toEqual([]);
  });
});
