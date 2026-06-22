"use client";
import { useEffect, useState } from "react";
import { getStoredReports, saveStoredReports, downloadMockPdf } from "@/lib/storage";
import { Report } from "@/lib/data";
import Modal from "@/components/Modal";
import Swal from "sweetalert2";

export default function ReportsPage() {
  const [reportList, setReportList] = useState<Report[]>([]);
  const [genModal, setGenModal] = useState(false);
  const [reportType, setReportType] = useState("credit-risk");
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [hoveredBar, setHoveredBar] = useState<{ month: string; val: number } | null>(null);

  useEffect(() => {
    setReportList(getStoredReports());
  }, []);

  const handleGenerate = () => {
    setGenModal(false);

    // Map selection to readable details
    const typeNames: Record<string, string> = {
      "credit-risk": "Ringkasan Risiko Kredit",
      "fleet-util": "Analisis Utilisasi Armada",
      "financial": "Indeks Kesehatan Keuangan",
      "delinquency": "Peta Peringatan Tunggakan"
    };

    const periodNames: Record<string, string> = {
      weekly: "Mingguan",
      monthly: "Bulanan",
      quarterly: "Kuartalan",
      yearly: "Tahunan"
    };

    const periodLabel = periodNames[reportPeriod] || "Bulanan";
    const typeLabel = typeNames[reportType] || "Laporan Kredit";
    const title = `${typeLabel} ${periodLabel} - Juni 2026`;

    let progress = 0;
    Swal.fire({
      title: "Membuat Laporan Baru...",
      html: `
        <div class="w-full bg-[#003ada]/10 h-3 rounded-full overflow-hidden mt-4">
          <div id="report-progress-bar" class="bg-gradient-to-r from-[#003ADA] to-[#1FA463] h-full rounded-full transition-all duration-200" style="width: 0%"></div>
        </div>
        <p id="report-progress-text" class="text-xs font-semibold text-slate-500 mt-2">Mempersiapkan data dan metrik...</p>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      },
      didOpen: () => {
        const bar = document.getElementById("report-progress-bar");
        const text = document.getElementById("report-progress-text");
        const interval = setInterval(() => {
          progress += 20;
          if (bar) bar.style.width = `${progress}%`;
          if (text) {
            if (progress === 40) text.innerText = "Mengompilasi tabel performa armada...";
            if (progress === 80) text.innerText = "Membuat grafik visualisasi...";
          }
          if (progress >= 100) {
            clearInterval(interval);
            
            const newReport: Report = {
              id: Date.now(),
              title: title,
              type: "PDF",
              size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
              time: "Baru saja dibuat",
              icon: reportType === "fleet-util" ? "directions_car" : reportType === "financial" ? "health_and_safety" : reportType === "delinquency" ? "report_problem" : "description",
              iconBg: reportType === "fleet-util" ? "bg-[#1FA463]/10" : reportType === "financial" ? "bg-[#F2A93C]/10" : reportType === "delinquency" ? "bg-[#DF2721]/10" : "bg-sky-blue/30",
              iconColor: reportType === "fleet-util" ? "text-[#1FA463]" : reportType === "financial" ? "text-[#F2A93C]" : reportType === "delinquency" ? "text-[#DF2721]" : "text-primary"
            };

            const updatedList = [newReport, ...reportList];
            setReportList(updatedList);
            saveStoredReports(updatedList);

            Swal.fire({
              icon: "success",
              title: "Laporan Berhasil Dibuat!",
              text: `Laporan "${title}" telah ditambahkan ke daftar laporan terbaru.`,
              confirmButtonColor: "#003ada",
              confirmButtonText: "Selesai",
              customClass: {
                popup: "rounded-[24px] font-[var(--font-inter)]",
              }
            });
          }
        }, 300);
      }
    });
  };

  const handleDownload = (title: string) => {
    const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const content = `==================================================
TRUSTFLEET AI - DOKUMEN LAPORAN RESMI
Nama Dokumen     : ${title}
Tanggal Pembuatan: ${dateStr}
Keamanan         : RAHASIA INTERNAL
==================================================

Ringkasan Isi Laporan:
Ini adalah laporan analitik simulasi untuk TrustFleet AI. Laporan ini
berisi ringkasan data alternatif credit scoring, riwayat operasional armada,
aktivitas pengisian bahan bakar, dan logistik untuk portofolio Astra UD Trucks.

Statistik Utama:
- Kesehatan Portofolio: Optimal
- Rasio Gagal Bayar: 1.2%
- Total Limit Kredit Aktif: Rp 372.000.000.000
- Armada Terdaftar: 1,280+ Kendaraan

Tindakan Rekomendasi:
- Tinjau ulang batas kredit alternatif untuk armada dengan utilisasi rendah.
- Lakukan inspeksi keselamatan rutin untuk menjaga nilai jaminan.

==================================================
Selesai
Dokumen Terverifikasi & Aman.
==================================================`;

    downloadMockPdf(`${title.replace(/\s+/g, "_")}.pdf`, content);
    
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Laporan berhasil diunduh!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleView = (report: Report) => {
    const textPreview = `Nama: ${report.title}
Ukuran: ${report.size}
Tipe: ${report.type}
Dibuat: ${report.time}

[Simulasi Konten Laporan]
Analisis ini menunjukkan profil kelayakan kredit yang sehat. Indeks TrustScore rata-rata stabil pada skor 742, yang berada dalam rentang risiko rendah hingga sedang. Kontrol internal menyarankan pemeliharaan rutin berkelanjutan.`;

    Swal.fire({
      title: report.title,
      html: `
        <div class="text-left font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-xl max-h-60 overflow-y-auto whitespace-pre-wrap">
          ${textPreview}
        </div>
      `,
      confirmButtonColor: "#003ada",
      confirmButtonText: "Unduh PDF",
      showCancelButton: true,
      cancelButtonText: "Tutup",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)] w-[550px]",
      }
    }).then((res) => {
      if (res.isConfirmed) {
        handleDownload(report.title);
      }
    });
  };

  const handleViewAllCreated = () => {
    const listHtml = reportList.map((r) => `
      <div class="flex items-center justify-between p-3.5 border-b border-[#c4c5d8]/20 last:border-none hover:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3 text-left">
          <div class="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0029a1] shrink-0">
            <span class="material-symbols-outlined text-[18px]">description</span>
          </div>
          <div>
            <div class="text-[#0b1c30] font-bold text-xs sm:text-sm">${r.title}</div>
            <div class="text-[10px] text-slate-400 font-medium">${r.time}</div>
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-xs font-bold text-[#0029a1]">${r.type}</div>
          <div class="text-[10px] text-slate-500">${r.size}</div>
        </div>
      </div>
    `).join("");

    Swal.fire({
      title: "Semua Laporan yang Dibuat",
      html: `
        <div class="divide-y divide-[#c4c5d8]/20 max-h-[350px] overflow-y-auto pr-1">
          ${listHtml}
        </div>
      `,
      confirmButtonColor: "#003ada",
      confirmButtonText: "Tutup",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)] w-[550px]",
      }
    });
  };

  return (
    <>
      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Laporan Dibuat", value: (1284 + reportList.length - 4).toString(), sub: "+12.5% penayangan bulan ini", subIcon: "trending_up", subColor: "text-[#1FA463]", bgIcon: "insert_chart" },
          { label: "Laporan Terjadwal", value: "42", sub: "Jadwal berikutnya: Hari ini, 18:00", subIcon: null, subColor: "text-white/60 italic", bgIcon: "schedule" },
          { label: "Ekspor Data", value: "312GB", sub: "Penggunaan frekuensi tinggi", subIcon: "cloud_download", subColor: "text-[#C5E1EF]", bgIcon: "cloud_download" },
        ].map((kpi) => (
          <div key={kpi.label} className="navy-gradient rounded-[32px] p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[#b5c0ff]/80 font-semibold mb-1 text-[12px] font-[var(--font-inter)] tracking-[0.05em] uppercase">{kpi.label}</p>
              <h3 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] mb-2">{kpi.value}</h3>
              <div className={`flex items-center gap-2 ${kpi.subColor} text-sm font-semibold`}>
                {kpi.subIcon && <span className="material-symbols-outlined text-[18px]">{kpi.subIcon}</span>}
                <span>{kpi.sub}</span>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:scale-110 transition-transform duration-500">{kpi.bgIcon}</span>
          </div>
        ))}
      </section>

      {/* Chart + Schedule */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 pill-shadow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Frekuensi Pembuatan</h4>
              <p className="text-[#444655]/60 text-[14px]">Volume produksi laporan selama 6 bulan</p>
            </div>
            <button className="bg-[#eff4ff] text-[#0029a1] px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#e6eeff] transition-colors cursor-pointer">6 Bulan Terakhir</button>
          </div>
          <div className="flex items-end justify-between gap-4 h-64">
            {[
              { month: "Jan", height: "50%", val: 120 },
              { month: "Feb", height: "75%", val: 180 },
              { month: "Mar", height: "55%", val: 132 },
              { month: "Apr", height: "95%", val: 228, active: true },
              { month: "Mei", height: "70%", val: 168 },
              { month: "Jun", height: "85%", val: 204 },
            ].map((bar) => (
              <div
                key={bar.month}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredBar({ month: bar.month, val: bar.val })}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div
                  className={`w-8 rounded-t-lg transition-all duration-300 ${
                    hoveredBar?.month === bar.month ? "bg-[#0029a1] scale-x-110" : bar.active ? "bg-[#003ada]" : "bg-[#003ada]/70"
                  }`}
                  style={{ height: bar.height }}
                />
                <span className={`text-[10px] mt-3 font-bold tracking-wider uppercase ${bar.active || hoveredBar?.month === bar.month ? "text-[#0029a1]" : "text-[#444655]/60"}`}>{bar.month}</span>
              </div>
            ))}
          </div>
          {hoveredBar ? (
            <div className="mt-4 p-3 bg-[#eff4ff] text-[#0029a1] font-semibold text-xs rounded-xl flex items-center gap-2 border border-[#dce9ff] animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">bar_chart</span>
              Volume Laporan {hoveredBar.month}: <strong className="text-[14px]">{hoveredBar.val} Laporan</strong>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-[#eff4ff]/20 text-[#747687] text-xs rounded-xl flex items-center gap-2 border border-dashed border-[#c4c5d8]/30">
              <span className="material-symbols-outlined text-[16px]">ads_click</span>
              Arahkan kursor ke batang grafik untuk volume laporan per bulan.
            </div>
          )}
        </div>

        <div className="bg-[#003ada] rounded-[32px] p-8 flex flex-col justify-between items-center text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-white text-[40px]">add_task</span>
          </div>
          <div>
            <h4 className="font-[var(--font-jakarta)] text-[24px] font-bold text-white mb-2">Otomatisasi Wawasan</h4>
            <p className="text-[#b5c0ff]/80 text-[14px] mb-6 px-4">Buat laporan langsung atau atur pengiriman laporan secara teratur.</p>
          </div>
          <button onClick={() => setGenModal(true)} className="w-full py-4 bg-white text-[#003ada] rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer">
            Jadwalkan Laporan Baru
          </button>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="bg-white rounded-[32px] p-8 pill-shadow">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Laporan Terbaru</h4>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-[#e6eeff] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[#444655]">filter_list</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#e6eeff] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[#444655]">grid_view</span>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {reportList.map((r) => (
            <div key={r.id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-[#f8f9ff] rounded-[24px] hover:bg-[#eff4ff] transition-all border border-transparent hover:border-[#c4c5d8]/30 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${r.iconBg} rounded-full flex items-center justify-center ${r.iconColor} shrink-0`}>
                  <span className="material-symbols-outlined">{r.icon}</span>
                </div>
                <div>
                  <h5 className="font-bold text-[#0b1c30] text-sm sm:text-base">{r.title}</h5>
                  <p className="text-xs text-[#444655]/60 font-medium">{r.type} • {r.size} • {r.time}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button onClick={() => handleView(r)} className="flex-1 sm:flex-initial text-center justify-center px-6 py-2 rounded-full border border-[#0029a1] text-[#0029a1] font-bold text-sm hover:bg-[#0029a1]/5 transition-all active:scale-95 whitespace-nowrap cursor-pointer">Lihat</button>
                <button
                  onClick={() => handleDownload(r.title)}
                  className="flex-1 sm:flex-initial text-center justify-center px-6 py-2 rounded-full bg-[#0029a1] text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Unduh
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button onClick={handleViewAllCreated} className="text-[#0029a1] font-bold hover:underline cursor-pointer">Lihat Semua Laporan yang Dibuat</button>
        </div>
      </section>

      {/* Generate Report Modal */}
      <Modal open={genModal} onClose={() => setGenModal(false)} title="Buat Laporan Baru">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Jenis Laporan</label>
            <select
              className="w-full p-3 border border-[#c4c5d8]/40 rounded-full text-sm focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none appearance-none bg-white"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="credit-risk">Ringkasan Risiko Kredit</option>
              <option value="fleet-util">Analisis Utilisasi Armada</option>
              <option value="financial">Indeks Kesehatan Keuangan</option>
              <option value="delinquency">Peta Peringatan Tunggakan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Periode</label>
            <select
              className="w-full p-3 border border-[#c4c5d8]/40 rounded-full text-sm focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none appearance-none bg-white"
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
            >
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="quarterly">Kuartalan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setGenModal(false)} className="flex-1 py-3 border border-[#c4c5d8] rounded-full font-semibold hover:bg-[#f8f9ff] transition-all cursor-pointer">Batal</button>
            <button onClick={handleGenerate} className="flex-1 py-3 bg-[#003ada] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95 cursor-pointer">Generate</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
