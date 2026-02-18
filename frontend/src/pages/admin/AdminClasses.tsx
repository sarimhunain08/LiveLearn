import {
  BarChart3, Users, GraduationCap, BookOpen, Settings, Search
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const classes = [
  { id: 1, title: "Algebra Fundamentals", teacher: "Sarah Johnson", date: "Feb 12, 2026", enrolled: 24, attended: 0, duration: "60 min", status: "Scheduled" },
  { id: 2, title: "Introduction to Physics", teacher: "Dr. Michael Lee", date: "Feb 12, 2026", enrolled: 18, attended: 0, duration: "45 min", status: "Scheduled" },
  { id: 3, title: "English Literature", teacher: "Prof. Emily Davis", date: "Feb 11, 2026", enrolled: 30, attended: 28, duration: "90 min", status: "Live" },
  { id: 4, title: "Basic Chemistry", teacher: "Dr. Kim", date: "Feb 10, 2026", enrolled: 22, attended: 20, duration: "60 min", status: "Completed" },
  { id: 5, title: "Creative Writing", teacher: "Prof. Davis", date: "Feb 8, 2026", enrolled: 12, attended: 11, duration: "90 min", status: "Completed" },
];

export default function AdminClasses() {
  return (
    <DashboardLayout navItems={navItems} title="Manage Classes">
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search classes..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {["All", "Scheduled", "Live", "Completed", "Cancelled"].map(s => (
              <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr><th>Class</th><th>Teacher</th><th>Date</th><th>Enrolled</th><th>Attended</th><th>Duration</th><th>Status</th></tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground">{c.title}</td>
                  <td className="text-muted-foreground">{c.teacher}</td>
                  <td className="text-muted-foreground">{c.date}</td>
                  <td className="text-muted-foreground">{c.enrolled}</td>
                  <td className="text-muted-foreground">{c.attended}</td>
                  <td className="text-muted-foreground">{c.duration}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
