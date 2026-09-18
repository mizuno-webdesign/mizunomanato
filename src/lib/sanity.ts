import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "dummy";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  // Sanity CDN（apicdn.sanity.io）はキャッシュに数分の遅延があり、
  // Publish直後の記事・実績がサイトに反映されないことがあるため、
  // 常に最新データを取得するAPIエンドポイントを直接叩く設定にしている。
  useCdn: false,
});

const builder = createImageUrlBuilder({ projectId, dataset });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

export async function getWorks() {
  return client.fetch(`
    *[_type == "work"] | order(order asc, year desc) {
      _id,
      title,
      slug,
      category,
      year,
      note,
      thumbnail,
      description,
      featured
    }
  `);
}

export async function getArticles() {
  return client.fetch(`
    *[_type == "article"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      tags,
      publishedAt,
      noindex
    }
  `);
}

export async function getActivities() {
  return client.fetch(`
    *[_type == "activity"] | order(date desc) {
      _id,
      date,
      text,
      tags,
      relatedArticle -> { slug }
    }
  `);
}
