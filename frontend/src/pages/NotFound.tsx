import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GraduationCap, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-4">
      {/* Logo */}
      <Link to="/" className="mb-10 flex items-center gap-2">
        <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">LiveLearn</span>
      </Link>

      {/* 404 */}
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="mt-4 text-xl sm:text-2xl font-bold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button className="gradient-primary text-primary-foreground border-0 gap-2 rounded-xl h-11 px-6 font-semibold">
            <Home className="h-4 w-4" /> Go Home
          </Button>
        </Link>
        <Link to="/find-tutors">
          <Button variant="outline" className="gap-2 rounded-xl h-11 px-6">
            <Search className="h-4 w-4" /> Find Tutors
          </Button>
        </Link>
      </div>

      {/* Back link */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Go back
      </button>
    </div>
  );
};

export default NotFound;
