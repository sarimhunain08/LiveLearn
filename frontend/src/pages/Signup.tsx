import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, User, Mail, Lock, ArrowRight, ArrowLeft, Globe, Languages, BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Role = "teacher" | "student";

interface LanguageEntry {
  language: string;
  level: string;
}

const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador",
  "Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo",
  "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania",
  "Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
  "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia",
  "Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland",
  "Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
  "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan",
  "Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga",
  "Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const LANGUAGE_LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Beginner"];

const SUBJECTS_LIST = [
  "Mathematics","Physics","Chemistry","Biology","Computer Science","English Language","English Literature",
  "Urdu","Islamiat","Pakistan Studies","History","Geography","Economics","Accounting","Business Studies",
  "Psychology","Sociology","Art & Design","Music","Programming","Web Development","Data Science",
  "Machine Learning","Mobile Development","Statistics","Philosophy","Political Science","Law",
  "Environmental Science","Engineering","Architecture","Graphic Design","Digital Marketing",
  "French","German","Spanish","Arabic","Chinese","Japanese","Korean","Turkish",
];

const selectClass = "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none cursor-pointer";

const Signup = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // Teacher extra fields
  const [country, setCountry] = useState("");
  const [languageEntries, setLanguageEntries] = useState<LanguageEntry[]>([{ language: "", level: "Native" }]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([""]);
  const [bio, setBio] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirm) return;
    if (role === "teacher") {
      setStep(3);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!role) return;
    setIsLoading(true);
    try {
      const languages = languageEntries
        .filter((e) => e.language.trim())
        .map((e) => `${e.language.trim()} (${e.level})`);
      const subjects = selectedSubjects.filter((s) => s.trim());
      const extra = role === "teacher" ? { country, languages, subjects, bio } : undefined;
      await signup(name, email, password, role, extra);
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

  // Language helpers
  const addLanguage = () => setLanguageEntries([...languageEntries, { language: "", level: "Intermediate" }]);
  const removeLanguage = (idx: number) => setLanguageEntries(languageEntries.filter((_, i) => i !== idx));
  const updateLanguage = (idx: number, field: keyof LanguageEntry, value: string) => {
    const updated = [...languageEntries];
    updated[idx] = { ...updated[idx], [field]: value };
    setLanguageEntries(updated);
  };

  // Subject helpers
  const addSubject = () => setSelectedSubjects([...selectedSubjects, ""]);
  const removeSubject = (idx: number) => setSelectedSubjects(selectedSubjects.filter((_, i) => i !== idx));
  const updateSubject = (idx: number, value: string) => {
    const updated = [...selectedSubjects];
    updated[idx] = value;
    setSelectedSubjects(updated);
  };

  const strengthPercent = Math.min(100, (password.length / 12) * 100);
  const strengthColor = strengthPercent < 40 ? "bg-destructive" : strengthPercent < 70 ? "bg-warning" : "bg-success";

  const totalSteps = role === "teacher" ? 3 : 2;

  return (
    <div className="flex h-screen overflow-y-auto items-center justify-center gradient-hero px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">LiveLearn</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-muted-foreground">
            {step === 1 ? "Choose your role" : step === 2 ? "Fill in your details" : "Complete your teacher profile"}
          </p>
          {/* Step indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s <= step ? "w-8 bg-primary" : "w-8 bg-muted"
                }`}
              />
            ))}
          </div>
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
          ) : step === 2 ? (
            <form onSubmit={handleStep2Submit} className="space-y-4">
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
                  <Input placeholder="Your name" className="pl-10 h-11" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-10 h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10 h-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
                  <Input type="password" placeholder="••••••••" className="pl-10 h-11" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                {confirm && confirm !== password && (
                  <p className="mt-1 text-xs text-destructive">Passwords don't match</p>
                )}
              </div>

              <Button
                type="submit"
                className="gradient-primary text-primary-foreground border-0 w-full gap-2 shadow-lg shadow-primary/20 h-11"
                disabled={!name || !email || !password || password !== confirm || isLoading}
              >
                {role === "teacher" ? "Next: Profile Details" : isLoading ? "Creating Account..." : "Create Account"} <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            /* Step 3: Teacher profile details */
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>

              {/* Country of birth */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="h-4 w-4 text-muted-foreground" /> Country of birth
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select your country</option>
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Subject you teach */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookOpen className="h-4 w-4 text-muted-foreground" /> Subject you teach
                </label>
                <div className="space-y-3">
                  {selectedSubjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={sub}
                        onChange={(e) => updateSubject(idx, e.target.value)}
                        className={`${selectClass} flex-1`}
                      >
                        <option value="">Select a subject</option>
                        {SUBJECTS_LIST.filter((s) => s === sub || !selectedSubjects.includes(s)).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {selectedSubjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(idx)}
                          className="shrink-0 rounded-lg p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSubject}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add another subject
                </button>
              </div>

              {/* Languages you speak */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Languages className="h-4 w-4 text-muted-foreground" /> Languages you speak
                </label>
                <div className="space-y-3">
                  {languageEntries.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <Input
                          placeholder="e.g. English, Urdu, Arabic..."
                          value={entry.language}
                          onChange={(e) => updateLanguage(idx, "language", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="w-[140px] shrink-0">
                        <select
                          value={entry.level}
                          onChange={(e) => updateLanguage(idx, "level", e.target.value)}
                          className={selectClass}
                        >
                          {LANGUAGE_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      </div>
                      {languageEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(idx)}
                          className="shrink-0 rounded-lg p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add another language
                </button>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">About you</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Tell students about yourself, your experience, and teaching style..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground text-right">{bio.length}/500</p>
              </div>

              <Button
                onClick={handleFinalSubmit}
                className="gradient-primary text-primary-foreground border-0 w-full gap-2 shadow-lg shadow-primary/20 h-11"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"} {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
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
