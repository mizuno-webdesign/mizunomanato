// 英語が基本で、ホバー（キーボードで選んだときも）すると英語が上へ抜け、日本語が下から上がる（今の TOP の見出しと同じ動き）。
// 切り替えのきっかけは、親につけた group/roll。見出しは見出し自身に、ナビはリンク全体につける。
// 読み上げには英語だけを渡す。
const BASE =
  "[grid-area:1/1] whitespace-nowrap transition-[translate,opacity] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export default function RollText({
  en,
  ja,
  enClassName = "",
  center = false,
}: {
  en: React.ReactNode;
  ja: React.ReactNode;
  enClassName?: string;
  center?: boolean; // 中央ぞろえ（ナビ）。見出しは左ぞろえ
}) {
  return (
    <>
      <span className="sr-only">{en}</span>
      <span aria-hidden className={`inline-grid overflow-hidden align-top ${center ? "justify-items-center" : "justify-items-start"}`}>
        <span className={`${BASE} ${enClassName} group-hover/roll:-translate-y-[110%] group-hover/roll:opacity-0 group-focus-visible/roll:-translate-y-[110%] group-focus-visible/roll:opacity-0`}>
          {en}
        </span>
        <span className={`${BASE} translate-y-[110%] opacity-0 group-hover/roll:translate-y-0 group-hover/roll:opacity-100 group-focus-visible/roll:translate-y-0 group-focus-visible/roll:opacity-100`}>
          {ja}
        </span>
      </span>
    </>
  );
}
