"use client";

import { useEffect, useState } from "react";

// 【調整用の道具。値が決まったら globals.css に反映して、このファイルと layout.tsx の呼び出しを消す】
// 開発サーバーでだけ出る、暗い表示の背景を調整するパネル。値はブラウザに保存し、CSS の変数を上書きする。
// 初期値は、今の globals.css と同じ見た目になる値。
const KEY = "dark-tuner";

const FIELDS = [
  { key: "strength", label: "グラデの濃さ", min: 0, max: 100, unit: "%" },
  { key: "light", label: "明るみの色（大きいほど白い）", min: 60, max: 255, unit: "" },
  { key: "spread", label: "明るみの広さ", min: 40, max: 260, unit: "%" },
  { key: "fade", label: "ぼけ足（大きいほどゆるやか）", min: 30, max: 100, unit: "%" },
  { key: "base", label: "地の明るさ（小さいほど黒い）", min: 0, max: 40, unit: "" },
  { key: "see", label: "カードの透け具合", min: 0, max: 90, unit: "%" },
  { key: "noise", label: "ノイズの濃さ", min: 0, max: 30, unit: "%" },
] as const;

type Values = Record<(typeof FIELDS)[number]["key"], number>;
const DEFAULTS: Values = { strength: 34, light: 145, spread: 100, fade: 62, base: 18, see: 0, noise: 10 };

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const rgb = (r: number, g: number, b: number, a = 1) => `rgb(${clamp(r)} ${clamp(g)} ${clamp(b)} / ${Math.round(a * 1000) / 1000})`;

function noiseTile(alpha: number) {
  if (alpha <= 0) return "none";
  const row = "0.6 0.6 0.6 0 -0.8  ";
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
    "<filter id='n' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>" +
    "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>" +
    `<feColorMatrix values='${row}${row}${row}0 0 0 0 ${alpha}'/>` +
    "</filter><rect width='160' height='160' filter='url(#n)'/></svg>";
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function colors(v: Values) {
  const a = v.strength / 100;
  const g = v.light;
  return {
    bloom1: rgb(g - 5, g + 7, g + 5, a),
    bloom2: rgb(g - 35, g - 27, g - 19, a * 0.88),
    bloom3: rgb(g - 20, g - 9, g - 13, a * 0.765),
    canvas: rgb(v.base - 2, v.base + 1, v.base),
  };
}

function css(v: Values) {
  const c = colors(v);
  const s = v.spread / 100;
  const ellipse = (w: number, h: number, at: string, name: string) => `radial-gradient(${w * s}rem ${h * s}rem at ${at}, var(${name}), transparent ${v.fade}%)`;
  const solid = 1 - v.see / 100;
  return `
:root:root[data-theme="dark"] {
  --bloom-1: ${c.bloom1};
  --bloom-2: ${c.bloom2};
  --bloom-3: ${c.bloom3};
  --color-canvas: ${c.canvas};
  --top-card: ${rgb(24, 28, 26, solid)};
  --glass-bg: ${rgb(32, 38, 35, 0.55 * solid)};
  --noise: ${noiseTile(v.noise / 100)};
}
:root:root[data-theme="dark"] body {
  background-image: var(--noise), ${ellipse(60, 36, "8% -8%", "--bloom-1")}, ${ellipse(52, 34, "96% 18%", "--bloom-2")}, ${ellipse(56, 34, "42% 108%", "--bloom-3")};
}`;
}

export default function DarkTuner() {
  const [values, setValues] = useState<Values | null>(null);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState("");

  // 保存した値を読み込む（描画のあとで読むので、サーバーの出力とずれない）
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      let saved: Partial<Values> = {};
      try {
        saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      } catch {}
      setValues({ ...DEFAULTS, ...saved });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!values) return;
    const style = document.createElement("style");
    style.textContent = css(values);
    document.head.appendChild(style);
    return () => style.remove();
  }, [values]);

  if (!values) return null;

  const save = (next: Values) => {
    setValues(next);
    setCopied("");
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };
  const summary = FIELDS.map((f) => `${f.label.replace(/（.*）/, "")} ${values[f.key]}`).join(" / ");
  const toDark = () => {
    const button = [...document.querySelectorAll<HTMLButtonElement>('button[aria-label="ダークモード"]')].find((b) => b.getClientRects().length);
    if (button?.getAttribute("aria-pressed") === "false") button.click();
  };
  const box = "fixed right-3 bottom-3 z-[100] border border-line bg-surface text-ink shadow-card";

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`${box} cursor-pointer rounded-full px-4 py-2 text-[12px]`}>
        背景の調整
      </button>
    );
  }
  return (
    <div role="group" aria-label="暗い表示の背景の調整（開発中のみ）" className={`${box} w-[272px] rounded-2xl p-3 text-[12px] leading-[1.5]`}>
      <div className="flex items-center justify-between gap-2">
        <strong>暗い背景の調整</strong>
        <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded px-2 text-ink-sub">
          閉じる
        </button>
      </div>
      <button type="button" onClick={toDark} className="only-light mt-2 w-full cursor-pointer rounded-lg border border-line px-2 py-1">
        暗い表示に切り替える（調整は暗い表示だけに効きます）
      </button>
      {FIELDS.map((f) => (
        <label key={f.key} className="mt-2 block">
          <span className="flex justify-between gap-2">
            <span>{f.label}</span>
            <span className="tabular-nums">
              {values[f.key]}
              {f.unit}
            </span>
          </span>
          <input
            type="range"
            name={f.key}
            min={f.min}
            max={f.max}
            value={values[f.key]}
            onChange={(e) => save({ ...values, [f.key]: Number(e.target.value) })}
            className="w-full accent-select"
          />
        </label>
      ))}
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => save(DEFAULTS)} className="flex-1 cursor-pointer rounded-lg border border-line px-2 py-1">
          元に戻す
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(summary);
              setCopied("コピーしました。そのまま貼り付けて送ってください。");
            } catch {
              setCopied("コピーできませんでした。下の文を選んで送ってください。");
            }
          }}
          className="flex-1 cursor-pointer rounded-lg bg-cta px-2 py-1 font-semibold text-white"
        >
          値をコピー
        </button>
      </div>
      {copied && <p className="mt-1">{copied}</p>}
      <p className="mt-1 text-ink-sub select-all">{summary}</p>
    </div>
  );
}
