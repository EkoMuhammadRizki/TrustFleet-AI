"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredCustomers, downloadMockPdf } from "@/lib/storage";
import { Customer } from "@/lib/data";
import PortfolioTrendChart from "@/components/PortfolioTrendChart";
import Swal from "sweetalert2";

interface HeatmapCell {
  bg: string;
  text: string;
  show: boolean;
  details: string;
}

export default function RiskAnalyticsPage() {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  // Filter states
  const [dateRange, setDateRange] = useState<string>("all");
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCustomerList(getStoredCustomers());
  }, []);

  const handleResetFilters = () => {
    setDateRange("all");
    setRiskLevelFilter("all");
    setIndustryFilter("all");
    setRegionFilter("all");
    setCurrentPage(1);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Semua filter dibersihkan",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleAdvancedFilter = () => {
    Swal.fire({
      title: "Filter Lanjutan (Wilayah)",
      html: `
        <div class="space-y-4 font-[var(--font-inter)] text-left">
          <p class="text-xs text-slate-500 font-semibold mb-2">Pilih wilayah operasional armada:</p>
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="all" ${regionFilter === "all" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">Semua Wilayah</span>
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="Domestik" ${regionFilter === "Domestik" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">Domestik</span>
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="Global" ${regionFilter === "Global" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">Global</span>
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="Asia Pasifik" ${regionFilter === "Asia Pasifik" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">Asia Pasifik</span>
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="Asia Tenggara" ${regionFilter === "Asia Tenggara" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">Asia Tenggara</span>
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="AS" ${regionFilter === "AS" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">AS</span>
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="radio" name="region-opt" value="EU" ${regionFilter === "EU" ? "checked" : ""} class="w-4 h-4 text-[#003ada]">
              <span class="text-sm font-semibold">EU</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#003ada",
      cancelButtonColor: "#747687",
      confirmButtonText: "Terapkan Filter",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)] w-[500px]",
      },
      preConfirm: () => {
        const selected = (document.querySelector('input[name="region-opt"]:checked') as HTMLInputElement)?.value;
        return selected || "all";
      }
    }).then((res) => {
      if (res.isConfirmed) {
        setRegionFilter(res.value);
        setCurrentPage(1);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Filter wilayah '${res.value === "all" ? "Semua" : res.value}' diterapkan`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleExportReport = () => {
    const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const content = `==================================================
TRUSTFLEET AI - LAPORAN ANALISIS RISIKO PORTFOLIO
Tanggal Pembuatan: ${dateStr}
==================================================

Ringkasan Filter Aktif:
- Rentang Tanggal : ${dateRange === "all" ? "Semua Tanggal" : `${dateRange} Hari Terakhir`}
- Tingkat Risiko  : ${riskLevelFilter === "all" ? "Semua Tingkatan" : riskLevelFilter.toUpperCase()}
- Industri        : ${industryFilter === "all" ? "Semua Industri" : industryFilter}
- Wilayah         : ${regionFilter === "all" ? "Semua Wilayah" : regionFilter}

--------------------------------------------------
Statistik Ringkasan:
- Total Armada Disaring : ${filteredCustomers.length} pelanggan
- Skor Rata-rata        : ${filteredCustomers.length > 0 ? Math.round(filteredCustomers.reduce((acc, c) => acc + c.score, 0) / filteredCustomers.length) : "-"}
- Risiko Tinggi         : ${filteredCustomers.filter(c => c.riskLevel === "high").length} pelanggan
- Risiko Sedang         : ${filteredCustomers.filter(c => c.riskLevel === "medium").length} pelanggan
- Risiko Rendah         : ${filteredCustomers.filter(c => c.riskLevel === "low").length} pelanggan

--------------------------------------------------
Daftar Rincian Pelanggan:
${filteredCustomers.map(c => `
Nama Perusahaan  : ${c.name}
Industri         : ${c.industry}
Wilayah          : ${c.region}
Ukuran Armada    : ${c.fleetSize} Kendaraan
Skor TrustScore  : ${c.score} (${c.riskLabel})
Rekomendasi Limit: ${c.approvedLimit}
Status           : ${c.status.toUpperCase()}
--------------------------------------------------`).join("")}

==================================================
Laporan ini dihasilkan secara otomatis oleh TrustFleet AI.
Dokumen Terverifikasi & Aman.
==================================================`;

    downloadMockPdf(`Laporan_Analisis_Risiko_${new Date().toISOString().slice(0, 10)}.pdf`, content);

    Swal.fire({
      icon: 'success',
      title: 'Laporan Diekspor!',
      text: 'File PDF ringkasan portofolio risiko Anda telah berhasil diunduh.',
      confirmButtonColor: '#003ada',
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      }
    });
  };

  // Perform filtration
  const filteredCustomers = customerList.filter((c) => {
    // 1. Risk Level Filter
    if (riskLevelFilter !== "all" && c.riskLevel !== riskLevelFilter) {
      return false;
    }
    // 2. Industry Filter
    if (industryFilter !== "all" && c.industry !== industryFilter) {
      return false;
    }
    // 3. Region Filter
    if (regionFilter !== "all" && c.region !== regionFilter) {
      return false;
    }
    // Date filter: simulate 30, 90, 180 days logic based on joinDate
    if (dateRange === "30") {
      // "Juni 2026" or "Jun 2021" / "Jan 2022" etc.
      // Mock: only show June 2026 or Jun 2021 as active for demo (Juni 2026 represents last 30 days)
      return c.joinDate.includes("Juni 2026") || c.joinDate.includes("Jun 2026");
    }
    return true;
  });

  // Pagination logic
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Analisis Risiko</h2>
          <p className="text-[#444655] font-[var(--font-inter)] text-[16px] mt-1">Memantau kerentanan portofolio dan kesehatan kredit di seluruh segmen armada.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportReport} className="bg-white border border-[#003ada] text-[#003ada] px-6 py-2.5 rounded-full font-semibold hover:bg-[#003ada]/5 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            Ekspor Laporan
          </button>
          <button onClick={handleAdvancedFilter} className="bg-[#003ada] text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#003ada]/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer">
            Filter Lanjutan
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Date Filter */}
        <div className="bg-white px-5 py-2 flex items-center gap-2 rounded-full border border-[#c4c5d8]/40 hover:border-[#003ada]/50 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#747687]">calendar_month</span>
          <span className="text-[12px] font-semibold tracking-[0.05em] text-[#747687] whitespace-nowrap">Rentang Tanggal:</span>
          <select
            value={dateRange}
            onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }}
            className="font-semibold text-[14px] bg-transparent border-none outline-none cursor-pointer text-[#0b1c30] pr-2 py-0.5"
          >
            <option value="all">Semua Tanggal</option>
            <option value="30">30 Hari Terakhir</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="bg-white px-5 py-2 flex items-center gap-2 rounded-full border border-[#c4c5d8]/40 hover:border-[#003ada]/50 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#747687]">filter_list</span>
          <span className="text-[12px] font-semibold tracking-[0.05em] text-[#747687] whitespace-nowrap">Tingkat Risiko:</span>
          <select
            value={riskLevelFilter}
            onChange={(e) => { setRiskLevelFilter(e.target.value); setCurrentPage(1); }}
            className="font-semibold text-[14px] bg-transparent border-none outline-none cursor-pointer text-[#0b1c30] pr-2 py-0.5"
          >
            <option value="all">Semua Tingkatan</option>
            <option value="low">Risiko Rendah</option>
            <option value="medium">Risiko Sedang</option>
            <option value="high">Risiko Tinggi</option>
          </select>
        </div>

        {/* Industry Filter */}
        <div className="bg-white px-5 py-2 flex items-center gap-2 rounded-full border border-[#c4c5d8]/40 hover:border-[#003ada]/50 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#747687]">category</span>
          <span className="text-[12px] font-semibold tracking-[0.05em] text-[#747687] whitespace-nowrap">Industri:</span>
          <select
            value={industryFilter}
            onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
            className="font-semibold text-[14px] bg-transparent border-none outline-none cursor-pointer text-[#0b1c30] pr-2 py-0.5"
          >
            <option value="all">Semua Industri</option>
            <option value="Logistik & Transportasi">Logistik & Transportasi</option>
            <option value="Kurir & Pengiriman">Kurir & Pengiriman</option>
            <option value="Rantai Pasok">Rantai Pasok</option>
            <option value="Kargo Udara & Darat">Kargo Udara & Darat</option>
            <option value="Pengangkutan Berat">Pengangkutan Berat</option>
            <option value="Pengangkutan Regional">Pengangkutan Regional</option>
            <option value="Last Mile">Last Mile</option>
            <option value="Transportasi Medis">Transportasi Medis</option>
          </select>
        </div>

        {/* Region Indicator Tag */}
        {regionFilter !== "all" && (
          <div className="bg-[#003ada]/10 border border-[#003ada]/20 px-4 py-2 flex items-center gap-2 rounded-full text-[#003ada]">
            <span className="text-[12px] font-semibold tracking-[0.05em]">Wilayah:</span>
            <span className="font-semibold text-[14px]">{regionFilter}</span>
            <button onClick={() => { setRegionFilter("all"); setCurrentPage(1); }} className="material-symbols-outlined text-[16px] hover:text-[#0b1c30] cursor-pointer">close</button>
          </div>
        )}

        <div className="w-px h-6 bg-[#c4c5d8]/30" />
        <button onClick={handleResetFilters} className="text-[#003ada] font-semibold text-[14px] hover:underline cursor-pointer">Hapus Semua</button>
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

        {/* Trend Chart */}
        <div className="col-span-12 lg:col-span-5">
          <PortfolioTrendChart />
        </div>

        {/* Customer Table */}
        <div className="col-span-12 bg-white rounded-[24px] shadow-sm border border-[#c4c5d8]/10 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#c4c5d8]/10 flex items-center justify-between">
            <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Pelanggan Hasil Filter Portofolio</h3>
            <span className="text-[12px] bg-[#003ada]/10 text-[#003ada] px-3 py-1 rounded-full font-bold">
              Total: {totalItems}
            </span>
          </div>

          {currentItems.length > 0 ? (
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
                  {currentItems.map((c) => {
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">search_off</span>
              <h4 className="font-[var(--font-jakarta)] text-lg font-bold text-[#0b1c30]">Tidak Ada Data Ditemukan</h4>
              <p className="font-[var(--font-inter)] text-sm text-[#747687] mt-1 max-w-md">Tidak ada pelanggan armada yang cocok dengan kriteria filter yang Anda terapkan saat ini.</p>
              <button onClick={handleResetFilters} className="mt-4 bg-[#003ada] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all cursor-pointer">
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="px-8 py-6 bg-[#eff4ff]/30 flex items-center justify-between border-t border-[#c4c5d8]/10">
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[#747687]">
                Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} dari {totalItems} pelanggan ternilai
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 transition-colors ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-white cursor-pointer"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors cursor-pointer ${
                      currentPage === idx + 1 ? "border-[#c4c5d8]/30 bg-white shadow-sm font-bold" : "border-[#c4c5d8]/30 hover:bg-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#c4c5d8]/30 transition-colors ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-white cursor-pointer"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
