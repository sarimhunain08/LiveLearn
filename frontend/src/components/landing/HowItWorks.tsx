import { Search, CreditCard, MonitorPlay } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: Search,
    title: "Find a Quran Tutor",
    desc: "Browse profiles of hand-picked online Quran teachers who teach Noorani Qaida, Recitation, Tajweed, Hifz, and Arabic.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: CreditCard,
    title: "Select Your Plan",
    desc: "Choose a pricing plan that suits you. Use your free trial to interview Quran teachers before committing.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: MonitorPlay,
    title: "Start Learning Quran",
    desc: "No Zoom needed — our built-in Quran classroom works in your browser with video, audio & whiteboard.",
    color: "from-emerald-500 to-green-500",
  },
];

export default function HowItWorks() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 bg-card overflow-hidden">
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto animate-on-scroll">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">How It Works</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            3 steps to learn Quran online
          </h2>
          <p className="mt-3 text-muted-foreground">
            From finding a tutor to your first Quran class — it only takes a few minutes.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute top-14 left-[15%] right-[15%] hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 lg:block" />

          {steps.map((s, i) => (
            <div key={s.title} className="animate-on-scroll group relative text-center" style={{ transitionDelay: `${i * 150}ms` }}>
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
