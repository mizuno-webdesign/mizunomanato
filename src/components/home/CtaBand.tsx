import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";

// 相談する（TOPはCTAボタンのみ・内部リンクのみ。社長確定 2026-11-24）。
// 見出しの位置は他カードと同じ（左上、カード上端から24px）に揃える（社長指示）。
// 遷移先 /contact は段階4で作成（それまでは 404）。
export default function CtaBand({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="contact-title"
      className={`flex flex-wrap items-start justify-between gap-4 glass rounded-card p-3 shadow-card ${className}`}
    >
      <FlipHeading
        id="contact-title"
        en="Contact"
        ja="お問い合わせ"
        className="px-3 pt-3 pb-2"
      />
      <Link
        href="/contact"
        className="rounded-2xl bg-accent px-7 py-3 text-[15px] font-bold text-white transition-[filter,transform] duration-150 hover:brightness-90 active:scale-[0.97] active:brightness-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        相談する
      </Link>
    </section>
  );
}
