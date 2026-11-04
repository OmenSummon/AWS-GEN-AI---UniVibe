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
      <body className="min-h-screen bg-[#2C2B2B] text-[#FEFEFE] antialiased selection:bg-[#446B8D] selection:text-[#FEFEFE]">
        {children}
      </body>
    </html>
  );
}
