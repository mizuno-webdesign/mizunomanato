"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/toc";

// 目次（社長承認 2026-11-25）。
// PC（lg 以上）：本文の右の小さいカードで、スクロールに追従する（TocAside）。
//   いま読んでいる見出しに印を1つ付け、読み進めると次の見出しへすべらせる（社長決定 2026-11-28）。
// それ未満：本文の上に折りたたんで置く（TocDisclosure）。開閉は <details>。
//   開くときと閉じるときは、高さと濃さをなめらかに変える（社長決定 2026-11-28）。JavaScript がなくても開閉できる。
function TocList({
  items,
  itemClass = "py-1.5",
  subClass = "",
  children,
}: {
  items: TocItem[];
  itemClass?: string;
  subClass?: string; // 小見出し（H3）の行にだけ付けるクラス
  children?: React.ReactNode;
}) {
  return (
    <ol className="relative flex list-none flex-col">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? subClass : undefined}>
          <a
            href={`#${item.id}`}
            data-toc={item.id}
            className={`relative z-[1] block rounded-lg ${itemClass} pr-2 type-caption transition-colors duration-150 hover:bg-hover hover:text-ink data-marked:bg-transparent data-marked:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${
              item.level === 3 ? "pl-6 text-ink-sub" : "pl-2 text-ink"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
      {children}
    </ol>
  );
}

// 項目がこれより多い目次は、画面が低いときに小見出し（H3）を省く（全部は収まらないため）。
const MANY_ITEMS = 8;

const WIDE = "(min-width: 1024px)"; // 目次のカードを出す幅（lg）
const READING_LINE = 120; // 見出しがこの高さより上に来たら、その章を読んでいるとみなす（見出しの scroll-mt は 96px）

// いま読んでいる見出し。目次のカードを出さない幅では、何も監視しない。
function useCurrentHeading(items: TocItem[]) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  // 目次を押したあとは、行き先に着くまで途中の見出しを追わない
  const locked = useRef(false);
  const unlockTimer = useRef(0);
  const chosen = useRef<string | null>(null); // 目次で押した見出し（次に自分でスクロールするまで覚える）

  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!wide.matches || locked.current) return;
      let next: string | null = null;
      for (const el of headings) {
        if (el.getBoundingClientRect().top > READING_LINE) break;
        next = el.id;
      }
      // ページの一番下では、最後の見出しが上まで来なくても、最後を現在地にする
      const root = document.documentElement;
      if (headings.length > 0 && window.scrollY + root.clientHeight >= root.scrollHeight - 2) {
        // 目次で押した見出しが画面内にあれば、それを残す（最後の方の見出しは、上まで来ないため）
        const picked = headings.find((el) => el.id === chosen.current);
        next = picked && picked.getBoundingClientRect().top >= 0 ? picked.id : headings[headings.length - 1].id;
      }
      setCurrentId(next);
    };
    const release = () => {
      locked.current = false;
      read();
    };
    const onScroll = () => {
      if (locked.current) {
        // スクロールが止まってから、追いかけるのを再開する
        window.clearTimeout(unlockTimer.current);
        unlockTimer.current = window.setTimeout(release, 200);
        return;
      }
      chosen.current = null;
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(unlockTimer.current);
      cancelAnimationFrame(frame);
      locked.current = false;
    };
  }, [items]);

  const select = (id: string) => {
    setCurrentId(id);
    chosen.current = id;
    locked.current = true;
    window.clearTimeout(unlockTimer.current);
    // 行き先が今の位置でスクロールが起きない場合にも、再開する
    unlockTimer.current = window.setTimeout(() => {
      locked.current = false;
    }, 600);
  };

  return { currentId, select };
}

export function TocAside({ items }: { items: TocItem[] }) {
  const { currentId, select } = useCurrentHeading(items);
  const navRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const mark = markRef.current;
    if (!nav || !mark) return;
    const place = () => {
      nav.querySelectorAll("[data-marked]").forEach((el) => {
        el.removeAttribute("data-marked");
        el.removeAttribute("aria-current");
      });
      // 画面が低くて小見出しを省いているときは、その手前の見えている見出しに付ける
      let index = items.findIndex((i) => i.id === currentId);
      let link: HTMLElement | null = null;
      for (; index >= 0; index--) {
        const el = nav.querySelector<HTMLElement>(`[data-toc="${CSS.escape(items[index].id)}"]`);
        if (el && el.offsetHeight > 0) {
          link = el;
          break;
        }
      }
      if (!link) {
        mark.style.opacity = "0";
        delete mark.dataset.placed;
        return;
      }
      link.setAttribute("data-marked", ""); // 印の付いた行の文字を緑にする
      link.setAttribute("aria-current", "location");
      const row = link.parentElement as HTMLElement;
      // 最初に出すときは、すべらせずにその場に置く
      mark.style.transitionProperty = mark.dataset.placed ? "" : "none";
      mark.style.transform = `translateY(${row.offsetTop}px)`;
      mark.style.height = `${row.offsetHeight}px`;
      mark.style.opacity = "1";
      mark.dataset.placed = "1";
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [currentId, items]);

  return (
    // カードの中ではスクロールさせない（社長指示 2026-11-25）。そのぶん行の余白を詰め、
    // それでも収まらない低い画面では、項目の多い記事だけ大見出し（H2）のみにする。
    <nav
      ref={navRef}
      aria-label="目次"
      className="glass rounded-card p-4 shadow-card"
      onClick={(e) => {
        // 新しいタブで開く操作では、このページはスクロールしない
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const id = (e.target as Element).closest<HTMLElement>("[data-toc]")?.dataset.toc;
        if (id) select(id);
      }}
    >
      <p className="px-2 pt-1 pb-2 type-heading text-heading">目次</p>
      <TocList
        items={items}
        itemClass="py-1"
        subClass={items.length > MANY_ITEMS ? "[@media(max-height:959px)]:hidden" : ""}
      >
        <li
          ref={markRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-[var(--top-nav-active)] opacity-0 transition-[transform,height] duration-[250ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
        />
      </TocList>
    </nav>
  );
}

const TOGGLE_MS = 200;

export function TocDisclosure({ items }: { items: TocItem[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const running = useRef<Animation | null>(null);
  const closing = useRef(false);

  const onToggleClick = (e: React.MouseEvent) => {
    const details = detailsRef.current;
    const body = bodyRef.current;
    // 動きを減らす設定などでは、ブラウザの標準の開閉にまかせる
    if (!details || !body || !body.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    const opening = !details.open || closing.current;
    // 動いている途中で押したときは、今の高さから続ける
    const from = details.open ? body.getBoundingClientRect().height : 0;
    const fromOpacity = details.open ? Number(getComputedStyle(body).opacity) : 0;
    running.current?.cancel();
    details.open = true;
    closing.current = !opening;
    details.dataset.closing = String(!opening);
    const to = opening ? body.scrollHeight : 0;
    body.style.overflow = "hidden";
    const animation = body.animate(
      [
        { height: `${from}px`, opacity: fromOpacity },
        { height: `${to}px`, opacity: opening ? 1 : 0 },
      ],
      { duration: TOGGLE_MS, easing: "ease-out", fill: "forwards" },
    );
    running.current = animation;
    animation.onfinish = () => {
      if (!opening) details.open = false;
      closing.current = false;
      details.dataset.closing = "false";
      body.style.overflow = "";
      animation.cancel();
      running.current = null;
    };
  };

  return (
    <nav aria-label="目次" className="mt-6 lg:hidden">
      <details ref={detailsRef} className="group rounded-inner bg-hover">
        <summary
          onClick={onToggleClick}
          className="flex cursor-pointer list-none items-center justify-between rounded-inner px-4 py-3 type-heading text-heading focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent [&::-webkit-details-marker]:hidden"
        >
          目次
          <span
            aria-hidden
            className="mr-1 size-2 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-ink-sub transition-[rotate,translate] duration-200 ease-out group-open:translate-y-0.5 group-open:rotate-[225deg] group-data-[closing=true]:-translate-y-0.5 group-data-[closing=true]:rotate-45 motion-reduce:transition-none"
          />
        </summary>
        <div ref={bodyRef}>
          <div className="px-2 pb-3">
            <TocList items={items} itemClass="py-2.5" />
          </div>
        </div>
      </details>
    </nav>
  );
}
