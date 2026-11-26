"use client";

import { useEffect, useState } from "react";

// 【試用の道具。写真が決まったら、このファイルと layout.tsx の呼び出し、public/_trial/ を消す】
// 開発サーバーでだけ、サイト内の顔写真（portrait.webp）を候補の4枚に差し替えて見比べる。
// 候補の画像は public/_trial/（git の対象外）に置いている。写真を使う部品のコードは変えない。
const KEY = "photo-trial";
const OPTIONS = [
  { value: 0, label: "今" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
];
// この幅（px）より大きい枠は写真全体を、小さい枠は顔と肩を切り抜いた版を使う
const FULL_FROM = 150;

type Original = { src: string; srcset: string | null; sizes: string | null; scale: string };
const originals = new WeakMap<HTMLImageElement, Original>();

function swap(choice: number) {
  document.querySelectorAll("img").forEach((img) => {
    let original = originals.get(img);
    if (!original) {
      const src = img.getAttribute("src") ?? "";
      if (!src.includes("portrait.webp")) return;
      original = { src, srcset: img.getAttribute("srcset"), sizes: img.getAttribute("sizes"), scale: img.style.scale };
      originals.set(img, original);
    }
    if (choice === 0) {
      if (img.getAttribute("src") === original.src) return;
      if (original.srcset) img.setAttribute("srcset", original.srcset);
      if (original.sizes) img.setAttribute("sizes", original.sizes);
      img.style.scale = original.scale;
      img.setAttribute("src", original.src);
      return;
    }
    // 拡大の指定（比較版の寄せ）に左右されないよう、枠そのものの幅で判定する
    const width = img.offsetWidth;
    const next = `/_trial/photo${choice}${width >= FULL_FROM ? "" : "-face"}.webp`;
    if (img.getAttribute("src") === next) return;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.style.scale = "1"; // 今の写真に合わせた寄せ（比較版）は外す
    img.setAttribute("src", next);
  });
}

export default function PhotoTrial() {
  const [choice, setChoice] = useState<number | null>(null);

  // 前に選んだ番号を読み込む（描画のあとで読むので、サーバーの出力とずれない）
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      let saved = 0;
      try {
        saved = Number(localStorage.getItem(KEY)) || 0;
      } catch {}
      setChoice(saved);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (choice === null) return;
    swap(choice);
    // ページを移動して写真が増えたときや、画面の幅が変わったときも当てはめ直す
    const run = () => swap(choice);
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", run);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [choice]);

  const pick = (value: number) => {
    setChoice(value);
    try {
      localStorage.setItem(KEY, String(value));
    } catch {}
  };

  return (
    <div
      role="group"
      aria-label="写真の試し（開発中のみ）"
      className="fixed right-3 bottom-3 z-[100] flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-1 text-[12px] text-ink shadow-card"
    >
      <span className="px-1 text-ink-sub">写真の試し</span>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => pick(o.value)}
          aria-pressed={choice === o.value}
          className="min-w-8 cursor-pointer rounded-full px-2 py-1 aria-pressed:bg-cta aria-pressed:font-semibold aria-pressed:text-white"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
