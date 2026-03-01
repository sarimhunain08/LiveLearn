import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2, AlertCircle, CheckCircle2, ArrowLeft, Plus, X,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { adminNav as navItems } from "@/lib/navItems";
import { getErrorMessage } from "@/lib/types";

const SUBJECT_OPTIONS = ["math", "science", "english", "history", "art", "music", "programming", "arabic"];

export default function AdminCreateTeacher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    bio: "",
    hourlyRate: "",
    languageInput: "",
  });
  const [languages, setLanguages] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const addLanguage = () => {
    const lang = form.languageInput.trim();
    if (lang && !languages.includes(lang)) {
      setLanguages([...languages, lang]);
      setForm((prev) => ({ ...prev, languageInput: "" }));
    }
  };

  const removeLanguage = (lang: string) => setLanguages(languages.filter((l) => l !== lang));

  const toggleSubject = (sub: string) => {
    setSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "teacher",
        country: form.country || undefined,
        languages: languages.length ? languages : undefined,
        subjects: subjects.length ? subjects : undefined,
        bio: form.bio || undefined,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout title="Create Teacher" navItems={navItems} role="admin">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Teacher Created Successfully!</h2>
          <p className="text-muted-foreground mb-6">The teacher account has been created and is ready to use.</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/admin/teachers")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Teachers
            </Button>
            <Button onClick={() => { setSuccess(false); setForm({ name: "", email: "", password: "", country: "", bio: "", hourlyRate: "", languageInput: "" }); setLanguages([]); setSubjects([]); }}>
              <Plus className="h-4 w-4 mr-2" /> Create Another
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Teacher" navItems={navItems} role="admin">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/teachers")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Teachers
        </Button>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> New Teacher Account
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Required fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="Ahmed Khan" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="teacher@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Pakistan" value={form.country} onChange={(e) => updateField("country", e.target.value)} />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <Label>Subjects</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SUBJECT_OPTIONS.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      subjects.includes(sub)
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <Label>Languages</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="e.g. Urdu, English, Arabic"
                  value={form.languageInput}
                  onChange={(e) => updateField("languageInput", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } }}
                />
                <Button type="button" variant="outline" onClick={addLanguage}>Add</Button>
              </div>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((lang) => (
                    <span key={lang} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {lang}
                      <button type="button" onClick={() => removeLanguage(lang)}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio & Rate */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Brief description of the teacher..."
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                maxLength={500}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <Label htmlFor="rate">Hourly Rate (PKR)</Label>
              <Input id="rate" type="number" min="0" placeholder="0" value={form.hourlyRate} onChange={(e) => updateField("hourlyRate", e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/teachers")}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Teacher
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
