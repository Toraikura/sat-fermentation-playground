# AROMA LAB 60-icons implementation checkpoint

Checkpoint: 2026-09-09
Branch: `aroma-lab-60-icons`
Base: `gh-pages`

## Repository routing
The user-specified `Toraikura/sake-art-tokyo-lp` does not contain the current AROMA LAB implementation. The live/current AROMA LAB source is in `Toraikura/sat-fermentation-playground/aroma-lab/`, so implementation work is staged here to avoid duplicating or breaking unrelated code.

## Completed before checkpoint
- Confirmed existing `aroma-lab/index.html`, `styles.css`, `app.js`, `pictograms.svg`.
- Confirmed existing data model covers SAKE / SHOCHU-AWAMORI / WINE / BEER and cross-drink molecules.
- Confirmed current UX is structure-first and needs to be changed to name/aroma-icon-first, with structure on reveal/detail.
- Listed the provided Google Drive folder and excluded `archive`.
- Confirmed exactly 60 current `aroma-*.png` masters.
- Downloaded all 60 masters through the connected Google Drive source for inspection/work.
- Verified all 60 masters are PNG, 1254×1254, RGBA, square, with alpha channel.
- Confirmed latest kerosene asset is `aroma-kerosene.png`.
- Confirmed the five added assets are present with final English filenames: `aroma-corn.png`, `aroma-corn-soup.png`, `aroma-takuan.png`, `aroma-pickles.png`, `aroma-natto.png`.

## 60 master filenames
`aroma-alcohol-sake.png`, `aroma-aonori.png`, `aroma-apple-green.png`, `aroma-apple-red.png`, `aroma-banana.png`, `aroma-cabbage.png`, `aroma-caramel.png`, `aroma-cardboard-old-paper.png`, `aroma-cheese.png`, `aroma-clove.png`, `aroma-cooking-oil.png`, `aroma-cork.png`, `aroma-corn-soup.png`, `aroma-corn.png`, `aroma-fermented-butter.png`, `aroma-gas.png`, `aroma-ginkgo-nut.png`, `aroma-glue-remover.png`, `aroma-grapefruit.png`, `aroma-grass.png`, `aroma-green-aldehydic.png`, `aroma-green-pepper.png`, `aroma-honey.png`, `aroma-ink.png`, `aroma-kerosene.png`, `aroma-lavender.png`, `aroma-match-sulfite.png`, `aroma-mold.png`, `aroma-mouse.png`, `aroma-mureka-musty-steam.png`, `aroma-mushroom.png`, `aroma-natto.png`, `aroma-nuts.png`, `aroma-oak-barrel.png`, `aroma-onion.png`, `aroma-phenol.png`, `aroma-pickles.png`, `aroma-plastic.png`, `aroma-resin.png`, `aroma-rose.png`, `aroma-rotten-egg.png`, `aroma-skunk.png`, `aroma-smoke.png`, `aroma-smoked.png`, `aroma-smoky-charred.png`, `aroma-soap.png`, `aroma-soil.png`, `aroma-solvent.png`, `aroma-spice.png`, `aroma-stable-animal.png`, `aroma-strawberry-candy.png`, `aroma-sweat.png`, `aroma-sweet-flower.png`, `aroma-takuan.png`, `aroma-vanilla.png`, `aroma-vinegar.png`, `aroma-violet.png`, `aroma-whiteboard-marker.png`, `aroma-yogurt.png`, `aroma-young-green-leaves.png`.

## Continuation checkpoint
- Reconfirmed the branch tree and checkpoint commit before resuming.
- Reconfirmed all 60 downloaded master PNGs are still present in the working runtime; total source size is about 44 MB.
- Began generating 640×640 transparent WebP delivery copies at quality 84 while keeping the Drive PNG masters untouched.
- The bulk optimization command hit the execution timeout, so work was stopped immediately per user instruction.
- 18 WebP files had been generated locally before timeout (about 500 KB total); they have **not** been uploaded to GitHub yet, so there is no partial asset state in the branch.
- No production or `gh-pages` files were modified during this continuation.

## Next atomic steps
1. Generate web-delivery copies in smaller batches to avoid timeout; keep all Drive PNG masters untouched.
2. Add static assets under `aroma-lab/assets/aroma-lab/`.
3. Replace pictogram-first/structure-first card UI with name + aroma image first; structure on reverse/detail.
4. Map compounds to exact aroma assets, including separate corn/corn-soup, takuan/pickles, green-aldehydic, mureka, kerosene.
5. Run desktop and iPhone portrait browser checks, asset-404 checks, overflow/layout/JS-console checks.
6. Commit implementation on this branch and only then consider merging/publishing.

## Reason for this checkpoint
The resumed bulk image-optimization command hit its execution timeout. The branch remains safe and unchanged except for this checkpoint update. Work intentionally stops here rather than risk an incomplete long-running operation.
