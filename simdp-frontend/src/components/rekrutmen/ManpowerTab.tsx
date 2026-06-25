import React, { useState } from 'react';

interface ManpowerPlan {
  id: string;
  periode: string;
  departemen: string;
  posisi: string;
  jumlah_kebutuhan: number;
  status: 'Ditinjau' | 'Disetujui' | 'Ditolak';
  diajukan_oleh: string;
}

const mockPlans: ManpowerPlan[] = [
  {
    id: 'MPP-2026-01',
    periode: 'Q3 2026',
    departemen: 'Fundraising & Partnership',
    posisi: 'Staf Fundraising Digital',
    jumlah_kebutuhan: 2,
    status: 'Disetujui',
    diajukan_oleh: 'Manager Fundraising'
  },
  {
    id: 'MPP-2026-02',
    periode: 'Q3 2026',
    departemen: 'Program',
    posisi: 'Relawan Fasilitator Desa',
    jumlah_kebutuhan: 10,
    status: 'Disetujui',
    diajukan_oleh: 'Manager Program'
  },
  {
    id: 'MPP-2026-03',
    periode: 'Q4 2026',
    departemen: 'Keuangan',
    posisi: 'Staf Administrasi Keuangan',
    jumlah_kebutuhan: 1,
    status: 'Ditinjau',
    diajukan_oleh: 'Manager Keuangan'
  }
];

export const ManpowerTab: React.FC = () => {
  const [plans] = useState<ManpowerPlan[]>(mockPlans);
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status: ManpowerPlan['status']) => {
    switch(status) {
      case 'Disetujui': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ditinjau': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Ditolak': return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none opacity-50"></div>
          <p className="text-[#737686] font-semibold tracking-wider uppercase text-[10px]">Total Kebutuhan (Tahun Ini)</p>
          <div className="flex items-end gap-3 mt-2">
            <h4 className="text-3xl font-extrabold text-[#0053d0] tracking-tight">13</h4>
            <span className="text-xs font-semibold text-[#737686] mb-1">Posisi / Orang</span>
          </div>
        </div>
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none opacity-50"></div>
          <p className="text-[#737686] font-semibold tracking-wider uppercase text-[10px]">Disetujui & Siap Rekrut</p>
          <div className="flex items-end gap-3 mt-2">
            <h4 className="text-3xl font-extrabold text-emerald-600 tracking-tight">12</h4>
            <span className="text-xs font-semibold text-[#737686] mb-1">Posisi</span>
          </div>
        </div>
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full pointer-events-none opacity-50"></div>
          <p className="text-[#737686] font-semibold tracking-wider uppercase text-[10px]">Dalam Peninjauan HR/Direksi</p>
          <div className="flex items-end gap-3 mt-2">
            <h4 className="text-3xl font-extrabold text-amber-600 tracking-tight">1</h4>
            <span className="text-xs font-semibold text-[#737686] mb-1">Pengajuan</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-base text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0053d0]">group_add</span>
              Manpower Planning (MPP)
            </h3>
            <p className="text-xs text-[#737686] mt-1">Perencanaan kebutuhan formasi pegawai dari tiap divisi.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0053d0] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Ajukan MPP Baru
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider rounded-tl-xl">ID MPP</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Periode</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Departemen & Posisi</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Kebutuhan</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider rounded-tr-xl text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold">{plan.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#434654]">{plan.periode}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0b1c30] block">{plan.posisi}</span>
                    <span className="text-[10px] text-[#737686] block">Diajukan oleh: {plan.diajukan_oleh} ({plan.departemen})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0053d0] bg-blue-50 px-2 py-1 rounded-md">{plan.jumlah_kebutuhan} Orang</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(plan.status)}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="p-2 text-[#0053d0] hover:bg-blue-50 rounded-full transition-colors tooltip" title="Detail & Evaluasi">
                      <span className="material-symbols-outlined text-[18px]">fact_check</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0b1c30]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-lg w-full border border-blue-50 shadow-2xl relative">
            <h4 className="text-lg font-bold text-[#0b1c30] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0053d0]">group_add</span>
              Form Pengajuan MPP
            </h4>

            <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); setShowModal(false); alert('Fitur pengajuan MPP sedang dalam pengembangan backend.'); }}>
              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Periode *</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" placeholder="Mis. Q3 2026 atau Agustus 2026" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Departemen *</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" required>
                  <option value="">Pilih Departemen...</option>
                  <option value="Program">Program</option>
                  <option value="Fundraising & Partnership">Fundraising & Partnership</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="LAZ Al Azhar">LAZ Al Azhar (Manajemen)</option>
                  <option value="Sekretariat">Sekretariat & HRD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Posisi yang Dibutuhkan *</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" placeholder="Nama jabatan/posisi" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Jumlah Kebutuhan *</label>
                <input type="number" min="1" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" placeholder="0" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Alasan & Urgensi Penambahan *</label>
                <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold resize-none" placeholder="Jelaskan secara singkat alasan kebutuhan posisi ini..." required></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-blue-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-[#737686] hover:bg-gray-100 rounded-full font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#0053d0] hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-md flex items-center gap-2">
                  Ajukan MPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
