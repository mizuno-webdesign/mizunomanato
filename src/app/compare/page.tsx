import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaButton from "@/components/CtaButton";
import ProfileCard from "@/components/compare/ProfileCard";
import ServiceFlow from "@/components/compare/ServiceFlow";
import ArticlesCard, { type ArticleItem } from "@/components/home/ArticlesCard";
import CtaBand from "@/components/home/CtaBand";
import MarqueeCard from "@/components/home/MarqueeCard";
import WorksCard, { type WorkItem } from "@/components/home/WorksCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { formatDate } from "@/lib/date";
import { getArticles, getWorks, urlFor } from "@/lib/sanity";

// TOP の比較版（2026-11-26）。今の TOP（(site)/page.tsx）と見比べるための一時ページで、開発サーバーでだけ表示する
// （本番ビルドでは 404）。採否が決まったら、このフォルダと src/components/compare/ は削除するか TOP に反映する。
// データの取得は今の TOP と同じ内容を写している。
export const metadata: Metadata = {
  title: "TOP 比較版（確認用）",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function load<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function ComparePage() {
  if (process.env.NODE_ENV === "production") notFound();

  const rawArticles = await load(getArticles, []);
  const rawWorks = await load(getWorks, []);

  const works: WorkItem[] = rawWorks
    .filter((w: { slug?: { current?: string } }) => w.slug?.current)
    .slice(0, 3)
    .map((w: { _id: string; title: string; slug: { current: string }; thumbnail?: object }) => ({
      _id: w._id,
      title: w.title,
      slug: w.slug.current,
      image: w.thumbnail ? urlFor(w.thumbnail).width(1200).auto("format").url() : null,
    }));

  const articles: ArticleItem[] = rawArticles
    .filter((a: { noindex?: boolean }) => !a.noindex)
    .slice(0, 3)
    .map((a: { _id: string; title: string; slug: { current: string }; publishedAt?: string }) => ({
      _id: a._id,
      title: a.title,
      slug: a.slug.current,
      date: formatDate(a.publishedAt),
    }));

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[1560px] flex-col px-4">
      {/* ロゴと相談ボタン。PC はナビと同じ段の左右の端、それより狭い幅はナビの上の段に置く */}
      <div className="flex items-center justify-between pt-3 lg:contents">
        <Link
          href="/compare"
          aria-label="Manato Mizuno トップ"
          className="grid size-10 place-items-center rounded-xl bg-cta text-[20px] leading-none font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:absolute lg:top-3 lg:left-4"
        >
          M
        </Link>
        <CtaButton className="px-5! py-2! text-[14px]! lg:absolute lg:top-3 lg:right-4 lg:z-[60]" />
      </div>
      <SiteNav />
      <main className="flex-1 pt-5">
        {/* PC：2段。上段＝プロフィール4：サービス8（サービスが主役）、下段＝事例6：ツールとブログ6。
            下の相談の帯は、PC では右上のボタンに置き換える。 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:grid-rows-[clamp(400px,48dvh,500px)_clamp(330px,38dvh,420px)]">
          <ProfileCard className="md:col-span-6 lg:col-span-4" />
          <ServiceFlow className="md:col-span-6 lg:col-span-8" />
          <WorksCard works={works} className="md:col-span-6 lg:col-span-6" />
          <div className="flex min-h-0 flex-col gap-4 md:col-span-6 lg:col-span-6">
            {/* ツールの帯は、PC では見出しと横並びにして低くする（部品は今の TOP と同じもの） */}
            <MarqueeCard className="order-2 shrink-0 lg:order-1 lg:flex-row lg:items-center lg:py-1.5 lg:[&>.marquee]:min-w-0 lg:[&>.marquee]:flex-1 lg:[&>.marquee]:pt-1 lg:[&>.marquee]:pb-6 lg:[&>h2]:py-0 lg:[&>h2]:pr-4" />
            <ArticlesCard articles={articles} className="order-1 lg:order-2 lg:min-h-0 lg:flex-1" />
          </div>
          {/* スマホ・タブレットは、読み終えた位置にも相談の入口を残す */}
          <CtaBand className="md:col-span-6 lg:hidden" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
