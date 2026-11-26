import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { headingId } from "@/lib/toc";

// 記事本文（社長承認 2026-11-25）：TOP と同じ書体と文字サイズの段階（20／17／15）を使い、行間は広めにする。
// 見出しの scroll-mt は、目次から移動したときに上部の固定ナビへ隠れないための余白。
// 余白は「上を広く、下を狭く」。先頭の要素だけは上の余白を消す（呼び出し側の [&>*:first-child]:mt-0）。
const TEXT = "text-[15px] leading-[2] text-ink";

const components: PortableTextComponents = {
  block: {
    h2: ({ value, children }) => (
      <h2
        id={headingId(value)}
        className="mt-14 mb-4 scroll-mt-24 text-[20px] leading-[1.5] font-semibold text-heading"
      >
        {children}
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3 id={headingId(value)} className="mt-10 mb-3 scroll-mt-24 type-heading text-heading">
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className={`mb-6 ${TEXT}`}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-line pl-5 text-[15px] leading-[2] text-body-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={`mb-6 list-disc pl-6 ${TEXT}`}>{children}</ul>,
    number: ({ children }) => <ol className={`mb-6 list-decimal pl-6 ${TEXT}`}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="rounded-sm break-words text-accent underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-accent"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imgUrl = urlFor(value).width(1440).auto("format").url();
      return (
        // 画像の縦横比がデータから分からないため、next/image ではなく img を使う
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={value.alt ?? ""}
          loading="lazy"
          className="my-8 block h-auto w-full rounded-inner"
        />
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
