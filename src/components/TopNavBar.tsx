"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { notifications } from "@/lib/data";

export default function TopNavBar() {
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 flex justify-between items-center px-8 bg-white border-b border-[#c4c5d8]/30 shadow-sm z-40">
      {/* Search Bar */}
      <div className="flex items-center bg-[#eff4ff] px-4 py-2 rounded-full w-96 gap-3">
        <span className="material-symbols-outlined text-[#747687]">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 focus:outline-none font-[var(--font-inter)] text-[14px] w-full placeholder:text-[#747687]/60"
          placeholder="Cari data armada atau profil kredit..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eff4ff] transition-all relative"
            onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
          >
            <span className="material-symbols-outlined text-[#444655]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#DF2721] rounded-full ring-2 ring-white" />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-[20px] shadow-2xl border border-[#c4c5d8]/30 overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-[#c4c5d8]/20">
                <h4 className="font-[var(--font-jakarta)] font-bold text-[16px]">Notifikasi</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.customerId ? `/credit-scoring/${n.customerId}` : "/reports"}
                    className={`block px-4 py-3 hover:bg-[#eff4ff] transition-colors border-b border-[#c4c5d8]/10 ${n.unread ? "bg-[#eff4ff]/50" : ""}`}
                    onClick={() => setShowNotif(false)}
                  >
                    <div className="flex items-start gap-3">
                      {n.unread && <span className="w-2 h-2 rounded-full bg-[#003ada] mt-2 shrink-0" />}
                      <div className={!n.unread ? "ml-5" : ""}>
                        <p className="font-semibold text-sm text-[#0b1c30]">{n.title}</p>
                        <p className="text-xs text-[#444655] mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-[#747687] mt-1">{n.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-[#c4c5d8]/30" />

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            className="flex items-center gap-3 px-3 py-1 rounded-full hover:bg-[#eff4ff] transition-all cursor-pointer"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
          >
            <div className="text-right hidden sm:block">
              <p className="font-[var(--font-inter)] font-semibold text-[12px] text-[#0b1c30]">Marcus Sterling</p>
              <p className="text-[10px] text-[#444655]">Petugas Risiko</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#003ada] flex items-center justify-center text-white font-bold text-sm">
              MS
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-14 w-56 bg-white rounded-[16px] shadow-2xl border border-[#c4c5d8]/30 overflow-hidden animate-fade-in z-50">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#eff4ff] transition-colors text-sm font-medium text-[#0b1c30]"
                onClick={() => setShowUserMenu(false)}
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                Profil
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#eff4ff] transition-colors text-sm font-medium text-[#0b1c30]"
                onClick={() => setShowUserMenu(false)}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
                Pengaturan
              </Link>
              <div className="border-t border-[#c4c5d8]/20">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#ffdad6]/30 transition-colors text-sm font-medium text-[#DF2721]"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Keluar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
