import SectionHead from "./SectionHead";
import { SERVICES } from "@/lib/data";

export default function ServiceSection() {
  return (
    <section
      id="service"
      style={{
        padding: "60px clamp(20px, 5vw, 56px) 120px",
      }}
    >
      <SectionHead num="01" label="Service" title="Service" trailing="01 — 03" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {SERVICES.map((sv, i) => (
          <div
            key={sv.key}
            style={{
              padding: "0 clamp(16px, 3vw, 36px)",
              borderRight:
                i < SERVICES.length - 1 ? "1px solid var(--ink-softer)" : "none",
              paddingLeft: i === 0 ? 0 : undefined,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display), 'Times New Roman', serif",
                fontSize: "clamp(60px, 8vw, 96px)",
                lineHeight: 1,
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                fontWeight: 400,
              }}
            >
              {sv.no}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display), 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "20px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: 400,
              }}
            >
              {sv.en}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 500,
                marginBottom: "20px",
                lineHeight: 1.4,
              }}
            >
              {sv.ja}
            </div>
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.95,
                opacity: 0.82,
                minHeight: "90px",
                marginBottom: "28px",
              }}
            >
              {sv.lead}
            </div>
            <div
              style={{
                borderTop: "1px solid var(--ink-soft)",
                paddingTop: "18px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 12px",
              }}
            >
              {sv.tags.map((tag) => (
                <span
                  key={tag}
                  style={{ fontSize: "12px", opacity: 0.78 }}
                >
                  — {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
