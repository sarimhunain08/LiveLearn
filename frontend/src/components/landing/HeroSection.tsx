import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";

const heroImages = [img1, img2, img3];

const stats = [
  { value: "5,000+", label: "Students Registered", icon: Users },
  { value: "200+", label: "Quran Tutors", icon: Award },
  { value: "50K+", label: "Classes Completed", icon: BookOpen },
  { value: "4.9", label: "Average Rating", icon: Star },
];

export default function HeroSection() {
  const [currentImg, setCurrentImg] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
      setIsTransitioning(false);
    }, 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <section className="relative overflow-hidden">
      {/* Islamic green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-white animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
              </span>
              Live Quran classes happening now
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
              Learn Quran Online{" "}
              <span className="relative">
                <span className="text-yellow-300">
                  With Expert Tutors
                </span>
              </span>
            </h1>

            <p className="mt-5 text-base text-white/80 leading-relaxed sm:text-lg animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              Your rate, Your time, Your choice.
              Online Quran classes for Tajweed, Hifz and Arabic —
              with personalized attention and real-time collaboration.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "0.45s", animationFillMode: "both" }}>
              <Link to="/pricing">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 gap-2 px-8 text-base font-bold shadow-lg hover:shadow-xl transition-all h-12 rounded-xl"
                >
                  View Pricing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-8 text-base h-12 rounded-xl bg-transparent border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: rotating images */}
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <div className="relative">
              {/* Image carousel */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: "380px" }}>
                <img
                  src={heroImages[currentImg]}
                  alt="Ilmify online Quran learning"
                  className="relative w-full h-full object-cover rounded-2xl transition-all duration-700 ease-in-out"
                  style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? "scale(1.05)" : "scale(1)",
                  }}
                />
              </div>

              {/* Slide indicators */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIsTransitioning(true); setTimeout(() => { setCurrentImg(i); setIsTransitioning(false); }, 500); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentImg ? "h-2.5 w-8 bg-yellow-400" : "h-2.5 w-2.5 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 backdrop-blur p-4 animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-yellow-300">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-white leading-none">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
