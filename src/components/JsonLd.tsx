// 構造化データ（JSON-LD）。「<」は、文字列がタグとして解釈されないように置き換える
// （docs: 01-app/02-guides/json-ld.md）。
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
