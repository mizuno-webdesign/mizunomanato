"use client";

import Image from "next/image";
import { useState } from "react";
import { u } from "@/components/home/Arrow";
import MarqueeViewport from "@/components/home/MarqueeViewport";

// 流れるツールの帯（見出しの右に横一列）。アイコンだけを流し、クリックした場所に名前を出す（もう一度クリックで消える）。
// ホバー中は今の TOP と同じく、ゆっくりになる（MarqueeViewport）。
// 読み上げには静的な一覧で名前を渡し、流れる帯は隠す（帯の中のボタンはキーボードの移動先にしない）。
const ITEMS = [
  { name: "Shopify", icon: "/icons/shopify.svg" },
  { name: "カラーミー", icon: "/icons/colorme.svg" },
  { name: "Framer", icon: "/icons/framer.svg" },
  { name: "Claude", icon: "/icons/claude.svg" },
  { name: "Google Analytics 4", icon: "/icons/ga4.svg" },
];
// 1セットが表示の幅（最大で約1000px）より長くないと、ループの継ぎ目に空きが出るので、4回並べる
const SET = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

export default function ToolMarquee() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      <ul className="sr-only">
        {ITEMS.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
      <MarqueeViewport className="marquee size-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].flatMap((copy) =>
            SET.map((t, i) => {
              const key = `${copy}-${i}`;
              const open = openKey === key;
              return (
                <span key={key} className="relative flex shrink-0 flex-col items-center" style={{ width: u(60), height: u(60) }}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setOpenKey(open ? null : key)}
                    className="grid cursor-pointer place-items-center bg-[var(--top-tile)] transition-[background-color] duration-150 hover:bg-[var(--top-tile-hover)] motion-reduce:transition-none"
                    style={{ width: u(40), height: u(40), borderRadius: u(12) }}
                  >
                    <Image src={t.icon} alt="" width={24} height={24} unoptimized style={{ width: u(22), height: u(22), borderRadius: u(5) }} />
                  </button>
                  {open && (
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[var(--top-sub)]" style={{ top: u(44), fontSize: u(11), lineHeight: 1.3 }}>
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
