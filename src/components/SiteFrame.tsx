import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

// ページ枠：ピル型ナビ＋インナー幅 最大1560px の本文領域（左右16px）＋フッター。(site)/layout.tsx で使う。
// 経緯（社長指示 2026-11-24）：1280px は狭い → vexoo のように全幅（左右16px）にしたら大きすぎる → 中間のインナー幅。
// 1560px は、社長が提示した vexoo の画面（2000px 幅で本文 約1572px）に合わせた値（案）。
// 内容が短いページでも、フッターは画面の下端に来る。
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1560px] flex-col px-4">
      <SiteNav />
      <main className="flex-1 pt-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
