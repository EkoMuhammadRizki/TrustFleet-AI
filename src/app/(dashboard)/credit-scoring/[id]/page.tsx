"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { customers, scoringFactors } from "@/lib/data";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function CreditScoringDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const customer = customers.find((c) => c.id === id) || customers[0];

  const [approveModal, setApproveModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [declineReason, setDeclineReason] = useState("cash-flow");
  const [declineNote, setDeclineNote] = useState("");

  const handleApprove = () => {
    setApproveModal(false);
    showToast(`Kredit ${customer.name} berhasil disetujui!`, "success");
    setTimeout(() => router.push("/dashboard"), 1500);
  };
  const handleReview = () => {
    setReviewModal(false);
    setReviewNote("");
    showToast(`Catatan review untuk ${customer.name} telah disimpan.`, "info");
    setTimeout(() => router.push("/dashboard"), 1500);
  };
  const handleDecline = () => {
    setDeclineModal(false);
    setDeclineNote("");
    showToast(`Kredit ${customer.name} telah ditolak.`, "error");
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  const score = customer.score || 785;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex justify-between items-end animate-fade-in">
        <div>
          <nav className="flex items-center gap-2 text-[#444655] mb-2">
            <Link href="/customers" className="text-[12px] font-semibold tracking-[0.05em] hover:text-[#003ada]">Skor Kredit</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[12px] font-semibold tracking-[0.05em] text-[#0029a1]">{customer.name}</span>
          </nav>
          <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Detail Skor Kredit</h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-full border border-[#0029a1] text-[#0029a1] font-semibold hover:bg-[#0029a1]/5 transition-all text-[14px]">
            Unduh Laporan
          </button>
          <button
            onClick={() => setReviewModal(true)}
            className="px-6 py-2.5 rounded-full bg-[#003ada] text-white font-semibold shadow-lg shadow-[#003ada]/20 hover:scale-105 transition-all text-[14px]"
          >
            Ajukan Peninjauan
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Column 1: Score Gauge + Recommendation */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Gauge Card */}
          <div className="bg-white p-8 rounded-[24px] shadow-sm flex flex-col items-center justify-center animate-fade-in">
            <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30] mb-8">Skor Kepercayaan</h3>
            <div className="relative w-[220px] h-[220px] mb-4">
              <svg className="gauge-svg w-full h-full" viewBox="0 0 220 220">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DF2721" />
                    <stop offset="50%" stopColor="#F2A93C" />
                    <stop offset="100%" stopColor="#1FA463" />
                  </linearGradient>
                </defs>
                <circle className="gauge-track" cx="110" cy="110" r="100" />
                <circle
                  cx="110" cy="110" r="100"
                  fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray="628"
                  strokeDashoffset={628 - (score / 1000) * 628}
                  style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-[var(--font-jakarta)] text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0b1c30]">{score}</span>
                <span className="font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#1FA463] uppercase mt-[-4px]">
                  {score >= 700 ? "SANGAT BAIK" : score >= 500 ? "CUKUP" : "BURUK"}
                </span>
              </div>
            </div>
            <p className="text-center text-[#444655] font-[var(--font-inter)] text-[14px] max-w-[240px] mt-4">
              Peningkatan <span className="text-[#1FA463] font-bold">+12 poin</span> dibanding bulan lalu.
            </p>
          </div>

          {/* Recommendation Card */}
          <div className="rounded-[24px] p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #061649 0%, #003ADA 100%)" }}>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold">Rekomendasi Kredit</h3>
                <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider border ${
                  customer.riskLevel === "low"
                    ? "bg-[#1FA463]/20 text-[#1FA463] border-[#1FA463]/30"
                    : customer.riskLevel === "medium"
                    ? "bg-[#F2A93C]/20 text-[#F2A93C] border-[#F2A93C]/30"
                    : "bg-[#DF2721]/20 text-[#DF2721] border-[#DF2721]/30"
                }`}>
                  {customer.status === "approved" ? "DISETUJUI" : customer.status === "review" ? "REVIEW" : "DITOLAK"}
                </span>
              </div>
              <p className="text-[#b5c0ff] text-[14px] mb-2">Limit Kredit yang Disarankan:</p>
              <h4 className="font-[var(--font-jakarta)] text-[24px] font-bold mb-6">
                {customer.approvedLimit === "Ditolak" ? "Rp 0" : customer.approvedLimit}
              </h4>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="text-[14px] text-[#b5c0ff] leading-relaxed">
                  Berdasarkan analisis AI, entitas menunjukkan {customer.riskLevel === "low" ? "likuiditas yang stabil dan rekam jejak pembayaran tepat waktu" : "volatilitas yang memerlukan pemantauan ketat"} selama 24 bulan terakhir.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C5E1EF]/10 rounded-full blur-3xl" />
          </div>

          {/* Decision Buttons */}
          <div className="flex gap-3">
            <button onClick={() => setApproveModal(true)} className="flex-1 py-3 bg-[#1FA463] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">
              Approve
            </button>
            <button onClick={() => setReviewModal(true)} className="flex-1 py-3 bg-[#F2A93C] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">
              Review
            </button>
            <button onClick={() => setDeclineModal(true)} className="flex-1 py-3 bg-[#DF2721] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">
              Decline
            </button>
          </div>
        </div>

        {/* Column 2: Explainable AI Factors */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[24px] shadow-sm h-full animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Mengapa skor ini?</h3>
                <p className="text-[#444655] text-sm font-medium">Analisis faktor pendorong kepercayaan (Explainable AI)</p>
              </div>
              <div className="flex items-center gap-1 text-[#0029a1] font-bold cursor-pointer hover:underline whitespace-nowrap">
                <span className="text-[12px] font-semibold tracking-[0.05em]">LIHAT SEMUA DATA</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </div>
            </div>
            <div className="space-y-8">
              {scoringFactors.map((factor, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-[var(--font-inter)] text-[14px] font-semibold text-[#0b1c30]">{factor.name}</span>
                    <span className={`text-[12px] font-semibold tracking-[0.05em] ${factor.positive ? "text-[#1FA463]" : "text-[#DF2721]"}`}>{factor.points}</span>
                  </div>
                  <div className="w-full bg-[#e6eeff] h-3 rounded-full overflow-hidden">
                    <div className={`${factor.color} h-full rounded-full transition-all duration-1000`} style={{ width: factor.width }} />
                  </div>
                  <p className="text-[12px] text-[#444655] mt-2 italic">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {[
              { icon: "local_shipping", label: "Total Ukuran Armada", value: `${customer.fleetSize} Unit`, iconBg: "bg-[#0029a1]/10", iconColor: "text-[#0029a1]" },
              { icon: "history", label: "Siklus Pembayaran (Rerata)", value: "14 Hari", iconBg: "bg-[#F2A93C]/10", iconColor: "text-[#F2A93C]" },
              { icon: "trending_up", label: "Pertumbuhan Pendapatan", value: "+18.5%", iconBg: "bg-[#1FA463]/10", iconColor: "text-[#1FA463]" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-[24px] shadow-sm border border-[#c4c5d8]/20 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-full flex items-center justify-center ${stat.iconColor}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[#444655] text-[12px] font-semibold tracking-[0.05em]">{stat.label}</p>
                  <h5 className="font-[var(--font-jakarta)] text-[24px] font-bold text-[#0b1c30]">{stat.value}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === MODALS === */}
      {/* Approve Modal */}
      <Modal open={approveModal} onClose={() => setApproveModal(false)} title="Konfirmasi Persetujuan">
        <div className="space-y-6">
          <div className="bg-[#1FA463]/10 p-4 rounded-xl border border-[#1FA463]/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#1FA463]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h4 className="font-bold text-[#1FA463]">Menyetujui Kredit</h4>
            </div>
            <p className="text-sm text-[#444655]">Anda akan menyetujui kredit untuk:</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-[#444655]">Pelanggan</span><span className="font-bold">{customer.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#444655]">Skor</span><span className="font-bold">{score}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#444655]">Limit Kredit</span><span className="font-bold text-[#0029a1]">{customer.approvedLimit}</span></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setApproveModal(false)} className="flex-1 py-3 border border-[#c4c5d8] rounded-full font-semibold hover:bg-[#f8f9ff] transition-all">Batal</button>
            <button onClick={handleApprove} className="flex-1 py-3 bg-[#1FA463] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">Konfirmasi</button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Tambah Catatan Review">
        <div className="space-y-6">
          <div className="bg-[#F2A93C]/10 p-4 rounded-xl border border-[#F2A93C]/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#F2A93C]" style={{ fontVariationSettings: "'FILL' 1" }}>rate_review</span>
              <h4 className="font-bold text-[#F2A93C]">Review — {customer.name}</h4>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Catatan Review</label>
            <textarea
              className="w-full p-4 border border-[#c4c5d8]/40 rounded-xl resize-none h-32 text-sm focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none"
              placeholder="Tambahkan catatan atau alasan review..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setReviewModal(false)} className="flex-1 py-3 border border-[#c4c5d8] rounded-full font-semibold hover:bg-[#f8f9ff] transition-all">Batal</button>
            <button onClick={handleReview} className="flex-1 py-3 bg-[#F2A93C] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">Submit</button>
          </div>
        </div>
      </Modal>

      {/* Decline Modal */}
      <Modal open={declineModal} onClose={() => setDeclineModal(false)} title="Alasan Penolakan">
        <div className="space-y-6">
          <div className="bg-[#DF2721]/10 p-4 rounded-xl border border-[#DF2721]/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#DF2721]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              <h4 className="font-bold text-[#DF2721]">Menolak Kredit — {customer.name}</h4>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Alasan Penolakan</label>
            <select
              className="w-full p-3 border border-[#c4c5d8]/40 rounded-full text-sm focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none appearance-none bg-white"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            >
              <option value="cash-flow">Volatilitas Arus Kas</option>
              <option value="payment">Riwayat Pembayaran Buruk</option>
              <option value="fleet">Kondisi Armada Tidak Memadai</option>
              <option value="docs">Dokumen Tidak Lengkap</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Catatan Tambahan</label>
            <textarea
              className="w-full p-4 border border-[#c4c5d8]/40 rounded-xl resize-none h-24 text-sm focus:ring-2 focus:ring-[#003ada]/20 focus:outline-none"
              placeholder="Tambahkan penjelasan..."
              value={declineNote}
              onChange={(e) => setDeclineNote(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeclineModal(false)} className="flex-1 py-3 border border-[#c4c5d8] rounded-full font-semibold hover:bg-[#f8f9ff] transition-all">Batal</button>
            <button onClick={handleDecline} className="flex-1 py-3 bg-[#DF2721] text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95">Tolak</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
