import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ServiceSection from "@/components/ServiceSection";
import WorksSection from "@/components/WorksSection";
import ActivitySection from "@/components/ActivitySection";
import ArticlesSection from "@/components/ArticlesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

// このページはSanityの記事・実績データを表示するため、ビルド時の静的
// プリレンダリングのままだと公開後の新規コンテンツが反映されない
// （Vercelがビルド時点のHTMLをそのまま配信し続けてしまう）。
// 常にリクエスト時に最新データを取得するよう動的レンダリングを強制する。
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      <ServiceSection />
      <WorksSection />
      <ActivitySection />
      <ArticlesSection />
      <AboutSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
