import { StudentProfile, UserRole, OrganizerProfile } from "@/types";

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar_url?: string;
  };
  isAuthenticated: boolean;
}

export const DEFAULT_STUDENT_ID = "demo-student-001";
export const DEFAULT_ORGANIZER_ID = "demo-organizer-001";

export function getSessionUserId(req?: Request): string {
  if (req) {
    const url = new URL(req.url);
    const roleParam = url.searchParams.get("role");
    const cookieHeader = req.headers.get("cookie") || "";
    
    const userIdMatch = cookieHeader.match(/univibe_user_id=([^;]+)/);
    if (userIdMatch && userIdMatch[1]) {
      return decodeURIComponent(userIdMatch[1].trim());
    }

    if (roleParam === "organizer" || cookieHeader.includes("univibe_role=organizer")) {
      return DEFAULT_ORGANIZER_ID;
    }
  }
  return DEFAULT_STUDENT_ID;
}

export function getSessionRole(req?: Request): UserRole {
  if (req) {
    const url = new URL(req.url);
    const roleParam = url.searchParams.get("role");
    const cookieHeader = req.headers.get("cookie") || "";
    if (roleParam === "organizer" || cookieHeader.includes("univibe_role=organizer")) {
      return "organizer";
    }
  }
  return "student";
}

export const DEFAULT_ORGANIZER_PROFILE: OrganizerProfile = {
  id: DEFAULT_ORGANIZER_ID,
  name: "Aarav Roy",
  organization_name: "JIS Tech Club & Student Council",
  department: "Department of Computer Science & Engineering, JIS University",
  email: "student.organizer@jisuniversity.ac.in",
  phone: "+91 98301 23456",
  role_title: "Lead Student Organizer & Tech Convener",
  avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
