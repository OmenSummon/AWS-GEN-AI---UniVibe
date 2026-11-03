import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#1e1b4b] flex flex-col lg:flex-row relative">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
