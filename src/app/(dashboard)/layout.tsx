"use client";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { ToastProvider } from "@/components/Toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-[280px]">
          <TopNavBar />
          <main className="pt-24 px-8 pb-12 max-w-[1440px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
