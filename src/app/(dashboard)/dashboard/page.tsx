"use client";
import Link from "next/link";
import { useState } from "react";
import { customers } from "@/lib/data";

export default function DashboardPage() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const dashboardCustomers = customers.slice(0, 4);

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Ringkasan Kecerdasan Armada</h2>
          <p className="font-[var(--font-inter)] text-[14px] text-[#444655] mt-1">Penilaian risiko kredit alternatif real-time untuk portofolio armada Anda.</p>
        </div>
        <button suppressHydrationWarning={true} className="bg-[#003ada] text-white font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Penilaian Risiko Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: "groups", label: "Total Pelanggan Diskor", value: "1,284", badge: "+12%", badgeColor: "bg-[#1FA463]/20" },
          { icon: "speed", label: "Rata-rata Skor Kredit", value: "742", badge: "Optimal", badgeColor: "bg-[#F2A93C]/20" },
          { icon: "error", label: "Pelanggan Risiko Tinggi", value: "42", badge: "-3%", badgeColor: "bg-[#DF2721]/20" },
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
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm flex flex-col items-center">
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
                  <span className="font-[var(--font-jakarta)] text-[28px] font-bold">1.284</span>
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
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Aktivitas Penilaian Terbaru</h4>
              <p className="font-[var(--font-inter)] text-[14px] text-[#444655]">Keputusan kredit alternatif terbaru</p>
            </div>
            <Link href="/customers" className="text-[#0029a1] font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] hover:underline">Lihat Semua Data</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                        <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#dde1ff] flex items-center justify-center font-bold text-[#0029a1] text-xs">{c.initials}</div>
                          <div>
                            <p className="font-[var(--font-inter)] text-[14px] font-bold text-[#0b1c30]">{c.name}</p>
                            <p className="text-[12px] text-[#444655]">{c.vehicleLabel}</p>
                          </div>
                        </Link>
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
                      <td className="py-4 text-right">
                        <Link href={`/customers/${c.id}`} className="material-symbols-outlined text-[#747687] hover:text-[#0029a1] transition-colors">more_horiz</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="col-span-12 bg-white p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm relative overflow-hidden flex items-center">
          <div className="flex-1 pr-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#003ada] bg-[#dee1ff] p-2 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Rekomendasi TrustFleet AI</h4>
            </div>
            <p className="font-[var(--font-inter)] text-[14px] text-[#444655] max-w-2xl">
              Berdasarkan data telematika real-time dan riwayat transaksi, <strong>Global Haulage</strong> menunjukkan tanda-tanda volatilitas arus kas meskipun ukuran armadanya besar. AI menyarankan untuk mengurangi ambang batas kredit sebesar 15% untuk kuartal berikutnya hingga stabilitas operasional membaik.
            </p>
          </div>
          <div>
            <Link href="/credit-scoring/global-haulage" className="bg-[#dce9ff] text-[#0029a1] font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] px-6 py-3 rounded-full hover:bg-[#d3e4ff] transition-all">Tinjau Detail</Link>
          </div>
        </div>
      </div>
    </>
  );
}
