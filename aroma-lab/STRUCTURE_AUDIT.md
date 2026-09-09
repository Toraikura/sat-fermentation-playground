# AROMA LAB Structure Audit

Branch: `aroma-lab-structure-audit`  
Production: `gh-pages`  
Scope: all 51 aroma compounds defined in `aroma-lab/app.js`.  
Updated: 2026-09-09

## Final implementation status

The chemistry audit, RDKit asset generation, AROMA LAB integration, centering correction, card flip-state fix, and production branch update are complete.

- Source ledger: **51/51 complete**.
- PubChem CID / CAS / SMILES / InChIKey: **51/51 locked**.
- Exact ChEBI mapping: **50/51**; exact ChEBI entry not located for `tca236`, which is locked by PubChem CID 39656 + NIST/CAS/InChIKey concordance.
- Hayashi sensory-standard mapping: **51/51 represented in the AROMA LAB definition**; `h2s` is intentionally recorded as the WINE-P-07 missing/no-SDS reference rather than inventing an SDS mapping.
- Special seven: **7/7 resolved** after SDS/official identity checks.
- RDKit local SVG generation: **51/51 generated**.
- Generated SVG geometry center QA: **51/51 pass in the generator workflow**.
- Existing hand-drawn 44 SVG approach: **rejected; 0 files used as structure authority**.
- Runtime structure source: **local `assets/structures/<id>.svg`**.
- 51-SVG review page: **`aroma-lab/structure-preview.html` added**.
- Integration centering: **fixed globally**; audited SVGs retain their viewport center and card hover no longer scales structure images.
- Clove / 4VG flip-back bug: **fixed** by separating transient desktop hover state from pinned/click state.
- Responsive implementation rules: **desktop / tablet / iPhone portrait breakpoints present and source-level checked**.
- Production source: **`gh-pages` fast-forwarded to commit `bfecf1ccfa0a0755a268e1f940d6eb7c43adb76d`** before this audit-document update.

A physical iPhone/desktop click-through cannot be independently observed from the current GitHub-only execution environment. No claim of a physical-device visual pass is made here; the deployed source and responsive/interaction implementation have been checked directly.

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

## Geometry and notation QA

RDKit draws each molecular graph into a 480 x 280 viewport with fixed padding/font/bond settings. The generation script checks path geometry against the viewport center. Runtime CSS now preserves that geometry instead of applying an additional hover scale.

Confirmed outcomes:

- `4vg`: generated local SVG retained; prior lower-edge clipping is not reintroduced by card CSS. The phenolic substituent is depicted with attached `HO` labeling.
- `tca246`: generated local SVG retained; prior left shift is not reintroduced by card CSS.
- `ethyl-laurate`: long chain is a true RDKit skeletal structure; no hand-drawn string/line shortcut.
- `h2s`: explicit H-S-H bonds are retained.
- `3mh`: terminal OH and thiol are structural atom labels; C3 stereochemistry remains unspecified as required.
- `geosmin`: specified stereochemistry is preserved.
- `beta-damascenone`, `beta-ionone`, `hexadienol`, `cis3hexenol`, `geraniol`, `trans2nonenal`: required E/Z geometry is preserved.
- OH/HO and SH/HS labels come from the molecular graph depiction rather than manually placed text plus lines.

## Interaction fix

Desktop hover and click pinning now use separate state:

- pointer enter on a fine-pointer device -> temporary `hover-revealed`
- click -> persistent `revealed` + `pinned`
- second click -> returns to front even while the pointer remains over the card
- pointer leave -> clears transient hover suppression
- touch devices do not use the desktop hover path

This removes the 4VG/clove card case where CSS `:hover` could immediately re-flip the card after unpinning.

## Deployment

`gh-pages` was fast-forwarded from the previous production commit to the audited structure branch without force-push or conflict. Production `app.js` now resolves every structure through:

```js
'./assets/structures/' + encodeURIComponent(c.id) + '.svg'
```

No runtime PubChem PNG structure request remains in the AROMA LAB card path.
