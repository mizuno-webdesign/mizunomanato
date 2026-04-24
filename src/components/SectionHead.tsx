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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "56px",
        paddingBottom: "20px",
        borderBottom: "1px solid var(--ink-soft)",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        § {num} · {label}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "clamp(36px, 5vw, 64px)",
          margin: 0,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          fontWeight: 400,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
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
