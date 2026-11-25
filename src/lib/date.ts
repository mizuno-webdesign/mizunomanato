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
