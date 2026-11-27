// 問い合わせフォームの選択肢。画面（ContactForm）と送信API（/api/contact）の両方がこれを使う。
// 「種類」は、頼めること3本（新規構築／改修／運用支援）に揃える（社長確定 2026-11-24）。
export const TYPE_OPTIONS = [
  "新規構築について",
  "改修について",
  "運用支援について",
  "その他",
] as const;

export const CHANNEL_OPTIONS = [
  "公式サイト",
  "検索・記事",
  "SNS",
  "広告",
  "知人・取引先からの紹介",
] as const;

// 自動送信を見分ける隠し入力欄の名前。ブラウザの自動入力が当たりにくい名前にする。
export const HONEYPOT_FIELD = "hp_check";
