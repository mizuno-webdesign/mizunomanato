import type { Metadata } from "next";
import Link from "next/link";
import FlipHeading from "@/components/FlipHeading";
import { pageMetadata } from "@/lib/site";

// プライバシーポリシー。取得する情報と使っている外部サービスは、このサイトの実装に合わせている。
// フォームの項目、解析タグ、送信やホスティングのサービスを変えたときは、ここも直して改定日を足す。

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy — Manato Mizuno",
  description: "このサイトでの個人情報の取り扱いについて。",
});

const LINK =
  "rounded-sm text-accent underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-accent";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="type-heading text-heading">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <section aria-labelledby="privacy-title" className="glass rounded-card p-3 shadow-card md:p-6">
      <FlipHeading as="h1" id="privacy-title" en="Privacy Policy" ja="プライバシーポリシー" className="px-3 pt-3 pb-4" />
      <div className="mx-auto flex w-full max-w-[768px] flex-col gap-8 p-3 type-body text-ink md:px-6 md:pb-10">
        <p>
          水野学人（以下「当方」）は、このサイト（mizunomanato.com）でお預かりする個人情報を、個人情報の保護に関する法律などの法令を守り、次のとおり取り扱います。
        </p>

        <Section title="1. 事業者">
          <List
            items={[
              "氏名：水野学人（Manato Mizuno／個人事業主）",
              "所在地：静岡県（詳しい住所は、ご請求があれば遅滞なくお知らせします）",
            ]}
          />
        </Section>

        <Section title="2. 取得する情報">
          <List
            items={[
              "お問い合わせフォームに入力された情報：会社名、お名前、メールアドレス、電話番号（任意）、お問い合わせの種類、サービスを知ったきっかけ（任意）、お問い合わせ内容",
              "サイトの利用に伴って送られる情報：閲覧したページ、日時、参照元、お使いの端末やブラウザの情報、IP アドレス、Cookie などの識別子",
            ]}
          />
        </Section>

        <Section title="3. 利用目的">
          <List
            items={[
              "お問い合わせへの返信と、ご相談やお見積もりに関する連絡のため",
              "ご依頼いただいた業務を進めるため",
              "サイトの利用状況を調べ、内容や使いやすさを改善するため",
              "迷惑な送信や不正な利用を防ぎ、サイトを安全に運営するため",
            ]}
          />
        </Section>

        <Section title="4. 第三者への提供">
          <p>
            次の場合を除き、ご本人の同意を得ずに個人情報を第三者に提供しません。なお、次の「5. 利用している外部サービス」の範囲で、情報の取り扱いを外部の事業者に任せることがあります。
          </p>
          <List
            items={[
              "法令に基づく場合",
              "人の生命、身体または財産を守るために必要で、ご本人の同意を得ることが難しい場合",
              "その他、法令で認められている場合",
            ]}
          />
        </Section>

        <Section title="5. 利用している外部サービス">
          <p>サイトの運営に、次の米国の事業者のサービスを利用しています。情報は、米国など日本国外のサーバーで扱われることがあります。</p>
          <List
            items={[
              "Vercel：サイトの配信（アクセスの記録を含みます）",
              "Resend：お問い合わせ内容のメール送信",
              "Google（Gmail）：お問い合わせメールの受信と保管",
              "Google（Google アナリティクス）：アクセスの解析",
              "Sanity：記事や事例の内容と画像の配信",
            ]}
          />
        </Section>

        <Section title="6. アクセス解析と Cookie">
          <p>
            このサイトは、利用状況を調べるために Google アナリティクスを使っています。Google アナリティクスは Cookie などを使って、閲覧したページや端末の情報を収集し、Google が処理します。当方が、お名前やメールアドレスなど個人を直接特定できる情報を Google アナリティクスに送ることはありません。
          </p>
          <List
            items={[
              <External key="google" href="https://policies.google.com/technologies/partner-sites?hl=ja">
                Google のサービスを使用するサイトやアプリから収集した情報の Google による使用
              </External>,
              <External key="optout" href="https://tools.google.com/dlpage/gaoptout?hl=ja">
                Google アナリティクス オプトアウト アドオン（計測を止める拡張機能）
              </External>,
            ]}
          />
          <p>Cookie は、お使いのブラウザの設定で無効にできます。また、画面の明るさの選択（ライトとダーク）は、お使いのブラウザ内にだけ保存し、当方には送られません。</p>
        </Section>

        <Section title="7. 安全管理">
          <List
            items={[
              "お預かりした個人情報は、当方だけが取り扱います",
              "お問い合わせの送信は、暗号化した通信（HTTPS）で行います",
              "個人情報を扱う端末とアカウントは、パスワードなどで保護します",
              "外部のサービスを使うときは、その事業者の個人情報の取り扱いを確認し、情報が扱われる国の制度にも注意します",
              "利用する必要がなくなった個人情報は、削除します",
            ]}
          />
        </Section>

        <Section title="8. 開示・訂正・削除などのご請求">
          <p>
            ご本人は、当方が保有するご自身の個人情報について、利用目的の通知、開示、訂正、追加、削除、利用の停止、第三者への提供の停止などを請求できます。ご本人であることを確認したうえで、法令に従って対応します。手数料はいただきません。
          </p>
        </Section>

        <Section title="9. お問い合わせ・苦情の窓口">
          <p>
            個人情報の取り扱いに関するご請求、ご質問、苦情は、
            <Link href="/contact" className={LINK}>
              お問い合わせフォーム
            </Link>
            からご連絡ください。個人の方は、会社名の欄に「個人」とご記入ください。
          </p>
        </Section>

        <Section title="10. 改定">
          <p>法令の変更やサイトの内容の変更に合わせて、このポリシーを改定することがあります。改定した内容は、このページに掲載した時点から適用します。</p>
        </Section>

        <p className="type-caption text-ink-sub">制定日：2026年11月26日</p>
      </div>
    </section>
  );
}
