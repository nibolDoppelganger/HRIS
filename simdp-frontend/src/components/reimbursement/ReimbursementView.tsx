import React, { useState } from "react";

export const ReimbursementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'berjalan' | 'riwayat'>('berjalan');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Klaim & Reimbursement</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Ajukan dan pantau status persetujuan klaim operasional dan kesehatan</p>
        </div>
        <button
          onClick={() => { window.location.href = '/reimbursement/ajukan'; }}
          className="bg-[#0053d0] hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-full shadow-md shadow-blue-500/15 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Ajukan Klaim Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Sisa Pagu Medis (Tahunan)</p>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">medical_services</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-[#0053d0]">Rp 2.150.000</p>
            <p className="text-xs font-semibold text-[#737686] mt-1">Dari total Rp 2.500.000</p>
          </div>
          <div className="w-full h-1.5 bg-[#f8f9ff] rounded-full mt-4 overflow-hidden border border-blue-50">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Klaim Menunggu Persetujuan</p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">pending_actions</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-amber-600">3 <span className="text-sm font-semibold text-[#737686]">Pengajuan</span></p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Klaim Disetujui (Bulan Ini)</p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0053d0] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">task_alt</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-[#0053d0]">Rp 850.000</p>
            <p className="text-xs font-semibold text-[#737686] mt-1">Total pencairan bulan ini</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
        <div className="flex border-b border-blue-50/50 mb-6 gap-6">
          <button 
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'berjalan' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
            onClick={() => setActiveTab('berjalan')}
          >
            Pengajuan Berjalan
          </button>
          <button 
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'riwayat' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
            onClick={() => setActiveTab('riwayat')}
          >
            Riwayat Selesai
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider rounded-tl-xl">No. Tiket</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Tanggal</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Tipe Klaim</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Nominal</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
              {activeTab === 'berjalan' && (
                <>
                  <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold">REIM-2026-042</td>
                    <td className="py-4 px-6 font-mono">15 Jun 2026</td>
                    <td className="py-4 px-6">
                      <p className="font-bold">Rawat Jalan (Kacamata)</p>
                      <p className="text-[10px] text-[#737686]">Rahmatullah Sidik</p>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold">Rp 350.000</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Menunggu Persetujuan Manajer
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-[#0053d0] font-semibold text-xs hover:underline">Detail</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold">REIM-2026-043</td>
                    <td className="py-4 px-6 font-mono">17 Jun 2026</td>
                    <td className="py-4 px-6">
                      <p className="font-bold">Transport Dinas (Grab)</p>
                      <p className="text-[10px] text-[#737686]">Siti Nurhaliza</p>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold">Rp 120.000</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#0053d0] border border-blue-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0053d0]"></span>
                        Proses Pencairan Finance
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-[#0053d0] font-semibold text-xs hover:underline">Detail</button>
                    </td>
                  </tr>
                </>
              )}
              {activeTab === 'riwayat' && (
                <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#737686]">REIM-2026-038</td>
                  <td className="py-4 px-6 font-mono">01 Jun 2026</td>
                  <td className="py-4 px-6">
                    <p className="font-bold">Beli ATK & Materai</p>
                    <p className="text-[10px] text-[#737686]">Rahmatullah Sidik</p>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold">Rp 85.000</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Selesai & Dicairkan
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-[#0053d0] font-semibold text-xs hover:underline">Detail</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
