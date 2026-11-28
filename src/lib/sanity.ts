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
    *[_type == "work"] | order(date desc) {
      _id,
      title,
      slug,
      category,
      date,
      thumbnail
    }
  `);
}

export async function getArticles() {
  return client.fetch(`
    *[_type == "article" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      noindex
    }
  `);
}

// 記事詳細末尾の「あわせて読みたい」カルーセル用。自分自身を除いた最新記事を取得する
export async function getRelatedArticles(currentSlug: string, limit = 4) {
  return client.fetch(
    `
    *[_type == "article" && defined(publishedAt) && publishedAt <= now() && slug.current != $currentSlug]
      | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    }
  `,
    { currentSlug, limit }
  );
}
