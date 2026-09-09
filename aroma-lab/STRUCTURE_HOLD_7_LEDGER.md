# AROMA LAB — Previously HOLD 7, now resolved

Branch: `aroma-lab-structure-audit`  
Resolved: 2026-09-09

These seven compounds were held only for final stereochemical or tautomeric depiction. Connectivity was already known. The hold is removed after checking the Hayashi sensory-standard identity/SDS and independent structure records.

| ID | Compound | Hayashi mapping | Resolved drawing decision |
|---|---|---|---|
| `sotolon` | Sotolon | SAKE-10; SHOCHU-08; WINE-S-18 | Generic Sotolon/CAS 28664-35-9; no R/S designation -> no wedge. |
| `linalool` | Linalool | SHOCHU-05; WINE-S-03; BEER-14 | Generic Linalool/CAS 78-70-6; no R/S designation -> no wedge. |
| `octenol` | 1-Octen-3-ol | SHOCHU-19 | SDS BC-19 generic CAS 3391-86-4; no R/S designation -> no wedge. |
| `3mh` | 3-Mercaptohexan-1-ol / 3MH | WINE-S-04 | Generic CAS 51755-83-0/J-GLOBAL stereo-unspecified -> no wedge. |
| `citronellol` | Citronellol | BEER-12 | Beer SDS MC-12 generic CAS 106-22-9; no R/S designation -> no wedge. |
| `furaneol` | Furaneol / HDMF | WINE-S-01 | Hayashi explicitly names 4-hydroxy-2,5-dimethyl-3(2H)-furanone -> lock this graph. |
| `athp` | 2-Acetyl-3,4,5,6-tetrahydropyridine | WINE-P-16 | Hayashi exact name + J-GLOBAL/PubChem `CC(=O)C1=NCCCC1` -> lock imine ring form. |

## Rendering consequence

- Sotolon, Linalool, 1-Octen-3-ol, 3MH, and Citronellol receive no stereochemical wedge because the sensory-standard identity does not specify an enantiomer.
- Furaneol uses the conventional 4-hydroxy-2,5-dimethyl-3(2H)-furanone molecular graph.
- ATHP uses `CC(=O)C1=NCCCC1`, the 2-acetyl-3,4,5,6-tetrahydropyridine imine form.
- Vendor artwork remains excluded; all final images are RDKit-generated local SVG.

The machine-readable resolved records are in `STRUCTURE_HOLD_7_LEDGER.csv` and the complete 51-row record is in `STRUCTURE_SOURCE_LEDGER.csv`.
