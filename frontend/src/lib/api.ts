const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include" as RequestCredentials,
    };

    const token = this.getToken();
    if (token) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ success: boolean; token: string; user: any }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem("token", data.token);
    return data;
  }

  async signup(name: string, email: string, password: string, role: string) {
    const data = await this.request<{ success: boolean; token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: { name, email, password, role },
    });
    localStorage.setItem("token", data.token);
    return data;
  }

  async getMe() {
    return this.request<{ success: boolean; user: any }>("/auth/me");
  }

  async logout() {
    localStorage.removeItem("token");
    return this.request("/auth/logout", { method: "POST" });
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/update-password", {
      method: "PUT",
      body: { currentPassword, newPassword },
    });
  }

  // User
  async getProfile() {
    return this.request<{ success: boolean; user: any }>("/users/profile");
  }

  async updateProfile(data: { name?: string; avatar?: string; bio?: string }) {
    return this.request("/users/profile", { method: "PUT", body: data });
  }

  // Teachers - Browse & Subscribe
  async getTeachers(params?: { search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ success: boolean; data: any[] }>(`/users/teachers${query}`);
  }

  async getTeacherProfile(teacherId: string) {
    return this.request<{ success: boolean; data: any }>(`/users/teachers/${teacherId}`);
  }

  async subscribeToTeacher(teacherId: string) {
    return this.request(`/users/teachers/${teacherId}/subscribe`, { method: "POST" });
  }

  async unsubscribeFromTeacher(teacherId: string) {
    return this.request(`/users/teachers/${teacherId}/unsubscribe`, { method: "POST" });
  }

  async getSubscribedTeachers() {
    return this.request<{ success: boolean; data: any[] }>("/users/subscribed-teachers");
  }

  // Classes - Public
  async getClasses(params?: { subject?: string; search?: string; status?: string; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ success: boolean; data: any[]; total: number; totalPages: number }>(`/classes${query}`);
  }

  async getClass(id: string) {
    return this.request<{ success: boolean; data: any }>(`/classes/${id}`);
  }

  // Classes - Teacher
  async createClass(classData: any) {
    return this.request<{ success: boolean; data: any }>("/classes", {
      method: "POST",
      body: classData,
    });
  }

  async updateClass(id: string, classData: any) {
    return this.request(`/classes/${id}`, { method: "PUT", body: classData });
  }

  async deleteClass(id: string) {
    return this.request(`/classes/${id}`, { method: "DELETE" });
  }

  async getMyClasses() {
    return this.request<{ success: boolean; data: any[] }>("/classes/teacher/my-classes");
  }

  async getMyStudents() {
    return this.request<{ success: boolean; data: any[] }>("/classes/teacher/my-students");
  }

  async getTeacherStats() {
    return this.request<{ success: boolean; data: any }>("/classes/teacher/stats");
  }

  async getClassStudents(classId: string) {
    return this.request<{ success: boolean; data: any[] }>(`/classes/${classId}/students`);
  }

  // Classes - Student
  async enrollInClass(classId: string) {
    return this.request(`/classes/${classId}/enroll`, { method: "POST" });
  }

  async unenrollFromClass(classId: string) {
    return this.request(`/classes/${classId}/unenroll`, { method: "POST" });
  }

  async getEnrolledClasses() {
    return this.request<{ success: boolean; data: any[] }>("/classes/student/enrolled");
  }

  async getSubscribedClasses() {
    return this.request<{ success: boolean; data: any[] }>("/classes/student/subscribed");
  }

  async getStudentStats() {
    return this.request<{ success: boolean; data: any }>("/classes/student/stats");
  }

  // Admin
  async getAdminStats() {
    return this.request<{ success: boolean; data: any }>("/admin/stats");
  }

  async getAdminTeachers(params?: { search?: string; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ success: boolean; data: any[] }>(`/admin/teachers${query}`);
  }

  async getAdminStudents(params?: { search?: string; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ success: boolean; data: any[] }>(`/admin/students${query}`);
  }

  async getAdminClasses(params?: { search?: string; subject?: string; status?: string; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return this.request<{ success: boolean; data: any[] }>(`/admin/classes${query}`);
  }

  async toggleUserActive(userId: string) {
    return this.request(`/admin/users/${userId}/toggle-active`, { method: "PUT" });
  }

  async deleteUser(userId: string) {
    return this.request(`/admin/users/${userId}`, { method: "DELETE" });
  }

  async getAdminReports() {
    return this.request<{ success: boolean; data: any }>("/admin/reports");
  }

  // Jitsi JaaS
  async getJitsiToken(roomName: string) {
    return this.request<{ success: boolean; data: { token: string; roomName: string } }>("/meet/token", {
      method: "POST",
      body: { roomName },
    });
  }

  // Class status management
  async startClass(classId: string) {
    return this.request(`/classes/${classId}/start`, { method: "PUT" });
  }

  async endClass(classId: string) {
    return this.request(`/classes/${classId}/end`, { method: "PUT" });
  }

  async attendClass(classId: string) {
    return this.request(`/classes/${classId}/attend`, { method: "POST" });
  }
}

export const api = new ApiClient(API_BASE_URL);
