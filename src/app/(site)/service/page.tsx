import type { Metadata } from "next";
import FlipHeading from "@/components/FlipHeading";
import ServiceIcon from "@/components/ServiceIcon";
import CtaBand from "@/components/home/CtaBand";
import { SERVICES } from "@/lib/services";
import { pageTitle } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const DESCRIPTION =
  "Shopify ストアの新規構築、稼働中ストアの機能追加やデザイン・導線の改修、分析・改善提案・更新作業などの運用支援を行っています。実店舗やモールからの移行、BtoB を含む販売の開始といった場面とあわせて、内容を紹介します。";

export const metadata: Metadata = pageMetadata({
  path: "/service",
  title: pageTitle("Shopify の新規構築・改修・運用支援サービス"),
  description: DESCRIPTION,
});

export default function ServicePage() {
  return (
    <div className="flex flex-col gap-4">
      <section aria-labelledby="service-title" className="glass rounded-card p-3 shadow-card md:p-6">
        <FlipHeading as="h1" id="service-title" en="Services" ja="サービス" className="px-3 pt-3 pb-4" />
        <ul className="mx-auto flex w-full max-w-[768px] flex-col gap-10 p-3 md:px-6 md:pb-10">
          {SERVICES.map((s) => (
            <li key={s.id} id={s.id} className="flex scroll-mt-24 flex-col gap-4 sm:flex-row sm:gap-5">
              <ServiceIcon>{s.icon}</ServiceIcon>
              <div className="min-w-0 flex-1">
                <h2 className="text-[20px] leading-[1.5] font-semibold text-heading">{s.name}</h2>
                <p className="mt-2 text-[15px] leading-[2] text-ink">{s.what}</p>
                {/* 「こんなとき」は、薄い緑で囲って見分けやすくする。緑はアクセントの色を薄く敷くので、明暗の両方になじむ */}
                <div className="mt-4 rounded-xl bg-accent/8 px-4 py-3">
                  <h3 className="type-caption font-semibold text-accent">こんなとき</h3>
                  <ul className="mt-1 list-disc pl-5 text-[15px] leading-[2] text-body-2 marker:text-accent">
                    {s.cases.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </div>
  );
}
