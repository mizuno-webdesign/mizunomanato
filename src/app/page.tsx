import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import DesktopHome from "@/components/home/DesktopHome";
import StackedHome from "@/components/home/StackedHome";
import { formatDate } from "@/lib/date";
import type { ArticleItem, WorkItem } from "@/lib/home";
import { getArticles, getWorks, urlFor } from "@/lib/sanity";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// TOP（2026-11-26 に比較版から正式に反映）。独自のヘッダーを持つので、(site) の共通の枠の外に置く。
// 幅1280px以上は PC 表示（DesktopHome）、それより狭い幅は縦並び（StackedHome）。

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

// Sanity の記事・実績を常に最新で表示するため、動的レンダリングにする。
export const dynamic = "force-dynamic";

// TOP に出す事例（社長決定：2件）。題名にこの言葉を含むものを順に選び、足りなければ一覧の先頭から補う。
const PICKUP_WORKS = ["cocorome", "lipico"];

// Sanity の取得に失敗しても TOP 全体を落とさない（各カードは空状態を表示する）。
async function load<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

type RawWork = { _id: string; title: string; slug?: { current?: string }; thumbnail?: object };
type RawArticle = { _id: string; title: string; slug: { current: string }; publishedAt?: string; noindex?: boolean };

export default async function Home() {
  const rawArticles: RawArticle[] = await load(getArticles, []);
  const rawWorks: RawWork[] = (await load(getWorks, [])).filter((w: RawWork) => w.slug?.current);

  const picked = PICKUP_WORKS.flatMap((key) => rawWorks.find((w) => w.title?.toLowerCase().includes(key)) ?? []);
  const works: WorkItem[] = [...picked, ...rawWorks.filter((w) => !picked.includes(w))].slice(0, 2).map((w) => ({
    _id: w._id,
    title: w.title,
    slug: w.slug!.current!,
    image: w.thumbnail ? urlFor(w.thumbnail).width(900).auto("format").url() : null,
  }));

  const articles: ArticleItem[] = rawArticles
    .filter((a) => !a.noindex)
    .slice(0, 3)
    .map((a) => ({ _id: a._id, title: a.title, slug: a.slug.current, date: formatDate(a.publishedAt) }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: SITE_NAME,
          alternateName: "水野 学人",
          url: SITE_URL,
          image: `${SITE_URL}/profile.webp`,
          description: SITE_DESCRIPTION,
          address: { "@type": "PostalAddress", addressRegion: "静岡県", addressCountry: "JP" },
        }}
      />
      {/* 背景は下層ページと同じ（globals.css の body のグラデーション） */}
      <div className="hidden min-h-dvh xl:block">
        <DesktopHome works={works} articles={articles} />
        <SiteFooter />
      </div>
      <StackedHome works={works} articles={articles} className="xl:hidden" />
    </>
  );
}
