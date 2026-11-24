import SiteNav from "./SiteNav";

// 新デザインのページ枠：ピル型ナビ＋画面幅いっぱいの本文領域（左右16px。社長指示 2026-11-24：vexoo のようにブラウザを広く使う。
// 実測：vexoo は 1440px・1920px とも左右16px・カード間16px・最大幅なし）。
// 旧ページ（articles／works／activity）を作り直す段階で、各ページがこの枠を使う。
// 全ページの移行が終わったら layout.tsx へ移す。
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-4">
      <SiteNav />
      <main className="pb-16 pt-8">{children}</main>
    </div>
  );
}
