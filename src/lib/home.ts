// TOP で使うデータの形。
export type WorkItem = { _id: string; title: string; slug: string; image: string | null };

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};
