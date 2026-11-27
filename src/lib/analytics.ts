// Google アナリティクス（GA4）へ、サイト内の操作を送る。タグ本体は src/app/layout.tsx。
// 送るのは、場所・行き先・種類だけ。入力した内容や名前、メールアドレスは送らない。
//
// イベント一覧（GA4 の「click」は自動計測が使う名前なので、使わない）：
//   cta_click      問い合わせページへのリンク              location
//   nav_click      ヘッダーのナビ                          location, link_path
//   content_click  事例・記事の詳細へのリンク              location, content_type, link_path
//   link_click     その他のサイト内リンク                  location, link_path
//   external_click 外部サイトへのリンク                    location, link_url
//   tool_click     ツールのアイコン                        tool
//   generate_lead  フォームの送信が成功した（GA4 の推奨名）inquiry_type

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, string> = {}) {
  window.gtag?.("event", event, params);
}
