import React from 'react';

interface Props {
  tagline: string;
  deskripsi: string;
}

export const LandingHero: React.FC<Props> = ({ tagline, deskripsi }) => {
  return (
    <section className="relative overflow-hidden bg-white text-[#0b1c30] py-24 sm:py-32 border-b border-blue-50/50">
      {/* Decorative animated background elements */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0053d0_1px,transparent_1px),linear-gradient(to_bottom,#0053d0_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#0053d0]/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-float delay-300"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <span className="animate-fade-in-down inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-50 text-[#0053d0] border border-blue-100 mb-8 backdrop-blur-md">
          Portal Resmi SIM Karyawan & Amil Zakat
        </span>
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight text-[#0b1c30]">
          {tagline}
        </h1>
        <p className="animate-fade-in-up delay-200 text-base sm:text-lg md:text-xl text-[#737686] max-w-2xl font-medium mb-10 leading-relaxed">
          {deskripsi}
        </p>
        <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto">
          <a
            href="/rekrutmen"
            className="px-8 py-4 text-base font-bold text-white bg-[#0053d0] hover:bg-blue-700 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto text-center"
          >
            Daftar Menjadi Amil Zakat Baru
          </a>
        </div>
      </div>
    </section>
  );
};
