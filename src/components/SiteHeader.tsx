"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CtaButton from "@/components/CtaButton";
import SiteNav from "@/components/SiteNav";
import ThemeSwitch from "@/components/ThemeSwitch";
import ThemeToggle from "@/components/ThemeToggle";
import { u } from "@/components/home/Arrow";
import RollText from "@/components/home/RollText";

// 全ページ共通のヘッダー（TOP と下層ページで同じものを使う。社長指示 2026-11-26）。
// ・幅1280px以上：DesktopHeader。TOP の案の寸法（幅1487を基準に、画面幅に合わせて伸び縮み）。
// ・それより狭い幅：ロゴと相談ボタンの段と、その下の横スクロールのナビ（SiteNav。下へ送っても上に残る）。
const NAV = [
  { en: "Home", ja: "ホーム", href: "/" },
  { en: "Services", ja: "サービス", href: "/service" },
  { en: "Works", ja: "事例", href: "/works" },
  { en: "Blogs", ja: "記事", href: "/articles" },
  { en: "About", ja: "プロフィール", href: "/about" },
];

const at = (x: number, y: number, w: number, h: number): React.CSSProperties => ({ position: "absolute", left: u(x), top: u(y), width: u(w), height: u(h) });
const BORDER = "1px solid var(--top-border)";

function Logo({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <Link href="/" data-ga-area="header" aria-label="Manato Mizuno トップ" className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`} style={style}>
      <Image src="/logo/logo-green.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-light size-full object-contain" />
      <Image src="/logo/logo-white.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-dark size-full object-contain" />
    </Link>
  );
}

// PC のヘッダーの部品。親に --u（画面幅 ÷ 1487）と position: relative が必要。
export function DesktopHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <Logo className="block" style={at(67, 34.5, 74, 31)} />
      {/* ナビ：中心は x=743.5。枠の幅は中身に合わせる */}
      <nav
        aria-label="メイン"
        className="flex items-center"
        style={{
          position: "absolute",
          left: u(743.5),
          top: u(24),
          height: u(52),
          gap: u(6), // 乗せた項目と現在地の背景がくっつかないように
          transform: "translateX(-50%)",
          padding: `0 ${u(6)}`,
          border: BORDER,
          borderRadius: u(26),
          background: "var(--top-nav)",
          whiteSpace: "nowrap",
        }}
      >
        {NAV.map((n) => {
          const active = isActive(n.href);
          return (
            <Link
              key={n.en}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={`group/roll flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${active ? "bg-[var(--top-nav-active)]" : "hover:bg-[var(--top-nav-hover)]"}`}
              style={{ height: u(40), minWidth: u(112), padding: `0 ${u(18)}`, borderRadius: u(20), fontSize: u(15), lineHeight: 1.5, fontWeight: 500, color: active ? "var(--top-green)" : "var(--top-ink)" }}
            >
              <RollText en={n.en} ja={n.ja} center enClassName="font-[family-name:var(--font-heading)]" />
            </Link>
          );
        })}
      </nav>
      {/* 明暗の切り替え。相談ボタンの左に置く */}
      <ThemeToggle style={{ ...at(1201, 28, 44, 44), border: BORDER, background: "var(--top-nav)" }} />
      <Link
        href="/contact"
        data-ga-area="header"
        className="flex items-center justify-center whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        style={{ ...at(1257, 25, 170, 50), borderRadius: u(25), backgroundColor: "var(--top-cta)", color: "#fff", fontSize: u(16), fontWeight: 500, lineHeight: 1 }}
      >
        相談する
      </Link>
    </>
  );
}

// 幅1280px未満のヘッダー。親は左右16pxの余白を持つ縦並びの箱（ナビが上に残れるように、箱でくるまない）。
export function CompactHeader() {
  return (
    <>
      <div data-ga-area="header" className="flex items-center justify-between px-2.5 pt-5 pb-1 xl:hidden">
        <Logo className="block h-6 w-[57px]" />
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <CtaButton className="px-5! py-2! text-[14px]!" />
        </div>
      </div>
      <div className="contents xl:hidden">
        <SiteNav />
      </div>
    </>
  );
}

// 下層ページ用：画面幅に合わせて、どちらかを出す。PC の高さは、TOP で最初のカードが始まる位置（130）まで。
export default function SiteHeader() {
  return (
    <>
      <div className="hidden xl:block" style={{ containerType: "inline-size" }}>
        <div className="relative" style={{ "--u": "calc(100cqw / 1487)", height: u(130) } as React.CSSProperties}>
          <DesktopHeader />
        </div>
      </div>
      <CompactHeader />
    </>
  );
}
