import Link from "next/link";
import Latin from "@/components/Latin";
import FlipHeading from "@/components/FlipHeading";

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};

// 最新記事の文字一覧（PCは4行。社長指示 2026-11-24）。見出しは「Blogs」。
// 右下にグレーの内部リンク「すべて見る」（→ /articles）。行の区切り線は使わない。
// 4行に収めるため、行の余白を詰め、PCではタイトルを1行で省略する（truncate）。
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
      className={`relative flex flex-col glass rounded-card p-3 shadow-card ${className}`}
    >
      <FlipHeading
        id="articles-title"
        en="Blogs"
        ja="ブログ"
        className="px-3 pt-3 pb-2"
      />

      {articles.length === 0 ? (
        <p className="type-caption px-3 text-ink-sub">記事は準備中です。</p>
      ) : (
        <ul className="flex flex-1 flex-col justify-evenly pb-7">
          {articles.map((a) => (
            <li key={a._id}>
              <Link
                href={`/articles/${a.slug}`}
                className="grid grid-cols-[84px_1fr] items-baseline gap-3 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none"
              >
                <time className="type-caption text-ink-sub">
                  <Latin>{a.date}</Latin>
                </time>
                <span className="type-body lg:truncate">
                  <Latin>{a.title}</Latin>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/articles"
        className="absolute right-6 bottom-4 type-caption rounded text-ink-sub transition-colors duration-150 hover:text-ink hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
      >
        すべて見る
      </Link>
    </section>
  );
}
