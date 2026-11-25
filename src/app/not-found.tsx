import type { Metadata } from "next";
import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: "ページが見つかりません — Manato Mizuno",
};

// 存在しないURLと、削除された記事・事例（notFound()）で表示する。
// ルートに置くため (site) の枠は適用されないので、ここで枠を付ける。
export default function NotFound() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-[640px] glass rounded-card px-6 py-12 text-center shadow-card md:px-12">
        <h1 className="type-display text-ink">ページが見つかりません</h1>
        <p className="mt-4 type-body text-ink-sub">
          移動または削除された可能性があります。
        </p>
        <p className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-full px-4 py-3 type-caption text-ink-sub underline underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
          >
            トップページへ戻る
          </Link>
        </p>
      </section>
    </SiteFrame>
  );
}
