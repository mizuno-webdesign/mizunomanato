import SiteNav from "./SiteNav";

// 新デザインのページ枠：ピル型ナビ＋最大幅1280pxの本文領域。
// 旧ページ（articles／works／activity）を作り直す段階で、各ページがこの枠を使う。
// 全ページの移行が終わったら layout.tsx へ移す。
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
      <SiteNav />
      <main className="pb-16 pt-8">{children}</main>
    </div>
  );
}
