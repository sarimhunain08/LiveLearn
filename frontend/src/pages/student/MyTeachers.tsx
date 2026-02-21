import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  Search,
  Settings,
  Loader2,
  Users,
  Calendar,
  Clock,
  Globe,
  Languages,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime } from "@/lib/dateUtils";

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

export default function MyTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getSubscribedTeachersWithClasses();
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch subscribed teachers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="My Teachers">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="My Teachers">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {teachers.length} Subscribed Teacher{teachers.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            View your subscribed teachers and their classes
          </p>
        </div>
        <Link to="/student/browse">
          <Button className="gradient-primary text-primary-foreground border-0 gap-2" size="sm">
            <Search className="h-4 w-4" /> Browse More
          </Button>
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground mb-1">No subscribed teachers yet</p>
          <p className="text-xs text-muted-foreground mb-4">
            Subscribe to teachers to see their info and classes here
          </p>
          <Link to="/student/browse">
            <Button className="gradient-primary text-primary-foreground border-0" size="sm">
              Browse Teachers
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher._id} teacher={teacher} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

/* ---------- Teacher Card with expandable classes ---------- */
function TeacherCard({ teacher }: { teacher: any }) {
  const [expanded, setExpanded] = useState(false);
  const { upcoming = [], completed = [], previous = [] } = teacher.classes || {};
  const totalClasses = upcoming.length + completed.length + previous.length;

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Teacher header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {teacher.avatar ? (
            <img src={teacher.avatar} alt={teacher.name} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            teacher.name?.charAt(0)?.toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/student/teacher/${teacher._id}`}
              className="font-semibold text-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {teacher.name}
            </Link>
            {teacher.country && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" /> {teacher.country}
              </span>
            )}
          </div>

          {/* Subjects */}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">{teacher.subjects.join(", ")}</span>
            </div>
          )}

          {/* Languages */}
          {teacher.languages && teacher.languages.length > 0 && (
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Languages className="h-3 w-3 shrink-0" />
              <span>
                Speaks {teacher.languages.slice(0, 3).join(", ")}
                {teacher.languages.length > 3 ? ` +${teacher.languages.length - 3}` : ""}
              </span>
            </div>
          )}
        </div>

        {/* Stats + expand toggle */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {teacher.subscriberCount}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> {totalClasses} classes
            </span>
            {upcoming.length > 0 && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <Calendar className="h-3.5 w-3.5" /> {upcoming.length} upcoming
              </span>
            )}
          </div>
          <div className="text-muted-foreground">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* Expanded classes */}
      {expanded && (
        <div className="border-t border-border bg-muted/20 p-5 space-y-5">
          <ClassSection
            title="Upcoming & Live"
            classes={upcoming}
            emptyText="No upcoming classes"
            badgeVariant="upcoming"
          />

          <ClassSection
            title="Completed"
            classes={completed}
            emptyText="No completed classes"
            badgeVariant="completed"
          />

          {previous.length > 0 && (
            <ClassSection
              title="Cancelled"
              classes={previous}
              emptyText=""
              badgeVariant="cancelled"
            />
          )}

          <div className="pt-2">
            <Link to={`/student/teacher/${teacher._id}`}>
              <Button variant="outline" size="sm" className="text-xs">
                View Full Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Class Section ---------- */
function ClassSection({
  title,
  classes,
  emptyText,
  badgeVariant,
}: {
  title: string;
  classes: any[];
  emptyText: string;
  badgeVariant: "upcoming" | "completed" | "cancelled";
}) {
  if (classes.length === 0 && !emptyText) return null;

  const statusColor = {
    upcoming: "text-primary",
    completed: "text-green-600",
    cancelled: "text-muted-foreground",
  }[badgeVariant];

  return (
    <div>
      <h4 className={`text-sm font-semibold mb-2 ${statusColor}`}>
        {title} ({classes.length})
      </h4>
      {classes.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c: any) => (
            <Link
              key={c._id}
              to={`/student/class/${c._id}`}
              className="rounded-lg border border-border bg-card p-3 hover:shadow-md transition-all block"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {capitalizeFirst(c.subject)}
                </span>
                <StatusBadge
                  status={
                    c.status === "live"
                      ? "Live"
                      : c.status === "completed"
                      ? "Completed"
                      : c.status === "cancelled"
                      ? "Cancelled"
                      : "Scheduled"
                  }
                />
              </div>
              <h5 className="text-sm font-medium text-foreground truncate">{c.title}</h5>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-2.5 w-2.5" /> {formatClassDate(c)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" /> {formatClassTime(c)}
                </span>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                {c.enrolledStudents?.length || 0}/{c.maxStudents} enrolled · {c.duration}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
