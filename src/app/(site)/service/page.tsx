import type { Metadata } from "next";
import FlipHeading from "@/components/FlipHeading";
import ServiceIcon from "@/components/ServiceIcon";
import CtaBand from "@/components/home/CtaBand";
import { SERVICES } from "@/lib/services";
import { pageMetadata } from "@/lib/site";

const DESCRIPTION = "Shopify の新規構築・改修・運用支援について。";

export const metadata: Metadata = pageMetadata({
  path: "/service",
  title: "Service — Manato Mizuno",
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
                <h3 className="mt-4 type-caption font-semibold text-ink-sub">こんなとき</h3>
                <ul className="mt-1 list-disc pl-5 text-[15px] leading-[2] text-body-2">
                  {s.cases.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </div>
  );
}
