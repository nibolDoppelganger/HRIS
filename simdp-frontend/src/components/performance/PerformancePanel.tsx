import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const PerformancePanel: React.FC = () => {
  const session = useStore($userSession);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'idp' | 'evaluasi'>('ringkasan');
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showEvaluasiModal, setShowEvaluasiModal] = useState(false);

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

  const mockIDP = [
    { id: 1, kompetensi: 'Kepemimpinan Efektif', kategori: 'Soft Skill', targetDate: 'Des 2026', progress: 75, status: 'On Track' },
    { id: 2, kompetensi: 'Analisis Data & Reporting', kategori: 'Hard Skill', targetDate: 'Okt 2026', progress: 40, status: 'Needs Attention' },
    { id: 3, kompetensi: 'Sertifikasi Amil Zakat Dasar', kategori: 'Sertifikasi', targetDate: 'Agu 2026', progress: 100, status: 'Completed' },
  ];

  const mockEvaluasi = [
    { id: 1, periode: 'Semester 1 - 2026', tahap: 'Self Assessment', dueDate: '2026-06-30', status: 'Pending Action' },
    { id: 2, periode: 'Semester 2 - 2025', tahap: '1-on-1 Review', dueDate: '2025-12-31', status: 'Completed' },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden">
              <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/50">
                <h3 className="font-bold text-sm text-[#0b1c30]">Target Pengembangan (IDP)</h3>
                <button 
                  onClick={() => setShowTargetModal(true)}
                  className="text-xs font-bold text-white bg-[#0053d0] hover:bg-blue-700 px-4 py-2 rounded-full shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">add</span> Tambah Target
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                      <th className="px-6 py-4">Kompetensi Target</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Target Selesai</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50/40">
                    {mockIDP.map(idp => (
                      <tr key={idp.id} className="hover:bg-[#eff4ff]/20">
                        <td className="px-6 py-4 font-bold text-[#0b1c30]">{idp.kompetensi}</td>
                        <td className="px-6 py-4 text-[#434654]">{idp.kategori}</td>
                        <td className="px-6 py-4 text-[#737686]">{idp.targetDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full h-1.5 bg-blue-50 rounded-full overflow-hidden max-w-[80px]">
                              <div className={`h-full rounded-full ${idp.progress === 100 ? 'bg-emerald-500' : 'bg-[#0053d0]'}`} style={{ width: `${idp.progress}%` }}></div>
                            </div>
                            <span className="font-bold text-[10px] text-[#0b1c30]">{idp.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            idp.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            idp.status === 'Needs Attention' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-blue-50 text-[#0053d0] border-blue-100'
                          }`}>
                            {idp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
                <h4 className="font-bold text-sm text-[#0b1c30] mb-4">Mentor IDP</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f8f9ff] flex items-center justify-center font-bold text-[#0053d0] border border-blue-100">
                    AM
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0b1c30]">Ahmad Maulana</p>
                    <p className="text-xs text-[#737686]">Kepala Divisi Sekretariat</p>
                  </div>
                </div>
                <button className="w-full text-xs font-bold text-[#0053d0] bg-[#eff4ff] hover:bg-blue-100 py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">chat</span> Chat Mentor
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'evaluasi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvaluasi.map((evaluasi) => (
            <div key={evaluasi.id} className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6 flex flex-col h-full relative overflow-hidden">
              {evaluasi.status === 'Pending Action' && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${evaluasi.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#0053d0]'}`}>
                  <span className="material-symbols-outlined">{evaluasi.status === 'Completed' ? 'check_circle' : 'pending_actions'}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  evaluasi.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {evaluasi.status}
                </span>
              </div>
              <h3 className="font-bold text-[#0b1c30] text-lg mb-1">{evaluasi.periode}</h3>
              <p className="text-[#434654] text-xs font-semibold mb-1">Tahap Aktif: {evaluasi.tahap}</p>
              <p className="text-[#737686] text-[10px] mb-6">Batas waktu pengisian: {evaluasi.dueDate}</p>
              
              <div className="mt-auto pt-4 border-t border-blue-50/50">
                {evaluasi.status === 'Pending Action' ? (
                  <button 
                    onClick={() => setShowEvaluasiModal(true)}
                    className="w-full text-xs font-bold text-white bg-[#0053d0] hover:bg-blue-700 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20">
                    Mulai Isi Form Evaluasi
                  </button>
                ) : (
                  <button className="w-full text-xs font-bold text-[#0053d0] bg-[#eff4ff] hover:bg-blue-100 py-2.5 rounded-xl transition-colors">
                    Lihat Hasil Akhir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Target IDP */}
      {showTargetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-xl border border-blue-50 w-full max-w-lg overflow-hidden transform transition-all">
            <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/80">
              <h3 className="font-bold text-lg text-[#0b1c30]">Tambah Target IDP</h3>
              <button onClick={() => setShowTargetModal(false)} className="text-[#737686] hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">Kompetensi Target <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] transition-colors bg-[#f8f9ff]/50" placeholder="Contoh: Public Speaking" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">Kategori <span className="text-red-500">*</span></label>
                  <select className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] transition-colors bg-[#f8f9ff]/50">
                    <option>Soft Skill</option>
                    <option>Hard Skill</option>
                    <option>Sertifikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">Bulan Target <span className="text-red-500">*</span></label>
                  <input type="month" className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] transition-colors bg-[#f8f9ff]/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">Langkah Pencapaian</label>
                <textarea className="w-full border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] transition-colors bg-[#f8f9ff]/50" rows={3} placeholder="Apa yang akan Anda lakukan untuk mencapai target ini?"></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-blue-50/50 bg-[#f8f9ff]/30 flex justify-end gap-3">
              <button onClick={() => setShowTargetModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs text-[#434654] hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={() => setShowTargetModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0053d0] hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all">Simpan Target</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Evaluasi */}
      {showEvaluasiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-xl border border-blue-50 w-full max-w-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/80">
              <div>
                <h3 className="font-bold text-lg text-[#0b1c30]">Form Self-Assessment</h3>
                <p className="text-xs text-[#737686]">Periode: Semester 1 - 2026</p>
              </div>
              <button onClick={() => setShowEvaluasiModal(false)} className="text-[#737686] hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="space-y-3 border-b border-blue-50/50 pb-5">
                <label className="block text-sm font-bold text-[#0b1c30]">1. Pencapaian Utama (Top Achievement) <span className="text-red-500">*</span></label>
                <p className="text-xs text-[#737686]">Sebutkan pencapaian terbaik Anda pada periode ini yang berdampak pada organisasi.</p>
                <textarea className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] transition-colors bg-[#f8f9ff]/50" rows={3} placeholder="Contoh: Berhasil meningkatkan efisiensi proses X sebesar 20%..."></textarea>
              </div>
              
              <div className="space-y-3 border-b border-blue-50/50 pb-5">
                <label className="block text-sm font-bold text-[#0b1c30]">2. Area Peningkatan (Area of Improvement) <span className="text-red-500">*</span></label>
                <p className="text-xs text-[#737686]">Sebutkan keterampilan atau proses kerja yang masih perlu Anda tingkatkan.</p>
                <textarea className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] transition-colors bg-[#f8f9ff]/50" rows={3} placeholder="Contoh: Perlu lebih baik dalam manajemen waktu saat deadline padat..."></textarea>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#0b1c30]">3. Rating Diri Sendiri <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {['Sangat Kurang', 'Kurang', 'Cukup', 'Baik', 'Sangat Baik'].map((rating, idx) => (
                    <label key={rating} className="flex-1 cursor-pointer">
                      <input type="radio" name="self-rating" className="peer sr-only" />
                      <div className="w-full text-center px-2 py-3 rounded-xl border border-blue-100 text-xs font-bold text-[#434654] peer-checked:bg-blue-50 peer-checked:text-[#0053d0] peer-checked:border-[#0053d0] transition-all hover:bg-gray-50">
                        <div className="mb-1 text-lg">{idx + 1}</div>
                        {rating}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-blue-50/50 bg-[#f8f9ff]/30 flex justify-end gap-3 mt-auto">
              <button onClick={() => setShowEvaluasiModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs text-[#0053d0] hover:bg-blue-50 transition-colors border border-blue-100 bg-white">Simpan Draft</button>
              <button onClick={() => setShowEvaluasiModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0053d0] hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2">
                Kirim ke Atasan <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
