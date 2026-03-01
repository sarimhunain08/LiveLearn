import { useState, useEffect } from "react";
import { Home, Plus, BookOpen, Users, Settings, Loader2, Video, Calendar, TrendingUp, Clock, Square } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Create Class", path: "/teacher/create-class", icon: <Plus className="h-4 w-4" /> },
  { label: "My Classes", path: "/teacher/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/teacher/students", icon: <Users className="h-4 w-4" /> },
  { label: "Settings", path: "/teacher/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0, completedClasses: 0, upcomingClasses: 0, teachingMinutes: 0 });
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [endingClassId, setEndingClassId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, classesRes] = await Promise.all([
          api.getTeacherStats(),
          api.getMyClasses(),
        ]);
        setStats(statsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Poll every 30s to auto-detect live status changes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const capitalizeFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const handleEndClass = async (classId: string) => {
    setEndingClassId(classId);
    try {
      await api.endClass(classId);
      toast({ title: "Class ended successfully" });
      // Refresh data
      const [statsRes, classesRes] = await Promise.all([
        api.getTeacherStats(),
        api.getMyClasses(),
      ]);
      setStats(statsRes.data);
      setClasses(classesRes.data);
    } catch (err: any) {
      toast({ title: "Failed to end class", description: err.message, variant: "destructive" });
    } finally {
      setEndingClassId(null);
    }
  };

  const formatTeachingTime = (minutes: number) => {
    if (!minutes || isNaN(minutes)) return "0 min";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  // Only show upcoming/live classes in dashboard table
  const upcomingClasses = classes.filter(c => c.status === "scheduled" || c.status === "live");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Teacher Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Teacher Dashboard">
      {/* Welcome Section */}
      <div className="mb-6 rounded-xl border border-border bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0] || "Teacher"}!</h2>
            <p className="text-sm text-muted-foreground mt-1">{today}</p>
          </div>
          <Link to="/teacher/create-class">
            <Button className="gradient-primary text-primary-foreground border-0 gap-2 shadow-md">
              <Plus className="h-4 w-4" /> Create New Class
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        <StatCard label="Total Students" value={stats.totalStudents} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Upcoming" value={stats.upcomingClasses} icon={<Calendar className="h-5 w-5" />} colorClass="bg-accent/10 text-accent" />
        <StatCard label="Completed" value={stats.completedClasses} icon={<TrendingUp className="h-5 w-5" />} colorClass="bg-success/10 text-success" />
        <StatCard label="Teaching Hours" value={formatTeachingTime(stats.teachingMinutes)} icon={<Clock className="h-5 w-5" />} colorClass="bg-primary/10 text-primary" />
        <StatCard label="Total Classes" value={stats.totalClasses} icon={<BookOpen className="h-5 w-5" />} colorClass="bg-warning/10 text-warning" />
      </div>

      {/* Upcoming Classes */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Upcoming Classes</h2>
          <Link to="/teacher/classes" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        {upcomingClasses.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-1">No upcoming classes scheduled</p>
            <p className="text-xs text-muted-foreground mb-4">Create a class to get started</p>
            <Link to="/teacher/create-class">
              <Button className="gradient-primary text-primary-foreground border-0" size="sm">Create a Class</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Card view on mobile, table on desktop */}
            <div className="sm:hidden divide-y divide-border">
              {upcomingClasses.map((c) => (
                <div key={c._id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">{c.title}</span>
                    <StatusBadge status={capitalizeFirst(c.status)} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span>
                    <span>{formatClassDate(c)}</span>
                    <span>{formatClassTime(c)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{c.duration}</span>
                    <div className="flex items-center gap-1.5">
                      {c.status === "live" && (
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleEndClass(c._id)} disabled={endingClassId === c._id}>
                          <Square className="h-3 w-3" />
                          {endingClassId === c._id ? "Ending..." : "End"}
                        </Button>
                      )}
                      {(c.status === "scheduled" || c.status === "live") && (
                        <Button size="sm" variant={c.status === "live" ? "destructive" : "outline"} className="gap-1 h-7 text-xs" asChild>
                          <Link to={`/teacher/meeting/${c._id}`}>
                            <Video className="h-3 w-3" />
                            {c.status === "live" ? "Join" : "Start"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Class Title</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingClasses.map((c) => (
                    <tr key={c._id}>
                      <td className="font-medium text-foreground">{c.title}</td>
                      <td><span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span></td>
                      <td className="text-muted-foreground">{formatClassDate(c)}</td>
                      <td className="text-muted-foreground">{formatClassTime(c)}</td>
                      <td><StatusBadge status={capitalizeFirst(c.status)} /></td>
                      <td>
                        <div className="flex items-center gap-2">
                          {c.status === "live" && (
                            <Button size="sm" variant="outline" className="gap-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleEndClass(c._id)} disabled={endingClassId === c._id}>
                              <Square className="h-3.5 w-3.5" />
                              {endingClassId === c._id ? "Ending..." : "End Class"}
                            </Button>
                          )}
                          {(c.status === "scheduled" || c.status === "live") && (
                            <Button size="sm" variant={c.status === "live" ? "destructive" : "outline"} className="gap-1" asChild>
                              <Link to={`/teacher/meeting/${c._id}`}>
                                <Video className="h-3.5 w-3.5" />
                                {c.status === "live" ? "Join" : "Start"}
                              </Link>
                            </Button>
                          )}
                        </div>
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
