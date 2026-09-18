"use client";

import { useState } from "react";
import Link from "next/link";
import { useIsSp } from "@/lib/useIsSp";

// トップページ本文のセクション順（§01 Service〜§06 Contact）に合わせたナビ順序。
// Activity（§03）はナビには含めず、Worksからの流し見での発見に任せる。
// href の先頭が "/" のものは別ページ遷移、"#" 始まりはページ内アンカー。
const NAV_ITEMS = [
  { label: "Service", href: "#service" },
  { label: "Works", href: "#works" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader({
  // トップページ以外（/works/[slug], /articles 等）では、
  // "#service" のようなアンカーだけでは同一ページ内に該当セクションが無いため、
  // トップページへの絶対パス "/#service" を組み立てる必要がある。
  // basePath="/" を渡すとページ内アンカーの前に "/" を補って遷移させる。
  basePath,
}: {
  basePath?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isSp = useIsSp();

  const resolveHref = (href: string) =>
    basePath && href.startsWith("#") ? `${basePath}${href}` : href;

  return (
    <header
      style={{
        background: "var(--ink)",
        color: "var(--inverse)",
        padding: basePath ? "28px clamp(20px, 5vw, 56px)" : undefined,
        borderBottom: basePath ? "1px solid var(--inverse-soft)" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: basePath ? undefined : "20px",
          borderBottom: basePath ? undefined : "1px solid var(--inverse-soft)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display), 'Times New Roman', serif",
            fontSize: "22px",
            letterSpacing: "0.14em",
            fontWeight: 400,
            color: "var(--inverse)",
            textDecoration: "none",
          }}
        >
          Manato Mizuno
        </Link>

        {/* PC ナビ */}
        {!isSp && (
          <nav className="hero-nav">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={resolveHref(item.href)} className="hero-nav-link">
                {item.label}
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
              <span key={i} className={`hamburger-bar${menuOpen ? ` open-${i}` : ""}`} />
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
              key={item.label}
              href={resolveHref(item.href)}
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
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
