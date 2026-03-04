import { useState, useEffect } from "react";
import { Loader2, Users, Search, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { teacherNav as navItems } from "@/lib/navItems";
import { User } from "@/lib/types";

interface StudentUser extends User {
  type?: string;
  enrolledClasses?: number;
}

export default function TeacherStudents() {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = students.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const enrolledCount = students.filter(s => s.type === "enrolled").length;
  const subscriberCount = students.length - enrolledCount;

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Your Students</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground">{students.length} total</span>
            {enrolledCount > 0 && (
              <span className="text-xs text-muted-foreground">{enrolledCount} enrolled</span>
            )}
            {subscriberCount > 0 && (
              <span className="text-xs text-muted-foreground">{subscriberCount} subscribers</span>
            )}
          </div>
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9 h-10 rounded-xl border-border/60 focus:border-primary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card py-20 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {search ? "No students match your search" : "No students yet"}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {search ? "Try a different search term" : "Students will appear here when they enroll or subscribe"}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          {/* Mobile rows */}
          <div className="sm:hidden divide-y divide-border/50">
            {filtered.map((s) => (
              <div key={s._id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground">
                      {s.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-semibold text-foreground text-sm">{s.name}</span>
                  </div>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                    s.type === "enrolled"
                      ? "bg-primary/10 text-primary ring-primary/20"
                      : "bg-muted text-muted-foreground ring-border"
                  }`}>
                    {s.type === "enrolled" ? "Enrolled" : "Subscriber"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
                  <BookOpen className="h-3 w-3" />
                  <span>{s.enrolledClasses || 0} classes</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Classes Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground">
                          {s.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        s.type === "enrolled"
                          ? "bg-primary/10 text-primary ring-primary/20"
                          : "bg-muted text-muted-foreground ring-border"
                      }`}>
                        {s.type === "enrolled" ? "Enrolled" : "Subscriber"}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{s.enrolledClasses || 0}</td>
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
