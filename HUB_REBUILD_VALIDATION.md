# FERMENTATION PLAYGROUND HUB rebuild — validation state

Date: 2026-09-11

## Branch

- Base production branch: `gh-pages`
- Base commit: `1f991142c35f8889c1f6e054a7444e19a4ef447d`
- Working branch: `playground-hub-rebuild`
- Production `gh-pages` has not been modified by this rebuild.

## Scope

The root FERMENTATION PLAYGROUND page is rebuilt as a lightweight hub.

Existing experience implementations are intentionally untouched:

- `/aroma-lab/`
- `/aroma-lab/aroma-match/`
- `/rice-lineage/`

External independent games remain independent and are linked normally:

- `https://toraikura.github.io/shubo-run/`
- `https://toraikura.github.io/sake-clash/`

## Implemented information architecture

`3 ENTRANCES / 5 EXPERIENCES`

1. AROMA
   - AROMA LABO
   - AROMA MATCH
2. RICE
   - RICE LINEAGE
3. SHUBO
   - SHUBO RUN
   - SAKE CLASH

The root page no longer embeds the previous shubo simulator, aroma experiment, rice mini-view, metabolism explorer, discovery note, maker stories, or evidence-library UI.

## Implementation checks completed

- Root is plain static HTML + one root-specific CSS file.
- No runtime JavaScript is required by the hub.
- No iframe is used.
- No gameplay asset is duplicated into the hub.
- All five experience CTAs are ordinary links and usable without JavaScript.
- `AROMA LABO` spelling is retained.
- SEO title and meta description are set for the hub role.
- JSON-LD uses `CollectionPage` plus an `ItemList` containing the five experiences.
- Canonical points to the production FERMENTATION PLAYGROUND root.
- Mobile layout has a `max-width: 900px` single-column entrance layout.
- 390px-class layout has a dedicated `max-width: 700px` treatment.
- Hero H1 was reduced for narrow screens and kept on deliberate single lines.
- Entry-header colors include static fallbacks before `color-mix()` for older browser compatibility.
- Tap-relevant card rows / primary header links are designed around 44px+ interaction height where applicable.
- Reduced-motion preference disables transitions and smooth scrolling.
- CSS cache version is `20260911-2`.

## Diff boundary

Expected rebuild changes from the base commit:

- `index.html` — replaced old generated root experience with the hub
- `playground-hub.css` — new lightweight hub stylesheet
- `HUB_REBUILD_VALIDATION.md` — this handoff / validation record

No AROMA LABO, AROMA MATCH, or RICE LINEAGE runtime file should appear in the diff.

## Browser-validation limitation in this environment

A local copy of the branch HTML/CSS was reconstructed and parsed for validation.

Automated Chromium screenshot runs were attempted, but the available Chromium process hangs in this container around DBus / zygote communication and does not reliably produce a screenshot. A secondary static renderer can parse and render the document, but it does not reproduce browser viewport media-query behavior accurately enough to count as Chrome/iPhone verification.

Therefore:

- structural / source validation: completed
- actual Chromium 390px visual verification: **not claimed**
- actual Chromium 1440px visual verification: **not claimed**
- physical iPhone Safari verification: **not claimed**

Do not silently upgrade these three items to “verified” without actually opening the branch build in a browser.

## Next safe step

Preview the working branch in a real browser or deploy it to an isolated preview target. If the 390px and desktop views are clean, the branch is ready for review/merge into `gh-pages`.
