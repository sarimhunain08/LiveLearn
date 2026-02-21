import { useState, useEffect } from "react";
import { Home, BookOpen, Search, Settings, Loader2, GraduationCap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", path: "/student/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Browse Teachers", path: "/student/browse", icon: <Search className="h-4 w-4" /> },
  { label: "My Teachers", path: "/student/my-teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Settings", path: "/student/settings", icon: <Settings className="h-4 w-4" /> },
];

function capitalizeFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function StudentClasses() {
  const [classes, setClasses] = useState<any[]>([]);
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

  const renderTable = (list: any[], emptyMsg: string) => (
    list.length === 0 ? (
      <div className="py-12 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
        <p className="text-muted-foreground">{emptyMsg}</p>
      </div>
    ) : (
      <>
        {/* Mobile card view */}
        <div className="sm:hidden divide-y divide-border">
          {list.map(c => (
            <Link key={c._id} to={`/student/class/${c._id}`} className="block p-4 space-y-2 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm">{c.title}</h4>
                <StatusBadge status={c.status === "live" ? "Live" : c.status === "scheduled" ? "Scheduled" : "Completed"} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{c.teacher?.name || "Unknown"}</span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">{capitalizeFirst(c.subject)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatClassDate(c)} · {formatClassTime(c)}
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="dashboard-table">
            <thead><tr><th>Class</th><th>Teacher</th><th>Subject</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {list.map(c => (
                <tr key={c._id}>
                  <td className="font-medium text-foreground">
                    <Link to={`/student/class/${c._id}`} className="hover:text-primary transition-colors">
                      {c.title}
                    </Link>
                  </td>
                  <td className="text-muted-foreground">{c.teacher?.name || "Unknown"}</td>
                  <td><span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span></td>
                  <td className="text-muted-foreground">{formatClassDate(c)}</td>
                  <td className="text-muted-foreground">{formatClassTime(c)}</td>
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
      <Tabs defaultValue="enrolled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrolled">Upcoming ({enrolled.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <TabsContent value="enrolled" className="m-0">
            {renderTable(enrolled, "No upcoming classes. Subscribe to teachers to see their classes.")}
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            {renderTable(completed, "No completed classes yet.")}
          </TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
