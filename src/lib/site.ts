import type { Metadata } from "next";

// サイト全体で使う名前・説明（社長承認 2026-11-25）。説明は TOP の自己紹介の1文と同じ。
export const SITE_URL = "https://mizunomanato.com";
export const SITE_NAME = "Manato Mizuno";
export const SITE_TITLE = "Manato Mizuno — Shopify の構築・改修・運用支援";
export const SITE_DESCRIPTION =
  "Shopify を中心に、ECサイト専門家として新規構築・改修・運用支援を行っています。";

// 構造化データの人物。TOP とプロフィールのページで同じ内容を使う（@id で同じ人物だと示す）。
export const PERSON_JSON_LD = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  alternateName: "水野 学人",
  url: SITE_URL,
  image: `${SITE_URL}/profile.webp`,
  description: SITE_DESCRIPTION,
  address: { "@type": "PostalAddress", addressRegion: "静岡県", addressCountry: "JP" },
};

const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
};

// 各ページの検索・共有の情報。
// openGraph はページ側で定義すると親の内容が丸ごと置き換わるため（画像の指定も消える）、
// 必ずこの関数で、画像まで含めて作る。
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
  image,
  publishedTime,
}: {
  path: string; // 例：/about（TOP は /）
  title: string;
  description: string;
  type?: "website" | "article" | "profile";
  image?: string; // 指定がなければサイト共通の OG 画像
  publishedTime?: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const images = [image ? { url: image, width: 1200, height: 630 } : DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type,
      images,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
