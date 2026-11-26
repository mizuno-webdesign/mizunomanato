import Image from "next/image";
import FlipHeading from "@/components/FlipHeading";
import { ACCEPTING_NEW_REQUESTS, AVAILABILITY_LABEL } from "@/lib/availability";

// 比較版：名前 → 肩書き → 説明の順に強弱を付ける。写真は独立したカードをやめて、このカードに入れる。
// 文言は今の TOP の紹介文を「肩書き」と「説明」に分けて並べ替えたもの（新しい主張は足していない）。
export default function ProfileCard({ className = "" }: { className?: string }) {
  const open = ACCEPTING_NEW_REQUESTS;
  return (
    <section
      aria-labelledby="intro-name"
      className={`glass flex flex-col justify-center gap-4 rounded-card p-6 shadow-card lg:px-8 ${className}`}
    >
      {/* 幅1280px未満は写真と名前を横に並べて、カードの高さを抑える */}
      <div className="flex items-center gap-4 xl:flex-col xl:items-start xl:gap-4">
        <Image
          src="/portrait.webp"
          alt="Manato Mizuno"
          width={128}
          height={128}
          sizes="128px"
          loading="eager"
          fetchPriority="high"
          className="size-20 shrink-0 rounded-3xl object-cover shadow-card xl:size-28"
        />
        <FlipHeading
          as="h1"
          size="text-[36px] leading-[1.12] font-bold xl:text-[52px]"
          tone="text-ink"
          upper={false}
          id="intro-name"
          en={
            <>
              Manato
              <br />
              Mizuno
            </>
          }
          ja="水野 学人"
        />
      </div>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="type-caption text-ink-sub">Shizuoka, Japan</span>
        <span
          className={`type-caption inline-flex items-center gap-2 font-semibold ${open ? "text-ok" : "text-ng"}`}
        >
          <span aria-hidden className={`size-2 rounded-full bg-current ${open ? "status-dot" : ""}`} />
          {open ? AVAILABILITY_LABEL.open : AVAILABILITY_LABEL.closed}
        </span>
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-[20px] leading-[1.5] font-semibold text-heading">ECサイト専門家</p>
        <p className="type-body text-body-2">
          <span className="inline-block">Shopify を中心に、</span>
          <span className="inline-block">新規構築・改修・運用支援を</span>
          <span className="inline-block">行っています。</span>
        </p>
      </div>
    </section>
  );
}
