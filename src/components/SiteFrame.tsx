import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// 下層ページの枠：共通のヘッダー（TOP と同じ）＋インナー幅 最大1560px の本文領域（左右16px）＋フッター。(site)/layout.tsx と 404 で使う。
// 1560px は、社長が提示した vexoo の画面（2000px 幅で本文 約1572px）に合わせた値。内容が短いページでも、フッターは画面の下端に来る。
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    // 幅1280px未満はヘッダーも左右16pxの内側。1280px以上のヘッダーは TOP と同じく画面の幅いっぱいに置く
    <div className="flex min-h-dvh w-full flex-col px-4 xl:px-0">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1560px] flex-1 pt-5 xl:px-4 xl:pt-0">{children}</main>
      <SiteFooter />
    </div>
  );
}
