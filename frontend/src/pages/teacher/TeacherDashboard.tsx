import { useState, useEffect } from "react";
import { Loader2, Video, Calendar, TrendingUp, Clock, Square, Plus, Users, BookOpen, ArrowRight, Sparkles, Zap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { teacherNav as navItems } from "@/lib/navItems";
import { getErrorMessage, ClassData } from "@/lib/types";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0, completedClasses: 0, upcomingClasses: 0, teachingMinutes: 0 });
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [endingClassId, setEndingClassId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, classesRes] = await Promise.all([api.getTeacherStats(), api.getMyClasses()]);
        setStats(statsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const handleEndClass = async (classId: string) => {
    setEndingClassId(classId);
    try {
      await api.endClass(classId);
      toast({ title: "Class ended successfully" });
      const [statsRes, classesRes] = await Promise.all([api.getTeacherStats(), api.getMyClasses()]);
      setStats(statsRes.data);
      setClasses(classesRes.data);
    } catch (err: unknown) {
      toast({ title: "Failed to end class", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setEndingClassId(null);
    }
  };

  const fmtTime = (m: number) => {
    if (!m || isNaN(m)) return "0h";
    const h = Math.floor(m / 60), min = m % 60;
    return min > 0 ? `${h}h ${min}m` : `${h}h`;
  };

  const upcomingClasses = classes.filter(c => c.status === "scheduled" || c.status === "live");
  const liveClasses = classes.filter(c => c.status === "live");

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Dashboard">
      {/* Hero Welcome */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-500/5 p-6 sm:p-8 border border-primary/10">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/[0.04] rounded-full translate-y-1/2 blur-2xl" />
        <div className="absolute top-4 right-6 hidden sm:flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm px-3 py-1.5 text-[10px] font-semibold text-primary shadow-sm border border-primary/10">
          <Zap className="h-3 w-3" /> Dashboard
        </div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> {greeting()}
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">{user?.name?.split(" ")[0] || "Teacher"}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {liveClasses.length > 0
                ? `You have ${liveClasses.length} live class${liveClasses.length > 1 ? "es" : ""} happening right now!`
                : upcomingClasses.length > 0
                  ? `You have ${upcomingClasses.length} upcoming class${upcomingClasses.length > 1 ? "es" : ""} scheduled.`
                  : "No classes scheduled yet. Create your first class to get started!"}
            </p>
          </div>
          <Link to="/teacher/create-class">
            <Button className="gradient-primary text-primary-foreground border-0 gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
              <Plus className="h-4 w-4" /> Create Class
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard label="Students" value={stats.totalStudents} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Upcoming" value={stats.upcomingClasses} icon={<Calendar className="h-5 w-5" />} colorClass="bg-violet-500/10 text-violet-500" />
        <StatCard label="Completed" value={stats.completedClasses} icon={<TrendingUp className="h-5 w-5" />} colorClass="bg-emerald-500/10 text-emerald-500" />
        <StatCard label="Teaching" value={fmtTime(stats.teachingMinutes)} icon={<Clock className="h-5 w-5" />} colorClass="bg-amber-500/10 text-amber-500" />
        <StatCard label="Total" value={stats.totalClasses} icon={<BookOpen className="h-5 w-5" />} colorClass="bg-blue-500/10 text-blue-500" />
      </div>

      {/* Live Classes Alert */}
      {liveClasses.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/5 via-red-500/[0.03] to-transparent p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Live Now</h3>
          </div>
          <div className="space-y-3">
            {liveClasses.map(c => (
              <div key={c._id} className="flex items-center justify-between rounded-xl bg-card border border-border/60 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground text-sm truncate">{c.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{cap(c.subject)} &middot; {c.enrolledStudents?.length || 0} students</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" onClick={() => handleEndClass(c._id)} disabled={endingClassId === c._id}>
                    <Square className="h-3 w-3" />
                    {endingClassId === c._id ? "Ending..." : "End"}
                  </Button>
                  <Button size="sm" className="gap-1.5 h-8 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm" asChild>
                    <Link to={`/teacher/meeting/${c._id}`}>
                      <Video className="h-3 w-3" /> Join
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Classes */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/40 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Calendar className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Upcoming Classes</h2>
              <p className="text-[10px] text-muted-foreground">{upcomingClasses.filter(c => c.status === "scheduled").length} classes scheduled</p>
            </div>
          </div>
          <Link to="/teacher/classes" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors rounded-full bg-primary/5 px-3 py-1.5 hover:bg-primary/10">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingClasses.filter(c => c.status === "scheduled").length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
              <Calendar className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No upcoming classes</p>
            <p className="text-xs text-muted-foreground/60 mb-5">Schedule a class to start teaching</p>
            <Link to="/teacher/create-class">
              <Button className="gradient-primary text-primary-foreground border-0 rounded-xl h-9 px-5 text-sm shadow-md hover:-translate-y-0.5 transition-all" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Class
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="sm:hidden divide-y divide-border/40">
              {upcomingClasses.filter(c => c.status === "scheduled").slice(0, 5).map((c) => (
                <div key={c._id} className="p-4 space-y-2.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-foreground text-sm truncate">{c.title}</h4>
                    <StatusBadge status={cap(c.status)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">{cap(c.subject)}</span>
                    <span>{formatClassDate(c)}</span>
                    <span>{formatClassTime(c)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{c.enrolledStudents?.length || 0}/{c.maxStudents} enrolled</span>
                    <Button size="sm" variant="outline" className="gap-1 h-7 text-xs rounded-lg" asChild>
                      <Link to={`/teacher/meeting/${c._id}`}><Video className="h-3 w-3" /> Start</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr><th>Class</th><th>Subject</th><th>Date</th><th>Time</th><th>Enrolled</th><th>Status</th><th className="text-right">Action</th></tr>
                </thead>
                <tbody>
                  {upcomingClasses.filter(c => c.status === "scheduled").slice(0, 5).map((c) => (
                    <tr key={c._id} className="hover:bg-muted/20 transition-colors">
                      <td className="font-semibold text-foreground">{c.title}</td>
                      <td><span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{cap(c.subject)}</span></td>
                      <td className="text-muted-foreground text-sm">{formatClassDate(c)}</td>
                      <td className="text-muted-foreground text-sm">{formatClassTime(c)}</td>
                      <td>
                        <span className="text-sm text-muted-foreground">{c.enrolledStudents?.length || 0}<span className="text-muted-foreground/40">/{c.maxStudents}</span></span>
                      </td>
                      <td><StatusBadge status={cap(c.status)} /></td>
                      <td className="text-right">
                        <Button size="sm" variant="outline" className="gap-1.5 h-8 rounded-lg text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hover:-translate-y-0.5 hover:shadow-md" asChild>
                          <Link to={`/teacher/meeting/${c._id}`}><Video className="h-3.5 w-3.5" /> Start Class</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
