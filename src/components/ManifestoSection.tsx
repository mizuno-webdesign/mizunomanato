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
          fontFamily: "var(--font-ui)",
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
        状況に合わせ、最適な伴走をいたします。
      </p>
    </section>
  );
}
