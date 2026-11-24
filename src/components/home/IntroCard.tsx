import Latin from "@/components/Latin";
import FlipHeading from "@/components/FlipHeading";
import {
  ACCEPTING_NEW_REQUESTS,
  AVAILABILITY_LABEL,
} from "@/lib/availability";

// 自己紹介（社長確定 2026-11-24）。名前の横に対応可否（色＋短い文言）、名前の下に所在地（英語）。
// 名前と本文の間隔を詰めた（社長指示）。PC では「新規構築」の前で改行する。
// 受付中のときだけ、丸が穏やかに明滅する（globals.css の status-dot。動きを減らす設定では止まる）。
export default function IntroCard({ className = "" }: { className?: string }) {
  const open = ACCEPTING_NEW_REQUESTS;
  return (
    <section
      aria-labelledby="intro-name"
      className={`flex min-h-[200px] flex-col gap-3 glass rounded-card p-6 shadow-card ${className}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <FlipHeading
            as="h1"
            id="intro-name"
            en={<Latin>Manato Mizuno</Latin>}
            ja="水野 学人"
          />
          <span
            className={`inline-flex items-center gap-2 text-[13px] font-bold ${
              open ? "text-ok" : "text-ng"
            }`}
          >
            <span
              aria-hidden
              className={`size-2 rounded-full bg-current ${open ? "status-dot" : ""}`}
            />
            {open ? AVAILABILITY_LABEL.open : AVAILABILITY_LABEL.closed}
          </span>
        </div>
        <p className="text-[13px] leading-[1.6] text-ink-sub">
          <Latin>Shizuoka, Japan</Latin>
        </p>
      </div>
      <p className="max-w-[34em] text-base leading-[1.8] font-medium lg:max-w-none lg:text-lg">
        <span className="lg:block">
          <Latin>Shopify を中心に、ECサイト専門家として</Latin>
        </span>
        <span className="lg:block">新規構築・改修・運用支援を行っています。</span>
      </p>
    </section>
  );
}
