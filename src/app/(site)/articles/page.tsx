import type { Metadata } from "next";
import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";
import { formatDate } from "@/lib/date";
import { getArticles } from "@/lib/sanity";
import { pageMetadata } from "@/lib/site";

// このページはSanityの記事一覧を表示するため、ビルド時の静的
// プリレンダリングのままだと公開後の新規記事が反映されない
// （Vercelがビルド時点のHTMLをそのまま配信し続けてしまう）。
// 常にリクエスト時に最新データを取得するよう動的レンダリングを強制する。
export const dynamic = "force-dynamic";

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
};

export const metadata: Metadata = pageMetadata({
  path: "/articles",
  title: "Articles — Manato Mizuno",
  description: "EC構築・改善・運用にまつわる知見や考え方をまとめた記事一覧です。",
});

// 記事一覧（社長承認 2026-11-25）：大きなグラスのカード1枚に、文字だけの行を並べる
// （現状の記事にサムネイル・タグがないため、画像と絞り込みは置かない）。行全体がリンク。
export default async function ArticlesPage() {
  let articles: Article[] = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }

  return (
    <>
      <section
        aria-labelledby="articles-title"
        className="mx-auto max-w-[816px] glass rounded-card p-3 shadow-card md:p-6"
      >
        <FlipHeading
          as="h1"
          id="articles-title"
          en="Blogs"
          ja="ブログ"
          className="px-3 pt-3 pb-4"
        />
        {articles.length === 0 ? (
          <p className="type-body px-3 pb-3 text-ink-sub">記事は準備中です。</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {articles.map((a) => (
              <li key={a._id}>
                <Link
                  href={`/articles/${a.slug.current}`}
                  className="grid gap-1 rounded-2xl px-3 py-4 transition-colors duration-150 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none md:grid-cols-[96px_1fr] md:gap-x-4"
                >
                  <time dateTime={a.publishedAt} className="type-caption text-ink-sub md:pt-1">
                    {formatDate(a.publishedAt)}
                  </time>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <h2 className="type-heading text-ink">{a.title}</h2>
                    {a.excerpt && (
                      <p className="type-caption line-clamp-2 leading-[1.7] text-ink-sub">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
