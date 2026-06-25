import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const PerformancePanel: React.FC = () => {
  const session = useStore($userSession);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'idp' | 'evaluasi'>('ringkasan');

  const tabs = [
    { id: 'ringkasan', label: 'Ringkasan Nilai', icon: 'bar_chart' },
    { id: 'idp', label: 'Individual Development Plan', icon: 'psychology' },
    { id: 'evaluasi', label: 'Siklus Evaluasi', icon: 'event_repeat' },
  ] as const;

  const mockHistory = [
    { period: 'Semester 2 - 2025', score: 88, grade: 'A', status: 'Selesai', reviewer: 'Ahmad S.' },
    { period: 'Semester 1 - 2025', score: 85, grade: 'A-', status: 'Selesai', reviewer: 'Ahmad S.' },
    { period: 'Semester 2 - 2024', score: 78, grade: 'B', status: 'Selesai', reviewer: 'Fatimah Z.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Penilaian Kinerja</h2>
          <p className="text-xs text-[#737686] mt-0.5">Manajemen talenta, evaluasi periodik, dan perencanaan karir.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-x-auto scroll-hidden border border-blue-50/50 p-2">
        <div className="flex min-w-max gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-[14px] font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#0053d0] text-white shadow-sm"
                  : "text-[#737686] hover:text-[#0b1c30] hover:bg-blue-50/40"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'ringkasan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#0053d0] to-blue-800 rounded-[24px] shadow-sm p-8 text-white relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
              <h3 className="font-sans text-[10px] text-blue-100 font-bold uppercase tracking-wider bg-black/10 inline-block px-4 py-1.5 rounded-full mb-6">
                NILAI TERAKHIR
              </h3>
              <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 border-8 border-emerald-400 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 88%)' }}></div>
                <span className="text-4xl font-extrabold z-10">88</span>
              </div>
              <p className="text-xl font-bold mb-1">Sangat Baik (A)</p>
              <p className="text-xs text-blue-200">Semester 2 - 2025</p>
            </div>
            
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
              <h4 className="font-bold text-sm text-[#0b1c30] mb-4">Rekomendasi HR</h4>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">trending_up</span>
                <div>
                  <p className="font-bold text-xs text-emerald-800">Promosi Tersedia</p>
                  <p className="text-[10px] text-emerald-700 mt-1 leading-relaxed">Karyawan ini telah mempertahankan nilai A selama 2 semester berturut-turut. Memenuhi syarat untuk kenaikan level karir.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden">
              <div className="p-6 border-b border-blue-50/50 bg-[#f8f9ff]/50">
                <h3 className="font-bold text-sm text-[#0b1c30]">Riwayat Penilaian Semesteran</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                      <th className="px-6 py-4">Periode</th>
                      <th className="px-6 py-4">Skor Akhir</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Penilai (Atasan)</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50/40">
                    {mockHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#eff4ff]/20">
                        <td className="px-6 py-4 font-bold text-[#0b1c30]">{item.period}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#0053d0]">{item.score}/100</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            item.grade.includes('A') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            Grade {item.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#434654]">{item.reviewer}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[10px] font-bold text-[#0053d0] bg-[#eff4ff] hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'idp' && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-16 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0053d0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <h3 className="font-sans text-lg font-extrabold text-[#0b1c30]">Individual Development Plan (IDP)</h3>
          <p className="text-sm text-[#737686] mt-2 max-w-md mx-auto">Modul perencanaan target pribadi dan pengembangan karir karyawan masih dalam tahap penyempurnaan.</p>
        </div>
      )}

      {activeTab === 'evaluasi' && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-16 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0053d0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">event_repeat</span>
          </div>
          <h3 className="font-sans text-lg font-extrabold text-[#0b1c30]">Siklus Evaluasi Kinerja</h3>
          <p className="text-sm text-[#737686] mt-2 max-w-md mx-auto">Pengaturan jadwal *self-assessment* dan penilaian atasan akan segera hadir.</p>
        </div>
      )}
    </div>
  );
};
