import { defineField, defineType } from "sanity";

export const activity = defineType({
  name: "activity",
  title: "最近の対応",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "日付",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "内容",
      type: "string",
      description: "例：化粧品ECサイト リニューアル対応いたしました",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "note",
      title: "補足（任意）",
      type: "string",
      description: "例：※守秘義務により詳細非公開",
    }),
    defineField({
      name: "relatedArticle",
      title: "関連記事（任意）",
      type: "reference",
      to: [{ type: "article" }],
      description: "詳しく書ける内容の場合、対応する記事をここで紐付ける",
    }),
  ],
  orderings: [
    {
      title: "新しい順",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "text",
      date: "date",
    },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date,
      };
    },
  },
});
