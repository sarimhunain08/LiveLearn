import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Home, BookOpen, Search, Clock, Settings, Loader2, ArrowLeft, Calendar, User, Video, GraduationCap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { getClassStartDate, formatClassDate, formatClassTime, parseDurationMinutes, getViewerTimezoneShort } from "@/lib/dateUtils";

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

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getCountdown(target: Date): Countdown {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.getClass(id!);
        setCls(res.data);
      } catch (err) {
        console.error("Failed to fetch class:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!cls) return;

    const target = getClassStartDate(cls);

    const tick = () => {
      const cd = getCountdown(target);
      setCountdown(cd);
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cls]);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Class Details">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!cls) {
    return (
      <DashboardLayout navItems={navItems} title="Class Details">
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Class not found.</p>
          <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const classDateTime = getClassStartDate(cls);
  const isLive = cls.status === "live" || (countdown && countdown.total <= 0 && cls.status === "scheduled");
  const isCompleted = cls.status === "completed";
  const isCancelled = cls.status === "cancelled";
  const durationMin = parseDurationMinutes(cls.duration);

  // Determine the role-based meeting path
  const meetingPath = user?.role === "teacher"
    ? `/teacher/meeting/${cls._id}`
    : `/student/meeting/${cls._id}`;

  return (
    <DashboardLayout navItems={navItems} title="Class Details">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <span className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {capitalizeFirst(cls.subject)}
              </span>
              <StatusBadge status={isLive ? "Live" : isCompleted ? "Completed" : isCancelled ? "Cancelled" : "Scheduled"} />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">{cls.title}</h2>

            {cls.description && (
              <p className="text-muted-foreground mb-6">{cls.description}</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                  <p className="font-medium text-foreground">{cls.teacher?.name || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-medium text-foreground">{formatClassDate(cls, "long")}</p>
                  <p className="text-sm text-muted-foreground">{formatClassTime(cls)} ({getViewerTimezoneShort()})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{cls.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Meeting</p>
                  <p className="font-medium text-foreground">
                    {isLive ? "Ready to join" : "Will open at scheduled time"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown & Join Sidebar */}
        <div className="space-y-6">
          {/* Countdown Timer */}
          {!isCompleted && !isCancelled && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
              {isLive ? (
                <>
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
                      <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      Class is LIVE
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    The class is happening right now. Join to participate!
                  </p>
                  <Button
                    size="lg"
                    className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 text-base"
                    asChild
                  >
                    <Link to={meetingPath}>
                      <Video className="h-5 w-5" /> Join Now
                    </Link>
                  </Button>
                </>
              ) : countdown ? (
                <>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    Class starts in
                  </h3>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-6">
                    {[
                      { value: countdown.days, label: "Days" },
                      { value: countdown.hours, label: "Hours" },
                      { value: countdown.minutes, label: "Min" },
                      { value: countdown.seconds, label: "Sec" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg bg-muted/50 p-2 sm:p-3">
                        <p className="text-lg sm:text-2xl font-bold text-foreground">
                          {String(item.value).padStart(2, "0")}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    disabled
                    variant="outline"
                  >
                    <Video className="h-5 w-5" /> Join Now
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Button will activate when the class starts
                  </p>
                </>
              ) : null}
            </div>
          )}

          {isCompleted && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="font-semibold text-foreground mb-2">Class Completed</h3>
              <p className="text-sm text-muted-foreground">This class has already ended.</p>
            </div>
          )}

          {isCancelled && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
              <div className="mb-4 text-4xl">❌</div>
              <h3 className="font-semibold text-foreground mb-2">Class Cancelled</h3>
              <p className="text-sm text-muted-foreground">This class has been cancelled by the teacher.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
