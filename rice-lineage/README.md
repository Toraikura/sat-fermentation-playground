# RICE LINEAGE

Interactive Experience inside FERMENTATION PLAYGROUND.

## Route

`/rice-lineage/`

## Arcade v2 — 2026-09-11

RICE LINEAGE is a lightweight game-first experience: choose a sake-rice course on the BOARD, start the engine, then drive backward through documented pedigree routes.

Core loop:

1. **BOARD** — choose one of 14 sake-rice stages across 4 worlds.
2. **START ENGINE** — enter a neon 16-bit / neo-city-pop rice-field drive.
3. **FORK** — choose the documented parent, selection source, breeding event, or origin route.
4. **CLEAR** — reveal the relationship, earn score, and return to the course map.
5. Cleared checkpoints unlock the next stage and world.

## v2 worlds / 14 stages

### WORLD 1 — ROOTS

1. 山田錦 — basic parent + selection route
2. 八反錦1号 — short two-parent course
3. 五百万石 — multi-generation route
4. 美山錦 — **SPECIAL: MUTATION**

### WORLD 2 — CROSSROADS

5. 越淡麗 — Yamada Nishiki × Gohyakumangoku convergence
6. 金紋錦 — Takane Nishiki × Yamada Nishiki
7. 愛山 — two-generation Hyogo route
8. 強力 — **SPECIAL: ORIGIN**; the correct answer is that the documented road ends

### WORLD 3 — NORTH

9. 出羽燦々 — Miyama Nishiki × Hana Fubuki
10. 秋田酒こまち — short Akita breeding-line sprint
11. 吟風 — **SPECIAL: COMPLEX CROSS**

### WORLD 4 — DEEP LINEAGE

12. さがの華 — crosses the Gohyakumangoku and Yamada Nishiki lines
13. 雪女神 — short pre-final Yamagata stage
14. 吟のさと — **FINAL: REPEATED ANCESTOR**; Yamada Nishiki appears through two routes

The full clear unlocks the bonus **kei-truck vehicle skin**.

## Lightweight implementation

- plain HTML + CSS + vanilla JS
- no game engine
- no external image payload for gameplay
- vehicles are inline SVG sprites
- countryside / neon scenery is CSS
- course map is SVG + DOM only
- 8-bit-style SFX use Web Audio oscillators, so no audio files are downloaded
- progress is stored in versioned `localStorage`

## Data architecture

- `data.js` — original archival rice / pedigree dataset
- `game-data.js` — Arcade v2 mission catalog, 4-world course layouts, mission-only support labels, and additional primary-source links
- `app.js` — rendering, game state, scoring, controls, audio, progression, special-route logic
- `SOURCE_LEDGER.md` — publication evidence ledger; review before changing any lineage relationship

`game-data.js` does **not** invent pedigree. Mission-only support nodes are allowed only when the relationship is documented in `SOURCE_LEDGER.md`.

## Relationship types used in play

- `CROSS` — choose one or both documented parents.
- `SELECTION` — explicitly asks which variety / local line a selection came from; never mislabeled as a cross.
- `MUTATION` — event choice, currently used for 美山錦.
- `ORIGIN` — the documented lineage stops; no unsupported parent is fabricated.
- `COMPLEX CROSS` — an intermediate F1 breeding line must be opened before its two parents are revealed.
- `REPEATED ANCESTOR` — the same ancestor can appear through more than one documented route.

## Important corrections / boundaries

### 山田錦

Verified relationship:

`山田穂 × 短稈渡船 → 山田錦`

The playable game intentionally uses `短稈渡船`, not the looser visual shorthand `渡船`.

### 愛山

`愛山` is not a direct child of 山田錦. The game routes through `山雄67`.

### 強力

The game stops at a documented Tottori local-origin / selection state. It does not invent a parent.

## Controls

- iPhone portrait first
- tap either road sign or bottom left/right button
- horizontal swipe anywhere on the arcade stage
- desktop: left / right arrow keys
- wrong route: heart -1 and -50 points
- correct route: +100 plus combo bonus

## Files

- `index.html` — BOARD / WORLD course map / ARCADE / CLEAR screens and data modal
- `styles.css` — base paper board + neon pixel arcade visual system
- `game-data.js` — 14 stages, 4 worlds, extra game nodes and source links
- `app.js` — runtime logic
- `data.js` — original archive dataset
- `SOURCE_LEDGER.md` — evidence ledger
