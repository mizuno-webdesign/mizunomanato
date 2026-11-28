import { defineField, defineType } from "sanity";
import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX, oneLine, textWidth } from "../../src/lib/seo";

export const work = defineType({
  name: "work",
  title: "制作事例",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "カテゴリ（プラットフォーム）",
      type: "string",
      options: {
        list: [
          { title: "Shopify", value: "Shopify" },
          { title: "Framer", value: "Framer" },
          { title: "カラーミーショップ", value: "カラーミーショップ" },
          { title: "その他", value: "その他" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "制作時期",
      description: "一覧の並び順・表示（例：2026.11）に使う年月。日付は月の1日で入力してください。",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "サムネイル画像",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "概要",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "seoTitle",
      title: "検索用タイトル",
      description: `検索結果の見出し。後ろの「 — Manato Mizuno」は自動で付くので入れません（合計が${TITLE_MAX}を超えると付きません）。全角を1、半角を0.5と数えて${TITLE_MAX}まで。空欄なら「タイトル の制作事例」になります。`,
      type: "string",
      validation: (Rule) =>
        Rule.custom((value?: string) => {
          const width = textWidth(oneLine(value));
          return width <= TITLE_MAX ? true : `今は${width}です。${TITLE_MAX}までが目安です。`;
        }).warning(),
    }),
    defineField({
      name: "seoDescription",
      title: "検索用説明文",
      description: `検索結果の説明文。全角を1、半角を0.5と数えて${DESCRIPTION_MIN}〜${DESCRIPTION_MAX}。大事な内容は前半に書きます。空欄なら概要の冒頭から自動で作ります。`,
      type: "text",
      rows: 4,
      validation: (Rule) =>
        Rule.custom((value?: string) => {
          const text = oneLine(value);
          if (!text) return true;
          const width = textWidth(text);
          return width >= DESCRIPTION_MIN && width <= DESCRIPTION_MAX ? true : `今は${width}です。${DESCRIPTION_MIN}〜${DESCRIPTION_MAX}が目安です。`;
        }).warning(),
    }),
    defineField({
      name: "featured",
      title: "フィーチャード表示",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "表示順",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "表示順",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "新しい順",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      date: "date",
      media: "thumbnail",
    },
    prepare({ title, category, date, media }) {
      return {
        title,
        subtitle: `${category} · ${date}`,
        media,
      };
    },
  },
});
