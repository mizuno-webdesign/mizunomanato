import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, urlFor } from "@/lib/sanity";
import FooterSection from "@/components/FooterSection";
import SiteHeader from "@/components/SiteHeader";
import ArticleThumbnail from "@/components/ArticleThumbnail";

// このページはSanityの記事一覧を表示するため、ビルド時の静的
// プリレンダリングのままだと公開後の新規記事が反映されない
// （Vercelがビルド時点のHTMLをそのまま配信し続けてしまう）。
// 常にリクエスト時に最新データを取得するよう動的レンダリングを強制する。
export const dynamic = "force-dynamic";

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
  mainImage?: { asset: { _ref: string } };
  tags?: string[];
  publishedAt: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${String(d.getDate()).padStart(2, "0")}`;
}

export const metadata: Metadata = {
  title: "Articles — Manato Mizuno",
  description:
    "EC構築・改善・運用にまつわる知見や考え方をまとめた記事一覧です。",
  openGraph: {
    title: "Articles — Manato Mizuno",
    description: "EC構築・改善・運用にまつわる知見や考え方をまとめた記事一覧です。",
    url: "https://mizunomanato.com/articles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles — Manato Mizuno",
    description: "EC構築・改善・運用にまつわる知見や考え方をまとめた記事一覧です。",
  },
};

function ArticleCard({ article }: { article: Article }) {
  const imgUrl = article.mainImage
    ? urlFor(article.mainImage).width(900).auto("format").url()
    : null;

  return (
    <Link
      href={`/articles/${article.slug.current}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 3",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <ArticleThumbnail title={article.title} />
        )}
      </div>
      <div style={{ paddingTop: "16px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-ui)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.55,
            marginBottom: "8px",
          }}
        >
          <span>{article.tags?.[0] ?? "Article"}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <div
          style={{
            fontFamily: TITLE_FONT_FAMILY,
            fontSize: "20px",
            lineHeight: 1.35,
            fontWeight: 400,
            marginBottom: "8px",
          }}
        >
          {article.title}
        </div>
        {article.excerpt && (
          <div style={{ fontSize: "13px", lineHeight: 1.8, opacity: 0.65 }}>
            {article.excerpt}
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function ArticlesPage() {
  let articles: Article[] = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }

  return (
    <>
      <main style={{ background: "var(--paper)", minHeight: "100svh" }}>
        <SiteHeader basePath="/" />

        {/* 見出し */}
        <div
          style={{
            padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px) 56px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginBottom: "16px",
            }}
          >
            § 04 · Articles
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontWeight: 400,
            }}
          >
            Articles
          </h1>
        </div>

        {/* 一覧 */}
        <div style={{ padding: "0 clamp(20px, 5vw, 56px) 120px" }}>
          {articles.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                fontSize: "14px",
                opacity: 0.55,
              }}
            >
              まだ記事がありません。
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </main>
      <hr style={{ border: "none", borderTop: "1px solid var(--ink-soft)", margin: "0 clamp(20px, 5vw, 56px)" }} />
      <FooterSection />
    </>
  );
}
