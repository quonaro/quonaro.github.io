import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProjectGallery from "@/components/ProjectGallery";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <ProjectGallery />
      <SkillsSection />
      <ServicesSection />
      <ContactSection />
    </div>
  );
};

export default Index;
