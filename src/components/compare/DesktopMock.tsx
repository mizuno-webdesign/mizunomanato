import Image from "next/image";
import Link from "next/link";
import RollText from "@/components/compare/RollText";
import ThemeToggle from "@/components/ThemeToggle";
import ToolMarquee from "@/components/compare/ToolMarquee";
import type { ArticleItem } from "@/components/home/ArticlesCard";
import type { WorkItem } from "@/components/home/WorksCard";
import { ACCEPTING_NEW_REQUESTS, AVAILABILITY_LABEL } from "@/lib/availability";
import servicesImage from "./mock-services.webp";
import servicesImageDark from "./mock-services-dark.webp";

// 比較版の PC 表示：社長が提示した案（1487×1058px の画像）を実測して再現する（2026-11-26 承認の計画）。
// 数値はすべて案の画像のピクセル。u(n) で「画面幅 ÷ 1487」の倍率をかけるので、PC のどの幅でも同じ比率になる。
// 色は案の青を緑に置き換えた。サービスの絵（mock-services.webp）は案から切り抜いた仮の素材。
// 枠・余白・写真と絵の位置は実測値のまま。文言・項目・文字の大きさは社長の指示で直した（2026-11-26）：
// ナビと見出しは英語でホバー時に日本語、文字は案より小さく、ツールは5種でクリックすると名前が出る。

const u = (n: number) => `calc(${n} * var(--u))`;

// 色は globals.css の変数（明るい表示と暗い表示で値が変わる）
const INK = "var(--mock-ink)";
const SUB = "var(--mock-sub)";
const GREEN = "var(--mock-green)";
const CTA = "var(--mock-cta)";
const BORDER = "var(--mock-border)";
const RULE = "var(--mock-rule)";

type Box = { x: number; y: number; w: number; h: number };
const box = ({ x, y, w, h }: Box): React.CSSProperties => ({
  position: "absolute",
  left: u(x),
  top: u(y),
  width: u(w),
  height: u(h),
});

// 1行の文字。x は左端、cy は文字の縦の中心。ls は字間（px）で、案の文字幅に合わせるのに使う。
function T({
  x,
  cy,
  size,
  weight = 400,
  color = INK,
  ls = 0,
  as: Tag = "span",
  id,
  children,
}: {
  x: number;
  cy: number;
  size: number;
  weight?: number;
  color?: string;
  ls?: number;
  as?: "span" | "h1" | "h2" | "p";
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      id={id}
      style={{
        position: "absolute",
        left: u(x),
        top: u(cy - size / 2),
        fontSize: u(size),
        lineHeight: 1,
        fontWeight: weight,
        letterSpacing: u(ls),
        color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Tag>
  );
}

// 右上向きの矢印（案の ↗）。x・y を省くと、文字の横に並べて使える
function Arrow({ x, y, s, color = GREEN, sw = 1.6 }: { x?: number; y?: number; s: number; color?: string; sw?: number }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${s} ${s}`}
      style={x === undefined || y === undefined ? { width: u(s), height: u(s), flexShrink: 0 } : box({ x, y, w: s, h: s })}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={`M1.5 ${s - 1.5} ${s - 1.5} 1.5M${s * 0.28} 1.5H${s - 1.5}V${s * 0.72}`} />
    </svg>
  );
}

// リンクの矢印の動き（見本の1番。社長が選択 2026-11-26）。親のリンクに group/arrow をつけて使う。
// 乗せる（キーボードで選ぶ）と矢印の向きに斜めに3px進み、離すと戻る。180ms。背景の色づきや下線は使わない。
// 動きを減らす設定では動かさず、still で指定した色の変化だけにする。
const MOVE =
  "inline-flex transition-[translate] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/arrow:translate-x-[calc(3*var(--u))] group-hover/arrow:-translate-y-[calc(3*var(--u))] group-focus-visible/arrow:translate-x-[calc(3*var(--u))] group-focus-visible/arrow:-translate-y-[calc(3*var(--u))] motion-reduce:transition-none motion-reduce:group-hover/arrow:translate-none motion-reduce:group-focus-visible/arrow:translate-none";
const STILL_INK = "motion-reduce:group-hover/arrow:text-[var(--mock-ink)] motion-reduce:group-focus-visible/arrow:text-[var(--mock-ink)]";

function MovingArrow({ s, color = GREEN, still = STILL_INK, style }: { s: number; color?: string; still?: string; style?: React.CSSProperties }) {
  return (
    // 色は外側の span に持たせ、動きを減らす設定のときに内側で上書きできるようにする
    <span aria-hidden style={{ color, ...style }}>
      <span className={`${MOVE} ${still}`}>
        <Arrow s={s} color="currentColor" />
      </span>
    </span>
  );
}

// カード見出し：英語（Outfit・大文字）が基本で、ホバーで日本語。cy は文字の縦の中心。
// 色は緑（黒と比べて社長が決定 2026-11-26）。
function Heading({ id, x, cy, en, ja }: { id: string; x: number; cy: number; en: string; ja: string }) {
  const size = 19;
  return (
    <h2
      id={id}
      className="group/roll cursor-default"
      style={{ position: "absolute", left: u(x), top: u(cy - size * 0.7), fontSize: u(size), lineHeight: 1.4, fontWeight: 600, color: GREEN }}
    >
      <RollText en={en} ja={ja} enClassName="uppercase tracking-[0.01em] font-[family-name:var(--font-heading)]" />
    </h2>
  );
}

// カード右上の角に置く内部リンク。文字は置かず、矢印だけ（社長指示 2026-11-26）。
// card はカードの右端と上端。3枚とも角から同じ距離に置く。大きさは以前の18の70%。label は読み上げ用の行き先の名前。
const CORNER_SIZE = 12.6;
const CORNER_INSET = 20;
const CORNER_HIT = 40; // 押せる範囲
function CornerLink({ card, href, label }: { card: { right: number; top: number }; href: string; label: string }) {
  const cx = card.right - CORNER_INSET - CORNER_SIZE / 2;
  const cy = card.top + CORNER_INSET + CORNER_SIZE / 2;
  return (
    <Link
      href={href}
      aria-label={label}
      className="group/arrow grid place-items-center focus-visible:outline-2 focus-visible:outline-accent"
      style={{ ...box({ x: cx - CORNER_HIT / 2, y: cy - CORNER_HIT / 2, w: CORNER_HIT, h: CORNER_HIT }), borderRadius: u(10) }}
    >
      <MovingArrow s={CORNER_SIZE} style={{ display: "flex" }} />
    </Link>
  );
}

function Card({ x, y, w, h }: Box) {
  return (
    <div
      aria-hidden
      style={{ ...box({ x, y, w, h }), border: `1px solid ${BORDER}`, borderRadius: u(18), background: "var(--mock-card)" }}
    />
  );
}

const Line = ({ x, y, w, h, color = RULE }: Box & { color?: string }) => (
  <div aria-hidden style={{ ...box({ x, y, w, h }), background: color }} />
);

const NAV = [
  { en: "Home", ja: "ホーム", href: "/compare" },
  { en: "Service", ja: "サービス", href: "/service" },
  { en: "Works", ja: "事例", href: "/works" },
  { en: "Blogs", ja: "記事", href: "/articles" },
  { en: "About", ja: "プロフィール", href: "/about" },
];

const SERVICE_COLUMNS = [
  { name: "新規構築", line: "Shopifyでストアを構築", x: 512 },
  { name: "改修", line: "機能追加・サイト改善など", x: 844 },
  { name: "運用支援", line: "分析と改善で公開後を支える", x: 1164 },
];

const ROWS = [841.5, 891.5, 944.5];

export default function DesktopMock({
  works,
  articles,
  className = "",
}: {
  works: WorkItem[];
  articles: ArticleItem[];
  className?: string;
}) {
  return (
    <div className={className} style={{ containerType: "inline-size" }}>
      <div
        className="relative overflow-hidden"
        style={{ "--u": "calc(100cqw / 1487)", height: u(1058) } as React.CSSProperties}
      >
        {/* ---- ヘッダー ---- */}
        {/* ロゴは社長提供の画像。左右の位置と中心の高さは案のロゴに合わせる（74×31） */}
        <Link href="/compare" aria-label="Manato Mizuno トップ" style={box({ x: 67, y: 34.5, w: 74, h: 31 })} className="focus-visible:outline-2 focus-visible:outline-accent">
          <Image src="/logo/logo-green.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-light size-full object-contain" />
          <Image src="/logo/logo-white.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-dark size-full object-contain" />
        </Link>
        {/* ナビ：中心は案と同じ（x=743.5）。項目が5つになったので、枠の幅は中身に合わせる */}
        <nav
          aria-label="メイン（比較版）"
          className="flex items-center"
          style={{
            position: "absolute",
            left: u(743.5),
            top: u(24),
            height: u(52),
            transform: "translateX(-50%)",
            padding: `0 ${u(6)}`,
            border: `1px solid ${BORDER}`,
            borderRadius: u(26),
            background: "var(--mock-nav)",
            whiteSpace: "nowrap",
          }}
        >
          {NAV.map((n, i) => {
            const active = i === 0;
            return (
              <div key={n.en} className="flex items-center">
                {i > 1 && <span aria-hidden style={{ width: 1, height: u(22), background: "var(--mock-sep)" }} />}
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`group/roll flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${active ? "bg-[var(--mock-nav-active)]" : "hover:bg-[var(--mock-nav-hover)]"}`}
                  style={{ height: u(40), minWidth: u(112), padding: `0 ${u(18)}`, borderRadius: u(20), fontSize: u(15), lineHeight: 1.5, fontWeight: 500, color: active ? GREEN : INK }}
                >
                  <RollText en={n.en} ja={n.ja} center />
                </Link>
              </div>
            );
          })}
        </nav>
        {/* 明暗の切り替え。相談ボタンの左に置く */}
        <ThemeToggle
          style={{ ...box({ x: 1201, y: 28, w: 44, h: 44 }), border: `1px solid ${BORDER}`, background: "var(--mock-nav)" }}
        />
        <Link
          href="/contact"
          aria-label="相談する"
          style={{ ...box({ x: 1257, y: 25, w: 170, h: 50 }), borderRadius: u(25), background: CTA }}
          className="group/arrow transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <MovingArrow s={13} color="#fff" still="" style={{ position: "absolute", left: u(119), top: u(18.5), display: "flex" }} />
        </Link>
        <div className="pointer-events-none" aria-hidden>
          <T x={1303} cy={50} size={16} weight={500} color="#fff">相談する</T>
        </div>
        <Line x={36} y={96} w={1415} h={1} />

        {/* ---- 紹介 ---- */}
        <section aria-labelledby="m-intro-name">
          <Card x={34} y={130} w={409} h={476} />
          {/* 写真は実際のもの。案と顔の大きさがそろうように、枠の中で寄せる */}
          <span style={{ ...box({ x: 68, y: 172, w: 106, h: 113 }), overflow: "hidden", borderRadius: u(10) }}>
            <Image
              src="/portrait.webp"
              alt="Manato Mizuno"
              fill
              sizes="25vw"
              loading="eager"
              style={{ objectFit: "cover", scale: "1.53", transformOrigin: "55% 38%" }}
            />
          </span>
          <h1
            id="m-intro-name"
            style={{ position: "absolute", left: u(65), top: u(312), fontSize: u(48), lineHeight: 1.1, fontWeight: 700, letterSpacing: u(-1.2), color: INK }}
          >
            Manato
            <br />
            Mizuno
          </h1>
          <T x={67} cy={448} size={19} weight={700} ls={0.4} as="p">ECサイト専門家</T>
          <T x={67} cy={484} size={15} color={SUB} ls={0.4} as="p">Shopifyを中心に、</T>
          <T x={67} cy={508} size={15} color={SUB} ls={0.4} as="p">新規構築・改修・運用支援。</T>
          <p className="flex items-center whitespace-nowrap" style={{ position: "absolute", left: u(67), top: u(550), height: u(20), gap: u(16), fontSize: u(13.5), lineHeight: 1 }}>
            <span style={{ color: SUB }}>Shizuoka, Japan</span>
            <span className={`flex items-center font-medium ${ACCEPTING_NEW_REQUESTS ? "text-ok" : "text-ng"}`} style={{ gap: u(7) }}>
              <span aria-hidden className={`rounded-full bg-current ${ACCEPTING_NEW_REQUESTS ? "status-dot" : ""}`} style={{ width: u(7), height: u(7) }} />
              {ACCEPTING_NEW_REQUESTS ? AVAILABILITY_LABEL.open : AVAILABILITY_LABEL.closed}
            </span>
          </p>
          <CornerLink card={{ right: 443, top: 130 }} href="/about" label="プロフィールを見る" />
        </section>

        {/* ---- サービス ---- */}
        <section aria-labelledby="m-services-title">
          <Card x={460} y={130} w={992} h={476} />
          <Image src={servicesImage} alt="" unoptimized loading="eager" className="only-light" style={box({ x: 480, y: 193, w: 955, h: 303 })} />
          <Image src={servicesImageDark} alt="" unoptimized loading="eager" className="only-dark" style={box({ x: 480, y: 193, w: 955, h: 303 })} />
          <Heading id="m-services-title" x={494} cy={175} en="Services" ja="サービス" />
          <Line x={786} y={500} w={1} h={70} />
          <Line x={1107} y={500} w={1} h={70} />
          {SERVICE_COLUMNS.map((s) => (
            <Link
              key={s.name}
              href="/service"
              aria-label={`${s.name}の詳細：${s.line}`}
              className="group/arrow focus-visible:outline-2 focus-visible:outline-accent"
              style={{ ...box({ x: s.x - 14, y: 497, w: 250, h: 76 }), borderRadius: u(10) }}
            >
              <span className="flex items-center whitespace-nowrap" style={{ position: "absolute", left: u(14), top: u(10), height: u(24), gap: u(9), fontSize: u(19), lineHeight: 1, fontWeight: 700, color: INK }}>
                {s.name}
                <MovingArrow s={13} style={{ display: "flex" }} />
              </span>
              <T x={14} cy={53} size={15} color={SUB}>{s.line}</T>
            </Link>
          ))}
        </section>

        {/* ---- 事例 ---- */}
        <section aria-labelledby="m-works-title">
          <Card x={34} y={627} w={667} h={363} />
          <Heading id="m-works-title" x={66} cy={672} en="Works" ja="事例" />
          <CornerLink card={{ right: 701, top: 627 }} href="/works" label="事例をすべて見る" />
          {works.slice(0, 2).map((w, i) => {
            const x = i === 0 ? 60 : 378;
            return (
              <Link key={w._id} href={`/works/${w.slug}`} className="group focus-visible:outline-2 focus-visible:outline-accent">
                <span style={{ ...box({ x, y: 737, w: 299, h: 179 }), overflow: "hidden", borderRadius: u(10), background: "var(--color-sunken)" }}>
                  {w.image && (
                    <Image src={w.image} alt="" fill sizes="22vw" className="object-cover transition-[scale] duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none" />
                  )}
                </span>
                <T x={x + 3} cy={940} size={15}>{w.title}</T>
              </Link>
            );
          })}
        </section>

        {/* ---- ツール ---- */}
        <section aria-labelledby="m-tools-title">
          <Card x={716} y={627} w={360} h={112} />
          <Heading id="m-tools-title" x={739} cy={683} en="Tools" ja="ツール" />
          <div style={{ ...box({ x: 824, y: 663, w: 238, h: 60 }), overflow: "hidden" }}>
            <ToolMarquee />
          </div>
        </section>

        {/* ---- ひとこと ---- */}
        {/* 【仮の文章】案を見るための見本。社長の言葉に差し替えるまで公開しない。
            ひとこと型（更新が止まって見えないように、日付は付けない）。2行で全角40字ほどが入る目安。 */}
        <section aria-labelledby="m-note-title">
          <Card x={1092} y={627} w={360} h={112} />
          <Heading id="m-note-title" x={1115} cy={654} en="Note" ja="ひとこと" />
          <p
            className="whitespace-nowrap"
            style={{ position: "absolute", left: u(1115), top: u(675), fontSize: u(14), lineHeight: u(24), color: SUB }}
          >
            作って終わりにしない。公開後に何を直すかまで
            <br />
            一緒に考えたい。
          </p>
        </section>

        {/* ---- 記事 ---- */}
        <section aria-labelledby="m-articles-title">
          <Card x={716} y={757} w={736} h={233} />
          <Heading id="m-articles-title" x={741} cy={787} en="Blogs" ja="記事" />
          <CornerLink card={{ right: 1452, top: 757 }} href="/articles" label="記事をすべて見る" />
          {[815, 866, 917, 972].map((y) => (
            <Line key={y} x={740} y={y} w={688} h={1} />
          ))}
          {articles.slice(0, 3).map((a, i) => (
            <Link key={a._id} href={`/articles/${a.slug}`} className="group focus-visible:outline-2 focus-visible:outline-accent">
              <span aria-hidden style={box({ x: 740, y: ROWS[i] - 24, w: 688, h: 48 })} className="transition-colors duration-150 group-hover:bg-[var(--mock-green)]/5 motion-reduce:transition-none" />
              <T x={748} cy={ROWS[i]} size={14} color="var(--mock-date)">{a.date}</T>
              {/* 入りきらない題名は「…」で省略する */}
              <span
                className="overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ position: "absolute", left: u(850), top: u(ROWS[i] - 12), width: u(545), fontSize: u(15), lineHeight: u(24), color: INK }}
              >
                {a.title}
              </span>
              <svg aria-hidden viewBox="0 0 9 15" style={box({ x: 1416, y: ROWS[i] - 7.5, w: 9, h: 15 })} fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m1.2 1.2 6.4 6.3-6.4 6.3" />
              </svg>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
