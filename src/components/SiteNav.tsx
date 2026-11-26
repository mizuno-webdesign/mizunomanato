"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

// 幅1280px未満で使う上部のピル型ナビ（社長決定 2026-11-24：marco.fyi 型）。1280px以上は SiteHeader の DesktopHeader。
// スマホ（md 未満）は横スクロールのタブ（社長決定 2026-11-25）：
//  ・現在地のタブは、表示時に自動で見える位置へ寄せる（1つ手前のタブを残す）
//  ・指を離すと、タブの区切りにそろって止まる（scroll snap）
//  ・続きがある側の端だけをぼかす
// Service／About／Contact／Works 一覧は段階4で作成するまで 404 になる。
// 「Articles」→「Blogs」（社長指示 2026-11-24）：カード見出しと揃える。URL は /articles のまま。
const ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/service" },
  { label: "Works", href: "/works" },
  { label: "Blogs", href: "/articles" },
  { label: "Contact", href: "/contact" },
] as const;

const FADE = "40px";

export default function SiteNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  // どちら側に続きがあるか（端のぼかしの出し分け。PC では横にはみ出さないので、どちらも false）
  const [more, setMore] = useState({ left: false, right: false });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const updateMore = useCallback(() => {
    const ul = listRef.current;
    if (!ul) return;
    const left = ul.scrollLeft > 1;
    const right = ul.scrollLeft + ul.clientWidth < ul.scrollWidth - 1;
    setMore((m) => (m.left === left && m.right === right ? m : { left, right }));
  }, []);

  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    // 現在地を寄せる。ページ全体は動かさないよう、scrollIntoView ではなくリストだけを横に動かす。
    // 止まる位置はタブの区切りに合わせる必要があるため、1つ手前のタブの先頭を左端にする。
    const current = ul.querySelector('[aria-current="page"]')?.parentElement;
    const anchor = (current?.previousElementSibling ?? current) as HTMLElement | null | undefined;
    if (anchor) ul.scrollLeft = anchor.offsetLeft;

    const ro = new ResizeObserver(updateMore); // 監視開始時にも1回呼ばれる
    ro.observe(ul);
    return () => ro.disconnect();
  }, [pathname, updateMore]);

  const mask = `linear-gradient(90deg, ${more.left ? "transparent" : "#000"}, #000 ${FADE}, #000 calc(100% - ${FADE}), ${more.right ? "transparent" : "#000"})`;

  return (
    <nav
      aria-label="メイン"
      className="sticky top-3 z-50 flex justify-center pt-3"
    >
      <div className="flex max-w-full items-center gap-1 rounded-full bg-raise p-1 shadow-card backdrop-blur-xl backdrop-saturate-150 max-md:w-full md:p-[3px]">
        <ul
          ref={listRef}
          onScroll={updateMore}
          style={{ maskImage: mask, WebkitMaskImage: mask }}
          className="relative flex min-w-0 flex-1 snap-x snap-mandatory items-center gap-1.5 overflow-x-auto overscroll-x-contain rounded-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="shrink-0 snap-start">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "block whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-heading)] text-[15px] leading-[1.6] font-medium transition-colors duration-150 motion-reduce:transition-none md:px-[18px] md:py-1.5 md:text-sm",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
                    active
                      ? "bg-solid text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                      : "text-ink-sub hover:bg-sunken/70 hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* 明暗の切り替え。スマホで横にスクロールしても、常に右端に見える */}
        <ThemeToggle className="size-10 md:size-8" />
      </div>
    </nav>
  );
}
