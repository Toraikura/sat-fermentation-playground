# RICE LINEAGE — SOURCE LEDGER

Last reviewed: 2026-09-10

## Publication rule

RICE LINEAGE does not infer pedigree links. A visible lineage event requires documentary support from a public breeding or research source. `CROSS`, `SELECTION`, `MUTATION`, and origin states are kept distinct. `UNKNOWN` is not used as a visual filler.

## Verified v1 relationships

| Child / target | Relationship shown | Source |
|---|---|---|
| 短稈渡船 | 雄町の株選抜 | 酒類総合研究所 |
| 山田錦 | 山田穂 × 短稈渡船（1923交配） | 農研機構 / 酒類総合研究所 |
| 菊水 | 中支旭 × 雄町 | 岡山県 |
| 五百万石 | 菊水 × 新200号（1938交配） | 農研機構 |
| 越淡麗 | 山田錦 × 五百万石 | 農研機構 |
| 美山錦 | たかね錦のガンマ線照射による突然変異 | 農研機構 |
| 金紋錦 | たかね錦 × 山田錦 | 農研機構 |
| 八反錦1号 | 八反35号 × アキツホ（1973交配） | 広島県 / 農研機構 |
| 山雄67 | 山田錦 × 雄町 | 農研機構 / 兵庫県立農林水産技術総合センター |
| 愛山 | 愛船117 × 山雄67 | 兵庫県立農林水産技術総合センター |
| 若水 | あ系酒101 × 五百万石 | 農研機構 |
| さがの華 | 若水 × 山田錦 | 農研機構 |
| 西海134号 | シラヌイ × 山田錦 | 農研機構 |
| 西海222号 | 山田錦 × 89H624 | 農研機構 |
| 吟のさと | 山田錦 × 西海222号 | 農研機構 |
| 壽限無 | 夢一献 × 山田錦 | 農研機構 / JA全農ふくれん |
| 華錦 | 夢いずみ × 山田錦 | 農研機構 / 熊本県 |
| レイホウ | 西海62号 × 綾錦 | 農研機構 |
| 強力 | 鳥取在来種から選抜。未確認の親へ接続しない | 鳥取県 |

## Source URLs

- 岡山県 — https://www.pref.okayama.jp/uploaded/attachment/374892.pdf
- 酒類総合研究所 — https://www.nrib.go.jp/data/pdf/nrt/2017_1.pdf
- 農研機構 山田穂 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=HYKE000010
- 農研機構 山田錦 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=HYKE000070
- 農研機構 五百万石 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=NICE000110
- 農研機構 たかね錦 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=SKU0001900
- 広島県 八反錦 — https://www.pref.hiroshima.lg.jp/uploaded/attachment/542318.pdf
- 鳥取県 強力 — https://www.pref.tottori.lg.jp/291900.htm
- 兵庫県立農林水産技術総合センター 愛山 — https://hyogo-nourinsuisangc.jp/nourinsuisan/kenpounou/12/17/5095/
- 農研機構 若水 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=AIC0000510
- 農研機構 吟のさと — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=inedata_hinsyu&ineCode=SAI0002550
- JA全農ふくれん 壽限無 — https://zennoh-fukuren.jp/meshimaru/rice/sakekome.html
- 熊本県 華錦 — https://www.pref.kumamoto.jp/soshiki/75/846.html
- 農研機構 綾錦 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=AICE003640
- 農研機構 八反35号 — https://ineweb.dna.naro.go.jp/search/ine.cgi?action=oyahinsyu&ineCode=Z000001309
- 農研機構 五百万石来歴 — https://www.naro.go.jp/publicity_report/press/laboratory/carc/014007.html

## v1 boundary notes

- `愛山` is a descendant of `山田錦` through `山雄67`; it must not be labeled as a direct child of 山田錦.
- `吟のさと` has 山田錦 as a direct parent and 西海222号 as the other direct parent; because 西海222号 itself descends from 山田錦, the graph intentionally shows both paths.
- `八反錦` is not modeled as an ambiguous single node. v1 features `八反錦1号`, with `八反35号` and `アキツホ` as parents.
- `強力` remains an independent origin / selection node unless a reliable source establishes a pedigree connection.
- Supporting breeding lines are smaller visual nodes; their presence is structural, not a claim that they are equivalent in status to featured sake-rice cultivars.
