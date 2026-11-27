"use client";

// "use client"：ほかのページから TOP へ戻る描き直しで、InlineScript が実行されない種類のタグになるように（付けないと React が警告する）
import InlineScript from "@/components/InlineScript";
import { INTRO_KEY } from "@/lib/intro";

// TOP を開いたときの動き：画面の中央でロゴを一筆書きで描き、左上のロゴの位置へ移る（社長決定 2026-11-27）。
// ・再生するかどうかは、ページの先頭のスクリプトが決めて <html data-intro> を付ける（条件は src/lib/intro.ts）。
//   ここはページの末尾で、覆いを作ってから data-intro を外す（同じ処理の中なので、間に中身は描かれない）。
// ・届くのが遅く、CSS の備え（3秒で中身を表示。globals.css）が先に働いていたら、再生しない。
// ・タップ、キー操作、スクロール、画面の幅の変化で、すぐ終わる。サイト内の移動で TOP へ来たときは再生しない。
//   タップで終えた後は、少しの間だけ透明な覆いを残す（2回続けて押したとき、下のリンクが開かないように）。
//   背景が消え終わったら、覆いはクリックを通す。
// ・背景はサイトと同じ。書く前と、書き終えた後に間を置く（時間は下の TIME）。
// ・動きは Element.animate() で付け、画面の要素の属性は書き換えない（React の描き直しと食い違わないように）。
//   途中で失敗しても、時間が来れば覆いを外す。

// public/logo/logo-green.png を測ってなぞった線（600×252。線の太さ34。輪郭のずれは画素の約3%）
const LOGO_PATH = "M19 234 L233.5 19 L241 19 L241.5 228.5 L399 18.5 L411.5 20 L411.5 234.5 L569 18.5 L581.5 20 L581.5 232.5";

// 時間（ミリ秒）。start：書き始めるまで／draw：書く時間／hold：書き終えて止まる時間／move：左上へ移る時間
const TIME = { start: 300, draw: 750, hold: 550, move: 450 };
const MOVE_AT = TIME.start + TIME.draw + TIME.hold;

const SCRIPT = `(function(){
var root=document.documentElement;
if(!root.hasAttribute("data-intro"))return;
function show(){root.removeAttribute("data-intro")}
try{
var shown=[].slice.call(document.body.children).filter(function(e){return e.getClientRects().length})[0];
if(!shown||getComputedStyle(shown).opacity!=="0"){show();return}
var logo=[].slice.call(document.querySelectorAll('a[href="/"][data-ga-area="header"]')).filter(function(e){return e.getClientRects().length})[0];
if(!logo){show();return}
var to=logo.getBoundingClientRect();
if(to.bottom<=0||!to.width){show();return}
sessionStorage.setItem("${INTRO_KEY}","1");
var EASE_OUT="cubic-bezier(0.23, 1, 0.32, 1)",EASE_IN_OUT="cubic-bezier(0.77, 0, 0.175, 1)";
var color=document.documentElement.getAttribute("data-theme")==="dark"?"#ffffff":"#035532";
var anims=[],layer=null,done=false;
function run(el,frames,timing){timing.fill=timing.fill||"backwards";var a=el.animate(frames,timing);anims.push(a);return a}
var startWidth=innerWidth;
function resized(){if(innerWidth!==startWidth)finish()}
function finish(e){if(done)return;done=true;anims.forEach(function(a){a.cancel()});
removeEventListener("keydown",finish);removeEventListener("scroll",finish);removeEventListener("resize",resized);
if(!layer)return;
if(e&&e.type==="click"){layer.textContent="";var rest=layer;setTimeout(function(){rest.remove()},400)}else layer.remove()}
function make(tag,css,parent){var e=document.createElement(tag);e.style.cssText=css;parent.appendChild(e);return e}
function mark(parent,box){
var NS="http://www.w3.org/2000/svg",s=document.createElementNS(NS,"svg"),p=document.createElementNS(NS,"path");
s.setAttribute("viewBox","0 0 600 252");s.style.cssText="position:absolute;overflow:visible;"+box;
p.setAttribute("d","${LOGO_PATH}");
p.setAttribute("fill","none");p.setAttribute("stroke",color);p.setAttribute("stroke-width","34");
p.setAttribute("stroke-linecap","round");p.setAttribute("stroke-linejoin","round");
s.appendChild(p);parent.appendChild(s);
var len=p.getTotalLength();p.style.strokeDasharray=len+" "+len*2;
return {svg:s,path:p,len:len}}
// カードを順に出す。幅1280px以上は、中身が1つずつ絶対位置で置かれているので、同じカードの中身を同じタイミングで動かす
function rise(start,step){
function visible(q){return [].slice.call(document.querySelectorAll(q)).filter(function(e){return e.getClientRects().length})}
var groups=visible("main > div.grid > *"),wide=!groups.length;
if(wide)groups=visible("main > section");
groups.forEach(function(g,i){
var targets=[g];
if(wide)targets=[].slice.call(g.querySelectorAll("*")).filter(function(e){
if(getComputedStyle(e).position!=="absolute")return false;
for(var p=e.parentElement;p&&p!==g;p=p.parentElement)if(getComputedStyle(p).position==="absolute")return false;
return true});
targets.forEach(function(t){run(t,[{opacity:0,translate:"0 12px"},{opacity:1,translate:"0 0"}],{duration:300,delay:start+i*step,easing:EASE_OUT})})})}
var total=${MOVE_AT + TIME.move + 250};
layer=make("div","position:fixed;inset:0;z-index:100;overflow:hidden",document.documentElement);
layer.setAttribute("aria-hidden","true");
layer.addEventListener("click",finish);
addEventListener("keydown",finish);
addEventListener("scroll",finish,{passive:true});
addEventListener("resize",resized);
// 終わりは動きの完了で決める（下）。これは完了が届かないときの備えなので、長めにする
setTimeout(finish,total+2000);
// 背景は、サイトの地（グラデーションとノイズ。globals.css の body）と同じ指定を使う。明暗の違いもそのまま入る
var page=getComputedStyle(document.body);
var bg=make("div","position:absolute;inset:0",layer);
["backgroundColor","backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat"].forEach(function(k){bg.style[k]=page[k]});
var w=Math.min(200,root.clientWidth*0.46),h=w*to.height/to.width,x=(root.clientWidth-w)/2,y=(root.clientHeight-h)/2;
var big=mark(layer,"left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px");
run(big.path,[{strokeDashoffset:big.len*1.005,opacity:0},{opacity:1,offset:0.05},{strokeDashoffset:0,opacity:1}],{duration:${TIME.draw},delay:${TIME.start},easing:EASE_IN_OUT,fill:"both"});
run(big.svg,[{transform:"none"},{transform:"translate("+(to.left+to.width/2-x-w/2)+"px,"+(to.top+to.height/2-y-h/2)+"px) scale("+to.width/w+")"}],{duration:${TIME.move},delay:${MOVE_AT},easing:EASE_IN_OUT,fill:"both"});
run(bg,[{opacity:1},{opacity:0}],{duration:${TIME.move - 40},delay:${MOVE_AT + 40},easing:"ease",fill:"both"});
run(logo,[{opacity:0},{opacity:0}],{duration:${MOVE_AT + TIME.move}});
rise(${MOVE_AT + 100},45);
// 背景が消え終わったら、見えている画面を押せるようにする
setTimeout(function(){if(!done)layer.style.pointerEvents="none"},${MOVE_AT + TIME.move});
Promise.all(anims.map(function(a){return a.finished})).then(function(){finish()},function(){});
show();
}catch(e){show();if(typeof finish==="function")finish()}
})();`;

export default function Intro() {
  return <InlineScript html={SCRIPT} />;
}
