export default function FooterSection() {
  return (
    <footer
      style={{
        padding: "40px clamp(20px, 5vw, 56px) 56px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "17px",
          letterSpacing: "0.14em",
          fontWeight: 400,
        }}
      >
        Manato Mizuno
      </div>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        © MMXXVI · EC Build, Rethink &amp; Operate
      </div>
    </footer>
  );
}
