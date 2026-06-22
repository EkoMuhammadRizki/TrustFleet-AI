"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredCustomers } from "@/lib/storage";
import { Customer } from "@/lib/data";

export default function CreditScoringDirectoryPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setCustomerList(getStoredCustomers());
  }, []);

  const filtered = customerList.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadges: Record<string, { label: string; style: string }> = {
    approved: { label: "Disetujui", style: "bg-[#1FA463]/10 text-[#1FA463] border-[#1FA463]/20" },
    review: { label: "Perlu Review", style: "bg-[#F2A93C]/10 text-[#F2A93C] border-[#F2A93C]/20" },
    declined: { label: "Ditolak", style: "bg-[#DF2721]/10 text-[#DF2721] border-[#DF2721]/20" },
    pending: { label: "Menunggu", style: "bg-[#747687]/10 text-[#747687] border-[#747687]/20" },
  };

  const getScoreColor = (score: number) => {
    if (score >= 700) return "bg-[#1FA463]/10 text-[#1FA463]";
    if (score >= 500) return "bg-[#F2A93C]/10 text-[#F2A93C]";
    return "bg-[#DF2721]/10 text-[#DF2721]";
  };

  // Stats calculation
  const awaitingReviewCount = customerList.filter(c => c.status === "review").length;
  const approvedCount = customerList.filter(c => c.status === "approved").length;
  const declinedCount = customerList.filter(c => c.status === "declined").length;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Manajemen Skor Kredit</h2>
          <p className="font-[var(--font-inter)] text-[14px] text-[#444655] mt-1">Evaluasi tingkat risiko kredit alternatif armada dan kelola persetujuan limit.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Menunggu Tinjauan", value: awaitingReviewCount, icon: "rate_review", color: "bg-[#F2A93C]/10 text-[#F2A93C]", border: "border-[#F2A93C]/20" },
          { label: "Total Disetujui", value: approvedCount, icon: "check_circle", color: "bg-[#1FA463]/10 text-[#1FA463]", border: "border-[#1FA463]/20" },
          { label: "Total Ditolak", value: declinedCount, icon: "cancel", color: "bg-[#DF2721]/10 text-[#DF2721]", border: "border-[#DF2721]/20" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white p-6 rounded-[24px] border ${stat.border} shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-[12px] font-semibold tracking-[0.05em] text-[#747687] uppercase mb-1">{stat.label}</p>
              <h3 className="font-[var(--font-jakarta)] text-[28px] font-extrabold text-[#0b1c30]">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#747687]">search</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-[#eff4ff] border-none rounded-full font-[var(--font-inter)] text-[14px] focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none"
            placeholder="Cari nama perusahaan atau industri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Semua Status" },
            { value: "review", label: "Perlu Review" },
            { value: "approved", label: "Disetujui" },
            { value: "declined", label: "Ditolak" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-5 py-2.5 rounded-full border text-[14px] font-semibold transition-all ${
                statusFilter === f.value
                  ? "bg-[#003ada] text-white border-[#003ada]"
                  : "bg-white text-[#0b1c30] border-[#c4c5d8]/40 hover:border-[#003ada]/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-[#c4c5d8]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#eff4ff]/30 text-[12px] font-semibold tracking-[0.05em] text-[#747687] uppercase">
                <th className="px-8 py-4">Nama Perusahaan</th>
                <th className="px-8 py-4 text-center">Skor Kepercayaan</th>
                <th className="px-8 py-4 text-center">Tingkat Risiko</th>
                <th className="px-8 py-4">Status Keputusan</th>
                <th className="px-8 py-4 text-right">Limit Kredit</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d8]/10 text-[14px]">
              {filtered.map((c) => {
                const badge = statusBadges[c.status] || { label: c.status, style: "" };
                return (
                  <tr key={c.id} className="hover:bg-[#eff4ff]/50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5">
                      <Link href={`/credit-scoring/${c.id}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-bold text-[#0029a1] text-[12px]">{c.initials}</div>
                        <div>
                          <p className="font-bold text-[#0b1c30]">{c.name}</p>
                          <p className="text-[12px] text-[#747687]">{c.industry} • {c.region}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-block px-3 py-1 font-bold rounded-full ${getScoreColor(c.score)}`}>
                        {c.score}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[12px]`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.riskLevel === "low" ? "bg-[#1FA463]" : c.riskLevel === "medium" ? "bg-[#F2A93C]" : "bg-[#DF2721]"}`} />
                        {c.riskLabel}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[12px] border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-[#0b1c30]">
                      {c.approvedLimit === "Ditolak" ? "Rp 0" : c.approvedLimit}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <Link href={`/credit-scoring/${c.id}`} className="inline-block bg-[#003ada] text-white font-semibold hover:opacity-90 px-4 py-2 rounded-full transition-colors text-xs shadow-sm whitespace-nowrap">
                        Tinjau Skor
                      </Link>
                    </td>
                  </tr>
                );
              })}
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
          <span className="text-[12px] font-semibold text-[#747687]">Menampilkan {filtered.length} dari {customerList.length} pelanggan</span>
        </div>
      </div>
    </>
  );
}
