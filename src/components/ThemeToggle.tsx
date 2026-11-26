"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_COLORS, THEME_KEY } from "@/lib/theme";

type Theme = "light" | "dark";
const QUERY = "(prefers-color-scheme: dark)";

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// 今の表示（<html data-theme>）を読む。端末の設定が変わったときは、自分で選んでいなければ追いかける。
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = matchMedia(QUERY);
  const follow = () => {
    if (!stored()) apply(media.matches ? "dark" : "light");
  };
  media.addEventListener("change", follow);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", follow);
  };
}

const read = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

// 今の表示と、切り替える関数。丸いボタン（ThemeToggle）とスイッチ（ThemeSwitch）で共通に使う。
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);

  // ブラウザ上部の色（theme-color）も、今の表示にそろえる。
  // サイト内の移動では Next が meta を書き直すため、head の変化を見て毎回そろえ直す。
  useEffect(() => {
    const color = THEME_COLORS[theme];
    const sync = () => {
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
        if (m.content !== color) m.content = color;
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["content"] });
    return () => observer.disconnect();
  }, [theme]);

  const toggle = () => {
    const next: Theme = read() === "dark" ? "light" : "dark";
    const system: Theme = matchMedia(QUERY).matches ? "dark" : "light";
    try {
      if (next === system) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch {
      // 保存できない環境でも、表示の切り替えはする
    }
    apply(next);
  };

  return { theme, toggle };
}

// 切り替えボタン（幅1280px以上のヘッダー）。明るい表示では月、暗い表示では太陽を出す（絵の出し分けは CSS で行い、描画のずれを避ける）。
export default function ThemeToggle({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="ダークモード"
      aria-pressed={theme === "dark"}
      className={`grid shrink-0 cursor-pointer place-items-center rounded-full text-ink-sub transition-colors duration-150 hover:bg-sunken/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${className}`}
      style={style}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="only-light size-1/2 min-h-4 min-w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.500 3.500a8.500 8.500 0 1 0 11 11Z" />
      </svg>
      <svg aria-hidden viewBox="0 0 24 24" className="only-dark size-1/2 min-h-4 min-w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.300v2.2M2.500 12h2.2M19.300 12h2.2M5.300 5.300l1.600 1.600M17.100 17.100l1.600 1.600M5.300 18.700l1.600-1.600M17.100 6.900l1.600-1.600" />
      </svg>
    </button>
  );
}
