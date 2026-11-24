"use client";

import { useEffect, useRef } from "react";

// マーキーの表示枠。ホバー中は「止める」のではなく、さらにゆっくり流す（社長指示 2026-11-24）。
// CSS の animation は、途中で duration を変えると位置が跳ぶため、Web Animations API の playbackRate を
// requestAnimationFrame でなめらかに（指数補間で）動かす。動きを減らす設定では CSS 側で animation が無いので何もしない。
const NORMAL = 1;
const HOVER = 0.25; // ホバー中は通常の1/4の速さ（約15px/秒 → 約3.8px/秒）
const EASE = 0.08;

export default function MarqueeViewport({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = NORMAL;
    let rate = NORMAL;
    let raf = 0;

    const tick = () => {
      const anim = el.querySelector<HTMLElement>(".marquee-track")?.getAnimations()[0];
      rate += (target - rate) * EASE;
      if (Math.abs(target - rate) < 0.002) rate = target;
      if (anim) anim.playbackRate = rate;
      if (rate !== target) raf = requestAnimationFrame(tick);
    };
    const go = (to: number) => {
      target = to;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const enter = () => go(HOVER);
    const leave = () => go(NORMAL);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className={className}>
      {children}
    </div>
  );
}
