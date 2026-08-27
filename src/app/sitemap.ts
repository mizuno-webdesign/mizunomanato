import { MetadataRoute } from "next";
import { getArticles } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://mizunomanato.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://mizunomanato.com/works/lipico",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://mizunomanato.com/works/cocorome",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://mizunomanato.com/works/local-guide-stars",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
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

  return [...staticRoutes, ...articleRoutes];
}
