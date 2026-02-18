import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Search
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const teachers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", subjects: ["Math", "Science"], classes: 24, students: 156, status: "Active", joined: "Jan 15, 2025" },
  { id: 2, name: "Dr. Michael Lee", email: "michael@email.com", subjects: ["Physics"], classes: 18, students: 98, status: "Active", joined: "Mar 2, 2025" },
  { id: 3, name: "Prof. Emily Davis", email: "emily@email.com", subjects: ["English", "Literature"], classes: 32, students: 210, status: "Active", joined: "Nov 20, 2024" },
  { id: 4, name: "Mr. Rivera", email: "rivera@email.com", subjects: ["Art"], classes: 8, students: 45, status: "Pending", joined: "Feb 1, 2026" },
  { id: 5, name: "Dr. Kim", email: "kim@email.com", subjects: ["Chemistry"], classes: 15, students: 88, status: "Active", joined: "Jul 10, 2025" },
];

export default function AdminTeachers() {
  return (
    <DashboardLayout navItems={navItems} title="Manage Teachers">
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search teachers..." className="pl-10" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {/* Mobile card view */}
        <div className="sm:hidden divide-y divide-border">
          {teachers.map((t) => (
            <div key={t.id} className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="flex flex-wrap gap-1 pl-11">
                {t.subjects.map(s => (
                  <span key={s} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pl-11">
                <span>Classes: {t.classes}</span>
                <span>Students: {t.students}</span>
                <span>Joined: {t.joined}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Subjects</th><th>Classes</th><th>Students</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {t.name.charAt(0)}
                      </div>
                      {t.name}
                    </div>
                  </td>
                  <td className="text-muted-foreground">{t.email}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map(s => (
                        <span key={s} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-muted-foreground">{t.classes}</td>
                  <td className="text-muted-foreground">{t.students}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="text-muted-foreground">{t.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
