"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { ToastProvider } from "@/components/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 min-w-0 ml-0 lg:ml-[280px] w-full">
          <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="pt-24 px-4 md:px-8 pb-12 max-w-[1440px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
