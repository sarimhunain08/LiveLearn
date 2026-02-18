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

const students = [
  { id: 1, name: "Alex Chen", email: "alex@email.com", enrolled: 5, attended: 4, status: "Active", joined: "Jan 20, 2025" },
  { id: 2, name: "Maria Garcia", email: "maria@email.com", enrolled: 3, attended: 3, status: "Active", joined: "Feb 5, 2025" },
  { id: 3, name: "James Wilson", email: "james@email.com", enrolled: 7, attended: 5, status: "Active", joined: "Dec 10, 2024" },
  { id: 4, name: "Priya Patel", email: "priya@email.com", enrolled: 2, attended: 2, status: "Active", joined: "Jan 30, 2026" },
  { id: 5, name: "Liam Brown", email: "liam@email.com", enrolled: 4, attended: 1, status: "Suspended", joined: "Sep 15, 2025" },
];

export default function AdminStudents() {
  return (
    <DashboardLayout navItems={navItems} title="Manage Students">
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Enrolled</th><th>Attended</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {s.name.charAt(0)}
                      </div>
                      {s.name}
                    </div>
                  </td>
                  <td className="text-muted-foreground">{s.email}</td>
                  <td className="text-muted-foreground">{s.enrolled}</td>
                  <td className="text-muted-foreground">{s.attended}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="text-muted-foreground">{s.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
