import type { TocItem } from "@/lib/toc";

// 目次（社長承認 2026-11-25）。
// PC（lg 以上）：本文の右の小さいカードで、スクロールに追従する（TocAside）。
// それ未満：本文の上に折りたたんで置く（TocDisclosure）。開閉は <details> のみで、JavaScript は使わない。
function TocList({ items }: { items: TocItem[] }) {
  return (
    <ol className="flex list-none flex-col">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block rounded-lg py-1.5 pr-2 type-caption transition-colors duration-150 hover:bg-white/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${
              item.level === 3 ? "pl-6 text-ink-sub" : "pl-2 text-ink"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TocAside({ items }: { items: TocItem[] }) {
  return (
    // 上の余白 79px は、見出し「目次」を記事タイトル（1行目）と同じ高さにするための値（社長指示 2026-11-25）。
    // 本文カードの上の余白48px＋日付19.5px＋間隔8px＋タイトル行31.2pxの半分 − 「目次」の行23.8pxの半分。
    // 本文カードの上側の余白や日付・タイトルの大きさを変えたら、この値も直す。
    // 高さが足りないときは、見出しは残したまま、項目の一覧だけがスクロールする。
    <nav
      aria-label="目次"
      className="flex min-h-0 flex-col glass rounded-card px-4 pt-[79px] pb-4 shadow-card"
    >
      <p className="px-2 pb-2 type-heading text-heading">目次</p>
      <div className="min-h-0 overflow-y-auto">
        <TocList items={items} />
      </div>
    </nav>
  );
}

export function TocDisclosure({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="目次" className="mt-6 lg:hidden">
      <details className="group rounded-inner bg-white/60">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-inner px-4 py-3 type-heading text-heading focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
          目次
          <span
            aria-hidden
            className="mr-1 size-2 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-ink-sub group-open:translate-y-0.5 group-open:rotate-[225deg]"
          />
        </summary>
        <div className="px-2 pb-3">
          <TocList items={items} />
        </div>
      </details>
    </nav>
  );
}
