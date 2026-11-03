import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-midnight-950 text-lavender-100 flex flex-col lg:flex-row relative selection:bg-violet selection:text-white">
      {/* Background ambient light */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[400px] bg-violet/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[350px] bg-violet-dark/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}

