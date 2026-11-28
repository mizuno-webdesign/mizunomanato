"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// ナビの現在地の背景（社長決定 2026-11-28：B「ぬるっと伸びる」）。
// 背景は1つだけで、移る先へすべる。進む側の端が先に着き、後ろの端が追いつくので、移る間だけ横に伸びる。
// ・押した時点で動かす（ページの表示は待たない）
// ・TOP と下層ページではヘッダーが作り直されるので、直前の位置を覚えておき、そこから動かす
// ・端末の「動きを減らす」設定では、すべらせずに切り替える
// 部品が準備できると、枠に data-pill="on" を付ける。それまで（表示直後）は、項目そのものの背景を出す。
const LEAD = 240; // 進む側の端（ms）
const TRAIL = 440; // 後ろの端（ms）
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Edges = { left: number; right: number };

// ヘッダーが作り直されても残る、直前の位置（枠の中の px）。表示していない方のナビは何も残さない。
// 作り直しは同時に起きるので、古いもの（ヘッダーのないページを通ったあとなど）は使わない。
// ※前のページを隠して残す設定（cacheComponents）を有効にする場合は、この仕組みを見直す。
const memory = new Map<string, Edges & { at: number }>();
const MEMORY_MS = 1000;

export function useNavPill<T extends HTMLElement>(name: string, pathname: string, activeHref: string | null) {
  const boxRef = useRef<T>(null);
  const pillRef = useRef<HTMLElement>(null);
  const applied = useRef<Edges | null>(null);

  // 押してから、ページが切り替わるまでの行き先
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setPending(null);
  }
  const shownHref = pending && pending.from === pathname ? pending.href : activeHref;
  const select = useCallback((href: string) => setPending({ href, from: pathname }), [pathname]);

  // 押したあと、ページが切り替わる前に別のリンクを押した・戻った場合は、行き先の表示を取り消す
  // （今のページへのリンクを押すと pathname が変わらず、行き先が残り続けるため）
  const waiting = pending !== null;
  useEffect(() => {
    if (!waiting) return;
    const cancel = () => setPending(null);
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest("a")) cancel(); // ナビの項目なら、このあと onNavigate が新しい行き先を入れる
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", cancel);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", cancel);
    };
  }, [waiting]);

  const shownRef = useRef(shownHref);

  const place = useCallback((animate: boolean) => {
    const box = boxRef.current;
    const pill = pillRef.current;
    if (!box || !pill || box.offsetWidth === 0) return; // 表示していない幅のナビは、表示されたときに置く
    const item = shownRef.current === null ? null : box.querySelector<HTMLElement>(`[data-nav="${shownRef.current}"]`);
    if (!item) {
      // 現在地がないページ（ナビにないページ）では、背景を出さない
      pill.style.transition = "none";
      pill.style.opacity = "0";
      applied.current = null;
      box.dataset.pill = "on";
      return;
    }
    // offsetLeft などは整数に丸まるので、小数のまま測る（PC のナビは画面幅に合わせて伸び縮みする）
    const outer = box.getBoundingClientRect();
    const inner = item.getBoundingClientRect();
    const border = getComputedStyle(box);
    const borderX = parseFloat(border.borderLeftWidth) + parseFloat(border.borderRightWidth);
    const round = (v: number) => Math.round(v * 100) / 100;
    const left = inner.left - outer.left - parseFloat(border.borderLeftWidth) + box.scrollLeft;
    const next = { left: round(left), right: round(outer.width - borderX - left - inner.width) };
    const prev = applied.current;
    pill.style.top = `${round(inner.top - outer.top - parseFloat(border.borderTopWidth) + box.scrollTop)}px`;
    pill.style.height = `${round(inner.height)}px`;
    // 位置が同じなら触らない（大きさの監視で呼ばれても、移っている途中の動きを止めない）
    if (prev && prev.left === next.left && prev.right === next.right) {
      box.dataset.pill = "on"; // 直前の位置と同じ場所に作り直されたときも、項目の背景は消す
      return;
    }
    const slide = animate && prev !== null && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 移っている途中に大きさが変わったときは、動きを止めずに行き先だけ直す
    const moving = !animate && prev !== null && pill.getAnimations().length > 0;
    if (slide) {
      const forward = next.left > parseFloat(getComputedStyle(pill).left);
      pill.style.transition = `left ${forward ? TRAIL : LEAD}ms ${EASE}, right ${forward ? LEAD : TRAIL}ms ${EASE}`;
    } else if (!moving) {
      pill.style.transition = "none";
    }
    pill.style.left = `${next.left}px`;
    pill.style.right = `${next.right}px`;
    pill.style.opacity = "1";
    applied.current = next;
    box.dataset.pill = "on";
  }, []);

  // 作られたとき：直前の位置があれば、そこに置いてから動かし始める。消えるとき：今の位置を覚える。
  useLayoutEffect(() => {
    const box = boxRef.current;
    const pill = pillRef.current;
    if (!box || !pill) return;
    const saved = memory.get(name);
    const from = saved && performance.now() - saved.at < MEMORY_MS ? { left: saved.left, right: saved.right } : null;
    if (from && box.offsetWidth > 0) {
      pill.style.transition = "none";
      pill.style.left = `${from.left}px`;
      pill.style.right = `${from.right}px`;
      pill.style.opacity = "1";
      void pill.offsetWidth; // 始まりの位置を確定させる
      applied.current = from;
    }
    return () => {
      if (box.offsetWidth > 0 && applied.current) {
        const s = getComputedStyle(pill); // 移っている途中なら、その時点の位置
        memory.set(name, { left: parseFloat(s.left), right: parseFloat(s.right), at: performance.now() });
      } else {
        memory.delete(name);
      }
      applied.current = null;
    };
  }, [name]);

  useLayoutEffect(() => {
    shownRef.current = shownHref;
    place(true);
  }, [shownHref, place]);

  // 画面の幅や書体の読み込みで項目の大きさが変わったら、動きなしで置き直す
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(box);
    box.querySelectorAll("[data-nav]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [place]);

  return { boxRef, pillRef, shownHref, select };
}
