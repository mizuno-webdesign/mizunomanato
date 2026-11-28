"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// 事例の一覧と詳細の間で、画像が広がって（戻るときは縮んで）つながる（社長決定 2026-11-28）。
// ページの切り替えは待たせない：切り替わった先で、読み込み済みの画像の複製を重ねて動かすだけで、通信は増やさない。
// ※React の ViewTransition は、新しいページの書体を最大500ms待ってから表示するため使わない（遅い回線で実測）。
// ・動きの始まりになるのは、一覧では画像を含むリンク、詳細では leaveTo と同じ行き先のリンクを押したとき
// ・ブラウザの戻る、動きを減らす設定、行き先の画像が画面の外にある場合は、そのまま切り替える
const DURATION = 300;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const KEEP_MS = 8000; // 次のページがこれより遅れて出たら、動かさない

type From = { id: string; to: string; click: Event; src: string; left: number; top: number; width: number; height: number; radius: string; at: number };

let pending: From | null = null;

export default function WorkMorph({
  id,
  leaveTo,
  className,
  children,
}: {
  id: string;
  leaveTo?: string; // 指定がなければ、この画像を含むリンクを押したときが始まり
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  // 離れるとき：今の画像の位置を覚える。着く前に別のリンクを押した・戻った場合は、忘れる
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest("a") : null;
      if (!link) return;
      // 前の操作で覚えたものは捨てる（同じクリックで、ほかの画像が覚えたものは残す）
      if (pending && pending.click !== e) pending = null;
      if (leaveTo ? link.getAttribute("href") !== leaveTo : !link.contains(el)) return;
      const img = el.querySelector("img");
      const r = el.getBoundingClientRect();
      if (!img || !img.complete || !img.currentSrc || r.bottom <= 0 || r.top >= window.innerHeight) return;
      pending = { id, to: link.pathname, click: e, src: img.currentSrc, left: r.left, top: r.top, width: r.width, height: r.height, radius: getComputedStyle(el).borderRadius, at: performance.now() };
    };
    const forget = () => {
      pending = null;
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", forget);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", forget);
    };
  }, [id, leaveTo]);

  // 着いたとき：覚えた位置から、今の位置へ動かす
  useLayoutEffect(() => {
    const el = ref.current;
    const from = pending;
    if (!el || !from || from.id !== id || from.to !== window.location.pathname) return;
    if (performance.now() - from.at > KEEP_MS || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending = null;
      return;
    }
    const px = (r: { left: number; top: number; width: number; height: number }) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });

    // 切り替わると同時に、元の位置に複製を置く（新しいページの最初の描画が済むまで、そこで待つ）
    const box = document.createElement("div");
    box.setAttribute("aria-hidden", "true");
    box.dataset.workMorph = id;
    Object.assign(box.style, { position: "fixed", zIndex: "60", overflow: "hidden", pointerEvents: "none", borderRadius: from.radius, ...px(from) });
    const img = document.createElement("img");
    img.src = from.src;
    img.alt = "";
    Object.assign(img.style, { width: "100%", height: "100%", maxWidth: "none", objectFit: "cover", objectPosition: "top" });
    box.appendChild(img);
    document.body.appendChild(box);
    el.style.visibility = "hidden";

    // 下に敷いた画像は、本来の画像が届いたら外す
    const unsetBackground = () => {
      el.style.backgroundImage = "";
      el.style.backgroundSize = "";
      el.style.backgroundPosition = "";
    };
    const show = () => {
      el.style.visibility = "";
      box.remove();
      window.removeEventListener("wheel", show);
      window.removeEventListener("touchmove", show);
      window.removeEventListener("scroll", show);
      const real = el.querySelector("img");
      if (!real || real.complete) unsetBackground();
      else real.addEventListener("load", unsetBackground, { once: true });
    };
    // 最初の描画は重いことがあるので、2コマ待ってから動かす（同時に始めると、途中が飛ぶ）
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        pending = null;
        const to = el.getBoundingClientRect();
        if (to.width === 0 || to.bottom <= 0 || to.top >= window.innerHeight) return show();
        // 大きい画像が届くまでは、動かしてきた画像を下に敷いておく（灰色の枠を見せない）
        el.style.backgroundImage = `url("${from.src}")`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "top";
        try {
          const animation = box.animate(
            [
              { ...px(from), borderRadius: from.radius },
              { ...px(to), borderRadius: getComputedStyle(el).borderRadius },
            ],
            { duration: DURATION, easing: EASE, fill: "forwards" },
          );
          animation.onfinish = show;
        } catch {
          return show(); // 動かせない場合も、画像を隠したままにしない
        }
        // 動いている間にスクロールされたら（キーボードやスクロールバーでも）、位置がずれるので打ち切る
        window.addEventListener("wheel", show, { once: true, passive: true });
        window.addEventListener("touchmove", show, { once: true, passive: true });
        window.addEventListener("scroll", show, { once: true, passive: true });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      show();
    };
  }, [id]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
