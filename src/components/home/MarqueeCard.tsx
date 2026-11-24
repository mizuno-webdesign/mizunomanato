import Image from "next/image";

// 対応ツールのマーキー（横に流す。アイコンのみ。社長指示 2026-11-24）。
// アイコンの出所：Shopify／Framer／Claude は Simple Icons（simple-icons@14.15.0、CC0）、
// カラーミーは shop-pro.jp の公式 icon.svg。いずれも各社の商標。ロゴの利用規約の確認は社長の判断事項（未確認）。
const ITEMS = [
  { name: "Shopify", icon: "/icons/shopify.svg" },
  { name: "カラーミー", icon: "/icons/colorme.svg" },
  { name: "Framer", icon: "/icons/framer.svg" },
  { name: "Claude", icon: "/icons/claude.svg" },
];

// 1セットが表示幅より長くないと、ループの継ぎ目に空きが出るため、4アイコンを2回並べて1セットにする。
const SET = [...ITEMS, ...ITEMS];

export default function MarqueeCard({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="tools-title"
      className={`flex flex-col justify-center gap-4 overflow-hidden rounded-card bg-surface py-5 ${className}`}
    >
      <h2 id="tools-title" className="px-6 text-lg font-bold">
        Tools
      </h2>
      {/* 読み上げ用：流れる帯は装飾として隠し、名称は静的な一覧で持つ */}
      <ul className="sr-only">
        {ITEMS.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
      <div
        aria-hidden
        className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
      >
        <div className="marquee-track flex w-max gap-4 pl-4">
          {[0, 1].flatMap((copy) =>
            SET.map((t, i) => (
              <span
                key={`${copy}-${i}`}
                className="grid size-14 shrink-0 place-items-center rounded-2xl bg-canvas"
              >
                <Image src={t.icon} alt="" width={28} height={28} className="size-7 rounded-md" unoptimized />
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
