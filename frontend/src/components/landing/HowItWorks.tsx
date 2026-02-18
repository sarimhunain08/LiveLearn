import { UserPlus, Bell, MonitorPlay, BookOpen } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Teacher Creates Session", desc: "Set up your class with a few clicks" },
  { icon: Bell, title: "Students Get Notified", desc: "Automatic reminders via email" },
  { icon: MonitorPlay, title: "Join Live Class", desc: "One-click join from any device" },
  { icon: BookOpen, title: "Learn & Interact", desc: "Chat, raise hand, and collaborate" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">How it works</h2>
          <p className="text-lg text-muted-foreground">Get started in 4 simple steps</p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] hidden h-0.5 bg-border lg:block" />

          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative z-10 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/20 bg-card shadow-card">
                <s.icon className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -top-1 right-1/2 translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="mb-1 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
