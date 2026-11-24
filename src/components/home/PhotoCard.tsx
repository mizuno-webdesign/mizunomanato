import Image from "next/image";

// プロフィール写真（現行の public/portrait.png のまま。社長決定 2026-11-24）。
export default function PhotoCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative min-h-[200px] overflow-hidden rounded-card bg-sunken ${className}`}
    >
      <Image
        src="/portrait.png"
        alt="Manato Mizuno"
        fill
        sizes="(min-width: 1024px) 200px, 50vw"
        className="object-cover"
      />
    </div>
  );
}
