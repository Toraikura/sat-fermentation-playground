# AROMA LAB — Structure Source Ledger

Branch: `aroma-lab-structure-audit`  
Scope: all 51 compounds in `aroma-lab/app.js`.  
Last verified: 2026-09-09  
Machine-readable full ledger: `STRUCTURE_SOURCE_LEDGER.csv`.

## Completion status

- PubChem CID / CAS / SMILES / InChIKey: **51/51 fixed**.
- ChEBI: **50/51 exact entries fixed**. `tca236` (2,3,6-trichloroanisole) has no exact ChEBI entry located, so PubChem + NIST + CAS remains authoritative for that row.
- Hayashi sensory-standard mapping: **51/51 mapped** to the AROMA LAB set definition. `h2s` remains the documented WINE-P-07 missing-number / no-SDS reference.
- Vendor cross-check: identity-only. TCI/Sigma/Fisher/Wako/NIST/J-GLOBAL structure artwork is not copied.
- Special seven: **resolved**.
- Final structure source: **51/51 locked for RDKit generation**.

## Authority order

1. PubChem CID and canonical/isomeric structure data define the primary molecular graph.
2. ChEBI is the independent identity/structure cross-check where an exact entry exists.
3. CAS plus TCI/Sigma/Fisher/Wako/NIST/J-GLOBAL are identity cross-checks only; vendor structure artwork is not reused.
4. Hayashi Pure Chemical sensory-standard pages/SDS decide whether the actual standard specifies an enantiomer or a named tautomer.
5. Accepted data are rendered locally with RDKit to `aroma-lab/assets/structures/<id>.svg`.

## Special-seven final decisions

| ID | Decision | Evidence used for final depiction |
|---|---|---|
| `sotolon` | no wedge | Hayashi SDS WAS-18 uses generic Sotolon, CAS 28664-35-9, with no R/S designation. PubChem CID 62835 + CHEBI:67890 connectivity retained. |
| `linalool` | no wedge | Hayashi SDS WAS-03 uses generic Linalool, CAS 78-70-6, with no R/S designation. PubChem CID 6549 + CHEBI:17580 connectivity retained. |
| `octenol` | no wedge | Hayashi SDS BC-19 uses generic 1-Octen-3-ol, CAS 3391-86-4, with no R/S designation. PubChem CID 18827 + CHEBI:34118 connectivity retained. |
| `3mh` | no wedge | Hayashi WINE-S-04 identifies generic 3-mercaptohexanol; CAS 51755-83-0/J-GLOBAL is stereo-unspecified. PubChem CID 521348 + CHEBI:77690 connectivity retained. |
| `citronellol` | no wedge | Hayashi beer SDS MC-12 uses generic Citronellol, CAS 106-22-9, with no R/S designation. PubChem CID 8842 + CHEBI:50462 connectivity retained. |
| `furaneol` | lock 3(2H)-furanone form | Hayashi WINE-S-01 explicitly names 4-hydroxy-2,5-dimethyl-3(2H)-furanone; SDS WAS-01 gives Furaneol CAS 3658-77-3. PubChem CID 19309 + CHEBI:76247 graph used. |
| `athp` | lock imine ring form | Hayashi WINE-P-16 names 2-acetyl-3,4,5,6-tetrahydropyridine; J-GLOBAL gives CAS 27300-27-2 and SMILES `CC(=O)C1=NCCCC1`, matching PubChem CID 520300 + CHEBI:59533. |

## ChEBI corrections fixed in this pass

Examples of entries that were previously `not-fixed` and are now locked include Sotolon `CHEBI:67890`, Linalool `CHEBI:17580`, EDMP `CHEBI:193645`, IBMP `CHEBI:229442`, sulfur dioxide `CHEBI:18422`, trans,trans-2,4-hexadien-1-ol `CHEBI:142625`, and Citronellol `CHEBI:50462`.

The full 51-row values for CID, CAS, SMILES, InChIKey, ChEBI, vendor cross-check, Hayashi mapping, stereochemistry/tautomer policy, and final structure source are stored in `STRUCTURE_SOURCE_LEDGER.csv` and should be treated as the generation input.
