import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Download, FileText
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const reports = [
  { title: "User Growth Report", desc: "New user registrations over time", icon: Users },
  { title: "Class Performance Report", desc: "Attendance rates and class metrics", icon: BookOpen },
  { title: "Teacher Performance Report", desc: "Teaching hours and student feedback", icon: GraduationCap },
  { title: "Revenue Report", desc: "Monthly earnings and subscriptions", icon: BarChart3 },
];

export default function AdminReports() {
  return (
    <DashboardLayout navItems={navItems} title="Reports & Analytics">
      <div className="mb-6 flex gap-3">
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
        <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((r) => (
          <div key={r.title} className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <r.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{r.title}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
