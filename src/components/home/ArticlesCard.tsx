import Link from "next/link";
import Latin from "@/components/Latin";

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};

// 最新記事3本の文字一覧。社長指示（2026-11-24）で冒頭の一文（抜粋）のプレビューは廃止。
// 画像・タグは使わない（現状すべて空）。見出しは英語。
export default function ArticlesCard({
  articles,
  className = "",
}: {
  articles: ArticleItem[];
  className?: string;
}) {
  return (
    <section
      aria-labelledby="articles-title"
      className={`flex flex-col rounded-card bg-surface p-3 pb-4 ${className}`}
    >
      <h2 id="articles-title" className="px-3 pt-3 pb-2 text-lg font-bold">
        Articles
      </h2>

      {articles.length === 0 ? (
        <p className="px-3 text-sm text-ink-sub">記事は準備中です。</p>
      ) : (
        <ul className="flex-1">
          {articles.map((a) => (
            <li key={a._id} className="border-t border-line first:border-t-0">
              <Link
                href={`/articles/${a.slug}`}
                className="grid grid-cols-[84px_1fr] gap-3 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none"
              >
                <time className="text-[13px] leading-[2] text-ink-sub">
                  <Latin>{a.date}</Latin>
                </time>
                <span className="leading-[1.7]">
                  <Latin>{a.title}</Latin>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/articles"
        className="mx-3 mt-3 self-start text-sm text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        記事一覧へ
      </Link>
    </section>
  );
}
