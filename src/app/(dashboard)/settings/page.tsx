"use client";
import { useEffect, useState } from "react";
import { getStoredSettings, saveStoredSettings } from "@/lib/storage";
import Swal from "sweetalert2";

const settingsTabs = ["Umum", "Keamanan", "Manajemen Tim", "Notifikasi", "Integrasi"];

interface IntegrationItem {
  name: string;
  desc: string;
  icon: string;
  connected: boolean;
}

function TelematicsIntegrationCard({ integ }: { integ: IntegrationItem }) {
  const [isConnected, setIsConnected] = useState(integ.connected);

  const handleConnect = () => {
    if (isConnected) {
      Swal.fire({
        title: `Putuskan Hubungan ${integ.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DF2721",
        confirmButtonText: "Ya, Putuskan",
        cancelButtonText: "Batal"
      }).then((res) => {
        if (res.isConfirmed) {
          setIsConnected(false);
          Swal.fire({ text: `Berhasil memutuskan ${integ.name}`, icon: "success", confirmButtonColor: "#003ada" });
        }
      });
    } else {
      Swal.fire({
        title: `Hubungkan ke ${integ.name}`,
        html: `
          <div class="space-y-4 text-left font-[var(--font-inter)]">
            <p class="text-xs text-slate-500">Masukkan kredensial integrasi telematika:</p>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">API Key / Token</label>
              <input id="swal-integ-token" type="password" class="swal2-input !mx-0 !w-full" placeholder="token integrasi...">
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#003ada",
        confirmButtonText: "Hubungkan",
        cancelButtonText: "Batal",
        preConfirm: () => {
          const val = (document.getElementById("swal-integ-token") as HTMLInputElement).value;
          if (!val) {
            Swal.showValidationMessage("Kunci token harus diisi!");
            return false;
          }
          return val;
        }
      }).then((res) => {
        if (res.isConfirmed) {
          let progress = 0;
          Swal.fire({
            title: `Menyinkronkan ${integ.name}...`,
            html: `
              <div class="w-full bg-[#003ada]/10 h-3 rounded-full overflow-hidden mt-4">
                <div id="integ-progress-bar" class="bg-[#003ada] h-full rounded-full transition-all duration-200" style="width: 0%"></div>
              </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              const bar = document.getElementById("integ-progress-bar");
              const interval = setInterval(() => {
                progress += 25;
                if (bar) bar.style.width = `${progress}%`;
                if (progress >= 100) {
                  clearInterval(interval);
                  setIsConnected(true);
                  Swal.fire({
                    icon: "success",
                    title: `Koneksi ${integ.name} Berhasil!`,
                    text: `Data telematika armada disinkronkan secara otomatis.`,
                    confirmButtonColor: "#003ada",
                  });
                }
              }, 250);
            }
          });
        }
      });
    }
  };

  return (
    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between items-start gap-4 w-full">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#003ada]">{integ.icon}</span>
          <span className="font-bold text-sm text-[#0b1c30]">{integ.name}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{integ.desc}</p>
      </div>
      <button 
        onClick={handleConnect}
        className={`w-full py-2 text-xs rounded-full font-bold transition-all cursor-pointer ${
          isConnected 
            ? "bg-[#1FA463]/10 text-[#1FA463] border border-[#1FA463]/20 hover:bg-[#1FA463]/20" 
            : "bg-[#003ada] text-white hover:opacity-90"
        }`}
      >
        {isConnected ? "Terhubung" : "Hubungkan"}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003ada]"></div>
      </div>
    );
  }

  const handleSaveSettings = (updated: any) => {
    setSettings(updated);
    saveStoredSettings(updated);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Pengaturan berhasil diperbarui",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement).value;
    const phone = (e.currentTarget.querySelector('input[type="tel"]') as HTMLInputElement).value;
    const lang = (e.currentTarget.querySelector('select') as HTMLSelectElement).value;

    const updated = {
      ...settings,
      email,
      phone,
      lang
    };
    handleSaveSettings(updated);
  };

  const handlePasswordChange = () => {
    Swal.fire({
      title: "Ganti Kata Sandi",
      html: `
        <div class="space-y-4 font-[var(--font-inter)] text-left">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kata Sandi Lama</label>
            <input id="swal-old-pwd" type="password" class="swal2-input !mx-0 !w-full" placeholder="Masukkan kata sandi lama">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Kata Sandi Baru</label>
            <input id="swal-new-pwd" type="password" class="swal2-input !mx-0 !w-full" placeholder="Minimal 6 karakter">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Konfirmasi Kata Sandi Baru</label>
            <input id="swal-confirm-pwd" type="password" class="swal2-input !mx-0 !w-full" placeholder="Ulangi kata sandi baru">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#003ada",
      cancelButtonColor: "#747687",
      confirmButtonText: "Perbarui Sandi",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      },
      preConfirm: () => {
        const oldPwd = (document.getElementById("swal-old-pwd") as HTMLInputElement).value;
        const newPwd = (document.getElementById("swal-new-pwd") as HTMLInputElement).value;
        const confirmPwd = (document.getElementById("swal-confirm-pwd") as HTMLInputElement).value;

        if (!oldPwd || !newPwd || !confirmPwd) {
          Swal.showValidationMessage("Semua bidang harus diisi!");
          return false;
        }
        if (newPwd.length < 6) {
          Swal.showValidationMessage("Kata sandi baru minimal 6 karakter!");
          return false;
        }
        if (newPwd !== confirmPwd) {
          Swal.showValidationMessage("Konfirmasi kata sandi tidak cocok!");
          return false;
        }
        return { oldPwd, newPwd };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Kata Sandi Diperbarui!",
          text: "Kata sandi Anda berhasil diubah secara aman.",
          confirmButtonColor: "#003ada",
          customClass: {
            popup: "rounded-[24px] font-[var(--font-inter)]",
          }
        });
      }
    });
  };

  const handle2FAToggle = () => {
    const updated = {
      ...settings,
      twoFA: !settings.twoFA
    };
    setSettings(updated);
    saveStoredSettings(updated);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `2FA ${updated.twoFA ? "diaktifkan" : "dinonaktifkan"}`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleThemeChange = (mode: "light" | "dark") => {
    if (mode === "dark") {
      Swal.fire({
        icon: "info",
        title: "Eksklusif Premium",
        text: "Mode gelap saat ini hanya tersedia untuk pengguna tingkat Enterprise.",
        confirmButtonColor: "#003ada",
        customClass: {
          popup: "rounded-[24px] font-[var(--font-inter)]",
        }
      });
      return;
    }
    const updated = {
      ...settings,
      themeMode: mode
    };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Team management actions
  const handleInviteMember = () => {
    Swal.fire({
      title: "Undang Anggota Tim",
      html: `
        <div class="space-y-4 font-[var(--font-inter)] text-left">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
            <input id="swal-member-name" class="swal2-input !mx-0 !w-full" placeholder="Contoh: Budi Santoso">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Email Bisnis</label>
            <input id="swal-member-email" type="email" class="swal2-input !mx-0 !w-full" placeholder="Contoh: budi@trustfleet.ai">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Peran Akses</label>
            <select id="swal-member-role" class="swal2-input !mx-0 !w-full !p-3">
              <option value="Analis Risiko">Analis Risiko</option>
              <option value="Underwriter">Underwriter</option>
              <option value="Petugas Risiko">Petugas Risiko</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#003ada",
      cancelButtonColor: "#747687",
      confirmButtonText: "Kirim Undangan",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      },
      preConfirm: () => {
        const name = (document.getElementById("swal-member-name") as HTMLInputElement).value;
        const email = (document.getElementById("swal-member-email") as HTMLInputElement).value;
        const role = (document.getElementById("swal-member-role") as HTMLSelectElement).value;

        if (!name || !email) {
          Swal.showValidationMessage("Semua bidang harus diisi!");
          return false;
        }
        return { name, email, role };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        const initials = res.value.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        const newMember = {
          name: res.value.name,
          role: res.value.role,
          initials,
          email: res.value.email
        };

        const updatedTeam = [...settings.team, newMember];
        const updated = {
          ...settings,
          team: updatedTeam
        };
        handleSaveSettings(updated);
      }
    });
  };

  const handleRemoveMember = (email: string) => {
    if (email === "m.sterling@trustfleet.ai") {
      Swal.fire({
        icon: "error",
        title: "Aksi Ditolak",
        text: "Anda tidak dapat menghapus akun Anda sendiri.",
        confirmButtonColor: "#003ada",
      });
      return;
    }

    Swal.fire({
      title: "Hapus Anggota?",
      text: "Anggota tim ini tidak akan lagi memiliki akses ke dashboard TrustFleet AI.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2721",
      cancelButtonColor: "#747687",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      }
    }).then((res) => {
      if (res.isConfirmed) {
        const updatedTeam = settings.team.filter((m: any) => m.email !== email);
        const updated = {
          ...settings,
          team: updatedTeam
        };
        handleSaveSettings(updated);
      }
    });
  };

  // API Key actions
  const handleGenerateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let keySuffix = "";
    for (let i = 0; i < 12; i++) {
      keySuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newKey = `tf_live_${keySuffix}`;
    const updatedKeys = [...(settings.apiKeys || []), newKey];
    const updated = {
      ...settings,
      apiKeys: updatedKeys
    };
    handleSaveSettings(updated);
  };

  const handleRevokeApiKey = (key: string) => {
    Swal.fire({
      title: "Revoke API Key?",
      text: "Semua sistem yang menggunakan API Key ini akan langsung terputus dari TrustFleet AI.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2721",
      cancelButtonColor: "#747687",
      confirmButtonText: "Revoke",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      }
    }).then((res) => {
      if (res.isConfirmed) {
        const updatedKeys = settings.apiKeys.filter((k: string) => k !== key);
        const updated = {
          ...settings,
          apiKeys: updatedKeys
        };
        handleSaveSettings(updated);
      }
    });
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="bg-[#eff4ff] p-1.5 rounded-full flex gap-1 mb-8 shadow-inner border border-[#c4c5d8]/20 overflow-x-auto flex-nowrap no-scrollbar">
        {settingsTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-2.5 rounded-full text-[14px] transition-all shrink-0 cursor-pointer ${
              activeTab === i
                ? "bg-[#003ada] text-white font-semibold shadow-md"
                : "text-[#444655] font-medium hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (Persistent Profile Card & Completeness) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#003ada] p-1">
                <div className="w-full h-full rounded-full bg-[#003ada] flex items-center justify-center text-white font-bold text-4xl">
                  {settings.team[0]?.initials || "MS"}
                </div>
              </div>
              <button 
                onClick={() => Swal.fire({ text: "Fitur ubah foto profil akan segera hadir.", icon: "info", confirmButtonColor: "#003ada" })}
                className="absolute bottom-1 right-1 w-10 h-10 bg-[#003ada] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <h3 className="font-[var(--font-jakarta)] text-[24px] font-bold text-[#0b1c30]">{settings.team[0]?.name || "Marcus Sterling"}</h3>
            <p className="text-[#444655]/70 mb-6">{settings.team[0]?.role || "Kepala Risiko"}</p>
            <button 
              onClick={() => setActiveTab(0)}
              className="w-full py-3 px-6 rounded-full bg-[#003ada] text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profil
            </button>
          </div>

          {/* Account Health */}
          <div className="bg-[#0029a1] p-8 rounded-[24px] shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold mb-2">Verifikasi Akun</h4>
              <p className="text-[#b5c0ff]/70 text-sm mb-6">Profil Anda 85% lengkap. Selesaikan verifikasi untuk membuka batas API yang lebih tinggi.</p>
              <div className="w-full bg-white/10 h-2 rounded-full mb-4">
                <div className="bg-white h-full rounded-full" style={{ width: "85%" }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Admin Terverifikasi</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Right Column (Dynamic content based on active tab) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* TAB 0: UMUM */}
          {activeTab === 0 && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Detail Akun</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold font-[var(--font-inter)] tracking-[0.05em] text-[#444655] uppercase ml-2">Alamat Email</label>
                    <input 
                      className="w-full px-6 py-3.5 bg-[#FAFAFC] border border-[#c4c5d8]/40 rounded-full focus:ring-2 focus:ring-[#0029a1] focus:border-[#0029a1] transition-all text-[14px]" 
                      type="email" 
                      defaultValue={settings.email} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold font-[var(--font-inter)] tracking-[0.05em] text-[#444655] uppercase ml-2">Nomor Telepon</label>
                    <input 
                      className="w-full px-6 py-3.5 bg-[#FAFAFC] border border-[#c4c5d8]/40 rounded-full focus:ring-2 focus:ring-[#0029a1] focus:border-[#0029a1] transition-all text-[14px]" 
                      type="tel" 
                      defaultValue={settings.phone} 
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[12px] font-bold font-[var(--font-inter)] tracking-[0.05em] text-[#444655] uppercase ml-2">Bahasa Pilihan</label>
                    <select 
                      className="w-full px-6 py-3.5 bg-[#FAFAFC] border border-[#c4c5d8]/40 rounded-full focus:ring-2 focus:ring-[#0029a1] focus:border-[#0029a1] transition-all appearance-none cursor-pointer text-[14px]"
                      defaultValue={settings.lang}
                    >
                      <option>Bahasa Inggris (Amerika Serikat)</option>
                      <option>Bahasa Indonesia</option>
                      <option>Bahasa Spanyol (Meksiko)</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                    <span className="material-symbols-outlined">tune</span>
                  </div>
                  <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Preferensi Tampilan</h3>
                </div>
                <div className="p-6 bg-[#FAFAFC] rounded-[24px] flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-[#0b1c30]">Tema Tampilan</p>
                    <p className="text-xs text-[#444655]">Alihkan tema antarmuka pengguna</p>
                  </div>
                  <div className="flex bg-white p-1 rounded-full border border-[#c4c5d8]/30">
                    <button
                      type="button"
                      onClick={() => handleThemeChange("light")}
                      className={`p-2 rounded-full transition-all cursor-pointer ${settings.themeMode === "light" ? "bg-[#003ada] text-white shadow-sm" : "text-[#444655] hover:bg-[#e6eeff]"}`}
                    >
                      <span className="material-symbols-outlined text-sm">light_mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange("dark")}
                      className={`p-2 rounded-full transition-all cursor-pointer ${settings.themeMode === "dark" ? "bg-[#003ada] text-white shadow-sm" : "text-[#444655] hover:bg-[#e6eeff]"}`}
                    >
                      <span className="material-symbols-outlined text-sm">dark_mode</span>
                    </button>
                  </div>
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-[#003ada] text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-[#0029a1]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                  Simpan Perubahan
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: KEAMANAN */}
          {activeTab === 1 && (
            <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Pengaturan Keamanan</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-[24px] hover:bg-[#FAFAFC] transition-all border border-transparent hover:border-[#c4c5d8]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e6eeff] rounded-full flex items-center justify-center text-[#444655]">
                      <span className="material-symbols-outlined">lock_reset</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#0b1c30]">Ganti Kata Sandi</p>
                      <p className="text-sm text-[#444655]/70">Terakhir diubah 4 bulan lalu</p>
                    </div>
                  </div>
                  <button onClick={handlePasswordChange} className="px-4 py-2 rounded-full border border-[#0029a1] text-[#0029a1] font-bold text-sm hover:bg-[#0029a1] hover:text-white transition-all cursor-pointer">Perbarui</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-[24px] hover:bg-[#FAFAFC] transition-all border border-transparent hover:border-[#c4c5d8]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e6eeff] rounded-full flex items-center justify-center text-[#444655]">
                      <span className="material-symbols-outlined">shield_person</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#0b1c30]">Autentikasi Dua Faktor (2FA)</p>
                      <p className="text-sm text-[#444655]/70">Minta kode verifikasi setiap masuk</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.twoFA} onChange={handle2FAToggle} />
                    <div className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${settings.twoFA ? "bg-[#003ada] after:translate-x-full after:border-white" : "bg-[#d3e4ff]"}`} />
                  </label>
                </div>
              </div>

              <div className="border-t border-[#c4c5d8]/20 pt-6">
                <h4 className="font-[var(--font-jakarta)] text-sm font-bold text-[#0b1c30] mb-4">Sesi Masuk Aktif</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl text-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#003ada]">desktop_windows</span>
                      <div>
                        <p className="font-semibold text-[#0b1c30]">Chrome di Windows PC</p>
                        <p className="text-xs text-slate-500">Jakarta, Indonesia • Sesi Saat Ini</p>
                      </div>
                    </div>
                    <span className="text-xs bg-[#1FA463]/10 text-[#1FA463] px-2.5 py-1 rounded-full font-bold">Aktif</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl text-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">phone_iphone</span>
                      <div>
                        <p className="font-semibold text-[#0b1c30]">Safari di iPhone 15 Pro</p>
                        <p className="text-xs text-slate-500">Jakarta, Indonesia • 2 jam lalu</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => Swal.fire({ text: "Sesi berhasil diputuskan.", icon: "success", confirmButtonColor: "#003ada" })}
                      className="text-xs text-[#DF2721] font-semibold hover:underline cursor-pointer"
                    >
                      Keluarkan
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: MANAJEMEN TIM */}
          {activeTab === 2 && (
            <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Manajemen Tim</h3>
                </div>
                <button 
                  onClick={handleInviteMember}
                  className="bg-[#003ada] text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  Undang Anggota
                </button>
              </div>

              <div className="divide-y divide-[#c4c5d8]/20">
                {settings.team.map((member: any) => (
                  <div key={member.email} className="py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#003ada]/10 text-[#003ada] flex items-center justify-center font-bold text-sm">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-bold text-[#0b1c30] text-sm">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs bg-[#eff4ff] text-[#0029a1] font-bold px-3 py-1 rounded-full border border-[#0029a1]/10">
                        {member.role}
                      </span>
                      <button 
                        onClick={() => handleRemoveMember(member.email)}
                        className="text-[#747687] hover:text-[#DF2721] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 3: NOTIFIKASI */}
          {activeTab === 3 && (
            <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Preferensi Notifikasi</h3>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-[#003ada] mt-1 rounded focus:ring-[#003ada]" 
                    checked={settings.notifs?.email}
                    onChange={() => {
                      const updated = {
                        ...settings,
                        notifs: { ...settings.notifs, email: !settings.notifs.email }
                      };
                      handleSaveSettings(updated);
                    }}
                  />
                  <div>
                    <p className="font-bold text-[#0b1c30] text-sm">Notifikasi Email</p>
                    <p className="text-xs text-slate-500 mt-0.5">Kirim email ketika skor kredit alternatif armada berubah atau butuh tinjauan segera.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-[#003ada] mt-1 rounded focus:ring-[#003ada]" 
                    checked={settings.notifs?.inapp}
                    onChange={() => {
                      const updated = {
                        ...settings,
                        notifs: { ...settings.notifs, inapp: !settings.notifs.inapp }
                      };
                      handleSaveSettings(updated);
                    }}
                  />
                  <div>
                    <p className="font-bold text-[#0b1c30] text-sm">Notifikasi Dalam Aplikasi</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tampilkan notifikasi penting pada panel lonceng di atas secara real-time.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-[#003ada] mt-1 rounded focus:ring-[#003ada]" 
                    checked={settings.notifs?.weekly}
                    onChange={() => {
                      const updated = {
                        ...settings,
                        notifs: { ...settings.notifs, weekly: !settings.notifs.weekly }
                      };
                      handleSaveSettings(updated);
                    }}
                  />
                  <div>
                    <p className="font-bold text-[#0b1c30] text-sm">Ringkasan Mingguan</p>
                    <p className="text-xs text-slate-500 mt-0.5">Kirim laporan mingguan komprehensif tentang performa portofolio Anda setiap hari Senin.</p>
                  </div>
                </label>
              </div>
            </section>
          )}

          {/* TAB 4: INTEGRASI */}
          {activeTab === 4 && (
            <div className="space-y-6">
              {/* API Keys */}
              <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
                <div className="flex justify-between items-center gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                      <span className="material-symbols-outlined">api</span>
                    </div>
                    <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Kunci API (API Keys)</h3>
                  </div>
                  <button 
                    onClick={handleGenerateApiKey}
                    className="bg-[#003ada] text-white text-xs font-semibold py-2.5 px-4 rounded-full flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">vpn_key</span>
                    Buat Kunci Baru
                  </button>
                </div>

                <div className="space-y-3">
                  {settings.apiKeys && settings.apiKeys.length > 0 ? (
                    settings.apiKeys.map((key: string) => (
                      <div key={key} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl text-sm font-mono border border-slate-200">
                        <span className="text-[#0b1c30] font-bold">{key}</span>
                        <div className="flex items-center gap-3 font-sans">
                          <span className="text-[10px] bg-[#1FA463]/10 text-[#1FA463] px-2 py-0.5 rounded font-bold uppercase">Live</span>
                          <button 
                            onClick={() => handleRevokeApiKey(key)}
                            className="text-[#DF2721] hover:underline text-xs font-semibold cursor-pointer"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic text-center py-4">Belum ada API Key aktif.</p>
                  )}
                </div>
              </section>

              {/* Telematics Integrations */}
              <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                    <span className="material-symbols-outlined">devices_other</span>
                  </div>
                  <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Integrasi Telematika Alternatif</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Geotab", desc: "Koneksi data sensor armada komprehensif.", icon: "local_shipping", connected: true },
                    { name: "Samsara", desc: "Data GPS dan keselamatan berkendara real-time.", icon: "navigation", connected: false },
                    { name: "Webfleet", desc: "Riwayat pemeliharaan dan konsumsi bahan bakar.", icon: "build", connected: false }
                  ].map((integ) => (
                    <TelematicsIntegrationCard key={integ.name} integ={integ} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
