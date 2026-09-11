# RICE LINEAGE — SOURCE LEDGER

Last reviewed: 2026-09-11

## Publication rule

RICE LINEAGE does not infer pedigree links. A visible lineage event requires documentary support from a public breeding or research source. `CROSS`, `SELECTION`, `MUTATION`, and origin states are kept distinct. `UNKNOWN` is not used as a visual filler.

The Arcade may use mission-only labels that are not yet part of the full archive graph, but only when the relationship is documented below. No mission may create a lineage edge solely to make a game question work.

## Verified relationships

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
| 出羽燦々 | 美山錦 × 華吹雪 | 山形県 |
| 秋田酒こまち | 秋系酒251 × 秋系酒306（1992人工交配） | 秋田県農業試験場 |
| 吟風 | （八反錦2号 × 上育404号）F1 × きらら397（1990交配） | 北海道立総合研究機構 |
| 雪女神 | 出羽の里 × 蔵の華 | 山形県 |

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
- 山形県 育成品種（出羽燦々・雪女神） — https://www.pref.yamagata.jp/documents/3639/h.30hinnsyu_sakumotu
- 秋田県農業試験場「秋田酒こまち」の育成 — https://www.pref.akita.lg.jp/uploads/public/archive_0000005709_00/kenkyuhokoku46-1.pdf
- 北海道立総合研究機構「吟風」の育成 — https://www.hro.or.jp/agricultural/center/publication/syuhou/2k/82-1.html

## Arcade v2 special-route interpretation

- `美山錦`: the second checkpoint asks for the breeding event `MUTATION`, not a fabricated second parent.
- `強力`: `ORIGIN / GOAL` is a valid answer. The game explicitly stops rather than attaching 強力 to an unsupported ancestor.
- `吟風`: the course exposes the documented intermediate F1 of `八反錦2号 × 上育404号`, then asks for `きらら397` as the other side of the final cross.
- `吟のさと`: `山田錦` is a direct parent of 吟のさと and also a parent of `西海222号`; the repeated appearance is intentional and documented.

## Boundary notes

- `愛山` is a descendant of `山田錦` through `山雄67`; it must not be labeled as a direct child of 山田錦.
- `吟のさと` has 山田錦 as a direct parent and 西海222号 as the other direct parent; because 西海222号 itself descends from 山田錦, both routes are shown intentionally.
- `八反錦` is not modeled as an ambiguous single node. The existing archive features `八反錦1号`; Arcade v2 uses the separately documented `八反錦2号` only within the 吟風 course.
- `強力` remains an independent origin / selection node unless a reliable source establishes a pedigree connection.
- Supporting breeding lines are structural nodes; their presence is not a claim that they are equivalent in status to featured sake-rice cultivars.
