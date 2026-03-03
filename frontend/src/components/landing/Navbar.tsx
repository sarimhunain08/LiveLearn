import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Track scroll for nav shadow/bg effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl transition-all duration-300 ${scrolled ? "bg-card/95 shadow-md" : "bg-card/80"}`}>
      {/* Top info bar (desktop only) */}
      <div className="hidden md:block border-b border-border/40 bg-primary/5">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-end gap-5 px-4 sm:px-6 lg:px-8 text-[11px] text-muted-foreground">
          <a href="https://wa.me/18001234567" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-green-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            +1 (800) 123-4567
          </a>
          <a href="mailto:support@ilmify.online" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Mail className="h-3 w-3 text-primary" />
            support@ilmify.online
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + page links */}
        <div className="flex items-center gap-1">
          <Link to="/" className="flex items-center gap-2.5 mr-6 group">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Ilmify</span>
          </Link>

          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-lg font-medium ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Sign In */}
        <div className="hidden md:flex items-center">
          <Link to="/login">
            <Button size="sm" className={`gradient-primary text-primary-foreground border-0 rounded-xl shadow-sm hover:shadow-md transition-shadow px-6 ${pathname === "/login" ? "ring-2 ring-primary/30" : ""}`}>
              Sign In
            </Button>
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-1">
            {/* Mobile contact info */}
            <div className="flex flex-col gap-1.5 pb-3 mb-3 border-b border-border text-xs text-muted-foreground">
              <a href="https://wa.me/18001234567" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-green-600">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +1 (800) 123-4567
              </a>
              <a href="mailto:support@ilmify.online" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5 text-primary" />
                support@ilmify.online
              </a>
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-lg ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button className="gradient-primary text-primary-foreground border-0 w-full rounded-xl mt-2">Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
