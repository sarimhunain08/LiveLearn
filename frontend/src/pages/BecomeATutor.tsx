import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Users, Globe, CalendarDays,
  DollarSign, Video, MessageSquare, Star, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useState, useEffect } from "react";

/* ─── Steps data ─── */
const steps = [
  { num: 1, title: "Sign up", desc: "Create your teacher profile in minutes" },
  { num: 2, title: "Get approved", desc: "We review your profile within 24 hours" },
  { num: 3, title: "Start teaching", desc: "Schedule classes and start earning!" },
];

/* ─── Benefits data ─── */
const benefits = [
  {
    icon: Users,
    title: "Steady stream of students",
    desc: "Get matched with eager learners looking for your expertise.",
  },
  {
    icon: CalendarDays,
    title: "Smart scheduling",
    desc: "Set your availability and let students book your open slots automatically.",
  },
  {
    icon: Video,
    title: "Interactive classroom",
    desc: "HD video, screen sharing, whiteboard, and chat — all built in.",
  },
  {
    icon: DollarSign,
    title: "Set your own rate",
    desc: "You decide how much to charge. Keep 100% of your earnings.",
  },
  {
    icon: Globe,
    title: "Teach from anywhere",
    desc: "All you need is a laptop and internet. Work from home or on the go.",
  },
  {
    icon: MessageSquare,
    title: "Supportive community",
    desc: "Connect with fellow teachers, share tips, and grow together.",
  },
];

/* ─── Stats ─── */
const stats = [
  { value: "10,000+", label: "Active Teachers" },
  { value: "50,000+", label: "Students Enrolled" },
  { value: "180+", label: "Countries" },
  { value: "$2M+", label: "Paid to Teachers" },
];

/* ─── FAQ data ─── */
const faqs = [
  {
    q: "What qualifications do I need to teach on LiveLearn?",
    a: "We welcome teachers of all backgrounds — whether you have a formal degree, professional certification, or deep practical experience. We review each application to ensure quality for our students.",
  },
  {
    q: "How much can I earn?",
    a: "You set your own rate! Teachers on LiveLearn earn anywhere from $10 to $80+ per hour depending on subject, experience, and demand. You keep 100% of what you charge.",
  },
  {
    q: "What subjects can I teach?",
    a: "Math, Science, English, History, Art, Music, Programming, Arabic, and many more. If there's demand for your subject, you can teach it.",
  },
  {
    q: "Is it free to create a teacher profile?",
    a: "Yes, creating and maintaining your teacher profile on LiveLearn is completely free. We only succeed when you succeed.",
  },
  {
    q: "What equipment do I need?",
    a: "A computer with a webcam, a stable internet connection, and a quiet place to teach. That's it! Our platform handles the rest.",
  },
  {
    q: "How do students find me?",
    a: "Students can browse teachers by subject, view your profile, ratings, and upcoming classes. You can also share your profile link directly.",
  },
  {
    q: "How does scheduling work?",
    a: "You set your available time slots, create classes with dates and times, and students enroll. You also get automatic reminders before each class.",
  },
  {
    q: "Can I teach from my phone?",
    a: "While we recommend a laptop or desktop for the best teaching experience, students can join from any device. Teacher tools are optimized for larger screens.",
  },
];

/* ─── Testimonial ─── */
const testimonial = {
  quote:
    "LiveLearn allowed me to turn my passion into a full-time career — teaching students from around the world, right from my living room!",
  name: "Sarah J.",
  role: "Math & Science Teacher",
};

export default function BecomeATutor() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const container = document.getElementById("become-tutor-scroll");
    if (!container) return;
    const onScroll = () => setShowScrollTop(container.scrollTop > 600);
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    document.getElementById("become-tutor-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="become-tutor-scroll" className="h-screen overflow-y-auto bg-background">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="gradient-hero overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div className="animate-fade-in">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" />
                Join 10,000+ teachers worldwide
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Make a living by{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  teaching online
                </span>
              </h1>

              <p className="mb-10 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Share your knowledge with the largest community of learners.
                Teach from anywhere, set your own schedule, and earn on your terms.
              </p>

              {/* Steps */}
              <div className="mb-10">
                <div className="flex items-center gap-0">
                  {steps.map((s, i) => (
                    <div key={s.num} className="flex items-center">
                      <div className="flex flex-col items-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
                          {s.num}
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-foreground sm:text-base">{s.title}</h3>
                        <p className="text-xs text-muted-foreground sm:text-sm max-w-[160px]">{s.desc}</p>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="mx-3 mt-[-28px] h-0.5 w-12 sm:w-20 bg-border" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/signup">
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground border-0 gap-2 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Create a tutor profile now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Image placeholder */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-3xl" />
                <div className="relative flex h-[400px] w-[360px] items-center justify-center rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
                  <div className="text-center px-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-primary">
                      <Video className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Your Classroom</h3>
                    <p className="text-sm text-muted-foreground">
                      HD video, screen sharing, chat, and more — all in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="border-y border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text side */}
            <div>
              <h2 className="mb-4 text-3xl font-extrabold text-foreground sm:text-4xl leading-tight">
                Teach students from{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  around the world
                </span>
              </h2>
              <p className="mb-8 text-muted-foreground text-lg leading-relaxed">
                LiveLearn connects you with thousands of students globally.
                Join us and you'll have everything you need to teach successfully.
              </p>

              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{b.title}</p>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="gradient-primary text-primary-foreground border-0 gap-2 px-8 text-base shadow-lg shadow-primary/25"
                  >
                    Create a tutor profile now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Cards side */}
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.slice(0, 4).map((b) => (
                <div
                  key={b.title}
                  className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">{b.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIAL ═══════════ */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 rounded-2xl bg-primary/5 blur-2xl" />
                <div className="relative flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-elevated">
                  <div className="flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center rounded-full gradient-primary">
                    <span className="text-6xl sm:text-7xl font-bold text-primary-foreground">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div>
              <p className="mb-6 text-2xl font-extrabold leading-snug text-foreground sm:text-3xl lg:text-4xl">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <span className="text-muted-foreground">·</span>
                <p className="text-muted-foreground">{testimonial.role}</p>
              </div>
              <div className="mt-8">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="gradient-primary text-primary-foreground border-0 gap-2 px-8 text-base shadow-lg shadow-primary/25"
                  >
                    Create a tutor profile now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl font-extrabold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-sm text-muted-foreground">
            Have more questions?{" "}
            <Link to="/" className="text-primary hover:underline">
              Check our Help center
            </Link>{" "}
            or{" "}
            <Link to="/" className="text-primary hover:underline">
              contact our support team
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border shadow-elevated">
            <div className="grid lg:grid-cols-2">
              {/* Left — gradient visual */}
              <div className="flex items-center justify-center gradient-primary p-10 sm:p-14">
                <div className="text-center">
                  <Video className="mx-auto mb-4 h-16 w-16 text-primary-foreground/80" />
                  <p className="text-lg font-semibold text-primary-foreground/90">
                    Your next student is waiting
                  </p>
                </div>
              </div>

              {/* Right — CTA text */}
              <div className="flex flex-col justify-center bg-primary/5 p-8 sm:p-12">
                <h2 className="mb-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                  Get paid to teach online
                </h2>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  Connect with thousands of learners around the world and teach from your living room.
                </p>
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2 text-base font-semibold"
                  >
                    Create a tutor profile now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
