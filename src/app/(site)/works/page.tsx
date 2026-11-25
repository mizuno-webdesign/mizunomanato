import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";
import { getWorks, urlFor } from "@/lib/sanity";
import { pageMetadata } from "@/lib/site";

// Sanity の事例を常に最新で表示する（記事一覧と同じ理由）。
export const dynamic = "force-dynamic";

type Work = {
  _id: string;
  title: string;
  slug?: { current?: string };
  category?: string;
  year?: string;
  note?: string;
  thumbnail?: { asset: { _ref: string } };
};

const DESCRIPTION = "EC構築の事例一覧です。";

export const metadata: Metadata = pageMetadata({
  path: "/works",
  title: "Works — Manato Mizuno",
  description: DESCRIPTION,
});

export default async function WorksPage() {
  let works: Work[] = [];
  try {
    works = await getWorks();
  } catch {
    works = [];
  }
  works = works.filter((w) => w.slug?.current);

  return (
    <section
      aria-labelledby="works-title"
      className="mx-auto max-w-[1104px] glass rounded-card p-3 shadow-card md:p-6"
    >
      <FlipHeading as="h1" id="works-title" en="Works" ja="事例" className="px-3 pt-3 pb-4" />
      {works.length === 0 ? (
        <p className="type-body px-3 pb-3 text-ink-sub">事例は準備中です。</p>
      ) : (
        <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <li key={w._id}>
              <Link
                href={`/works/${w.slug!.current}`}
                className="group flex h-full flex-col gap-3 rounded-2xl p-3 transition-colors duration-150 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent motion-reduce:transition-none"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-sunken">
                  {w.thumbnail && (
                    <Image
                      src={urlFor(w.thumbnail).width(1200).auto("format").url()}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 340px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top transition-[scale] duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  )}
                </span>
                <span className="flex flex-col gap-1">
                  <h2 className="type-heading text-ink">{w.title}</h2>
                  <span className="type-caption text-ink-sub">
                    {[w.category, w.note, w.year].filter(Boolean).join(" ・ ")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
