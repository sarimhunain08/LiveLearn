import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

const stats = [
  { value: "10K+", label: "Active Students", icon: Users },
  { value: "500+", label: "Expert Tutors", icon: Award },
  { value: "50+", label: "Subjects", icon: BookOpen },
  { value: "4.9", label: "Average Rating", icon: Star },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 -left-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 -right-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Live classes happening now
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Learn from the{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Best Tutors
                </span>
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6c50-5 100-5 196 0" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>{" "}
              Worldwide
            </h1>

            <p className="mt-5 text-base text-muted-foreground leading-relaxed sm:text-lg">
              Connect with expert tutors for live, interactive online classes.
              Learn any subject, anytime, from anywhere — with personalized
              attention and real-time collaboration.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground border-0 gap-2 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all h-12 rounded-xl"
                >
                  Start Learning Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/find-tutors">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-8 text-base h-12 rounded-xl bg-transparent border-2 border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  Browse Tutors
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: image with animated floating badges */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main image */}
              <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-3xl" />
              <img
                src={heroImage}
                alt="LiveLearn virtual classroom with teacher and students"
                className="relative rounded-2xl shadow-xl"
              />

              {/* Floating badge: rating */}
              <div className="absolute -top-4 -right-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div>
                    <p className="text-sm font-bold text-foreground">4.9/5</p>
                    <p className="text-[10px] text-muted-foreground">2k+ reviews</p>
                  </div>
                </div>
              </div>

              {/* Floating badge: students */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">10,000+</p>
                    <p className="text-[10px] text-muted-foreground">Happy students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground leading-none">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
