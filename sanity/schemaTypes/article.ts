import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "記事",
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
      name: "excerpt",
      title: "抜粋 / SEO用の説明文",
      description: "一覧ページの抜粋表示と、meta description・OGP説明文に使用されます。",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "mainImage",
      title: "メイン画像（OGP・サムネイル用）",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "本文",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "本文", value: "normal" },
            { title: "見出し2", value: "h2" },
            { title: "見出し3", value: "h3" },
            { title: "引用", value: "blockquote" },
          ],
          lists: [
            { title: "箇条書き", value: "bullet" },
            { title: "番号付き", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "太字", value: "strong" },
              { title: "斜体", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "リンク",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "tags",
      title: "タグ",
      description: "自由入力。将来的な絞り込み表示に使用します。",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "publishedAt",
      title: "公開日",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "noindex",
      title: "検索エンジンにインデックスさせない",
      description: "有効にすると、この記事は検索結果に表示されなくなります。",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "公開日（新しい順）",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      excerpt: "excerpt",
      media: "mainImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, excerpt, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("ja-JP")
        : "未公開";
      return {
        title,
        subtitle: `${date} · ${excerpt ?? ""}`,
        media,
      };
    },
  },
});
