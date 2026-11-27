"use client";

import { useEffect } from "react";

// 分割された日本語フォントの定義を、画面が出たあとに読み込む（src/lib/fontsPlex.ts）。
export default function PlexFallback() {
  useEffect(() => {
    import("@/lib/fontsPlex").catch(() => {});
  }, []);
  return null;
}
