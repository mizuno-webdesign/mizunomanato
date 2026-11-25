import Image from "next/image";
import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";

// 事例カード（社長決定 2026-11-25）：サムネ3枚＋タイトル。タイトルは所在地（Shizuoka, Japan）と同じ
// 書体・大きさ・色（type-caption／ink-sub）にして目立たせない。
// 画像とタイトルをまとめて1つのリンクにし、それぞれの事例（/works/[slug]）へ移動する。
// 画像の alt は空（同じリンク内のタイトルがリンク名になるため、二重に読み上げない）。
// 「すべて見る」→ /works 一覧は段階4で作成（それまでは 404）。
export type WorkItem = { _id: string; title: string; slug: string; image: string | null };

export default function WorksCard({
  works,
  className = "",
}: {
  works: WorkItem[];
  className?: string;
}) {
  return (
    <section
      aria-labelledby="works-title"
      className={`relative flex min-h-[260px] flex-col overflow-hidden glass rounded-card shadow-card lg:min-h-0 ${className}`}
    >
      {/* PC はカードの高さが決まっているので中身を敷き詰める。スマホは中身の高さに合わせる */}
      <div className="flex flex-1 flex-col p-3 lg:absolute lg:inset-0">
        <FlipHeading id="works-title" en="Works" ja="事例" className="w-fit px-3 pt-3 pb-2" />
        {works.length > 0 && (
          <ul className="grid min-h-0 flex-1 grid-cols-3 grid-rows-[minmax(0,1fr)] gap-3 px-3 pb-9">
            {works.map((w) => (
              <li key={w._id} className="flex min-h-0 min-w-0 flex-col">
                <Link
                  href={`/works/${w.slug}`}
                  className="group flex min-h-0 flex-1 flex-col gap-1.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-sunken lg:aspect-auto lg:min-h-0 lg:flex-1">
                    {w.image && (
                      <Image
                        src={w.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 17vw, 33vw"
                        className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    )}
                  </span>
                  {/* スマホは2行まで（長い名前が途中で切れないように）。PC は1行 */}
                  <span className="type-caption line-clamp-2 text-ink-sub transition-colors duration-150 group-hover:text-ink lg:line-clamp-1">
                    {w.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link
        href="/works"
        aria-label="事例一覧をすべて見る"
        className="absolute right-4 bottom-3 rounded-full px-2 py-0.5 type-caption text-ink-sub hover:text-ink hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
      >
        すべて見る
      </Link>
    </section>
  );
}
