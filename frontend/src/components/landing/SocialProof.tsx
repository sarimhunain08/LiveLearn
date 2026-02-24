import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Malik",
    role: "Student",
    text: "LiveLearn has completely transformed the way I study. The tutors are incredibly knowledgeable and the live sessions feel just like a real classroom.",
    avatar: "A",
    color: "bg-amber-500",
  },
  {
    name: "James Carter",
    role: "Teacher",
    text: "As a tutor, this platform makes it so easy to schedule classes and interact with students. The tools are intuitive and my income has grown steadily.",
    avatar: "J",
    color: "bg-blue-500",
  },
  {
    name: "Fatima Hassan",
    role: "Parent",
    text: "My kids love their classes on LiveLearn. The scheduling is flexible and the teachers are patient and professional. Highly recommend!",
    avatar: "F",
    color: "bg-emerald-500",
  },
];

export default function SocialProof() {
  return (
    <section className="relative py-20 sm:py-24 bg-background overflow-hidden">
      <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Testimonials</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Loved by students and teachers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Don't just take our word for it — hear from the people who use LiveLearn every day.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground mb-6">{t.text}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-white font-bold text-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by educators and learners worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {["EduTech", "LearnCo", "ClassHub", "StudyPro", "AcademyX", "BrightEd"].map(
              (name) => (
                <div
                  key={name}
                  className="flex h-10 items-center rounded-lg bg-muted/50 px-5 text-sm font-bold tracking-wider text-muted-foreground/60"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
