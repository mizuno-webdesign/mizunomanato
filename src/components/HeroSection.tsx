import Arrow from "./Arrow";

const NAV_ITEMS = ["Service", "Works", "About", "Topics", "Contact"];

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        background: "var(--ink)",
        color: "var(--inverse)",
        padding: "40px 56px 56px",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダーバー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingBottom: "20px",
          borderBottom: "1px solid var(--inverse-soft)",
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
        <nav
          style={{
            display: "flex",
            gap: "28px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </nav>
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          Shizuoka / JP — MMXXVI
        </div>
      </div>

      {/* サブヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "28px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>Vol. 01 · Prologue</span>
        <span>A poster for independent e-commerce</span>
        <span>№ 2026 / 04</span>
      </div>

      {/* メインタイポグラフィ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "60px 0 40px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), 'Times New Roman', serif",
            fontSize: "clamp(64px, 13vw, 200px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
        >
          <div>Build.</div>
          <div style={{ marginLeft: "clamp(32px, 9vw, 120px)", fontStyle: "italic", opacity: 0.85 }}>
            Rethink.
          </div>
          <div style={{ marginLeft: "clamp(64px, 18vw, 240px)" }}>Operate.</div>
        </div>

        {/* キャッチコピーグリッド */}
        <div
          style={{
            marginTop: "64px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            alignItems: "end",
          }}
        >
          <div style={{ fontSize: "clamp(16px, 2vw, 22px)", lineHeight: 1.65, maxWidth: "520px" }}>
            ECサイト運営の課題を紐解き、
            <br />
            <span
              style={{
                fontFamily: "var(--font-display), 'Times New Roman', serif",
                fontStyle: "italic",
              }}
            >
              前進させる
            </span>
            パートナー。
          </div>
          <div style={{ fontSize: "13px", lineHeight: 2, opacity: 0.85 }}>
            作るべきか、直すべきか。
            <br />
            広告か、導線か、運用か。
            <br />
            迷いが多いECサイト運用に、
            <br />
            「考える役」と「手を動かす役」を一人で。
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              lineHeight: 2,
            }}
          >
            Shopify-first
            <br />
            10 yrs in-house
            <br />
            Solo practice
          </div>
        </div>
      </div>

      {/* フッターバー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingTop: "20px",
          borderTop: "1px solid var(--inverse-soft)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>↓ Scroll · Service / Works / About / Contact</span>
        <span>Free consultation · LINE</span>
      </div>

      {/* 無料相談CTA */}
      <a
        href="#contact"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "32px",
          padding: "16px 24px",
          background: "var(--inverse)",
          color: "var(--ink)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          alignSelf: "flex-start",
        }}
      >
        無料相談する
        <Arrow size={13} color="var(--ink)" />
      </a>
    </section>
  );
}
