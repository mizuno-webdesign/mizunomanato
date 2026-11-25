import SiteFrame from "@/components/SiteFrame";

// 公開ページの共通の枠（ナビ＋本文＋フッター）。(site) はURLに出ないグループ名で、
// 管理画面（/studio）にはこの枠を適用しないために分けている。
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>;
}
