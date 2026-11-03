import React from "react";
import { OrganizerSidebar } from "@/components/navigation/OrganizerSidebar";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#1e1b4b] flex flex-col lg:flex-row relative">
      <OrganizerSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
