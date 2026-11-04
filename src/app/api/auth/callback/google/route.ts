import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";

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
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.warn("Google OAuth returned error:", error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(`Google sign-in was cancelled (${error})`)}`, appUrl)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Authorization code missing from Google")}`, appUrl)
      );
    }

    // Decode state
    let role = "student";
    let returnTo = "/dashboard";
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
        if (decoded.role === "organizer" || decoded.role === "student") {
          role = decoded.role;
        }
        if (decoded.returnTo) {
          returnTo = decoded.returnTo;
        }
      } catch (err) {
        console.error("Failed to parse OAuth state:", err);
      }
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${appUrl}/api/auth/callback/google`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Google OAuth credentials missing on server")}`, appUrl)
      );
    }

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Failed to exchange authorization code with Google")}`, appUrl)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user information from Google API
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userinfoResponse.ok) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Failed to fetch user profile from Google")}`, appUrl)
      );
    }

    const googleUser = await userinfoResponse.json();
    const userId = `google-${googleUser.sub}`;
    const userEmail = googleUser.email || "";
    const rawName = googleUser.name || googleUser.given_name || "UniVibe User";
    const userName = safeDecode(rawName);
    const userPicture = safeDecode(googleUser.picture || "");

    // 3. Check existing user in Neon DB
    let existingProfile = null;
    try {
      if (role === "student") {
        existingProfile = await db.getProfile(userId);
      }
    } catch (e) {
      console.warn("Could not check existing profile:", e);
    }

    const isFirstTimeStudent = role === "student" && (!existingProfile || !existingProfile.onboarding_completed);

    try {
      if (role === "organizer") {
        await db.saveOrganizerProfile({
          id: userId,
          name: userName,
          organization_name: "JIS Tech Club & Student Council",
          department: "Department of Computer Science & Engineering, JIS University",
          email: userEmail,
          phone: "",
          role_title: "Student Organizer",
          avatar_url: userPicture,
        });
      } else {
        if (!existingProfile) {
          // First-time student: save skeleton profile with Google credentials, onboarding_completed: false
          await db.saveProfile({
            id: userId,
            student_name: userName,
            department: "",
            year: "",
            interests: [],
            skills: [],
            free_time: "",
            goal: "",
            tone: "Friendly",
            university_name: "JIS University",
            avatar_url: userPicture,
            onboarding_completed: false,
          });
        }
      }
    } catch (dbErr) {
      console.error("Error saving user to DB during Google sign-in:", dbErr);
    }

    // 4. Build redirection response with session cookies
    // First-time students are directed to /onboarding to declare skills & interests
    const destination = role === "organizer" 
      ? "/organizer/dashboard" 
      : (isFirstTimeStudent ? "/onboarding" : (returnTo || "/dashboard"));
    const redirectResponse = NextResponse.redirect(new URL(destination, appUrl));

    const cookieOptions = {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };

    redirectResponse.cookies.set("univibe_role", role, cookieOptions);
    redirectResponse.cookies.set("univibe_user_id", userId, cookieOptions);
    redirectResponse.cookies.set("univibe_user_name", userName, cookieOptions);
    redirectResponse.cookies.set("univibe_user_email", userEmail, cookieOptions);
    redirectResponse.cookies.set("univibe_user_avatar", userPicture, cookieOptions);

    // Clear the temporary oauth state cookie
    redirectResponse.cookies.set("univibe_oauth_state", "", {
      path: "/",
      maxAge: 0,
    });

    return redirectResponse;
  } catch (err: any) {
    console.error("Unexpected error in Google OAuth callback:", err);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(err?.message || "Google sign-in encountered an unexpected error")}`, appUrl)
    );
  }
}
