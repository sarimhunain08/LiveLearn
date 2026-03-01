import { useState, useEffect } from "react";
import { Loader2, Video } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { Link } from "react-router-dom";
import { teacherNav as navItems } from "@/lib/navItems";
import { ClassData } from "@/lib/types";

const capitalizeFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

function ClassTable({ classes }: { classes: ClassData[] }) {
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
    <>
      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-border">
        {classes.map((c) => (
          <div key={c._id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground text-sm">{c.title}</h4>
              <StatusBadge status={capitalizeFirst(c.status)} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">{capitalizeFirst(c.subject)}</span>
              <span>{formatClassDate(c)}</span>
              <span>{formatClassTime(c)}</span>
              <span>{c.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.enrolledStudents?.length || 0}/{c.maxStudents} enrolled</span>
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
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
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
    </>
  );
}

export default function TeacherClasses() {
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
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
        <div className="overflow-x-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="live" className="gap-1.5 text-xs sm:text-sm">
              {live.length > 0 && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-live" />}
              Live ({live.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed ({completed.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">Cancelled ({cancelled.length})</TabsTrigger>
          </TabsList>
        </div>

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
