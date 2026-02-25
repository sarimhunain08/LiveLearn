import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CoursesSection from "@/components/landing/CoursesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import SocialProof from "@/components/landing/SocialProof";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="h-screen overflow-y-auto bg-background">
      <Navbar />
      <HeroSection />
      <CoursesSection />
      <FeaturesSection />
      <HowItWorks />
      <SocialProof />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:py-24 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-white/80 mb-5" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to start your Quran journey?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Join thousands of students on Ilmify. Start your Quran learning journey today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/pricing">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 gap-2 px-8 h-12 rounded-xl font-semibold text-base shadow-xl"
              >
                View Pricing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur border-2 border-white/40 text-white hover:bg-white hover:text-primary gap-2 px-8 h-12 rounded-xl text-base font-semibold transition-all shadow-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
