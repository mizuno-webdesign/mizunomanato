import Link from "next/link";
import Latin from "@/components/Latin";
import { ArrowLink } from "@/components/ArrowCircle";

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};

// 最新記事3本の文字一覧。見出しは「Blogs」（社長指示 2026-11-24。Articles では伝わりにくいため）。
// 行の区切り線は使わない。一覧へは右下の「↗」丸ボタン（内部リンク）。
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
      className={`flex flex-col rounded-card bg-surface p-3 ${className}`}
    >
      <h2 id="articles-title" className="px-3 pt-3 pb-2 text-lg font-bold">
        Blogs
      </h2>

      {articles.length === 0 ? (
        <p className="px-3 text-sm text-ink-sub">記事は準備中です。</p>
      ) : (
        <ul className="flex-1">
          {articles.map((a) => (
            <li key={a._id}>
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

      <div className="flex justify-end px-1 pt-2">
        <ArrowLink href="/articles" label="記事一覧へ" />
      </div>
    </section>
  );
}
