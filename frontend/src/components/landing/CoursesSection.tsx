import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";

const courses = [
  {
    title: "Learn Tajweed",
    description:
      "Ilmify provides comprehensive Quran Tajweed learning through highly qualified and experienced Tajweed instructors. If you already know how to read the Quran and wish to enhance your Tajweed proficiency, you've come to the right place. Our dedicated teachers and structured lessons are designed to deepen your understanding and perfect your recitation, guiding you toward true mastery of the Holy Quran.",
    image: img2,
    alt: "Young boy learning Tajweed in mosque",
  },
  {
    title: "Learn Quran Reading",
    description:
      "We have made learning the Holy Quran simple and comfortable through our efficient online learning system. Our experienced and dedicated Quran tutors are passionate about helping you grow spiritually and academically by diving deeper into the teachings of the Holy Quran. Join us once, and you may find a lasting connection on your journey of Quranic learning.",
    image: img3,
    alt: "Young scholar reading Quran",
  },
  {
    title: "Quran Memorization",
    description:
      "Ilmify proudly offers specialized Quran memorization courses aimed at spreading the divine message of the Holy Quran to millions of hearts. Memorize the Quran not only for spiritual growth but also to secure blessings in the hereafter. Our dedicated Hafiz-e-Quran teachers, with strong expertise and a structured approach, will guide you step by step to strengthen and refine your memorization skills.",
    image: img1,
    alt: "Elder Quran teacher reading Holy Quran",
  },
];

export default function CoursesSection() {
  const sectionRef = useScrollAnimation();

  return (
    <section ref={sectionRef} className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
            Our Courses
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            What We <span className="text-primary">Teach</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Comprehensive Quran education programs designed to help you grow spiritually and academically
          </p>
        </div>

        {/* Course rows — alternating layout */}
        <div className="space-y-20 sm:space-y-28">
          {courses.map((course, i) => {
            const isReversed = i % 2 !== 0;
            return (
              <div
                key={course.title}
                className={`animate-on-scroll grid items-center gap-10 lg:gap-16 lg:grid-cols-2 ${
                  isReversed ? "lg:direction-rtl" : ""
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Image */}
                <div className={`${isReversed ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative group">
                    {/* Decorative frame behind image */}
                    <div className="absolute inset-4 border-2 border-primary/20 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                    <img
                      src={course.image}
                      alt={course.alt}
                      className="relative w-full max-w-lg mx-auto rounded-2xl shadow-xl object-cover"
                      style={{ aspectRatio: "4/3" }}
                    />
                    {/* Glow effect */}
                    <div className="absolute -inset-2 bg-primary/5 rounded-3xl blur-2xl -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
                  </div>
                </div>

                {/* Text content */}
                <div className={`${isReversed ? "lg:order-1" : "lg:order-2"}`}>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-primary mb-5 tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/pricing">
                      <Button
                        size="lg"
                        className="gap-2 px-8 h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                      >
                        Get Enrolled Now
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 px-8 h-12 rounded-xl text-base border-2 border-primary/30 text-primary hover:bg-primary/5 transition-all"
                      >
                        More Details <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
