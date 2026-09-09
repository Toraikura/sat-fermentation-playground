# AROMA LAB — Structure Source Ledger

Branch: `aroma-lab-structure-audit`  
Scope: all 51 compounds in `aroma-lab/app.js`.  
Last verified: 2026-09-09  
Machine-readable full ledger: `STRUCTURE_SOURCE_LEDGER.csv`.

## Completion status

- PubChem CID / CAS / SMILES / InChIKey: **51/51 fixed**.
- ChEBI: **50/51 exact entries fixed**. `tca236` (2,3,6-trichloroanisole) has no exact ChEBI entry located, so PubChem + NIST + CAS remains authoritative for that row.
- Hayashi sensory-standard mapping: **51/51 represented in the AROMA LAB definition**. `h2s` is deliberately recorded as the WINE-P-07 missing/no-SDS reference instead of inventing a nonexistent SDS match.
- Vendor cross-check: **identity corroboration only**. TCI/Sigma/Fisher/Wako/NIST/J-GLOBAL structure artwork is not copied and is never the rendering source.
- Special seven: **resolved**.
- Final structure source: **51/51 locked for RDKit generation**.

## What counts as a complete row

Every row in `STRUCTURE_SOURCE_LEDGER.csv` must contain:

1. A stable AROMA LAB compound ID.
2. PubChem CID.
3. CAS registry number used for identity matching.
4. Canonical/isomeric SMILES used as the RDKit input.
5. InChIKey.
6. Exact ChEBI ID where one exists, otherwise an explicit documented exception.
7. Vendor/registry identity cross-check note.
8. Hayashi standard/SDS mapping or an explicit missing-SDS exception.
9. Stereochemistry/tautomer policy.
10. Final structure-source lock statement ending in RDKit generation.

A vendor SKU is useful corroboration when available, but the molecular graph is not taken from vendor artwork. PubChem/ChEBI structure data remain the graph authority.

## Authority order

1. PubChem CID and canonical/isomeric structure data define the primary molecular graph.
2. ChEBI is the independent identity/structure cross-check where an exact entry exists.
3. CAS plus TCI/Sigma/Fisher/Wako/NIST/J-GLOBAL are identity cross-checks only; vendor structure artwork is not reused.
4. Hayashi Pure Chemical sensory-standard pages/SDS decide whether the actual standard specifies an enantiomer or a named tautomer.
5. Accepted data are rendered locally with RDKit to `aroma-lab/assets/structures/<id>.svg`.

## Special-seven final decisions

| ID | Decision | Evidence used for final depiction |
|---|---|---|
| `sotolon` | no wedge | Hayashi SDS uses generic Sotolon, CAS 28664-35-9, with no R/S designation. PubChem CID 62835 + CHEBI:67890 connectivity retained. |
| `linalool` | no wedge | Hayashi SDS uses generic Linalool, CAS 78-70-6, with no R/S designation. PubChem CID 6549 + CHEBI:17580 connectivity retained. |
| `octenol` | no wedge | Hayashi SDS uses generic 1-Octen-3-ol, CAS 3391-86-4, with no R/S designation. PubChem CID 18827 + CHEBI:34118 connectivity retained. |
| `3mh` | no wedge | Hayashi WINE-S-04 identifies generic 3-mercaptohexanol. PubChem CID 521348 gives CAS 51755-83-0 / SMILES `CCCC(CCO)S` / InChIKey `TYZFMFVWHZKYSE-UHFFFAOYSA-N`; TCI M2168 independently confirms generic 3-Mercapto-1-hexanol CAS 51755-83-0. No enantiomer is inferred. |
| `citronellol` | no wedge | Hayashi beer SDS uses generic Citronellol, CAS 106-22-9, with no R/S designation. PubChem CID 8842 + CHEBI:50462 connectivity retained. |
| `furaneol` | lock 3(2H)-furanone form | Hayashi WINE-S-01 names 4-hydroxy-2,5-dimethyl-3(2H)-furanone. PubChem CID 19309 confirms CAS 3658-77-3, SMILES `CC1C(=O)C(=C(O1)C)O`, InChIKey `INAXVXBDKKUCGI-UHFFFAOYSA-N`, and CHEBI:76247. |
| `athp` | lock free-base imine ring form | Hayashi WINE-P-16 names 2-acetyl-3,4,5,6-tetrahydropyridine. J-GLOBAL gives CAS 27300-27-2, SMILES `CC(=O)C1=NCCCC1`, and InChIKey `GNZWXNKZMHJXNU-UHFFFAOYSA-N`, matching PubChem CID 520300. The hydrochloride is a separate identity (CAS 27300-28-3) and must not replace the free-base graph. |

## ChEBI corrections fixed in this pass

Examples of entries that were previously `not-fixed` and are now locked include Sotolon `CHEBI:67890`, Linalool `CHEBI:17580`, EDMP `CHEBI:193645`, IBMP `CHEBI:229442`, sulfur dioxide `CHEBI:18422`, trans,trans-2,4-hexadien-1-ol `CHEBI:142625`, and Citronellol `CHEBI:50462`.

The full 51-row values for CID, CAS, SMILES, InChIKey, ChEBI, vendor cross-check, Hayashi mapping, stereochemistry/tautomer policy, and final structure source are stored in `STRUCTURE_SOURCE_LEDGER.csv` and are the generation input.
