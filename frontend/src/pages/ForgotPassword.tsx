import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex h-screen overflow-y-auto items-center justify-center gradient-hero px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">LiveLearn</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
          <p className="mt-1 text-muted-foreground">We'll send you a reset link</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success" />
              <p className="font-medium text-foreground">Check your email</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a password reset link to {email}
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="gradient-primary text-primary-foreground border-0 w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
