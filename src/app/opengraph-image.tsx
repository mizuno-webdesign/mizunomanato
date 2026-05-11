import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Manato Mizuno — EC構築・運用パートナー";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#1c241b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          fontFamily: "Cormorant Garamond",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(235,231,218,0.22)",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              color: "#ebe7da",
              fontSize: "22px",
              letterSpacing: "0.14em",
              fontFamily: "Cormorant Garamond",
            }}
          >
            Manato Mizuno
          </div>
          <div
            style={{
              color: "rgba(235,231,218,0.55)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            e-commerce partner
          </div>
        </div>

        {/* メインタイポグラフィ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 0.95,
          }}
        >
          <div
            style={{
              color: "#ebe7da",
              fontSize: "136px",
              fontFamily: "Cormorant Garamond",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Build.
          </div>
          <div
            style={{
              color: "rgba(235,231,218,0.85)",
              fontSize: "136px",
              fontFamily: "Cormorant Garamond",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              marginLeft: "80px",
            }}
          >
            Rethink.
          </div>
          <div
            style={{
              color: "#ebe7da",
              fontSize: "136px",
              fontFamily: "Cormorant Garamond",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              marginLeft: "160px",
            }}
          >
            Operate.
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              color: "rgba(235,231,218,0.65)",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            ECサイト運営の課題を紐解き、前進させるパートナー。
          </div>
          <div
            style={{
              color: "rgba(235,231,218,0.4)",
              fontSize: "11px",
              letterSpacing: "0.08em",
            }}
          >
            mizunomanato.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
