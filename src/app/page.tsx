import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ServiceSection from "@/components/ServiceSection";
import WorksSection from "@/components/WorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      <ServiceSection />
      <WorksSection />
      <AboutSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
