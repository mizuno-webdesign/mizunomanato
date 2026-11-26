import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// タブのアイコン：ロゴの緑の地に、白いロゴ（社長提供の画像 public/logo/logo-white.png。2026-11-26 に差し替え）。
// ロゴは横長（600×252）なので、地は正方形にして中央に置く。緑の地にするのは、明るいタブでも暗いタブでも見えるように。
export default async function Icon() {
  const logo = await readFile(join(process.cwd(), "public/logo/logo-white.png"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "14px",
          background: "#035431",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} width={56} height={24} alt="" />
      </div>
    ),
    { ...size },
  );
}
