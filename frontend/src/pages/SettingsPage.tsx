import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, User } from "lucide-react";
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
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
                <p className="text-xs text-muted-foreground">Update your personal information</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-lg font-bold text-primary-foreground shadow-md">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-semibold text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className="inline-block mt-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                  {user?.role || "user"}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                <Input className="h-11 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <Input className="h-11 rounded-xl" defaultValue={user?.email || ""} disabled />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Bio</label>
              <Textarea className="rounded-xl" placeholder="Tell us about yourself..." rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <Button
              className="gradient-primary text-primary-foreground border-0 h-11 rounded-xl px-8 font-semibold shadow-lg shadow-primary/20"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
