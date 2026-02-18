export default function SocialProof() {
  const logos = ["EduTech", "LearnCo", "ClassHub", "StudyPro", "AcademyX", "BrightEd"];

  return (
    <section className="border-y border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by 10,000+ teachers and students worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {logos.map((name) => (
            <div
              key={name}
              className="flex h-10 items-center rounded-md bg-muted/50 px-5 text-sm font-semibold tracking-wide text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
