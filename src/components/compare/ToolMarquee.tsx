"use client";

import Image from "next/image";
import { useState } from "react";
import MarqueeViewport from "@/components/home/MarqueeViewport";

// 流れるツールの帯。アイコンだけを流し、クリックした場所に名前を出す（もう一度クリックで消える）。
// ホバー中は今の TOP と同じく、ゆっくりになる（MarqueeViewport）。
// 読み上げには静的な一覧で名前を渡し、流れる帯は隠す（帯の中のボタンはキーボードの移動先にしない）。
const ITEMS = [
  { name: "Shopify", icon: "/icons/shopify.svg" },
  { name: "カラーミー", icon: "/icons/colorme.svg" },
  { name: "Framer", icon: "/icons/framer.svg" },
  { name: "Claude", icon: "/icons/claude.svg" },
  { name: "Google Analytics 4", icon: "/icons/ga4.svg" },
];
const SET = [...ITEMS, ...ITEMS]; // 1セットがカード幅より長くなるように2回並べる

const u = (n: number) => `calc(${n} * var(--u))`;

export default function ToolMarquee() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      <ul className="sr-only">
        {ITEMS.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
      <MarqueeViewport className="marquee size-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {/* 1セット：72px × 10個 ＝ 720px を、約15px/秒で流す（48秒） */}
        <div className="marquee-track flex w-max" style={{ "--marquee-dur": "48s" } as React.CSSProperties}>
          {[0, 1].flatMap((copy) =>
            SET.map((t, i) => {
              const key = `${copy}-${i}`;
              const open = openKey === key;
              return (
                <span key={key} className="relative flex shrink-0 flex-col items-center" style={{ width: u(72), height: u(62) }}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setOpenKey(open ? null : key)}
                    className="grid cursor-pointer place-items-center bg-white transition-[background-color] duration-150 hover:bg-[#eef6f1] motion-reduce:transition-none"
                    style={{ width: u(42), height: u(42), borderRadius: u(12) }}
                  >
                    <Image src={t.icon} alt="" width={24} height={24} unoptimized style={{ width: u(23), height: u(23), borderRadius: u(5) }} />
                  </button>
                  {open && (
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[#4a4d57]" style={{ top: u(45), fontSize: u(13), lineHeight: 1.3 }}>
                      {t.name}
                    </span>
                  )}
                </span>
              );
            }),
          )}
        </div>
      </MarqueeViewport>
    </>
  );
}
