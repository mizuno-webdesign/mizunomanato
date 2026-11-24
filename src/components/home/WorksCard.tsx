import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";

// 事例カード：画像は一旦なし（社長指示 2026-11-24：画像に印象が引っ張られるため）。他カードと同じグラスのカードに、
// 見出しと「すべて見る」だけを置く。カード全体を1つの内部リンク（→ /works 一覧）にする方針（1カード＝1リンク）は維持。
// 画像を戻すときは public/images/works-cocorome.jpg が残っている（git 履歴にも前の実装あり）。
// ホバー：背景がわずかに白く濃くなる。キーボードのフォーカス枠あり。読み上げは「事例一覧へ」。
// 遷移先 /works は段階4で作成（それまでは 404）。
export default function WorksCard({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="works-title"
      className={`relative min-h-[260px] glass rounded-card shadow-card lg:min-h-0 ${className}`}
    >
      <Link
        href="/works"
        aria-label="事例一覧へ"
        className="group absolute inset-0 block rounded-card p-3 transition-colors duration-200 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-accent motion-reduce:transition-none"
      >
        <FlipHeading
          id="works-title"
          en="Works"
          ja="事例"
          className="px-3 pt-3 pb-2"
        />
        <span
          aria-hidden
          className="absolute right-6 bottom-4 type-caption text-ink-sub group-hover:text-ink group-hover:underline group-hover:underline-offset-4"
        >
          すべて見る
        </span>
      </Link>
    </section>
  );
}
