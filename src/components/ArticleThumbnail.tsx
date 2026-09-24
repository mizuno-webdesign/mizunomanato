// 記事にサムネイル画像（mainImage）が未設定の場合に表示する代替ビジュアル。
// 画像運用の手間をかけずに済むよう、タイトルを使ったタイポグラフィのみで構成する。
// 既存デザインのトーン（--ink背景 + --inverse文字色、明朝体）を踏襲し、
// カテゴリ別の色分けなど新しい配色ルールは持ち込まない。
//
// variant:
//  - "card" : 一覧・TOPカードの 4:3 枠向け。
//  - "hero" : 記事詳細ページの 16:7 横長帯向け。card よりやや大きめの文字サイズ。
// どちらもタイトル全文を中央に表示する。和文と半角数字が混在しうるため、
// 和文対応の明朝体（Shippori Mincho）を優先フォントに指定する。
const TITLE_FONT_FAMILY =
  "var(--font-display-jp), var(--font-display), 'Times New Roman', serif";

export default function ArticleThumbnail({
  title,
  variant = "card",
}: {
  title: string;
  variant?: "card" | "hero";
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(32px, 8vw, 64px)",
      }}
    >
      <span
        style={{
          fontFamily: TITLE_FONT_FAMILY,
          fontSize: variant === "hero" ? "clamp(20px, 3vw, 34px)" : "clamp(17px, 2.4vw, 24px)",
          fontWeight: 400,
          color: "var(--inverse)",
          lineHeight: 1.4,
          textAlign: "center",
          maxWidth: variant === "hero" ? "800px" : undefined,
        }}
      >
        {title}
      </span>
    </div>
  );
}
