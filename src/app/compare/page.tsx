import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaButton from "@/components/CtaButton";
import DesktopMock from "@/components/compare/DesktopMock";
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
// 幅1024px以上は、案の画像を実測して再現した DesktopMock を表示する。それより狭い幅は、前の比較版の表示を残す。
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

  // 案の実績は COCOROMe と Lipico の2件（画像は Sanity の実際のサムネイル）
  const mockWorks = ["cocorome", "lipico"].flatMap((key) => {
    const w = rawWorks.find(
      (r: { title?: string; slug?: { current?: string } }) =>
        r.slug?.current && r.title?.toLowerCase().includes(key),
    );
    return w
      ? [{ _id: w._id, title: w.title, slug: w.slug.current, image: w.thumbnail ? urlFor(w.thumbnail).width(900).auto("format").url() : null }]
      : [];
  });

  return (
    <>
      <div className="hidden min-h-dvh bg-[#f9fafe] lg:block">
        <DesktopMock works={mockWorks} articles={articles} />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full flex-col px-4 lg:hidden">
        <div className="flex items-center justify-between pt-3">
          <Link
            href="/compare"
            aria-label="Manato Mizuno トップ"
            className="grid size-10 place-items-center rounded-xl bg-cta text-[20px] leading-none font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            M
          </Link>
          <CtaButton className="px-5! py-2! text-[14px]!" />
        </div>
        <SiteNav />
        <main className="flex-1 pt-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <ProfileCard className="md:col-span-6" />
            <ServiceFlow className="md:col-span-6" />
            <WorksCard works={works} className="md:col-span-6" />
            <div className="flex min-h-0 flex-col gap-4 md:col-span-6">
              <MarqueeCard className="order-2 shrink-0" />
              <ArticlesCard articles={articles} className="order-1" />
            </div>
            {/* 読み終えた位置にも相談の入口を残す */}
            <CtaBand className="md:col-span-6" />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
