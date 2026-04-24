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
      title: "カテゴリ",
      type: "string",
      options: {
        list: [
          { title: "Build · Shopify", value: "Build · Shopify" },
          { title: "Build · BtoB", value: "Build · BtoB" },
          { title: "Analyze & Improve", value: "Analyze & Improve" },
          { title: "Operate & Support", value: "Operate & Support" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "年度",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "note",
      title: "補足（業種など）",
      type: "string",
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
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      year: "year",
      media: "thumbnail",
    },
    prepare({ title, category, year, media }) {
      return {
        title,
        subtitle: `${category} · ${year}`,
        media,
      };
    },
  },
});
