import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FlipHeading from "@/components/FlipHeading";
import { pageMetadata } from "@/lib/site";

const DESCRIPTION = "EC構築・改修・運用支援のご相談はこちらから。";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact — Manato Mizuno",
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
