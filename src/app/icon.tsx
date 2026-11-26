import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// タブのアイコン：背景なしの緑のロゴ（社長提供の画像 public/logo/logo-green.png）。
// 暗いタブでは見えにくいことを比較画像で確認したうえで、社長がこの形を選んだ（2026-11-26）。
// ロゴは横長（600×252）なので、正方形の中央に横幅いっぱいで置き、上下は透明にする。
export default async function Icon() {
  const logo = await readFile(join(process.cwd(), "public/logo/logo-green.png"), "base64");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} width={64} height={27} alt="" />
      </div>
    ),
    { ...size },
  );
}
