import { UserPlus, Bell, MonitorPlay, BookOpen } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Choose a Tutor",
    desc: "Browse expert tutors, check profiles and reviews, and pick your perfect match.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    title: "Schedule a Class",
    desc: "Book a session that fits your schedule. Get automatic email & in-app reminders.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: MonitorPlay,
    title: "Join the Live Class",
    desc: "One click to enter HD video — works on desktop, tablet, or phone.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: BookOpen,
    title: "Learn & Grow",
    desc: "Interactive sessions with chat, screen sharing, and progress tracking.",
    color: "from-orange-500 to-amber-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 sm:py-24 bg-card overflow-hidden">
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">How It Works</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Get started in 4 simple steps
          </h2>
          <p className="mt-3 text-muted-foreground">
            From sign-up to your first live class — it only takes a few minutes.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line (desktop) */}
          <div className="absolute top-14 left-[15%] right-[15%] hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 lg:block" />

          {steps.map((s, i) => (
            <div key={s.title} className="group relative text-center">
              {/* Circle + icon */}
              <div className="relative z-10 mx-auto mb-5">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-border bg-card shadow-md group-hover:shadow-lg group-hover:border-primary/30 transition-all">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${s.color} shadow-lg`}>
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                {/* Step number */}
                <div className="absolute -top-1 right-1/2 translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background shadow">
                  {i + 1}
                </div>
              </div>

              <h3 className="mb-1.5 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[220px] mx-auto leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
