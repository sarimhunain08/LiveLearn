import { useState, useEffect } from "react";
import { Home, BookOpen, Search, Clock, Settings, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { formatClassDateTime } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", path: "/student/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Browse Classes", path: "/student/browse", icon: <Search className="h-4 w-4" /> },
  { label: "Schedule", path: "/student/schedule", icon: <Clock className="h-4 w-4" /> },
  { label: "Settings", path: "/student/settings", icon: <Settings className="h-4 w-4" /> },
];

const subjects = ["All", "Math", "Science", "English", "History", "Art", "Programming", "Arabic"];

function capitalizeFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function BrowseClasses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSubject && selectedSubject !== "all") params.subject = selectedSubject;
      const res = await api.getClasses(params);
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [selectedSubject]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleEnroll = async (classId: string) => {
    setEnrollingId(classId);
    try {
      await api.enrollInClass(classId);
      toast({ title: "Enrolled successfully!" });
      fetchClasses();
    } catch (err: any) {
      toast({
        title: "Enrollment failed",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (cls: any) => {
    return cls.enrolledStudents?.some((s: any) =>
      typeof s === "string" ? s === user?._id : s._id === user?._id
    );
  };

  return (
    <DashboardLayout navItems={navItems} title="Browse Classes">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent>
            {subjects.map(s => (
              <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground">No classes found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => {
            const enrolled = isEnrolled(c);
            const spotsLeft = c.maxStudents - (c.enrolledStudents?.length || 0);

            return (
              <div key={c._id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span>
                <h4 className="mt-3 mb-1 font-semibold text-foreground">{c.title}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {c.teacher?.name?.charAt(0) || "?"}
                  </div>
                  <span className="text-sm text-muted-foreground">{c.teacher?.name || "Unknown"}</span>
                </div>
                <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                  <p>{formatClassDateTime(c)}</p>
                  <p>{c.duration} min • {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</p>
                </div>
                {enrolled ? (
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    Already Enrolled
                  </Button>
                ) : spotsLeft <= 0 ? (
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    Class Full
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gradient-primary text-primary-foreground border-0"
                    onClick={() => handleEnroll(c._id)}
                    disabled={enrollingId === c._id}
                  >
                    {enrollingId === c._id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Enroll
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
