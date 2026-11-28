import Link from "next/link";
import { formatDate } from "@/lib/date";
import { urlFor } from "@/lib/sanity";

type RelatedArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any;
  publishedAt: string;
};

// 記事末尾の「あわせて読みたい」。getRelatedArticles（自分以外の最新記事）を、PC は2列、スマホは縦に並べる。
// 画像のない記事は、画像の枠を出さずに文字だけのカードにする（社長決定 2026-11-28）。
// 新しい記事が増えるたびに自動で入れ替わるため、本文に手動でリンクを書く必要がない。
export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-label="あわせて読みたい" className="glass rounded-card p-4 shadow-card md:p-6">
      <h2 className="type-heading mb-4 text-ink">あわせて読みたい</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {articles.map((a) => {
          const imgUrl = a.mainImage?.asset
            ? urlFor(a.mainImage).width(960).height(540).auto("format").url()
            : null;
          return (
            <Link
              key={a._id}
              href={`/articles/${a.slug.current}`}
              className="group flex flex-col rounded-inner bg-hover p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {imgUrl && (
                <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-sunken">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt=""
                    width={960}
                    height={540}
                    loading="lazy"
                    className="block h-full w-full object-cover transition-[scale] duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
              )}
              <p className="type-caption text-ink-sub">
                <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
              </p>
              <p className="type-body mt-1 line-clamp-2 text-ink group-hover:underline group-hover:underline-offset-4">
                {a.title}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
