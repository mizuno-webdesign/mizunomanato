import RollText from "@/components/home/RollText";

// 下層ページと相談の帯の見出し：英語（大文字）が基本で、ホバーで日本語に切り替わる（動きは RollText。TOP の見出しと同じ）。
// タッチ端末では切り替わらず、英語のまま（Tailwind 4 の hover は、ホバーできる端末にだけ効く）。
export default function FlipHeading({
  id,
  en,
  ja,
  as: Tag = "h2",
  className = "",
}: {
  id?: string;
  en: string;
  ja: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag id={id} className={`text-[19px] leading-[1.4] font-semibold text-accent ${className}`}>
      {/* ホバーを受ける領域。見出しの周りに余白を足して、触れやすくする（下の1pxは、見出しの高さをそろえるため） */}
      <span className="group/roll -m-2 inline-block cursor-default p-2 pb-[9px]">
        <RollText en={en} ja={ja} enClassName="uppercase tracking-[0.01em] font-[family-name:var(--font-heading)]" />
      </span>
    </Tag>
  );
}
