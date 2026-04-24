import SectionHead from "./SectionHead";
import { getWorks } from "@/lib/sanity";
import { WORKS } from "@/lib/data";

type Work = {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  year: string;
  note?: string;
};

function WorkCard({
  work,
  aspect = "4 / 3",
}: {
  work: Work;
  aspect?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* サムネイル */}
      <div
        style={{
          width: "100%",
          aspectRatio: aspect,
          background: "repeating-linear-gradient(135deg, #e8e4da 0 10px, #dfd9cd 10px 20px)",
          flexShrink: 0,
        }}
      />
      {/* テキスト */}
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
    </div>
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
        padding: "60px clamp(20px, 5vw, 56px) 120px",
        background: "var(--paper-alt)",
      }}
    >
      <SectionHead num="02" label="Works" title="Works" trailing="" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(12px, 2vw, 24px)",
        }}
      >
        {works.length >= 6 ? (
          <>
            {/* 6件レイアウト: [大][中][中] / [中][中][大] */}
            <div style={{ gridColumn: "span 2" }}>
              <WorkCard work={works[0]} aspect="3 / 2" />
            </div>
            <div style={{ gridColumn: "span 1", paddingTop: "clamp(24px, 4vw, 56px)" }}>
              <WorkCard work={works[1]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <WorkCard work={works[2]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 1", paddingTop: "clamp(12px, 2vw, 32px)" }}>
              <WorkCard work={works[3]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <WorkCard work={works[4]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 2", paddingTop: "clamp(24px, 4vw, 48px)" }}>
              <WorkCard work={works[5]} aspect="3 / 2" />
            </div>
          </>
        ) : (
          <>
            {/* 4件レイアウト: [大][中][中] / [中][大] */}
            <div style={{ gridColumn: "span 2" }}>
              <WorkCard work={works[0]} aspect="3 / 2" />
            </div>
            <div style={{ gridColumn: "span 1", paddingTop: "clamp(24px, 4vw, 56px)" }}>
              <WorkCard work={works[1]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <WorkCard work={works[2]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 1", paddingTop: "clamp(12px, 2vw, 32px)" }}>
              <WorkCard work={works[3]} aspect="4 / 3" />
            </div>
            <div style={{ gridColumn: "span 3", paddingTop: "clamp(24px, 4vw, 48px)" }} />
          </>
        )}
      </div>
    </section>
  );
}
