import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// タブのアイコン：相談ボタンと同じ深い緑の地に、白の「M」（社長承認 2026-11-25）。
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          background: "#095c35",
          color: "#ffffff",
          fontSize: "42px",
          lineHeight: 1,
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
