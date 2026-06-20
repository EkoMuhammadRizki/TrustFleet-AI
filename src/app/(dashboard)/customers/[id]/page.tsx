"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredCustomers } from "@/lib/storage";
import { Customer, activityFeed } from "@/lib/data";

const tabs = ["Ringkasan", "Riwayat Layanan", "Suku Cadang", "Aktivitas Armada", "Riwayat Kredit"];

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const list = getStoredCustomers();
    const found = list.find((c) => c.id === id) || list[0] || null;
    setCustomer(found);
  }, [id]);

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003ada]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[#444655]/60 font-[var(--font-inter)] text-[14px]">
        <span className="material-symbols-outlined text-sm">home</span>
        <span>/</span>
        <Link href="/customers" className="hover:text-[#003ada] transition-colors">Direktori Pelanggan</Link>
        <span>/</span>
        <span className="text-[#0029a1] font-semibold">{customer.name}</span>
      </div>

      {/* Customer Hero Card */}
      <div className="nexus-gradient rounded-xl p-8 mb-10 text-white flex flex-col md:flex-row justify-between items-stretch md:items-center relative overflow-hidden gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] mb-1">{customer.name}</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-wider">{customer.industry}</span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
              <span className="text-white/80">{customer.joinDate}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-white/60 text-xs font-semibold tracking-[0.05em] uppercase mb-1">Ukuran Armada</p>
              <p className="font-[var(--font-jakarta)] text-[20px] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5E1EF]">local_shipping</span>
                {customer.vehicleLabel}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold tracking-[0.05em] uppercase mb-1">Rute Aktif</p>
              <p className="font-[var(--font-jakarta)] text-[20px] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5E1EF]">route</span>
                {customer.activeRoutes}
              </p>
            </div>
          </div>
        </div>

        {/* Score Gauge */}
        <div className="relative z-10 flex flex-col items-center mt-8 md:mt-0">
          <div className="relative flex items-center justify-center">
            <svg className="gauge-svg w-32 h-32" viewBox="0 0 100 100">
              <circle className="gauge-circle-bg" cx="50" cy="50" r="40" fill="none" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round"
                stroke={customer.riskLevel === "low" ? "#1FA463" : customer.riskLevel === "medium" ? "#F2A93C" : "#DF2721"}
                strokeDasharray="251.2"
                strokeDashoffset={`${251.2 - (251.2 * (customer.score / 1000))}`}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-extrabold leading-none">{customer.score}</span>
              <span className={`text-[10px] font-bold uppercase ${
                customer.riskLevel === "low" ? "text-[#1FA463]" : customer.riskLevel === "medium" ? "text-[#F2A93C]" : "text-[#DF2721]"
              }`}>{customer.riskLabel}</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-white/60 uppercase">TrustScore Engine v2.4</p>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8">
          {/* Tab Control */}
          <div className="bg-[#eff4ff] p-1.5 rounded-full flex gap-1 mb-8 overflow-x-auto flex-nowrap no-scrollbar">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`py-2.5 px-4 rounded-full text-sm transition-all shrink-0 cursor-pointer ${
                  activeTab === i
                    ? "bg-white text-[#0029a1] font-semibold shadow-sm"
                    : "text-[#444655] hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#c4c5d8]/30">
            {activeTab === 0 && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Aktivitas Operasional Terbaru</h3>
                  <button className="text-[#0029a1] font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer">
                    Lihat Semua <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
                <div className="space-y-0">
                  {activityFeed.map((item, i) => (
                    <div key={i} className={`flex items-start gap-4 ${i < activityFeed.length - 1 ? "pb-6 border-l-2 border-[#dce9ff]" : ""} ml-3 relative`}>
                      <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full ${item.color} flex items-center justify-center ring-4 ring-white`}>
                        <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'wght' 700" }}>{item.icon}</span>
                      </div>
                      <div className="pl-4 w-full">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-semibold text-[#0b1c30] text-sm">{item.title}</h4>
                          <span className="text-xs text-[#444655]">{item.time}</span>
                        </div>
                        <p className="text-[#444655] text-sm mb-3">{item.desc}</p>
                        {item.badge && (
                          item.badgeIcon ? (
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#0029a1]">
                              <span className="material-symbols-outlined text-sm">{item.badgeIcon}</span>
                              {item.badge}
                            </div>
                          ) : (
                            <span className="px-3 py-1 bg-[#e6eeff] rounded-full text-xs text-[#0029a1] font-bold">{item.badge}</span>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30] mb-4">Riwayat Layanan</h3>
                {[
                  { date: "15 Des 2023", type: "Pemeliharaan Rutin", vehicle: "Mercedes Actros #992", cost: "Rp 18.600.000", status: "Selesai" },
                  { date: "28 Nov 2023", type: "Perbaikan Rem", vehicle: "Scania R450 #121", cost: "Rp 13.350.000", status: "Selesai" },
                  { date: "10 Nov 2023", type: "Servis Berkala 50.000km", vehicle: "Volvo FH16 #445", cost: "Rp 32.250.000", status: "Selesai" },
                ].map((s, i) => (
                  <div key={i} className="p-4 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#c4c5d8]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#003ada]/10 flex items-center justify-center text-[#003ada]">
                        <span className="material-symbols-outlined text-[20px]">build</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{s.type}</p>
                        <p className="text-xs text-[#444655]">{s.vehicle} • {s.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{s.cost}</p>
                      <span className="text-xs text-[#1FA463] font-semibold">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-4">
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30] mb-4">Pembelian Suku Cadang</h3>
                {[
                  { part: "Kampas Rem Set", qty: 12, cost: "Rp 72.000.000", date: "Des 2023" },
                  { part: "Filter Oli OEM", qty: 45, cost: "Rp 33.750.000", date: "Nov 2023" },
                  { part: "Bearing Roda", qty: 8, cost: "Rp 54.000.000", date: "Okt 2023" },
                ].map((p, i) => (
                  <div key={i} className="p-4 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#c4c5d8]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F2A93C]/10 flex items-center justify-center text-[#F2A93C]">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{p.part}</p>
                        <p className="text-xs text-[#444655]">{p.qty} unit • {p.date}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">{p.cost}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 3 && (
              <div className="space-y-4">
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30] mb-4">Aktivitas Armada</h3>
                {[
                  { vehicle: "Mercedes Actros #992", status: "Aktif", km: "12,450 km/bln", route: "Jakarta - Surabaya" },
                  { vehicle: "Scania R450 #121", status: "Aktif", km: "9,800 km/bln", route: "Jakarta - Bandung" },
                  { vehicle: "Volvo FH16 #445", status: "Maintenance", km: "0 km/bln", route: "Di Bengkel" },
                ].map((v, i) => (
                  <div key={i} className="p-4 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#c4c5d8]/20">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${v.status === "Aktif" ? "bg-[#1FA463]/10 text-[#1FA463]" : "bg-[#F2A93C]/10 text-[#F2A93C]"} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{v.vehicle}</p>
                        <p className="text-xs text-[#444655]">{v.route}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{v.km}</p>
                      <span className={`text-xs font-semibold ${v.status === "Aktif" ? "text-[#1FA463]" : "text-[#F2A93C]"}`}>{v.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 4 && (
              <div className="space-y-4">
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30] mb-4">Riwayat Kredit</h3>
                {[
                  { period: "Q3 2023", limit: "Rp 36.000.000.000", usage: "62%", status: "Lancar", ontime: "100%" },
                  { period: "Q2 2023", limit: "Rp 33.000.000.000", usage: "71%", status: "Lancar", ontime: "98%" },
                  { period: "Q1 2023", limit: "Rp 30.000.000.000", usage: "58%", status: "Lancar", ontime: "100%" },
                ].map((cr, i) => (
                  <div key={i} className="p-4 bg-[#f8f9ff] rounded-xl border border-[#c4c5d8]/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{cr.period}</p>
                      <span className="px-2 py-1 bg-[#1FA463]/10 text-[#1FA463] text-[11px] font-bold rounded-full">{cr.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><p className="text-xs text-[#444655]">Limit</p><p className="font-bold">{cr.limit}</p></div>
                      <div><p className="text-xs text-[#444655]">Utilisasi</p><p className="font-bold">{cr.usage}</p></div>
                      <div><p className="text-xs text-[#444655]">Tepat Waktu</p><p className="font-bold">{cr.ontime}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Scoring Summary */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#c4c5d8]/30 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1FA463]/10 text-[#1FA463] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Profil {customer.riskLabel}
            </span>
            <p className="text-[#444655] text-sm font-medium mb-2">Rekomendasi Limit Kredit</p>
            <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold text-[#0029a1] mb-6">{customer.approvedLimit}</h2>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm py-2 border-b border-[#c4c5d8]/20">
                <span className="text-[#444655]">Utilisasi</span>
                <span className="font-bold text-[#0b1c30]">62%</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-[#c4c5d8]/20">
                <span className="text-[#444655]">Keterlambatan Pembayaran</span>
                <span className="font-bold text-[#0b1c30]">0 Hari</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-[#444655]">Umur Kredit</span>
                <span className="font-bold text-[#0b1c30]">Stabil</span>
              </div>
            </div>
            <Link
              href={`/credit-scoring/${customer.id}`}
              className="block w-full py-4 bg-[#003ada] text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
            >
              Lihat Detail Penilaian
            </Link>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c4c5d8]/30">
            <h4 className="font-semibold text-[#0b1c30] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0029a1]">lightbulb</span>
              Wawasan Armada AI
            </h4>
            <div className="bg-[#eff4ff] rounded-xl p-4 text-sm text-[#444655] leading-relaxed">
              &quot;{customer.name} telah meningkatkan pengeluaran pemeliharaan sebesar <span className="text-[#0029a1] font-bold">14%</span> MoM. Ini menunjukkan ekspansi armada atau aset yang menua. Risiko tetap rendah karena piutang yang kuat.&quot;
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c4c5d8]/30">
            <h4 className="font-semibold text-[#0b1c30] mb-4">Aksi Cepat</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#c4c5d8]/30 hover:bg-[#eff4ff] transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[#0029a1]">request_quote</span>
                <span className="text-xs font-semibold">Pemfakturan</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#c4c5d8]/30 hover:bg-[#eff4ff] transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[#0029a1]">contact_support</span>
                <span className="text-xs font-semibold">Kontak</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
