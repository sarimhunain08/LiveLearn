import { useState, useEffect, useCallback } from "react";
import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Search,
  Loader2, AlertCircle, Mail
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function AdminClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminClasses({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setClasses(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchClasses, 300);
    return () => clearTimeout(timeout);
  }, [fetchClasses]);

  return (
    <DashboardLayout navItems={navItems} title="Manage Classes">
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {["All", "Scheduled", "Live", "Completed", "Cancelled"].map(s => (
              <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-destructive font-medium">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchClasses}>
            Retry
          </Button>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No classes found{search ? ` for "${search}"` : ""}.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Mobile card view */}
          <div className="sm:hidden divide-y divide-border">
            {classes.map((c) => (
              <div key={c._id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">{c.title}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-muted-foreground">{c.teacher?.name || "Unknown"}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{c.subject}</span>
                  <span>Enrolled: {c.enrolledStudents?.length ?? 0}</span>
                  <span>{c.duration ?? 60} min</span>
                  <span>{new Date(c.classDateTime || c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr><th>Class</th><th>Teacher</th><th>Subject</th><th>Date</th><th>Enrolled</th><th>Duration</th><th>Status</th></tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c._id}>
                    <td className="font-medium text-foreground">{c.title}</td>
                    <td className="text-muted-foreground">{c.teacher?.name || "Unknown"}</td>
                    <td className="text-muted-foreground">{c.subject}</td>
                    <td className="text-muted-foreground">{new Date(c.classDateTime || c.createdAt).toLocaleDateString()}</td>
                    <td className="text-muted-foreground">{c.enrolledStudents?.length ?? 0}</td>
                    <td className="text-muted-foreground">{c.duration ?? 60} min</td>
                    <td><StatusBadge status={c.status} /></td>
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
