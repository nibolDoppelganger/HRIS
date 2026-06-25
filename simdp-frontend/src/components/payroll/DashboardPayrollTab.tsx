import React from 'react';

export const DashboardPayrollTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-8 bg-white border border-blue-50/50 rounded-[24px] shadow-sm shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0053d0]/5 rounded-full pointer-events-none"></div>
        
        <h3 className="font-bold text-base text-[#0b1c30] mb-8 relative z-10 flex items-center justify-between">
          Ringkasan Anggaran Gaji (Juni 2026)
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-bold border border-amber-100 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> DRAFT
          </span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs relative z-10">
          <div>
            <p className="text-[#737686] font-semibold tracking-wider uppercase text-[10px]">Total Disbursement</p>
            <p className="text-4xl font-extrabold text-[#0053d0] mt-2 tracking-tight">Rp 642,5 Jt</p>
            <p className="text-emerald-600 font-semibold text-[10px] mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.4% dari bulan lalu
            </p>
          </div>
          <div>
            <p className="text-[#737686] font-semibold tracking-wider uppercase text-[10px]">Potongan PPh 21 & BPJS</p>
            <p className="text-4xl font-extrabold text-rose-600 mt-2 tracking-tight">Rp 48,1 Jt</p>
          </div>
          <div>
            <p className="text-[#737686] font-semibold tracking-wider uppercase text-[10px]">Total Slip Gaji</p>
            <p className="text-4xl font-extrabold text-emerald-600 mt-2 tracking-tight">128 <span className="text-sm font-semibold text-[#737686]">Pegawai</span></p>
            <p className="text-[#737686] font-semibold text-[10px] mt-1">Estimasi 100% diproses</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-50/50 flex flex-wrap gap-4 relative z-10">
          <button
            onClick={() => alert("Menjalankan kalkulasi penggajian bulan ini...")}
            className="bg-[#0053d0] hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-full shadow-md shadow-blue-500/15 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">sync</span>
            Hitung Ulang Payroll
          </button>
          <button
            onClick={() => alert("Finalisasi dan terbitkan slip gaji...")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-3 rounded-full shadow-md shadow-emerald-500/15 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Finalisasi & Terbitkan Slip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
          <h3 className="font-bold text-base text-[#0b1c30] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0053d0]">history</span>
            Log Proses Payroll
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">done</span>
                </div>
                <div className="w-0.5 h-10 bg-blue-50 mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">Tarik Data Kehadiran & Lembur</p>
                <p className="text-xs text-[#737686] mt-0.5">Berhasil ditarik untuk 128 pegawai</p>
                <p className="text-[10px] text-[#737686] font-mono mt-1">25 Jun 2026, 08:30 WIB</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">done</span>
                </div>
                <div className="w-0.5 h-10 bg-blue-50 mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">Kalkulasi Tunjangan & Potongan</p>
                <p className="text-xs text-[#737686] mt-0.5">Potongan PPh21, BPJS dihitung</p>
                <p className="text-[10px] text-[#737686] font-mono mt-1">25 Jun 2026, 08:35 WIB</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">pending</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">Menunggu Finalisasi</p>
                <p className="text-xs text-[#737686] mt-0.5">Draft siap di-review oleh Admin HR</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
          <h3 className="font-bold text-base text-[#0b1c30] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0053d0]">summarize</span>
            Laporan & Rekap
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-blue-50/80 hover:bg-[#eff4ff]/30 hover:border-blue-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f8f9ff] text-[#0053d0] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <span className="material-symbols-outlined">table_chart</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0b1c30]">Rekap Gaji per Karyawan</p>
                  <p className="text-xs text-[#737686]">Format Excel (.xlsx)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#0053d0] transition-colors">download</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-blue-50/80 hover:bg-[#eff4ff]/30 hover:border-blue-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f8f9ff] text-[#0053d0] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <span className="material-symbols-outlined">pie_chart</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0b1c30]">Total Pengeluaran per Divisi</p>
                  <p className="text-xs text-[#737686]">Format Excel (.xlsx)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#0053d0] transition-colors">download</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-blue-50/80 hover:bg-[#eff4ff]/30 hover:border-blue-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f8f9ff] text-rose-600 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0b1c30]">Rekap Gaji per Karyawan</p>
                  <p className="text-xs text-[#737686]">Format PDF (.pdf)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737686] group-hover:text-rose-600 transition-colors">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
