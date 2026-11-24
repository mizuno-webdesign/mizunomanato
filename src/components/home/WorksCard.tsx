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

// 実績：3件すべて載せるが、常時並べず1枚のカード内で切り替える（社長決定 2026-11-24）。
// 自動では切り替えない。タブはキーボード（←→ Home End）でも操作できる。
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
          実績
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
    if (e.key === "ArrowRight") move(index + 1);
    else if (e.key === "ArrowLeft") move(index - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(works.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <section
      aria-labelledby="works-title"
      className={`flex flex-col gap-3 rounded-card bg-surface p-6 ${className}`}
    >
      <h2 id="works-title" className="sr-only">
        実績
      </h2>

      <div
        role="tabpanel"
        id={`work-panel-${work._id}`}
        aria-labelledby={`work-tab-${work._id}`}
        className="flex flex-1 flex-col gap-3"
      >
        <div className="relative h-[150px] shrink-0 overflow-hidden rounded-inner bg-sunken lg:h-[170px]">
          {work.thumbUrl ? (
            <Image
              src={work.thumbUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div>
          <Link
            href={work.slug ? `/works/${work.slug}` : "/works"}
            className="font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Latin>{work.title}</Latin>
          </Link>
          <p className="text-[13px] text-ink-sub">
            {work.note ? <Latin>{work.note}</Latin> : null}
            {work.note && work.year ? "　" : null}
            {work.year ? <Latin>{work.year}</Latin> : null}
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="実績の切り替え"
        onKeyDown={onKeyDown}
        className="flex max-w-full flex-wrap gap-0.5 self-start rounded-[10px] bg-sunken p-[3px] text-[13px]"
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
    </section>
  );
}
