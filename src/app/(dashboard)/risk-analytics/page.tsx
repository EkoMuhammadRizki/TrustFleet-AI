"use client";
import Link from "next/link";
import { useState } from "react";
import { customers } from "@/lib/data";
import PortfolioTrendChart from "@/components/PortfolioTrendChart";

interface HeatmapCell {
  bg: string;
  text: string;
  show: boolean;
  details: string;
}

interface TrendPoint {
  left: string;
  bottom: string;
  month: string;
  val: string;
}

export default function RiskAnalyticsPage() {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);
  const riskCustomers = [customers[4], customers[5], customers[6], customers[7]]; // AV, TS, NM, CL

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Analisis Risiko</h2>
          <p className="text-[#444655] font-[var(--font-inter)] text-[16px] mt-1">Memantau kerentanan portofolio dan kesehatan kredit di seluruh segmen armada.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/reports" className="bg-white border border-[#003ada] text-[#003ada] px-6 py-2.5 rounded-full font-semibold hover:bg-[#003ada]/5 transition-all flex items-center gap-2 whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            Ekspor Laporan
          </Link>
          <button className="bg-[#003ada] text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#003ada]/20 flex items-center justify-center gap-2 whitespace-nowrap">
            Filter Lanjutan
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {[
          { label: "Rentang Tanggal:", value: "30 Hari Terakhir", icon: "calendar_month" },
          { label: "Tingkat Risiko:", value: "Semua Tingkatan", icon: "filter_list" },
          { label: "Industri:", value: "Logistik & Rantai Pasok", icon: "category" },
        ].map((f) => (
          <div key={f.label} className="bg-white px-5 py-2.5 rounded-full border border-[#c4c5d8]/40 flex items-center gap-3 cursor-pointer hover:border-[#003ada]/50 transition-colors">
            <span className="text-[12px] font-semibold tracking-[0.05em] text-[#747687]">{f.label}</span>
            <span className="font-semibold text-[14px]">{f.value}</span>
            <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
          </div>
        ))}
        <div className="w-px h-6 bg-[#c4c5d8]/30" />
        <button className="text-[#003ada] font-semibold text-[14px] hover:underline">Hapus Semua</button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Heatmap */}
        <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Distribusi Risiko Armada</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1FA463]/20 border border-[#1FA463]" />
              <span className="w-3 h-3 rounded-full bg-[#F2A93C]/20 border border-[#F2A93C]" />
              <span className="w-3 h-3 rounded-full bg-[#DF2721]/20 border border-[#DF2721]" />
            </div>
          </div>
          <div className="grid grid-cols-5 grid-rows-5 gap-3 h-[320px]">
            {[
              { bg: "bg-[#1FA463]/10", text: "0.2%", show: true, details: "3 Armada • Risiko Rendah • Stabilitas Tinggi • Eksposur Rendah" },
              { bg: "bg-[#1FA463]/20", text: "0.4%", show: true, details: "5 Armada • Risiko Rendah • Stabilitas Tinggi • Eksposur Rendah" },
              { bg: "bg-[#1FA463]/5", text: "", show: false, details: "0 Armada • Risiko Rendah" },
              { bg: "bg-[#F2A93C]/10", text: "", show: false, details: "1 Armada • Risiko Sedang" },
              { bg: "bg-[#DF2721]/10", text: "", show: false, details: "1 Armada • Risiko Tinggi" },
              { bg: "bg-[#1FA463]/15", text: "", show: false, details: "2 Armada • Risiko Rendah" },
              { bg: "bg-[#1FA463]/40", text: "2.1%", show: true, details: "27 Armada • Risiko Rendah • Stabilitas Tinggi • Eksposur Rendah" },
              { bg: "bg-[#1FA463]/30", text: "", show: false, details: "4 Armada • Risiko Rendah" },
              { bg: "bg-[#F2A93C]/20", text: "", show: false, details: "3 Armada • Risiko Sedang" },
              { bg: "bg-[#DF2721]/5", text: "", show: false, details: "0 Armada • Risiko Tinggi" },
              { bg: "bg-[#1FA463]/20", text: "", show: false, details: "3 Armada • Risiko Rendah" },
              { bg: "bg-[#1FA463]/10", text: "", show: false, details: "1 Armada • Risiko Rendah" },
              { bg: "bg-[#F2A93C]/60", text: "12.5%", show: true, details: "160 Armada • Risiko Sedang • Stabilitas Sedang • Eksposur Sedang" },
              { bg: "bg-[#F2A93C]/40", text: "", show: false, details: "5 Armada • Risiko Sedang" },
              { bg: "bg-[#DF2721]/15", text: "", show: false, details: "2 Armada • Risiko Tinggi" },
              { bg: "bg-[#1FA463]/5", text: "", show: false, details: "0 Armada • Risiko Rendah" },
              { bg: "bg-[#F2A93C]/30", text: "", show: false, details: "4 Armada • Risiko Sedang" },
              { bg: "bg-[#F2A93C]/50", text: "", show: false, details: "6 Armada • Risiko Sedang" },
              { bg: "bg-[#DF2721]/70", text: "8.9%", show: true, details: "114 Armada • Risiko Tinggi • Stabilitas Rendah • Eksposur Tinggi" },
              { bg: "bg-[#DF2721]/40", text: "", show: false, details: "5 Armada • Risiko Tinggi" },
              { bg: "bg-[#1FA463]/5", text: "", show: false, details: "0 Armada • Risiko Rendah" },
              { bg: "bg-[#F2A93C]/10", text: "", show: false, details: "1 Armada • Risiko Sedang" },
              { bg: "bg-[#DF2721]/20", text: "", show: false, details: "3 Armada • Risiko Tinggi" },
              { bg: "bg-[#DF2721]/40", text: "", show: false, details: "5 Armada • Risiko Tinggi" },
              { bg: "bg-[#DF2721]/90", text: "4.2%", show: true, details: "54 Armada • Risiko Tinggi • Stabilitas Sangat Rendah • Eksposur Sangat Tinggi" },
            ].map((cell, i) => (
              <div
                key={i}
                className={`${cell.bg} rounded-xl flex items-center justify-center font-extrabold text-[12px] tracking-[0.05em] hover:ring-2 hover:ring-[#003ada] hover:scale-105 hover:z-10 transition-all cursor-pointer ${
                  cell.bg.includes("DF2721/90") || cell.bg.includes("DF2721/70") ? "text-white" : cell.bg.includes("1FA463") ? "text-[#1FA463]" : "text-[#0b1c30]"
                }`}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {cell.show && cell.text}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-[12px] font-semibold tracking-[0.05em] text-[#747687] uppercase">
            <span>Stabilitas Operasional (Rendah → Tinggi)</span>
            <span>Eksposur Kredit (Rendah → Tinggi)</span>
          </div>
          {hoveredCell ? (
            <div className="mt-4 p-3 bg-[#eff4ff] text-[#0029a1] font-semibold text-xs rounded-xl flex items-center gap-2 border border-[#dce9ff] animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">info</span>
              {hoveredCell.details}
            </div>
          ) : (
            <div className="mt-4 p-3 bg-[#eff4ff]/20 text-[#747687] text-xs rounded-xl flex items-center gap-2 border border-dashed border-[#c4c5d8]/30">
              <span className="material-symbols-outlined text-[16px]">ads_click</span>
              Arahkan kursor ke kisi (grid) untuk detail segmen armada.
            </div>
          )}
        </div>

        {/* Trend Chart using Recharts */}
        <div className="col-span-12 lg:col-span-5">
          <PortfolioTrendChart />
        </div>

        {/* Customer Table */}
        <div className="col-span-12 bg-white rounded-[24px] shadow-sm border border-[#c4c5d8]/10 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#c4c5d8]/10 flex items-center justify-between">
            <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Pelanggan dengan Dampak Penilaian Tinggi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eff4ff]/30 text-[12px] font-semibold tracking-[0.05em] text-[#747687] uppercase">
                  <th className="px-8 py-4">Nama Perusahaan</th>
                  <th className="px-8 py-4 text-center">Skor Kepercayaan</th>
                  <th className="px-8 py-4">Tingkat Risiko</th>
                  <th className="px-8 py-4 text-right whitespace-nowrap">Limit yang Direkomendasikan</th>
                  <th className="px-8 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d8]/10 text-[14px]">
                {riskCustomers.map((c) => {
                  const riskStyles: Record<string, string> = {
                    low: "bg-[#1FA463]/10 text-[#1FA463]",
                    medium: "bg-[#F2A93C]/10 text-[#F2A93C]",
                    high: "bg-[#DF2721]/10 text-[#DF2721]",
                  };
                  const scoreBg: Record<string, string> = {
                    low: "bg-[#003ada]/10 text-[#003ada]",
                    medium: "bg-[#F2A93C]/10 text-[#F2A93C]",
                    high: "bg-[#DF2721]/10 text-[#DF2721]",
                  };
                  return (
                    <tr key={c.id} className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group">
                      <td className="px-8 py-5">
                        <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#0029a1] text-[12px]">{c.initials}</div>
                          <div>
                            <p className="font-bold text-[#0b1c30]">{c.name}</p>
                            <p className="text-[12px] text-[#747687]">{c.industry} • {c.region}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className={`inline-block px-3 py-1 font-bold rounded-full ${scoreBg[c.riskLevel]}`}>{c.score}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[12px] ${riskStyles[c.riskLevel]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.riskLevel === "low" ? "bg-[#1FA463]" : c.riskLevel === "medium" ? "bg-[#F2A93C]" : "bg-[#DF2721]"}`} />
                          {c.riskLabel}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-[#0b1c30]">{c.approvedLimit}</td>
                      <td className="px-8 py-5 text-center">
                        <Link href={`/customers/${c.id}`} className="text-[#003ada] font-semibold hover:bg-[#003ada]/5 px-4 py-1.5 rounded-full transition-colors">Detail</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-6 bg-[#eff4ff]/30 flex items-center justify-between border-t border-[#c4c5d8]/10">
            <span className="text-[12px] font-semibold tracking-[0.05em] text-[#747687]">Menampilkan 1-4 dari 128 pelanggan ternilai</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 hover:bg-white transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 bg-white shadow-sm font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 hover:bg-white transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 hover:bg-white transition-colors">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 hover:bg-white transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
