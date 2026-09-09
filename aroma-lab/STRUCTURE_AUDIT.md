# AROMA LAB Structure Audit

Branch: `aroma-lab-structure-audit`  
Production: `gh-pages`  
Scope: all 51 aroma compounds defined in `aroma-lab/app.js`.  
Updated: 2026-09-09

## Final implementation status

The chemistry audit, readability-tuned RDKit asset generation, AROMA LAB integration, centering correction, card flip-state fix, browser QA, and production deployment are complete.

- Source ledger: **51/51 complete**.
- PubChem CID / CAS / SMILES / InChIKey: **51/51 locked**.
- Exact ChEBI mapping: **50/51**; exact ChEBI entry not located for `tca236`, which is locked by PubChem CID 39656 + NIST/CAS/InChIKey concordance.
- Hayashi sensory-standard mapping: **51/51 represented in the AROMA LAB definition**; `h2s` is intentionally recorded as the WINE-P-07 missing/no-SDS reference rather than inventing an SDS mapping.
- Special seven: **7/7 resolved** after SDS/official identity checks.
- RDKit local SVG generation: **51/51 generated**.
- Existing hand-drawn 44 SVG approach: **rejected; 0 files used as structure authority**.
- Runtime structure source: **local `assets/structures/<id>.svg`**.
- Integration centering: **fixed globally**; audited SVGs retain their viewport center and card hover no longer scales structure images.
- Clove / 4VG flip-back bug: **fixed** by separating transient desktop hover state from pinned/click state.
- Browser QA: **Chromium desktop + iPhone WebKit pass**.
- Production deployment: **`gh-pages` synchronized to the audited structure branch**.

## Final readability rendering specification

The final SVG set uses one deliberately high-legibility depiction system across all 51 compounds:

- Canvas: **480 × 280 SVG viewport**.
- Atom-label font size: **38**.
- Bond line width: **2.6**.
- Drawing padding: **0.12**.
- Additional atom-label padding: **0.18**.
- Atom labels and all bonds: **black**; no heteroatom color coding.
- Carbonyl `C=O` depiction only: oxygen is displaced outward by **1.18×** in the 2D depiction so the two carbonyl strokes read more clearly.
- Connectivity, bond order, E/Z, and tetrahedral stereochemistry are unchanged by that depiction adjustment.
- `generate_structure_svgs.py` is locked to these settings so future regeneration does not revert to the earlier small/color-coded style.

## Mandatory drawing rules

1. Structure formula only. Never substitute a molecular formula.
2. Functional-group hydrogen stays attached to the heteroatom label.
   - right side: `-OH`
   - left side: `HO-`
   - never `-O-H`
3. Thiols follow the same rule: `-SH` / `HS-`.
4. Carboxylic acids remain a compact `C(=O)OH` / `COOH` terminal group.
5. Final assets live at `aroma-lab/assets/structures/<id>.svg`.
6. RDKit computes the 2D graph; molecule bounds are centered in the fixed SVG viewport.
7. Rendering uses transparent-background SVG with one bond/font/padding system.
8. E/Z and explicit stereochemistry are preserved only when the accepted molecular identity specifies them.
9. Generic sensory standards do not receive an inferred R/S wedge.
10. H2S is generated from explicit `[H][S][H]` so the result is a bonded H-S-H structure, not a lone `S` glyph or molecular-formula text.
11. Vendor structure artwork is never copied; vendor pages/SDS are identity corroboration only.

## Source authority

Primary graph authority: PubChem CID + canonical/isomeric SMILES.  
Independent structure cross-check: ChEBI where an exact entry exists.  
Identity cross-check: CAS + TCI/Sigma/Fisher/Wako/NIST/J-GLOBAL as applicable.  
Sensory-standard authority: Hayashi Pure Chemical official set pages/SDS.  
Rendering authority: accepted structure data passed to RDKit; vendor artwork is never copied.

See `STRUCTURE_SOURCE_LEDGER.csv` and `STRUCTURE_SOURCE_LEDGER.md` for the full 51-row evidence table.

## Special-seven resolution

| ID | Resolved policy |
|---|---|
| `sotolon` | Generic Sotolon/CAS 28664-35-9 in Hayashi SDS; no R/S designation -> no wedge. |
| `linalool` | Generic Linalool/CAS 78-70-6 in Hayashi SDS -> no wedge. |
| `octenol` | Generic 1-Octen-3-ol/CAS 3391-86-4 in Hayashi SDS -> no C3 wedge. |
| `3mh` | Generic 3-mercaptohexanol/CAS 51755-83-0 -> no C3 wedge. TCI M2168 independently confirms the generic free compound identity. |
| `citronellol` | Generic Citronellol/CAS 106-22-9 in Hayashi beer SDS -> no wedge. |
| `furaneol` | Hayashi names 4-hydroxy-2,5-dimethyl-3(2H)-furanone -> lock that graph. |
| `athp` | Hayashi exact name plus J-GLOBAL/PubChem SMILES `CC(=O)C1=NCCCC1` -> lock free-base imine ring form; do not substitute hydrochloride CAS 27300-28-3. |

## Final chemistry corrections before production

The initial readability-preview package contained two hand-entered SMILES that did not match the locked ledger. They were caught before production and replaced from the audited ledger:

- `tca246` -> locked to ledger 2,4,6-trichloroanisole graph.
- `tdn` -> locked to PubChem CID 121677 / ledger graph with the required dihydronaphthalene unsaturation.

Other textual SMILES differences in the preview package were canonical-equivalent and did not change molecular identity.

## Geometry and notation QA

Confirmed outcomes:

- `4vg`: large black `HO` / ether O labels; no lower-edge clipping from card CSS.
- `3mh`: large black `SH` / `OH`; C3 stereochemistry remains unspecified as required.
- `ethyl-laurate`: true long-chain skeletal structure; ester oxygens remain readable.
- `sotolon`: large black `HO` / ring O / carbonyl O labels.
- `h2s`: explicit H-S-H bonds retained with black S and bonds.
- `geosmin`: specified stereochemistry preserved.
- `tca246` and `tdn`: corrected against the locked ledger before deployment.
- `beta-damascenone`, `beta-ionone`, `hexadienol`, `cis3hexenol`, `geraniol`, `trans2nonenal`: required E/Z geometry preserved.
- OH/HO and SH/HS labels come from molecular-graph depiction rather than manually placed text plus lines.

## Interaction and browser QA

Desktop hover and click pinning use separate state:

- pointer enter on a fine-pointer device -> temporary `hover-revealed`
- click -> persistent `revealed` + `pinned`
- second click -> returns to front even while the pointer remains over the card
- pointer leave -> clears transient hover suppression
- touch devices do not use the desktop hover path

Automated browser QA covers Chromium desktop and iPhone WebKit, including 51 SVG decode, SVG centering, card counts, 4VG flip reset, touch reveal/reset, and mobile one-column behavior.

## Deployment

Production `app.js` resolves every structure through:

```js
'./assets/structures/' + encodeURIComponent(c.id) + '.svg'
```

No runtime PubChem PNG structure request remains in the AROMA LAB card path.
