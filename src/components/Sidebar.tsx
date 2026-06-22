"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Swal from "sweetalert2";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/customers", icon: "person_search", label: "Pelanggan 360" },
  { href: "/credit-scoring", icon: "credit_score", label: "Skor Kredit" },
  { href: "/risk-analytics", icon: "analytics", label: "Analisis Risiko" },
  { href: "/reports", icon: "assessment", label: "Laporan" },
  { href: "/integration", icon: "devices_other", label: "Integrasi" },
  { href: "/guide", icon: "menu_book", label: "Panduan" },
  { href: "/settings", icon: "settings", label: "Pengaturan" },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/credit-scoring") return pathname.startsWith("/credit-scoring");
    return pathname.startsWith(href);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
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
        sessionStorage.removeItem("tf_welcome_shown");
        window.location.href = "/";
      }
    });
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#061649]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] sidebar-gradient text-white flex flex-col py-6 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close Button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 lg:hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Brand */}
        <div className="px-6 mb-10">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
            <div className="w-12 h-12 relative">
              <Image
                src="/logo/TrustFleetAILogoNavy.png"
                alt="TrustFleet AI Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-[var(--font-inter)] font-bold text-xl">TrustFleet AI</p>
              <p className="text-[11px] text-[#b5c0ff] opacity-70">Intelegensi Fintech</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-full mx-2 transition-all duration-150 ${
                isActive(item.href)
                  ? "bg-[#003ada] text-white shadow-lg"
                  : "text-white/70 hover:bg-white/[0.08]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`font-[var(--font-inter)] text-[14px] ${isActive(item.href) ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="mt-auto px-4 mb-2">
          <div className="bg-white/[0.06] p-4 rounded-[24px] flex items-center gap-3 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#003ada] flex items-center justify-center font-bold text-white text-sm shrink-0">
              MS
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-[var(--font-inter)] font-bold text-sm truncate text-white">Marcus Sterling</p>
              <p className="text-[12px] truncate text-white/70">Petugas Risiko</p>
            </div>
            <Link href="/" onClick={handleLogout} className="material-symbols-outlined text-white/40 hover:text-white transition-colors">
              logout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
