import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import MonthlyFee from "./pages/MonthlyFee";
import ContactUs from "./pages/ContactUs";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateClass from "./pages/teacher/CreateClass";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudents from "./pages/teacher/TeacherStudents";

import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseTeachers from "./pages/student/BrowseTeachers";
import StudentClasses from "./pages/student/StudentClasses";
import ClassDetail from "./pages/student/ClassDetail";
import TeacherProfile from "./pages/student/TeacherProfile";
import MyTeachers from "./pages/student/MyTeachers";
import MeetingRoom from "./pages/MeetingRoom";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminReports from "./pages/admin/AdminReports";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminCreateTeacher from "./pages/admin/AdminCreateTeacher";
import AdminCreateStudent from "./pages/admin/AdminCreateStudent";

import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
