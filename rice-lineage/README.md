# RICE LINEAGE

Interactive Experience inside FERMENTATION PLAYGROUND.

## Route

`/rice-lineage/`

## Arcade v1 — 2026-09-11

The previous full genealogy viewer has been rebuilt as a lightweight game-first experience.

Core loop:

1. **BOARD** — choose a large sake-rice mission on a calm paper genealogy map.
2. **START ENGINE** — enter a neon 16-bit / neo-city-pop rice-field drive.
3. **FORK** — choose the documented parent / origin route with tap, swipe, or arrow keys.
4. **CLEAR** — reveal the relationship, earn score, and return to the board.
5. The completed lineage edge becomes vivid on the board.

### v1 missions

- 山田錦
- 五百万石
- 越淡麗
- 愛山
- 八反錦1号

The fifth clear unlocks a bonus **kei-truck vehicle skin**.

## Lightweight implementation

- plain HTML + CSS + vanilla JS
- no game engine
- no external image payload for gameplay
- vehicles are inline SVG sprites
- countryside / neon scenery is CSS
- 8-bit-style SFX use Web Audio oscillators, so no audio files are downloaded
- progress is stored in `localStorage`

## Data integrity

`data.js` remains independent from rendering / game logic in `app.js`.

The game only uses relationships already documented in `SOURCE_LEDGER.md`.

Important distinction:

- `CROSS`: the game can ask for either documented parent.
- `SELECTION`: the prompt explicitly asks which variety a line was selected from; it is not mislabeled as cross-breeding.
- unsupported pedigree links are not used as game answers.

### Yamada Nishiki correction

The verified v1 relationship is:

`山田穂 × 短稈渡船 → 山田錦`

The earlier visual concept used the shorter label `渡船`; the playable game deliberately uses the verified `短稈渡船` relationship from the existing source ledger.

## Controls

- iPhone portrait first
- tap either road sign or bottom left/right button
- horizontal swipe anywhere on the arcade stage
- desktop: left / right arrow keys
- wrong route: heart -1 and -50 points
- correct route: +100 plus combo bonus

## Files

- `index.html` — BOARD / ARCADE / CLEAR screens and data modal
- `styles.css` — paper board + neon pixel arcade visual system
- `app.js` — game state, questions, scoring, controls, audio, unlocks
- `data.js` — authoritative rice / pedigree dataset
- `SOURCE_LEDGER.md` — evidence ledger; review before changing relationships
