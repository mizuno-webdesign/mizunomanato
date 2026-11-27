import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import AuthorCard from "@/components/AuthorCard";
import { TocAside, TocDisclosure } from "@/components/TableOfContents";
import CtaBand from "@/components/home/CtaBand";
import { formatDate } from "@/lib/date";
import { client, urlFor } from "@/lib/sanity";
import { extractToc } from "@/lib/toc";
import JsonLd from "@/components/JsonLd";
import { plex } from "@/lib/fontsPlex";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
  tags?: string[];
  publishedAt: string;
  _updatedAt: string;
  noindex?: boolean;
};

async function getArticle(slug: string): Promise<Article | null> {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id, title, slug, excerpt, mainImage, body, tags, publishedAt, _updatedAt, noindex
    }`,
    { slug }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    ...pageMetadata({
      path: `/articles/${article.slug.current}`,
      title: `${article.title} — Manato Mizuno`,
      description: article.excerpt ?? SITE_DESCRIPTION,
      type: "article",
      publishedTime: article.publishedAt,
      image: article.mainImage?.asset
        ? urlFor(article.mainImage).width(1200).height(630).auto("format").url()
        : undefined,
    }),
    robots: article.noindex ? { index: false, follow: false } : undefined,
  };
}

// 記事詳細（社長承認 2026-11-25）：本文は大きなカード1枚（本文の幅は最大720px）、ページ全体でスクロール。
// 目次は PC で右に追従（下に相談ボタン。社長指示 2026-11-25）、それ未満は本文の上に折りたたみ。
// 本文の下には著者紹介と「相談してみる」の帯。
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const imgUrl = article.mainImage?.asset
    ? urlFor(article.mainImage).width(1440).auto("format").url()
    : null;
  const toc = extractToc(article.body);
  // 構造化データの更新日。公開日をあとから指定した記事で、更新日が公開日より前にならないようにする
  const modifiedAt =
    new Date(article._updatedAt) > new Date(article.publishedAt) ? article._updatedAt : article.publishedAt;
  const hasToc = toc.length > 0;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: modifiedAt,
          mainEntityOfPage: `${SITE_URL}/articles/${article.slug.current}`,
          image: imgUrl ?? `${SITE_URL}/opengraph-image`,
          author: { "@type": "Person", name: SITE_NAME, url: `${SITE_URL}/about` },
        }}
      />
      {/* 横幅は枠（TOP と同じ）いっぱい。目次があるときは右に列を足す。本文はカードの中で最大760pxにする。
          列は grid-cols の minmax(0,…) で、長い英数字があっても広がらないようにする。 */}
      <div
        className={`${plex.variable} grid grid-cols-[minmax(0,1fr)] gap-4 ${
          hasToc ? "lg:grid-cols-[minmax(0,1fr)_272px] xl:grid-cols-[minmax(0,1fr)_320px]" : ""
        }`}
      >
        <div className="flex min-w-0 flex-col gap-4">
          <article className="glass rounded-card p-6 shadow-card md:p-12">
            <div className="mx-auto w-full max-w-[760px]">
            <header>
              <p className="type-caption text-ink-sub">
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                {article.tags && article.tags.length > 0 && ` ・ ${article.tags.join(" ・ ")}`}
              </p>
              <h1 className="mt-2 type-display break-words text-ink">{article.title}</h1>
            </header>

            {/* 画像があるときだけ表示する（無いときの代わりの絵は出さない。見出しと重複するため） */}
            {imgUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgUrl} alt="" className="mt-6 block h-auto w-full rounded-inner" />
            )}

            {hasToc && <TocDisclosure items={toc} />}

            {article.body && (
              <div className="mt-10 break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ArticleBody body={article.body} />
              </div>
            )}

            <p className="mt-12 text-center">
              <Link
                href="/articles"
                className="inline-block rounded-full px-4 py-3 type-caption text-ink-sub hover:text-ink hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
              >
                記事一覧へ
              </Link>
            </p>
            </div>
          </article>

          <AuthorCard />
          <CtaBand />
        </div>

        {hasToc && (
          // 目次を追従させるため、列は本文の高さまで伸ばす（grid の既定の stretch）
          <div className="hidden lg:block">
            {/* 目次と、プロフィール＋相談ボタンをまとめて追従させる。幅1280px未満は上部の固定ナビの下に置く */}
            <div className="sticky top-20 flex flex-col gap-4 xl:top-4">
              <TocAside items={toc} />
              <AuthorCard side />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
