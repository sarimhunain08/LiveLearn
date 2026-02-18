import { useState, useEffect } from "react";
import { Home, Plus, BookOpen, Users, DollarSign, Settings, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { api } from "@/lib/api";

const navItems = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Create Class", path: "/teacher/create-class", icon: <Plus className="h-4 w-4" /> },
  { label: "My Classes", path: "/teacher/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/teacher/students", icon: <Users className="h-4 w-4" /> },
  { label: "Earnings", path: "#", icon: <DollarSign className="h-4 w-4 opacity-40" /> },
  { label: "Settings", path: "/teacher/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.getMyStudents();
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Students">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Students">
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">All Students ({students.length})</h2>
        </div>
        {students.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No students enrolled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Enrolled Classes</th><th>Type</th><th>Status</th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td className="font-medium text-foreground flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {s.name?.charAt(0) || "?"}
                      </div>
                      {s.name}
                    </td>
                    <td className="text-muted-foreground">{s.email}</td>
                    <td className="text-muted-foreground">{s.enrolledClasses || 0}</td>
                    <td>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.type === "enrolled"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {s.type === "enrolled" ? "Enrolled" : "Subscriber"}
                      </span>
                    </td>
                    <td><StatusBadge status="Active" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
