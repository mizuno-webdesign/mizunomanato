export default function FooterSection() {
  return (
    <footer
      style={{
        padding: "40px clamp(20px, 5vw, 56px) 56px",
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
        }}
      >
        © 2026 Manato Mizuno
      </div>
    </footer>
  );
}
