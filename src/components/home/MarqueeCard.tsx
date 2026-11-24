// 対応領域のマーキー（横に流す。社長決定 2026-11-24）。文字のみ（ロゴは利用条件が未確認のため使わない）。
// 中身は旧サイト About の一覧が出所。今も対応と言ってよいかは社長確認待ち。
const ITEMS = [
  "Shopify",
  "COLOR ME",
  "Futureshop",
  "Amazon",
  "楽天市場",
  "Yahoo!ショッピング",
  "Google",
  "Meta",
  "Yahoo",
  "Microsoft",
  "Criteo",
  "GA4",
  "Search Console",
  "Clarity",
];

export default function MarqueeCard({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="marquee-title"
      className={`flex flex-col justify-center gap-3 overflow-hidden rounded-card bg-surface py-5 ${className}`}
    >
      <h2 id="marquee-title" className="px-6 text-[13px] text-ink-sub">
        対応領域
      </h2>
      {/* 読み上げ用：流れる帯は装飾として隠し、同じ内容を静的な一覧で持つ */}
      <ul className="sr-only">
        {ITEMS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div
        aria-hidden
        className="marquee overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="marquee-track flex w-max gap-7 pl-7 text-[15px] text-ink-sub">
          {[0, 1].map((copy) =>
            ITEMS.map((t, i) => (
              <span
                key={`${copy}-${t}`}
                className={copy === 0 && i === 0 ? "font-bold text-ink" : undefined}
              >
                {t}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
