# AROMA LAB — 51 Structure Final Asset Checklist

Branch: `aroma-lab-structure-audit`  
Production: `gh-pages`  
Updated: 2026-09-09

## Summary

- Ledger fixed: **51/51**
- RDKit SVG generated: **51/51**
- Generated SVG geometry center QA: **51/51 pass**
- Special-seven policy: **7/7 resolved**
- Hand-drawn legacy SVGs used: **0**
- Local SVG runtime wiring: **done** (`./assets/structures/<id>.svg`)
- Dedicated 51-SVG visual QA page: **added** (`structure-preview.html`)
- Integration centering: **done**
- Clove / 4VG flip-back fix: **done**
- Responsive source-level QA: **done**
- `gh-pages` deployment: **done**
- Physical iPhone/desktop click-through: **not independently observable from the current GitHub-only tool environment**

## Status legend

- `PASS`: molecular graph and generated SVG accepted for integration.
- `NO_WEDGE`: stereocenter exists but the sensory standard does not specify R/S; no stereochemical wedge is added.
- `LOCK_STEREO`: explicit E/Z or tetrahedral stereochemistry in the accepted structure data is preserved.
- `LOCK_TAUTOMER`: the named/corroborated tautomeric form is deliberately frozen.
- `EXPLICIT_H`: hydrogens are explicitly retained because they are required for the structural depiction.

## 51 rows

|#|ID|Compound|Chemistry decision|Label QA|BBox center|SVG|
|---:|---|---|---|---|---|---|
|1|`ethyl-acetate`|Ethyl acetate|PASS|—|PASS|PASS|
|2|`isoamyl-acetate`|Isoamyl acetate|PASS|—|PASS|PASS|
|3|`ethyl-hexanoate`|Ethyl hexanoate|PASS|—|PASS|PASS|
|4|`ethanol`|Ethanol|PASS|PASS|PASS|PASS|
|5|`isoamyl-alcohol`|3-Methyl-1-butanol|PASS|PASS|PASS|PASS|
|6|`phenethyl-alcohol`|2-Phenylethanol|PASS|PASS|PASS|PASS|
|7|`acetaldehyde`|Acetaldehyde|PASS|—|PASS|PASS|
|8|`isovaleraldehyde`|3-Methylbutanal|PASS|—|PASS|PASS|
|9|`4vg`|4-Vinylguaiacol|PASS|PASS|PASS|PASS|
|10|`sotolon`|Sotolon|NO_WEDGE|PASS|PASS|PASS|
|11|`ethanethiol`|Ethanethiol|PASS|PASS|PASS|PASS|
|12|`dms`|Dimethyl sulfide|PASS|—|PASS|PASS|
|13|`dmts`|Dimethyl trisulfide|PASS|—|PASS|PASS|
|14|`tca246`|2,4,6-Trichloroanisole|PASS|—|PASS|PASS|
|15|`diacetyl`|Diacetyl / 2,3-butanedione|PASS|—|PASS|PASS|
|16|`hexanoic-acid`|Hexanoic acid|PASS|PASS|PASS|PASS|
|17|`acetic-acid`|Acetic acid|PASS|PASS|PASS|PASS|
|18|`butyric-acid`|Butyric acid|PASS|PASS|PASS|PASS|
|19|`isovaleric-acid`|Isovaleric acid|PASS|PASS|PASS|PASS|
|20|`linalool`|Linalool|NO_WEDGE|PASS|PASS|PASS|
|21|`beta-damascenone`|β-Damascenone|LOCK_STEREO|—|PASS|PASS|
|22|`vanillin`|Vanillin|PASS|PASS|PASS|PASS|
|23|`edmp`|2-Ethyl-3,5-dimethylpyrazine|PASS|—|PASS|PASS|
|24|`furfural`|Furfural|PASS|—|PASS|PASS|
|25|`ethyl-laurate`|Ethyl laurate / ethyl dodecanoate|PASS|—|PASS|PASS|
|26|`octenol`|1-Octen-3-ol|NO_WEDGE|PASS|PASS|PASS|
|27|`furaneol`|Furaneol / HDMF|LOCK_TAUTOMER|PASS|PASS|PASS|
|28|`ibmp`|2-Isobutyl-3-methoxypyrazine|PASS|—|PASS|PASS|
|29|`3mh`|3-Mercaptohexan-1-ol / 3MH|NO_WEDGE|PASS|PASS|PASS|
|30|`beta-ionone`|β-Ionone (E/trans)|LOCK_STEREO|—|PASS|PASS|
|31|`tdn`|TDN|PASS|—|PASS|PASS|
|32|`4vp`|4-Vinylphenol|PASS|PASS|PASS|PASS|
|33|`4eg`|4-Ethylguaiacol|PASS|PASS|PASS|PASS|
|34|`2ap`|2-Acetyl-1-pyrroline|PASS|—|PASS|PASS|
|35|`so2`|Sulfur dioxide|PASS|—|PASS|PASS|
|36|`eugenol`|Eugenol|PASS|PASS|PASS|PASS|
|37|`hexadienol`|trans,trans-2,4-Hexadien-1-ol|LOCK_STEREO|PASS|PASS|PASS|
|38|`cis3hexenol`|cis-3-Hexen-1-ol|LOCK_STEREO|PASS|PASS|PASS|
|39|`geraniol`|Geraniol|LOCK_STEREO|PASS|PASS|PASS|
|40|`isobutanol`|Isobutanol|PASS|PASS|PASS|PASS|
|41|`h2s`|Hydrogen sulfide|EXPLICIT_H|PASS|PASS|PASS|
|42|`4ep`|4-Ethylphenol|PASS|PASS|PASS|PASS|
|43|`athp`|2-Acetyl-3,4,5,6-tetrahydropyridine|LOCK_TAUTOMER|—|PASS|PASS|
|44|`geosmin`|Geosmin|LOCK_STEREO|PASS|PASS|PASS|
|45|`styrene`|Styrene|PASS|—|PASS|PASS|
|46|`guaiacol`|Guaiacol|PASS|PASS|PASS|PASS|
|47|`tca236`|2,3,6-Trichloroanisole|PASS|—|PASS|PASS|
|48|`3mbt`|3-Methyl-2-buten-1-thiol|PASS|PASS|PASS|PASS|
|49|`trans2nonenal`|trans-2-Nonenal|LOCK_STEREO|—|PASS|PASS|
|50|`citronellol`|Citronellol|NO_WEDGE|PASS|PASS|PASS|
|51|`dcp26`|2,6-Dichlorophenol|PASS|PASS|PASS|PASS|

## Integration gate — final state

- Runtime uses only local `assets/structures/<id>.svg` structure assets.
- No per-card PubChem PNG position hacks remain in the active AROMA LAB card path.
- No manually drawn long-chain string/line substitute is used.
- Structure images use `object-position: 50% 50%` and the card-level hover scale is disabled for `.final-structure img`.
- Desktop hover state and pinned click state are separated so a second click can return the card to its front face while the pointer remains over it.
- Touch layouts do not depend on desktop hover behavior.

The remaining verification outside this execution environment is a physical-device visual spot check only; no further chemistry or implementation change is currently identified.
