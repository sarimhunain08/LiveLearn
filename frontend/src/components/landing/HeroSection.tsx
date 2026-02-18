import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

export default function HeroSection() {
  return (
    <section className="gradient-hero overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-live" />
              Live classes happening now
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Live Online Classes{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Connect teachers and students in real-time virtual classrooms.
              Schedule, join, and learn from anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 gap-2 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="gap-2 px-8 text-base">
                  <Play className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-slide-up hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-3xl" />
              <img
                src={heroImage}
                alt="LiveLearn virtual classroom with teacher and students"
                className="relative rounded-2xl shadow-elevated"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
