import SiteFrame from "@/components/SiteFrame";
import IntroCard from "@/components/home/IntroCard";
import PhotoCard from "@/components/home/PhotoCard";
import MarqueeCard from "@/components/home/MarqueeCard";
import ServiceCards from "@/components/home/ServiceCards";
import WorksCard, { type WorkItem } from "@/components/home/WorksCard";
import ArticlesCard, { type ArticleItem } from "@/components/home/ArticlesCard";
import CtaBand from "@/components/home/CtaBand";
import { getArticles, getWorks, urlFor } from "@/lib/sanity";

// Sanity の記事・実績を常に最新で表示するため、動的レンダリングのままにする（旧TOPの方針を引き継ぎ）。
export const dynamic = "force-dynamic";

// Sanity の取得に失敗しても TOP 全体を落とさない（各カードは空状態を表示する）。
async function load<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", ".");
}

export default async function Home() {
  const [rawWorks, rawArticles] = await Promise.all([
    load(getWorks, []),
    load(getArticles, []),
  ]);

  const works: WorkItem[] = rawWorks.map(
    (w: {
      _id: string;
      title: string;
      slug?: { current?: string };
      year?: string;
      note?: string;
      thumbnail?: unknown;
    }) => ({
      _id: w._id,
      title: w.title,
      slug: w.slug?.current,
      year: w.year,
      note: w.note,
      thumbUrl: w.thumbnail
        ? urlFor(w.thumbnail).width(1000).height(560).fit("crop").auto("format").url()
        : undefined,
    }),
  );

  const articles: ArticleItem[] = rawArticles
    .filter((a: { noindex?: boolean }) => !a.noindex)
    .slice(0, 3)
    .map(
      (a: {
        _id: string;
        title: string;
        slug: { current: string };
        publishedAt?: string;
      }) => ({
        _id: a._id,
        title: a.title,
        slug: a.slug.current,
        date: formatDate(a.publishedAt),
      }),
    );

  // 並び：PC（lg）は DOM 順＝配置図どおり。スマホ・タブレットは order で
  // 自己紹介 → 相談する → 頼めること → 実績 → 記事 → 写真 → マーキー の順に入れ替える。
  return (
    <SiteFrame>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        <IntroCard className="order-1 md:col-span-6 lg:order-none lg:col-span-7" />
        <PhotoCard className="order-8 md:col-span-3 lg:order-none lg:col-span-2" />
        <MarqueeCard className="order-9 md:col-span-3 lg:order-none lg:col-span-3" />
        <ServiceCards className="order-3 md:col-span-6 lg:order-none lg:col-span-12" />
        <WorksCard works={works} className="order-6 md:col-span-3 lg:order-none lg:col-span-6" />
        <ArticlesCard articles={articles} className="order-7 md:col-span-3 lg:order-none lg:col-span-6" />
        <CtaBand className="order-2 md:col-span-6 lg:order-none lg:col-span-12" />
      </div>
    </SiteFrame>
  );
}
