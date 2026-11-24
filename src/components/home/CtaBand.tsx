import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";

// 相談する（TOPはCTAボタンのみ・内部リンクのみ。社長確定 2026-11-24）。
// 見出しの位置は他カードと同じ（左上、カード上端から24px）に揃える（社長指示）。
// ボタン：深い緑（#095C35）の丸いボタン。ホバーで80%に透過し、わずかに大きくなる／押すと少し縮む（社長指示 2026-11-24）。
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
        className="rounded-full bg-[linear-gradient(135deg,#0a6b45,#387f20)] px-9 py-3.5 text-[17px] leading-[1.4] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_3px_rgba(10,107,69,0.25)] transition-[opacity,transform] duration-150 ease-out hover:opacity-80 active:scale-[0.97] active:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        相談してみる
      </Link>
    </section>
  );
}
