// 全ページ共通のフッター（下層ページは SiteFrame、TOP は app/page.tsx と StackedHome から呼ぶ）。上下の余白は小さめ。
export default function SiteFooter() {
  return (
    <footer className="py-2 text-center">
      <p className="type-caption text-footer">© 2026 Manato Mizuno</p>
    </footer>
  );
}
