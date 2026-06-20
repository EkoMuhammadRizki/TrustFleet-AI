"use client";
import Link from "next/link";

export default function GuidePage() {
  const steps = [
    {
      step: "01",
      icon: "dashboard",
      title: "Dasbor Utama & Penilaian Baru",
      desc: "Langkah pertama dimulai di halaman Dashboard. Di sini Anda bisa memantau metrik kesehatan kredit armada UD Trucks Anda. Jika Anda memiliki armada baru yang belum dinilai, klik tombol 'Penilaian Risiko Baru' di pojok kanan atas, isi detail perusahaan, dan jalankan proses AI scoring data telematika.",
      linkText: "Buka Dashboard",
      linkHref: "/dashboard"
    },
    {
      step: "02",
      icon: "person_search",
      title: "Evaluasi Pelanggan 360",
      desc: "Buka tab 'Pelanggan 360' atau klik langsung baris perusahaan di dasbor. Di halaman profil pelanggan ini, Anda bisa meninjau detail log operasional armada seperti riwayat servis mesin resmi, riwayat pembelian suku cadang asli (spareparts), kebiasaan mengemudi driver, dan peta rute aktif.",
      linkText: "Buka Direktori Pelanggan",
      linkHref: "/customers"
    },
    {
      step: "03",
      icon: "credit_score",
      title: "Analisis Skor & Explainable AI",
      desc: "Dari halaman detail profil pelanggan, klik 'Lihat Detail Penilaian' untuk masuk ke halaman detail Kredit. Di sini, Anda bisa meninjau TrustScore AI (skor 500-900) beserta rincian transparan pendorong bobot poin ('Mengapa skor ini?'). Anda juga dapat mengklik 'Lihat Semua Data' untuk melihat parameter telematika secara mendalam.",
      linkText: "Tinjau Kredit",
      linkHref: "/credit-scoring"
    },
    {
      step: "04",
      icon: "task_alt",
      title: "Pengambilan Keputusan Kredit",
      desc: "Di halaman Skor Kredit, Anda dapat mengambil keputusan dengan mengklik salah satu tombol keputusan: 'Approve' (menyetujui limit kredit yang disarankan), 'Review' (mengajukan peninjauan ulang dengan memasukkan catatan evaluasi), atau 'Decline' (menolak dengan memilih alasan penolakan dan deskripsi tambahan). Status pelanggan akan terupdate secara global.",
      linkText: "Tinjau Dasbor",
      linkHref: "/dashboard"
    },
    {
      step: "05",
      icon: "analytics",
      title: "Pemantauan Risiko & Laporan",
      desc: "Gunakan menu 'Analisis Risiko' untuk menyaring portofolio berdasarkan rentang tanggal, tingkat risiko, wilayah (filter lanjutan), dan industri. Ekspor ringkasan tersebut menjadi laporan PDF. Anda juga bisa menggunakan menu 'Laporan' untuk menjadwalkan kompilasi data laporan berkala secara berkala.",
      linkText: "Buka Analisis Risiko",
      linkHref: "/risk-analytics"
    }
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Panduan Penggunaan Sistem</h2>
        <p className="font-[var(--font-inter)] text-[16px] text-[#444655] mt-1">Ikuti langkah-langkah di bawah ini untuk memahami alur kerja penuh dari sistem alternatif kredit scoring TrustFleet AI.</p>
      </div>

      {/* Steps List */}
      <div className="space-y-8 max-w-4xl mb-12">
        {steps.map((s, idx) => (
          <div key={s.step} className="bg-white p-8 rounded-[24px] border border-[#c4c5d8]/30 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            {/* Step Number Background Glow */}
            <div className="absolute -right-4 -bottom-6 text-[120px] font-extrabold text-[#003ada]/5 font-sans select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
              {s.step}
            </div>

            {/* Left Column: Icon & Step Badge */}
            <div className="flex flex-col items-center md:items-start shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#003ada] flex items-center justify-center shadow-inner mb-3">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'wght' 300" }}>{s.icon}</span>
              </div>
              <span className="bg-[#003ada] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Langkah {s.step}
              </span>
            </div>

            {/* Right Column: Text Content */}
            <div className="flex-1 space-y-4 relative z-10">
              <h3 className="font-[var(--font-jakarta)] text-xl font-bold text-[#0b1c30]">{s.title}</h3>
              <p className="font-[var(--font-inter)] text-sm text-[#5B6B82] leading-relaxed">{s.desc}</p>
              
              {/* Contextual Link */}
              <div className="pt-2">
                <Link href={s.linkHref} className="inline-flex items-center gap-1 text-xs font-bold text-[#003ada] hover:underline uppercase tracking-wider">
                  {s.linkText}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Card */}
      <div className="bg-[#0029a1] text-white p-8 rounded-[24px] shadow-lg max-w-4xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <h4 className="font-[var(--font-jakarta)] text-lg font-bold">Butuh bantuan lebih lanjut?</h4>
          <p className="text-sm text-[#b5c0ff] leading-relaxed">
            Jika Anda mengalami kendala saat meninjau skor atau membutuhkan bantuan teknis mengenai data telematika, hubungi Tim Administrator / IT Support kami melalui menu kontak cepat di profil Anda.
          </p>
          <div className="pt-2">
            <Link href="/settings" className="bg-white text-[#0029a1] px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#b5c0ff]/20 hover:text-white transition-all inline-block">
              Ke Pengaturan & Bantuan
            </Link>
          </div>
        </div>
        <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] opacity-10 select-none">support_agent</span>
      </div>
    </>
  );
}
