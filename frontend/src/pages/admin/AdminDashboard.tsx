import { useState, useEffect } from "react";
import {
  BarChart3, Users, GraduationCap, BookOpen, Activity,
  Loader2, AlertCircle, MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { api } from "@/lib/api";
import { adminNav as navItems } from "@/lib/navItems";
import { getErrorMessage } from "@/lib/types";

interface Stats {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  liveNow: number;
  completedClasses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        setStats(res.data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Admin Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems} title="Admin Dashboard">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        <StatCard label="Teachers" value={stats?.totalTeachers ?? 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Students" value={stats?.totalStudents ?? 0} icon={<Users className="h-5 w-5" />} colorClass="bg-accent/10 text-accent" />
        <StatCard label="Total Classes" value={stats?.totalClasses ?? 0} icon={<BookOpen className="h-5 w-5" />} colorClass="bg-success/10 text-success" />
        <StatCard label="Live Now" value={stats?.liveNow ?? 0} icon={<Activity className="h-5 w-5" />} colorClass="bg-destructive/10 text-destructive" />
        <StatCard label="Completed" value={stats?.completedClasses ?? 0} icon={<BarChart3 className="h-5 w-5" />} colorClass="bg-warning/10 text-warning" />
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/teachers" className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
          <GraduationCap className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-semibold text-foreground text-sm">Manage Teachers</h3>
          <p className="text-xs text-muted-foreground mt-1">View, activate/deactivate, or remove teachers</p>
        </Link>
        <Link to="/admin/students" className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
          <Users className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-semibold text-foreground text-sm">Manage Students</h3>
          <p className="text-xs text-muted-foreground mt-1">View, activate/deactivate, or remove students</p>
        </Link>
        <Link to="/admin/classes" className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
          <BookOpen className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-semibold text-foreground text-sm">Manage Classes</h3>
          <p className="text-xs text-muted-foreground mt-1">Browse and manage all classes</p>
        </Link>
        <Link to="/admin/contacts" className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
          <MessageSquare className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-semibold text-foreground text-sm">Contact Messages</h3>
          <p className="text-xs text-muted-foreground mt-1">View and respond to contact form submissions</p>
        </Link>
      </div>
    </DashboardLayout>
  );
}
