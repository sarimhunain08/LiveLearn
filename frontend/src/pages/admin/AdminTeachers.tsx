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

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminTeachers({ search: search || undefined });
      setTeachers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchTeachers, 300);
    return () => clearTimeout(timeout);
  }, [fetchTeachers]);

  const handleToggleActive = async (id: string) => {
    setActionLoading(id);
    try {
      await api.toggleUserActive(id);
      setTeachers((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isActive: !t.isActive } : t))
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
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete teacher");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Manage Teachers">
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
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
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchTeachers}>
            Retry
          </Button>
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <GraduationCap className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No teachers found{search ? ` for "${search}"` : ""}.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Mobile card view */}
          <div className="sm:hidden divide-y divide-border">
            {teachers.map((t) => (
              <div key={t._id} className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {t.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                  </div>
                  <StatusBadge status={t.isActive ? "Active" : "Suspended"} />
                </div>
                <div className="flex flex-wrap gap-1 pl-11">
                  {(t.subjects || []).map((s: string) => (
                    <span key={s} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pl-11">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>Classes: {t.classCount ?? 0}</span>
                    <span>Students: {t.studentCount ?? 0}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      disabled={actionLoading === t._id}
                      onClick={() => handleToggleActive(t._id)}
                      title={t.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power className={`h-3.5 w-3.5 ${t.isActive ? "text-success" : "text-muted-foreground"}`} />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                      disabled={actionLoading === t._id}
                      onClick={() => handleDelete(t._id, t.name)}
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
                <tr><th>Name</th><th>Email</th><th>Subjects</th><th>Classes</th><th>Students</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t._id}>
                    <td className="font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {t.name?.charAt(0)}
                        </div>
                        {t.name}
                      </div>
                    </td>
                    <td className="text-muted-foreground">{t.email}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(t.subjects || []).map((s: string) => (
                          <span key={s} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="text-muted-foreground">{t.classCount ?? 0}</td>
                    <td className="text-muted-foreground">{t.studentCount ?? 0}</td>
                    <td><StatusBadge status={t.isActive ? "Active" : "Suspended"} /></td>
                    <td>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          disabled={actionLoading === t._id}
                          onClick={() => handleToggleActive(t._id)}
                          title={t.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power className={`h-4 w-4 ${t.isActive ? "text-success" : "text-muted-foreground"}`} />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={actionLoading === t._id}
                          onClick={() => handleDelete(t._id, t.name)}
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
