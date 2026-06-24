import React from 'react';

interface Props {
  tagline: string;
  deskripsi: string;
}

export const LandingHero: React.FC<Props> = ({ tagline, deskripsi }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2557] to-[#1e3a7a] text-white py-24 sm:py-32 shadow-2xl animate-gradient" style={{ backgroundSize: '200% 200%' }}>
      {/* Decorative animated background elements */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float delay-300"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <span className="animate-fade-in-down inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-400/15 text-blue-200 border border-blue-400/20 mb-8 backdrop-blur-md">
          🟢 Portal Resmi SIM Karyawan & Relawan
        </span>
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
          {tagline}
        </h1>
        <p className="animate-fade-in-up delay-200 text-base sm:text-lg md:text-xl text-blue-100/80 max-w-2xl font-light mb-10 leading-relaxed">
          {deskripsi}
        </p>
        <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto">
          <a
            href="/rekrutmen"
            className="px-6 py-3.5 text-base font-bold text-[#0f2557] bg-white hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto text-center"
          >
            Gabung Relawan ➔
          </a>
          <a
            href="/login"
            className="px-6 py-3.5 text-base font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-md w-full sm:w-auto text-center"
          >
            Masuk ke Aplikasi
          </a>
        </div>
      </div>
    </section>
  );
};
