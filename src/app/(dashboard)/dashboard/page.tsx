"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredCustomers, saveStoredCustomers, getStoredIntegrations } from "@/lib/storage";
import { Customer } from "@/lib/data";
import Swal from "sweetalert2";

export default function DashboardPage() {
  const router = useRouter();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [customerList, setCustomerList] = useState<Customer[]>([]);



  const handleNewAssessment = () => {
    // Check if at least one telematics provider is connected
    const connectedList = getStoredIntegrations().filter(i => i.connected);
    if (connectedList.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Koneksi Telematika Diperlukan",
        text: "Silakan hubungkan minimal satu layanan telematika di menu Integrasi terlebih dahulu untuk menjalankan AI Scoring.",
        confirmButtonColor: "#003ada",
        confirmButtonText: "Ke Menu Integrasi",
        showCancelButton: true,
        cancelButtonText: "Batal",
        customClass: {
          popup: "rounded-[24px] font-[var(--font-inter)]",
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/integration");
        }
      });
      return;
    }

    Swal.fire({
      title: "Penilaian Risiko Baru",
      html: `
        <div class="space-y-4 font-[var(--font-inter)] text-left">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Perusahaan / Armada</label>
            <input id="swal-company-name" class="swal2-input !mx-0 !w-full" placeholder="Contoh: PT Logistics Jaya">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Bidang Industri</label>
            <select id="swal-company-industry" class="swal2-input !mx-0 !w-full !p-3">
              <option value="Logistik & Transportasi">Logistik & Transportasi</option>
              <option value="Kurir & Pengiriman">Kurir & Pengiriman</option>
              <option value="Rantai Pasok">Rantai Pasok</option>
              <option value="Kargo Udara & Darat">Kargo Udara & Darat</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Ukuran Armada (Unit)</label>
            <input id="swal-company-fleet" type="number" class="swal2-input !mx-0 !w-full" placeholder="Contoh: 15">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#003ada",
      cancelButtonColor: "#747687",
      confirmButtonText: "Jalankan AI Scoring",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      },
      preConfirm: () => {
        const name = (document.getElementById("swal-company-name") as HTMLInputElement).value;
        const industry = (document.getElementById("swal-company-industry") as HTMLSelectElement).value;
        const fleet = (document.getElementById("swal-company-fleet") as HTMLInputElement).value;
        if (!name || !fleet) {
          Swal.showValidationMessage("Semua bidang harus diisi!");
          return false;
        }
        return { name, industry, fleetSize: parseInt(fleet) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let progress = 0;
        Swal.fire({
          title: "Menghubungkan Data Telematika...",
          html: `
            <div class="w-full bg-[#003ada]/10 h-3 rounded-full overflow-hidden mt-4">
              <div id="swal-progress-bar" class="bg-gradient-to-r from-[#003ADA] to-[#1FA463] h-full rounded-full transition-all duration-200" style="width: 0%"></div>
            </div>
            <p id="swal-progress-text" class="text-xs font-semibold text-slate-500 mt-2">Menganalisis riwayat servis armada...</p>
          `,
          showConfirmButton: false,
          allowOutsideClick: false,
          customClass: {
            popup: "rounded-[24px] font-[var(--font-inter)]",
          },
          didOpen: () => {
            const bar = document.getElementById("swal-progress-bar");
            const text = document.getElementById("swal-progress-text");
            const interval = setInterval(() => {
              progress += 10;
              if (bar) bar.style.width = `${progress}%`;
              if (text) {
                if (progress === 30) text.innerText = "Menganalisis utilisasi armada...";
                if (progress === 60) text.innerText = "Mengevaluasi transaksi bahan bakar...";
                if (progress === 80) text.innerText = "Menghitung indeks risiko alternatif...";
              }
              if (progress >= 100) {
                clearInterval(interval);
                
                const mockScore = Math.floor(Math.random() * 400) + 500; // 500 to 900
                const isLow = mockScore >= 700;
                const isMed = mockScore >= 550 && mockScore < 700;
                const riskLevel = isLow ? "low" : isMed ? "medium" : "high";
                const riskLabel = isLow ? "Risiko Rendah" : isMed ? "Risiko Sedang" : "Risiko Tinggi";
                const approvedLimit = riskLevel === "high" ? "Ditolak" : `Rp ${(Math.floor(Math.random() * 30) + 5)}.000.000.000`;
                
                const newCustomer: Customer = {
                  id: result.value.name.toLowerCase().replace(/\s+/g, "-"),
                  name: result.value.name,
                  initials: result.value.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
                  industry: result.value.industry,
                  region: "Domestik",
                  fleetSize: result.value.fleetSize,
                  vehicleLabel: `${result.value.fleetSize} Kendaraan`,
                  score: mockScore,
                  riskLevel: riskLevel as any,
                  riskLabel: riskLabel,
                  approvedLimit: approvedLimit,
                  status: (riskLevel === "high" ? "declined" : "pending") as any,
                  activeRoutes: "5 Domestik",
                  joinDate: "Juni 2026"
                };

                setCustomerList((prevList) => {
                  const updatedList = [newCustomer, ...prevList];
                  saveStoredCustomers(updatedList);
                  return updatedList;
                });

                Swal.fire({
                  icon: "success",
                  title: "Penilaian Selesai!",
                  html: `
                    <div class="space-y-3 font-[var(--font-inter)] text-center mt-3">
                      <p class="text-sm text-slate-500">Hasil Analisis TrustScore untuk <strong>${newCustomer.name}</strong>:</p>
                      <div class="inline-block px-6 py-3 rounded-full ${isLow ? 'bg-[#1FA463]/10 text-[#1FA463]' : isMed ? 'bg-[#F2A93C]/10 text-[#F2A93C]' : 'bg-[#DF2721]/10 text-[#DF2721]'} font-extrabold text-xl">
                        Skor: ${mockScore} (${riskLabel})
                      </div>
                      <p class="text-xs text-slate-400">Limit Rekomendasi: <strong class="text-[#003ada]">${approvedLimit}</strong></p>
                    </div>
                  `,
                  confirmButtonColor: "#003ada",
                  confirmButtonText: "Selesai",
                  customClass: {
                    popup: "rounded-[24px] font-[var(--font-inter)]",
                  }
                });
              }
            }, 200);
          }
        });
      }
    });
  };

  useEffect(() => {
    setCustomerList(getStoredCustomers());

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("newAssessment") === "true") {
        // Clear parameter from URL to prevent showing again on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        // Automatically open the assessment form!
        handleNewAssessment();
      } else {
        const welcomeShown = sessionStorage.getItem("tf_welcome_shown");
        if (!welcomeShown) {
          sessionStorage.setItem("tf_welcome_shown", "true");
          Swal.fire({
            title: "Selamat Datang di TrustFleet AI!",
            html: `
              <div class="space-y-4 font-[var(--font-inter)] text-left text-[#444655] leading-relaxed text-[14px] mt-2">
                <p>
                  Platform Penilaian Risiko Kredit Alternatif berbasis AI untuk menyederhanakan pembiayaan logistik dengan wawasan telematika yang dapat dijelaskan.
                </p>
                <div class="bg-[#eff4ff]/60 p-4 rounded-[20px] border border-[#003ada]/10 space-y-3">
                  <h5 class="font-bold text-[#0b1c30] text-[12px] uppercase tracking-wider flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[18px] text-[#003ada]">explore</span>
                    Langkah Awal Konfigurasi:
                  </h5>
                  <p class="text-[12px] text-[#444655] leading-relaxed">
                    Untuk menggunakan fitur penilaian risiko secara real-time, Anda wajib menghubungkan minimal **satu layanan telematika** (Samsara, Geotab, atau Webfleet) terlebih dahulu.
                  </p>
                </div>
                <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-[16px] border border-amber-200/50 text-amber-800 text-[12px]">
                  <span class="material-symbols-outlined text-[20px] text-amber-600 shrink-0 font-normal">info</span>
                  <p>
                    Sistem mendeteksi belum ada telematika yang aktif. Silakan menuju ke halaman **Integrasi** untuk memulai.
                  </p>
                </div>
              </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "#003ada",
            cancelButtonColor: "#747687",
            confirmButtonText: "Hubungkan Integrasi Sekarang",
            cancelButtonText: "Lihat Dashboard Dulu",
            customClass: {
              popup: "rounded-[24px] font-[var(--font-inter)] p-6 md:p-8 max-w-[500px]",
            }
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/integration");
            }
          });
        }
      }
    }
  }, []);

  const dashboardCustomers = customerList.slice(0, 4);

  // Dynamic KPI stats
  const totalScored = 1280 + customerList.length;
  const highRisk = 40 + customerList.filter(c => c.riskLevel === "high").length;
  const avgScore = customerList.length > 0 ? Math.round(customerList.reduce((acc, c) => acc + c.score, 0) / customerList.length) : 742;

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-[var(--font-jakarta)] text-2xl sm:text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Ringkasan Kecerdasan Armada</h2>
          <p className="font-[var(--font-inter)] text-[14px] text-[#444655] mt-1">Penilaian risiko kredit alternatif real-time untuk portofolio armada Anda.</p>
        </div>
        <button onClick={handleNewAssessment} suppressHydrationWarning={true} className="bg-[#003ada] text-white font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 shrink-0 w-full sm:w-auto justify-center cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Penilaian Risiko Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: "groups", label: "Total Pelanggan Diskor", value: totalScored.toLocaleString(), badge: "+12%", badgeColor: "bg-[#1FA463]/20" },
          { icon: "speed", label: "Rata-rata Skor Kredit", value: avgScore.toString(), badge: "Optimal", badgeColor: "bg-[#F2A93C]/20" },
          { icon: "error", label: "Pelanggan Risiko Tinggi", value: highRisk.toString(), badge: "-3%", badgeColor: "bg-[#DF2721]/20" },
          { icon: "account_balance_wallet", label: "Total Limit Disetujui", value: "Rp 372 Miliar", badge: "IDR", badgeColor: "bg-white/20" },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card-gradient p-6 rounded-[24px] shadow-lg text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined bg-white/20 p-2 rounded-xl">{kpi.icon}</span>
              <span className={`text-[12px] ${kpi.badgeColor} text-white px-2 py-1 rounded-full border border-white/20`}>{kpi.badge}</span>
            </div>
            <p className="font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] opacity-80 uppercase">{kpi.label}</p>
            <h3 className="font-[var(--font-jakarta)] text-[28px] font-extrabold mt-2">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Risk Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white p-5 sm:p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm flex flex-col items-center">
          <div className="w-full mb-6">
            <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Distribusi Risiko</h4>
            <p className="font-[var(--font-inter)] text-[14px] text-[#444655]">Ringkasan kesehatan portofolio</p>
          </div>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none" stroke="#1FA463" strokeWidth={hoveredSegment === "low" ? "4.5" : "3"}
                strokeDasharray="75, 100" className="donut-segment cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredSegment("low")}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              <circle
                cx="18" cy="18" r="15.9" fill="none" stroke="#F2A93C" strokeWidth={hoveredSegment === "medium" ? "4.5" : "3"}
                strokeDasharray="15, 100" strokeDashoffset="-75" className="donut-segment cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredSegment("medium")}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              <circle
                cx="18" cy="18" r="15.9" fill="none" stroke="#DF2721" strokeWidth={hoveredSegment === "high" ? "4.5" : "3"}
                strokeDasharray="10, 100" strokeDashoffset="-90" className="donut-segment cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredSegment("high")}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              {hoveredSegment === "low" && (
                <>
                  <span className="font-[var(--font-jakarta)] text-[22px] font-bold text-[#1FA463]">963</span>
                  <span className="text-[9px] text-[#444655] uppercase tracking-wider font-bold">Rendah (75%)</span>
                </>
              )}
              {hoveredSegment === "medium" && (
                <>
                  <span className="font-[var(--font-jakarta)] text-[22px] font-bold text-[#F2A93C]">193</span>
                  <span className="text-[9px] text-[#444655] uppercase tracking-wider font-bold">Sedang (15%)</span>
                </>
              )}
              {hoveredSegment === "high" && (
                <>
                  <span className="font-[var(--font-jakarta)] text-[22px] font-bold text-[#DF2721]">128</span>
                  <span className="text-[9px] text-[#444655] uppercase tracking-wider font-bold">Tinggi (10%)</span>
                </>
              )}
              {!hoveredSegment && (
                <>
                  <span className="font-[var(--font-jakarta)] text-[28px] font-bold">{totalScored.toLocaleString()}</span>
                  <span className="text-[10px] text-[#444655] uppercase tracking-widest font-bold">Total</span>
                </>
              )}
            </div>
          </div>
          <div className="w-full space-y-4">
            {[
              { label: "Risiko Rendah (AAA-A)", color: "bg-[#1FA463]", pct: "75%", key: "low" },
              { label: "Risiko Sedang (B)", color: "bg-[#F2A93C]", pct: "15%", key: "medium" },
              { label: "Risiko Tinggi (C-D)", color: "bg-[#DF2721]", pct: "10%", key: "high" },
            ].map((r) => (
              <div
                key={r.label}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-all cursor-pointer ${
                  hoveredSegment === r.key ? "bg-[#eff4ff] scale-[1.02]" : ""
                }`}
                onMouseEnter={() => setHoveredSegment(r.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${r.color}`} />
                  <span className="font-[var(--font-inter)] text-[14px] text-[#444655]">{r.label}</span>
                </div>
                <span className="font-[var(--font-inter)] text-[14px] font-bold">{r.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scoring Activity */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 sm:p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Aktivitas Penilaian Terbaru</h4>
              <p className="font-[var(--font-inter)] text-[14px] text-[#444655]">Keputusan kredit alternatif terbaru</p>
            </div>
            <Link href="/customers" className="text-[#0029a1] font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] hover:underline">Lihat Semua Data</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-[#c4c5d8]/30">
                  <th className="pb-4 font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#747687]/80 uppercase">Pelanggan / Armada</th>
                  <th className="pb-4 font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#747687]/80 uppercase">Skor</th>
                  <th className="pb-4 font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#747687]/80 uppercase">Tingkat Risiko</th>
                  <th className="pb-4 font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#747687]/80 uppercase">Limit Disetujui</th>
                  <th className="pb-4 font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#747687]/80 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d8]/20">
                {dashboardCustomers.map((c) => {
                  const riskColors: Record<string, string> = {
                    low: "bg-[#1FA463]/10 text-[#1FA463] border-[#1FA463]/20",
                    medium: "bg-[#F2A93C]/10 text-[#F2A93C] border-[#F2A93C]/20",
                    high: "bg-[#DF2721]/10 text-[#DF2721] border-[#DF2721]/20",
                  };
                  return (
                    <tr key={c.id} className="group hover:bg-[#eff4ff] transition-colors cursor-pointer">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#dde1ff] flex items-center justify-center font-bold text-[#0029a1] text-xs">{c.initials}</div>
                          <div>
                            <p className="font-[var(--font-inter)] text-[14px] font-bold text-[#0b1c30]">{c.name}</p>
                            <p className="text-[12px] text-[#444655]">{c.vehicleLabel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4"><span className="font-[var(--font-inter)] text-[14px] font-semibold">{c.score}</span></td>
                      <td className="py-4">
                        <span className={`${riskColors[c.riskLevel]} px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border`}>
                          {c.riskLabel}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`font-[var(--font-inter)] text-[14px] ${c.status === "declined" ? "text-[#DF2721] uppercase font-semibold" : ""}`}>
                          {c.approvedLimit}
                        </span>
                      </td>
                      <td className="py-4 text-right flex items-center justify-end gap-2">
                        <Link href={`/customers/${c.id}`} className="text-xs bg-[#eff4ff] hover:bg-[#dee1ff] text-[#0029a1] font-semibold py-1 px-3.5 rounded-full transition-colors">Profil</Link>
                        <Link href={`/credit-scoring/${c.id}`} className="text-xs bg-[#003ada] hover:bg-[#0029a1] text-white font-semibold py-1 px-3.5 rounded-full transition-colors">Scoring</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="col-span-12 bg-white p-6 md:p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 md:pr-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#003ada] bg-[#dee1ff] p-2 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Rekomendasi TrustFleet AI</h4>
            </div>
            <p className="font-[var(--font-inter)] text-[14px] text-[#444655] max-w-2xl">
              Berdasarkan data telematika real-time dan riwayat transaksi, <strong>Global Haulage</strong> menunjukkan tanda-tanda volatilitas arus kas meskipun ukuran armadanya besar. AI menyarankan untuk mengurangi ambang batas kredit sebesar 15% untuk kuartal berikutnya hingga stabilitas operasional membaik.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Link href="/credit-scoring/global-haulage" className="bg-[#dce9ff] text-[#0029a1] font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] px-6 py-3 rounded-full hover:bg-[#d3e4ff] transition-all block text-center w-full md:w-auto whitespace-nowrap cursor-pointer">Tinjau Detail</Link>
          </div>
        </div>
      </div>
    </>
  );
}
