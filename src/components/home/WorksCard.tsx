"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Latin from "@/components/Latin";
import FlipHeading from "@/components/FlipHeading";
import { ArrowLink } from "@/components/ArrowCircle";

export type WorkItem = {
  _id: string;
  title: string;
  slug?: string;
  year?: string;
  note?: string;
  thumbUrl?: string;
};

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === "prev" ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"} />
    </svg>
  );
}

const chevronClass =
  "absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/85 text-ink shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur transition-[background-color,transform] duration-150 hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:active:scale-100";

// 実績：3件すべて載せ、1枚のカード内でカルーセルにする（社長指示 2026-11-24）。
// カード内側の両端にシェブロン。自動では切り替えない。端から端へは循環する。
// 見出しは他カードと同じ左上。画像の左端を見出しの文字に揃え（カード端から24px）、
// 見出しと画像の間隔を広げて窮屈さを減らした。案件名は一段小さくして、見出しと同じ階層に見えないようにする。
export default function WorksCard({
  works,
  className = "",
}: {
  works: WorkItem[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  const heading = (
    <FlipHeading
      id="works-title"
      en="Works"
      ja="実績"
      className="px-3 pt-3 pb-3"
    />
  );

  if (works.length === 0) {
    return (
      <section
        aria-labelledby="works-title"
        className={`rounded-card bg-surface p-3 shadow-card ${className}`}
      >
        {heading}
        <p className="px-3 text-sm text-ink-sub">実績は準備中です。</p>
      </section>
    );
  }

  const count = works.length;
  const work = works[Math.min(index, count - 1)];
  const go = (to: number) => setIndex((to + count) % count);

  return (
    <section
      aria-labelledby="works-title"
      aria-roledescription="carousel"
      className={`flex flex-col rounded-card bg-surface p-3 shadow-card ${className}`}
    >
      {heading}

      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} / ${count}`}
        className="relative grid flex-1 gap-4 px-3 pb-3 lg:grid-cols-[1.25fr_1fr]"
      >
        <div className="relative h-[200px] overflow-hidden rounded-inner bg-sunken lg:h-auto lg:min-h-[190px]">
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

        <div className="flex flex-col gap-1 pt-1 lg:pr-12 lg:pl-1">
          <Link
            href={work.slug ? `/works/${work.slug}` : "/works"}
            className="text-[15px] font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Latin>{work.title}</Latin>
          </Link>
          <p className="text-[13px] text-ink-sub">
            {work.note ? <Latin>{work.note}</Latin> : null}
            {work.note && work.year ? "　" : null}
            {work.year ? <Latin>{work.year}</Latin> : null}
          </p>
          <div className="mt-auto flex justify-end pt-3">
            <ArrowLink
              href={work.slug ? `/works/${work.slug}` : "/works"}
              label={`${work.title}の詳細へ`}
            />
          </div>
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="前の実績"
              onClick={() => go(index - 1)}
              className={`${chevronClass} left-5`}
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              aria-label="次の実績"
              onClick={() => go(index + 1)}
              className={`${chevronClass} right-5`}
            >
              <Chevron dir="next" />
            </button>
          </>
        ) : null}
      </div>

      {/* 読み上げ用：切り替わったことを知らせる */}
      <p aria-live="polite" className="sr-only">
        {`${index + 1} / ${count}：${work.title}`}
      </p>
    </section>
  );
}
