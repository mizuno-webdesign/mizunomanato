import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { headingId } from "@/lib/toc";

// 記事本文の見出し（H1/H2/H3）は和文と半角数字が混在する。
// var(--font-display)（Cormorant Garamond）は和文グリフを持たないため、
// 和文部分がブラウザ標準フォールバックのゴシック体になり字面がちぐはぐになる。
// var(--font-display-jp)（Shippori Mincho）は和文・欧文とも対応した明朝体で、
// Cormorantに近い細身のトーンを保ちつつ和文・数字を同一フォントで統一できる。
const HEADING_FONT_FAMILY =
  "var(--font-display-jp), var(--font-display), 'Times New Roman', serif";

const components: PortableTextComponents = {
  block: {
    h2: ({ value, children }) => (
      <h2
        id={headingId(value)}
        style={{
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 400,
          lineHeight: 1.35,
          marginTop: "64px",
          marginBottom: "20px",
          scrollMarginTop: "32px",
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3
        id={headingId(value)}
        style={{
          fontFamily: HEADING_FONT_FAMILY,
          fontSize: "clamp(19px, 2.2vw, 23px)",
          fontWeight: 400,
          lineHeight: 1.4,
          marginTop: "44px",
          marginBottom: "16px",
          scrollMarginTop: "32px",
        }}
      >
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p style={{ margin: "0 0 24px", fontSize: "15px", lineHeight: 2.1, opacity: 0.85 }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          margin: "32px 0",
          padding: "4px 0 4px 24px",
          borderLeft: "2px solid var(--ink-soft)",
          fontSize: "15px",
          lineHeight: 2,
          opacity: 0.75,
          fontStyle: "italic",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: "0 0 24px", paddingLeft: "1.4em", fontSize: "15px", lineHeight: 2.1, opacity: 0.85 }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{ margin: "0 0 24px", paddingLeft: "1.4em", fontSize: "15px", lineHeight: 2.1, opacity: 0.85 }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: "8px" }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: "8px" }}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imgUrl = urlFor(value).width(1200).auto("format").url();
      return (
        <div style={{ margin: "40px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={value.alt ?? ""}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      );
    },
  },
};

export default function ArticleBody({
  body,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
}) {
  return <PortableText value={body} components={components} />;
}
