import SectionHead from "./SectionHead";
import { getWorks, urlFor } from "@/lib/sanity";
import { WORKS } from "@/lib/data";

type Work = {
  _id?: string;
  title: string;
  category: string;
  year: string;
  note?: string;
  thumbnail?: { asset: { _ref: string } };
  slug?: { current: string };
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1200&q=80", // 観葉植物・明るい窓辺
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",  // 英語書籍の棚
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",  // デスク・文房具
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",  // コーヒーと本
  "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?w=800&q=80",  // 植物クローズアップ
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80", // 本・読書
];

function WorkCard({
  work,
  aspect = "4 / 3",
  index = 0,
}: {
  work?: Work;
  aspect?: string;
  index?: number;
}) {
  const placeholderUrl = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  const imgUrl = work?.thumbnail
    ? urlFor(work.thumbnail).width(1200).auto("format").url()
    : placeholderUrl;

  const href = work?.slug?.current ? `/works/${work.slug.current}` : null;
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <a href={href} style={{ display: "flex", flexDirection: "column", height: "100%", textDecoration: "none", color: "inherit" }}>
        {children}
      </a>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>{children}</div>
    );

  return (
    <Wrapper>
      <div
        style={{
          width: "100%",
          aspectRatio: aspect,
          flexShrink: 0,
          overflow: "hidden",
          background: "#ddd",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={work?.title ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      {work && (
        <div style={{ paddingTop: "16px", flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginBottom: "8px",
            }}
          >
            <span>{work.category}</span>
            <span>{work.year}</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "20px",
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {work.title}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "6px" }}>
            {work.note}
          </div>
        </div>
      )}
    </Wrapper>
  );
}

export default async function WorksSection() {
  let works: Work[] = [];
  try {
    const fetched = await getWorks();
    works = fetched && fetched.length > 0 ? fetched : WORKS;
  } catch {
    works = WORKS;
  }

  return (
    <section
      id="works"
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 5vw, 56px) 120px",
        background: "var(--paper-alt)",
      }}
    >
      <SectionHead num="02" label="Works" title="Works" trailing="" />

      <div
        className="works-bento"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(12px, 2vw, 24px)",
        }}
      >
        {/* 1枚目: 大（2列） */}
        <div className="works-sp-full" style={{ gridColumn: "span 2" }}>
          <WorkCard work={works[0]} aspect="3 / 2" index={0} />
        </div>
        {/* 2枚目 */}
        <div className="works-sp-right" style={{ gridColumn: "span 1", paddingTop: "clamp(24px, 4vw, 56px)" }}>
          <WorkCard work={works[1]} aspect="4 / 3" index={1} />
        </div>
        {/* 3枚目 */}
        <div className="works-sp-left" style={{ gridColumn: "span 1" }}>
          <WorkCard work={works[2]} aspect="4 / 3" index={2} />
        </div>
      </div>

      {/* もっと見るボタン（SP時のみ表示） */}
      <div className="works-more" style={{ marginTop: "40px", textAlign: "center" }}>
        <a
          href="#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-ui)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.65,
            textDecoration: "none",
            color: "var(--ink)",
            borderBottom: "1px solid var(--ink-soft)",
            paddingBottom: "4px",
          }}
        >
          もっと見る →
        </a>
      </div>
    </section>
  );
}
