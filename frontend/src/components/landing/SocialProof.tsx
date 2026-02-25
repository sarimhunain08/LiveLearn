import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Aleeza Sohail",
    role: "Parent",
    text: "I was quite pleased with the classroom and the tutor. My daughter finished reading the Quran. We will definitely recommend it to others as well in sha Allah.",
    avatar: "A",
    color: "bg-teal-500",
  },
  {
    name: "Mariam Ahmed",
    role: "Student",
    text: "I would like to thank you for your site which I am now using to learn Quran with my son. We have been on it for a month and are enjoying it. May Allah (swt) bless the team!",
    avatar: "M",
    color: "bg-emerald-500",
  },
  {
    name: "Wajid Patel",
    role: "Student",
    text: "Alhamdulillah we are pleased to continue the Quran lessons for my daughter with our Ilmify tutor. The teacher is very patient and professional. Highly recommend!",
    avatar: "W",
    color: "bg-green-600",
  },
  {
    name: "Fatima Khan",
    role: "Parent",
    text: "My children love their Quran classes on Ilmify. The teachers are so caring and knowledgeable. JazakAllah Khair for this wonderful platform!",
    avatar: "F",
    color: "bg-primary",
  },
  {
    name: "Omar Hassan",
    role: "Student",
    text: "I started as a complete beginner and now I can read the Quran fluently with proper Tajweed. The structured approach really works. Alhamdulillah!",
    avatar: "O",
    color: "bg-teal-600",
  },
  {
    name: "Ayesha Rizwan",
    role: "Parent",
    text: "Finding a qualified female Quran teacher was so easy on Ilmify. My daughter feels comfortable and is making great progress. Highly recommended!",
    avatar: "A",
    color: "bg-emerald-600",
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="group relative flex-shrink-0 w-[340px] rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1">
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
  );
}

export default function SocialProof() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 bg-background overflow-hidden">
      <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative">
        <div className="mb-14 text-center max-w-2xl mx-auto px-4 animate-on-scroll">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Testimonials</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            What they say about us
          </h2>
          <p className="mt-3 text-muted-foreground">
            Hear from the students and parents who trust Ilmify for their Quran education.
          </p>
        </div>

        {/* Marquee container */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
            {/* Original set */}
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
            {/* Duplicate for seamless loop */}
            {testimonials.map((t) => (
              <TestimonialCard key={`dup-${t.name}`} t={t} />
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-16 rounded-2xl border border-border bg-card/50 p-6 sm:p-8 animate-on-scroll">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Trusted by Muslim families worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {["Tajweed", "Hifz", "Noorani Qaida", "Recitation", "Arabic", "Islamic Studies"].map(
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
      </div>
    </section>
  );
}
