import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  CONTACT INFO CARDS DATA                                            */
/* ------------------------------------------------------------------ */

const contactCards = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Us",
    description: "Our team typically replies within 24 hours.",
    detail: "support@ilmify.online",
    href: "mailto:support@ilmify.online",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Call Us",
    description: "Mon–Fri from 9 AM to 6 PM (EST).",
    detail: "+1 (800) 123-4567",
    href: "tel:+18001234567",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Our Location",
    description: "100% online — available worldwide.",
    detail: "Global & Remote",
    href: undefined,
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Working Hours",
    description: "Support available on business days.",
    detail: "Mon – Fri, 9 AM – 6 PM EST",
    href: undefined,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.submitContact(formData);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight animate-fade-in-up">
            Contact Us
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
            Have a question or need help? We'd love to hear from you. Reach out and our team will get back to you as soon as possible.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/70 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                {card.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
              {card.href ? (
                <a
                  href={card.href}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {card.detail}
                </a>
              ) : (
                <span className="text-sm font-medium text-foreground">{card.detail}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form + Side Info */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Send us a Message</h2>
                  <p className="text-xs text-muted-foreground">
                    Fill out the form and we'll respond within 24 hours.
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                      setError(null);
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => {
                        setFormData({ ...formData, subject: value });
                        if (error) setError(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="pricing">Pricing & Plans</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Issue</SelectItem>
                        <SelectItem value="become-tutor">Become a Tutor</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="gradient-primary text-primary-foreground border-0 w-full sm:w-auto px-8 h-11 rounded-xl font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Side info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Why contact */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Headphones className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">How Can We Help?</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Need help choosing a plan or tutor?",
                  "Having trouble with your account?",
                  "Want to become a tutor on Ilmify?",
                  "Questions about payments or billing?",
                  "Technical issues during a class?",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick CTA */}
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-1 text-sm">Ready to learn?</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Start your free trial today — no credit card needed.
              </p>
              <Link to="/pricing">
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground border-0 rounded-xl font-semibold"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
