import { useState, useEffect } from "react";
import {
  Loader2, AlertCircle, TrendingUp
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { adminNav as navItems } from "@/lib/navItems";
import { getErrorMessage, AdminReportsData, DistributionItem } from "@/lib/types";

export default function AdminReports() {
  const [reports, setReports] = useState<AdminReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.getAdminReports();
        setReports(res.data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Reports & Analytics">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems} title="Reports & Analytics">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-destructive font-medium mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError(null);
              setLoading(true);
              api.getAdminReports()
                .then((res) => setReports(res.data))
                .catch((err: unknown) => setError(getErrorMessage(err)))
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Reports & Analytics">
      {/* Weekly Summary */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">New Users This Week</h3>
              <p className="text-2xl font-bold text-foreground">{reports?.newUsersThisWeek ?? 0}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Users registered in the last 7 days</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">New Classes This Week</h3>
              <p className="text-2xl font-bold text-foreground">{reports?.newClassesThisWeek ?? 0}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Classes created in the last 7 days</p>
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Classes by Subject
          </h3>
          {reports?.subjectDistribution?.length ? (
            <div className="space-y-3">
              {reports.subjectDistribution.map((item: DistributionItem) => {
                const maxCount = reports.subjectDistribution[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium capitalize">{item._id}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Classes by Status
          </h3>
          {reports?.statusDistribution?.length ? (
            <div className="space-y-3">
              {reports.statusDistribution.map((item: DistributionItem) => (
                <div key={item._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium text-foreground capitalize">{item._id}</span>
                  <span className="text-lg font-bold text-primary">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
