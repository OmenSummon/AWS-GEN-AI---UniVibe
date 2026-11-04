import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#2C2B2B] text-[#FEFEFE] flex flex-col lg:flex-row relative">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-[#2C2B2B]">
        <main className="flex-1 flex flex-col min-h-screen px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-8 lg:px-12 lg:py-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
