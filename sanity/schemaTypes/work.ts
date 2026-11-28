import { defineField, defineType } from "sanity";

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
