import Image from "next/image";
import FlipHeading from "@/components/FlipHeading";

export type WorksImage = { url: string; alt: string };

// 実績カード：社長指示（2026-11-24）で、これまでの内容（カルーセル・案件名・メタ・シェブロン）を全て外し、
// プロフィール写真と同じ「写真1枚をカード全面に見せる」形にした。グリッドの大きさは変えない。
// 写真は仮：実績のサムネイル（先頭の1件）。見出し「Works」は他カードと同じ位置（左上24px）。
// 見出しの背景は無し（社長指示）。写真の上でも読めるよう、白文字の差分ブレンド（mix-blend-difference）で明暗を自動反転し、位置は他カードと一致させている。写真の差し替え後に読めるか要再確認。
// リンクは付けない（リンクの見せ方は社長が検討中）。
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
      className={`relative min-h-[260px] overflow-hidden rounded-card bg-sunken shadow-card ${className}`}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <p className="absolute inset-0 grid place-items-center text-sm text-ink-sub">
          実績は準備中です。
        </p>
      )}
      <div className="absolute top-3 left-3 z-10 text-white mix-blend-difference">
        <FlipHeading
          id="works-title"
          en="Works"
          ja="事例"
          className="px-3 pt-3 pb-2"
        />
      </div>
    </section>
  );
}
