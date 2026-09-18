import Link from "next/link";
import SectionHead from "./SectionHead";
import { getActivities } from "@/lib/sanity";

type Activity = {
  _id: string;
  date: string;
  text: string;
  note?: string;
  tags?: string[];
  relatedArticle?: { slug: { current: string } } | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function ActivityRow({ activity }: { activity: Activity }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(16px, 3vw, 32px)",
        padding: "20px 0",
        borderBottom: "1px solid var(--ink-soft)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "64px",
          fontFamily: "var(--font-ui)",
          fontSize: "12px",
          letterSpacing: "0.05em",
          opacity: 0.55,
          paddingTop: "2px",
        }}
      >
        {formatDate(activity.date)}
      </div>
      <div style={{ flex: 1 }}>
        {activity.tags && activity.tags.length > 0 && (
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "6px",
            }}
          >
            {activity.tags.join(" / ")}
          </div>
        )}
        <div style={{ fontSize: "15px", lineHeight: 1.7 }}>{activity.text}</div>
        {activity.note && (
          <div style={{ fontSize: "12px", opacity: 0.55, marginTop: "4px" }}>
            {activity.note}
          </div>
        )}
        {activity.relatedArticle?.slug?.current && (
          <Link
            href={`/articles/${activity.relatedArticle.slug.current}`}
            style={{
              display: "inline-block",
              marginTop: "8px",
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.05em",
              color: "var(--ink)",
              opacity: 0.7,
              textDecoration: "none",
              borderBottom: "1px solid var(--ink-soft)",
              paddingBottom: "2px",
            }}
          >
            詳しく読む →
          </Link>
        )}
      </div>
    </div>
  );
}

const TOP_DISPLAY_LIMIT = 5;

export default async function ActivitySection() {
  let activities: Activity[] = [];
  try {
    activities = await getActivities();
  } catch {
    activities = [];
  }

  // ログが1件もない場合は、空の枠を見せるよりセクションごと非表示にする方が自然。
  // Sanityに登録されると自動的に表示されるようになる（ArticlesSectionと同じ方針）。
  if (activities.length === 0) return null;

  const hasMore = activities.length > TOP_DISPLAY_LIMIT;
  const visibleActivities = activities.slice(0, TOP_DISPLAY_LIMIT);

  return (
    <section
      id="activity"
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px) 120px",
        background: "var(--paper-alt)",
      }}
    >
      <SectionHead num="03" label="Activity" title="最近の対応" trailing="" />

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {visibleActivities.map((activity) => (
          <ActivityRow key={activity._id} activity={activity} />
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            href="/activity"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.65,
              textDecoration: "none",
              color: "var(--ink)",
              borderBottom: "1px solid var(--ink-soft)",
              paddingBottom: "4px",
            }}
          >
            すべて見る →
          </Link>
        </div>
      )}
    </section>
  );
}
