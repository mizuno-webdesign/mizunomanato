import Image from "next/image";
import FlipHeading from "@/components/FlipHeading";
import MarqueeViewport from "./MarqueeViewport";

// 対応ツールのマーキー（横に流す。アイコンのみ、ホバー中のアイコンの下に名称。社長指示 2026-11-24）。
// アイコンの出所：Shopify／Framer／Claude／Google Analytics 4 は Simple Icons（simple-icons@14.15.0、CC0）、
// カラーミーは shop-pro.jp の公式 icon.svg。いずれも各社の商標。ロゴの利用規約の確認は社長の判断事項（未確認）。
const ITEMS = [
  { name: "Shopify", icon: "/icons/shopify.svg" },
  { name: "カラーミー", icon: "/icons/colorme.svg" },
  { name: "Framer", icon: "/icons/framer.svg" },
  { name: "Claude", icon: "/icons/claude.svg" },
  { name: "Google Analytics 4", icon: "/icons/ga4.svg" },
];

// 1セットが表示幅より長くないと、ループの継ぎ目に空きが出るため、5アイコンを2回並べて1セットにする。
const SET = [...ITEMS, ...ITEMS];

export default function MarqueeCard({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="tools-title"
      className={`flex flex-col overflow-hidden glass rounded-card p-3 shadow-card ${className}`}
    >
      <FlipHeading
        id="tools-title"
        en="Tools"
        ja="ツール"
        className="px-3 pt-3 pb-2"
      />
      {/* 読み上げ用：流れる帯は装飾として隠し、名称は静的な一覧で持つ */}
      <ul className="sr-only">
        {ITEMS.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
      {/* 名称ラベルが下にはみ出して切れないよう、下に余白（pb-7）を取る */}
      <MarqueeViewport className="marquee my-auto overflow-hidden pb-7 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="marquee-track flex w-max gap-4 pl-4">
          {[0, 1].flatMap((copy) =>
            SET.map((t, i) => (
              <span key={`${copy}-${i}`} className="group/tile relative shrink-0">
                <span className="grid size-14 place-items-center rounded-2xl bg-tile transition-colors duration-150 group-hover/tile:bg-tile-hover motion-reduce:transition-none">
                  <Image
                    src={t.icon}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 rounded-md"
                    unoptimized
                  />
                </span>
                <span className="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 type-caption whitespace-nowrap text-ink-sub opacity-0 transition-opacity duration-150 group-hover/tile:opacity-100 motion-reduce:transition-none">
                  {t.name}
                </span>
              </span>
            )),
          )}
        </div>
      </MarqueeViewport>
    </section>
  );
}
