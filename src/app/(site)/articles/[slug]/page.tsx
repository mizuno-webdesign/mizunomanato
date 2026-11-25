import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import AuthorCard from "@/components/AuthorCard";
import CtaButton from "@/components/CtaButton";
import { TocAside, TocDisclosure } from "@/components/TableOfContents";
import CtaBand from "@/components/home/CtaBand";
import { formatDate } from "@/lib/date";
import { client, urlFor } from "@/lib/sanity";
import { extractToc } from "@/lib/toc";

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
  noindex?: boolean;
};

async function getArticle(slug: string): Promise<Article | null> {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id, title, slug, excerpt, mainImage, body, tags, publishedAt, noindex
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

  const title = `${article.title} — Manato Mizuno`;
  const description = article.excerpt ?? "";
  const ogImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).auto("format").url()
    : undefined;
  const url = `https://mizunomanato.com/articles/${article.slug.current}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: article.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
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

  const imgUrl = article.mainImage
    ? urlFor(article.mainImage).width(1440).auto("format").url()
    : null;
  const toc = extractToc(article.body);
  const hasToc = toc.length > 0;

  return (
    <>
      {/* 本文カード 816px（本文720px＋左右48px）。目次があるときは右に 272px の列を足す。
          列は grid-cols の minmax(0,…) で、長い英数字があっても広がらないようにする。 */}
      <div
        className={`mx-auto grid grid-cols-[minmax(0,1fr)] gap-4 ${
          hasToc
            ? "max-w-[816px] lg:max-w-[1104px] lg:grid-cols-[minmax(0,1fr)_272px]"
            : "max-w-[816px]"
        }`}
      >
        <div className="flex min-w-0 flex-col gap-4">
          <article className="glass rounded-card p-6 shadow-card md:p-12">
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
                className="inline-block rounded-full px-4 py-2 type-caption text-ink-sub hover:text-ink hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
              >
                記事一覧へ
              </Link>
            </p>
          </article>

          <AuthorCard />
          <CtaBand />
        </div>

        {hasToc && (
          // 目次を追従させるため、列は本文の高さまで伸ばす（grid の既定の stretch）
          <div className="hidden lg:block">
            {/* top は上部の固定ナビの下端（約64px）より下。目次と相談ボタンをまとめて追従させる。 */}
            <div className="sticky top-20 flex flex-col gap-4">
              <TocAside items={toc} />
              <CtaButton className="text-center" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
