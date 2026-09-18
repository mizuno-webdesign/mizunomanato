"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Activity = {
  _id: string;
  date: string;
  text: string;
  tags?: string[];
  relatedArticle?: { slug: { current: string } } | null;
};

// dateは"YYYY-MM"形式の文字列で保存する運用だが、スキーマ変更前に
// "YYYY-MM-DD"で登録された既存データが残っている可能性があるため、
// 先頭2セグメント（年・月）だけを安全に取り出す。
function formatDate(date: string) {
  const [year, month] = date.split("-");
  return `${year} / ${month}`;
}

function ActivityRow({ activity }: { activity: Activity }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(16px, 3vw, 32px)",
        padding: "24px 0",
        borderBottom: "1px solid var(--ink-soft)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "96px",
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

export default function ActivityListClient({ activities }: { activities: Activity[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    activities.forEach((a) => a.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [activities]);

  const filtered = activeTag
    ? activities.filter((a) => a.tags?.includes(activeTag))
    : activities;

  if (activities.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", fontSize: "14px", opacity: 0.55 }}>
        まだ対応ログがありません。
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {allTags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => setActiveTag(null)}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.05em",
              padding: "6px 14px",
              border: "1px solid var(--ink-soft)",
              borderRadius: "999px",
              background: activeTag === null ? "var(--ink)" : "transparent",
              color: activeTag === null ? "var(--inverse)" : "var(--ink)",
              cursor: "pointer",
            }}
          >
            すべて
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                letterSpacing: "0.05em",
                padding: "6px 14px",
                border: "1px solid var(--ink-soft)",
                borderRadius: "999px",
                background: activeTag === tag ? "var(--ink)" : "transparent",
                color: activeTag === tag ? "var(--inverse)" : "var(--ink)",
                cursor: "pointer",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", fontSize: "14px", opacity: 0.55 }}>
          該当する対応ログがありません。
        </div>
      ) : (
        filtered.map((activity) => <ActivityRow key={activity._id} activity={activity} />)
      )}
    </div>
  );
}
