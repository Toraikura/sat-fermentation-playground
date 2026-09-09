# AROMA LAB — Structure Source Ledger

Branch: `aroma-lab-structure-audit`  
Scope: all 51 compounds in `aroma-lab/app.js`.  
Machine-readable companion: `STRUCTURE_SOURCE_LEDGER.csv`.

## Source policy

1. **Graph authority:** PubChem CID + canonical/isomeric SMILES. ChEBI is a second structure/identity cross-check when a stable ID has been positively fixed.
2. **Identity cross-check:** CAS + TCI/Sigma/other reagent-vendor catalog identity. Vendor structure artwork is **never** reused.
3. **Sensory-standard authority:** Hayashi Pure Chemical (林純薬) SDS mapping controls the actual reagent used by the SAKE / SHOCHU / WINE / BEER standard sets when that detail matters.
4. **Rendering:** final accepted structure data -> RDKit -> local SVG. Previous hand-drawn SVGs are not source material.
5. `not-fixed` in the ChEBI column is an explicit result: no ChEBI ID is frozen in this pass, so PubChem + CAS/SDS remains authoritative. It is not a guessed ID.
6. `HOLD-*` means connectivity is identified but final visual stereochemistry/tautomer must not be frozen until the named SDS/literature check is completed.
7. Functional-group presentation is a rendering rule, not a different molecule: terminal alcohol/phenol must read compactly as `-OH` / `HO-`; thiol as `-SH` / `HS-`; carboxylic acid as compact `C(=O)OH`. SVG framing is centered on the molecular drawing bounds.

## Hayashi set codes

- `SAKE-xx`: 清酒官能評価標準試薬
- `SHOCHU-xx`: 本格焼酎・泡盛官能評価標準試薬
- `WINE-S-xx`: ワイン官能評価標準試薬 / Standard
- `WINE-P-xx`: ワイン官能評価標準試薬 / Professional
- `BEER-xx`: ビール官能評価標準試薬
- `WINE-P-07` H2S is a **欠番 / SDSなし** entry in the current AROMA LAB definition and is retained as a learning reference.

## 51-compound ledger

|#|ID|Compound|CID|CAS|SMILES|InChIKey|ChEBI|Hayashi / SDS|Stereo / tautomer|Final structure source|
|---:|---|---|---:|---|---|---|---|---|---|---|
|1|`ethyl-acetate`|Ethyl acetate|8857|141-78-6|`CCOC(=O)C`|`XEKOWRVHYACXOJ-UHFFFAOYSA-N`|CHEBI:27750|SAKE-01; SHOCHU-03; WINE-S-11; BEER-09|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|2|`isoamyl-acetate`|Isoamyl acetate|31276|123-92-2|`CC(C)CCOC(=O)C`|`MLFHJEHSLIIPHL-UHFFFAOYSA-N`|CHEBI:31725|SAKE-02; SHOCHU-01; WINE-S-08|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|3|`ethyl-hexanoate`|Ethyl hexanoate|31265|123-66-0|`CCCCCC(=O)OCC`|`SHZIWNPUGXLXDT-UHFFFAOYSA-N`|CHEBI:86055|SAKE-03; SHOCHU-02; WINE-P-04; BEER-10|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|4|`ethanol`|Ethanol|702|64-17-5|`CCO`|`LFQSCWFLJHTTHZ-UHFFFAOYSA-N`|CHEBI:16236|SAKE-04|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|5|`isoamyl-alcohol`|3-Methyl-1-butanol|31260|123-51-3|`CC(C)CCO`|`PHTQWCKDNZKARW-UHFFFAOYSA-N`|not-fixed|SAKE-05; SHOCHU-17; WINE-S-09; BEER-17 (SAKE-05 label: 高級アルコール; actual component fixed here)|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|6|`phenethyl-alcohol`|2-Phenylethanol|6054|60-12-8|`C1=CC=C(C=C1)CCO`|`WRMNZCZEMHIOCP-UHFFFAOYSA-N`|not-fixed|SAKE-06; SHOCHU-04; WINE-P-06; BEER-02|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|7|`acetaldehyde`|Acetaldehyde|177|75-07-0|`CC=O`|`IKHGUXGNUITLKF-UHFFFAOYSA-N`|not-fixed|SAKE-07; SHOCHU-15; WINE-P-10; BEER-05|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|8|`isovaleraldehyde`|3-Methylbutanal|11552|590-86-3|`CC(C)CC=O`|`YGHRJJRRZDOVPD-UHFFFAOYSA-N`|not-fixed|SAKE-08; SHOCHU-16|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|9|`4vg`|4-Vinylguaiacol|332|7786-61-0|`COC1=C(C=CC(=C1)C=C)O`|`YOMSJEATGXXYPX-UHFFFAOYSA-N`|CHEBI:42438|SAKE-09; SHOCHU-11; WINE-P-14; BEER-04|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|10|`sotolon`|Sotolon|62835|28664-35-9|`CC1C(=C(C(=O)O1)O)C`|`UNYNVICDCJHOPO-UHFFFAOYSA-N`|not-fixed|SAKE-10; SHOCHU-08; WINE-S-18 (SAKE-10 label: カラメル様; actual component fixed here)|generic CID is stereo-unspecified; verify sensory-standard enantiomer/racemate|HOLD-STEREO: Hayashi SDS + PubChem connectivity; no wedge until SDS|
|11|`ethanethiol`|Ethanethiol|6343|75-08-1|`CCS`|`DNJIEGIFACGWOD-UHFFFAOYSA-N`|CHEBI:46511|SAKE-11; WINE-P-08; BEER-16 (SAKE-11 label: メルカプタン; actual component fixed here)|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|12|`dms`|Dimethyl sulfide|1068|75-18-3|`CSC`|`QMMFVYPAHWMCMS-UHFFFAOYSA-N`|CHEBI:17437|SAKE-12; WINE-P-09; BEER-08|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|13|`dmts`|Dimethyl trisulfide|19310|3658-80-8|`CSSSC`|`YWHLKYXPLRWGSE-UHFFFAOYSA-N`|not-fixed|SAKE-13; SHOCHU-12 (SAKE-13 label: ポリスルフィド; actual component fixed here)|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|14|`tca246`|2,4,6-Trichloroanisole|6884|87-40-1|`COC1=C(C=C(C=C1Cl)Cl)Cl`|`WCVOGSZTONGSQY-UHFFFAOYSA-N`|CHEBI:19333|SAKE-14; SHOCHU-20; WINE-S-16|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|15|`diacetyl`|Diacetyl / 2,3-butanedione|650|431-03-8|`CC(=O)C(=O)C`|`QSJXEFYPDANLFS-UHFFFAOYSA-N`|not-fixed|SAKE-15; SHOCHU-14; WINE-S-10; BEER-07|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|16|`hexanoic-acid`|Hexanoic acid|8892|142-62-1|`CCCCCC(=O)O`|`FUZZWVXGSFPDMH-UHFFFAOYSA-N`|not-fixed|SAKE-16 (SAKE-16 label: 脂肪酸; actual component fixed here)|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|17|`acetic-acid`|Acetic acid|176|64-19-7|`CC(=O)O`|`QTBSBXVTEAMEQO-UHFFFAOYSA-N`|not-fixed|SAKE-17; SHOCHU-13; WINE-P-11|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|18|`butyric-acid`|Butyric acid|264|107-92-6|`CCCC(=O)O`|`FERIUCNNQQJTOY-UHFFFAOYSA-N`|not-fixed|SAKE-18; WINE-P-12; BEER-06|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|19|`isovaleric-acid`|Isovaleric acid|10430|503-74-2|`CC(C)CC(=O)O`|`GWYFCOCPABKNJV-UHFFFAOYSA-N`|not-fixed|SAKE-19; WINE-P-13|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|20|`linalool`|Linalool|6549|78-70-6|`CC(=CCCC(C)(C=C)O)C`|`CDOSHBSSFJOMGT-UHFFFAOYSA-N`|not-fixed|SHOCHU-05; WINE-S-03; BEER-14|generic CID 6549 is stereo-unspecified/racemic identity|HOLD-STEREO: Hayashi SDS decides R/S/racemate; connectivity locked|
|21|`beta-damascenone`|β-Damascenone|5366074|23726-93-4|`C/C=C/C(=O)C1=C(C=CCC1(C)C)C`|`POIARNZEYGURDG-FNORWQNLSA-N`|not-fixed|SHOCHU-06; WINE-S-06|preserve E/trans geometry|LOCK-STEREO: PubChem isomeric SMILES -> RDKit|
|22|`vanillin`|Vanillin|1183|121-33-5|`COC1=C(C=CC(=C1)C=O)O`|`MWOOGOJBHIARFG-UHFFFAOYSA-N`|CHEBI:18346|SHOCHU-07; WINE-P-19|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|23|`edmp`|2-Ethyl-3,5-dimethylpyrazine|26334|13925-07-0|`CCC1=NC=C(N=C1C)C`|`JZBCTZLGKSYRSF-UHFFFAOYSA-N`|not-fixed|SHOCHU-09|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|24|`furfural`|Furfural|7362|98-01-1|`C1=COC(=C1)C=O`|`HYBBIBNJHNGZAN-UHFFFAOYSA-N`|not-fixed|SHOCHU-10|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|25|`ethyl-laurate`|Ethyl laurate / ethyl dodecanoate|7800|106-33-2|`CCCCCCCCCCCC(=O)OCC`|`MMXKVMNBHPAILY-UHFFFAOYSA-N`|CHEBI:87427|SHOCHU-18|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|26|`octenol`|1-Octen-3-ol|18827|3391-86-4|`CCCCCC(C=C)O`|`VSMOENVRRABVKN-UHFFFAOYSA-N`|CHEBI:34118|SHOCHU-19|C3 stereocenter unspecified in generic 1-octen-3-ol|HOLD-STEREO: Hayashi SHOCHU-19 SDS decides wedge; connectivity locked|
|27|`furaneol`|Furaneol / HDMF|19309|3658-77-3|`CC1C(=O)C(=C(O1)C)O`|`INAXVXBDKKUCGI-UHFFFAOYSA-N`|CHEBI:76247|WINE-S-01|tautomer/enantiomer records coexist; parent CID 19309 selected only for connectivity|HOLD-TAUTOMER: Hayashi WINE-S-01 SDS + literature/canonical depiction before SVG|
|28|`ibmp`|2-Isobutyl-3-methoxypyrazine|32594|24683-00-9|`CC(C)CC1=NC=CN=C1OC`|`UXFSPRAGHGMRSQ-UHFFFAOYSA-N`|not-fixed|WINE-S-02|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|29|`3mh`|3-Mercaptohexan-1-ol / 3MH|521348|51755-83-0|`CCCC(CCO)S`|`TYZFMFVWHZKYSE-UHFFFAOYSA-N`|CHEBI:77690|WINE-S-04|C3 stereocenter unspecified in generic 3MH|HOLD-STEREO: Hayashi WINE-S-04 SDS decides wedge; connectivity locked|
|30|`beta-ionone`|β-Ionone (E/trans)|638014|79-77-6; 14901-07-6|`CC1=C(C(CCC1)(C)C)/C=C/C(=O)C`|`PSQYTAPXSHCGMF-BQYQJAHWSA-N`|not-fixed|WINE-S-05|preserve E/trans geometry; PubChem reports CAS 79-77-6 and 14901-07-6|LOCK-STEREO: PubChem CID 638014 isomeric SMILES -> RDKit|
|31|`tdn`|TDN|121677|30364-38-6|`CC1=CC2=C(C=C1)C(CC=C2)(C)C`|`RTUMCNDCAVLXEP-UHFFFAOYSA-N`|not-fixed|WINE-S-07|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|32|`4vp`|4-Vinylphenol|62453|2628-17-3|`C=CC1=CC=C(C=C1)O`|`FUGYGGDSWSUORM-UHFFFAOYSA-N`|CHEBI:1883|WINE-S-12|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|33|`4eg`|4-Ethylguaiacol|62465|2785-89-9|`CCC1=CC(=C(C=C1)O)OC`|`CHWNEIVBYREQRF-UHFFFAOYSA-N`|not-fixed|WINE-S-13|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|34|`2ap`|2-Acetyl-1-pyrroline|522834|85213-22-5|`CC(=O)C1=NCCC1`|`DQBQWWSFRPLIAX-UHFFFAOYSA-N`|CHEBI:67125|WINE-S-14|canonical imine/ring depiction; do not substitute saturated ring|LOCK-CONNECTIVITY: PubChem CID 522834; inspect depiction after RDKit|
|35|`so2`|Sulfur dioxide|1119|7446-09-5|`O=S=O`|`RAHZWNYVWXNFOC-UHFFFAOYSA-N`|not-fixed|WINE-S-15|small inorganic; retain O=S=O|LOCK-CONNECTIVITY: PubChem CID 1119 -> RDKit, dedicated scale|
|36|`eugenol`|Eugenol|3314|97-53-0|`COC1=C(C=CC(=C1)CC=C)O`|`RRAFCDWBNXTKKO-UHFFFAOYSA-N`|not-fixed|WINE-S-17|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|37|`hexadienol`|trans,trans-2,4-Hexadien-1-ol|641256|17102-64-6|`C/C=C/C=C/CO`|`MEIRRNXMZYDVDW-MQQKCMAXSA-N`|not-fixed|WINE-P-01|preserve E,E geometry|LOCK-STEREO: PubChem isomeric SMILES -> RDKit|
|38|`cis3hexenol`|cis-3-Hexen-1-ol|5281167|928-96-1|`CC\C=C/CCO`|`UFLHIIWVXFIJGU-ARJAWSKDSA-N`|CHEBI:28857|WINE-P-02|preserve Z/cis geometry|LOCK-STEREO: PubChem isomeric SMILES -> RDKit|
|39|`geraniol`|Geraniol|637566|106-24-1|`CC(=CCC/C(=C/CO)/C)C`|`GLZPCOQZEFWAFX-JXMROGBWSA-N`|not-fixed|WINE-P-03; BEER-13|preserve geraniol E geometry|LOCK-STEREO: PubChem isomeric SMILES -> RDKit|
|40|`isobutanol`|Isobutanol|6560|78-83-1|`CC(C)CO`|`ZXEKIIBDNHEJCQ-UHFFFAOYSA-N`|not-fixed|WINE-P-05|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|41|`h2s`|Hydrogen sulfide|402|7783-06-4|`S`|`RWSOTUBLDIXVET-UHFFFAOYSA-N`|not-fixed|WINE-P-07 (欠番/SDSなし; learning reference)|explicit H–S–H required; PubChem SMILES S omits display hydrogens|LOCK-CONNECTIVITY: PubChem CID 402 + explicit H for depiction|
|42|`4ep`|4-Ethylphenol|31242|123-07-9|`CCC1=CC=C(C=C1)O`|`HXDOZKJGKXYMEW-UHFFFAOYSA-N`|not-fixed|WINE-P-15|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|43|`athp`|2-Acetyl-3,4,5,6-tetrahydropyridine|520300|27300-27-2|`CC(=O)C1=NCCCC1`|`GNZWXNKZMHJXNU-UHFFFAOYSA-N`|CHEBI:59533|WINE-P-16|CID 520300 is tautomeric tetrahydropyridine form; free base CAS 27300-27-2|HOLD-TAUTOMER: Hayashi WINE-P-16 SDS + NIST/J-GLOBAL/PubChem before SVG|
|44|`geosmin`|Geosmin|29746|19700-21-1|`C[C@H]1CCC[C@@]2([C@@]1(CCCC2)O)C`|`JLPUXFOGCDVKGO-TUAOUCFPSA-N`|CHEBI:46702|WINE-P-17|preserve natural (-)-geosmin stereochemistry 4S,4aS,8aR|LOCK-STEREO: PubChem CID 29746 isomeric SMILES -> RDKit|
|45|`styrene`|Styrene|7501|100-42-5|`C=CC1=CC=CC=C1`|`PPBRXRYQALVLMV-UHFFFAOYSA-N`|not-fixed|WINE-P-18|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|46|`guaiacol`|Guaiacol|460|90-05-1|`COC1=CC=CC=C1O`|`LHGVFZTZFXWLCP-UHFFFAOYSA-N`|not-fixed|WINE-P-20|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|47|`tca236`|2,3,6-Trichloroanisole|39656|50375-10-5|`COC1=C(C=CC(=C1Cl)Cl)Cl`|`OTFNCXLUCRUNCH-UHFFFAOYSA-N`|not-fixed|BEER-01|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|48|`3mbt`|3-Methyl-2-buten-1-thiol|146586|5287-45-6|`CC(=CCS)C`|`GYDPOKGOQFTYGW-UHFFFAOYSA-N`|not-fixed|BEER-03|none/unspecified; no E/Z required because one alkene carbon has duplicate methyl substituents|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|
|49|`trans2nonenal`|trans-2-Nonenal|5283335|18829-56-6|`CCCCCC/C=C/C=O`|`BSAIUMLZVGUGKX-BQYQJAHWSA-N`|CHEBI:142592|BEER-11|preserve E/trans geometry|LOCK-STEREO: PubChem isomeric SMILES -> RDKit|
|50|`citronellol`|Citronellol|8842|106-22-9|`CC(CCC=C(C)C)CCO`|`QMVPMAAFGQKVCJ-UHFFFAOYSA-N`|not-fixed|BEER-12|generic citronellol stereocenter unspecified|HOLD-STEREO: Hayashi BEER-12 SDS decides wedge; connectivity locked|
|51|`dcp26`|2,6-Dichlorophenol|6899|87-65-0|`C1=CC(=C(C(=C1)Cl)O)Cl`|`HOLHYSJJBXSLMV-UHFFFAOYSA-N`|not-fixed|BEER-15|none/unspecified; no wedge|LOCK: PubChem CID/connectivity + CAS/vendor concordance -> RDKit|

## Vendor / reagent cross-check

For all 51 rows, TCI / Sigma-Aldrich / other reagent-vendor catalogs are **identity corroboration only** using compound name + CAS. Vendor artwork is not a structure source and will not be copied into AROMA LAB. Exact vendor SKUs are intentionally not frozen because they can change independently of chemical identity.

## Special-case freeze gate

These seven remain deliberately blocked from final SVG freeze even though their connectivity/identity rows are complete:

- `sotolon`: generic PubChem identity does not choose the sensory-standard enantiomer/racemate.
- `linalool`: CID 6549 is stereochemically unspecified; Hayashi standard decides whether a wedge is justified.
- `octenol`: 1-octen-3-ol has a C3 stereocenter; generic CAS/CID does not choose R/S.
- `3mh`: generic 3MH has a C3 stereocenter; sensory-standard SDS must decide the depicted form.
- `citronellol`: generic identity does not choose the chiral form.
- `furaneol`: tautomer/enantiomer records coexist; choose the conventional sensory-standard depiction only after SDS/literature review.
- `athp`: CID 520300 is explicitly a tetrahydropyridine tautomer; free-base identity is CAS 27300-27-2. Freeze only after Hayashi WINE-P-16 SDS + NIST/J-GLOBAL/PubChem concordance.

## Fixed stereo / geometry

The following geometry is already source-defined and must survive RDKit generation:

- `beta-damascenone`: E/trans
- `beta-ionone`: E/trans (PubChem CID 638014)
- `hexadienol`: E,E
- `cis3hexenol`: Z/cis
- `geraniol`: E geraniol identity
- `geosmin`: natural (-)-geosmin stereochemistry
- `trans2nonenal`: E/trans

## Small inorganic handling

- `so2`: source graph is `O=S=O`; use dedicated scale but normal controlled SVG generation.
- `h2s`: PubChem canonical SMILES is `S`, which omits display hydrogens. The final depiction must explicitly show `H–S–H`; do not mistake the canonical SMILES display convention for the requested structural drawing.

## Stage status

**Stage ① — 51-source ledger: COMPLETE.**

Stage ② may consume `STRUCTURE_SOURCE_LEDGER.csv`; only rows whose `final_structure_source` begins with `LOCK` are eligible for immediate RDKit generation. `HOLD-*` rows stay out of the first normal batch.
