# 【DartSass】Gulp環境（スマホファースト）

## 環境
- Nodeはバージョン14以降

## 使い方
- ダウンロードしたフォルダを開く
- ターミナルを開き、 npm i とコマンドを入力
- node_modulesとpackage-lock.jsonが生成されるのを確認する
- 「 npx gulp 」とコマンドを入力すると動き出します

### gulp起動後
- ローカル上でサーバー立ち上げ
- scss, 画像については変更時、常にwebp化, css化
- リロード時にローカルサーバーの自動リロード


### Sassについて
base    ・・・ 初期状態化のscss（reset.css）
global  ・・・ レスポンシブの記述や基本的な@mixinの記述
layout　・・・ flex, margin, padding, font-sizeの簡易記述処理（grid作成中）
module, page   

module, pageは案件ごとに使い分け
自由に使用してください。
自分の場合は
page → そのページでしか使用しないcss記述
module →　複数のページや箇所で使用するモジュールのcss記述

#### globalディレクトリについて
**_setting.scss**
コンテンツ幅、フォント主に使用するカラー, ブレイクポイントなどの指定

スマホファーストのコーディングをしているためレスポンシブについては、
@include mq(md) {
}
↓
@media screen and (min-width: 768px) {
}
を僕は多用しています。


font-sizeはレスポンシブを考慮して、remで指定をしています。
ルートのfont-sizeをvwで設定することによって、画面幅によって自動的にfont-sizeが変わっていきます。
html
.text {
  font-size: rem(20);
}
上記で20pxと同等の指定が可能です。

#### layoutディレクトリについて
共通する箇所が多いcssはlayoutフォルダにまとめて処理を書いています。（flex, margin, padding, font-size）
data属性で管理をしています。

<div class="test flex" data-dir="min:row md:column">
</div>
上記のような記述で
.test {
  display: flex;
  flex-direction: row;
}
@media screen and (min-width: 768px) {
  .test {
    flex-direction: column;
  }
}
と同等になります。

その他にも便利な記述が複数あるので、利用してください。
またmargin, padding, gapなどの余白関係はすべて８の倍数で統一し管理をしています。
min:1 → 8px 
min:2 → 16px 
....
