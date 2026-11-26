import Image from "next/image";
import CtaButton from "@/components/CtaButton";

// 記事の著者紹介。紹介文は TOP の自己紹介と同じ内容。
// ・既定：記事の下に置く横並び
// ・side：記事の右の列に置く形。下に相談ボタンを付ける（社長指示 2026-11-26）
export default function AuthorCard({ side = false }: { side?: boolean }) {
  return (
    <section aria-label="この記事を書いた人" className={`glass rounded-card shadow-card ${side ? "p-4" : "p-6"}`}>
      <div className={`flex gap-4 ${side ? "items-center" : "items-start"}`}>
        <Image
          src="/profile-face.webp"
          alt=""
          width={64}
          height={68}
          sizes="64px"
          className="h-[68px] w-16 shrink-0 rounded-[10px] object-cover shadow-card"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-[family-name:var(--font-heading)] text-[18px] leading-[1.3] font-semibold text-ink">Manato Mizuno</p>
          <p className="type-caption text-ink-sub">Shizuoka, Japan</p>
          {!side && <p className="type-body mt-1">Shopifyを中心に、ECサイト事業者を支援するパートナー</p>}
        </div>
      </div>
      {side && (
        <>
          <p className="type-caption mt-3 text-ink-sub">
            <span className="inline-block">Shopifyを中心に、</span>
            <span className="inline-block">ECサイト事業者を支援するパートナー</span>
          </p>
          <CtaButton className="mt-3 block w-full py-2.5! text-center text-[15px]!" />
        </>
      )}
    </section>
  );
}
