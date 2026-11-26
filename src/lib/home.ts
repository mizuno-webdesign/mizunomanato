// TOP で使うデータの形と、PC と縦並びで共通の文。

// TOOLS の横の「ひとこと」（社長の文 2026-11-26）。内容が変わったら、ここを書き換える。
export const NOTE_TEXT = "EC事業者用アプリを開発中。。";

export type WorkItem = { _id: string; title: string; slug: string; image: string | null };

export type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  date: string; // 表示用に整形済み（例：2026.09.24）
};
