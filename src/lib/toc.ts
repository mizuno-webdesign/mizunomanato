// Portable Text の body から見出し（H2/H3）を抽出し、目次（TOC）を自動生成するユーティリティ。
// 見出しにアンカーとして付与する id もここで生成し、本文レンダリング側（ArticleBody）と共有する。

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortableTextBlock = any;

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function blockText(block: PortableTextBlock): string {
  if (!Array.isArray(block?.children)) return "";
  return block.children
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((child: any) => child?.text ?? "")
    .join("")
    .trim();
}

// 見出しブロックの _key を id として使う。Sanity が各ブロックに割り当てる一意な文字列なので、
// 日本語見出しのスラッグ化や重複衝突を気にせず、安定したアンカーIDとして使える。
export function headingId(block: PortableTextBlock): string {
  return `heading-${block._key}`;
}

export function extractToc(body: PortableTextBlock[] | undefined): TocItem[] {
  if (!Array.isArray(body)) return [];

  return body
    .filter(
      (block) =>
        block?._type === "block" && (block.style === "h2" || block.style === "h3")
    )
    .map((block) => ({
      id: headingId(block),
      text: blockText(block),
      level: (block.style === "h2" ? 2 : 3) as 2 | 3,
    }))
    .filter((item) => item.text.length > 0);
}
