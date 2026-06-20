"use client";
import Link from "next/link";
import { useState } from "react";
import { customers } from "@/lib/data";

export default function CustomersListPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || c.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const riskColors: Record<string, string> = {
    low: "bg-[#1FA463]/10 text-[#1FA463] border-[#1FA463]/20",
    medium: "bg-[#F2A93C]/10 text-[#F2A93C] border-[#F2A93C]/20",
    high: "bg-[#DF2721]/10 text-[#DF2721] border-[#DF2721]/20",
  };

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Direktori Pelanggan</h2>
          <p className="font-[var(--font-inter)] text-[14px] text-[#444655] mt-1">Kelola dan telusuri data profil pelanggan armada Anda.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#747687]">search</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-[#eff4ff] border-none rounded-full font-[var(--font-inter)] text-[14px] focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none"
            placeholder="Cari pelanggan, ID armada, atau faktur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {[
          { value: "all", label: "Semua Risiko" },
          { value: "low", label: "Risiko Rendah" },
          { value: "medium", label: "Risiko Sedang" },
          { value: "high", label: "Risiko Tinggi" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setRiskFilter(f.value)}
            className={`px-5 py-2.5 rounded-full border text-[14px] font-semibold transition-all ${
              riskFilter === f.value
                ? "bg-[#003ada] text-white border-[#003ada]"
                : "bg-white text-[#0b1c30] border-[#c4c5d8]/40 hover:border-[#003ada]/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-[#c4c5d8]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff]/30 text-[12px] font-semibold tracking-[0.05em] text-[#747687] uppercase">
                <th className="px-8 py-4">Nama Perusahaan</th>
                <th className="px-8 py-4">Industri</th>
                <th className="px-8 py-4 text-center">Skor Kepercayaan</th>
                <th className="px-8 py-4">Tingkat Risiko</th>
                <th className="px-8 py-4 text-right">Limit Direkomendasikan</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d8]/10 text-[14px]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#0029a1] text-[12px]">{c.initials}</div>
                      <div>
                        <p className="font-bold text-[#0b1c30]">{c.name}</p>
                        <p className="text-[12px] text-[#747687]">{c.region}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5 text-[#444655]">{c.industry}</td>
                  <td className="px-8 py-5 text-center">
                    <div className={`inline-block px-3 py-1 font-bold rounded-full ${
                      c.riskLevel === "low" ? "bg-[#003ada]/10 text-[#003ada]" :
                      c.riskLevel === "medium" ? "bg-[#F2A93C]/10 text-[#F2A93C]" :
                      "bg-[#DF2721]/10 text-[#DF2721]"
                    }`}>{c.score}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[12px] border ${riskColors[c.riskLevel]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.riskLevel === "low" ? "bg-[#1FA463]" : c.riskLevel === "medium" ? "bg-[#F2A93C]" : "bg-[#DF2721]"}`} />
                      {c.riskLabel}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-[#0b1c30]">{c.approvedLimit}</td>
                  <td className="px-8 py-5 text-center">
                    <Link href={`/customers/${c.id}`} className="text-[#003ada] font-semibold hover:bg-[#003ada]/5 px-4 py-1.5 rounded-full transition-colors">Detail</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-[#444655]">
                    <span className="material-symbols-outlined text-[48px] text-[#c4c5d8] block mb-4">search_off</span>
                    <p className="font-semibold text-lg mb-1">Tidak ada hasil ditemukan</p>
                    <p className="text-sm">Coba ubah kata kunci pencarian atau filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 bg-[#eff4ff]/30 flex items-center justify-between border-t border-[#c4c5d8]/10">
          <span className="text-[12px] font-semibold text-[#747687]">Menampilkan {filtered.length} dari {customers.length} pelanggan</span>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 bg-white shadow-sm font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 hover:bg-white transition-colors">2</button>
          </div>
        </div>
      </div>
    </>
  );
}
