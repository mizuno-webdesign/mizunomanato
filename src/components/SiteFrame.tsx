import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// 下層ページの枠：共通のヘッダー（TOP と同じ）＋TOP と同じ横幅の本文領域＋フッター。(site)/layout.tsx と 404 で使う。
// 内容が短いページでも、フッターは画面の下端に来る。
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    // 幅1280px未満はヘッダーも左右16pxの内側。1280px以上のヘッダーは TOP と同じく画面の幅いっぱいに置く
    <div className="flex min-h-dvh w-full flex-col px-4 xl:px-0">
      <SiteHeader />
      {/* グリッドの横幅は、全ページで TOP と同じにする（社長指示 2026-11-26）。
          幅1280px以上は TOP のカードの左右の余白（1487に対して約34.5）、それより狭い幅は TOP の縦並びと同じ最大1000px。
          各ページでは横幅を狭めず、長い文章はカードの中で読みやすい幅に収める。 */}
      <main className="mx-auto w-full max-w-[1000px] flex-1 pt-5 xl:max-w-none xl:px-[calc(100%*34.5/1487)] xl:pt-0">{children}</main>
      <SiteFooter />
    </div>
  );
}
