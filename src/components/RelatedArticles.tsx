import Link from "next/link";
import { formatDate } from "@/lib/date";

type RelatedArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
};

// 記事末尾の「あわせて読みたい」。getRelatedArticles（自分以外の最新記事）を、PC は2列、スマホは縦に並べる。
// サムネイルは出さず、日付とタイトルだけの文字のカードにする（社長決定 2026-11-28）。
// 新しい記事が増えるたびに自動で入れ替わるため、本文に手動でリンクを書く必要がない。
export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-label="あわせて読みたい" className="glass rounded-card p-4 shadow-card md:p-6">
      <h2 className="type-heading mb-4 text-ink">あわせて読みたい</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {articles.map((a) => (
          <Link
            key={a._id}
            href={`/articles/${a.slug.current}`}
            className="group flex flex-col rounded-inner bg-hover p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <p className="type-caption text-ink-sub">
              <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
            </p>
            <p className="type-body mt-1 line-clamp-2 text-ink group-hover:underline group-hover:underline-offset-4">
              {a.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
