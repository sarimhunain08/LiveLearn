import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronDown,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type Region = "europe" | "uk" | "usa";

interface Plan {
  name: string;
  price: { europe: number; uk: number; usa: number };
  currency: { europe: string; uk: string; usa: string };
  popular?: boolean;
  features: string[];
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: { europe: 15, uk: 12, usa: 20 },
    currency: { europe: "€", uk: "£", usa: "$" },
    features: [
      "2 live classes / week",
      "30-min sessions",
      "All subjects available",
      "Group class (max 6)",
      "1st week free trial",
      "Class recordings access",
    ],
    cta: "Get Started",
  },
  {
    name: "Standard",
    price: { europe: 30, uk: 25, usa: 35 },
    currency: { europe: "€", uk: "£", usa: "$" },
    popular: true,
    features: [
      "4 live classes / week",
      "45-min sessions",
      "All subjects available",
      "Semi-private (max 3)",
      "1st week free trial",
      "Class recordings access",
      "Priority scheduling",
    ],
    cta: "Most Popular",
  },
  {
    name: "Premium",
    price: { europe: 50, uk: 40, usa: 60 },
    currency: { europe: "€", uk: "£", usa: "$" },
    features: [
      "6 live classes / week",
      "60-min sessions",
      "All subjects available",
      "Private 1-on-1",
      "1st week free trial",
      "Class recordings access",
      "Priority scheduling",
      "Progress reports",
    ],
    cta: "Go Premium",
  },
  {
    name: "Custom",
    price: { europe: 0, uk: 0, usa: 0 },
    currency: { europe: "€", uk: "£", usa: "$" },
    features: [
      "Custom classes / week",
      "Flexible session length",
      "All subjects available",
      "Private or group",
      "Tailored curriculum",
      "Dedicated tutor",
      "Direct support line",
    ],
    cta: "Contact Us",
  },
];

const regionLabels: Record<Region, string> = {
  europe: "Europe",
  uk: "UK",
  usa: "USA / CAD / AUS",
};

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "Do I need credit card information for trial classes?",
    a: "No. Our trial classes are absolutely free — no credit card required. Simply sign up, choose a plan, and your first week of classes is on us.",
  },
  {
    q: "How many trial classes do I get?",
    a: "The number of free trial classes matches your chosen plan. For example, the Starter plan gives you 2 free classes, Standard gives 4, and Premium gives 6 during your free trial week.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards (Visa, Mastercard, AMEX), PayPal, and bank transfers. Regional payment methods are also supported.",
  },
  {
    q: "Is there a discount for more than one family member?",
    a: "Yes! We offer a 15% discount for each additional family member enrolled. Contact our support team to set up family plans.",
  },
  {
    q: "Can I change my plan later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What is your cancellation policy?",
    a: "You can cancel your subscription at any time with no cancellation fees. You'll continue to have access until the end of your current billing period.",
  },
  {
    q: "What about missed classes?",
    a: "If you miss a scheduled class, you can request a make-up session within the same week. We understand life happens and try to be as flexible as possible.",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
          open ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted/50 text-foreground"
        }`}
      >
        <span className="font-semibold text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 py-4 bg-card text-sm text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function MonthlyFee() {
  const [region, setRegion] = useState<Region>("usa");

  return (
    <div className="h-screen overflow-y-auto scrollbar-none bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Monthly Charges
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <span>Pricing Plans</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            We offer both <strong className="text-foreground">Semi-Private</strong> and{" "}
            <strong className="text-foreground">Private</strong> classes. In{" "}
            <strong className="text-foreground">Semi-Private classes</strong>, each student enjoys a personal learning space in the live
            classroom with the tutor. Sessions are interactive, engaging, and designed for maximum learning.
          </p>
          <p>
            For those who prefer complete personalization, our{" "}
            <strong className="text-foreground">Private one-to-one sessions</strong> give each student dedicated attention
            from a qualified teacher, ensuring faster progress and tailored guidance.
          </p>
          <p>
            We provide a <strong className="text-foreground">free first week trial</strong> for both semi-private and
            one-to-one classes, giving students the opportunity to experience our teaching methods before officially enrolling.
          </p>
        </div>
      </div>

      {/* Region Tabs + Pricing Cards */}
      <div className="bg-primary/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          {/* Region tabs */}
          <div className="flex justify-center gap-3 mb-10">
            {(Object.keys(regionLabels) as Region[]).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  region === r
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {regionLabels[r]}
              </button>
            ))}
          </div>

          {/* Pricing grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const price = plan.price[region];
              const currency = plan.currency[region];
              const isCustom = plan.name === "Custom";

              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border-2 bg-card p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                    plan.popular
                      ? "border-primary shadow-lg"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md">
                        <Star className="h-3 w-3" /> MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="text-center pt-2 pb-4">
                    {isCustom ? (
                      <div className="text-3xl font-extrabold text-foreground">Custom</div>
                    ) : (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-lg text-muted-foreground">{currency}</span>
                        <span className="text-5xl font-extrabold text-foreground">{price}</span>
                      </div>
                    )}
                    <p className="mt-1 text-sm font-semibold text-foreground">{plan.name}</p>
                    {!isCustom && (
                      <p className="text-xs text-muted-foreground">per month</p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-3" />

                  {/* Features */}
                  <ul className="flex-1 space-y-3 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to="/signup" className="mt-auto">
                    <Button
                      className={`w-full rounded-xl h-11 font-semibold text-sm ${
                        plan.popular
                          ? "gradient-primary text-primary-foreground border-0"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Features comparison highlights */}
          <div className="mt-14 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <BookOpen className="h-6 w-6" />, title: "All Subjects", desc: "Math, Science, Languages, Quran & more" },
              { icon: <Clock className="h-6 w-6" />, title: "Flexible Timing", desc: "Morning, afternoon or evening slots" },
              { icon: <Users className="h-6 w-6" />, title: "Expert Tutors", desc: "Screened & qualified teachers" },
              { icon: <Zap className="h-6 w-6" />, title: "Free Trial", desc: "First week completely free" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Policy / FAQ */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Fee Policy</h2>
          <div className="mt-2 mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary/5 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Ready to start learning?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign up today and get your first week of classes absolutely free. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/signup">
              <Button className="gradient-primary text-primary-foreground border-0 rounded-xl h-11 px-8 font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/find-tutors">
              <Button variant="outline" className="rounded-xl h-11 px-8">
                Browse Tutors
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
