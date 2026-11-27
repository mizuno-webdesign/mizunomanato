import { MetadataRoute } from "next";
import { getArticles, getWorks } from "@/lib/sanity";

// 公開後に Sanity で足した記事・事例も載るように、1時間ごとに作り直す。
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://mizunomanato.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["about", "service", "works", "contact"].map((path) => ({
      url: `https://mizunomanato.com/${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: "https://mizunomanato.com/privacy",
      lastModified: new Date("2026-11-27"), // ポリシーを改定したら、ページの日付とあわせて直す
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://mizunomanato.com/articles",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  type ArticleForSitemap = {
    slug: { current: string };
    publishedAt: string;
    noindex?: boolean;
  };

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles: ArticleForSitemap[] = await getArticles();
    articleRoutes = articles
      .filter((a) => !a.noindex)
      .map((a) => ({
        url: `https://mizunomanato.com/articles/${a.slug.current}`,
        lastModified: new Date(a.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch {
    articleRoutes = [];
  }

  // 事例の URL は Sanity から作る（事例を足したときに、書き足さなくてよいように）
  let workRoutes: MetadataRoute.Sitemap = [];
  try {
    const works: { slug?: { current?: string } }[] = await getWorks();
    workRoutes = works
      .filter((w) => w.slug?.current)
      .map((w) => ({
        url: `https://mizunomanato.com/works/${w.slug!.current}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
  } catch {
    workRoutes = [];
  }

  return [...staticRoutes, ...workRoutes, ...articleRoutes];
}
