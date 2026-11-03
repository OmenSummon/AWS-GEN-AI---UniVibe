import { StudentProfile } from "@/types";

export interface StudentSession {
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
  };
  isAuthenticated: boolean;
}

export const DEFAULT_STUDENT_ID = "demo-student-001";

export function getSessionUserId(req?: Request): string {
  // If there's an auth header or cookie, parse it; otherwise use active student session
  return DEFAULT_STUDENT_ID;
}

