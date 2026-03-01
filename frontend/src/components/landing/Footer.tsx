import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-10 py-12 sm:py-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Ilmify</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connecting students with expert Quran tutors worldwide through live, interactive online classes. Learn Tajweed, Hifz, and Arabic from home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Pricing Plans", to: "/pricing" },
                { label: "Contact Us", to: "/contact" },
              ].map((l) => (
                <li key={l.to}>
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
                <span>support@ilmify.online</span>
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
        <div className="border-t border-border py-6 flex items-center justify-center text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Ilmify. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
