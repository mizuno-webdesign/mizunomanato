import { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    `*[_type == "work" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
  ).catch(() => []);

  const workUrls = works.map((work) => ({
    url: `https://mizunomanato.com/works/${work.slug}`,
    lastModified: new Date(work._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://mizunomanato.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...workUrls,
  ];
}
