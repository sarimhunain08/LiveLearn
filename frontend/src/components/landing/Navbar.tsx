import { Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LiveLearn</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/find-tutors">
            <Button variant="ghost" size="sm">Find Tutors</Button>
          </Link>
          <Link to="/become-a-tutor">
            <Button variant="ghost" size="sm">Become a Tutor</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="gradient-primary text-primary-foreground border-0">
              Get Started Free
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
            <Link to="/find-tutors" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Find Tutors</Button>
            </Link>
            <Link to="/become-a-tutor" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Become a Tutor</Button>
            </Link>
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Sign In</Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="gradient-primary text-primary-foreground border-0 w-full">Get Started Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
