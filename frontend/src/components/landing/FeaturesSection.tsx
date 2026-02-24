import { Video, CalendarDays, ShieldCheck, MessageSquare, Sparkles, Globe } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live HD Video Classes",
    description: "Crystal clear video and audio quality for an immersive learning experience.",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description: "Easy-to-use calendar with automated reminders so you never miss a class.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "End-to-end encrypted sessions keeping your learning environment safe.",
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: MessageSquare,
    title: "Interactive Learning",
    description: "Real-time chat, raise hand, and engagement tools for active participation.",
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    icon: Globe,
    title: "Learn from Anywhere",
    description: "Access classes from any device — desktop, tablet or mobile, wherever you are.",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Attention",
    description: "Small class sizes and 1-on-1 options for tailored learning experiences.",
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-500/10",
    iconColor: "text-teal-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-24 bg-background overflow-hidden">
      {/* Subtle bg circles */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Features</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to teach & learn
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            A complete platform designed for seamless online education, from scheduling to live interaction.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
