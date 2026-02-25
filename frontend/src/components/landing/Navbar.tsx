import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg animate-fade-in">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + page links */}
        <div className="flex items-center gap-1">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Ilmify</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isActive ? "bg-primary/10 text-primary font-semibold" : ""}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: auth actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button size="sm" className={`gradient-primary text-primary-foreground border-0 ${pathname === "/login" ? "ring-2 ring-primary/30" : ""}`}>
              Sign In
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button className="gradient-primary text-primary-foreground border-0 w-full">Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
