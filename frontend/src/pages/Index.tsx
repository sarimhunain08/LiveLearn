import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import SocialProof from "@/components/landing/SocialProof";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="h-screen overflow-y-auto bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <SocialProof />
      <Footer />
    </div>
  );
};

export default Index;
