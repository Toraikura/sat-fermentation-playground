# AROMA LAB — 51 Structure First-Pass Audit

Branch: `aroma-lab-structure-audit`  
Scope: all 51 aroma compounds defined in `aroma-lab/app.js`.

## Result summary

This is the first completed audit pass, not the final artwork approval.

- Total compounds: **51**
- Hard query-name blocker found: **0**
- Compounds requiring controlled compact `OH` / `HO` / `SH` / `HS` / `COOH` drawing: **28**
- Confirmed current off-center examples from supplied screenshots: **2** (`4vg`, `tca246`)
- Stereo policy still needs the source standard / SDS checked before final SVG: **5** (`sotolon`, `linalool`, `octenol`, `3mh`, `citronellol`)
- Fixed stereochemistry / geometry that must be preserved: `beta-damascenone` (E), `beta-ionone` (E), `hexadienol` (E,E), `cis3hexenol` (Z), `geraniol` (trans/E identity), `geosmin` (natural (-)-isomer in current PubChem name resolution)
- Tautomer / canonical drawing review required before final SVG: `furaneol`, `athp`; `2ap` needs a canonical ring/imine depiction check
- Dedicated scale rules required: very small (`ethanol`, `acetaldehyde`, `ethanethiol`, `dms`, `diacetyl`, `acetic-acid`, `so2`, `h2s`, `isobutanol`) and very long/wide (`ethyl-laurate`, `trans2nonenal`, terpene chains)

## Status codes

- `OK` — chemistry is straightforward; redraw locally and center by molecular bounds.
- `LABEL` — compact heteroatom/hydrogen label must be controlled locally.
- `STEREO_POLICY` — generic name does not by itself choose the final enantiomer; check the sensory standard/SDS before drawing wedges.
- `PRESERVE_STEREO` — the queried aroma identity already specifies geometry/stereochemistry; preserve it.
- `TAUTOMER_REVIEW` — choose the intended canonical depiction before freezing the asset.
- `SCALE_SMALL` — small structure needs dedicated enlargement.
- `SCALE_LONG` — long/wide structure needs dedicated fit rule.
- `OFF_CENTER` — current production rendering is visibly off-center in a supplied screenshot.

## Mandatory drawing rules

1. Structure formula only; never replace it with a molecular formula.
2. Hydroxyl is a single visual group.
   - on the right: `-OH`
   - on the left: `HO-`
   - never visually split it into `-O-H`
3. Carboxylic acids use a compact terminal `C(=O)OH` / `COOH` depiction.
4. Thiols use `-SH` or `HS-`, not a detached `S-H` atom treatment.
5. Final assets live at `aroma-lab/assets/structures/<id>.svg`.
6. Center by the actual molecular drawing bounds, not by the original source canvas.
7. One common visual system: bond stroke, atom-label size, padding, and transparent SVG viewBox.

## First-pass audit table

| # | ID | Compound | First-pass chemistry | Compact label | Layout / scale | Final action | Pri. |
|---:|---|---|---|---|---|---|:---:|
| 01 | `ethyl-acetate` | 酢酸エチル / Ethyl acetate | OK | — | normal | local SVG + bounds centering | B |
| 02 | `isoamyl-acetate` | 酢酸イソアミル / Isoamyl acetate | OK | — | normal | local SVG + bounds centering | B |
| 03 | `ethyl-hexanoate` | カプロン酸エチル / Ethyl hexanoate | OK | — | moderately wide | local SVG + bounds centering | B |
| 04 | `ethanol` | エタノール / Ethanol | OK | **LABEL: OH** | **SCALE_SMALL** | draw terminal `OH` as one label | A |
| 05 | `isoamyl-alcohol` | イソアミルアルコール / Isoamyl alcohol | OK | **LABEL: OH** | normal | compact terminal `OH` | A |
| 06 | `phenethyl-alcohol` | フェネチルアルコール / 2-Phenylethanol | OK | **LABEL: OH** | normal | benzene–CH2–CH2–OH; compact OH | A |
| 07 | `acetaldehyde` | アセトアルデヒド / Acetaldehyde | OK | — | **SCALE_SMALL** | enlarge short aldehyde structure | B |
| 08 | `isovaleraldehyde` | イソバレルアルデヒド / 3-Methylbutanal | OK | — | normal | preserve branched aldehyde skeleton | B |
| 09 | `4vg` | 4-ビニルグアイアコール / 4-Vinylguaiacol | OK: 2-methoxy-4-vinylphenol | **LABEL: phenol OH** | **OFF_CENTER confirmed** | redraw; compact OH; re-center by bounds | A |
| 10 | `sotolon` | ソトロン / Sotolon | **STEREO_POLICY**: generic record does not choose final enantiomer | **LABEL: OH/HO** | compact ring | check standard/SDS for R/S/racemate, then freeze | A |
| 11 | `ethanethiol` | エタンチオール / Ethanethiol | OK | **LABEL: SH** | **SCALE_SMALL** | compact terminal `SH` | A |
| 12 | `dms` | ジメチルスルフィド / Dimethyl sulfide | OK | — | **SCALE_SMALL** | dedicated enlargement | B |
| 13 | `dmts` | ジメチルトリスルフィド / Dimethyl trisulfide | OK | — | small / linear | enlarge without excessive empty canvas | B |
| 14 | `tca246` | 2,4,6-トリクロロアニソール | OK: 2,4,6 substitution | — | **OFF_CENTER confirmed** | redraw/reframe; center aromatic bounds | A |
| 15 | `diacetyl` | ジアセチル / Diacetyl | OK | — | **SCALE_SMALL** | dedicated enlargement | B |
| 16 | `hexanoic-acid` | ヘキサン酸 / Hexanoic acid | OK | **LABEL: COOH** | medium chain | terminal compact `C(=O)OH` | A |
| 17 | `acetic-acid` | 酢酸 / Acetic acid | OK | **LABEL: COOH** | **SCALE_SMALL** | compact acid group + enlarge | A |
| 18 | `butyric-acid` | 酪酸 / Butyric acid | OK | **LABEL: COOH** | normal | compact acid group | A |
| 19 | `isovaleric-acid` | イソ吉草酸 / Isovaleric acid | OK | **LABEL: COOH** | normal | preserve branch + compact acid group | A |
| 20 | `linalool` | リナロール / Linalool | **STEREO_POLICY**: generic query is unspecified/racemic identity | **LABEL: OH** | wide terpene | check standard/SDS before adding chirality; compact OH | A |
| 21 | `beta-damascenone` | β-ダマセノン | **PRESERVE_STEREO: E/trans** | — | wide | preserve E enone geometry | A |
| 22 | `vanillin` | バニリン / Vanillin | OK | **LABEL: phenol OH** | normal | compact phenol OH; keep methoxy + CHO | A |
| 23 | `edmp` | 2-エチル-3,5-ジメチルピラジン | OK: exact 3,5-isomer | — | normal | local SVG; preserve substitution positions | B |
| 24 | `furfural` | フルフラール / Furfural | OK | — | normal | furan-2-carbaldehyde depiction | B |
| 25 | `ethyl-laurate` | ラウリン酸エチル / Ethyl laurate | OK | — | **SCALE_LONG** | dedicated long-chain layout; do not shrink excessively | A |
| 26 | `octenol` | 1-オクテン-3-オール / 1-Octen-3-ol | **STEREO_POLICY**: C3 stereocenter unspecified by generic name | **LABEL: OH** | long chain | check standard/SDS; compact OH | A |
| 27 | `furaneol` | フラネオール / Furaneol (HDMF) | **TAUTOMER_REVIEW** | **LABEL: OH/HO** | compact ring | freeze one conventional aroma-standard depiction | A |
| 28 | `ibmp` | 2-イソブチル-3-メトキシピラジン / IBMP | OK | — | moderately wide | preserve pyrazine substitution pattern | B |
| 29 | `3mh` | 3-メルカプトヘキサノール / 3MH | **STEREO_POLICY**: C3 stereocenter unspecified by generic record | **LABEL: OH + SH** | long chain | check standard/SDS; compact both hetero-H groups | A |
| 30 | `beta-ionone` | β-イオノン | **PRESERVE_STEREO: E/trans** | — | wide | preserve E side-chain geometry | A |
| 31 | `tdn` | TDN / 1,1,6-Trimethyl-1,2-dihydronaphthalene | OK | — | fused ring | preserve fused-ring double-bond positions | A |
| 32 | `4vp` | 4-ビニルフェノール / 4-Vinylphenol | OK | **LABEL: phenol OH** | normal | compact OH; preserve para vinyl | A |
| 33 | `4eg` | 4-エチルグアヤコール / 4-Ethylguaiacol | OK | **LABEL: phenol OH** | normal | compact OH; preserve methoxy + para ethyl | A |
| 34 | `2ap` | 2-アセチル-1-ピロリン / 2-Acetyl-1-pyrroline | **canonical depiction review** | — | compact ring | preserve pyrroline/imine identity; do not substitute a saturated ring | A |
| 35 | `so2` | 二酸化硫黄 / Sulfur dioxide | OK: structural form `O=S=O` | — | **SCALE_SMALL** | dedicated centered inorganic drawing | A |
| 36 | `eugenol` | オイゲノール / Eugenol | OK | **LABEL: phenol OH** | normal | compact OH; preserve methoxy + allyl | A |
| 37 | `hexadienol` | trans,trans-2,4-ヘキサジエノール | **PRESERVE_STEREO: E,E** | **LABEL: OH** | long | preserve E,E geometry; compact OH | A |
| 38 | `cis3hexenol` | cis-3-ヘキセノール | **PRESERVE_STEREO: Z/cis** | **LABEL: OH** | long | preserve Z geometry; compact OH | A |
| 39 | `geraniol` | ゲラニオール / Geraniol | **PRESERVE_STEREO: trans/E geraniol identity** | **LABEL: OH** | wide terpene | preserve geraniol geometry; compact terminal OH | A |
| 40 | `isobutanol` | イソブタノール / Isobutanol | OK | **LABEL: OH** | **SCALE_SMALL** | compact OH + enlargement | A |
| 41 | `h2s` | 硫化水素 / Hydrogen sulfide | OK | special `H–S–H` | **SCALE_SMALL** | manually draw centered `H–S–H`, not an almost-empty remote canvas | A |
| 42 | `4ep` | 4-エチルフェノール / 4-Ethylphenol | OK | **LABEL: phenol OH** | normal | compact OH; preserve para ethyl | A |
| 43 | `athp` | 2-アセチル-3,4,5,6-テトラヒドロピリジン / ATHP | **TAUTOMER_REVIEW**: PubChem parent CID 520300 is a tautomeric tetrahydropyridine form | — | compact ring | confirm the standard/SDS depiction before freezing SVG | A |
| 44 | `geosmin` | ジオスミン / Geosmin | **PRESERVE_STEREO: current generic PubChem name resolves to natural (-)-geosmin (4S,4aS,8aR)** | **LABEL: OH** | bicyclic | preserve wedges/stereo + compact OH | A |
| 45 | `styrene` | スチレン / Styrene | OK | — | normal | local SVG + bounds centering | B |
| 46 | `guaiacol` | グアヤコール / Guaiacol | OK | **LABEL: phenol OH** | normal | compact OH; preserve ortho methoxy | A |
| 47 | `tca236` | 2,3,6-トリクロロアニソール | OK: 2,3,6 substitution | — | normal / label-heavy | local SVG + bounds centering | B |
| 48 | `3mbt` | 3-メチル-2-ブテン-1-チオール / 3MBT | OK | **LABEL: SH** | medium | compact terminal SH; no E/Z required at C2=C3 because one alkene carbon has duplicate methyl substituents | A |
| 49 | `trans2nonenal` | trans-2-ノネナール / trans-2-Nonenal | **PRESERVE_STEREO: E/trans** | — | **SCALE_LONG** | preserve E geometry; dedicated long-chain fit | A |
| 50 | `citronellol` | シトロネロール / Citronellol | **STEREO_POLICY**: generic PubChem record is unspecified/racemic identity | **LABEL: OH** | wide terpene | check standard/SDS; compact terminal OH | A |
| 51 | `dcp26` | 2,6-ジクロロフェノール | OK: 2,6 substitution | **LABEL: phenol OH** | normal | compact OH; preserve 2,6 dichloro positions | A |

## PubChem name-resolution spot checks used in this pass

The current production UI builds its remote image request from the `query` field. Special/ambiguous cases were checked against current PubChem compound records. Examples confirmed in this pass include:

- Isoamyl acetate — CID 31276
- Ethyl hexanoate — CID 31265
- 4-Vinylphenol — CID 62453
- 2-Acetyl-1-pyrroline — CID 522834
- Ethyl dodecanoate / ethyl laurate — CID 7800
- 2-Ethyl-3,5-dimethylpyrazine — CID 26334
- 2-Isobutyl-3-methoxypyrazine — CID 32594
- 3-Mercaptohexanol / 3-sulfanylhexan-1-ol — CID 521348
- TDN — CID 121677
- Sulfur dioxide — CID 1119
- Hydrogen sulfide — CID 402
- 4-Ethylphenol — CID 31242
- cis-3-Hexen-1-ol — CID 5281167
- Geraniol — CID 637566
- Citronellol — CID 8842
- 2,6-Dichlorophenol — CID 6899
- beta-Damascenone — CID 5366074 (E/trans)
- beta-Ionone — CID 638014 (E/trans)
- Linalool generic record — CID 6549 (stereochemistry unspecified; enantiomer records also exist)
- Geosmin — CID 29746 (natural (-)-isomer in the current generic-name resolution)
- Sotolon/Sotolone — CID 62835; final enantiomer policy still needs standard/SDS confirmation
- ATHP name family — parent CID 520300; tautomer handling must be fixed locally

No hard invalid-name blocker was identified in the audit. Therefore a blank structure in the current UI should be treated first as a **remote-render/runtime dependency failure**, not automatically as evidence that the compound itself has no PubChem structure.

## Build order after this audit

### Pass 1 — deterministic chemistry assets

Create the 51 local SVGs in this order:

1. `OFF_CENTER` confirmed: `4vg`, `tca246`
2. Compact-label set: all 28 `LABEL` rows
3. Special small molecules: `so2`, `h2s`, `ethanol`, `acetaldehyde`, `dms`, `diacetyl`, etc.
4. Long/wide molecules: `ethyl-laurate`, `trans2nonenal`, terpene chains
5. Remaining straightforward structures

### Pass 2 — unresolved chemistry policy

Before finalizing these assets, inspect the actual sensory-standard/SDS identity:

- `sotolon`
- `linalool`
- `octenol`
- `3mh`
- `citronellol`
- `furaneol`
- `athp`

### Pass 3 — UI integration

Only after all 51 local assets exist:

- switch `structureUrl(c)` away from PubChem runtime PNGs to local SVG paths
- normalize one structure viewport and centering rule
- test iPhone portrait for every card
- separately fix the `4vg` / clove card flip-back interaction bug

## Decision

**Do not patch individual PubChem PNG positions.** The production fix should be a complete local 51-SVG structure set with controlled labels and normalized viewBoxes. That removes the missing-image failure mode and fixes centering/notation at the source.