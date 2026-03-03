import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages — each is a separate chunk loaded on demand
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MonthlyFee = lazy(() => import("./pages/MonthlyFee"));
const ContactUs = lazy(() => import("./pages/ContactUs"));

const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const CreateClass = lazy(() => import("./pages/teacher/CreateClass"));
const TeacherClasses = lazy(() => import("./pages/teacher/TeacherClasses"));
const TeacherStudents = lazy(() => import("./pages/teacher/TeacherStudents"));

const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const BrowseTeachers = lazy(() => import("./pages/student/BrowseTeachers"));
const StudentClasses = lazy(() => import("./pages/student/StudentClasses"));
const ClassDetail = lazy(() => import("./pages/student/ClassDetail"));
const TeacherProfile = lazy(() => import("./pages/student/TeacherProfile"));
const MyTeachers = lazy(() => import("./pages/student/MyTeachers"));
const MeetingRoom = lazy(() => import("./pages/MeetingRoom"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminTeachers = lazy(() => import("./pages/admin/AdminTeachers"));
const AdminStudents = lazy(() => import("./pages/admin/AdminStudents"));
const AdminClasses = lazy(() => import("./pages/admin/AdminClasses"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminCreateTeacher = lazy(() => import("./pages/admin/AdminCreateTeacher"));
const AdminCreateStudent = lazy(() => import("./pages/admin/AdminCreateStudent"));

const SettingsPage = lazy(() => import("./pages/SettingsPage"));

// Full-screen loading spinner shown while lazy chunks load
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<MonthlyFee />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />

            {/* Teacher */}
            <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/create-class" element={<ProtectedRoute allowedRoles={["teacher"]}><CreateClass /></ProtectedRoute>} />
            <Route path="/teacher/classes" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherClasses /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherStudents /></ProtectedRoute>} />
            <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={["teacher"]}><SettingsPage /></ProtectedRoute>} />
            <Route path="/teacher/meeting/:id" element={<ProtectedRoute allowedRoles={["teacher"]}><MeetingRoom /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/browse" element={<ProtectedRoute allowedRoles={["student"]}><BrowseTeachers /></ProtectedRoute>} />
            <Route path="/student/my-teachers" element={<ProtectedRoute allowedRoles={["student"]}><MyTeachers /></ProtectedRoute>} />
            <Route path="/student/teacher/:id" element={<ProtectedRoute allowedRoles={["student"]}><TeacherProfile /></ProtectedRoute>} />
            <Route path="/student/classes" element={<ProtectedRoute allowedRoles={["student"]}><StudentClasses /></ProtectedRoute>} />
            <Route path="/student/class/:id" element={<ProtectedRoute allowedRoles={["student"]}><ClassDetail /></ProtectedRoute>} />
            <Route path="/student/meeting/:id" element={<ProtectedRoute allowedRoles={["student"]}><MeetingRoom /></ProtectedRoute>} />
            <Route path="/student/settings" element={<ProtectedRoute allowedRoles={["student"]}><SettingsPage /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTeachers /></ProtectedRoute>} />
            <Route path="/admin/teachers/create" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCreateTeacher /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/students/create" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCreateStudent /></ProtectedRoute>} />
            <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={["admin"]}><AdminClasses /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/contacts" element={<ProtectedRoute allowedRoles={["admin"]}><AdminContacts /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><SettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
);

export default App;
