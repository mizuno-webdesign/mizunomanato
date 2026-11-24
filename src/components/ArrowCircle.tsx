import Link from "next/link";

// 右下の「斜め右上矢印」（vexoo の事例カード方式）。社長指示 2026-11-24：周りの丸は付けない（矢印のみ）。
// ArrowCircle＝見た目だけ（親が `group` のリンクのとき）／ArrowLink＝単独の内部リンク。
// 名前は旧称のまま（丸はもう無い）。呼び出し側の変更を避けるため据え置き。
export function ArrowCircle({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-9 shrink-0 place-items-center text-ink-sub transition-[color,transform] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none motion-reduce:group-hover:transform-none ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7M8.5 7H17v8.5" />
      </svg>
    </span>
  );
}

export function ArrowLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <ArrowCircle />
    </Link>
  );
}
