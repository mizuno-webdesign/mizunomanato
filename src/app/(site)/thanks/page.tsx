import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせありがとうございます | Manato Mizuno",
};

export default function ThanksPage() {
  return (
    <main
      style={{
        background: "var(--ink)",
        color: "var(--inverse)",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "var(--font-body), 'Hiragino Kaku Gothic ProN', sans-serif",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.5,
          marginBottom: "32px",
        }}
      >
        Manato Mizuno — EC構築・運用パートナー
      </div>

      <div
        style={{
          fontFamily: "var(--font-display), 'Times New Roman', serif",
          fontSize: "clamp(48px, 8vw, 96px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          fontWeight: 400,
          marginBottom: "48px",
        }}
      >
        <div>Thank</div>
        <div style={{ fontStyle: "italic", opacity: 0.75 }}>you.</div>
      </div>

      <div style={{ fontSize: "15px", lineHeight: 2.1, opacity: 0.82, marginBottom: "12px" }}>
        お問い合わせを受け付けました。
      </div>
      <div style={{ fontSize: "14px", lineHeight: 2, opacity: 0.65, marginBottom: "56px" }}>
        通常2営業日以内にご返信いたします。
        <br />
        今しばらくお待ちください。
      </div>

      <Link
        href="/"
        style={{
          padding: "16px 32px",
          border: "1px solid rgba(235,231,218,0.3)",
          color: "var(--inverse)",
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        トップページへ戻る
      </Link>
    </main>
  );
}
