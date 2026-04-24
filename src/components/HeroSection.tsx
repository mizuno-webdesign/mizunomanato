"use client";

import { useState, useEffect } from "react";
import Arrow from "./Arrow";

const NAV_ITEMS = ["Service", "Works", "About", "Contact"];

function CurrentDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return <span>{`${yyyy} / ${mm} / ${dd}`}</span>;
}

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSp, setIsSp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsSp(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSp(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
          alignItems: "center",
          paddingBottom: "20px",
          borderBottom: "1px solid var(--inverse-soft)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), 'Times New Roman', serif",
            fontSize: "22px",
            letterSpacing: "0.14em",
            fontWeight: 400,
          }}
        >
          Manato Mizuno
        </div>

        {/* PC ナビ */}
        {!isSp && (
          <nav className="hero-nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hero-nav-link"
              >
                {item}
              </a>
            ))}
          </nav>
        )}

        {/* SP ハンバーガーボタン */}
        {isSp && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
            aria-label="メニュー"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`hamburger-bar${menuOpen ? ` open-${i}` : ""}`}
              />
            ))}
          </button>
        )}
      </div>

      {/* SP ドロワーメニュー */}
      {menuOpen && (
        <nav className="nav-drawer">
          {/* 閉じるボタン（×状態のハンバーガー） */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: "40px",
              right: "clamp(20px, 5vw, 56px)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
            aria-label="閉じる"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className={`hamburger-bar open-${i}`} />
            ))}
          </button>
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "var(--inverse)",
                textDecoration: "none",
                fontFamily: "var(--font-display), 'Times New Roman', serif",
                fontSize: "clamp(32px, 8vw, 48px)",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      )}

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
          <div className="hero-word hero-word-0">Build.</div>
          <div className="hero-word hero-word-1" style={{ marginLeft: "clamp(32px, 9vw, 120px)", opacity: 0.85 }}>
            Rethink.
          </div>
          <div className="hero-word hero-word-2" style={{ marginLeft: "clamp(64px, 18vw, 240px)" }}>Operate.</div>
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

      {/* 無料相談CTA（SPのみ） */}
      {isSp && (
        <a
          href="#contact"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            width: "80%",
            alignSelf: "center",
          }}
        >
          無料相談する
          <Arrow size={13} color="var(--ink)" />
        </a>
      )}
    </section>
  );
}
