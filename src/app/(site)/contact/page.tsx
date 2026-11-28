import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FlipHeading from "@/components/FlipHeading";
import { pageTitle } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const DESCRIPTION =
  "Shopify の新規構築・改修・運用支援などのご相談は、こちらのフォームから受け付けています。お問い合わせの種類を選んで、内容をご記入ください。通常2営業日以内にご返信いたします。その他のご用件も、こちらからお送りいただけます。";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: pageTitle("Shopify のご相談・お問い合わせ"),
  description: DESCRIPTION,
});

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-title"
      className="glass rounded-card p-3 shadow-card md:p-6"
    >
      <FlipHeading as="h1" id="contact-title" en="Contact" ja="お問い合わせ" className="px-3 pt-3 pb-4" />
      <div className="mx-auto w-full max-w-[720px] p-3 md:px-6 md:pb-10">
        <ContactForm />
      </div>
    </section>
  );
}
