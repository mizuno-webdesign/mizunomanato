import type { ReactNode } from "react";

// 見出し：英語が基本、ホバーでくるっと回って日本語に変わる（社長指示 2026-11-24）。
// 英語・日本語を同じセルに重ね、広い方の幅に合わせる（日本語が長くても、ホバー領域が欠けない）。
// 読み上げには英語だけを渡し（装飾の二重読みを避ける）、動きを減らす設定では回転せず即時に切り替わる。
// タッチ端末では、タップ時の :hover で切り替わる。
export default function FlipHeading({
  id,
  en,
  ja,
  as: Tag = "h2",
  size = "type-heading",
  tone = "text-heading",
  className = "",
}: {
  id?: string;
  en: ReactNode;
  ja: string;
  as?: "h1" | "h2";
  size?: string; // タイプスケールのクラス（既定 type-heading。氏名は type-display）
  tone?: string; // 文字色のクラス（既定 text-heading。写真の上は text-white）
  className?: string;
}) {
  return (
    <Tag id={id} className={`${size} ${tone} ${className}`}>
      <span className="sr-only">{en}</span>
      <span
        aria-hidden
        className="group/flip inline-block cursor-default [perspective:700px]"
      >
        <span className="grid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover/flip:[transform:rotateX(180deg)] motion-reduce:transition-none">
          <span className="[grid-area:1/1] [backface-visibility:hidden]">{en}</span>
          <span className="[grid-area:1/1] whitespace-nowrap [backface-visibility:hidden] [transform:rotateX(180deg)]">
            {ja}
          </span>
        </span>
      </span>
    </Tag>
  );
}
