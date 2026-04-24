import SectionHead from "./SectionHead";

const CHANNELS: { label: string; items: string[] }[] = [
  {
    label: "Platform",
    items: ["Shopify", "COLOR ME", "Futureshop", "Amazon", "楽天市場", "Yahoo!ショッピング"],
  },
  {
    label: "Advertising",
    items: ["Google", "Meta", "Yahoo", "Microsoft", "Criteo"],
  },
  {
    label: "Analytics",
    items: ["GA4", "Google Search Console", "Clarity"],
  },
];

function Portrait() {
  return (
    <div
      style={{
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        background:
          "repeating-linear-gradient(135deg, #eae4d8 0 6px, #e3dccc 6px 12px)",
        flexShrink: 0,
      }}
    />
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
        title="About"
        trailing="Profile"
      />

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
        <Portrait />

        {/* テキスト */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              lineHeight: 1.2,
              marginBottom: "8px",
              fontWeight: 400,
            }}
          >
            Manato Mizuno
          </div>
          <div
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "22px",
              fontWeight: 400,
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

        </div>
      </div>
      </div>

      {/* 対応チャネル — 自己紹介テキスト幅に揃える */}
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div
        className="about-channels"
        style={{
          marginTop: "40px",
          paddingLeft: "100px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px 32px",
        }}
      >
        {CHANNELS.map(({ label, items }) => (
          <div key={label}>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.45,
                marginBottom: "10px",
              }}
            >
              {label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "12px",
                    letterSpacing: "0.04em",
                    opacity: 0.75,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
