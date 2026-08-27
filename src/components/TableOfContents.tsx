import type { TocItem } from "@/lib/toc";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="目次"
      style={{
        margin: "48px 0 56px",
        padding: "24px clamp(20px, 4vw, 32px)",
        border: "1px solid var(--ink-soft)",
      }}
    >
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
        目次
      </div>
      <ol style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none" }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              marginLeft: item.level === 3 ? "1.4em" : 0,
            }}
          >
            <a
              href={`#${item.id}`}
              style={{
                fontSize: item.level === 3 ? "13px" : "14px",
                lineHeight: 1.6,
                color: "var(--ink)",
                opacity: item.level === 3 ? 0.65 : 0.85,
                textDecoration: "none",
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
