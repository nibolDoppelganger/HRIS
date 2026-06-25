import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface RecruitmentInfo {
  is_open: boolean;
  info: string;
  divisi_tersedia: string[];
}

export const RecruitmentBanner: React.FC = () => {
  const [rec, setRec] = useState<RecruitmentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRec = async () => {
      try {
        const res = await api.getRecruitmentStatus();
        if (res.success) {
          setRec(res.data as RecruitmentInfo);
        }
      } catch (e) {}
      finally {
        setLoading(false);
      }
    };
    fetchRec();
  }, []);

  if (loading || !rec || !rec.is_open) return null;

  return (
    <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-fade-in-up bg-[#0053d0] text-white rounded-[32px] p-6 sm:p-8 md:p-12 shadow-xl shadow-blue-500/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute left-12 -top-12 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-float delay-500"></div>
        
        <div className="relative max-w-3xl flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md">
            🌟 Open Recruitment Amil Zakat
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Mari Bergabung & Mengabdi Bersama Kami!
          </h2>
          <p className="text-blue-100/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl">
            {rec.info}. Kami membuka kesempatan bagi Anda untuk berkontribusi di divisi: <strong className="font-extrabold text-white">{rec.divisi_tersedia.join(', ')}</strong>.
          </p>
          <div className="flex gap-4 mt-4 w-full sm:w-auto">
            <a
              href="/rekrutmen"
              className="px-8 py-4 text-sm sm:text-base font-bold text-[#0053d0] bg-white hover:bg-blue-50 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto text-center"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
