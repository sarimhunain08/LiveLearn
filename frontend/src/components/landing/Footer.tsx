import { GraduationCap, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-10 py-12 sm:py-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LiveLearn</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connecting students with expert tutors worldwide through live, interactive online classes.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="h-4 w-4" />, href: "#" },
                { icon: <Instagram className="h-4 w-4" />, href: "#" },
                { icon: <Twitter className="h-4 w-4" />, href: "#" },
                { icon: <Youtube className="h-4 w-4" />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:bg-primary/5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Find Tutors", to: "/find-tutors" },
                { label: "Become a Tutor", to: "/become-a-tutor" },
                { label: "Pricing Plans", to: "/pricing" },
                { label: "Sign Up Free", to: "/signup" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Help Center", to: "/contact" },
                { label: "Privacy Policy", to: "/" },
                { label: "Terms of Service", to: "/" },
                { label: "FAQ", to: "/pricing" },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>support@livelearn.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Available worldwide — 100% online</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} LiveLearn Platform. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
