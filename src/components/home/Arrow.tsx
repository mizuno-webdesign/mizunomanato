// TOP の寸法の単位。PC 表示では「画面幅 ÷ 1487」、縦並びの表示では 1px（親の --u で決める）。
export const u = (n: number) => `calc(${n} * var(--u))`;

// リンクの右上向きの矢印（↗）と、その動き（見本の1番。社長が選択 2026-11-26）。親のリンクに group/arrow をつけて使う。
// 乗せる（キーボードで選ぶ）と矢印の向きに斜めに3px進み、離すと戻る。180ms。背景の色づきや下線は使わない。
// 動きを減らす設定では動かさず、色の変化だけにする。
const MOVE =
  "inline-flex transition-[translate] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/arrow:translate-x-[calc(3*var(--u))] group-hover/arrow:-translate-y-[calc(3*var(--u))] group-focus-visible/arrow:translate-x-[calc(3*var(--u))] group-focus-visible/arrow:-translate-y-[calc(3*var(--u))] motion-reduce:transition-none motion-reduce:group-hover/arrow:translate-none motion-reduce:group-focus-visible/arrow:translate-none";
const STILL_INK = "motion-reduce:group-hover/arrow:text-[var(--top-ink)] motion-reduce:group-focus-visible/arrow:text-[var(--top-ink)]";

export function MovingArrow({ s }: { s: number }) {
  return (
    // 色は外側の span に持たせ、動きを減らす設定のときに内側で上書きできるようにする
    <span aria-hidden className="flex text-[var(--top-green)]">
      <span className={`${MOVE} ${STILL_INK}`}>
        <svg
          viewBox={`0 0 ${s} ${s}`}
          style={{ width: u(s), height: u(s), flexShrink: 0 }}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={`M1.5 ${s - 1.5} ${s - 1.5} 1.5M${s * 0.28} 1.5H${s - 1.5}V${s * 0.72}`} />
        </svg>
      </span>
    </span>
  );
}
