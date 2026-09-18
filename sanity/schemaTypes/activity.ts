import { defineField, defineType } from "sanity";

export const activity = defineType({
  name: "activity",
  title: "最近の対応",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "年月",
      type: "string",
      description: "例：2026-09（YYYY-MM形式。日まで書くと案件が特定されやすいため年月のみ）",
      validation: (Rule) =>
        Rule.required().regex(/^\d{4}-\d{2}$/, {
          name: "YYYY-MM形式",
        }),
    }),
    defineField({
      name: "text",
      title: "内容",
      type: "string",
      description: "例：化粧品ECサイト リニューアル対応いたしました",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "カテゴリ（任意）",
      description: "自由入力。例：Build / Analyze & Improve / Operate & Support",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
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
