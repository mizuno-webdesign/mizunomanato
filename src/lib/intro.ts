// TOP を開いたときの動き（src/components/home/Intro.tsx）の、先頭で動く部分。
// 回線が遅いと、動きの部品（ページの末尾）が届く前にページの上の方が描かれて、一瞬見えてから覆われる。
// そのため、再生するときは描画の前に <html data-intro> を付けて、中身を隠す（背景だけが見える。隠し方は globals.css）。
// ・再生するのは、タブを開いてから、TOP を直接読み込んだ最初の1回だけ（記録は sessionStorage。タブを閉じると消え、どこにも送らない）。
//   記録が使えないブラウザでは、毎回出ないように再生しない。
// ・動きを減らす設定と、裏のタブで開いたときは再生しない。
// ・確認用：URL に ?intro を付けると、何度でも再生する。
export const INTRO_KEY = "intro";

export const INTRO_HEAD_SCRIPT = `(function(){try{
if(location.pathname!=="/"||!Element.prototype.animate||document.hidden||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(!new URLSearchParams(location.search).has("intro")&&sessionStorage.getItem("${INTRO_KEY}"))return;
document.documentElement.setAttribute("data-intro","");
}catch(e){}})();`;
