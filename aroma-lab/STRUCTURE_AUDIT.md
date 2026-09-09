# AROMA LAB Structure Audit

Branch: `aroma-lab-structure-audit`  
Scope: all 51 aroma compounds defined in `aroma-lab/app.js`.  
Updated: 2026-09-09

## Current result

The structure audit is chemically complete and the local RDKit asset path is already wired into the AROMA LAB implementation.

- Source ledger: **51/51 complete**.
- PubChem CID / CAS / SMILES / InChIKey: **51/51 locked**.
- Exact ChEBI mapping: **50/51**; exact ChEBI entry not located for `tca236`, which is locked by PubChem CID 39656 + NIST/CAS/InChIKey concordance.
- Hayashi sensory-standard mapping: **51/51 represented in the AROMA LAB definition**; `h2s` is intentionally recorded as the WINE-P-07 missing/no-SDS reference rather than falsely inventing an SDS mapping.
- Special seven: **7/7 resolved** after SDS/official identity checks.
- RDKit local SVG generation: **51/51 generated**.
- Existing hand-drawn 44 SVG approach: **rejected and not used as source material**.
- Runtime structure source: **local `assets/structures/<id>.svg` already wired in `app.js` and `hotfix-name-first.js`**.
- Remaining implementation work: visual preview QA, integration-level centering, clove flip-back bug, iPhone/desktop verification, then `gh-pages` deployment.

## Mandatory drawing rules

1. Structure formula only. Never substitute a molecular formula.
2. Functional-group hydrogen stays attached to the heteroatom label.
   - right side: `-OH`
   - left side: `HO-`
   - never `-O-H`
3. Thiols follow the same rule: `-SH` / `HS-`.
4. Carboxylic acids remain a compact `C(=O)OH` / `COOH` terminal group.
5. Final assets live at `aroma-lab/assets/structures/<id>.svg`.
6. RDKit computes the 2D graph; the resulting molecule bounds are centered in the fixed SVG viewport.
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

The generated SVG set is not based on remote PubChem image canvases. RDKit draws each molecular graph into a 480 x 280 viewport with fixed padding/font/bond settings. The generation script checks the path geometry against the target viewport center.

Confirmed implementation constraints:

- `4vg`: use generated local SVG; prior lower-edge clipping must not be reintroduced by card CSS.
- `tca246`: use generated local SVG; prior left shift must not be reintroduced by card CSS.
- `ethyl-laurate`: long chain is rendered by RDKit from the molecular graph; no hand-drawn string/line shortcut.
- `h2s`: explicit H-S-H bonds are retained.
- `geosmin`: specified stereochemistry is preserved.
- `beta-damascenone`, `beta-ionone`, `hexadienol`, `cis3hexenol`, `geraniol`, `trans2nonenal`: required E/Z geometry is preserved.
- OH/HO and SH/HS labels come from the molecular graph depiction rather than manually placed text plus lines.

## Implementation sequence from here

1. Build/inspect the 51-structure overview preview against the committed local SVG set.
2. Fix any integration-level centering/scale issues without per-card coordinate hacks.
3. Fix the clove flip-back bug independently of chemistry assets.
4. Verify interaction and structure legibility on iPhone portrait and desktop.
5. Deploy to `gh-pages` only after the local-asset UI passes.
