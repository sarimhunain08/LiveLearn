import { useState, useEffect } from "react";
import { Home, BookOpen, Search, Clock, Settings, Loader2, Users, Calendar, TrendingUp, GraduationCap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";

const navItems = [
  { label: "Dashboard", path: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", path: "/student/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Browse Teachers", path: "/student/browse", icon: <Search className="h-4 w-4" /> },
  { label: "My Teachers", path: "/student/my-teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Settings", path: "/student/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, classesRes] = await Promise.all([
          api.getStudentStats(),
          api.getSubscribedClasses(),
        ]);
        setStats(statsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        console.error("Failed to fetch student dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Poll every 30s to auto-detect live status changes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Student Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const upcomingClasses = classes.filter(
    (c) => c.status === "scheduled" || c.status === "live"
  );

  return (
    <DashboardLayout navItems={navItems} title="Student Dashboard">
      {/* Welcome Section */}
      <div className="mb-6 rounded-xl border border-border bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0] || "Student"}!</h2>
            <p className="text-sm text-muted-foreground mt-1">{today}</p>
          </div>
          <Link to="/student/browse">
            <Button className="gradient-primary text-primary-foreground border-0 gap-2 shadow-md">
              <Search className="h-4 w-4" /> Browse Teachers
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Teachers" value={stats?.subscribedTeachers || 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Upcoming" value={stats?.upcomingClasses || 0} icon={<Calendar className="h-5 w-5" />} colorClass="bg-accent/10 text-accent" />
        <StatCard label="Attended" value={stats?.attendedClasses || 0} icon={<TrendingUp className="h-5 w-5" />} colorClass="bg-success/10 text-success" />
        <StatCard label="Total Classes" value={stats?.totalClasses || 0} icon={<BookOpen className="h-5 w-5" />} />
      </div>

      {/* Upcoming Classes */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Classes</h3>
        <Link to="/student/classes" className="text-sm text-primary hover:underline">View All</Link>
      </div>

      {upcomingClasses.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground mb-1">No upcoming classes</p>
          <p className="text-xs text-muted-foreground mb-4">Subscribe to teachers to see their classes here</p>
          <Link to="/student/browse">
            <Button className="gradient-primary text-primary-foreground border-0" size="sm">Browse Teachers</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingClasses.slice(0, 6).map((c) => (
            <Link
              key={c._id}
              to={`/student/class/${c._id}`}
              className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 block"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span>
                <StatusBadge status={c.status === "live" ? "Live" : "Scheduled"} />
              </div>
              <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">{c.title}</h4>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-[10px] font-semibold text-primary-foreground">
                  {c.teacher?.name?.charAt(0) || "?"}
                </div>
                <span className="text-sm text-muted-foreground">{c.teacher?.name || "Unknown"}</span>
              </div>
              <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatClassDate(c)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatClassTime(c)}</span>
              </div>
              {c.status === "live" ? (
                <Button size="sm" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1 pointer-events-none">
                  <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse-live" /> Join Live Class
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="w-full pointer-events-none">
                  View Details
                </Button>
              )}
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function capitalizeFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}