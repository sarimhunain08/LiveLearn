import { Video, CalendarDays, ShieldCheck, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live HD Video Classes",
    description: "Crystal clear video and audio quality for an immersive learning experience.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    description: "Easy-to-use calendar with automated reminders so you never miss a class.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "End-to-end encrypted sessions keeping your learning environment safe.",
    color: "bg-success/10 text-success",
  },
  {
    icon: MessageSquare,
    title: "Interactive Learning",
    description: "Real-time chat, raise hand, and engagement tools for active participation.",
    color: "bg-warning/10 text-warning",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to teach & learn
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A complete platform designed for seamless online education
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
