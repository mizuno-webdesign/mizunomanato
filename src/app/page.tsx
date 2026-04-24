export default function Home() {
  return (
    <main
      style={{
        background: "var(--ink)",
        color: "var(--inverse)",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "var(--font-body), 'Hiragino Kaku Gothic ProN', sans-serif",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "clamp(48px, 8vw, 96px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          fontWeight: 400,
          marginBottom: "48px",
        }}
      >
        <div>Coming</div>
        <div style={{ fontStyle: "italic", opacity: 0.75 }}>soon.</div>
      </div>

      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.5,
          marginBottom: "24px",
        }}
      >
        Manato Mizuno — EC構築・運用パートナー
      </div>

      <div style={{ fontSize: "14px", lineHeight: 2, opacity: 0.7 }}>
        現在サイトを準備中です。
        <br />
        ご相談は下記よりお気軽にどうぞ。
      </div>

      <a
        href="mailto:mizuno.webdesign@gmail.com"
        style={{
          marginTop: "40px",
          padding: "16px 32px",
          border: "1px solid rgba(235,231,218,0.3)",
          color: "var(--inverse)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        お問い合わせ
      </a>
    </main>
  );
}
