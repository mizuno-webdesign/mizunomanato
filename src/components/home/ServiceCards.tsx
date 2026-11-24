import Link from "next/link";
import Latin from "@/components/Latin";

// 頼めること3本（TOPは名前＋1行のみ。詳細は /service。社長確定 2026-11-24）。
const SERVICES = [
  { name: "新規構築", line: "Shopify でストアを一から作る。", order: "order-3" },
  { name: "改修", line: "機能追加や導線の変更など、今のストアに手を入れる。", order: "order-4" },
  { name: "運用支援", line: "分析・改善の提案や更新で、公開後を支える。", order: "order-5" },
];

export default function ServiceCards() {
  return (
    <>
      {SERVICES.map((s) => (
        <Link
          key={s.name}
          href="/service"
          className={`${s.order} group relative flex min-h-[104px] flex-col justify-center rounded-card bg-surface py-5 pr-12 pl-6 transition-colors duration-150 hover:bg-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none md:col-span-2 lg:order-none lg:col-span-4`}
        >
          <h2 className="text-lg font-bold">{s.name}</h2>
          <p className="mt-1 text-sm leading-[1.7] text-ink-sub">
            <Latin>{s.line}</Latin>
          </p>
          <span
            aria-hidden
            className="absolute top-1/2 right-5 -translate-y-1/2 text-2xl leading-none text-ink-sub"
          >
            ›
          </span>
        </Link>
      ))}
    </>
  );
}
