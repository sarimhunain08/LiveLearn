import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Star, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        navigate(redirectTo);
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-y-auto">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LiveLearn</span>
          </Link>

          {/* Center content */}
          <div className="max-w-md">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
              Welcome back to your learning journey
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Sign in to access your classes, connect with tutors, and continue growing your skills.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, value: "10K+", label: "Students" },
                { icon: Star, value: "4.9", label: "Rating" },
                { icon: BookOpen, value: "50+", label: "Subjects" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-white/10 backdrop-blur p-3 text-center">
                  <s.icon className="h-5 w-5 text-white/80 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="rounded-xl bg-white/10 backdrop-blur p-5">
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-white/80 italic leading-relaxed mb-3">
              "LiveLearn made it so easy to find a tutor and schedule classes around my busy life. The live sessions are incredible!"
            </p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Ayesha Malik</p>
                <p className="text-[10px] text-white/50">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-4 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">LiveLearn</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="gradient-primary text-primary-foreground border-0 w-full h-11 rounded-xl gap-2 shadow-lg shadow-primary/20 font-semibold"
            >
              {isLoading ? "Signing In..." : "Sign In"} {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-5 rounded-xl bg-muted/50 border border-border p-3.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Demo accounts:</p>
            <p>teacher@demo.com &bull; student@demo.com &bull; admin@demo.com</p>
            <p>Password: password123</p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
