import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/home/CtaBand";
import WorkMorph from "@/components/WorkMorph";
import { formatYearMonth } from "@/lib/date";
import { client, urlFor } from "@/lib/sanity";
import { plex } from "@/lib/fontsPlex";
import { descriptionFromBody, oneLine, pageTitle } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

type Work = {
  _id: string;
  title: string;
  category?: string;
  date?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  thumbnail?: { asset: { _ref: string } };
  slug: { current: string };
};

async function getWork(slug: string): Promise<Work | null> {
  return client.fetch(
    `*[_type == "work" && slug.current == $slug][0] {
      _id, title, slug, category, date, description, seoTitle, seoDescription, thumbnail
    }`,
    { slug }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) return {};
  return pageMetadata({
    path: `/works/${work.slug.current}`,
    // Sanity の検索用の欄があれば使う。空欄なら、事例名と概要の冒頭から作る
    title: pageTitle(oneLine(work.seoTitle) || `${work.title} の制作事例`),
    description:
      oneLine(work.seoDescription) ||
      descriptionFromBody(work.description) ||
      [`${work.title} の事例`, work.category].filter(Boolean).join(" ・ "),
  });
}

// 説明文は Sanity のプレーンテキスト。改行はそのまま出し、URL だけをリンクにする。
function withLinks(text: string) {
  return text.split(/(https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/g).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm break-all text-accent underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-accent"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) notFound();

  const imgUrl = work.thumbnail?.asset
    ? urlFor(work.thumbnail).width(1600).auto("format").url()
    : null;

  return (
    <div className={`${plex.variable} flex flex-col gap-4`}>
      <article className="glass rounded-card p-6 shadow-card md:p-12">
        <div className="mx-auto w-full max-w-[880px]">
        <header>
          <p className="type-caption text-ink-sub">
            {[work.category, formatYearMonth(work.date)].filter(Boolean).join(" ・ ")}
          </p>
          <h1 className="mt-2 type-display break-words text-ink">{work.title}</h1>
        </header>

        {imgUrl && (
          <WorkMorph id={work.slug.current} leaveTo="/works" className="relative mt-6 block aspect-[16/10] overflow-hidden rounded-inner bg-sunken">
            <Image
              src={imgUrl}
              alt={`${work.title} のサイト画面`}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 928px) 880px, 100vw"
              className="object-cover object-top"
            />
          </WorkMorph>
        )}

        {work.description && (
          <div className="mt-10 text-[15px] leading-[2] break-words whitespace-pre-wrap text-ink">
            {withLinks(work.description)}
          </div>
        )}

        <p className="mt-12 text-center">
          <Link
            href="/works"
            className="inline-block rounded-full px-4 py-3 type-caption text-ink-sub hover:text-ink hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
          >
            事例一覧へ
          </Link>
        </p>
        </div>
      </article>

      <CtaBand />
    </div>
  );
}
