import Image from "next/image";
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
      className={`flex min-h-[200px] flex-col gap-3 glass lg:min-h-0 rounded-card p-6 shadow-card ${className}`}
    >
      {/* スマホ・タブレット：写真カードの代わりに、名前の左に丸いアイコン（SNS風。社長指示 2026-11-24）。PC では写真カードを使う */}
      <div className="flex items-center gap-4">
        <Image
          src="/portrait.webp"
          alt="Manato Mizuno"
          width={64}
          height={64}
          sizes="64px"
          className="size-16 shrink-0 rounded-full object-cover shadow-card lg:hidden"
        />
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <FlipHeading
            as="h1"
            size="type-display"
            tone="text-ink"
            upper={false}
            id="intro-name"
            en="Manato Mizuno"
            ja="水野 学人"
          />
          <span
            className={`type-caption inline-flex items-center gap-2 font-semibold ${
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
        <p className="type-caption text-ink-sub">
          Shizuoka, Japan
        </p>
      </div>
      </div>
      <p className="type-lead max-w-[34em] max-md:text-[15px] max-md:leading-[1.7] lg:max-w-none">
        <span className="inline-block lg:block">
          Shopify を中心に、ECサイト専門家として
        </span>
        <span className="inline-block lg:block">新規構築・改修・運用支援を行っています。</span>
      </p>
    </section>
  );
}
