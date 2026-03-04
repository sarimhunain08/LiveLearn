import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, User, Settings, Shield, Mail } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { teacherNav, studentNav, adminNav } from "@/lib/navItems";
import { getErrorMessage } from "@/lib/types";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const navItems = location.pathname.startsWith("/teacher") ? teacherNav :
    location.pathname.startsWith("/admin") ? adminNav : studentNav;

  const roleColor = user?.role === "teacher" ? "from-violet-500 to-purple-600" :
    user?.role === "admin" ? "from-amber-500 to-orange-600" : "from-primary to-emerald-500";

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (name.trim() && name !== user?.name) payload.name = name.trim();
      if (bio.trim()) payload.bio = bio.trim();

      if (Object.keys(payload).length === 0) {
        toast({ title: "No changes to save" });
        setSaving(false);
        return;
      }

      await api.updateProfile(payload);
      await refreshUser();
      toast({ title: "Profile updated!" });
    } catch (err: unknown) {
      toast({ title: "Update failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-violet-500/5 p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${roleColor} shadow-lg shadow-primary/25`}>
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Account Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
          <div className={`h-1 bg-gradient-to-r ${roleColor}`} />
          <div className="p-6 sm:p-8 space-y-6">
            {/* Avatar & info section */}
            <div className="flex items-center gap-4 rounded-xl bg-muted/30 p-4 border border-border/40">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${roleColor} text-lg font-bold text-white shadow-lg`}>
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground text-lg">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span className={`inline-flex items-center rounded-md bg-gradient-to-r ${roleColor} px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm capitalize`}>
                    {user?.role || "user"}
                  </span>
                </div>
              </div>
            </div>

            {/* Form section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Personal Information</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input className="h-11 rounded-xl border-border/60 focus:border-primary/30 focus:ring-primary/20 transition-colors" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                  <Input className="h-11 rounded-xl border-border/60 bg-muted/20 text-muted-foreground" defaultValue={user?.email || ""} disabled />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio</label>
              <Textarea className="rounded-xl border-border/60 focus:border-primary/30 focus:ring-primary/20 transition-colors" placeholder="Tell students about yourself, your experience, and teaching style..." rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                className={`bg-gradient-to-r ${roleColor} text-white border-0 h-11 rounded-xl px-8 font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Changes"}
              </Button>
              <p className="text-[11px] text-muted-foreground">Changes will be reflected across the platform</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
