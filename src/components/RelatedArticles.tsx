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

// 記事末尾の「あわせて読みたい」。getRelatedArticles（自分以外の最新記事）を横スクロールのカルーセルで表示する。
// 新しい記事が増えるたびに自動で入れ替わるため、本文に手動でリンクを書く必要がない。
export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-label="あわせて読みたい" className="glass rounded-card p-4 shadow-card md:p-6">
      <h2 className="type-heading mb-4 text-ink">あわせて読みたい</h2>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {articles.map((a) => {
          const imgUrl = a.mainImage?.asset
            ? urlFor(a.mainImage).width(480).height(252).auto("format").url()
            : null;
          return (
            <Link
              key={a._id}
              href={`/articles/${a.slug.current}`}
              className="group block w-[260px] shrink-0 snap-start rounded-inner outline-none focus-visible:outline-2 focus-visible:outline-accent"
            >
              <div className="overflow-hidden rounded-inner bg-sunken" style={{ aspectRatio: "16/9" }}>
                {imgUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgUrl}
                    alt=""
                    loading="lazy"
                    className="block h-full w-full object-cover transition-[scale] duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                )}
              </div>
              <p className="type-caption mt-2 text-ink-sub">
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
