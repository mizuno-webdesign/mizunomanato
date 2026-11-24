import Image from "next/image";
import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";

export type WorksImage = { url: string; alt: string };

// 事例カード：写真1枚をカード全面に見せ、カード全体を1つの内部リンク（→ /works 一覧）にする（社長承認 2026-11-24）。
// 方針：「1カード＝1リンク」。個別事例の詳細へは、一覧ページの中から進む。
// Blogs と同じ位置・同じ語（右下の「すべて見る」）で行き先の見せ方を揃える。画像の上なので白文字。
// ホバー：画像がわずかに拡大し、暗さが少し引く。キーボードのフォーカス枠あり。読み上げは「事例一覧へ」。
// 見出し「Works」は他カードと同じ位置（左上24px）で白文字（淡い影つき）。写真を差し替えたら読めるか再確認。
// 遷移先 /works は段階4で作成（それまでは 404）。
export default function WorksCard({
  image,
  className = "",
}: {
  image?: WorksImage;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="works-title"
      className={`relative min-h-[260px] overflow-hidden rounded-card bg-sunken shadow-card lg:min-h-0 ${className}`}
    >
      <Link
        href="/works"
        aria-label="事例一覧へ"
        className="group absolute inset-0 block focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-sm text-ink-sub">
            実績は準備中です。
          </span>
        )}
        {/* 白文字を読みやすくする薄い暗幕。ホバーで引く */}
        <span
          aria-hidden
          className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/0 motion-reduce:transition-none"
        />
        <span className="absolute top-3 left-3 z-10 text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
          <FlipHeading
            id="works-title"
            en="Works"
            ja="事例"
            className="px-3 pt-3 pb-2"
          />
        </span>
        <span
          aria-hidden
          className="absolute right-6 bottom-4 z-10 text-[13px] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] group-hover:underline group-hover:underline-offset-4"
        >
          すべて見る
        </span>
      </Link>
    </section>
  );
}
