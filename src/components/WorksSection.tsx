import SectionHead from "./SectionHead";
import Arrow from "./Arrow";
import { WORKS } from "@/lib/data";

function WorkPlaceholder({
  label,
  ratio = "16 / 9",
}: {
  label: string;
  ratio?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: ratio,
        background:
          "repeating-linear-gradient(135deg, #f0ece2 0 10px, #ebe6d8 10px 20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(50,40,30,0.5)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "10px",
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </div>
  );
}

export default function WorksSection() {
  const featured = WORKS[0];
  const second = WORKS[1];
  const third = WORKS[2];
  const rest = WORKS.slice(3);

  return (
    <section
      id="works"
      style={{
        padding: "60px clamp(20px, 5vw, 56px) 120px",
        background: "var(--paper-alt)",
      }}
    >
      <SectionHead
        num="02"
        label="Works"
        title="Selected projects."
        trailing={`${WORKS.length} entries`}
      />

      {/* フィーチャードグリッド */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px",
          marginBottom: "56px",
        }}
      >
        {/* フィーチャード */}
        <div>
          <WorkPlaceholder label="FEATURED WORK · 01" ratio="16 / 9" />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            <span>{featured.category}</span>
            <span>{featured.year}</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "32px",
              marginTop: "10px",
              lineHeight: 1.3,
              fontWeight: 400,
            }}
          >
            {featured.title}
          </div>
          <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "6px" }}>
            {featured.note}
          </div>
        </div>

        {/* 2件目・3件目 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[second, third].map((w, i) => (
            <div key={w.id}>
              <WorkPlaceholder label={`WORK · 0${i + 2}`} ratio="16 / 9" />
              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                <span>{w.category}</span>
                <span>{w.year}</span>
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  marginTop: "6px",
                  lineHeight: 1.55,
                }}
              >
                {w.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* リスト形式 */}
      <div style={{ borderTop: "1px solid var(--ink-soft)" }}>
        {rest.map((w, i) => (
          <div
            key={w.id}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr auto auto 28px",
              gap: "24px",
              padding: "22px 0",
              alignItems: "center",
              borderBottom: "1px solid var(--ink-softer)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.5,
              }}
            >
              0{i + 4}
            </span>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>{w.title}</span>
            <span style={{ fontSize: "12.5px", opacity: 0.7 }}>{w.note}</span>
            <span
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.6,
              }}
            >
              {w.category}
            </span>
            <Arrow size={14} />
          </div>
        ))}
      </div>
    </section>
  );
}
