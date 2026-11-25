import Link from "next/link";

// 相談ボタン：深い緑（#095C35）の丸いボタン。ホバーで80%に透過（大きさは変えない）／押すと少し縮む（社長指示）。
// TOP の相談の帯と、記事の目次の下で共通に使う。遷移先 /contact は段階4で作成（それまでは 404）。
export default function CtaButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/contact"
      className={`rounded-full bg-cta px-9 py-3.5 text-[17px] leading-[1.4] font-semibold text-white shadow-[0_1px_3px_rgba(9,92,53,0.25)] transition-[opacity,scale] duration-150 ease-out hover:opacity-80 active:scale-[0.97] active:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      相談してみる
    </Link>
  );
}
