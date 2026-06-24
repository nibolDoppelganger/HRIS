import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { StatWidget } from '../shared/StatWidget';
import { Users, UserCheck, Clock, ShieldAlert, BadgeInfo, CalendarDays, TrendingUp } from 'lucide-react';

interface DashboardStats {
  total_aktif: number;
  total_tetap: number;
  total_kontrak: number;
  total_relawan: number;
  jk_pria: number;
  jk_wanita: number;
  per_divisi: { nama: string; jumlah: number }[];
  per_unit: { nama: string; jumlah: number }[];
  per_level: { level: string; jumlah: number }[];
  kontrak_30_hari: number;
  join_bulan_ini: number;
  ultah_minggu_ini: number;
  rekrutmen_baru: number;
  rata_rata_usia: number;
  updated_at: string;
}

export const WidgetGrid: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const resStats = await api.getDashboardStats();
        const resEmp = await api.getEmployeesList();
        if (resStats.success) setStats(resStats.data as DashboardStats);
        if (resEmp.success) setEmployees(resEmp.data);
      } catch (e) {}
      finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
        <p className="font-body text-sm text-neutral-500 mt-4 font-medium">Memuat statistik internal...</p>
      </div>
    );
  }

  if (!stats) return null;

  // Filter employees expiring soon
  const today = new Date();
  const expiringEmployees = employees.filter(e => {
    if (!e.is_active || e.employment_status !== 'Kontrak' || !e.contract_end_date) return false;
    const diffDays = Math.round((new Date(e.contract_end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  // Filter birthdays this month
  const thisMonth = today.getMonth();
  const birthdayEmployees = employees.filter(e => {
    if (!e.is_active || !e.date_of_birth) return false;
    return new Date(e.date_of_birth).getMonth() === thisMonth;
  });

  // SVG Donut Chart helper for gender
  const renderDonutChart = (pria: number, wanita: number) => {
    const total = pria + wanita;
    if (total === 0) return null;
    const priaPct = (pria / total) * 100;
    const wanitaPct = (wanita / total) * 100;
    const circumference = 251.33;
    const priaDash = (priaPct / 100) * circumference;
    const wanitaDash = (wanitaPct / 100) * circumference;

    return (
      <div className="flex items-center gap-6">
        <svg width="120" height="120" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke="#1A6BDB" strokeWidth="12"
            strokeDasharray={`${priaDash} ${circumference - priaDash}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke="#10B981" strokeWidth="12"
            strokeDasharray={`${wanitaDash} ${circumference - wanitaDash}`}
            strokeDashoffset={`${-priaDash}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="46" textAnchor="middle" className="fill-neutral-950 font-display font-bold" style={{ fontSize: '18px' }}>{total}</text>
          <text x="50" y="60" textAnchor="middle" className="fill-neutral-500 font-display font-medium" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>TOTAL</text>
        </svg>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
            <div>
              <span className="text-xs font-semibold text-neutral-800 block">Pria</span>
              <span className="text-[11px] text-neutral-500 font-medium">{pria} orang ({Math.round(priaPct)}%)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success-600"></div>
            <div>
              <span className="text-xs font-semibold text-neutral-800 block">Wanita</span>
              <span className="text-[11px] text-neutral-500 font-medium">{wanita} orang ({Math.round(wanitaPct)}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-bold text-neutral-950">Ringkasan Sistem</h2>
          <p className="text-sm font-body text-neutral-600">Overview data kepegawaian hari ini</p>
        </div>
        <div className="text-xs font-body text-neutral-500">
          Diperbarui: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget 
          title="Total Karyawan Aktif" 
          value={stats.total_aktif} 
          icon={Users} 
          variant="primary" 
        />
        <StatWidget 
          title="Karyawan Tetap" 
          value={stats.total_tetap} 
          icon={UserCheck} 
          variant="success" 
        />
        <StatWidget 
          title="Karyawan Kontrak" 
          value={stats.total_kontrak} 
          icon={Clock} 
          variant="warning" 
        />
        <StatWidget 
          title="Karyawan Relawan" 
          value={stats.total_relawan} 
          icon={BadgeInfo} 
          variant="neutral" 
        />
      </div>

      {/* Charts Row: Gender + Status + Avg Age */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Donut Chart */}
        <div className="bg-white rounded-[10px] border border-neutral-200 p-5 shadow-xs">
          <h3 className="font-display font-bold text-neutral-950 text-[15px] mb-1">Jenis Kelamin</h3>
          <p className="text-xs text-neutral-500 font-body mb-6">Distribusi pria & wanita</p>
          {renderDonutChart(stats.jk_pria, stats.jk_wanita)}
        </div>

        {/* Employment Status Bar Chart */}
        <div className="bg-white rounded-[10px] border border-neutral-200 p-5 shadow-xs">
          <h3 className="font-display font-bold text-neutral-950 text-[15px] mb-1">Status Kepegawaian</h3>
          <p className="text-xs text-neutral-500 font-body mb-6">Komposisi status pekerja</p>
          <div className="space-y-4.5">
            {[
              { label: 'Tetap', value: stats.total_tetap, color: 'bg-success-600' },
              { label: 'Kontrak', value: stats.total_kontrak, color: 'bg-warning-500' },
              { label: 'Relawan', value: stats.total_relawan, color: 'bg-neutral-chip-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[13px] font-semibold text-neutral-800">{item.label}</span>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-neutral-950">{item.value}</span>
                    <span className="text-[11px] text-neutral-500 ml-1">
                      ({stats.total_aktif > 0 ? Math.round((item.value / stats.total_aktif) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{ width: stats.total_aktif > 0 ? `${(item.value / stats.total_aktif) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Age + Quick Stats */}
        <div className="bg-white rounded-[10px] border border-neutral-200 p-5 shadow-xs">
          <h3 className="font-display font-bold text-neutral-950 text-[15px] mb-1">Statistik Usia</h3>
          <p className="text-xs text-neutral-500 font-body mb-6">Rata-rata usia karyawan</p>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-[100px] h-[100px] flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 100 100" className="absolute inset-0">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#1A6BDB" strokeWidth="8"
                  strokeDasharray={`${Math.min(stats.rata_rata_usia / 65 * 263.89, 263.89)} 263.89`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-[28px] font-display font-bold text-neutral-950 block leading-none tracking-tight">{stats.rata_rata_usia}</span>
                <span className="text-[9px] font-display font-semibold text-neutral-500 uppercase tracking-widest mt-0.5">Tahun</span>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-neutral-100 w-full space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-success-600" />
                  Baru bergabung (Bulan ini)
                </span>
                <span className="text-[13px] font-bold text-neutral-950">{stats.join_bulan_ini}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Alert Widgets and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alerts (Contracts & Birthdays) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expiring Contracts Alert */}
          <div className="bg-white rounded-[10px] border border-neutral-200 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-neutral-950 text-[15px]">Peringatan Kontrak Habis</h3>
                  <p className="text-xs text-neutral-500 font-body mt-0.5">Berakhir dalam waktu 30 hari ke depan</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-danger-50 text-xs font-semibold text-danger-600">
                {expiringEmployees.length} Karyawan
              </span>
            </div>
            
            {expiringEmployees.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck size={24} />
                </div>
                <p className="text-sm text-neutral-600 font-medium">Semua kontrak aman untuk 30 hari ke depan.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto pr-2">
                {expiringEmployees.map((e, idx) => {
                  const diffDays = Math.round((new Date(e.contract_end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 group hover:bg-neutral-50 px-2 -mx-2 rounded transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-xs">
                          {e.full_name[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-950 text-[13px] block">{e.full_name}</span>
                          <span className="text-[11px] text-neutral-500 block">{e.current_position} • {e.departement}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-danger-600 text-[13px] block">{diffDays} Hari Lagi</span>
                        <span className="text-[11px] text-neutral-500 block">Hingga {e.contract_end_date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Division Breakdown */}
          <div className="bg-white rounded-[10px] border border-neutral-200 p-5 shadow-xs">
            <h3 className="font-display font-bold text-neutral-950 text-[15px] mb-5">Penyebaran Karyawan per Divisi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {stats.per_divisi.map((div, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-700">{div.nama}</span>
                    <span className="font-bold text-neutral-950">{div.jumlah}</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-blue h-full rounded-full" 
                      style={{ width: `${(div.jumlah / stats.total_aktif) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summaries & Quick Links */}
        <div className="space-y-6">
          
          {/* Birthday List Widget */}
          <div className="bg-white rounded-[10px] border border-neutral-200 p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-info-50 text-info-600 flex items-center justify-center">
                <CalendarDays size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-neutral-950 text-[15px]">Ulang Tahun Bulan Ini</h3>
              </div>
            </div>

            {birthdayEmployees.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500">Tidak ada karyawan yang berulang tahun bulan ini.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {birthdayEmployees.map((e, idx) => {
                  const bdayDate = new Date(e.date_of_birth);
                  const formattedBday = bdayDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
                  return (
                    <div key={idx} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full border border-neutral-200 flex items-center justify-center text-lg shadow-sm">
                        🎂
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-950 text-[13px] block">{e.full_name}</span>
                        <span className="text-[11px] text-neutral-500 block">{formattedBday}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recruitment Widget */}
          <div className="bg-brand-navy text-white rounded-[10px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center gap-2 text-brand-gold mb-3">
                <BadgeInfo size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Rekrutmen Baru</span>
              </div>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-[40px] font-display font-bold leading-none">{stats.rekrutmen_baru}</span>
                <span className="text-[13px] text-white/70 font-medium">Pendaftar <br/>menunggu proses</span>
              </div>
              <a
                href="/rekrutmen-admin"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-brand-navy font-bold rounded-md text-[13px] shadow-sm hover:bg-neutral-50 transition-colors"
              >
                Buka Panel Rekrutmen
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
