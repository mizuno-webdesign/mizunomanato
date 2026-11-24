"use client";

import { useState } from "react";
import Link from "next/link";
import Latin from "@/components/Latin";

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};

// 最新記事3本の文字一覧（案ii：リスト＋プレビュー。社長決定 2026-11-24）。
// 行にカーソル／キーボードフォーカスを当てると、同じカード内に冒頭の一文（excerpt）を出す。
// タッチ端末ではタップで記事へ遷移する（プレビューは先頭の記事の一文を出したまま）。
// 画像・タグは使わない（現状すべて空）。
export default function ArticlesCard({
  articles,
  className = "",
}: {
  articles: ArticleItem[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const current = articles[active];

  return (
    <section
      aria-labelledby="articles-title"
      className={`flex flex-col rounded-card bg-surface p-4 pb-5 ${className}`}
    >
      <h2 id="articles-title" className="px-2 pt-2 pb-1 text-lg font-bold">
        最新記事
      </h2>

      {articles.length === 0 ? (
        <p className="px-2 text-sm text-ink-sub">記事は準備中です。</p>
      ) : (
        <>
          <ul className="mt-1">
            {articles.map((a, i) => (
              <li key={a._id} className="border-t border-line first:border-t-0">
                <Link
                  href={`/articles/${a.slug}`}
                  aria-describedby={`excerpt-${a._id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`grid grid-cols-[84px_1fr] gap-3 rounded-xl px-2 py-2.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${
                    i === active ? "bg-sunken/60" : "hover:bg-sunken/60"
                  }`}
                >
                  <time className="text-[13px] leading-[2] text-ink-sub">
                    <Latin>{a.date}</Latin>
                  </time>
                  <span className="leading-[1.7]">
                    <Latin>{a.title}</Latin>
                  </span>
                </Link>
                {/* 読み上げ用：冒頭の一文を各リンクの説明として持たせる */}
                <span id={`excerpt-${a._id}`} className="sr-only">
                  {a.excerpt}
                </span>
              </li>
            ))}
          </ul>

          <p
            aria-hidden
            className="mx-2 mt-3 rounded-xl bg-sunken px-3 py-2.5 text-[13px] leading-[1.8] text-ink-sub"
          >
            <span className="line-clamp-2 min-h-[2lh]">{current?.excerpt ?? ""}</span>
          </p>

          <Link
            href="/articles"
            className="mx-2 mt-3 self-start text-sm text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            記事一覧へ
          </Link>
        </>
      )}
    </section>
  );
}
