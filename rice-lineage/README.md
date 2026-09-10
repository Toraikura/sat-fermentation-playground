# RICE LINEAGE

Interactive Editorial inside SAT FERMENTATION PLAYGROUND.

## Route

`/rice-lineage/`

## v1

- 24 featured rice varieties
- 10 supporting / breeding-line nodes
- event-based DAG, not a tree
- relationship types: CROSS / SELECTION / MUTATION / origin
- desktop: full lineage canvas with pan, controlled zoom, search, fit, reset
- iPhone portrait: Parents → Selected Rice → Children local lineage
- full-lineage overlay on mobile with pan / pinch / zoom
- JA / EN UI and bilingual data
- query-state deep links via `?rice=<id>`
- source links shown from selected nodes
- lineage index for discovery and SEO support

## Data architecture

`data.js` is independent from rendering logic in `app.js`.

A visible edge is an event:

```text
parents[] -> LineageEvent(type, year, sources[]) -> child
```

This avoids pretending that cross-breeding, selection and mutation are the same operation.

See `SOURCE_LEDGER.md` before adding or changing a relationship.

## Visual direction

FERMENTATION PLAYGROUND shell:
- paper background
- ink
- SAT green / orange / yellow
- mono research labels
- subtle grid / analog offset

Lineage instrument:
- thin neutral lines
- selected path only becomes vivid
- unrelated nodes remain visible but recede
- no per-variety rainbow coloring
