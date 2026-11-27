"use client";

// "use client"：ほかのページから TOP へ戻る描き直しで、InlineScript が実行されない種類のタグになるように（付けないと React が警告する）
import InlineScript from "@/components/InlineScript";

// 【試し】TOP を開いたときに、ロゴを一筆書きで描く動き（社長指示 2026-11-27。見比べて決める）。
// ・開発中の画面だけで動く。本番ビルドでは何も出さない（本番ビルドで速さを測るときは NEXT_PUBLIC_INTRO_TRIAL=1）。
// ・URL に ?intro=a か ?intro=b を付けて開いたときに再生する。付けなければ、今の画面のまま。
//   a：左上のロゴがその場で描かれ、同時にカードが順に現れる。画面は覆わない。
//   b：画面の中央で大きく描き、左上のロゴの位置へ移る。タップかキー操作で、すぐ終わる。
// ・動きを減らす設定では再生しない。
// ・動きは Element.animate() で付け、画面の要素の属性は書き換えない（React の描き直しと食い違わないように）。
// やめるとき・正式に入れるときは、このファイルと、src/app/page.tsx の呼び出しを書き直す。
const ENABLED = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_INTRO_TRIAL === "1";

// public/logo/logo-green.png を測ってなぞった線（600×252。線の太さ34。輪郭のずれは画素の約3%）
const LOGO_PATH = "M19 234 L233.5 19 L241 19 L241.5 228.5 L399 18.5 L411.5 20 L411.5 234.5 L569 18.5 L581.5 20 L581.5 232.5";

const SCRIPT = `(function(){
var mode=new URLSearchParams(location.search).get("intro");
if(mode!=="a"&&mode!=="b")return;
if(location.pathname!=="/"||!Element.prototype.animate||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var logo=[].slice.call(document.querySelectorAll('a[href="/"][data-ga-area="header"]')).filter(function(e){return e.getClientRects().length})[0];
if(!logo)return;
var to=logo.getBoundingClientRect();
if(to.bottom<=0||!to.width)return;
var EASE_OUT="cubic-bezier(0.23, 1, 0.32, 1)",EASE_IN_OUT="cubic-bezier(0.77, 0, 0.175, 1)";
var color=document.documentElement.getAttribute("data-theme")==="dark"?"#ffffff":"#035532";
var anims=[],layer=null,done=false;
function run(el,frames,timing){timing.fill=timing.fill||"backwards";var a=el.animate(frames,timing);anims.push(a);return a}
function finish(){if(done)return;done=true;anims.forEach(function(a){a.cancel()});if(layer)layer.remove();removeEventListener("keydown",finish)}
function make(tag,css,parent){var e=document.createElement(tag);e.style.cssText=css;parent.appendChild(e);return e}
function mark(parent,box){
var NS="http://www.w3.org/2000/svg",s=document.createElementNS(NS,"svg"),p=document.createElementNS(NS,"path");
s.setAttribute("viewBox","0 0 600 252");s.style.cssText="position:absolute;overflow:visible;"+box;
p.setAttribute("d","${LOGO_PATH}");p.setAttribute("pathLength","100");
p.setAttribute("fill","none");p.setAttribute("stroke",color);p.setAttribute("stroke-width","34");
p.setAttribute("stroke-linecap","round");p.setAttribute("stroke-linejoin","round");
p.style.strokeDasharray="100 200";
s.appendChild(p);parent.appendChild(s);return {svg:s,path:p}}
function draw(path,ms){run(path,[{strokeDashoffset:100.5,opacity:0},{opacity:1,offset:0.05},{strokeDashoffset:0,opacity:1}],{duration:ms,easing:EASE_IN_OUT,fill:"both"})}
// カードを順に出す。幅1280px以上は、中身が1つずつ絶対位置で置かれているので、同じカードの中身を同じタイミングで動かす
function rise(start,step){
var wide=matchMedia("(min-width: 1280px)").matches;
var groups=[].slice.call(document.querySelectorAll(wide?"main > section":"main > div.grid > *")).filter(function(e){return e.getClientRects().length});
groups.forEach(function(g,i){
var targets=[g];
if(wide)targets=[].slice.call(g.querySelectorAll("*")).filter(function(e){
if(getComputedStyle(e).position!=="absolute")return false;
for(var p=e.parentElement;p&&p!==g;p=p.parentElement)if(getComputedStyle(p).position==="absolute")return false;
return true});
targets.forEach(function(t){run(t,[{opacity:0,translate:"0 12px"},{opacity:1,translate:"0 0"}],{duration:300,delay:start+i*step,easing:EASE_OUT})})})}
try{
var total;
layer=make("div","position:fixed;inset:0;z-index:100;overflow:hidden;"+(mode==="a"?"pointer-events:none":""),document.documentElement);
layer.setAttribute("aria-hidden","true");
addEventListener("keydown",finish);
if(mode==="a"){
total=800;
setTimeout(finish,total);
var m=mark(layer,"left:"+to.left+"px;top:"+to.top+"px;width:"+to.width+"px;height:"+to.height+"px");
draw(m.path,700);
run(logo,[{opacity:0},{opacity:0}],{duration:total,fill:"both"});
rise(100,60);
}else{
total=1200;
setTimeout(finish,total);
layer.addEventListener("click",finish);
var bg=make("div","position:absolute;inset:0;background:"+getComputedStyle(document.body).backgroundColor,layer);
var w=Math.min(200,innerWidth*0.46),h=w*to.height/to.width,x=(innerWidth-w)/2,y=(innerHeight-h)/2;
var big=mark(layer,"left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px");
draw(big.path,650);
run(big.svg,[{transform:"none"},{transform:"translate("+(to.left+to.width/2-x-w/2)+"px,"+(to.top+to.height/2-y-h/2)+"px) scale("+to.width/w+")"}],{duration:400,delay:720,easing:EASE_IN_OUT,fill:"both"});
run(bg,[{opacity:1},{opacity:0}],{duration:360,delay:760,easing:"ease",fill:"both"});
run(logo,[{opacity:0},{opacity:0}],{duration:1120});
rise(820,45);
}
}catch(e){finish()}
})();`;

export default function IntroTrial() {
  return ENABLED ? <InlineScript html={SCRIPT} /> : null;
}
