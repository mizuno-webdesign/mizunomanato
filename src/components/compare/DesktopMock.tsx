import Image from "next/image";
import Link from "next/link";
import MarqueeViewport from "@/components/home/MarqueeViewport";
import type { ArticleItem } from "@/components/home/ArticlesCard";
import type { WorkItem } from "@/components/home/WorksCard";
import servicesImage from "./mock-services.webp";

// 比較版の PC 表示：社長が提示した案（1487×1058px の画像）を実測して再現する（2026-11-26 承認の計画）。
// 数値はすべて案の画像のピクセル。u(n) で「画面幅 ÷ 1487」の倍率をかけるので、PC のどの幅でも同じ比率になる。
// 色は案の青を緑に置き換えた。サービスの絵（mock-services.webp）は案から切り抜いた仮の素材。
// 文言は案のまま（肩書き、運用・保守、ナビ3項目などは、このあと1つずつ直す）。

const u = (n: number) => `calc(${n} * var(--u))`;

const INK = "#16171c";
const SUB = "#4a4d57";
const GREEN = "#0b6b3e";
const CTA = "#095c35";
const BORDER = "#e3e5ec";
const RULE = "#eceef3";

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

// 右上向きの矢印（案の ↗）
function Arrow({ x, y, s, color = GREEN, sw = 1.8 }: { x: number; y: number; s: number; color?: string; sw?: number }) {
  return (
    <svg aria-hidden viewBox={`0 0 ${s} ${s}`} style={box({ x, y, w: s, h: s })} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M1.5 ${s - 1.5} ${s - 1.5} 1.5M${s * 0.28} 1.5H${s - 1.5}V${s * 0.72}`} />
    </svg>
  );
}

function Card({ x, y, w, h }: Box) {
  return (
    <div
      aria-hidden
      style={{ ...box({ x, y, w, h }), border: `1px solid ${BORDER}`, borderRadius: u(18), background: "#f9fafe" }}
    />
  );
}

const Line = ({ x, y, w, h, color = RULE }: Box & { color?: string }) => (
  <div aria-hidden style={{ ...box({ x, y, w, h }), background: color }} />
);

// 当たり判定だけのリンク（文字や画像の上に重ねる）
function Hit({ href, label, ...b }: Box & { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      style={{ ...box(b), borderRadius: u(10) }}
      className="transition-colors duration-150 hover:bg-[#0b6b3e]/5 focus-visible:outline-2 focus-visible:outline-accent motion-reduce:transition-none"
    />
  );
}

const SERVICE_COLUMNS = [
  { name: "新規構築", line: "Shopifyでお店を作る", x: 512, arrowX: 624, nameLs: 1, lineLs: 0.45 },
  { name: "改修", line: "既存ストアを改善する", x: 844, arrowX: 906, nameLs: 0.5, lineLs: 0.55 },
  { name: "運用・保守", line: "公開後の運用を支える", x: 1165, arrowX: 1291, nameLs: -0.2, lineLs: 1.3 },
];

const PLATFORMS = [
  { name: "Shopify", icon: "/icons/shopify.svg", iconX: 0, textX: 43, size: 17, ls: 0, iconSize: 32 },
  { name: "カラーミーショップ", icon: "/icons/colorme.svg", iconX: 144, textX: 186, size: 15.2, ls: -0.9, iconSize: 29 },
];
const PAIR = 355; // Shopify とカラーミーの1組の横幅
const PAIRS_PER_SET = 4; // 1セットがカード幅（736）より長くなる数

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
        <Link href="/compare" aria-label="Manato Mizuno トップ" style={box({ x: 67, y: 36, w: 74, h: 28 })} className="focus-visible:outline-2 focus-visible:outline-accent">
          <svg viewBox="67 36 74 28" className="size-full" fill="none" stroke={GREEN} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M69.7 61.8 94 38.6V61.8L116 38.6V61.8L138.3 38.6V61.8" />
          </svg>
        </Link>
        <nav aria-label="メイン（比較版）">
          <div aria-hidden style={{ ...box({ x: 512, y: 24, w: 463, h: 52 }), border: `1px solid ${BORDER}`, borderRadius: u(26), background: "#fbfcff" }} />
          <div aria-hidden style={{ ...box({ x: 519, y: 30, w: 132, h: 40 }), borderRadius: u(20), background: "#e9f3ee" }} />
          <Line x={666} y={37} w={1} h={26} color="#e1e3e7" />
          <Line x={780} y={37} w={1} h={26} color="#e1e3e7" />
          <T x={559} cy={51.5} size={18} weight={500} color={GREEN}>ホーム</T>
          <T x={704.5} cy={51} size={19} weight={500}>実績</T>
          <T x={818} cy={51} size={18.5} weight={500}>プロフィール</T>
          <Hit href="/compare" label="ホーム" x={519} y={30} w={132} h={40} />
          <Hit href="/works" label="実績" x={672} y={30} w={102} h={40} />
          <Hit href="/about" label="プロフィール" x={788} y={30} w={170} h={40} />
        </nav>
        <Link
          href="/contact"
          aria-label="相談する"
          style={{ ...box({ x: 1257, y: 25, w: 170, h: 50 }), borderRadius: u(25), background: CTA }}
          className="transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        />
        <div className="pointer-events-none" aria-hidden>
          <T x={1293} cy={50.5} size={19} weight={500} color="#fff" ls={0.5}>相談する</T>
          <Arrow x={1379} y={42} s={16} color="#fff" />
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
          <h1 id="m-intro-name" className="sr-only">Manato Mizuno</h1>
          <div aria-hidden>
            <T x={63} cy={339} size={60} weight={700} ls={-2.1}>Manato</T>
            <T x={63} cy={400} size={60} weight={700} ls={-1.5}>Mizuno</T>
          </div>
          <T x={66.5} cy={470.5} size={25} weight={700} ls={1} as="p">ECコンサルタント</T>
          <T x={66} cy={512.5} size={19} color={SUB} ls={1.1} as="p">Shopifyを中心に、EC全般に対応。</T>
          <Arrow x={392} y={172} s={18} />
          <Hit href="/about" label="プロフィールを見る" x={380} y={160} w={42} h={42} />
        </section>

        {/* ---- サービス ---- */}
        <section aria-labelledby="m-services-title">
          <Card x={460} y={130} w={992} h={476} />
          <Image src={servicesImage} alt="" unoptimized loading="eager" style={box({ x: 480, y: 193, w: 955, h: 303 })} />
          <T x={494} cy={177} size={29} weight={500} ls={-0.4} as="h2" id="m-services-title">サービス</T>
          <Line x={786} y={500} w={1} h={70} />
          <Line x={1107} y={500} w={1} h={70} />
          {SERVICE_COLUMNS.map((s) => (
            <div key={s.name}>
              <T x={s.x} cy={520} size={24} weight={700} ls={s.nameLs}>
                {s.name.includes("・") ? (
                  <>
                    {s.name.split("・")[0]}
                    {/* 案の中黒は幅が狭いので、前後を詰める */}
                    <span style={{ marginLeft: u(-4), marginRight: u(-3) }}>・</span>
                    {s.name.split("・")[1]}
                  </>
                ) : (
                  s.name
                )}
              </T>
              <Arrow x={s.arrowX} y={509} s={16} />
              <T x={s.x - 0.5} cy={555} size={18} color={SUB} ls={s.lineLs}>{s.line}</T>
              <Hit href="/service" label={`${s.name}の詳細`} x={s.x - 14} y={497} w={250} h={76} />
            </div>
          ))}
        </section>

        {/* ---- 制作実績 ---- */}
        <section aria-labelledby="m-works-title">
          <Card x={34} y={627} w={667} h={363} />
          <T x={67} cy={674.5} size={30} weight={700} as="h2" id="m-works-title">制作実績</T>
          <T x={558} cy={672.5} size={19} weight={500} color={GREEN} ls={1.2}>実績一覧</T>
          <Arrow x={651} y={664} s={15} />
          <Hit href="/works" label="実績一覧" x={546} y={654} w={130} h={36} />
          {works.slice(0, 2).map((w, i) => {
            const x = i === 0 ? 60 : 378;
            return (
              <Link key={w._id} href={`/works/${w.slug}`} className="group focus-visible:outline-2 focus-visible:outline-accent">
                <span style={{ ...box({ x, y: 737, w: 299, h: 179 }), overflow: "hidden", borderRadius: u(10), background: "#e5e5ea" }}>
                  {w.image && (
                    <Image src={w.image} alt="" fill sizes="22vw" className="object-cover transition-[scale] duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none" />
                  )}
                </span>
                <T x={x + (i === 0 ? 3 : 2)} cy={940.5} size={20}>{w.title}</T>
              </Link>
            );
          })}
        </section>

        {/* ---- 対応プラットフォーム ---- */}
        <section aria-labelledby="m-platform-title">
          <Card x={716} y={627} w={736} h={112} />
          <T x={740} cy={655} size={19} weight={700} ls={0.4} as="h2" id="m-platform-title">対応プラットフォーム</T>
          <ul className="sr-only">
            {PLATFORMS.map((p) => (
              <li key={p.name}>{p.name}</li>
            ))}
          </ul>
          <div style={{ ...box({ x: 717, y: 678, w: 734, h: 40 }), overflow: "hidden" }}>
            <MarqueeViewport className="marquee size-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_90%,transparent)]">
              {/* 開始位置：最初の画面で Shopify のアイコンが案の位置（x=820）に来るように、1組分手前から流す */}
              <div className="relative h-full" style={{ left: u(102 - PAIR) }}>
                <div className="marquee-track absolute top-0 left-0 flex h-full w-max" style={{ "--marquee-dur": "95s" } as React.CSSProperties}>
                  {Array.from({ length: PAIRS_PER_SET * 2 }, (_, n) => (
                    <div key={n} className="relative h-full shrink-0" style={{ width: u(PAIR) }}>
                      {PLATFORMS.map((p) => (
                        <div key={p.name}>
                          <Image src={p.icon} alt="" width={32} height={32} unoptimized style={{ ...box({ x: p.iconX, y: 3 + (32 - p.iconSize) / 2, w: p.iconSize, h: p.iconSize }), borderRadius: u(6) }} />
                          <T x={p.textX} cy={21} size={p.size} ls={p.ls} weight={500}>{p.name}</T>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </MarqueeViewport>
          </div>
        </section>

        {/* ---- 記事 ---- */}
        <section aria-labelledby="m-articles-title">
          <Card x={716} y={757} w={736} h={233} />
          <T x={741} cy={788} size={25} weight={700} as="h2" id="m-articles-title">記事</T>
          <T x={1321} cy={790} size={18} weight={500} color={GREEN} ls={1.4}>記事一覧</T>
          <Arrow x={1409} y={781} s={15} />
          <Hit href="/articles" label="記事一覧" x={1308} y={771} w={126} h={34} />
          {[815, 866, 917, 972].map((y) => (
            <Line key={y} x={740} y={y} w={688} h={1} />
          ))}
          {articles.slice(0, 3).map((a, i) => (
            <Link key={a._id} href={`/articles/${a.slug}`} className="group focus-visible:outline-2 focus-visible:outline-accent">
              <span aria-hidden style={box({ x: 740, y: ROWS[i] - 24, w: 688, h: 48 })} className="transition-colors duration-150 group-hover:bg-[#0b6b3e]/5 motion-reduce:transition-none" />
              <T x={747} cy={ROWS[i] + 1} size={17.5} color="#6a6e7a">{a.date.slice(5)}</T>
              {/* 案の3本目は副題（── 以降）がないので、そこで区切る */}
              <T x={829} cy={ROWS[i] + 1} size={18} ls={0.4}>{a.title.split(/\s*[─―—]{2}/)[0]}</T>
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
