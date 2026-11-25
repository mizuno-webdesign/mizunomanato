import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";
import ServiceIcon from "@/components/ServiceIcon";
import { SERVICES } from "@/lib/services";

// 頼めること：大きな1枚のカードを3分割（社長指示 2026-11-24）。TOPは名前＋1行のみ、詳細は /service。
// 区切り線は使わない（社長指示）。矢印は削除（2026-11-24、リンクの見せ方は社長が検討中）。内容は src/lib/services.tsx。

export default function ServiceCards({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="services-title"
      className={`glass flex flex-col rounded-card p-3 shadow-card ${className}`}
    >
      <FlipHeading
        id="services-title"
        en="Services"
        ja="サービス"
        className="px-3 pt-3 pb-2"
      />
      <ul className="grid flex-1 items-center md:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <Link
              href="/service"
              className="group flex h-full items-start gap-4 rounded-2xl p-3 transition-colors duration-150 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none md:flex-col lg:flex-row"
            >
              <ServiceIcon>{s.icon}</ServiceIcon>
              <span className="flex-1">
                <span className="type-heading block text-heading">{s.name}</span>
                <span className="type-body mt-0.5 block text-body-2">
                  {s.line}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
