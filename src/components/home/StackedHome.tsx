import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { MovingArrow } from "@/components/home/Arrow";
import RoleRotator from "@/components/home/RoleRotator";
import RollText from "@/components/home/RollText";
import ServiceIllustration from "@/components/home/ServiceIllustration";
import ToolMarquee from "@/components/home/ToolMarquee";
import { ACCEPTING_NEW_REQUESTS, AVAILABILITY_LABEL } from "@/lib/availability";
import { NOTE_TEXT, type ArticleItem, type WorkItem } from "@/lib/home";
import { SERVICES } from "@/lib/services";

// TOP の縦並びの表示（幅1280px未満：スマホ、タブレット、小さい PC）。内容は PC 表示（DesktopHome）と同じ。
// PC 表示は画面幅に合わせて全体が縮むため、この幅より狭いと文字が小さくなりすぎるので、こちらに切り替える。
// サービスの絵も PC 表示と同じ3枚を使う。

// 影は下層ページのカードと同じ
const CARD = "relative rounded-[18px] border border-[var(--top-border)] bg-[var(--top-card)] p-5 shadow-card md:p-6";

function Heading({ id, en, ja }: { id: string; en: string; ja: string }) {
  return (
    <h2 id={id} className="group/roll w-fit cursor-default text-[19px] leading-[1.4] font-semibold text-[var(--top-green)]">
      <RollText en={en} ja={ja} enClassName="uppercase tracking-[0.01em] font-[family-name:var(--font-heading)]" />
    </h2>
  );
}

// カード右上の角の内部リンク（矢印だけ）。label は読み上げ用の行き先の名前。
function CornerLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group/arrow absolute top-1.5 right-1.5 grid size-11 place-items-center rounded-[10px] focus-visible:outline-2 focus-visible:outline-accent"
    >
      <MovingArrow s={14} style={{ display: "flex" }} />
    </Link>
  );
}

export default function StackedHome({
  works,
  articles,
  className = "",
}: {
  works: WorkItem[];
  articles: ArticleItem[];
  className?: string;
}) {
  const open = ACCEPTING_NEW_REQUESTS;
  return (
    <div className={`flex min-h-dvh w-full flex-col px-4 ${className}`} style={{ "--u": "1px" } as React.CSSProperties}>
      <div className="flex items-center justify-between pt-3">
        <Link href="/" aria-label="Manato Mizuno トップ" className="block py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <Image src="/logo/logo-green.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-light h-8 w-auto" />
          <Image src="/logo/logo-white.png" alt="" width={600} height={252} unoptimized loading="eager" className="only-dark h-8 w-auto" />
        </Link>
        <CtaButton label="相談する" className="px-5! py-2! text-[14px]!" />
      </div>
      <SiteNav />

      <main className="mx-auto w-full max-w-[1000px] flex-1 pt-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* ---- 紹介 ---- */}
          <section aria-labelledby="s-intro-name" className={`${CARD} lg:col-span-2`}>
            <CornerLink href="/about" label="プロフィールを見る" />
            <div className="flex items-center gap-4">
              <Image
                src="/profile-face.webp"
                alt="Manato Mizuno"
                width={112}
                height={119}
                sizes="112px"
                loading="eager"
                fetchPriority="high"
                className="h-[102px] w-24 shrink-0 rounded-[10px] object-cover md:h-[119px] md:w-28"
              />
              <div className="min-w-0">
                <h1 id="s-intro-name" className="font-[family-name:var(--font-heading)] text-[36px] leading-[1.1] font-semibold tracking-[-0.01em] text-[var(--top-ink)] md:text-[44px]">
                  Manato
                  <br />
                  Mizuno
                </h1>
                {/* 所在地と受付状況は名前の下 */}
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 type-caption">
                  <span className="whitespace-nowrap text-[var(--top-sub)]">Shizuoka, Japan</span>
                  <span className={`inline-flex items-center gap-2 font-medium whitespace-nowrap ${open ? "text-ok" : "text-ng"}`}>
                    <span aria-hidden className={`size-2 rounded-full bg-current ${open ? "status-dot" : ""}`} />
                    {open ? AVAILABILITY_LABEL.open : AVAILABILITY_LABEL.closed}
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-[19px] leading-[1.5] font-bold text-[var(--top-green)]">
              <RoleRotator />
            </p>
            <p className="mt-1 type-body text-[var(--top-sub)]">
              <span className="inline-block">Shopifyを中心に、</span>
              <span className="inline-block">新規構築・改修・運用支援。</span>
            </p>
          </section>

          {/* ---- サービス ---- */}
          <section aria-labelledby="s-services-title" className={`${CARD} lg:col-span-2`}>
            <Heading id="s-services-title" en="Services" ja="サービス" />
            <CornerLink href="/service" label="サービスの詳細を見る" />
            <ol className="mt-3 grid gap-1 md:grid-cols-3 md:gap-4">
              {SERVICES.map((s) => (
                <li key={s.id} className="flex items-center gap-4 py-2 md:flex-col md:items-stretch md:gap-2">
                  <ServiceIllustration id={s.id} sizes="(min-width: 768px) 220px, 112px" className="aspect-[10/9] h-auto w-28 shrink-0 md:w-full md:max-w-[220px] md:self-center" />
                  <div>
                    <p className="text-[18px] leading-[1.4] font-bold text-[var(--top-ink)]">{s.name}</p>
                    <p className="mt-1 text-balance type-body text-[var(--top-sub)]">
                      {/* 中黒の後ろで折り返せるように区切る（単語の途中で折り返さない） */}
                      {s.line.split(/(?<=・)/).map((part) => (
                        <span key={part} className="inline-block">
                          {part}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ---- 事例 ---- */}
          <section aria-labelledby="s-works-title" className={CARD}>
            <Heading id="s-works-title" en="Works" ja="事例" />
            <CornerLink href="/works" label="事例をすべて見る" />
            {works.length === 0 ? (
              <p className="mt-4 type-caption text-[var(--top-sub)]">事例は準備中です。</p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {works.map((w) => (
                  <li key={w._id} className="min-w-0">
                    <Link href={`/works/${w.slug}`} className="group block rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                      <span className="relative block aspect-[5/3] overflow-hidden rounded-[10px] bg-sunken">
                        {w.image && (
                          <Image src={w.image} alt="" fill sizes="(min-width: 1024px) 240px, 45vw" className="object-cover transition-[scale] duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none" />
                        )}
                      </span>
                      <span className="mt-1.5 block type-caption text-[var(--top-ink)]">{w.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ---- 記事 ---- */}
          <section aria-labelledby="s-articles-title" className={CARD}>
            <Heading id="s-articles-title" en="Blogs" ja="記事" />
            <CornerLink href="/articles" label="記事をすべて見る" />
            {articles.length === 0 ? (
              <p className="mt-4 type-caption text-[var(--top-sub)]">記事は準備中です。</p>
            ) : (
              <ul className="mt-3 divide-y divide-[var(--top-rule)]">
                {articles.map((a) => (
                  <li key={a._id}>
                    <Link href={`/articles/${a.slug}`} className="block rounded-lg py-2.5 transition-colors duration-150 hover:bg-[var(--top-green)]/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none">
                      <time className="block type-caption text-[var(--top-date)]">{a.date}</time>
                      <span className="block type-body text-[var(--top-ink)]">{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ---- ツール ---- */}
          <section aria-labelledby="s-tools-title" className={`${CARD} min-w-0`}>
            <Heading id="s-tools-title" en="Tools" ja="ツール" />
            <div className="mt-2 h-[60px] overflow-hidden">
              <ToolMarquee />
            </div>
          </section>

          {/* ---- ひとこと ---- */}
          <section aria-labelledby="s-note-title" className={CARD}>
            <Heading id="s-note-title" en="Note" ja="ひとこと" />
            <p className="mt-3 type-body text-[var(--top-sub)]">{NOTE_TEXT}</p>
          </section>

          {/* 読み終えた位置にも相談の入口を置く */}
          <div className="flex justify-center py-2 lg:col-span-2">
            <CtaButton label="相談する" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
