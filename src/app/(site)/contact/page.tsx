import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FlipHeading from "@/components/FlipHeading";

const DESCRIPTION = "EC構築・改修・運用支援のご相談はこちらから。";

export const metadata: Metadata = {
  title: "Contact — Manato Mizuno",
  description: DESCRIPTION,
  alternates: { canonical: "https://mizunomanato.com/contact" },
  openGraph: {
    title: "Contact — Manato Mizuno",
    description: DESCRIPTION,
    url: "https://mizunomanato.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-title"
      className="mx-auto max-w-[816px] glass rounded-card p-3 shadow-card md:p-6"
    >
      <FlipHeading as="h1" id="contact-title" en="Contact" ja="お問い合わせ" className="px-3 pt-3 pb-4" />
      <div className="p-3 md:px-6 md:pb-6">
        <ContactForm />
      </div>
    </section>
  );
}
