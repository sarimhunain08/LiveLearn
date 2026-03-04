import { useState, useEffect } from "react";
import { BookOpen, Loader2, Calendar, TrendingUp, Search, Clock, GraduationCap, Sparkles, Zap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { studentNav as navItems } from "@/lib/navItems";
import { StudentStats, ClassData } from "@/lib/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
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
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-500/5 p-6 sm:p-8 border border-primary/10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/[0.04] rounded-full translate-y-1/2 blur-2xl" />
        <div className="absolute top-4 right-6 hidden sm:flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm px-3 py-1.5 text-[10px] font-semibold text-primary shadow-sm border border-primary/10">
          <Zap className="h-3 w-3" /> {today}
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> Welcome back
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Hey, <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">{user?.name?.split(" ")[0] || "Student"}</span>!
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {upcomingClasses.length > 0 
                ? `You have ${upcomingClasses.length} upcoming class${upcomingClasses.length > 1 ? "es" : ""}. Keep up the great work!`
                : "Browse teachers and subscribe to start learning."}
            </p>
          </div>
          <Link to="/student/browse">
            <Button className="gradient-primary text-primary-foreground border-0 gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
              <Search className="h-4 w-4" /> Browse Teachers
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Teachers" value={stats?.subscribedTeachers || 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Upcoming" value={stats?.upcomingClasses || 0} icon={<Calendar className="h-5 w-5" />} colorClass="bg-violet-500/10 text-violet-500" />
        <StatCard label="Attended" value={stats?.attendedClasses || 0} icon={<TrendingUp className="h-5 w-5" />} colorClass="bg-emerald-500/10 text-emerald-500" />
        <StatCard label="Total" value={stats?.totalClasses || 0} icon={<BookOpen className="h-5 w-5" />} colorClass="bg-blue-500/10 text-blue-500" />
      </div>

      {/* Upcoming Classes */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Calendar className="h-4 w-4 text-violet-500" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Upcoming Classes</h3>
        </div>
        <Link to="/student/classes" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors rounded-full bg-primary/5 px-3 py-1.5 hover:bg-primary/10">View All</Link>
      </div>

      {upcomingClasses.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30">
            <Calendar className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">No upcoming classes</p>
          <p className="text-xs text-muted-foreground/60 mb-5">Subscribe to teachers to see their classes here</p>
          <Link to="/student/browse">
            <Button className="gradient-primary text-primary-foreground border-0 rounded-xl h-9 px-5 text-sm shadow-md hover:-translate-y-0.5 transition-all" size="sm">Browse Teachers</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingClasses.slice(0, 6).map((c) => (
            <Link
              key={c._id}
              to={`/student/class/${c._id}`}
              className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5 block"
            >
              {/* Top color accent */}
              <div className={`h-1 bg-gradient-to-r ${c.status === "live" ? "from-red-500 to-rose-500" : "from-primary to-emerald-500"}`} />
              
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">{capitalizeFirst(c.subject)}</span>
                  <StatusBadge status={c.status === "live" ? "Live" : "Scheduled"} />
                </div>
                <h4 className="mb-2 font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg gradient-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                    {c.teacher?.name?.charAt(0) || "?"}
                  </div>
                  <span className="text-sm text-muted-foreground">{c.teacher?.name || "Unknown"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-1.5 rounded-lg bg-muted/30 px-2 py-1.5 text-[11px]">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    <span className="text-foreground font-medium">{formatClassDate(c)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-muted/30 px-2 py-1.5 text-[11px]">
                    <Clock className="h-3 w-3 text-violet-500" />
                    <span className="text-foreground font-medium">{formatClassTime(c)}</span>
                  </div>
                </div>
                {c.status === "live" ? (
                  <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white gap-1.5 rounded-lg pointer-events-none shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse-live" /> Join Live Class
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full pointer-events-none rounded-lg border-border/60">
                    View Details
                  </Button>
                )}
              </div>
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