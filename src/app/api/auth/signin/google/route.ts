import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "student";
    const returnTo = searchParams.get("returnTo") || (role === "organizer" ? "/organizer/dashboard" : "/dashboard");

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Google Client ID is not configured in .env.local")}`, request.url)
      );
    }

    // Determine the redirect URI (callback)
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const redirectUri = `${appUrl}/api/auth/callback/google`;

    // State object to persist role and CSRF protection nonce
    const statePayload = {
      role,
      returnTo,
      nonce: Math.random().toString(36).substring(2) + Date.now().toString(36),
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

    // Construct Google OAuth URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");
    googleAuthUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(googleAuthUrl.toString());

    // Set secure state cookie for CSRF validation
    response.cookies.set("univibe_oauth_state", statePayload.nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Error initiating Google OAuth:", error);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error?.message || "Failed to initiate Google sign-in")}`, request.url)
    );
  }
}

