"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 上部ピル型ナビ（社長決定 2026-11-24：marco.fyi 型）。項目と順序は案。
// Service／About／Contact／Works 一覧は段階4で作成するまで 404 になる。
// 「Articles」→「Blogs」（社長指示 2026-11-24）：カード見出しと揃え、ラベルを短くしてスマホの窮屈さを減らす。URL は /articles のまま。
const ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/service" },
  { label: "Works", href: "/works" },
  { label: "Blogs", href: "/articles" },
  { label: "Contact", href: "/contact" },
] as const;

export default function SiteNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="メイン"
      className="sticky top-3 z-50 flex justify-center pt-3"
    >
      <ul className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-white/70 p-[3px] shadow-card backdrop-blur-xl backdrop-saturate-150 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "block whitespace-nowrap rounded-full px-[7px] py-2 text-[13px] leading-[1.6] transition-colors duration-150 motion-reduce:transition-none min-[400px]:px-3 sm:px-[18px] sm:py-1.5 sm:text-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  active
                    ? "bg-white font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                    : "text-ink-sub hover:bg-sunken/70 hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
