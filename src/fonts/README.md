# site-sans-400.woff2 / site-sans-700.woff2

サイトで使う文字（固定の文言、一覧に出る題名、かな・英数字）だけをまとめた日本語フォント。
分割されたフォントを何十個も読み込まずに済むので、表示が速くなる。書体は同じで、見た目は変わらない。

## 元のフォントとライセンス
- 元：IBM Plex Sans JP（Copyright 2018 IBM Corp.）。`next/font/google` がビルド時に取得したファイルから作る。
- ライセンス：SIL Open Font License 1.1（http://scripts.sil.org/OFL）。著作権表示とライセンスの参照先は、ファイル内の情報に残している。
- 加工した版には予約名「Plex」を使えないため、フォント内部の名前は「Site Sans JP」にしている。

## 作り直すとき
固定の文言を大きく変えたり、事例や記事を足したりしたら作り直す。
**忘れても表示は崩れない。** ここにない文字は IBM Plex Sans JP の分割ファイルで表示される（その分、読み込みが少し増える）。

```
npm run build
npm run start -- -p 3101
python scripts/make-site-font.py http://localhost:3101
```

必要なもの：Python の fontTools と brotli。作り直したら、もう一度ビルドして表示を確認し、コミットする。
記事の本文は対象にしていない（漢字の種類が多く、ファイルが大きくなるため）。
