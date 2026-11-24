"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Latin from "@/components/Latin";

export type WorkItem = {
  _id: string;
  title: string;
  slug?: string;
  year?: string;
  note?: string;
  thumbUrl?: string;
};

// 実績：3件すべて載せ、1枚のカード内で切り替える（社長決定 2026-11-24）。
// 左右分割：左に大きな画像、右に見出し・案件名・切替タブ（PCのみ。タブレット以下は縦積み）。
// 自動では切り替えない。タブはキーボード（←→ Home End）でも操作できる。見出しは英語。
export default function WorksCard({
  works,
  className = "",
}: {
  works: WorkItem[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  if (works.length === 0) {
    return (
      <section
        aria-labelledby="works-title"
        className={`rounded-card bg-surface p-6 ${className}`}
      >
        <h2 id="works-title" className="text-lg font-bold">
          Works
        </h2>
        <p className="mt-2 text-sm text-ink-sub">実績は準備中です。</p>
      </section>
    );
  }

  const work = works[Math.min(index, works.length - 1)];

  const move = (to: number) => {
    const next = (to + works.length) % works.length;
    setIndex(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") move(index + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(index - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(works.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <section
      aria-labelledby="works-title"
      className={`grid gap-4 rounded-card bg-surface p-4 lg:grid-cols-[1.25fr_1fr] ${className}`}
    >
      <div
        role="tabpanel"
        id={`work-panel-${work._id}`}
        aria-labelledby={`work-tab-${work._id}`}
        className="relative h-[200px] overflow-hidden rounded-inner bg-sunken lg:h-auto lg:min-h-[240px]"
      >
        {work.thumbUrl ? (
          <Image
            src={work.thumbUrl}
            alt={work.title}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-4 p-2 lg:py-2">
        <h2 id="works-title" className="text-lg font-bold">
          Works
        </h2>
        <div>
          <Link
            href={work.slug ? `/works/${work.slug}` : "/works"}
            className="text-base font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Latin>{work.title}</Latin>
          </Link>
          <p className="text-[13px] text-ink-sub">
            {work.note ? <Latin>{work.note}</Latin> : null}
            {work.note && work.year ? "　" : null}
            {work.year ? <Latin>{work.year}</Latin> : null}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Works"
          onKeyDown={onKeyDown}
          className="mt-auto flex max-w-full flex-wrap gap-0.5 self-start rounded-[10px] bg-sunken p-[3px] text-[13px]"
        >
          {works.map((w, i) => {
            const selected = i === index;
            return (
              <button
                key={w._id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`work-tab-${w._id}`}
                aria-selected={selected}
                aria-controls={`work-panel-${w._id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                className={`rounded-lg px-3 py-1 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent motion-reduce:transition-none ${
                  selected
                    ? "bg-white font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.14)]"
                    : "text-ink-sub hover:text-ink"
                }`}
              >
                <Latin>{w.title}</Latin>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
