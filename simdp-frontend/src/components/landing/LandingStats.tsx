import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Stats {
  total_karyawan: number;
  total_divisi: number;
  total_unit: number;
  jumlah_pria: number;
  jumlah_wanita: number;
  updated_at: string;
}

export const LandingStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getLandingStats();
        if (res.success) {
          setStats(res.data as Stats);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a7a]"></div>
        <p className="text-sm text-slate-500 mt-2 font-medium">Memuat statistik...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-400 font-semibold text-lg">—</p>
        <p className="text-xs text-slate-400 font-semibold mt-1">Data tidak tersedia saat ini</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Karyawan', value: stats.total_karyawan, color: 'bg-blue-50 text-[#0f2557]', icon: '👥' },
    { label: 'Total Divisi', value: stats.total_divisi, color: 'bg-indigo-50 text-indigo-800', icon: '🏢' },
    { label: 'Total Unit Kerja', value: stats.total_unit, color: 'bg-sky-50 text-sky-800', icon: '🛠️' },
    { label: 'Laki-Laki', value: stats.jumlah_pria, color: 'bg-slate-50 text-slate-800', icon: '🧔' },
    { label: 'Perempuan', value: stats.jumlah_wanita, color: 'bg-rose-50 text-rose-800', icon: '🧕' }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Kapasitas Organisasi Kami</h2>
        <p className="text-sm text-slate-500 font-medium mt-2">Statistik riil karyawan aktif di LAZWaf Al Azhar saat ini</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`animate-fade-in-up p-5 sm:p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${card.color} ${i === 0 ? 'col-span-2 sm:col-span-1' : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="text-2xl mb-3 block">{card.icon}</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold block mb-1 tracking-tight">{card.value}</span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
