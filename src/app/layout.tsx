import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniVibe — Student Intelligence Engine",
  description: "Discover Your Potential. Find Your People. Build Your Future. AI-powered campus engagement platform exclusively for university students.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-midnight-900 text-lavender-100 antialiased selection:bg-violet selection:text-white">
        {children}
      </body>
    </html>
  );
}

