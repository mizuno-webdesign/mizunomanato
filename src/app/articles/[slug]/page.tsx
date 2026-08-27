import type { Metadata } from "next";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { extractToc } from "@/lib/toc";
import FooterSection from "@/components/FooterSection";
import TableOfContents from "@/components/TableOfContents";
import ArticleBody from "@/components/ArticleBody";
import SiteHeader from "@/components/SiteHeader";
import ArticleCta from "@/components/ArticleCta";

// 記事タイトルは和文と半角数字が混在する。Cormorant Garamond単体だと
// 和文グリフを持たずフォールバックでゴシック体になり字面が揃わないため、
// 和文対応の明朝体（Shippori Mincho）を優先フォントに指定する。
const TITLE_FONT_FAMILY =
  "var(--font-display-jp), var(--font-display), 'Times New Roman', serif";

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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${String(d.getDate()).padStart(2, "0")}`;
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const imgUrl = article.mainImage
    ? urlFor(article.mainImage).width(1600).auto("format").url()
    : null;
  const toc = extractToc(article.body);

  return (
    <>
      <main style={{ background: "var(--paper)", minHeight: "100svh" }}>
        <SiteHeader basePath="/" />

        {/* 戻るリンク */}
        <div style={{ padding: "32px clamp(20px, 5vw, 56px) 0" }}>
          <Link
            href="/articles"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink)",
              textDecoration: "none",
              opacity: 0.55,
            }}
          >
            ← Articles
          </Link>
        </div>

        {/* サムネイル（画像がある場合のみ表示。画像が無い時は下の本文タイトルと
            表示内容が重複するため、代替ビジュアルは出さない） */}
        {imgUrl && (
          <div style={{ marginTop: "40px", width: "100%", aspectRatio: "16 / 7", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* 本文 */}
        <div style={{ padding: "64px clamp(20px, 5vw, 56px) 120px", maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginBottom: "16px",
            }}
          >
            {article.tags && article.tags.length > 0 ? article.tags.join(" · ") : "Article"}
            {" · "}
            {formatDate(article.publishedAt)}
          </div>
          <h1
            style={{
              fontFamily: TITLE_FONT_FAMILY,
              fontSize: "clamp(24px, 3.2vw, 42px)",
              fontWeight: 400,
              lineHeight: 1.3,
              marginBottom: "48px",
            }}
          >
            {article.title}
          </h1>

          <TableOfContents items={toc} />

          {article.body && <ArticleBody body={article.body} />}

          {/* 記事一覧に戻る */}
          <div style={{ marginTop: "64px", textAlign: "center" }}>
            <Link
              href="/articles"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.65,
                textDecoration: "none",
                color: "var(--ink)",
                borderBottom: "1px solid var(--ink-soft)",
                paddingBottom: "4px",
              }}
            >
              ← 記事一覧に戻る
            </Link>
          </div>
        </div>

        <ArticleCta />
      </main>
      <hr style={{ border: "none", borderTop: "1px solid var(--ink-soft)", margin: "0 clamp(20px, 5vw, 56px)" }} />
      <FooterSection />
    </>
  );
}
