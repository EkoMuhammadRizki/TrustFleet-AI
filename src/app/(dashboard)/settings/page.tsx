"use client";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import Swal from "sweetalert2";

const settingsTabs = ["Umum", "Keamanan", "Manajemen Tim", "Notifikasi", "Integrasi"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [twoFA, setTwoFA] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const { showToast } = useToast();

  return (
    <>
      {/* Tab Navigation */}
      <div className="bg-[#eff4ff] p-1.5 rounded-full inline-flex gap-1 mb-8 shadow-inner border border-[#c4c5d8]/20">
        {settingsTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-2.5 rounded-full text-[14px] transition-all ${
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
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#003ada] p-1">
                <div className="w-full h-full rounded-full bg-[#003ada] flex items-center justify-center text-white font-bold text-4xl">MS</div>
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-[#003ada] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <h3 className="font-[var(--font-jakarta)] text-[24px] font-bold text-[#0b1c30]">Marcus Sterling</h3>
            <p className="text-[#444655]/70 mb-6">Kepala Risiko &amp; Manajemen Armada</p>
            <button className="w-full py-3 px-6 rounded-full bg-[#003ada] text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
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

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Account Details */}
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
                <input className="w-full px-6 py-3.5 bg-[#FAFAFC] border border-[#c4c5d8]/40 rounded-full focus:ring-2 focus:ring-[#0029a1] focus:border-[#0029a1] transition-all text-[14px]" type="email" defaultValue="m.sterling@trustfleet.ai" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold font-[var(--font-inter)] tracking-[0.05em] text-[#444655] uppercase ml-2">Nomor Telepon</label>
                <input className="w-full px-6 py-3.5 bg-[#FAFAFC] border border-[#c4c5d8]/40 rounded-full focus:ring-2 focus:ring-[#0029a1] focus:border-[#0029a1] transition-all text-[14px]" type="tel" defaultValue="+1 (555) 902-1244" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[12px] font-bold font-[var(--font-inter)] tracking-[0.05em] text-[#444655] uppercase ml-2">Bahasa Pilihan</label>
                <select className="w-full px-6 py-3.5 bg-[#FAFAFC] border border-[#c4c5d8]/40 rounded-full focus:ring-2 focus:ring-[#0029a1] focus:border-[#0029a1] transition-all appearance-none cursor-pointer text-[14px]">
                  <option>Bahasa Inggris (Amerika Serikat)</option>
                  <option>Bahasa Indonesia</option>
                  <option>Bahasa Spanyol (Meksiko)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                <span className="material-symbols-outlined">security</span>
              </div>
              <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Keamanan</h3>
            </div>
            <div className="space-y-6">
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
                <button className="px-4 py-2 rounded-full border border-[#0029a1] text-[#0029a1] font-bold text-sm hover:bg-[#0029a1] hover:text-white transition-all">Perbarui</button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-[24px] hover:bg-[#FAFAFC] transition-all border border-transparent hover:border-[#c4c5d8]/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#e6eeff] rounded-full flex items-center justify-center text-[#444655]">
                    <span className="material-symbols-outlined">shield_person</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1c30]">Autentikasi Dua Faktor</p>
                    <p className="text-sm text-[#444655]/70">Amankan akun Anda dengan 2FA</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
                  <div className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${twoFA ? "bg-[#003ada] after:translate-x-full after:border-white" : "bg-[#d3e4ff]"}`} />
                </label>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#003ada]/10 rounded-full text-[#003ada]">
                <span className="material-symbols-outlined">tune</span>
              </div>
              <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Preferensi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-[#FAFAFC] rounded-[24px] flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[#0b1c30]">Tema Tampilan</p>
                  <p className="text-xs text-[#444655]">Alihkan mode</p>
                </div>
                <div className="flex bg-white p-1 rounded-full border border-[#c4c5d8]/30">
                  <button
                    onClick={() => setThemeMode("light")}
                    className={`p-2 rounded-full transition-all ${themeMode === "light" ? "bg-[#003ada] text-white shadow-sm" : "text-[#444655] hover:bg-[#e6eeff]"}`}
                  >
                    <span className="material-symbols-outlined text-sm">light_mode</span>
                  </button>
                  <button
                    onClick={() => { setThemeMode("dark"); showToast("Mode gelap adalah bagian dari pemutakhiran antarmuka premium.", "info"); }}
                    className={`p-2 rounded-full transition-all ${themeMode === "dark" ? "bg-[#003ada] text-white shadow-sm" : "text-[#444655] hover:bg-[#e6eeff]"}`}
                  >
                    <span className="material-symbols-outlined text-sm">dark_mode</span>
                  </button>
                </div>
              </div>
              <div className="p-6 bg-[#FAFAFC] rounded-[24px]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0b1c30]">Bahasa Sistem</p>
                    <span className="material-symbols-outlined text-[#003ada]">translate</span>
                  </div>
                  <select 
                    defaultValue="Bahasa Indonesia" 
                    className="w-full bg-transparent border-b border-[#c4c5d8]/50 focus:border-[#003ada] focus:ring-0 py-1 font-medium text-[#0b1c30] transition-all text-[14px]"
                  >
                    <option value="Bahasa Inggris (US)">Bahasa Inggris (US)</option>
                    <option value="Bahasa Inggris (UK)">Bahasa Inggris (UK)</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end pt-4 pb-8">
            <button
              onClick={() => {
                Swal.fire({
                  title: "Simpan Perubahan?",
                  text: "Apakah Anda yakin ingin menyimpan perubahan pengaturan ini?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#003ada",
                  cancelButtonColor: "#747687",
                  confirmButtonText: "Ya, simpan",
                  cancelButtonText: "Batal",
                  customClass: {
                    popup: "rounded-[24px] font-[var(--font-inter)]",
                  }
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      title: "Berhasil!",
                      text: "Perubahan berhasil disimpan.",
                      icon: "success",
                      confirmButtonColor: "#003ada",
                      customClass: {
                        popup: "rounded-[24px] font-[var(--font-inter)]",
                      }
                    });
                  }
                });
              }}
              className="bg-[#003ada] text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-[#0029a1]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Simpan Perubahan
              <span className="material-symbols-outlined">check_circle</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
