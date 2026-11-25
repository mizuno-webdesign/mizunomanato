import Image from "next/image";

// 記事の下に置く短い著者紹介（社長承認 2026-11-25）。紹介文は TOP の自己紹介と同じ内容。
export default function AuthorCard({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="この記事を書いた人"
      className={`flex items-start gap-4 glass rounded-card p-6 shadow-card ${className}`}
    >
      <Image
        src="/portrait.webp"
        alt=""
        width={64}
        height={64}
        sizes="64px"
        className="size-16 shrink-0 rounded-full object-cover shadow-card"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="type-heading text-ink">Manato Mizuno</p>
        <p className="type-caption text-ink-sub">Shizuoka, Japan</p>
        <p className="type-body mt-1">
          Shopify を中心に、ECサイト専門家として新規構築・改修・運用支援を行っています。
        </p>
      </div>
    </section>
  );
}
