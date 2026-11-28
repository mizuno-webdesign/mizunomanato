import type { Metadata } from "next";
import Image from "next/image";
import FlipHeading from "@/components/FlipHeading";
import CtaBand from "@/components/home/CtaBand";
import JsonLd from "@/components/JsonLd";
import { pageTitle } from "@/lib/seo";
import { PERSON_JSON_LD, SITE_URL, pageMetadata } from "@/lib/site";

const DESCRIPTION =
  "水野学人（Manato Mizuno）のプロフィールです。事業会社のEC部門で、サイト責任者を含む運用・改善の実務を経験してきました。その経験をもとに、無理なく運用を続けられる形を一緒に考えます。";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: pageTitle("プロフィール（EC運用の実務経験）"),
  description: DESCRIPTION,
  type: "profile",
});

// 紹介文は下書きを社長が承認して掲載（2026-11-25）。経歴の数字は載せない（社長判断）。
// 対応サービスの一覧は旧サイトのもの。【公開前に確認】今も対応できると言ってよいか、社長の確認が未了。
const CHANNELS = [
  { label: "カート・モール", items: ["Shopify", "COLOR ME", "Futureshop", "Amazon", "楽天市場", "Yahoo!ショッピング"] },
  { label: "広告", items: ["Google", "Meta", "Yahoo", "Microsoft", "Criteo"] },
  { label: "解析", items: ["GA4", "Google Search Console", "Clarity"] },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE_URL}/about`,
          mainEntity: PERSON_JSON_LD,
        }}
      />
      <section aria-labelledby="about-title" className="glass rounded-card p-3 shadow-card md:p-6">
        <FlipHeading as="h1" id="about-title" en="About" ja="自己紹介" className="px-3 pt-3 pb-4" />
        <div className="mx-auto w-full max-w-[768px] p-3 md:px-6 md:pb-10">
          <div className="flex items-center gap-4">
            <Image
              src="/profile-face.webp"
              alt="Manato Mizuno"
              width={112}
              height={119}
              sizes="112px"
              loading="eager"
              className="h-[102px] w-24 shrink-0 rounded-[10px] object-cover shadow-card md:h-[119px] md:w-28"
            />
            <div className="min-w-0">
              <p className="type-display text-ink">Manato Mizuno</p>
              <p className="type-caption text-ink-sub">水野 学人 ・ Shizuoka, Japan</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6 text-[15px] leading-[2] text-ink">
            <p>
              ECサイトは、作っただけでは売れません。何を改善するか、どこから手を付けるかが見えず、手が止まってしまう方は多いと感じています。
            </p>
            <p>
              事業会社のEC部門で、サイト責任者を含む運用・改善の実務を経験してきました。その経験をもとに、無理なく運用を続けられる形を一緒に考えます。
            </p>
          </div>

          <dl className="mt-10 flex flex-col gap-5">
            {CHANNELS.map((c) => (
              <div key={c.label} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <dt className="type-caption shrink-0 pt-1 font-semibold text-ink-sub sm:w-28">{c.label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {c.items.map((item) => (
                      <li key={item} className="rounded-full bg-raise px-3 py-1 type-caption text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
