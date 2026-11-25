import type { Metadata } from "next";
import IntroCard from "@/components/home/IntroCard";
import PhotoCard from "@/components/home/PhotoCard";
import MarqueeCard from "@/components/home/MarqueeCard";
import ServiceCards from "@/components/home/ServiceCards";
import ArticlesCard, { type ArticleItem } from "@/components/home/ArticlesCard";
import CtaBand from "@/components/home/CtaBand";
import WorksCard, { type WorkItem } from "@/components/home/WorksCard";
import { formatDate } from "@/lib/date";
import { getArticles, getWorks, urlFor } from "@/lib/sanity";
import JsonLd from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

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

export default async function Home() {
  const rawArticles = await load(getArticles, []);

  const rawWorks = await load(getWorks, []);
  const works: WorkItem[] = rawWorks
    .filter((w: { slug?: { current?: string } }) => w.slug?.current)
    .slice(0, 3)
    .map(
      (w: {
        _id: string;
        title: string;
        slug: { current: string };
        thumbnail?: object;
      }) => ({
        _id: w._id,
        title: w.title,
        slug: w.slug.current,
        image: w.thumbnail ? urlFor(w.thumbnail).width(1200).auto("format").url() : null,
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

  // 【見た目確認用の疑似表示】Blogs は PC で4行の見え方を確認するため、実記事が4本に満たないときは
  // 既存の記事を繰り返して埋める（社長指示 2026-11-24）。リンク先は元の記事と同じ。
  // 実記事が4本以上になれば自動で不要になる。公開前にこの埋め込みを外すかどうか、社長が判断する。
  const BLOG_PREVIEW_ROWS = 4;
  const blogRows: ArticleItem[] = articles.length
    ? Array.from({ length: Math.max(articles.length, BLOG_PREVIEW_ROWS) }, (_, i) => {
        const a = articles[i % articles.length];
        return i < articles.length ? a : { ...a, _id: `${a._id}-preview-${i}` };
      })
    : [];

  // 並び：PC（lg）は DOM 順＝配置図どおり。スマホ・タブレットは order で
  // 自己紹介 → 頼めること → 実績 → 記事 → 写真 → マーキー → 相談する（最下部。社長指示 2026-11-24）の順に入れ替える。
  // スマホでも、上部の固定ナビの「Contact」から常に1タップで届く。
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: SITE_NAME,
          alternateName: "水野 学人",
          url: SITE_URL,
          image: `${SITE_URL}/portrait.webp`,
          description: SITE_DESCRIPTION,
          address: { "@type": "PostalAddress", addressRegion: "静岡県", addressCountry: "JP" },
        }}
      />
      {/* PC：縦も横と同じ分割法で揃える（細分化。社長指示 2026-11-24）。
          1段目（自己紹介）と4段目（相談）は元の高さ（200px／77px）に固定。
          2段目（事例・ブログ）と3段目（サービス）は画面の高さに比例（30dvh：20dvh＝3：2）で、前回より少し狭く（900px画面で 270／180px）。2段目は Blogs の4行が入る最小270px。 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:grid-rows-[200px_clamp(270px,30dvh,330px)_clamp(160px,20dvh,220px)_77px]">
        <IntroCard className="order-1 md:col-span-6 lg:order-none lg:col-span-7" />
        <PhotoCard className="lg:order-none lg:col-span-2" />
        <MarqueeCard className="order-5 md:col-span-6 lg:order-none lg:col-span-3" />
        <WorksCard works={works} className="order-3 md:col-span-3 lg:order-none lg:col-span-6" />
        <ArticlesCard articles={blogRows} className="order-4 md:col-span-3 lg:order-none lg:col-span-6" />
        <ServiceCards className="order-2 md:col-span-6 lg:order-none lg:col-span-12" />
        <CtaBand className="order-6 md:col-span-6 lg:order-none lg:col-span-12" />
      </div>
    </>
  );
}
