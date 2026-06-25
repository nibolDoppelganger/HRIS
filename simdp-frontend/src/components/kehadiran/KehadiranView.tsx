import React, { useState } from "react";
import { AbsensiTab } from "./AbsensiTab";
import { CutiTab } from "./CutiTab";
import { LemburTimesheetTab } from "./LemburTimesheetTab";

export const KehadiranView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'absensi' | 'cuti' | 'timesheet'>('monitoring');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Manajemen Kehadiran</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Kelola absensi mandiri, pengajuan cuti, dan laporan lembur amil</p>
        </div>
        <button
          onClick={() => alert("Mengunduh laporan rekap kehadiran...")}
          className="bg-white text-[#0053d0] border border-blue-100 px-5 py-3 rounded-full font-bold text-xs hover:bg-[#eff4ff]/60 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Unduh Laporan
        </button>
      </div>

      <div className="flex overflow-x-auto border-b border-blue-50/50 gap-6 hide-scrollbar">
        <button 
          onClick={() => setActiveTab('monitoring')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'monitoring' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span> Monitoring Harian
        </button>
        <button 
          onClick={() => setActiveTab('absensi')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'absensi' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">fingerprint</span> Absensi Saya
        </button>
        <button 
          onClick={() => setActiveTab('cuti')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'cuti' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">event_note</span> Cuti & Izin
        </button>
        <button 
          onClick={() => setActiveTab('timesheet')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'timesheet' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">more_time</span> Timesheet & Lembur
        </button>
      </div>

      {activeTab === 'monitoring' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 hover:shadow-md transition-all duration-200">
              <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Hadir Hari Ini</p>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2">112 <span className="text-sm font-semibold text-[#737686]">(87.5%)</span></p>
            </div>
            <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 hover:shadow-md transition-all duration-200">
              <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Izin / Sakit</p>
              <p className="text-4xl font-extrabold text-blue-600 mt-2">5 <span className="text-sm font-semibold text-[#737686]">(3.9%)</span></p>
            </div>
            <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 hover:shadow-md transition-all duration-200">
              <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Cuti Terjadwal</p>
              <p className="text-4xl font-extrabold text-amber-600 mt-2">8 <span className="text-sm font-semibold text-[#737686]">(6.2%)</span></p>
            </div>
            <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 hover:shadow-md transition-all duration-200">
              <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Terlambat / Alpa</p>
              <p className="text-4xl font-extrabold text-rose-600 mt-2">3 <span className="text-sm font-semibold text-[#737686]">(2.4%)</span></p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base text-[#0b1c30]">Log Masuk/Pulang Hari Ini</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari nama karyawan..."
                  className="pl-9 pr-4 py-2 border border-blue-100 rounded-full text-xs w-64 focus:outline-none focus:border-[#0053d0] transition-colors"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-[#737686]">search</span>
              </div>
            </div>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9ff]/80 text-[#737686]">
                    <th className="py-3.5 px-6 font-bold uppercase tracking-wider rounded-tl-xl">Karyawan</th>
                    <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Jam Masuk</th>
                    <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Jam Pulang</th>
                    <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Metode Absen</th>
                    <th className="py-3.5 px-6 font-bold uppercase tracking-wider rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
                  <tr className="hover:bg-[#eff4ff]/30 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0053d0] flex items-center justify-center font-bold text-xs border border-blue-100">
                        RS
                      </div>
                      <div>
                        <p className="group-hover:text-[#0053d0] transition-colors">Rahmatullah Sidik</p>
                        <p className="text-[10px] text-[#737686] font-normal">Sekretariat</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono">07:28 WIB</td>
                    <td className="py-4 px-6 font-mono">17:05 WIB</td>
                    <td className="py-4 px-6">Mobile GPS (Al-Azhar Kantor Pusat)</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        TEPAT WAKTU
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#eff4ff]/30 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100">
                        AF
                      </div>
                      <div>
                        <p className="group-hover:text-[#0053d0] transition-colors">Ahmad Faisal</p>
                        <p className="text-[10px] text-[#737686] font-normal">Fundraising</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-rose-600 font-medium">08:15 WIB</td>
                    <td className="py-4 px-6 font-mono text-[#737686]">-</td>
                    <td className="py-4 px-6">Presensi Wajah (FaceID Lobby)</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        TERLAMBAT
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#eff4ff]/30 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-100">
                        SN
                      </div>
                      <div>
                        <p className="group-hover:text-[#0053d0] transition-colors">Siti Nurhaliza</p>
                        <p className="text-[10px] text-[#737686] font-normal">Keuangan</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#737686]">-</td>
                    <td className="py-4 px-6 font-mono text-[#737686]">-</td>
                    <td className="py-4 px-6 text-[#737686] italic">Disetujui: Cuti Tahunan</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        CUTI
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'absensi' && <AbsensiTab />}
      {activeTab === 'cuti' && <CutiTab />}
      {activeTab === 'timesheet' && <LemburTimesheetTab />}
    </div>
  );
};
