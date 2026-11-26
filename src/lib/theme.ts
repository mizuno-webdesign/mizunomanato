// 明るい表示と暗い表示の切り替え（2026-11-26）。
// ・既定は端末（ブラウザ）の設定に合わせる。切り替えボタンで選んだときだけ、ブラウザに保存する。
// ・端末の設定と同じ表示に戻すと、保存を消して「自動」に戻る。
// ・<html data-theme="light|dark"> を常に付け、色は globals.css の :root[data-theme="dark"] で差し替える。
export const THEME_KEY = "theme";

// スマホのブラウザ上部の色。ページ上端の地の色に合わせる（globals.css の --color-canvas と同じ値）。
export const THEME_COLORS = { light: "#f2f2f7", dark: "#101312" } as const;

// 描画の前に実行するスクリプト（ちらつきを防ぐ）。記事の管理画面（/studio）は独自の見た目なので、何もしない。
// 参考：node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
export const THEME_INIT_SCRIPT = `(function(){try{
if(location.pathname.indexOf("/studio")===0)return;
var s=null;try{s=localStorage.getItem("${THEME_KEY}")}catch(e){}
var t=(s==="light"||s==="dark")?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
document.documentElement.setAttribute("data-theme",t);
}catch(e){}})();`;
