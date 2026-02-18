import { useState, useEffect } from "react";
import { Home, BookOpen, Search, Clock, Settings, Loader2, Users, UserPlus, UserCheck } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", path: "/student/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Browse Teachers", path: "/student/browse", icon: <Search className="h-4 w-4" /> },
  { label: "Schedule", path: "/student/schedule", icon: <Clock className="h-4 w-4" /> },
  { label: "Settings", path: "/student/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function BrowseTeachers() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teachersRes, subscribedRes] = await Promise.all([
        api.getTeachers(searchTerm ? { search: searchTerm } : undefined),
        api.getSubscribedTeachers(),
      ]);
      setTeachers(teachersRes.data);
      setSubscribedIds(new Set(subscribedRes.data.map((t: any) => t._id)));
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubscribe = async (teacherId: string) => {
    setActionId(teacherId);
    try {
      await api.subscribeToTeacher(teacherId);
      setSubscribedIds((prev) => new Set(prev).add(teacherId));
      toast({ title: "Subscribed successfully!" });
    } catch (err: any) {
      toast({ title: "Failed", description: err?.message, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleUnsubscribe = async (teacherId: string) => {
    setActionId(teacherId);
    try {
      await api.unsubscribeFromTeacher(teacherId);
      setSubscribedIds((prev) => {
        const next = new Set(prev);
        next.delete(teacherId);
        return next;
      });
      toast({ title: "Unsubscribed" });
    } catch (err: any) {
      toast({ title: "Failed", description: err?.message, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Browse Teachers">
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground">No teachers found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t) => {
            const isSubscribed = subscribedIds.has(t._id);

            return (
              <div
                key={t._id}
                className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      t.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <Link
                      to={`/student/teacher/${t._id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {t.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{t.email}</p>
                  </div>
                </div>

                {/* Bio */}
                {t.bio && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{t.bio}</p>
                )}

                {/* Stats */}
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{t.classCount || 0} Classes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{t.subscriberCount || 0} Subscribers</span>
                  </div>
                </div>

                {/* Action */}
                {isSubscribed ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleUnsubscribe(t._id)}
                    disabled={actionId === t._id}
                  >
                    {actionId === t._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 text-green-500" />
                    )}
                    Subscribed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gap-2 gradient-primary text-primary-foreground border-0"
                    onClick={() => handleSubscribe(t._id)}
                    disabled={actionId === t._id}
                  >
                    {actionId === t._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Subscribe
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
