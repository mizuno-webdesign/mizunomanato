import CtaButton from "@/components/CtaButton";
import FlipHeading from "@/components/FlipHeading";

// 相談する（TOPはCTAボタンのみ・内部リンクのみ。社長確定 2026-11-24）。
// 見出しの位置は他カードと同じ（左上、カード上端から24px）に揃える（社長指示）。
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
      <CtaButton />
    </section>
  );
}
