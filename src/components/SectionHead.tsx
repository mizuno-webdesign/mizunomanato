interface SectionHeadProps {
  num: string;
  label: string;
  title: string;
  trailing: string;
}

export default function SectionHead({
  num,
  label,
  title,
  trailing,
}: SectionHeadProps) {
  return (
    <div
      style={{
        marginBottom: "56px",
        paddingBottom: "20px",
        borderBottom: "1px solid var(--ink-soft)",
        position: "relative",
        textAlign: "center",
      }}
    >
      <div
        className="section-head-label"
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        § {num} · {label}
      </div>
      <h2
        className="fade-up"
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "clamp(36px, 5vw, 64px)",
          margin: 0,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          fontWeight: 400,
          display: "inline-block",
        }}
      >
        {title}
      </h2>
      <div
        className="section-head-trailing"
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        {trailing}
      </div>
    </div>
  );
}
