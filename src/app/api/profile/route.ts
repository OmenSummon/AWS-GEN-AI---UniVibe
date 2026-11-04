import { AiService } from "@/lib/ai/ai-service";
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
        department: profile?.department || "",
        year: profile?.year || "",
        interests: profile?.interests || [],
        skills: profile?.skills || [],
        free_time: profile?.free_time || "",
        goal: profile?.goal || "",
        tone: profile?.tone || "Friendly",
        university_name: profile?.university_name || "JIS University",
        onboarding_completed: profile?.onboarding_completed ?? false,
      };
    } else if (profile) {
      profile = {
        ...profile,
        student_name: safeDecode(profile.student_name),
        avatar_url: safeDecode(profile.avatar_url),
      };
    }

    if (!profile) {
      profile = {
        id: userId,
        student_name: cookieName || "UniVibe Student",
        avatar_url: cookieAvatar || null,
        department: "",
        year: "",
        interests: [],
        skills: [],
        free_time: "",
        goal: "",
        tone: "Friendly",
        university_name: "JIS University",
        onboarding_completed: false,
      };
      try {
        await db.saveProfile(profile);
      } catch (e) {
        console.warn("Could not persist initial profile:", e);
      }
    }

    let aiProfile = await db.getAiProfile(userId);
    if (!aiProfile && profile && profile.onboarding_completed) {
      try {
        aiProfile = await AiService.generateProfile(profile);
      } catch (e) {
        console.warn("Could not generate AI profile:", e);
      }
    }

    return NextResponse.json({ profile, aiProfile });
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
