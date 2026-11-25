import type { TocItem } from "@/lib/toc";

// 目次（社長承認 2026-11-25）。
// PC（lg 以上）：本文の右の小さいカードで、スクロールに追従する（TocAside）。
// それ未満：本文の上に折りたたんで置く（TocDisclosure）。開閉は <details> のみで、JavaScript は使わない。
function TocList({
  items,
  itemClass = "py-1.5",
  subClass = "",
}: {
  items: TocItem[];
  itemClass?: string;
  subClass?: string; // 小見出し（H3）の行にだけ付けるクラス
}) {
  return (
    <ol className="flex list-none flex-col">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? subClass : undefined}>
          <a
            href={`#${item.id}`}
            className={`block rounded-lg ${itemClass} pr-2 type-caption transition-colors duration-150 hover:bg-white/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${
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

// 項目がこれより多い目次は、画面が低いときに小見出し（H3）を省く（全部は収まらないため）。
const MANY_ITEMS = 8;

export function TocAside({ items }: { items: TocItem[] }) {
  return (
    // カードの中ではスクロールさせない（社長指示 2026-11-25）。そのぶん行の余白を詰め、
    // それでも収まらない低い画面では、項目の多い記事だけ大見出し（H2）のみにする。
    <nav aria-label="目次" className="glass rounded-card p-4 shadow-card">
      <p className="px-2 pt-1 pb-2 type-heading text-heading">目次</p>
      <TocList
        items={items}
        itemClass="py-1"
        subClass={items.length > MANY_ITEMS ? "[@media(max-height:879px)]:hidden" : ""}
      />
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
          <TocList items={items} itemClass="py-2.5" />
        </div>
      </details>
    </nav>
  );
}
