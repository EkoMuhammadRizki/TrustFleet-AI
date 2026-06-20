"use client";
import { useState } from "react";
import { reports } from "@/lib/data";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function ReportsPage() {
  const { showToast } = useToast();
  const [genModal, setGenModal] = useState(false);
  const [reportType, setReportType] = useState("credit-risk");
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [hoveredBar, setHoveredBar] = useState<{ month: string; val: number } | null>(null);

  const handleGenerate = () => {
    setGenModal(false);
    showToast("Laporan sedang dibuat... File akan siap dalam beberapa saat.", "info");
  };

  const handleDownload = (title: string) => {
    showToast(`${title} siap diunduh!`, "success");
  };

  return (
    <>
      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Laporan Dibuat", value: "1,284", sub: "+12.5% penayangan bulan ini", subIcon: "trending_up", subColor: "text-[#1FA463]", bgIcon: "insert_chart" },
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
            <button className="bg-[#eff4ff] text-[#0029a1] px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#e6eeff] transition-colors">6 Bulan Terakhir</button>
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
            <p className="text-[#b5c0ff]/80 text-[14px] mb-6 px-4">Atur pengiriman laporan berulang ke pemangku kepentingan Anda secara otomatis.</p>
          </div>
          <button onClick={() => setGenModal(true)} className="w-full py-4 bg-white text-[#003ada] rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
            Jadwalkan Laporan Baru
          </button>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="bg-white rounded-[32px] p-8 pill-shadow">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Laporan Terbaru</h4>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-[#e6eeff] transition-colors">
              <span className="material-symbols-outlined text-[#444655]">filter_list</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#e6eeff] transition-colors">
              <span className="material-symbols-outlined text-[#444655]">grid_view</span>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-[#f8f9ff] rounded-[24px] hover:bg-[#eff4ff] transition-all border border-transparent hover:border-[#c4c5d8]/30">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${r.iconBg} rounded-full flex items-center justify-center ${r.iconColor}`}>
                  <span className="material-symbols-outlined">{r.icon}</span>
                </div>
                <div>
                  <h5 className="font-bold text-[#0b1c30]">{r.title}</h5>
                  <p className="text-xs text-[#444655]/60 font-medium">{r.type} • {r.size} • {r.time}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 rounded-full border border-[#0029a1] text-[#0029a1] font-bold text-sm hover:bg-[#0029a1]/5 transition-all active:scale-95">Lihat</button>
                <button
                  onClick={() => handleDownload(r.title)}
                  className="px-6 py-2 rounded-full bg-[#0029a1] text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Unduh
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button className="text-[#0029a1] font-bold hover:underline">Lihat Semua Laporan yang Dibuat</button>
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
            <button onClick={() => setGenModal(false)} className="flex-1 py-3 border border-[#c4c5d8] rounded-full font-semibold hover:bg-[#f8f9ff] transition-all">Batal</button>
            <button onClick={handleGenerate} className="flex-1 py-3 bg-[#003ada] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">Generate</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
