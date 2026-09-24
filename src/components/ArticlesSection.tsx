import Link from "next/link";
import SectionHead from "./SectionHead";
import ArticleThumbnail from "./ArticleThumbnail";
import { getArticles, urlFor } from "@/lib/sanity";

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
  tags?: string[];
  publishedAt: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${d.getMonth() + 1}`;
}

function ArticleCard({ article }: { article: Article }) {
  const imgUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).auto("format").url()
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
          }}
        >
          {article.title}
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlesSection() {
  let articles: Article[] = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }
  articles = articles.slice(0, 3);

  // 記事が1件もない場合は、空の枠を見せるよりセクションごと非表示にする方が自然なため、
  // ここで打ち切る。Sanityに記事が登録されると自動的に表示されるようになる。
  if (articles.length === 0) return null;

  return (
    <section
      id="articles"
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px) 120px",
      }}
    >
      <SectionHead num="04" label="Articles" title="Articles" trailing="" />

      <div
        className="articles-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${articles.length}, 1fr)`,
          gap: "clamp(16px, 3vw, 32px)",
        }}
      >
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
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
          もっと見る →
        </Link>
      </div>
    </section>
  );
}
