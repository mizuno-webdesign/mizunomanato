import type { ReactNode } from "react";

// 見出し：英語が基本、ホバーで英語が上へ抜け、日本語が下から上がってくる「ロール」（社長決定 2026-11-24。旧：縦フリップ）。
// 英語・日本語を同じセルに重ね、広い方の幅に合わせる（日本語が長くても、ホバー領域が欠けない）。
// 読み上げには英語だけを渡し（装飾の二重読みを避ける）、動きを減らす設定では動かさず即時に切り替わる。
// タッチ端末では、タップ時の :hover で切り替わる。
export default function FlipHeading({
  id,
  en,
  ja,
  as: Tag = "h2",
  size = "type-heading",
  tone = "text-heading",
  upper = true,
  className = "",
}: {
  id?: string;
  en: ReactNode;
  ja: string;
  as?: "h1" | "h2";
  size?: string; // タイプスケールのクラス（既定 type-heading。氏名は type-display）
  tone?: string; // 文字色のクラス（既定 text-heading。写真の上は text-white）
  upper?: boolean; // 英語を全て大文字にする（既定 true。社長指示 2026-11-24。氏名は false）
  className?: string;
}) {
  return (
    <Tag id={id} className={`${size} ${tone} ${className}`}>
      <span className="sr-only">{en}</span>
      {/* 外側：ホバーを受ける領域（見出しの周りに余白を足して、触れやすくする）。内側：はみ出しを切るマスク */}
      <span
        aria-hidden
        className="group/flip -m-2 inline-block cursor-default p-2"
      >
        <span className="inline-grid overflow-hidden">
          <span
            className={`[grid-area:1/1] transition-[translate,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/flip:-translate-y-[110%] group-hover/flip:opacity-0 motion-reduce:transition-none ${upper ? "tracking-[0.01em] uppercase font-[family-name:var(--font-heading)]" : ""}`}
          >
            {en}
          </span>
          <span className="[grid-area:1/1] translate-y-[110%] whitespace-nowrap opacity-0 transition-[translate,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/flip:translate-y-0 group-hover/flip:opacity-100 motion-reduce:transition-none">
            {ja}
          </span>
        </span>
      </span>
    </Tag>
  );
}
