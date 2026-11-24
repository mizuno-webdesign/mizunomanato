import Link from "next/link";

// 相談する（TOPはCTAボタンのみ・内部リンクのみ。社長確定 2026-11-24）。
// 遷移先 /contact は段階4で作成（それまでは 404）。
export default function CtaBand({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="ご相談"
      className={`flex flex-wrap items-center justify-between gap-4 rounded-card bg-surface px-6 py-4 ${className}`}
    >
      <p className="text-base font-bold">ご相談はこちらから</p>
      <Link
        href="/contact"
        className="rounded-2xl bg-accent px-7 py-3 text-[15px] font-bold text-white transition-[filter,transform] duration-150 hover:brightness-90 active:scale-[0.97] active:brightness-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        相談する
      </Link>
    </section>
  );
}
