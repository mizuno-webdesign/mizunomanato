// 描画の前に実行したい短いスクリプトを置く部品。
// Next の資料（preventing-flash-before-hydration）の方法：サーバーの出力では実行し、ブラウザ側の描き直しでは実行しない。
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
