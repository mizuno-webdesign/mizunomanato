// 比較版用の図（線と面だけの SVG）。サービス3本の中身を示す装飾なので、読み上げからは外す。
// 色はサイトの緑（accent／cta）と無彩色だけを使う。

const ACCENT = "var(--color-accent)";
const LINE = "var(--color-line)";
const SOFT = "rgb(16 160 106 / 0.16)";

// 3つに共通する「ブラウザの窓」
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect x="8" y="8" width="184" height="124" rx="12" fill="var(--color-solid)" fillOpacity="0.85" stroke={LINE} />
      <path d="M8 30h184" stroke={LINE} />
      {[22, 32, 42].map((x) => (
        <circle key={x} cx={x} cy="19" r="2.6" fill={LINE} />
      ))}
      {children}
    </>
  );
}

const DIAGRAMS: Record<string, React.ReactNode> = {
  // 新規構築：商品が並ぶストア
  build: (
    <Frame>
      <rect x="22" y="42" width="156" height="30" rx="6" fill={SOFT} />
      <path d="M34 53h56M34 62h34" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
      {[22, 76, 130].map((x) => (
        <g key={x}>
          <rect x={x} y="80" width="48" height="30" rx="5" fill="var(--color-canvas)" stroke={LINE} />
          <path d={`M${x + 4} 118h30`} stroke={LINE} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  ),
  // 改修：稼働中の画面の一部を選んで手を入れる
  improve: (
    <Frame>
      <path d="M22 46h54M22 58h40" stroke={LINE} strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="70" width="60" height="48" rx="5" fill="var(--color-canvas)" stroke={LINE} />
      <rect x="98" y="46" width="76" height="56" rx="4" fill={SOFT} stroke={ACCENT} strokeWidth="1.75" strokeDasharray="6 4" />
      {[
        [98, 46],
        [174, 46],
        [98, 102],
        [174, 102],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" rx="1.5" fill="var(--color-solid)" stroke={ACCENT} strokeWidth="1.75" />
      ))}
      <path d="m146 82 24 10-10 3.500-4 10.500z" fill={ACCENT} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </Frame>
  ),
  // 運用支援：数字を見て改善する
  operate: (
    <Frame>
      {[
        [26, 24],
        [48, 34],
        [70, 30],
        [92, 48],
      ].map(([x, h]) => (
        <rect key={x} x={x} y={118 - h} width="14" height={h} rx="3" fill={SOFT} />
      ))}
      <path d="M33 82 55 72l22 5 22-29" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="99" cy="48" r="4" fill={ACCENT} />
      {[52, 76, 100].map((y, i) => (
        <g key={y}>
          <rect x="124" y={y - 7} width="14" height="14" rx="4" fill={i < 2 ? ACCENT : "var(--color-solid)"} stroke={i < 2 ? ACCENT : LINE} />
          {i < 2 && (
            <path d={`m127.500 ${y} 2.500 2.500 5-5`} fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <path d={`M146 ${y}h30`} stroke={LINE} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  ),
};

export default function ServiceDiagram({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 140" aria-hidden className={className}>
      {DIAGRAMS[id]}
    </svg>
  );
}
