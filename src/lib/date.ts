// 記事の日付の表示（例：2026.09.24）。サーバーの時刻帯に左右されないよう、日本時間に固定する。
export function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", ".");
}

// 事例（Works）の制作時期の表示（例：2026.11）。日付は保存時点で月初に揃えているため、年月のみ表示する。
export function formatYearMonth(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}.${month}`;
}
