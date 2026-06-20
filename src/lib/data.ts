export interface Customer {
  id: string;
  name: string;
  initials: string;
  industry: string;
  region: string;
  fleetSize: number;
  vehicleLabel: string;
  score: number;
  riskLevel: "low" | "medium" | "high";
  riskLabel: string;
  approvedLimit: string;
  status: "approved" | "review" | "declined" | "pending";
  activeRoutes: string;
  joinDate: string;
}

export const customers: Customer[] = [
  {
    id: "nexus-logistics",
    name: "Nexus Logistics",
    initials: "NL",
    industry: "Logistik & Transportasi",
    region: "Global",
    fleetSize: 45,
    vehicleLabel: "45 Kendaraan",
    score: 812,
    riskLevel: "low",
    riskLabel: "Risiko Rendah",
    approvedLimit: "Rp 36.000.000.000",
    status: "approved",
    activeRoutes: "12 Internasional",
    joinDate: "Jan 2022",
  },
  {
    id: "fasttrack-couriers",
    name: "FastTrack Couriers",
    initials: "FT",
    industry: "Kurir & Pengiriman",
    region: "Domestik",
    fleetSize: 12,
    vehicleLabel: "12 Kendaraan",
    score: 540,
    riskLevel: "medium",
    riskLabel: "Risiko Sedang",
    approvedLimit: "Rp 6.750.000.000",
    status: "review",
    activeRoutes: "8 Domestik",
    joinDate: "Mar 2023",
  },
  {
    id: "global-haulage",
    name: "Global Haulage",
    initials: "GH",
    industry: "Pengangkutan Berat",
    region: "Asia Pasifik",
    fleetSize: 104,
    vehicleLabel: "104 Kendaraan",
    score: 320,
    riskLevel: "high",
    riskLabel: "Risiko Tinggi",
    approvedLimit: "Ditolak",
    status: "declined",
    activeRoutes: "24 Regional",
    joinDate: "Jun 2021",
  },
  {
    id: "skyline-cargo",
    name: "Skyline Cargo",
    initials: "SC",
    industry: "Kargo Udara & Darat",
    region: "Asia Tenggara",
    fleetSize: 28,
    vehicleLabel: "28 Kendaraan",
    score: 765,
    riskLevel: "low",
    riskLabel: "Risiko Rendah",
    approvedLimit: "Rp 18.000.000.000",
    status: "approved",
    activeRoutes: "6 Internasional",
    joinDate: "Sep 2022",
  },
  {
    id: "apex-velox",
    name: "Apex Velox Logistics",
    initials: "AV",
    industry: "Rantai Pasok",
    region: "Global",
    fleetSize: 78,
    vehicleLabel: "78 Kendaraan",
    score: 842,
    riskLevel: "low",
    riskLabel: "Risiko Rendah",
    approvedLimit: "Rp 21.750.000.000",
    status: "approved",
    activeRoutes: "15 Internasional",
    joinDate: "Feb 2021",
  },
  {
    id: "trans-sierra",
    name: "Trans-Sierra Freight",
    initials: "TS",
    industry: "Pengangkutan Regional",
    region: "AS",
    fleetSize: 35,
    vehicleLabel: "35 Kendaraan",
    score: 528,
    riskLevel: "medium",
    riskLabel: "Risiko Sedang",
    approvedLimit: "Rp 4.800.000.000",
    status: "review",
    activeRoutes: "9 Domestik",
    joinDate: "Jul 2023",
  },
  {
    id: "nordic-mobile",
    name: "Nordic Mobile Solutions",
    initials: "NM",
    industry: "Last Mile",
    region: "EU",
    fleetSize: 22,
    vehicleLabel: "22 Kendaraan",
    score: 215,
    riskLevel: "high",
    riskLabel: "Risiko Tinggi",
    approvedLimit: "Rp 675.000.000",
    status: "declined",
    activeRoutes: "4 Regional",
    joinDate: "Nov 2023",
  },
  {
    id: "celerity-logistics",
    name: "Celerity Logistics",
    initials: "CL",
    industry: "Transportasi Medis",
    region: "AS",
    fleetSize: 56,
    vehicleLabel: "56 Kendaraan",
    score: 789,
    riskLevel: "low",
    riskLabel: "Risiko Rendah",
    approvedLimit: "Rp 31.500.000.000",
    status: "approved",
    activeRoutes: "11 Domestik",
    joinDate: "Apr 2022",
  },
];

export const notifications = [
  { id: 1, title: "Global Haulage butuh review", desc: "Skor kredit turun 14 poin", time: "5 menit lalu", unread: true, customerId: "global-haulage" },
  { id: 2, title: "Nexus Logistics - skor diperbarui", desc: "Skor naik menjadi 812", time: "1 jam lalu", unread: true, customerId: "nexus-logistics" },
  { id: 3, title: "Laporan bulanan siap", desc: "Ringkasan Risiko Kredit Q3", time: "3 jam lalu", unread: false, customerId: null },
  { id: 4, title: "FastTrack Couriers menunggu keputusan", desc: "Review kredit diperlukan", time: "Kemarin", unread: false, customerId: "fasttrack-couriers" },
];

export const activityFeed = [
  {
    icon: "check",
    color: "bg-success-green",
    title: "Pemeliharaan Rutin Selesai",
    time: "2 jam yang lalu",
    desc: "ID Kendaraan: #FLEET-992 (Mercedes Actros). Total Biaya: Rp 18.600.000.",
    badge: "Faktur #INV-2023-0045 Dibuat",
    badgeIcon: "receipt_long",
  },
  {
    icon: "receipt",
    color: "bg-primary-container",
    title: "Faktur Pembelian Bahan Bakar",
    time: "Hari ini, 10:45 AM",
    desc: "5.000L Diesel untuk Pusat Distribusi Utama. Diproses via FleetCard.",
    badge: "Menunggu Pembayaran",
    badgeIcon: null,
  },
  {
    icon: "add_circle",
    color: "bg-warning-amber",
    title: "Kendaraan Baru Ditambahkan",
    time: "Kemarin",
    desc: "Scania R450 terdaftar dengan ID Armada Nexus #NX-121. Asuransi terverifikasi.",
    badge: null,
    badgeIcon: null,
  },
  {
    icon: "update",
    color: "bg-outline",
    title: "Tinjauan Keuangan Kuartalan",
    time: "12 Okt 2023",
    desc: "Profil penilaian risiko diperbarui berdasarkan laporan laba rugi Q3.",
    badge: null,
    badgeIcon: null,
  },
];

export const scoringFactors = [
  { name: "Frekuensi Servis (Kesehatan Armada)", points: "+ 45 Pts", color: "bg-success-green", width: "85%", positive: true, desc: "Armada dirawat secara rutin setiap 5.000km di bengkel resmi." },
  { name: "Volume Pembelian Suku Cadang", points: "+ 32 Pts", color: "bg-success-green", width: "70%", positive: true, desc: "Volume pembelian suku cadang asli meningkat 15% QOQ." },
  { name: "Tingkat Utilisasi Armada", points: "+ 28 Pts", color: "bg-success-green", width: "92%", positive: true, desc: "92% armada beroperasi aktif secara harian, menunjukkan efisiensi tinggi." },
  { name: "Konsistensi Pembayaran (Tren Pembayaran)", points: "- 12 Pts", color: "bg-alert-red", width: "15%", positive: false, desc: "Ada 2 transaksi dengan keterlambatan pembayaran < 3 hari di bulan lalu." },
  { name: "Skor Loyalitas", points: "+ 50 Pts", color: "bg-success-green", width: "95%", positive: true, desc: "Hubungan kerja sama selama 5+ tahun tanpa sengketa hukum." },
];

export const reports = [
  { id: 1, title: "Ringkasan Risiko Kredit Bulanan", type: "PDF", size: "4.2 MB", time: "Dibuat 2 jam yang lalu", icon: "description", iconBg: "bg-sky-blue/30", iconColor: "text-primary" },
  { id: 2, title: "Analisis Utilisasi Armada Q3", type: "XLSX", size: "1.8 MB", time: "Dibuat Kemarin", icon: "directions_car", iconBg: "bg-success-green/10", iconColor: "text-success-green" },
  { id: 3, title: "Indeks Kesehatan Keuangan - Top 50", type: "PDF", size: "12.5 MB", time: "Dibuat 3 hari yang lalu", icon: "health_and_safety", iconBg: "bg-warning-amber/10", iconColor: "text-warning-amber" },
  { id: 4, title: "Peta Peringatan Tunggakan Risiko Tinggi", type: "Interaktif", size: "0.5 MB", time: "Dibuat 5 hari yang lalu", icon: "report_problem", iconBg: "bg-alert-red/10", iconColor: "text-alert-red" },
];
