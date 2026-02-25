import { Video, BookOpen, ShieldCheck, Globe, Users, GraduationCap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Video,
    title: "Advanced Quran Classroom",
    description: "Like sitting next to a teacher — HD video with interactive whiteboard and Quran display.",
    gradient: "from-teal-500 to-emerald-500",
    bg: "bg-teal-500/10",
    iconColor: "text-teal-500",
  },
  {
    icon: Globe,
    title: "Learn in Your Language",
    description: "Learn Quran online in Urdu, English, Arabic or your native language with qualified tutors.",
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: GraduationCap,
    title: "Multiple Quran Courses",
    description: "Hire multiple teachers for Tajweed, Hifz, Noorani Qaida, Quran Recitation and Arabic.",
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Users,
    title: "Female & Male Tutors",
    description: "Qualified female and male Quran teachers available for kids, women and adults.",
    gradient: "from-amber-500 to-yellow-500",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: BookOpen,
    title: "Hand-picked Quran Tutors",
    description: "Choose from hundreds of verified, experienced Quran tutors from around the world.",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Safe for Kids & Adults",
    description: "Secure, private Quran classroom designed for safe learning for children and adults alike.",
    gradient: "from-green-500 to-teal-500",
    bg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
];

export default function FeaturesSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 bg-background overflow-hidden">
      {/* Subtle bg circles */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto animate-on-scroll">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why Choose Ilmify</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Most trusted platform to learn Quran
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            A complete platform designed for online Quran education — from Tajweed to Hifz, for students of all ages.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="animate-on-scroll group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top gradient line */}
              <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>
                <f.icon className={`h-6 w-6 ${f.iconColor}`} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
