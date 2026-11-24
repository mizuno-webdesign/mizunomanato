import Link from "next/link";

// 右下の「斜め右上矢印」の丸ボタン（vexoo の事例カード方式。社長指示 2026-11-24）。
// ArrowCircle＝見た目だけ（親がリンクのとき）／ArrowLink＝単独の内部リンク。
export function ArrowCircle({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink-sub transition-colors duration-150 group-hover:bg-canvas group-hover:text-ink motion-reduce:transition-none ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
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
      className={`group rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <ArrowCircle />
    </Link>
  );
}
