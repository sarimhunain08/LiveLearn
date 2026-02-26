import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Search,
  Loader2, AlertCircle, Trash2, Power, Mail
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminStudents({ search: search || undefined });
      setStudents(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  const handleToggleActive = async (id: string) => {
    setActionLoading(id);
    try {
      await api.toggleUserActive(id);
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err: any) {
      alert(err.message || "Failed to toggle status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      await api.deleteUser(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete student");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Manage Students">
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-destructive font-medium">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchStudents}>
            Retry
          </Button>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No students found{search ? ` for "${search}"` : ""}.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Mobile card view */}
          <div className="sm:hidden divide-y divide-border">
            {students.map((s) => (
              <div key={s._id} className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {s.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                  </div>
                  <StatusBadge status={s.isActive ? "Active" : "Suspended"} />
                </div>
                <div className="flex items-center justify-between pl-11">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>Enrolled: {s.enrolledCount ?? 0}</span>
                    <span>Joined: {new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      disabled={actionLoading === s._id}
                      onClick={() => handleToggleActive(s._id)}
                      title={s.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power className={`h-3.5 w-3.5 ${s.isActive ? "text-success" : "text-muted-foreground"}`} />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                      disabled={actionLoading === s._id}
                      onClick={() => handleDelete(s._id, s.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Enrolled Classes</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td className="font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {s.name?.charAt(0)}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td className="text-muted-foreground">{s.email}</td>
                    <td className="text-muted-foreground">{s.enrolledCount ?? 0}</td>
                    <td><StatusBadge status={s.isActive ? "Active" : "Suspended"} /></td>
                    <td className="text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          disabled={actionLoading === s._id}
                          onClick={() => handleToggleActive(s._id)}
                          title={s.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power className={`h-4 w-4 ${s.isActive ? "text-success" : "text-muted-foreground"}`} />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={actionLoading === s._id}
                          onClick={() => handleDelete(s._id, s.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
