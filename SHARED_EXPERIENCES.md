# SAT / PLAYGROUND 共通ゲーム一覧

公開元はこのリポジトリの `gh-pages` ブランチです。

- データ: `shared-experiences.json`
- 両サイト共通の反映処理: `shared-experiences.js`
- 軽量画像: `assets/shared-experiences/`
- 読み込み先: PLAYGROUNDトップ、SAT日本語トップ、SAT英語トップ

## 更新手順

1. ゲームの画像を軽量WebPにし、必要なら `assets/shared-experiences/` に追加します。
2. `shared-experiences.json` の `games` に1件を追加、または既存IDの項目を編集します。
3. JSONと画像を `gh-pages` に公開します。SATの再公開は不要です。
4. 公開URLの一覧データと画像のHTTP応答を確認します。

最低限の項目は既存2件をコピーして設定してください。

- `id`: 変更しない一意の半角ID。英小文字・数字・ハイフン。
- `title`: SATで行分けするタイトル配列（1〜2行）。Hubでは空白で連結。
- `url`: 公開済みのゲームURL。
- `group`: `aroma` / `rice` / `shubo`。Hubでの配置先。
- `type`, `route`: Hubカードの短いラベル。
- `description.ja`, `description.en`: 説明。
- `image.src`, `image.width`, `image.height`, `image.position`: 絶対画像URL・寸法・切り抜き位置。

URLは現在 `https://toraikura.github.io/` と `https://sakearttokyo.com/` のみ許可します。別ホストを使うときは共通スクリプト側も確認してください。

## 反映範囲と表示

現在の共通対象はSHUBO DIVE、SHUBO、および今後ここへ追加するカードです。既存のSAKE CLASH / RICE LINEAGE / AROMA LABO / AROMA MATCH / SHUBO RUNとPATHWAYは、このJSONへ重複登録しないでください。専用の起動処理・表示を維持しています。

共通カードの並びはJSONの順です。SATではPATHWAYの前、Hubでは各入口の既存カードより前に表示します。Hubの体験件数と構造化データも更新します。JSONから削除すると共通対象カードのみ非表示になります。

SATの画像は既存のARCADE付近の遅延読み込みを利用し、Hubの画像は `loading="lazy"` です。ゲーム本体は読み込みません。

ネットワークエラー、不正なJSON、4秒のタイムアウト時には、ページに同梱した直近の静的カードを維持します。現在開いているページへのライブ配信ではなく、ページを開き直したときに取得します。CDNキャッシュにより両サイトで反映に時間差が出る場合があります。

初期HTMLのカード・件数・構造化データは公開時点のフォールバックです。新しいJSONを取得できるブラウザーでは更新されます。JavaScript無効時の表示や初期HTMLのSEO情報も更新する場合は、各ページのフォールバックを合わせて更新してください。

## 今回の確認範囲

JSON・JavaScript構文、Node上のカード同期、公開ファイルとHTTP応答を確認します。ユーザー指定により、実ゲーム対戦・Safariの自動チェックは行いません。
