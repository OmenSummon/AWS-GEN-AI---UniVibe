import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { getSessionUserId, DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

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

    // 1. Determine organizer ID from query or cookie
    const sessionUserId = getSessionUserId(request);
    const organizerId = searchParams.get("organizerId") || sessionUserId || DEFAULT_ORGANIZER_ID;

    let profile = await db.getOrganizerProfile(organizerId);

    // 2. Read signed-in user cookies (Google / session)
    const nameMatch = cookieHeader.match(/univibe_user_name=([^;]+)/);
    const avatarMatch = cookieHeader.match(/univibe_user_avatar=([^;]+)/);
    const emailMatch = cookieHeader.match(/univibe_user_email=([^;]+)/);

    const cookieName = nameMatch ? safeDecode(nameMatch[1].trim()) : null;
    const cookieAvatar = avatarMatch ? safeDecode(avatarMatch[1].trim()) : null;
    const cookieEmail = emailMatch ? safeDecode(emailMatch[1].trim()) : null;

    if (cookieName) {
      profile = {
        ...(profile || {}),
        id: organizerId,
        name: cookieName,
        avatar_url: cookieAvatar || (profile ? safeDecode(profile.avatar_url) : null),
        email: cookieEmail || profile?.email || "",
        organization_name: profile?.organization_name || "JIS Tech Club & Student Council",
        department: profile?.department || "Department of Computer Science & Engineering, JIS University",
        role_title: profile?.role_title || "Student Organizer",
      };
    } else if (profile) {
      profile = {
        ...profile,
        name: safeDecode(profile.name),
        avatar_url: safeDecode(profile.avatar_url),
      };
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch organizer profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionUserId = getSessionUserId(request);
    const organizerId = body.id || sessionUserId || DEFAULT_ORGANIZER_ID;
    const saved = await db.saveOrganizerProfile({ ...body, id: organizerId });

    return NextResponse.json({ success: true, profile: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to save organizer profile" },
      { status: 500 }
    );
  }
}
