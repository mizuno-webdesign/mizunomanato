import Link from "next/link";
import Arrow from "./Arrow";

// 記事詳細ページ末尾に置く問い合わせCTA。
// ContactSection と同じダークベース（--ink背景 + --inverse文字色）に、
// HeroSection のSP用CTAボタン（--inverse背景の白ボタン + Arrow）と同じトーンを組み合わせている。
// フォーム自体は持たず、Contactセクション（トップページ）への導線として機能する。
export default function ArticleCta() {
  return (
    <div
      style={{
        background: "var(--ink)",
        color: "var(--inverse)",
        padding: "64px clamp(20px, 5vw, 56px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 400,
          lineHeight: 1.4,
          marginBottom: "32px",
        }}
      >
        EC構築・改修・運用に関する
        <br className="sp-break" />
        お問い合わせ
      </div>
      <Link
        href="/#contact"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "16px 40px",
          background: "var(--inverse)",
          color: "var(--ink)",
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        無料相談する
        <Arrow size={13} color="var(--ink)" />
      </Link>
    </div>
  );
}
