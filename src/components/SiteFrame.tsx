import SiteNav from "./SiteNav";

// 新デザインのページ枠：ピル型ナビ＋インナー幅 最大1560px の本文領域（左右16px）。
// 経緯（社長指示 2026-11-24）：1280px は狭い → vexoo のように全幅（左右16px）にしたら大きすぎる → 中間のインナー幅。
// 1560px は、社長が提示した vexoo の画面（2000px 幅で本文 約1572px）に合わせた値（案）。
// 旧ページ（articles／works／activity）を作り直す段階で、各ページがこの枠を使う。
// 全ページの移行が終わったら layout.tsx へ移す。
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1560px] px-4">
      <SiteNav />
      <main className="pb-4 pt-8">{children}</main>
    </div>
  );
}
