import type { Metadata } from "next";
import { getActivities } from "@/lib/sanity";
import FooterSection from "@/components/FooterSection";
import SiteHeader from "@/components/SiteHeader";
import ActivityListClient from "@/components/ActivityListClient";

// このページはSanityの対応ログを表示するため、ビルド時の静的
// プリレンダリングのままだと公開後の新規ログが反映されない
// （Vercelがビルド時点のHTMLをそのまま配信し続けてしまう）。
// 常にリクエスト時に最新データを取得するよう動的レンダリングを強制する。
export const dynamic = "force-dynamic";

type Activity = {
  _id: string;
  date: string;
  text: string;
  tags?: string[];
  relatedArticle?: { slug: { current: string } } | null;
};

export const metadata: Metadata = {
  title: "Activity — Manato Mizuno",
  description: "EC構築・改善・運用における最近の対応をまとめた一覧です。",
  openGraph: {
    title: "Activity — Manato Mizuno",
    description: "EC構築・改善・運用における最近の対応をまとめた一覧です。",
    url: "https://mizunomanato.com/activity",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Activity — Manato Mizuno",
    description: "EC構築・改善・運用における最近の対応をまとめた一覧です。",
  },
};

export default async function ActivityPage() {
  let activities: Activity[] = [];
  try {
    activities = await getActivities();
  } catch {
    activities = [];
  }

  return (
    <>
      <main style={{ background: "var(--paper)", minHeight: "100svh" }}>
        <SiteHeader basePath="/" />

        {/* 見出し */}
        <div
          style={{
            padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px) 56px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginBottom: "16px",
            }}
          >
            § 03 · Activity
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontWeight: 400,
            }}
          >
            最近の対応
          </h1>
        </div>

        {/* 一覧 */}
        <div style={{ padding: "0 clamp(20px, 5vw, 56px) 120px" }}>
          <ActivityListClient activities={activities} />
        </div>
      </main>
      <hr style={{ border: "none", borderTop: "1px solid var(--ink-soft)", margin: "0 clamp(20px, 5vw, 56px)" }} />
      <FooterSection />
    </>
  );
}
