// サービスのアイコン。背景は、ページ背景のにじみ（緑系）に合わせた淡いグラデ。線も同系の濃い緑。
export default function ServiceIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(16_160_106/0.20),rgb(124_194_78/0.12))] text-ok"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}
