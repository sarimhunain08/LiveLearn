import {
  BarChart3, Users, GraduationCap, BookOpen, Activity, Server,
  Settings
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const recentActivity = [
  { type: "signup", text: "New teacher registered: Dr. Sarah Kim", time: "5 min ago" },
  { type: "class", text: "English Literature class completed", time: "1 hour ago" },
  { type: "signup", text: "3 new students enrolled", time: "2 hours ago" },
  { type: "class", text: "Physics class started by Dr. Lee", time: "3 hours ago" },
  { type: "signup", text: "New teacher registered: Prof. Williams", time: "5 hours ago" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        <StatCard label="Teachers" value={48} icon={<GraduationCap className="h-5 w-5" />} trend="+3 this week" />
        <StatCard label="Students" value={1240} icon={<Users className="h-5 w-5" />} colorClass="bg-accent/10 text-accent" trend="+28 this week" />
        <StatCard label="Total Classes" value={312} icon={<BookOpen className="h-5 w-5" />} colorClass="bg-success/10 text-success" />
        <StatCard label="Live Now" value={5} icon={<Activity className="h-5 w-5" />} colorClass="bg-destructive/10 text-destructive" />
        <StatCard label="Revenue" value="$12.4K" icon={<BarChart3 className="h-5 w-5" />} colorClass="bg-warning/10 text-warning" />
        <StatCard label="Uptime" value="99.9%" icon={<Server className="h-5 w-5" />} colorClass="bg-success/10 text-success" />
      </div>

      {/* Charts placeholder + Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart placeholder */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Weekly User Growth</h3>
          <div className="flex h-48 items-end gap-2">
            {[40, 55, 35, 70, 60, 80, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md gradient-primary transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${a.type === "signup" ? "bg-success" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
