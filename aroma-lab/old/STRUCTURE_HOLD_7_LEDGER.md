# AROMA LAB — HOLD 7 Structure Source Ledger

Branch: `aroma-lab-structure-audit`

These seven compounds are **not chemically unidentified**. Their connectivity is fixed; the HOLD only applies to the final stereochemical or tautomeric depiction used in the local SVG.

| ID | Compound | PubChem CID | CAS | ChEBI | Hayashi mapping | Remaining decision | Final structure source |
|---|---|---:|---|---|---|---|---|
| `sotolon` | Sotolon | 62835 | 28664-35-9 | not-fixed | SAKE-10; SHOCHU-08; WINE-S-18 | Generic CID/CAS does not select sensory-standard enantiomer/racemate. No wedge until SDS/standard identity is fixed. | PubChem connectivity + TCI D5850 identity + Hayashi SDS for stereo |
| `linalool` | Linalool | 6549 | 78-70-6 | not-fixed | SHOCHU-05; WINE-S-03; BEER-14 | Generic record is stereo-unspecified. Decide R/S/racemate only from the sensory-standard SDS. | PubChem connectivity + CAS/vendor + Hayashi SDS |
| `octenol` | 1-Octen-3-ol | 18827 | 3391-86-4 | CHEBI:34118 | SHOCHU-19 | C3 is stereogenic; generic CAS product is not enantiomer-specific. | PubChem + ChEBI + CAS/vendor + Hayashi SDS |
| `3mh` | 3-Mercaptohexan-1-ol / 3MH | 521348 | 51755-83-0 | CHEBI:77690 | WINE-S-04 | C3 stereocenter unspecified in generic record. Keep compact OH/SH; add wedge only if SDS fixes enantiomer. | PubChem + ChEBI + TCI M2168 + Hayashi SDS |
| `citronellol` | Citronellol | 8842 | 106-22-9 | not-fixed | BEER-12 | Generic citronellol CAS does not select R/S. | PubChem connectivity + CAS/vendor + Hayashi SDS |
| `furaneol` | Furaneol / HDMF | 19309 | 3658-77-3 | CHEBI:76247 | WINE-S-01 | Connectivity is fixed, but the tautomeric drawing must be deliberately frozen. | PubChem + ChEBI + TCI D1569 + Hayashi SDS/literature |
| `athp` | 2-Acetyl-3,4,5,6-tetrahydropyridine / ATHP | 520300 | 27300-27-2 | CHEBI:59533 | WINE-P-16 | Free-base identity is fixed; final ring/imine tautomer depiction requires the sensory-standard/literature check. | PubChem + ChEBI + CAS identity + Hayashi SDS/literature |

## Locked structure data

```text
sotolon     SMILES CC1C(=C(C(=O)O1)O)C          InChIKey UNYNVICDCJHOPO-UHFFFAOYSA-N
linalool    SMILES CC(=CCCC(C)(C=C)O)C           InChIKey CDOSHBSSFJOMGT-UHFFFAOYSA-N
octenol     SMILES CCCCCC(C=C)O                   InChIKey VSMOENVRRABVKN-UHFFFAOYSA-N
3mh         SMILES CCCC(CCO)S                     InChIKey TYZFMFVWHZKYSE-UHFFFAOYSA-N
citronellol SMILES CC(CCC=C(C)C)CCO               InChIKey QMVPMAAFGQKVCJ-UHFFFAOYSA-N
furaneol    SMILES CC1C(=O)C(=C(O1)C)O            InChIKey INAXVXBDKKUCGI-UHFFFAOYSA-N
athp        SMILES CC(=O)C1=NCCCC1                InChIKey GNZWXNKZMHJXNU-UHFFFAOYSA-N
```

## Rendering rule

The final image source remains structure data, not reagent-vendor artwork: accepted connectivity/stereo/tautomer data → RDKit → local SVG. OH/SH compact-label rules and molecular-bounding-box centering remain mandatory.