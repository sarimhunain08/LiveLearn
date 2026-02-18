import { useState, useEffect } from "react";
import { Home, Plus, BookOpen, Users, DollarSign, Settings, Loader2, Video } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Create Class", path: "/teacher/create-class", icon: <Plus className="h-4 w-4" /> },
  { label: "My Classes", path: "/teacher/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/teacher/students", icon: <Users className="h-4 w-4" /> },
  { label: "Earnings", path: "#", icon: <DollarSign className="h-4 w-4 opacity-40" /> },
  { label: "Settings", path: "/teacher/settings", icon: <Settings className="h-4 w-4" /> },
];

const capitalizeFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

function ClassTable({ classes }: { classes: any[] }) {
  if (classes.length === 0) {
    return (
      <div className="py-16 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">No classes found</p>
        <Button className="mt-4 gradient-primary text-primary-foreground border-0" asChild>
          <a href="/teacher/create-class">Create your first class</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="dashboard-table">
        <thead>
          <tr><th>Class Title</th><th>Subject</th><th>Date</th><th>Time</th><th>Duration</th><th>Enrolled</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c._id}>
              <td className="font-medium text-foreground">{c.title}</td>
              <td><span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span></td>
              <td className="text-muted-foreground">{formatClassDate(c)}</td>
              <td className="text-muted-foreground">{formatClassTime(c)}</td>
              <td className="text-muted-foreground">{c.duration}</td>
              <td className="text-muted-foreground">{c.enrolledStudents?.length || 0}/{c.maxStudents}</td>
              <td><StatusBadge status={capitalizeFirst(c.status)} /></td>
              <td>
                {(c.status === "scheduled" || c.status === "live") && (
                  <Button size="sm" variant={c.status === "live" ? "destructive" : "outline"} className="gap-1" asChild>
                    <Link to={`/teacher/meeting/${c._id}`}>
                      <Video className="h-3.5 w-3.5" />
                      {c.status === "live" ? "Join" : "Start"}
                    </Link>
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TeacherClasses() {
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.getMyClasses();
        setAllClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const upcoming = allClasses.filter(c => c.status === "scheduled");
  const live = allClasses.filter(c => c.status === "live");
  const completed = allClasses.filter(c => c.status === "completed");
  const cancelled = allClasses.filter(c => c.status === "cancelled");

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="My Classes">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="My Classes">
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="live" className="gap-1.5">
            {live.length > 0 && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-live" />}
            Live ({live.length})
          </TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
        </TabsList>

        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <TabsContent value="upcoming" className="m-0"><ClassTable classes={upcoming} /></TabsContent>
          <TabsContent value="live" className="m-0"><ClassTable classes={live} /></TabsContent>
          <TabsContent value="completed" className="m-0"><ClassTable classes={completed} /></TabsContent>
          <TabsContent value="cancelled" className="m-0"><ClassTable classes={cancelled} /></TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
