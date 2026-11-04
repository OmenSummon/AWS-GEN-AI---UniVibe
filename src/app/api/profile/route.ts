import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { getSessionUserId, DEFAULT_STUDENT_ID } from "@/lib/auth/session";

function safeDecode(val: string): string {
  if (!val) return "";
  try {
    let prev = val;
    let decoded = decodeURIComponent(val);
    while (decoded !== prev && decoded.includes("%")) {
      prev = decoded;
      decoded = decodeURIComponent(decoded);
    }
    return decoded;
  } catch {
    return val;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieHeader = request.headers.get("cookie") || "";

    const sessionUserId = getSessionUserId(request);
    const userId = searchParams.get("userId") || sessionUserId || DEFAULT_STUDENT_ID;
    let profile = await db.getProfile(userId);

    const nameMatch = cookieHeader.match(/univibe_user_name=([^;]+)/);
    const avatarMatch = cookieHeader.match(/univibe_user_avatar=([^;]+)/);
    const cookieName = nameMatch ? safeDecode(nameMatch[1].trim()) : null;
    const cookieAvatar = avatarMatch ? safeDecode(avatarMatch[1].trim()) : null;

    if (cookieName) {
      profile = {
        ...(profile || {}),
        id: userId,
        student_name: cookieName,
        avatar_url: cookieAvatar || (profile ? safeDecode(profile.avatar_url) : null),
        department: profile?.department || "B.Tech Computer Science & Engineering",
        year: profile?.year || "3rd Year",
        interests: profile?.interests || ["Artificial Intelligence", "Campus Tech", "Leadership"],
        skills: profile?.skills || ["Problem Solving", "Collaboration"],
        free_time: profile?.free_time || "5-10 hours/week",
        goal: profile?.goal || "Active campus engagement and tech events",
        tone: profile?.tone || "Friendly",
        university_name: profile?.university_name || "JIS University",
        onboarding_completed: true,
      };
    } else if (profile) {
      profile = {
        ...profile,
        student_name: safeDecode(profile.student_name),
        avatar_url: safeDecode(profile.avatar_url),
      };
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.student_name || !body.department || !body.year) {
      return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 });
    }

    const sessionUserId = getSessionUserId(request);
    const userId = body.id || sessionUserId || DEFAULT_STUDENT_ID;
    const updated = await db.saveProfile({
      ...body,
      id: userId,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
