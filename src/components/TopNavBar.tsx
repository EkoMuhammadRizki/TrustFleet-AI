"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { notifications } from "@/lib/data";
import Swal from "sweetalert2";

export default function TopNavBar({ onMenuClick = () => {} }: { onMenuClick?: () => void }) {
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

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUserMenu(false);
    Swal.fire({
      title: "Apakah Anda yakin ingin keluar?",
      text: "Anda akan diarahkan kembali ke halaman utama.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003ada",
      cancelButtonColor: "#747687",
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 flex justify-between items-center px-4 md:px-8 bg-white border-b border-[#c4c5d8]/30 shadow-sm z-40">
      {/* Menu Hamburger & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-full hover:bg-[#eff4ff] text-[#061649] transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Workspace Selector */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3.5 py-1.5 rounded-full text-[#0029a1] text-xs font-bold border border-[#dee1ff] select-none cursor-pointer hover:bg-[#dee1ff] transition-colors">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span className="hidden sm:inline">Astra UD Trucks - Jakarta</span>
            <span className="sm:hidden">Jakarta</span>
          </div>
          
          {/* Connection/System Health Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1FA463]/10 text-[#1FA463] rounded-full border border-[#1FA463]/20 text-xs font-bold select-none">
            <span className="w-1.5 h-1.5 bg-[#1FA463] rounded-full animate-pulse"></span>
            <span>AI Engine: Aktif</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            suppressHydrationWarning={true}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eff4ff] transition-all relative cursor-pointer"
            onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
          >
            <span className="material-symbols-outlined text-[#444655]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#DF2721] rounded-full ring-2 ring-white" />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-[calc(100vw-32px)] sm:w-96 max-w-sm sm:max-w-none bg-white rounded-[20px] shadow-2xl border border-[#c4c5d8]/30 overflow-hidden animate-fade-in z-50">
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
            suppressHydrationWarning={true}
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
                  onClick={handleLogout}
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
