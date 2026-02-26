import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home, Plus, BookOpen, Users, DollarSign, Settings as SettingsIcon,
  BarChart3, GraduationCap, Search, Clock, User, Shield, Bell, Palette, Mail
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";

const teacherNav = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Create Class", path: "/teacher/create-class", icon: <Plus className="h-4 w-4" /> },
  { label: "My Classes", path: "/teacher/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/teacher/students", icon: <Users className="h-4 w-4" /> },
  { label: "Earnings", path: "#", icon: <DollarSign className="h-4 w-4 opacity-40" /> },
  { label: "Settings", path: "/teacher/settings", icon: <SettingsIcon className="h-4 w-4" /> },
];

const studentNav = [
  { label: "Dashboard", path: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", path: "/student/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Browse Classes", path: "/student/browse", icon: <Search className="h-4 w-4" /> },
  { label: "Schedule", path: "/student/schedule", icon: <Clock className="h-4 w-4" /> },
  { label: "Settings", path: "/student/settings", icon: <SettingsIcon className="h-4 w-4" /> },
];

const adminNav = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Messages", path: "/admin/contacts", icon: <Mail className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <SettingsIcon className="h-4 w-4" /> },
];

const settingsTabs = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  const navItems = location.pathname.startsWith("/teacher") ? teacherNav :
    location.pathname.startsWith("/admin") ? adminNav : studentNav;

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Settings sidebar - horizontal scroll on mobile, vertical on lg */}
        <div className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
          {settingsTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:w-full lg:gap-3 ${
                activeTab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-lg font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <Button variant="outline" size="sm">Upload Photo</Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                  <Input defaultValue={user?.name || ""} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <Input defaultValue={user?.email || ""} disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                  <Input placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Timezone</label>
                  <Input defaultValue="UTC-5 (Eastern)" disabled />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Bio</label>
                <Textarea placeholder="Tell us about yourself..." rows={3} />
              </div>

              <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Account Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
                  <Input type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Button className="gradient-primary text-primary-foreground border-0">Update Password</Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { title: "Email Notifications", desc: "Receive important updates via email" },
                  { title: "Class Reminders", desc: "Get notified 15 minutes before class" },
                  { title: "New Enrollments", desc: "Alerts when students enroll in your classes" },
                  { title: "Class Updates", desc: "Changes to classes you're enrolled in" },
                  { title: "Platform Updates", desc: "News about new features and improvements" },
                ].map((n) => (
                  <div key={n.title} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
