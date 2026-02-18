import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, User, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Role = "teacher" | "student";

const Signup = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || password !== confirm) return;
    setIsLoading(true);
    try {
      await signup(name, email, password, role);
      navigate(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthPercent = Math.min(100, (password.length / 12) * 100);
  const strengthColor = strengthPercent < 40 ? "bg-destructive" : strengthPercent < 70 ? "bg-warning" : "bg-success";

  return (
    <div className="flex h-screen overflow-y-auto items-center justify-center gradient-hero px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">LiveLearn</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-muted-foreground">
            {step === 1 ? "Choose your role" : "Fill in your details"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          {step === 1 ? (
            <div className="space-y-4">
              {(["teacher", "student"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setStep(2); }}
                  className={`w-full rounded-lg border-2 p-6 text-left transition-all hover:border-primary hover:shadow-card ${
                    role === r ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="text-2xl mb-2">{r === "teacher" ? "👨‍🏫" : "👨‍🎓"}</div>
                  <div className="font-semibold text-foreground">
                    Register as {r === "teacher" ? "Teacher" : "Student"}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {r === "teacher"
                      ? "Create and conduct live classes"
                      : "Enroll and attend live classes"}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Your name" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {password && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${strengthPercent}%` }} />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                {confirm && confirm !== password && (
                  <p className="mt-1 text-xs text-destructive">Passwords don't match</p>
                )}
              </div>

              <Button
                type="submit"
                className="gradient-primary text-primary-foreground border-0 w-full gap-2 shadow-lg shadow-primary/20"
                disabled={!name || !email || !password || password !== confirm || isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"} {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
