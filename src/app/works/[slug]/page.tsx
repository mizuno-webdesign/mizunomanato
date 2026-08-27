import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";
import FooterSection from "@/components/FooterSection";
import SiteHeader from "@/components/SiteHeader";

type Work = {
  _id: string;
  title: string;
  category: string;
  year: string;
  note?: string;
  description?: string;
  thumbnail?: { asset: { _ref: string } };
  slug: { current: string };
};

async function getWork(slug: string): Promise<Work | null> {
  return client.fetch(
    `*[_type == "work" && slug.current == $slug][0] {
      _id, title, slug, category, year, note, description, thumbnail
    }`,
    { slug }
  );
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) notFound();

  const imgUrl = work.thumbnail
    ? urlFor(work.thumbnail).width(1600).auto("format").url()
    : null;

  return (
    <>
    <main style={{ background: "var(--paper)", minHeight: "100svh" }}>
      <SiteHeader basePath="/" />

      {/* 戻るリンク */}
      <div style={{ padding: "32px clamp(20px, 5vw, 56px) 0" }}>
        <Link
          href="/#works"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
            opacity: 0.55,
          }}
        >
          ← Works
        </Link>
      </div>

      {/* サムネイル */}
      {imgUrl && (
        <div style={{ marginTop: "40px", width: "100%", aspectRatio: "16 / 7", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={work.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* 本文 */}
      <div style={{ padding: "64px clamp(20px, 5vw, 56px) 120px", maxWidth: "800px" }}>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.55,
            marginBottom: "16px",
          }}
        >
          {work.category} · {work.year}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display), 'Times New Roman', serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.25,
            marginBottom: "12px",
          }}
        >
          {work.title}
        </h1>
        {work.note && (
          <div style={{ fontSize: "13px", opacity: 0.6, marginBottom: "48px" }}>
            {work.note}
          </div>
        )}
        {work.description && (
          <div
            style={{
              fontSize: "15px",
              lineHeight: 2.1,
              opacity: 0.85,
              whiteSpace: "pre-wrap",
            }}
          >
            {work.description}
          </div>
        )}
      </div>
    </main>
    <hr style={{ border: "none", borderTop: "1px solid var(--ink-soft)", margin: "0 clamp(20px, 5vw, 56px)" }} />
    <FooterSection />
    </>
  );
}
