"use client";

import Arrow from "./Arrow";

const NAV_ITEMS = ["Service", "Works", "About", "Topics", "Contact"];

function CurrentDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return <span>{`${yyyy} / ${mm} / ${dd}`}</span>;
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        background: "var(--ink)",
        color: "var(--inverse)",
        padding: "40px clamp(20px, 5vw, 56px) 56px",
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
            fontFamily: "var(--font-ui)",
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
      </div>

      {/* サブヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "28px",
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>e-commerce partner</span>
        <CurrentDate />
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

        {/* キャッチコピー */}
        <div
          style={{
            marginTop: "96px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "48px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "clamp(18px, 2.2vw, 26px)",
              lineHeight: 1.55,
              maxWidth: "520px",
              fontWeight: 400,
            }}
          >
            ECサイト運営の課題を紐解き、
            <br />
            前進させるパートナー。
          </div>
          <div style={{ fontSize: "15px", lineHeight: 2, opacity: 0.85, maxWidth: "480px" }}>
            作るべきか、直すべきか。広告か、導線か、運用か。
            <br />
            迷いが多いEC運用に、考える役も手を動かす役も担います。
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
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.55,
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>↓ Scroll · Service / Works / About / Contact</span>
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
          fontFamily: "var(--font-ui)",
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
