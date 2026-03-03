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
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CoursesSection />
      <FeaturesSection />
      <HowItWorks />
      <SocialProof />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23fff'/%3E%3C/svg%3E\")" }} />
        <div className="relative mx-auto max-w-3xl px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
            <GraduationCap className="h-4 w-4" />
            Start Your Journey Today
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            Ready to start your<br />Quran journey?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Join thousands of students on Ilmify. Start your Quran learning journey today with expert tutors from around the world.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/pricing">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 gap-2 px-8 h-13 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all"
              >
                View Pricing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur border-2 border-white/30 text-white hover:bg-white hover:text-primary gap-2 px-8 h-13 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg"
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
