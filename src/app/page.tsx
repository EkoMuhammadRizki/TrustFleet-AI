'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scro6ll while splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  // Simulate loading progress
  useEffect(() => {
    if (!showSplash) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      let step = 0;
      if (currentProgress < 30) {
        step = Math.floor(Math.random() * 8) + 5;
      } else if (currentProgress < 70) {
        step = Math.floor(Math.random() * 5) + 3;
      } else if (currentProgress < 90) {
        step = Math.floor(Math.random() * 3) + 1;
      } else {
        step = Math.floor(Math.random() * 2) + 1;
      }

      currentProgress = Math.min(currentProgress + step, 100);
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFadeSplash(true);
          setTimeout(() => {
            setShowSplash(false);
            setIsLoaded(true);
          }, 600);
        }, 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [showSplash]);

  // Page Scroll and Animation Observer triggers only after splash screen finishes
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const header = document.getElementById('main-header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        } else {
          header.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        }
      }
    };

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.animate-card');
    cards.forEach((card) => {
      observer.observe(card);
    });

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#061649] to-[#030d2b] transition-all duration-700 ease-in-out ${
            fadeSplash ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#003ADA]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

          {/* Splash Content Container */}
          <div className="flex flex-col items-center text-center px-4 animate-[fade-in_0.8s_ease-out_forwards]">
            {/* Logo in a premium glowing glass container */}
            <div className="w-24 h-24 relative bg-white rounded-3xl p-4 shadow-[0_8px_32px_rgba(255,255,255,0.08)] border border-white/10 flex items-center justify-center mb-6 hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo/TrustFleetAILogoNavy.png"
                alt="TrustFleet AI Logo"
                fill
                className="object-contain p-3"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="font-[var(--font-jakarta)] text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              TrustFleet <span className="text-[#003ADA]">AI</span>
            </h1>
            <p className="font-[var(--font-inter)] text-sm text-[#C5E1EF] tracking-[0.2em] uppercase font-semibold mb-10">
              Intelegensi Fintech
            </p>

            {/* Loading Bar Wrapper */}
            <div className="w-64">
              {/* Progress track */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-[#003ADA] to-[#1FA463] rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,58,218,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              {/* Progress percentage and status text */}
              <div className="flex justify-between items-center mt-3 text-white/55 text-[11px] font-medium font-[var(--font-inter)] tracking-wider">
                <span className="animate-pulse">
                  {progress < 100 ? 'Mempersiapkan sistem...' : 'Selesai!'}
                </span>
                <span className="font-mono font-bold text-white/70">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#FAFAFC] text-[#061649] font-[var(--font-inter)] overflow-x-hidden">
      {/* Sticky Header */}
      <header
        id="main-header"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#eff4ff] text-[#061649] transition-colors cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative shrink-0">
              <Image
                src="/logo/TrustFleetAILogoNavy.png"
                alt="TrustFleet AI Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-[var(--font-inter)] font-bold text-sm sm:text-base md:text-xl text-[#061649]">TrustFleet AI</p>
              <p className="hidden sm:block text-[10px] md:text-[11px] text-[#5B6B82]">Intelegensi Fintech</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="font-[var(--font-inter)] text-[14px] text-[#5B6B82] hover:text-[#003ADA] transition-colors duration-300" href="#features">Fitur</a>
            <a className="font-[var(--font-inter)] text-[14px] text-[#5B6B82] hover:text-[#003ADA] transition-colors duration-300" href="#tujuan">Tujuan</a>
            <a className="font-[var(--font-inter)] text-[14px] text-[#5B6B82] hover:text-[#003ADA] transition-colors duration-300" href="#cara-kerja">Cara Kerja</a>
            <a className="font-[var(--font-inter)] text-[14px] text-[#5B6B82] hover:text-[#003ADA] transition-colors duration-300" href="#solutions">Solusi</a>
            <a className="font-[var(--font-inter)] text-[14px] text-[#5B6B82] hover:text-[#003ADA] transition-colors duration-300" href="#about-section">Tentang</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden sm:block font-[var(--font-inter)] text-[12px] font-semibold tracking-[0.05em] text-[#061649] hover:text-[#003ADA] transition-all duration-300">Masuk</Link>
            <Link href="/dashboard" className="inline-block bg-[#003ADA] text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-[var(--font-inter)] text-[10px] sm:text-[11px] md:text-[12px] font-semibold tracking-[0.05em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[#003ADA]/20 hover:shadow-[#003ADA]/30 whitespace-nowrap">
              Mulai Sekarang
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-[#E5EAF3] shadow-lg animate-fade-in absolute top-20 left-0 right-0 py-6 px-6 z-40">
            <nav className="flex flex-col gap-4">
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-[var(--font-inter)] text-[16px] font-semibold text-[#061649] hover:text-[#003ADA] transition-colors duration-300 py-2 border-b border-[#E5EAF3]/50"
                href="#features"
              >
                Fitur
              </a>
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-[var(--font-inter)] text-[16px] font-semibold text-[#061649] hover:text-[#003ADA] transition-colors duration-300 py-2 border-b border-[#E5EAF3]/50"
                href="#tujuan"
              >
                Tujuan
              </a>
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-[var(--font-inter)] text-[16px] font-semibold text-[#061649] hover:text-[#003ADA] transition-colors duration-300 py-2 border-b border-[#E5EAF3]/50"
                href="#cara-kerja"
              >
                Cara Kerja
              </a>
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-[var(--font-inter)] text-[16px] font-semibold text-[#061649] hover:text-[#003ADA] transition-colors duration-300 py-2 border-b border-[#E5EAF3]/50"
                href="#solutions"
              >
                Solusi
              </a>
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-[var(--font-inter)] text-[16px] font-semibold text-[#061649] hover:text-[#003ADA] transition-colors duration-300 py-2 border-b border-[#E5EAF3]/50"
                href="#about-section"
              >
                Tentang
              </a>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href="/dashboard"
                className="font-[var(--font-inter)] text-[16px] font-semibold text-[#061649] hover:text-[#003ADA] transition-colors duration-300 py-2 border-b border-[#E5EAF3]/50"
              >
                Masuk
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 flex items-center">
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-[#C5E1EF]/40 organic-blob -z-10 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-24 w-[400px] h-[400px] bg-[#C5E1EF]/20 organic-blob -z-10 blur-2xl"></div>
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left animate-card opacity-0 translate-y-10 transition-all duration-700 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EEF3FF] rounded-full text-[#003ADA] border border-[#C5E1EF]/30">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-[12px] font-semibold tracking-[0.05em] uppercase">Intelijen Kredit Generasi Baru</span>
              </div>
              <h1 className="font-[var(--font-jakarta)] text-[40px] md:text-[48px] lg:text-[56px] font-extrabold leading-tight tracking-[-0.02em] text-[#061649]">
                <span className="text-[#003ADA]">Tingkatkan Kecerdasan</span> Armada Anda
              </h1>
              <p className="font-[var(--font-inter)] text-[16px] leading-[1.6] text-[#5B6B82] max-w-xl mx-auto lg:mx-0">
                Manfaatkan kekuatan penilaian kredit alternatif berbasis AI untuk membuka pertumbuhan, memitigasi risiko, dan menyederhanakan pembiayaan logistik dengan wawasan yang dapat dijelaskan.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/dashboard" className="w-full sm:w-auto bg-[#003ADA] text-white px-8 py-4 rounded-full font-[var(--font-jakarta)] text-[18px] font-bold hover:shadow-xl hover:shadow-[#003ADA]/30 transition-all duration-300 flex items-center justify-center gap-2">
                  Lihat Demo
                  <span className="material-symbols-outlined">chevron_right</span>
                </Link>
                <a href="#features" className="w-full sm:w-auto border-2 border-[#003ADA] text-[#003ADA] px-8 py-4 rounded-full font-[var(--font-jakarta)] text-[18px] font-bold hover:bg-[#003ADA]/5 transition-all duration-300">
                  Pelajari Lebih Lanjut
                </a>
              </div>
              <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
                <div className="flex -space-x-3">
                  <img alt="Manajer logistik" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD41a89-5v1h2OxA83UOTIfULos7rU8CmrJV8E6numyMwheGhQZk5DJhwNl1K3C-IQR1BZii9gAi6ZAref92Efnjn1yDLyzhcxMMgJoGCcr9ZGebsydzY78fMZqvkdQTaLsTkJsAcHjRPyo3z5JHQaXAgmM6IQDTNq7KjYPb9pmxRDdmd1Q78VG1tZXDtBTiauMw-xC6l6h1BEtCCtQbP7E21NuJuXhS4jC--tkZng2_jzGePID-pJbzhZH3vdFAQNWeWl0rf27C68" />
                  <img alt="Eksekutif fintech" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD97ERc_y3bwHXf1Gi8AIxh1od-3WNGGoL7j8TcRvC6K-o8Zp1DvmKC1A04BZrjwFJpPau0kXenVQ0MgEhudIBRoAbfnXhK85Ng8pNO1wXSSey12yJXVLloNb_XNoyFsMoWgF77Dr_RsDCHmduNtAe2GQN9M5Z62SLnvmijxZFVBspS6Wv-E3fSai5pvvFG9E8ScqqbD5Hz97D97wJertTF4wJYDuHloVQM5Elg3LjL_S7GuaJ4SVh0eA3qB470TQjHL5dgeef0An4" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#003ada] flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                    EM
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-[#5B6B82]">Dipercaya oleh <span className="font-bold text-[#061649]">500+</span> Mitra Armada</p>
              </div>
            </div>
            <div className="relative animate-card opacity-0 translate-y-10 transition-all duration-700 delay-200 min-h-[380px] sm:min-h-[500px] w-full flex items-center justify-center order-1 lg:order-2">
              {/* Background Glows */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#003ADA]/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C5E1EF]/30 rounded-full blur-2xl -z-10"></div>

              {/* Scaling wrapper for cards */}
              <div className="relative w-full h-[380px] sm:h-[500px] flex items-center justify-center scale-[0.8] sm:scale-100 origin-center shrink-0">
                {/* Card 1: Data Input (Telematics) - Top-Left Layer */}
                <div className="absolute top-0 left-2 sm:left-0 w-[210px] sm:w-[280px] bg-white p-5 rounded-[20px] shadow-lg border border-[#E5EAF3] transform -rotate-6 hover:-rotate-2 transition-all duration-500 hover:scale-105 hover:z-20 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#003ADA]">
                      <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#747687] uppercase tracking-wider">Telematika Armada</p>
                      <h4 className="text-[13px] font-bold text-[#061649] truncate">Actros #992</h4>
                    </div>
                  </div>
                  
                  {/* Driver Avatar & Stats */}
                  <div className="flex items-center gap-3 bg-[#FAFAFC] p-2.5 rounded-xl border border-[#E5EAF3]/60 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#1FA463]/10 border border-[#1FA463]/20 flex items-center justify-center text-[16px] shrink-0 select-none">
                      👷
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-[#061649] truncate">Budi Santoso</p>
                      <p className="text-[9px] text-[#5B6B82]">Pengemudi Utama</p>
                    </div>
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#1FA463] animate-pulse"></div>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-[#5B6B82]">
                    <div className="flex justify-between">
                      <span>Jarak Tempuh:</span>
                      <span className="font-bold text-[#061649]">8.450 Km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kesehatan Mesin:</span>
                      <span className="font-bold text-[#1FA463]">98% (Optimal)</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: AI TrustScore Engine (Process) - Top-Right Layer */}
                <div className="absolute top-12 right-2 sm:right-0 w-[210px] sm:w-[280px] glass-card p-5 rounded-[20px] shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 hover:z-20 group">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[16px] select-none">🧠</span>
                    <h4 className="font-[var(--font-jakarta)] text-[13px] font-extrabold text-[#0029a1]">AI TrustScore Engine</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-[#0b1c30] mb-1">
                        <span>Rutin Servis (+45 Pts)</span>
                        <span className="text-[#1FA463]">85%</span>
                      </div>
                      <div className="w-full bg-[#003ADA]/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1FA463] h-full w-[85%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-[#0b1c30] mb-1">
                        <span>Utilisasi Armada (+28 Pts)</span>
                        <span className="text-[#1FA463]">92%</span>
                      </div>
                      <div className="w-full bg-[#003ADA]/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1FA463] h-full w-[92%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-[#0b1c30] mb-1">
                        <span>Tepat Waktu Bayar (+50 Pts)</span>
                        <span className="text-[#1FA463]">98%</span>
                      </div>
                      <div className="w-full bg-[#003ADA]/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1FA463] h-full w-[98%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Approved Financing & Credit (Output) - Bottom Layer */}
                <div className="absolute bottom-2 left-2 sm:left-12 w-[230px] sm:w-[320px] bg-gradient-to-br from-[#061649] to-[#003ADA] text-white p-5 rounded-[24px] shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-105 hover:z-30 group border border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[9px] font-semibold text-[#C5E1EF] uppercase tracking-wider">Skor & Limit Kredit</p>
                      <h3 className="font-[var(--font-jakarta)] text-[16px] font-extrabold mt-0.5 text-white">Institusional A+</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-[var(--font-jakarta)] text-[22px] font-extrabold text-[#1FA463] flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        842
                      </div>
                      <p className="text-[9px] text-[#C5E1EF] font-semibold">Skor Armada</p>
                    </div>
                  </div>

                  {/* Credit Limit Mockup */}
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 mb-4">
                    <p className="text-[9px] text-[#C5E1EF]">Limit Kredit Disetujui</p>
                    <p className="font-[var(--font-jakarta)] text-[18px] sm:text-[20px] font-extrabold tracking-tight mt-0.5 text-white">Rp 36 Miliar</p>
                  </div>

                  {/* Risk Officer Avatar */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[14px] select-none">
                      🤵
                    </div>
                    <div>
                      <p className="font-bold text-white text-[10px]">Marcus Sterling</p>
                      <p className="text-[8px] text-[#C5E1EF]">Petugas Risiko</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-[#1FA463]/20 border border-[#1FA463]/30 rounded-full text-[8px] font-bold text-[#1FA463] uppercase tracking-wider">
                      Disetujui
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tujuan Section */}
        <section className="py-24 bg-gradient-to-tr from-white to-[#EEF3FF]/50 relative overflow-hidden border-t border-[#E5EAF3]" id="tujuan">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#003ADA]/5 rounded-full blur-3xl"></div>
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column: Visual Mockup */}
              <div className="relative animate-card opacity-0 translate-y-10 transition-all duration-700 w-full flex items-center justify-center min-h-[350px]">
                {/* Main Card */}
                <div className="w-full max-w-[480px] bg-white p-8 rounded-[32px] border border-[#E5EAF3] shadow-xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#003ADA]/5 rounded-full blur-xl"></div>
                  
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-[#747687] uppercase tracking-wider">Metrik Dampak Utama</p>
                      <h4 className="text-xl font-bold text-[#061649]">Target Capaian Sistem</h4>
                    </div>
                    <span className="material-symbols-outlined text-[#003ADA] bg-[#EEF3FF] p-3 rounded-full">target</span>
                  </div>

                  <div className="space-y-6">
                    {/* Item 1 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-[#061649]">
                        <span>Akses Pendanaan Lebih Cepat</span>
                        <span className="text-[#003ADA]">10x Lebih Cepat</span>
                      </div>
                      <div className="w-full bg-[#E5EAF3] h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#003ADA] to-[#1FA463] h-full w-[95%]" />
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-[#061649]">
                        <span>Pengurangan Rasio Gagal Bayar</span>
                        <span className="text-[#1FA463]">-35% Risiko</span>
                      </div>
                      <div className="w-full bg-[#E5EAF3] h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#003ADA] to-[#1FA463] h-full w-[85%]" />
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-[#061649]">
                        <span>Transparansi Keputusan (AI Explainable)</span>
                        <span className="text-[#003ADA]">100% Terang</span>
                      </div>
                      <div className="w-full bg-[#E5EAF3] h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#003ADA] to-[#1FA463] h-full w-[100%]" />
                      </div>
                    </div>
                  </div>

                  {/* Micro stats banner */}
                  <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[20px] font-extrabold text-[#061649]">&lt; 24 Jam</p>
                      <p className="text-[10px] text-[#5B6B82] font-medium uppercase mt-0.5">Waktu Tinjauan</p>
                    </div>
                    <div>
                      <p className="text-[20px] font-extrabold text-[#1FA463]">Rp 370+ Miliar</p>
                      <p className="text-[10px] text-[#5B6B82] font-medium uppercase mt-0.5">Pendanaan Tersalurkan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Text Content */}
              <div className="space-y-8 animate-card opacity-0 translate-y-10 transition-all duration-700 delay-100">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EEF3FF] rounded-full text-[#003ADA] border border-[#C5E1EF]/30">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  <span className="text-[12px] font-semibold tracking-[0.05em] uppercase">TUJUAN STRATEGIS KAMI</span>
                </div>
                
                <h2 className="font-[var(--font-jakarta)] text-[32px] md:text-[40px] font-extrabold leading-tight tracking-[-0.02em] text-[#061649]">
                  Mewujudkan Keputusan Kredit Alternatif yang Adil & Transparan
                </h2>
                
                <p className="font-[var(--font-inter)] text-[16px] leading-[1.7] text-[#5B6B82]">
                  TrustFleet AI hadir dengan tujuan besar untuk mendemokrasikan pembiayaan industri logistik di Indonesia. Kami tidak hanya membuat penilaian risiko menjadi otomatis, tetapi juga berkeadilan melalui pengolahan data alternatif operasional yang nyata.
                </p>

                <div className="space-y-5 pt-4">
                  {/* Point 1 */}
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#1FA463] bg-[#1FA463]/10 p-2.5 rounded-full shrink-0">speed</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#061649] mb-1">Mempersingkat Proses Penilaian</h4>
                      <p className="text-xs text-[#5B6B82] leading-[1.6]">Mengganti proses audit manual yang memakan waktu berminggu-minggu menjadi kalkulasi alternatif instan kurang dari 24 jam.</p>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#003ADA] bg-[#003ADA]/10 p-2.5 rounded-full shrink-0">psychology</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#061649] mb-1">Mencegah Bias & Ketidakpastian</h4>
                      <p className="text-xs text-[#5B6B82] leading-[1.6]">Menggunakan kecerdasan AI transparan (Explainable AI) untuk menjelaskan secara rinci faktor di balik setiap angka skor kredit.</p>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#1FA463] bg-[#1FA463]/10 p-2.5 rounded-full shrink-0">trending_up</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#061649] mb-1">Mendorong Pertumbuhan Usaha Armada</h4>
                      <p className="text-xs text-[#5B6B82] leading-[1.6]">Membantu pemilik armada UD Trucks dengan rekam jejak operasional yang baik untuk mendapatkan modal pembiayaan tanpa hambatan.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-[#FAFAFC] relative overflow-hidden" id="features">
          {/* Decorative organic blob */}
          <div className="absolute -top-20 -right-40 w-[500px] h-[500px] bg-[#C5E1EF] rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-[#C5E1EF] rounded-full opacity-20 blur-2xl"></div>
          
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-6 py-2 border border-[#003ADA] text-[#003ADA] text-[11px] font-semibold tracking-[0.05em] uppercase rounded-full mb-4">
                DIPERCAYA OLEH PEMIMPIN INDUSTRI
              </span>
            </div>

            {/* Trusted brand logos row */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-16 bg-[#E5EAF3]/30 py-6 px-8 rounded-2xl md:rounded-full animate-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="flex items-center gap-2 text-[#5B6B82]">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
                <span className="font-bold text-xl font-[var(--font-jakarta)]">LogiTrack</span>
              </div>
              <div className="flex items-center gap-2 text-[#5B6B82]">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
                <span className="font-bold text-xl font-[var(--font-jakarta)]">NeoBank</span>
              </div>
              <div className="flex items-center gap-2 text-[#5B6B82]">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
                <span className="font-bold text-xl font-[var(--font-jakarta)]">PackFlow</span>
              </div>
              <div className="flex items-center gap-2 text-[#5B6B82]">
                <span className="material-symbols-outlined text-3xl">hub</span>
                <span className="font-bold text-xl font-[var(--font-jakarta)]">GlobalFleet</span>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-card opacity-0 translate-y-10 transition-all duration-700 delay-100">
              <h2 className="font-[var(--font-jakarta)] text-[36px] md:text-[48px] font-extrabold leading-tight tracking-[-0.02em] text-[#061649] mb-6">
                Dibangun untuk Ekosistem Logistik Modern
              </h2>
              <p className="font-[var(--font-inter)] text-[16px] leading-[1.6] text-[#5B6B82]">
                Kami menjembatani kesenjangan antara perbankan tradisional dan industri logistik yang bergerak cepat dengan intelijen yang bergerak secepat bisnis Anda.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-[22px] border border-[#E5EAF3] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden animate-card opacity-0 translate-y-10">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003ADA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-[52px] h-[52px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6">
                  <span className="material-symbols-outlined text-2xl">timer</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#061649] mb-4">
                  Penilaian Kredit Real-time
                </h3>
                <p className="font-[var(--font-inter)] text-[14px] leading-[1.6] text-[#5B6B82]">
                  Evaluasi instan kelayakan kredit armada menggunakan data operasional real-time, telematika, dan riwayat performa pembayaran.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-[22px] border border-[#E5EAF3] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden animate-card opacity-0 translate-y-10 delay-100">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003ADA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-[52px] h-[52px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6">
                  <span className="material-symbols-outlined text-2xl">psychology</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#061649] mb-4">
                  Wawasan AI yang Dapat Dijelaskan
                </h3>
                <p className="font-[var(--font-inter)] text-[14px] leading-[1.6] text-[#5B6B82]">
                  Tidak ada lagi keputusan kotak hitam. AI kami memberikan penjelasan yang jelas dan dapat ditindaklanjuti untuk setiap skor.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-[22px] border border-[#E5EAF3] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden animate-card opacity-0 translate-y-10 delay-200">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003ADA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-[52px] h-[52px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6">
                  <span className="material-symbols-outlined text-2xl">bar_chart_4_bars</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#061649] mb-4">
                  Analisis Risiko Armada
                </h3>
                <p className="font-[var(--font-inter)] text-[14px] leading-[1.6] text-[#5B6B82]">
                  Dasbor komprehensif yang memvisualisasikan profil risiko seluruh armada, memungkinkan intervensi proaktif sebelum masalah muncul.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cara Kerja Section */}
        <section className="py-24 bg-white border-t border-b border-[#E5EAF3] relative overflow-hidden" id="cara-kerja">
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#1FA463]/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="inline-flex items-center gap-2 px-6 py-2 border border-[#003ADA] text-[#003ADA] text-[11px] font-semibold tracking-[0.05em] uppercase rounded-full mb-4">
                PROSES 4 LANGKAH MUDAH
              </div>
              <h2 className="font-[var(--font-jakarta)] text-[36px] md:text-[44px] font-extrabold leading-tight tracking-[-0.02em] text-[#061649] mb-6">
                Bagaimana Sistem Kami Bekerja?
              </h2>
              <p className="font-[var(--font-inter)] text-[16px] leading-[1.6] text-[#5B6B82]">
                Sistem TrustFleet AI mengotomatisasi pengolahan data mentah armada menjadi penilaian kredit alternatif yang siap digunakan dalam 4 langkah terstruktur.
              </p>
            </div>

            {/* Step Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-[24px] border border-[#E5EAF3] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative group animate-card opacity-0 translate-y-10">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#003ADA] text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-[#FAFAFC] shadow-md group-hover:scale-110 transition-transform duration-300">
                  01
                </div>
                <div className="w-[56px] h-[56px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">database_upload</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[18px] font-bold text-[#061649] mb-3">
                  Integrasi Data Real-time
                </h3>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Sistem menghubungkan data telematika kendaraan, log servis resmi, dan volume pembelian suku cadang armada secara aman via API.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-[24px] border border-[#E5EAF3] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative group animate-card opacity-0 translate-y-10 delay-100">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#003ADA] text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-[#FAFAFC] shadow-md group-hover:scale-110 transition-transform duration-300">
                  02
                </div>
                <div className="w-[56px] h-[56px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">psychology</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[18px] font-bold text-[#061649] mb-3">
                  Pemrosesan Engine AI
                </h3>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Algoritma AI menganalisis parameter operasional, konsistensi rute, dan kebiasaan pembayaran untuk menghitung indeks risiko.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-[24px] border border-[#E5EAF3] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative group animate-card opacity-0 translate-y-10 delay-200">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#003ADA] text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-[#FAFAFC] shadow-md group-hover:scale-110 transition-transform duration-300">
                  03
                </div>
                <div className="w-[56px] h-[56px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">speed</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[18px] font-bold text-[#061649] mb-3">
                  Skor & Penjelasan AI
                </h3>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Dasbor memunculkan TrustScore (500-900) dan penjelasan terperinci mengenai pendorong naik-turunnya nilai kredit alternatif.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-8 rounded-[24px] border border-[#E5EAF3] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative group animate-card opacity-0 translate-y-10 delay-300">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#1FA463] text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-[#FAFAFC] shadow-md group-hover:scale-110 transition-transform duration-300">
                  04
                </div>
                <div className="w-[56px] h-[56px] bg-[#1FA463]/10 rounded-xl flex items-center justify-center text-[#1FA463] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[18px] font-bold text-[#061649] mb-3">
                  Persetujuan Kredit Instan
                </h3>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Tim Finance/Credit Analyst meninjau dasbor dan memberikan keputusan persetujuan kredit (Approve/Review/Decline) sekali klik.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Solutions Section - Compact 2x2 Grid */}
        <section className="py-20 bg-white" id="solutions">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 animate-card opacity-0 translate-y-10 transition-all duration-700">
              <div className="inline-flex items-center gap-2 px-6 py-2 border border-[#003ADA] text-[#003ADA] text-[11px] font-semibold tracking-[0.05em] uppercase rounded-full mb-4">
                SOLUSI NYATA
              </div>
              <h2 className="font-[var(--font-jakarta)] text-[32px] md:text-[36px] font-extrabold leading-tight tracking-[-0.02em] text-[#061649] mb-6">
                Solusi Kami untuk Masalah Nyata di Industri Logistik
              </h2>
              <p className="font-[var(--font-inter)] text-[16px] leading-[1.6] text-[#5B6B82] max-w-[520px] mx-auto">
                Kami memahami tantangan yang Anda hadapi. Inilah bagaimana TrustFleet AI menyelesaikan masalah tersebut.
              </p>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Card 1 */}
              <div className="bg-white rounded-[20px] border border-[#E5EAF3] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 animate-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[rgba(223,39,33,0.08)] rounded-xl flex items-center justify-center text-[#DF2721] shrink-0">
                    <span className="material-symbols-outlined text-2xl">schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#DF2721]/10 text-[#DF2721] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                      MASALAH
                    </span>
                    <h3 className="font-[var(--font-jakarta)] text-[15px] font-bold text-[#061649]">Penilaian Kredit Lambat & Tidak Akurat</h3>
                  </div>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82] mb-4">
                  Bank tradisional butuh berhari-hari, data historis tidak relevan
                </p>
                <div className="border-t border-dashed border-[#E5EAF3] mb-4"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-2xl text-[#1FA463]">check</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1FA463]/10 text-[#1FA463] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                    SOLUSI KAMI
                  </span>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Penilaian <span className="font-bold text-[#003ADA]">real-time</span> menggunakan data operasional armada (jarak, bahan bakar, telematika).
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-[20px] border border-[#E5EAF3] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 animate-card" style={{ transitionDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[rgba(223,39,33,0.08)] rounded-xl flex items-center justify-center text-[#DF2721] shrink-0">
                    <span className="material-symbols-outlined text-2xl">visibility_off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#DF2721]/10 text-[#DF2721] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                      MASALAH
                    </span>
                    <h3 className="font-[var(--font-jakarta)] text-[15px] font-bold text-[#061649]">Risiko Gagal Bayar Tidak Terlihat</h3>
                  </div>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82] mb-4">
                  Masalah keuangan baru terlihat setelah terlambat dihindari
                </p>
                <div className="border-t border-dashed border-[#E5EAF3] mb-4"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-2xl text-[#1FA463]">check</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1FA463]/10 text-[#1FA463] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                    SOLUSI KAMI
                  </span>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Deteksi tanda risiko hingga <span className="font-bold text-[#003ADA]">90 hari</span> sebelum terjadi dengan pemodelan prediktif.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-[20px] border border-[#E5EAF3] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 animate-card" style={{ transitionDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[rgba(223,39,33,0.08)] rounded-xl flex items-center justify-center text-[#DF2721] shrink-0">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#DF2721]/10 text-[#DF2721] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                      MASALAH
                    </span>
                    <h3 className="font-[var(--font-jakarta)] text-[15px] font-bold text-[#061649]">Keputusan Black Box Tidak Dipercaya</h3>
                  </div>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82] mb-4">
                  Tidak tahu mengapa skor diberikan, sulit dipakai dalam keputusan bisnis
                </p>
                <div className="border-t border-dashed border-[#E5EAF3] mb-4"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-2xl text-[#1FA463]">check</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1FA463]/10 text-[#1FA463] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                    SOLUSI KAMI
                  </span>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  AI memberikan penjelasan <span className="font-bold text-[#003ADA]">transparan</span> setiap skor — faktor apa yang berkontribusi dan cara meningkatkannya.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-[20px] border border-[#E5EAF3] p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 animate-card" style={{ transitionDelay: '300ms' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[rgba(223,39,33,0.08)] rounded-xl flex items-center justify-center text-[#DF2721] shrink-0">
                    <span className="material-symbols-outlined text-2xl">dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#DF2721]/10 text-[#DF2721] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                      MASALAH
                    </span>
                    <h3 className="font-[var(--font-jakarta)] text-[15px] font-bold text-[#061649]">Data Tersebar di Berbagai Platform</h3>
                  </div>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82] mb-4">
                  Info armada tersebar di telematika, ERP, dan perbankan berbeda
                </p>
                <div className="border-t border-dashed border-[#E5EAF3] mb-4"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-2xl text-[#1FA463]">check</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1FA463]/10 text-[#1FA463] text-[10px] font-semibold tracking-[0.05em] uppercase rounded-full">
                    SOLUSI KAMI
                  </span>
                </div>
                <p className="font-[var(--font-inter)] text-[13px] leading-[1.6] text-[#5B6B82]">
                  Integrasi dinamis jadi satu <span className="font-bold text-[#003ADA]">dasbor terpadu</span> — pandangan lengkap kesehatan kredit armada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-[#FAFAFC]" id="about-section">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-card">
              <h2 className="font-[var(--font-jakarta)] text-[36px] md:text-[40px] font-extrabold leading-tight tracking-[-0.02em] text-[#061649] mb-6">Tentang TrustFleet AI</h2>
              <p className="font-[var(--font-inter)] text-[16px] leading-[1.6] text-[#5B6B82]">Kami adalah tim yang berfokus pada inovasi keuangan untuk industri logistik. Berdiri dengan visi untuk membuat pembiayaan logistik lebih adil, cepat, dan transparan.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[22px] border border-[#E5EAF3] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden animate-card">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003ADA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-[52px] h-[52px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6">
                  <span className="material-symbols-outlined text-2xl">lightbulb</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#061649] mb-4">Visi Kami</h3>
                <p className="font-[var(--font-inter)] text-[14px] leading-[1.6] text-[#5B6B82]">Menjadi platform intelijen kredit terpercaya untuk ekosistem logistik Asia Tenggara, memungkinkan setiap bisnis logistik berkembang tanpa batasan keuangan.</p>
              </div>
              <div className="bg-white p-8 rounded-[22px] border border-[#E5EAF3] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden animate-card" style={{ transitionDelay: '100ms' }}>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003ADA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-[52px] h-[52px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6">
                  <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#061649] mb-4">Misi Kami</h3>
                <p className="font-[var(--font-inter)] text-[14px] leading-[1.6] text-[#5B6B82]">Memberdayakan bisnis logistik dan lembaga keuangan dengan teknologi AI untuk membuat keputusan kredit yang lebih baik, lebih cepat, dan lebih adil.</p>
              </div>
              <div className="bg-white p-8 rounded-[22px] border border-[#E5EAF3] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden animate-card" style={{ transitionDelay: '200ms' }}>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003ADA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-[52px] h-[52px] bg-[#EEF3FF] rounded-xl flex items-center justify-center text-[#003ADA] mb-6">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#061649] mb-4">Nilai Kami</h3>
                <p className="font-[var(--font-inter)] text-[14px] leading-[1.6] text-[#5B6B82]">Kepercayaan, inovasi, transparansi, dan dampak positif adalah pilar utama dalam setiap keputusan dan produk yang kami buat.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-[#FAFAFC]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="bg-gradient-to-br from-[#061649] to-[#003ADA] rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden animate-card">
              {/* Decorative Blobs */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#C5E1EF]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1FA463]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
                <h2 className="font-[var(--font-jakarta)] text-[40px] md:text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">Siap Mentransformasi Strategi Armada Anda?</h2>
                <p className="font-[var(--font-inter)] text-[16px] leading-[1.6] text-[#C5E1EF]/90 max-w-2xl mx-auto">Bergabunglah dengan institusi keuangan terkemuka dan perusahaan logistik yang mempercayai TrustFleet AI untuk menavigasi kompleksitas intelijen kredit modern.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                  <Link href="/dashboard" className="bg-white text-[#061649] px-10 py-4 rounded-full font-[var(--font-jakarta)] text-[18px] font-bold hover:bg-[#C5E1EF] transition-all duration-300 shadow-xl">
                    Mulai Uji Coba Gratis Anda
                  </Link>
                  <button className="text-white border border-white/30 px-10 py-4 rounded-full font-[var(--font-jakarta)] text-[18px] font-bold hover:bg-white/10 transition-all duration-300">
                    Hubungi Penjualan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#061649] pt-20 pb-10" id="about">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative bg-white rounded-lg p-1">
                  <Image
                    src="/logo/TrustFleetAILogoNavy.png"
                    alt="TrustFleet AI Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-[var(--font-inter)] font-bold text-lg text-white">TrustFleet AI</p>
                  <p className="text-[11px] text-[#C5E1EF]">Intelegensi Fintech</p>
                </div>
              </div>
              <p className="font-[var(--font-inter)] text-[14px] text-[#C5E1EF] leading-relaxed">
                Kecerdasan Fintech untuk Masa Depan Logistik. Membangun kepercayaan melalui data yang dapat dijelaskan dan AI yang kuat.
              </p>
              <div className="flex items-center gap-4">
                <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#003ADA] transition-all duration-300" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43a2.06 2.06 0 110-4.11 2.06 2.06 0 010 4.11zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"></path></svg>
                </a>
                <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#003ADA] transition-all duration-300" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-white mb-6">Produk</h4>
              <ul className="space-y-3">
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#features">Fitur</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Model Kredit</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">API Risiko</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Dasbor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-white mb-6">Perusahaan</h4>
              <ul className="space-y-3">
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#about-section">Tentang</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Karir</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Berita</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-jakarta)] text-[20px] font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Kebijakan Privasi</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Syarat Layanan</a></li>
                <li><a className="text-[#C5E1EF] hover:text-white transition-colors duration-300" href="#">Keamanan</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] font-semibold text-[#C5E1EF]">© 2024 TrustFleet AI Inc. Hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#1FA463]">
                <span className="w-2 h-2 rounded-full bg-[#1FA463] animate-pulse"></span>
                Sistem Operasional
              </span>
              <button className="text-[12px] font-bold text-white hover:underline">Bahasa Indonesia</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
