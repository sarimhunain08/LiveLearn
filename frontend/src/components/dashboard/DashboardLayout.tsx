import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap, Bell, LogOut, ChevronLeft, Menu, X,
  User, Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const getSettingsPath = () => {
    if (location.pathname.startsWith("/teacher")) return "/teacher/settings";
    if (location.pathname.startsWith("/admin")) return "/admin/settings";
    return "/student/settings";
  };

  const roleLabel = user?.role === "teacher" ? "Instructor" : user?.role === "admin" ? "Admin" : "Learner";
  const roleColor = user?.role === "teacher" ? "text-violet-600 bg-violet-500/10" : user?.role === "admin" ? "text-amber-600 bg-amber-500/10" : "text-primary bg-primary/10";

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border/50">
        {(isMobile || !collapsed) ? (
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-sidebar-background" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Ilmify</span>
              <p className="text-[9px] text-muted-foreground/60 -mt-0.5 leading-none tracking-[0.2em] font-medium">LEARNING PLATFORM</p>
            </div>
          </Link>
        ) : (
          <Link to="/" className="mx-auto">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-md shadow-primary/25">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
        )}
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        ) : !collapsed ? (
          <button onClick={() => setCollapsed(true)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 scrollbar-none">
        {(isMobile || !collapsed) && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 px-3">Menu</p>
        )}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />}
                <span className={active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}>{item.icon}</span>
                {(isMobile || !collapsed) && <span>{item.label}</span>}
                {(isMobile || !collapsed) && item.badge && (
                  <span className="ml-auto rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User at bottom */}
      {(isMobile || !collapsed) && (
        <div className="border-t border-sidebar-border/50 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-2.5 transition-colors hover:bg-muted/50">
            <div className="relative flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-sidebar-background" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
              <span className={`inline-flex items-center rounded px-1 py-px text-[10px] font-semibold mt-0.5 ${roleColor}`}>{roleLabel}</span>
            </div>
          </div>
        </div>
      )}
      {collapsed && !isMobile && (
        <div className="border-t border-sidebar-border/50 p-3 flex justify-center">
          <button onClick={() => setCollapsed(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar shadow-2xl animate-slide-in-left">
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`flex-col border-r border-sidebar-border/50 bg-sidebar transition-all duration-300 ${collapsed ? "w-[68px]" : "w-64"} hidden md:flex`}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 sm:h-16 items-center justify-between border-b border-border/40 bg-card/50 backdrop-blur-xl px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button className="md:hidden rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-foreground truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <button aria-label="Notifications" className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
            <div className="hidden sm:block h-6 w-px bg-border/40 mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted/60 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground shadow-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="hidden sm:block text-left mr-1">
                    <p className="text-xs font-semibold text-foreground leading-none">{user?.name?.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{roleLabel}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/50 p-1">
                <div className="px-3 py-2.5 mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                  <span className={`mt-1.5 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${roleColor}`}>{roleLabel}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 rounded-lg py-2 cursor-pointer" onClick={() => navigate(getSettingsPath())}><User className="h-4 w-4 text-muted-foreground" /> Profile</DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 rounded-lg py-2 cursor-pointer" onClick={() => navigate(getSettingsPath())}><Settings className="h-4 w-4 text-muted-foreground" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 rounded-lg py-2 text-destructive cursor-pointer focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8 scrollbar-none">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
