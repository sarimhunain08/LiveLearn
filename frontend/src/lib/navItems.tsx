import {
  Home,
  Plus,
  BookOpen,
  Users,
  Settings,
  Search,
  GraduationCap,
  BarChart3,
  Mail,
} from "lucide-react";

export const teacherNav = [
  { label: "Dashboard", path: "/teacher/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Create Class", path: "/teacher/create-class", icon: <Plus className="h-4 w-4" /> },
  { label: "My Classes", path: "/teacher/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Students", path: "/teacher/students", icon: <Users className="h-4 w-4" /> },
  { label: "Settings", path: "/teacher/settings", icon: <Settings className="h-4 w-4" /> },
];

export const studentNav = [
  { label: "Dashboard", path: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "My Classes", path: "/student/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Browse Teachers", path: "/student/browse", icon: <Search className="h-4 w-4" /> },
  { label: "My Teachers", path: "/student/my-teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Settings", path: "/student/settings", icon: <Settings className="h-4 w-4" /> },
];

export const adminNav = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Teachers", path: "/admin/teachers", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="h-4 w-4" /> },
  { label: "Classes", path: "/admin/classes", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Messages", path: "/admin/contacts", icon: <Mail className="h-4 w-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];
