import { useState, useEffect } from "react";
import { Loader2, Video, BookOpen, Search, Plus } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { Link } from "react-router-dom";
import { teacherNav as navItems } from "@/lib/navItems";
import { ClassData } from "@/lib/types";

const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

function getActualDuration(c: ClassData): string {
  if (c.status !== "completed") return "--";
  if (c.liveAt && c.completedAt) {
    const start = new Date(c.liveAt).getTime();
    const end = new Date(c.completedAt).getTime();
    const diffMs = end - start;
    if (diffMs <= 0) return c.duration || "--";
    const mins = Math.round(diffMs / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  }
  return c.duration || "--";
}

function ClassTable({ classes, emptyMsg }: { classes: ClassData[]; emptyMsg: string }) {
  if (classes.length === 0) {
    return (
      <div className="py-16 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
        <p className="text-sm font-medium text-muted-foreground mb-1">{emptyMsg}</p>
        <p className="text-xs text-muted-foreground/60 mb-5">Create a class to get started</p>
        <Button className="gradient-primary text-primary-foreground border-0 rounded-xl h-9 px-5 text-sm" asChild>
          <Link to="/teacher/create-class"><Plus className="h-3.5 w-3.5 mr-1.5" /> Create Class</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile rows */}
      <div className="sm:hidden divide-y divide-border/50">
        {classes.map(c => {
          const isActive = c.status === "scheduled" || c.status === "live";
          return (
            <div key={c._id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-sm">{c.title}</h4>
                <StatusBadge status={cap(c.status)} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">{cap(c.subject)}</span>
                <span>{formatClassDate(c)}</span>
                <span>{formatClassTime(c)}</span>
                <span>Duration: {getActualDuration(c)}</span>
                <span>{c.enrolledStudents?.length || 0}/{c.maxStudents} students</span>
              </div>
              {isActive && (
                <Button size="sm" variant={c.status === "live" ? "destructive" : "outline"} className="gap-1.5 h-7 text-xs" asChild>
                  <Link to={`/teacher/meeting/${c._id}`}>
                    <Video className="h-3 w-3" />
                    {c.status === "live" ? "Join" : "Start"}
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Students</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => {
              const isActive = c.status === "scheduled" || c.status === "live";
              return (
                <tr key={c._id}>
                  <td className="font-medium text-foreground">{c.title}</td>
                  <td>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{cap(c.subject)}</span>
                  </td>
                  <td className="text-muted-foreground">{formatClassDate(c)}</td>
                  <td className="text-muted-foreground">{formatClassTime(c)}</td>
                  <td className="text-muted-foreground">{getActualDuration(c)}</td>
                  <td className="text-muted-foreground">{c.enrolledStudents?.length || 0}/{c.maxStudents}</td>
                  <td><StatusBadge status={cap(c.status)} /></td>
                  <td>
                    {isActive && (
                      <Button size="sm" variant={c.status === "live" ? "destructive" : "outline"} className="gap-1.5 h-7 text-xs" asChild>
                        <Link to={`/teacher/meeting/${c._id}`}>
                          <Video className="h-3 w-3" />
                          {c.status === "live" ? "Join" : "Start"}
                        </Link>
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function TeacherClasses() {
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = allClasses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter(c => c.status === "scheduled");
  const live = filtered.filter(c => c.status === "live");
  const completed = filtered.filter(c => c.status === "completed");
  const cancelled = filtered.filter(c => c.status === "cancelled");

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Classes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{allClasses.length} total classes across all categories</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              className="pl-9 h-10 rounded-xl bg-background/50 border-border/50 focus:border-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="gradient-primary text-primary-foreground border-0 h-10 rounded-xl gap-1.5 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all" asChild>
            <Link to="/teacher/create-class"><Plus className="h-4 w-4" /> New</Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={live.length > 0 ? "live" : "upcoming"} className="space-y-4">
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList className="w-full sm:w-auto bg-muted/30 p-1 rounded-xl border border-border/40">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-card">
              Upcoming <span className="ml-1 text-muted-foreground/60">({upcoming.length})</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-1.5 text-xs sm:text-sm rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-card">
              {live.length > 0 && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
              Live <span className="ml-1 text-muted-foreground/60">({live.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-card">
              Completed <span className="ml-1 text-muted-foreground/60">({completed.length})</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-card">
              Cancelled <span className="ml-1 text-muted-foreground/60">({cancelled.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <TabsContent value="upcoming" className="m-0">
            <ClassTable classes={upcoming} emptyMsg="No upcoming classes" />
          </TabsContent>
          <TabsContent value="live" className="m-0">
            <ClassTable classes={live} emptyMsg="No live classes right now" />
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            <ClassTable classes={completed} emptyMsg="No completed classes yet" />
          </TabsContent>
          <TabsContent value="cancelled" className="m-0">
            <ClassTable classes={cancelled} emptyMsg="No cancelled classes" />
          </TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
