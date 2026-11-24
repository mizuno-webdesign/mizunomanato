import Image from "next/image";

// プロフィール写真（社長が差し替え 2026-11-24：public/portrait.webp、2000×2000）。
export default function PhotoCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-card bg-sunken lg:aspect-auto lg:min-h-[200px] ${className}`}
    >
      <Image
        src="/portrait.webp"
        alt="Manato Mizuno"
        fill
        sizes="(min-width: 1024px) 200px, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
