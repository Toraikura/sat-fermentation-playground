# AROMA LAB Structure Audit

Branch: `aroma-lab-structure-audit`  
Scope: all 51 aroma compounds defined in `aroma-lab/app.js`.

## Audit goal

Replace runtime-dependent PubChem PNG rendering with a controlled local structure asset set after every compound has been checked.

## Drawing rules

1. Structure formula only. Do not replace with molecular formulas.
2. Functional-group hydrogen must stay attached to the heteroatom label.
   - right side: `-OH`
   - left side: `HO-`
   - never render alcohol/phenol as visually separated `-O-H`
   - carboxylic acids should read as a compact `COOH` / `C(=O)OH` group, not a detached O-H
3. Apply the same compact-label principle to thiols (`-SH` / `HS-`) where applicable.
4. Every structure gets a local asset at `aroma-lab/assets/structures/<id>.svg`.
5. Use one consistent drawing scale, stroke weight, atom-label font size, and transparent viewBox.
6. Center by the actual molecular bounding box, not by the source image canvas.
7. Small inorganic molecules (SO2/H2S) and very long molecules (ethyl laurate etc.) need dedicated scale rules.
8. Stereochemistry / E-Z geometry / tautomeric form must be checked where aroma identity depends on it.

## Priority

- **A**: redraw / chemistry validation mandatory before final placement.
- **B**: straightforward structure, but still needs local asset + centering/scale verification.

## Current source

The production UI currently requests 2D structure PNGs at runtime from PubChem using each row's `query` value. The audit will replace this dependency with local controlled SVGs.

## 51-compound audit table

| # | ID | 日本語名 | English | Current PubChem query | Family | OH/SH notation | Chemistry / layout check | Current render | Pri. |
|---:|---|---|---|---|---|---|---|---|:---:|
| 1 | `ethyl-acetate` | 酢酸エチル | Ethyl acetate | `Ethyl acetate` | ESTER | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 2 | `isoamyl-acetate` | 酢酸イソアミル | Isoamyl acetate | `Isoamyl acetate` | ESTER | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 3 | `ethyl-hexanoate` | カプロン酸エチル | Ethyl hexanoate | `ethyl hexanoate` | ESTER | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 4 | `ethanol` | エタノール | Ethanol | `Ethanol` | ALCOHOL | 末端OH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 5 | `isoamyl-alcohol` | イソアミルアルコール | Isoamyl alcohol | `3-methyl-1-butanol` | ALCOHOL | 末端OH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 6 | `phenethyl-alcohol` | フェネチルアルコール | 2-Phenylethanol | `2-phenylethanol` | ALCOHOL | 末端OH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 7 | `acetaldehyde` | アセトアルデヒド | Acetaldehyde | `Acetaldehyde` | ALDEHYDE | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 8 | `isovaleraldehyde` | イソバレルアルデヒド | 3-Methylbutanal | `3-methylbutanal` | ALDEHYDE | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 9 | `4vg` | 4-ビニルグアイアコール | 4-Vinylguaiacol | `4-vinylguaiacol` | PHENOL | フェノールOH | 中心・余白・縮尺を確認 | △ 表示あり／下寄り・下端切れ | **A** |
| 10 | `sotolon` | ソトロン | Sotolon | `sotolon` | FURANONE | OH / 互変異性確認 | 互変異性・環内結合の見え方 | 未確認 | **A** |
| 11 | `ethanethiol` | エタンチオール | Ethanethiol | `ethanethiol` | SULFUR | 末端SH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 12 | `dms` | ジメチルスルフィド | Dimethyl sulfide | `dimethyl sulfide` | SULFUR | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 13 | `dmts` | ジメチルトリスルフィド | Dimethyl trisulfide | `dimethyl trisulfide` | SULFUR | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 14 | `tca246` | 2,4,6-トリクロロアニソール | 2,4,6-Trichloroanisole | `2,4,6-trichloroanisole` | HALOAROMATIC | — | 中心・余白・縮尺を確認 | △ 表示あり／左寄り気味 | **B** |
| 15 | `diacetyl` | ジアセチル | Diacetyl | `2,3-butanedione` | DIKETONE | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 16 | `hexanoic-acid` | ヘキサン酸 | Hexanoic acid | `hexanoic acid` | ACID | COOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 17 | `acetic-acid` | 酢酸 | Acetic acid | `Acetic acid` | ACID | COOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 18 | `butyric-acid` | 酪酸 | Butyric acid | `butanoic acid` | ACID | COOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 19 | `isovaleric-acid` | イソ吉草酸 | Isovaleric acid | `3-methylbutanoic acid` | ACID | COOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 20 | `linalool` | リナロール | Linalool | `Linalool` | TERPENE ALCOHOL | OH | 立体/二重結合配置を確認 | 未確認 | **A** |
| 21 | `beta-damascenone` | β-ダマセノン | β-Damascenone | `beta-damascenone` | NORISOPRENOID | — | 二重結合配置の確認 | 未確認 | **A** |
| 22 | `vanillin` | バニリン | Vanillin | `Vanillin` | PHENOLIC ALDEHYDE | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 23 | `edmp` | 2-エチル-3,5-ジメチルピラジン | 2-Ethyl-3,5-dimethylpyrazine | `2-ethyl-3,5-dimethylpyrazine` | PYRAZINE | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 24 | `furfural` | フルフラール | Furfural | `Furfural` | FURAN ALDEHYDE | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 25 | `ethyl-laurate` | ラウリン酸エチル | Ethyl laurate | `ethyl dodecanoate` | ESTER | — | 長鎖。縮小しすぎ注意 | 未確認 | **A** |
| 26 | `octenol` | 1-オクテン-3-オール | 1-Octen-3-ol | `1-octen-3-ol` | ALCOHOL | OH | 位置異性・OH位置確認 | 未確認 | **A** |
| 27 | `furaneol` | 4-ヒドロキシ-2,5-ジメチル-3(2H)-フラノン | Furaneol / HDMF | `furaneol` | FURANONE | OH / 互変異性確認 | 互変異性・環内結合の見え方 | 未確認 | **A** |
| 28 | `ibmp` | 2-イソブチル-3-メトキシピラジン | IBMP | `2-isobutyl-3-methoxypyrazine` | PYRAZINE | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 29 | `3mh` | 3-メルカプトヘキサノール | 3-Mercaptohexan-1-ol / 3MH | `3-mercaptohexan-1-ol` | SULFUR ALCOHOL | 末端OH + SH | OH/SHを連続表記、立体中心確認 | 未確認 | **A** |
| 30 | `beta-ionone` | β-イオノン | β-Ionone | `beta-ionone` | NORISOPRENOID | — | 環・二重結合配置を確認 | 未確認 | **A** |
| 31 | `tdn` | 1,1,6-トリメチル-1,2-ジヒドロナフタレン | TDN | `1,1,6-trimethyl-1,2-dihydronaphthalene` | AROMATIC | — | 縮合環・二重結合位置を確認 | 未確認 | **A** |
| 32 | `4vp` | 4-ビニルフェノール | 4-Vinylphenol / 4VP | `4-vinylphenol` | PHENOL | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 33 | `4eg` | 4-エチルグアヤコール | 4-Ethylguaiacol / 4EG | `4-ethylguaiacol` | PHENOL | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 34 | `2ap` | 2-アセチル-1-ピロリン | 2-Acetyl-1-pyrroline | `2-acetyl-1-pyrroline` | HETEROCYCLE | — | 環内二重結合/互変異性の確認 | 未確認 | **A** |
| 35 | `so2` | 二酸化硫黄 | Sulfur dioxide | `sulfur dioxide` | SULFUR OXIDE | — | 小分子。専用拡大・中央配置 | 未確認 | **A** |
| 36 | `eugenol` | オイゲノール | Eugenol | `eugenol` | PHENOL | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 37 | `hexadienol` | trans,trans-2,4-ヘキサジエノール | trans,trans-2,4-Hexadien-1-ol | `trans,trans-2,4-hexadien-1-ol` | ALCOHOL | 末端OH | E,E 表記・二重結合配置 | 未確認 | **A** |
| 38 | `cis3hexenol` | cis-3-ヘキセノール | cis-3-Hexen-1-ol | `cis-3-hexen-1-ol` | ALCOHOL | 末端OH | cis/Z 配置確認 | 未確認 | **A** |
| 39 | `geraniol` | ゲラニオール | Geraniol | `Geraniol` | TERPENE ALCOHOL | 末端OH | E 配置確認 | 未確認 | **A** |
| 40 | `isobutanol` | イソブタノール | Isobutanol | `2-methyl-1-propanol` | ALCOHOL | 末端OH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 41 | `h2s` | 硫化水素 | Hydrogen sulfide | `hydrogen sulfide` | SULFUR | H–S–H（専用表記） | 小分子。H–S–Hを専用拡大 | 未確認 | **A** |
| 42 | `4ep` | 4-エチルフェノール | 4-Ethylphenol / 4EP | `4-ethylphenol` | PHENOL | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 43 | `athp` | 2-アセチル-3,4,5,6-テトラヒドロピリジン | ATHP | `2-acetyl-3,4,5,6-tetrahydropyridine` | HETEROCYCLE | — | 環内構造・互変異性/プロトン位置確認 | 未確認 | **A** |
| 44 | `geosmin` | ジオスミン | Geosmin | `geosmin` | TERPENOID | — | 立体化学確認 | 未確認 | **A** |
| 45 | `styrene` | スチレン | Styrene | `styrene` | AROMATIC | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 46 | `guaiacol` | グアヤコール | Guaiacol | `guaiacol` | PHENOL | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 47 | `tca236` | 2,3,6-トリクロロアニソール | 2,3,6-Trichloroanisole | `2,3,6-trichloroanisole` | HALOAROMATIC | — | 中心・余白・縮尺を確認 | 未確認 | **B** |
| 48 | `3mbt` | 3-メチル-2-ブテン-1-チオール | 3-Methyl-2-buten-1-thiol | `3-methyl-2-buten-1-thiol` | SULFUR | 末端SH | 中心・余白・縮尺を確認 | 未確認 | **A** |
| 49 | `trans2nonenal` | trans-2-ノネナール | trans-2-Nonenal | `trans-2-nonenal` | ALDEHYDE | — | trans/E 配置確認 | 未確認 | **A** |
| 50 | `citronellol` | シトロネロール | Citronellol | `citronellol` | TERPENE ALCOHOL | 末端OH | 立体中心確認 | 未確認 | **A** |
| 51 | `dcp26` | 2,6-ジクロロフェノール | 2,6-Dichlorophenol | `2,6-dichlorophenol` | HALOPHENOL | フェノールOH | 中心・余白・縮尺を確認 | 未確認 | **A** |

## Screenshot-confirmed issues

- `4vg` / 4-ビニルグアイアコール: structure is present, but the drawing sits too low and is clipped at the bottom in the current card.
- `tca246` / 2,4,6-トリクロロアニソール: structure is present, but the molecular drawing is visually left-shifted inside the structure panel.
- The clove card not returning from the back face is tracked separately as a card interaction bug; it is not a structure-asset defect.

## Next audit pass

1. Render all 51 structure sources in a single inspection sheet.
2. Mark each row `OK / MISSING / WRONG FORM / OFF-CENTER / LABEL FIX`.
3. Build the 51 local SVG masters.
4. Replace PubChem runtime URLs with local SVG paths only after the set is complete.
5. Then fix card interaction behavior (including the clove card) against the stable final DOM/assets.
