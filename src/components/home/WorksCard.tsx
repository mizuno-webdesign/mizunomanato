import Image from "next/image";
import FlipHeading from "@/components/FlipHeading";

export type WorksImage = { url: string; alt: string };

// 実績カード：社長指示（2026-11-24）で、これまでの内容（カルーセル・案件名・メタ・シェブロン）を全て外し、
// プロフィール写真と同じ「写真1枚をカード全面に見せる」形にした。グリッドの大きさは変えない。
// 写真は仮：実績のサムネイル（先頭の1件）。見出し「Works」は他カードと同じ位置（左上24px）。
// 見出しは白（社長指示 2026-11-24）。背景は無し。写真（社長提供の COCOROMe）は左上が暗いので読める。淡い影で補助。位置は他カードと一致させている。写真を差し替えたら読めるか再確認。
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
      className={`relative min-h-[260px] overflow-hidden lg:min-h-0 rounded-card bg-sunken shadow-card ${className}`}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw" priority
          className="object-cover"
        />
      ) : (
        <p className="absolute inset-0 grid place-items-center text-sm text-ink-sub">
          実績は準備中です。
        </p>
      )}
      <div className="absolute top-3 left-3 z-10 text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
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
