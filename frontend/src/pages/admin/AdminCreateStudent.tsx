import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Mail,
  Loader2, AlertCircle, CheckCircle2, ArrowLeft, Plus,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Messages", path: "/admin/contacts", icon: <Mail className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function AdminCreateStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
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
        role: "student",
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout title="Create Student" navItems={navItems} role="admin">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Student Created Successfully!</h2>
          <p className="text-muted-foreground mb-6">The student account has been created and is ready to use.</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/admin/students")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
            </Button>
            <Button onClick={() => { setSuccess(false); setForm({ name: "", email: "", password: "" }); }}>
              <Plus className="h-4 w-4 mr-2" /> Create Another
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Student" navItems={navItems} role="admin">
      <div className="max-w-lg mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
        </Button>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> New Student Account
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Student Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="student@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/students")}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Student
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
