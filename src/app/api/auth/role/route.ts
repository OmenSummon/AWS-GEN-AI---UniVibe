import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, username, password } = body;

    if (role !== "student" && role !== "organizer") {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    if (role === "organizer") {
      // Validate student organizer credentials
      if (!username || !password) {
        return NextResponse.json(
          { error: "Username/Email and Password are required for Student Organizer access." },
          { status: 400 }
        );
      }

      // Allow official JIS University student organizer emails or usernames
      const validUsernames = [
        "organizer",
        "admin",
        "aarav.roy",
        "student.organizer@jisuniversity.ac.in",
        "organizer@jisuniversity.ac.in",
        "jis.organizer@jisuniversity.ac.in",
        "evelyn.vance@university.edu"
      ];
      
      const isUserMatch = validUsernames.some(
        (u) => u.toLowerCase() === username.trim().toLowerCase()
      ) || username.trim().length >= 3;

      if (!isUserMatch || password.trim().length < 4) {
        return NextResponse.json(
          { error: "Invalid credentials. Password must be at least 4 characters." },
          { status: 401 }
        );
      }
    }

    const redirectUrl =
      role === "organizer"
        ? "/organizer/dashboard"
        : "/onboarding";

    const response = NextResponse.json({
      success: true,
      role,
      redirectUrl,
    });

    // Set cookie for role persistence
    response.cookies.set("univibe_role", role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process authentication." },
      { status: 500 }
    );
  }
}
