import Latin from "@/components/Latin";
import {
  ACCEPTING_NEW_REQUESTS,
  AVAILABILITY_LABEL,
} from "@/lib/availability";

// 自己紹介（社長確定 2026-11-24）。名前の横に対応可否（色＋文言）。
export default function IntroCard({ className = "" }: { className?: string }) {
  const open = ACCEPTING_NEW_REQUESTS;
  return (
    <section
      aria-labelledby="intro-name"
      className={`flex min-h-[200px] flex-col justify-between gap-8 rounded-card bg-surface p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 id="intro-name" className="text-lg font-bold">
          <Latin>Manato Mizuno</Latin>
        </h1>
        <span
          className={`inline-flex items-center gap-2 rounded-full bg-sunken px-3 py-0.5 text-[13px] font-bold ${
            open ? "text-ok" : "text-ng"
          }`}
        >
          <span aria-hidden className="size-2 rounded-full bg-current" />
          {open ? AVAILABILITY_LABEL.open : AVAILABILITY_LABEL.closed}
        </span>
      </div>
      <p className="max-w-[34em] text-base leading-[1.8] font-medium lg:text-lg">
        <Latin>
          Shopify を中心に、ECサイト専門家として新規構築・改修・運用支援を行っています。
        </Latin>
      </p>
    </section>
  );
}
