import { ImageResponse } from "next/og";
import { SITE_TITLE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// SNS で共有されたときの画像：サイトと同じ淡い緑の背景に、名前と1行（社長承認 2026-11-25）。
// 書体はサイトと同じ IBM Plex Sans JP を Google Fonts から取得する。
// （取得できないときは、標準の書体で描く。画像の生成自体は失敗させない）
async function loadFont(weight: 400 | 700) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@${weight}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return { name: "Plex", data, weight, style: "normal" as const };
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const fonts = (await Promise.all([loadFont(400), loadFont(700)])).filter((f) => f !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "56px",
          backgroundColor: "#f2f2f7",
          backgroundImage:
            "linear-gradient(135deg, #d3eee2 0%, #f2f2f7 45%, #e4f1d9 75%, #d2efea 100%)",
          fontFamily: "Plex",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
            borderRadius: "40px",
            backgroundColor: "rgba(255,255,255,0.66)",
            border: "2px solid rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ display: "flex", fontSize: "84px", fontWeight: 700, color: "#1c1c1e" }}>
            Manato Mizuno
          </div>
          <div style={{ display: "flex", marginTop: "28px", fontSize: "40px", color: "#2c2c30" }}>
            Shopify の構築・改修・運用支援
          </div>
          <div style={{ display: "flex", marginTop: "56px", fontSize: "26px", color: "#55555c" }}>
            Shizuoka, Japan ・ mizunomanato.com
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) },
  );
}
