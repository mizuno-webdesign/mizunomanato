import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";
import { SERVICES } from "@/lib/services";
import ServiceDiagram from "./ServiceDiagram";

// 比較版：サービスを上段の主役にし、3本を「構築 → 改修 → 運用支援」の流れとして見せる。
// 内容は今の TOP と同じ src/lib/services.tsx。PC（md 以上）は横3列を矢印でつなぎ、スマホは図を左に置いて縦に並べる。
export default function ServiceFlow({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="services-title"
      className={`glass flex flex-col rounded-card p-3 shadow-card ${className}`}
    >
      <FlipHeading id="services-title" en="Services" ja="サービス" className="px-3 pt-3 pb-2" />
      <ol className="grid min-h-0 flex-1 gap-1 md:grid-cols-3 md:gap-6">
        {SERVICES.map((s, i) => (
          <li key={s.id} className="relative flex min-h-0 flex-col">
            <Link
              href="/service"
              className="group flex min-h-0 flex-1 items-center gap-4 rounded-2xl p-3 transition-colors duration-150 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none md:flex-col md:items-stretch md:gap-3"
            >
              <span className="relative block w-28 shrink-0 max-lg:aspect-[10/7] md:w-auto lg:min-h-0 lg:flex-1">
                <ServiceDiagram id={s.id} className="size-full lg:absolute lg:inset-0" />
              </span>
              <span className="block md:min-h-[96px] lg:min-h-[112px] xl:min-h-[96px]">
                <span className="block text-[20px] leading-[1.4] font-semibold text-heading">{s.name}</span>
                <span className="type-body mt-1 block text-body-2">{s.line}</span>
              </span>
            </Link>
            {i < SERVICES.length - 1 && (
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute top-[36%] -right-6 hidden size-6 text-accent md:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h15M14 7l5 5-5 5" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
