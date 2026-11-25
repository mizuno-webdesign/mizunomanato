import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/home/CtaBand";
import { client, urlFor } from "@/lib/sanity";
import { pageMetadata } from "@/lib/site";

type Work = {
  _id: string;
  title: string;
  category?: string;
  year?: string;
  note?: string;
  description?: string;
  thumbnail?: { asset: { _ref: string } };
  slug: { current: string };
};

async function getWork(slug: string): Promise<Work | null> {
  return client.fetch(
    `*[_type == "work" && slug.current == $slug][0] {
      _id, title, slug, category, year, note, description, thumbnail
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
    title: `${work.title} — Manato Mizuno`,
    description: [`${work.title} の事例`, work.category, work.note].filter(Boolean).join(" ・ "),
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
        className="rounded-sm break-all text-accent underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-accent"
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

  const imgUrl = work.thumbnail
    ? urlFor(work.thumbnail).width(1600).auto("format").url()
    : null;

  return (
    <div className="mx-auto flex max-w-[816px] flex-col gap-4">
      <article className="glass rounded-card p-6 shadow-card md:p-12">
        <header>
          <p className="type-caption text-ink-sub">
            {[work.category, work.note, work.year].filter(Boolean).join(" ・ ")}
          </p>
          <h1 className="mt-2 type-display break-words text-ink">{work.title}</h1>
        </header>

        {imgUrl && (
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-inner bg-sunken">
            <Image
              src={imgUrl}
              alt={`${work.title} のサイト画面`}
              fill
              priority
              sizes="(min-width: 848px) 720px, 100vw"
              className="object-cover object-top"
            />
          </div>
        )}

        {work.description && (
          <div className="mt-10 text-[15px] leading-[2] break-words whitespace-pre-wrap text-ink">
            {withLinks(work.description)}
          </div>
        )}

        <p className="mt-12 text-center">
          <Link
            href="/works"
            className="inline-block rounded-full px-4 py-2 type-caption text-ink-sub hover:text-ink hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
          >
            事例一覧へ
          </Link>
        </p>
      </article>

      <CtaBand />
    </div>
  );
}
