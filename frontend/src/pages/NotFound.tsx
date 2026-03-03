import { Link } from "react-router-dom";
import { Home, ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-7xl font-extrabold text-primary tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Page not found</h2>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Link to="/">
            <Button className="gradient-primary text-primary-foreground border-0 gap-2 rounded-xl shadow-md">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
