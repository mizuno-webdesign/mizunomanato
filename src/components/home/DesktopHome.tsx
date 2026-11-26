import Image from "next/image";
import Link from "next/link";
import { MovingArrow, u } from "@/components/home/Arrow";
import RoleRotator from "@/components/home/RoleRotator";
import RollText from "@/components/home/RollText";
import ServiceIllustration from "@/components/home/ServiceIllustration";
import ThemeToggle from "@/components/ThemeToggle";
import ToolMarquee from "@/components/home/ToolMarquee";
import { ACCEPTING_NEW_REQUESTS, AVAILABILITY_LABEL } from "@/lib/availability";
import { NOTE_TEXT, type ArticleItem, type WorkItem } from "@/lib/home";
import { SERVICES } from "@/lib/services";

// TOP の PC 表示（幅1280px以上）。社長が提示した案（1487×1058px の画像）を実測して組んでいる。
// 数値はすべて案の画像のピクセル。u(n) で「画面幅 ÷ 1487」の倍率をかけるので、どの幅でも同じ比率になる。
// 色は緑。サービスの絵は社長提供の3枚（ServiceIllustration）で、位置と大きさは案の絵に合わせている。
// 内容は縦並びの表示（StackedHome）とそろえる。

// 色は globals.css の変数（明るい表示と暗い表示で値が変わる）
const INK = "var(--top-ink)";
const SUB = "var(--top-sub)";
const GREEN = "var(--top-green)";
const CTA = "var(--top-cta)";
const BORDER = "var(--top-border)";
const RULE = "var(--top-rule)";

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
      style={{ ...box({ x, y, w, h }), border: `1px solid ${BORDER}`, borderRadius: u(18), backgroundColor: "var(--top-card)", backgroundImage: "var(--card-noise)", backgroundSize: "160px 160px", boxShadow: "var(--card-shadow)" }}
    />
  );
}

const Line = ({ x, y, w, h, color = RULE }: Box & { color?: string }) => (
  <div aria-hidden style={{ ...box({ x, y, w, h }), background: color }} />
);

const NAV = [
  { en: "Home", ja: "ホーム", href: "/" },
  { en: "Services", ja: "サービス", href: "/service" },
  { en: "Works", ja: "事例", href: "/works" },
  { en: "Blogs", ja: "記事", href: "/articles" },
  { en: "About", ja: "プロフィール", href: "/about" },
];

// サービス3列の左の位置。名前と説明は src/lib/services.tsx。
const SERVICE_X = [512, 844, 1164];
// 絵の位置と大きさ。3枚とも下端を y=484 にそろえる。改修の絵は縦に長いので、高さを少し大きくする。
const SERVICE_ART = [
  { id: "build", x: 490, y: 229, w: 292, h: 255 },
  { id: "improve", x: 820, y: 200, w: 270, h: 284 },
  { id: "operate", x: 1127, y: 235, w: 290, h: 249 },
];

const ROWS = [841.5, 891.5, 944.5];
const LOWER_HEADING_Y = 663; // 下の段（上端627）のカード見出しの縦の中心

export default function DesktopHome({
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
        <Link href="/" aria-label="Manato Mizuno トップ" style={box({ x: 67, y: 34.5, w: 74, h: 31 })} className="focus-visible:outline-2 focus-visible:outline-accent">
          <Image src="/logo/logo-green.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-light size-full object-contain" />
          <Image src="/logo/logo-white.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-dark size-full object-contain" />
        </Link>
        {/* ナビ：中心は案と同じ（x=743.5）。項目が5つになったので、枠の幅は中身に合わせる */}
        <nav
          aria-label="メイン"
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
            background: "var(--top-nav)",
            whiteSpace: "nowrap",
          }}
        >
          {NAV.map((n, i) => {
            const active = i === 0;
            return (
              <div key={n.en} className="flex items-center">
                {i > 1 && <span aria-hidden style={{ width: 1, height: u(22), background: "var(--top-sep)" }} />}
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`group/roll flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none ${active ? "bg-[var(--top-nav-active)]" : "hover:bg-[var(--top-nav-hover)]"}`}
                  style={{ height: u(40), minWidth: u(112), padding: `0 ${u(18)}`, borderRadius: u(20), fontSize: u(15), lineHeight: 1.5, fontWeight: 500, color: active ? GREEN : INK }}
                >
                  <RollText en={n.en} ja={n.ja} center enClassName="font-[family-name:var(--font-heading)]" />
                </Link>
              </div>
            );
          })}
        </nav>
        {/* 明暗の切り替え。相談ボタンの左に置く */}
        <ThemeToggle
          style={{ ...box({ x: 1201, y: 28, w: 44, h: 44 }), border: `1px solid ${BORDER}`, background: "var(--top-nav)" }}
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

        {/* ---- 紹介 ---- */}
        <section aria-labelledby="pc-intro-name">
          <Card x={34} y={130} w={409} h={476} />
          <Image
            src="/profile-face.webp"
            alt="Manato Mizuno"
            width={212}
            height={226}
            sizes="12vw"
            loading="eager"
            fetchPriority="high"
            style={{ ...box({ x: 68, y: 172, w: 106, h: 113 }), objectFit: "cover", borderRadius: u(10) }}
          />
          <h1
            id="pc-intro-name"
            className="font-[family-name:var(--font-heading)]"
            style={{ position: "absolute", left: u(65), top: u(312), fontSize: u(48), lineHeight: 1.1, fontWeight: 600, letterSpacing: u(-0.5), color: INK }}
          >
            Manato
            <br />
            Mizuno
          </h1>
          <p className="flex items-center whitespace-nowrap" style={{ position: "absolute", left: u(67), top: u(426), height: u(20), gap: u(16), fontSize: u(13.5), lineHeight: 1 }}>
            <span style={{ color: SUB }}>Shizuoka, Japan</span>
            <span className={`flex items-center font-medium ${ACCEPTING_NEW_REQUESTS ? "text-ok" : "text-ng"}`} style={{ gap: u(7) }}>
              <span aria-hidden className={`rounded-full bg-current ${ACCEPTING_NEW_REQUESTS ? "status-dot" : ""}`} style={{ width: u(7), height: u(7) }} />
              {ACCEPTING_NEW_REQUESTS ? AVAILABILITY_LABEL.open : AVAILABILITY_LABEL.closed}
            </span>
          </p>
          <p style={{ position: "absolute", left: u(67), top: u(477), fontSize: u(19), lineHeight: u(28), fontWeight: 700, letterSpacing: u(0.4), color: GREEN }}>
            <RoleRotator />
          </p>
          <T x={67} cy={526} size={15} color={SUB} ls={0.4} as="p">Shopifyを中心に、</T>
          <T x={67} cy={550} size={15} color={SUB} ls={0.4} as="p">新規構築・改修・運用支援。</T>
          <CornerLink card={{ right: 443, top: 130 }} href="/about" label="プロフィールを見る" />
        </section>

        {/* ---- サービス ---- */}
        <section aria-labelledby="pc-services-title">
          <Card x={460} y={130} w={992} h={476} />
          {/* 絵と絵をつなぐ線（絵の下に敷く） */}
          <svg aria-hidden viewBox="460 130 992 476" style={box({ x: 460, y: 130, w: 992, h: 476 })} fill="none" stroke="var(--top-sep)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M762 356h22l16-14h38" />
            <path d="M1074 342h38l16 14h22" />
          </svg>
          {SERVICE_ART.map((a) => (
            <ServiceIllustration key={a.id} id={a.id} sizes="20vw" style={box(a)} />
          ))}
          <Heading id="pc-services-title" x={494} cy={175} en="Services" ja="サービス" />
          <Line x={786} y={500} w={1} h={70} />
          <Line x={1107} y={500} w={1} h={70} />
          {/* 各サービスの矢印は置かず、カード右上の矢印から一覧へ移動する（社長指示 2026-11-26） */}
          <CornerLink card={{ right: 1452, top: 130 }} href="/service" label="サービスの詳細を見る" />
          {SERVICES.map((s, i) => (
            <div key={s.id}>
              <T x={SERVICE_X[i]} cy={519} size={19} weight={700} as="p">{s.name}</T>
              <T x={SERVICE_X[i]} cy={550} size={15} color={SUB} as="p">{s.line}</T>
            </div>
          ))}
        </section>

        {/* ---- 事例 ---- */}
        <section aria-labelledby="pc-works-title">
          <Card x={34} y={627} w={667} h={363} />
          <Heading id="pc-works-title" x={66} cy={LOWER_HEADING_Y} en="Works" ja="事例" />
          <CornerLink card={{ right: 701, top: 627 }} href="/works" label="事例をすべて見る" />
          {works.length === 0 && <T x={67} cy={760} size={15} color={SUB} as="p">事例は準備中です。</T>}
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
        <section aria-labelledby="pc-tools-title">
          <Card x={716} y={627} w={360} h={112} />
          <Heading id="pc-tools-title" x={739} cy={LOWER_HEADING_Y} en="Tools" ja="ツール" />
          {/* 帯は見出しの下。カードの幅いっぱいに流す */}
          <div style={{ ...box({ x: 727, y: 678, w: 338, h: 59 }), overflow: "hidden" }}>
            <ToolMarquee />
          </div>
        </section>

        {/* ---- ひとこと ---- 更新が止まって見えないように、日付は付けない */}
        <section aria-labelledby="pc-note-title">
          <Card x={1092} y={627} w={360} h={112} />
          <Heading id="pc-note-title" x={1115} cy={LOWER_HEADING_Y} en="Note" ja="ひとこと" />
          <T x={1115} cy={698} size={15} color={SUB} as="p">{NOTE_TEXT}</T>
        </section>

        {/* ---- 記事 ---- */}
        <section aria-labelledby="pc-articles-title">
          <Card x={716} y={757} w={736} h={233} />
          <Heading id="pc-articles-title" x={741} cy={787} en="Blogs" ja="記事" />
          <CornerLink card={{ right: 1452, top: 757 }} href="/articles" label="記事をすべて見る" />
          {[815, 866, 917, 972].map((y) => (
            <Line key={y} x={740} y={y} w={688} h={1} />
          ))}
          {articles.length === 0 && <T x={748} cy={ROWS[0]} size={15} color={SUB} as="p">記事は準備中です。</T>}
          {articles.slice(0, 3).map((a, i) => (
            <Link key={a._id} href={`/articles/${a.slug}`} className="group focus-visible:outline-2 focus-visible:outline-accent">
              <span aria-hidden style={box({ x: 740, y: ROWS[i] - 24, w: 688, h: 48 })} className="transition-colors duration-150 group-hover:bg-[var(--top-green)]/5 motion-reduce:transition-none" />
              <T x={748} cy={ROWS[i]} size={14} color="var(--top-date)">{a.date}</T>
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
