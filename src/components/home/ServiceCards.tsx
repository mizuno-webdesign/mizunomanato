import Link from "next/link";
import Latin from "@/components/Latin";
import { ArrowCircle } from "@/components/ArrowCircle";

// 頼めること：大きな1枚のカードを3分割（社長指示 2026-11-24）。TOPは名前＋1行のみ、詳細は /service。
// 区切り線は使わない（社長指示）。矢印は右下の「↗」丸ボタン。アイコンは自作の線画（ライセンス問題なし）。
const SERVICES = [
  {
    name: "新規構築",
    line: "Shopify でストアを一から作る。",
    icon: (
      <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5h16M9.5 20v-5.5h5V20" />
    ),
  },
  {
    name: "改修",
    line: "機能追加や導線の変更など、今のストアに手を入れる。",
    icon: (
      <>
        <path d="M4 7h9M19 7h1M4 17h1M11 17h9" />
        <circle cx="16" cy="7" r="2.2" />
        <circle cx="8" cy="17" r="2.2" />
      </>
    ),
  },
  {
    name: "運用支援",
    line: "分析・改善の提案や更新で、公開後を支える。",
    icon: <path d="M4 4v16h16M8 15.5l3.5-4.5 3 2.5L19 7.5" />,
  },
];

export default function ServiceCards({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="services-title"
      className={`rounded-card bg-surface p-3 ${className}`}
    >
      <h2 id="services-title" className="px-3 pt-3 pb-2 text-lg font-bold">
        Services
      </h2>
      <ul className="grid md:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.name}>
            <Link
              href="/service"
              className="group flex h-full items-start gap-4 rounded-2xl p-3 transition-colors duration-150 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none md:flex-col lg:flex-row"
            >
              <span
                aria-hidden
                className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </span>
              <span className="flex-1">
                <span className="block text-base font-bold">{s.name}</span>
                <span className="mt-0.5 block text-sm leading-[1.7] text-ink-sub">
                  <Latin>{s.line}</Latin>
                </span>
              </span>
              <ArrowCircle className="self-end max-md:self-center lg:self-end" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
