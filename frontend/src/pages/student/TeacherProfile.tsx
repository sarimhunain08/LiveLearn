import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Users, UserPlus, UserCheck, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatClassDate, formatClassTime, formatClassDateTime } from "@/lib/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { studentNav as navItems } from "@/lib/navItems";
import { getErrorMessage, User, ClassData } from "@/lib/types";

function capitalizeFirst(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, subscribedRes] = await Promise.all([
          api.getTeacherProfile(id!),
          api.getSubscribedTeachers(),
        ]);
        setTeacher(profileRes.data);
        setIsSubscribed(subscribedRes.data.some((t: User) => t._id === id));
      } catch (err) {
        console.error("Failed to fetch teacher:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubscribe = async () => {
    setActionLoading(true);
    try {
      await api.subscribeToTeacher(id!);
      setIsSubscribed(true);
      toast({ title: "Subscribed successfully!" });
    } catch (err: unknown) {
      toast({ title: "Failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setActionLoading(true);
    try {
      await api.unsubscribeFromTeacher(id!);
      setIsSubscribed(false);
      toast({ title: "Unsubscribed" });
    } catch (err: unknown) {
      toast({ title: "Failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Teacher Profile">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!teacher) {
    return (
      <DashboardLayout navItems={navItems} title="Teacher Profile">
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Teacher not found.</p>
          <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const upcomingClasses = (teacher.classes || []).filter(
    (c: ClassData) => c.status === "scheduled" || c.status === "live"
  );
  const completedClasses = (teacher.classes || []).filter(
    (c: ClassData) => c.status === "completed"
  );

  return (
    <DashboardLayout navItems={navItems} title="Teacher Profile">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Profile Header */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary shrink-0">
            {teacher.avatar ? (
              <img src={teacher.avatar} alt={teacher.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              teacher.name?.charAt(0)?.toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{teacher.name}</h2>
            {teacher.country && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <span>📍</span> {teacher.country}
              </p>
            )}
            {teacher.bio && <p className="mt-2 text-sm text-muted-foreground">{teacher.bio}</p>}
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> {teacher.classCount || 0} Classes
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {teacher.subscriberCount || 0} Subscribers
              </span>
            </div>
          </div>
          <div>
            {isSubscribed ? (
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleUnsubscribe}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4 text-green-500" />}
                Subscribed
              </Button>
            ) : (
              <Button
                className="gap-2 gradient-primary text-primary-foreground border-0"
                onClick={handleSubscribe}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Upcoming Classes ({upcomingClasses.length})
        </h3>
        {upcomingClasses.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No upcoming classes right now.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingClasses.map((c: ClassData) => (
              <Link
                key={c._id}
                to={`/student/class/${c._id}`}
                className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 block"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {capitalizeFirst(c.subject)}
                  </span>
                  <StatusBadge status={c.status === "live" ? "Live" : "Scheduled"} />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{c.title}</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{formatClassDateTime(c)}</p>
                  <p>{c.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Completed Classes ({completedClasses.length})
          </h3>
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-border">
              {completedClasses.map((c: ClassData) => (
                <div key={c._id} className="p-4 space-y-1">
                  <p className="font-medium text-foreground text-sm">{c.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span>
                    <span>{formatClassDate(c)}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="dashboard-table">
                <thead><tr><th>Class</th><th>Subject</th><th>Date</th></tr></thead>
                <tbody>
                  {completedClasses.map((c: ClassData) => (
                    <tr key={c._id}>
                      <td className="font-medium text-foreground">{c.title}</td>
                      <td><span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{capitalizeFirst(c.subject)}</span></td>
                      <td className="text-muted-foreground">{formatClassDate(c)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
