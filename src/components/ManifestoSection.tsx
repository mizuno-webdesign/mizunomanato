export default function ManifestoSection() {
  return (
    <section
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px) clamp(60px, 8vw, 100px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: "28px",
        }}
      >
        Statement of practice
      </div>
      <p
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "clamp(24px, 3.5vw, 44px)",
          lineHeight: 1.45,
          fontStyle: "italic",
          maxWidth: "1100px",
          margin: "0 auto",
          fontWeight: 400,
        }}
      >
        EC構築・改善・運用支援まで。
        <br />
        状況に合わせて、
        <span
          style={{
            fontStyle: "normal",
            fontFamily: "var(--font-body), 'Hiragino Kaku Gothic ProN', sans-serif",
          }}
        >
          無理のない一手
        </span>
        を提案します。
      </p>
    </section>
  );
}
