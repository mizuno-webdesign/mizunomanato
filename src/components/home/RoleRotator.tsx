"use client";

import { useEffect, useState } from "react";

// 肩書き：「ECサイト」の後ろの言葉が、4秒ごとに下から上へ切り替わる（社長指示 2026-11-26）。
// 動き方はカード見出しのホバー（RollText）と同じ。
// ・マウスを乗せている間は止まる
// ・「動きを減らす」設定では切り替えず、3つを並べて表示する
// ・読み上げには、切り替わらない1つの文だけを渡す
const PREFIX = "ECサイト";
const WORDS = ["構築", "改修", "運用支援"];
const INTERVAL = 4000;
const FULL = `${PREFIX}${WORDS.join("・")}`;

export default function RoleRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const previous = (index + WORDS.length - 1) % WORDS.length;

  return (
    <span onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="whitespace-nowrap">
      <span className="sr-only">{FULL}</span>
      <span aria-hidden className="motion-reduce:hidden">
        {PREFIX}
        {/* 3つの言葉を同じ場所に重ねる。幅はいちばん長い言葉に合うので、切り替わっても周りが動かない */}
        <span className="inline-grid overflow-hidden align-bottom">
          {WORDS.map((word, i) => (
            <span
              key={word}
              data-current={i === index || undefined}
              className={`[grid-area:1/1] transition-[translate,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                i === index ? "translate-y-0 opacity-100" : i === previous ? "-translate-y-[110%] opacity-0" : "translate-y-[110%] opacity-0"
              }`}
            >
              {word}
            </span>
          ))}
        </span>
      </span>
      <span aria-hidden className="hidden whitespace-normal motion-reduce:inline">
        {FULL}
      </span>
    </span>
  );
}
