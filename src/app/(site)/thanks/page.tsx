import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせありがとうございます | Manato Mizuno",
  // 送信後にだけ見るページなので、検索結果には出さない
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <section className="glass rounded-card px-6 py-12 text-center shadow-card md:px-12">
      <h1 className="type-display text-ink">お問い合わせを受け付けました</h1>
      <p className="mt-4 type-body text-ink-sub">
        通常2営業日以内にご返信いたします。
        <br />
        今しばらくお待ちください。
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
  );
}
