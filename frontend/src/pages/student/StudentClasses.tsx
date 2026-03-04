import { useState, useEffect } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { Link } from "react-router-dom";
import { studentNav as navItems } from "@/lib/navItems";
import { ClassData } from "@/lib/types";

function capitalizeFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

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

export default function StudentClasses() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.getSubscribedClasses();
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="My Classes">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const enrolled = classes.filter(c => c.status === "scheduled" || c.status === "live");
  const completed = classes.filter(c => c.status === "completed");

  const renderTable = (list: ClassData[], emptyMsg: string) => (
    list.length === 0 ? (
      <div className="py-16 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
        <p className="text-sm font-medium text-muted-foreground mb-1">{emptyMsg}</p>
        <p className="text-xs text-muted-foreground/60 mb-5">Browse and subscribe to teachers to enroll</p>
        <Link to="/student/browse">
          <Button className="gradient-primary text-primary-foreground border-0 rounded-xl h-9 px-5 text-sm" size="sm">Browse Teachers</Button>
        </Link>
      </div>
    ) : (
      <>
        {/* Mobile rows */}
        <div className="sm:hidden divide-y divide-border/50">
          {list.map(c => (
            <Link key={c._id} to={`/student/class/${c._id}`} className="block p-4 space-y-2 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-sm">{c.title}</h4>
                <StatusBadge status={c.status === "live" ? "Live" : c.status === "scheduled" ? "Scheduled" : "Completed"} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{c.teacher?.name || "Unknown"}</span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">{capitalizeFirst(c.subject)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatClassDate(c)} · {formatClassTime(c)} · Duration: {getActualDuration(c)}
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c._id}>
                  <td className="font-medium text-foreground">
                    <Link to={`/student/class/${c._id}`} className="hover:text-primary transition-colors">
                      {c.title}
                    </Link>
                  </td>
                  <td className="text-muted-foreground">{c.teacher?.name || "Unknown"}</td>
                  <td>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span>
                  </td>
                  <td className="text-muted-foreground">{formatClassDate(c)}</td>
                  <td className="text-muted-foreground">{formatClassTime(c)}</td>
                  <td className="text-muted-foreground">{getActualDuration(c)}</td>
                  <td><StatusBadge status={c.status === "live" ? "Live" : c.status === "scheduled" ? "Scheduled" : "Completed"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  );

  return (
    <DashboardLayout navItems={navItems} title="My Classes">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Classes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{classes.length} total classes enrolled</p>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="space-y-4">
        <TabsList className="bg-muted/30 border border-border/40 p-1 rounded-xl">
          <TabsTrigger value="enrolled" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-sm font-medium px-4">
            Upcoming ({enrolled.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm text-sm font-medium px-4">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <TabsContent value="enrolled" className="m-0">
            {renderTable(enrolled, "No upcoming classes yet.")}
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            {renderTable(completed, "No completed classes yet.")}
          </TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
