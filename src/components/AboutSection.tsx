import SectionHead from "./SectionHead";
import { STATS } from "@/lib/data";

function Portrait() {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4 / 5",
        background:
          "repeating-linear-gradient(135deg, #eae4d8 0 10px, #e3dccc 10px 20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(50,40,30,0.5)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "10px",
        letterSpacing: "0.08em",
      }}
    >
      PORTRAIT / WORKBENCH
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px)",
      }}
    >
      <SectionHead
        num="03"
        label="About"
        title="Who is behind this."
        trailing="Profile"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "64px",
        }}
      >
        {/* 写真 */}
        <div>
          <Portrait />
          <div
            style={{
              marginTop: "20px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              lineHeight: 1.9,
            }}
          >
            Fig. 03 · Shizuoka, 2026
            <br />
            Father of two · cooking · gardening
          </div>
        </div>

        {/* テキスト */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              lineHeight: 1.2,
              marginBottom: "8px",
              fontWeight: 400,
            }}
          >
            <span style={{ fontStyle: "italic" }}>Manato</span> Mizuno
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 500,
              marginBottom: "32px",
            }}
          >
            水野 学人
          </div>

          <div
            style={{
              fontSize: "15px",
              lineHeight: 2.1,
              maxWidth: "640px",
            }}
          >
            <p style={{ margin: "0 0 22px" }}>
              ECサイトは作っただけでは売れません。
              <br />
              何を改善すべきか、どこから手を付けるべきか。
              <br />
              そこが見えないまま、手が止まってしまう方がとても多いと感じています。
            </p>
            <p style={{ margin: 0 }}>
              事業会社のEC部門で約10年、運用・改善を現場で経験してきました。
              その知見をもとに、ECサイトの売れる仕組みを設計し、
              無理なく運用していけるよう伴走支援をしています。
            </p>
          </div>

          {/* 統計 */}
          <div
            style={{
              marginTop: "48px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              borderTop: "1px solid var(--ink-soft)",
              paddingTop: "24px",
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-display), 'Times New Roman', serif",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    lineHeight: 1,
                    fontWeight: 400,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    opacity: 0.55,
                    marginTop: "8px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
