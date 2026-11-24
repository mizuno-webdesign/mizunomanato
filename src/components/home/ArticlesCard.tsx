import Link from "next/link";
import Latin from "@/components/Latin";
import FlipHeading from "@/components/FlipHeading";

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};

// 最新記事3本の文字一覧。見出しは「Blogs」（社長指示 2026-11-24。Articles では伝わりにくいため）。
// 行の区切り線は使わない。一覧へのリンクは、矢印の削除に伴い一旦なし（社長が検討中。一覧へはナビの Articles から）。
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
      className={`flex flex-col glass rounded-card p-3 shadow-card ${className}`}
    >
      <FlipHeading
        id="articles-title"
        en="Blogs"
        ja="ブログ"
        className="px-3 pt-3 pb-2"
      />

      {articles.length === 0 ? (
        <p className="px-3 text-sm text-ink-sub">記事は準備中です。</p>
      ) : (
        <ul className="flex flex-1 flex-col justify-evenly">
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
    </section>
  );
}
