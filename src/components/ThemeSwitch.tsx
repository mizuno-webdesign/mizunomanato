"use client";

import { useTheme } from "@/components/ThemeToggle";

// 明暗を切り替えるスイッチ（幅1280px未満のヘッダー。社長指示 2026-11-26：オンオフしたくなる感じ、目立ちすぎないモノトーン）。
// オン（右）が暗い表示。つまみが滑り、中の太陽と月が回って入れ替わる。押している間は、つまみが少し伸びる。
// 見た目は <html data-theme> から CSS で決める（読み込みの直後に、つまみが動いて見えないように）。
// 動きを減らす設定では、すぐに切り替える。
const MOVE = "motion-reduce:transition-none";
const ICON = `absolute size-[15px] transition-[rotate,scale,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${MOVE}`;

function Sun({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      <path d="M12 2v2.4M12 19.600v2.4M2 12h2.4M19.600 12h2.4M4.900 4.900l1.700 1.700M17.400 17.400l1.700 1.700M4.900 19.100l1.700-1.700M17.400 6.600l1.700-1.700" />
    </svg>
  );
}

function Moon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.5 14.600A8.800 8.800 0 0 1 9.400 3.500a8.800 8.800 0 1 0 11.100 11.100Z" />
    </svg>
  );
}

export default function ThemeSwitch() {
  const { theme, toggle } = useTheme();

  return (
    // 見た目は高さ32pxでも、押せる範囲は縦44pxにする
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="ダークモード"
      onClick={toggle}
      className="group/switch relative grid h-11 w-[60px] shrink-0 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-accent"
    >
      {/* 溝 */}
      <span
        aria-hidden
        className={`relative block h-8 w-[60px] rounded-full border border-ink-sub/35 bg-sunken shadow-[inset_0_1px_3px_rgb(0_0_0/0.18)] transition-[background-color,border-color] duration-300 ${MOVE}`}
      >
        {/* 反対側にうっすら見える、切り替え先の絵 */}
        <Moon className="only-light absolute top-1/2 right-[9px] size-3 -translate-y-1/2 text-ink-sub" />
        <Sun className="only-dark absolute top-1/2 left-[9px] size-3 -translate-y-1/2 text-ink-sub" />
        {/* つまみ */}
        <span
          className={`absolute top-[2px] left-[2px] grid h-[26px] w-[26px] place-items-center rounded-full bg-white shadow-[0_1px_4px_rgb(0_0_0/0.22)] transition-[translate,width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-active/switch:w-[31px] [[data-theme=dark]_&]:translate-x-[28px] [[data-theme=dark]_&]:bg-ink-sub [[data-theme=dark]_&]:group-active/switch:translate-x-[23px] ${MOVE}`}
        >
          <Sun className={`${ICON} text-ink-sub [[data-theme=dark]_&]:scale-50 [[data-theme=dark]_&]:rotate-90 [[data-theme=dark]_&]:opacity-0`} />
          <Moon className={`${ICON} scale-50 -rotate-90 text-canvas opacity-0 [[data-theme=dark]_&]:scale-100 [[data-theme=dark]_&]:rotate-0 [[data-theme=dark]_&]:opacity-100`} />
        </span>
      </span>
    </button>
  );
}
