import React from 'react';

export const SlipGajiTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tabel Rincian Gaji Karyawan */}
      <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-bold text-base text-[#0b1c30]">Daftar Slip Gaji Pegawai</h3>
          <div className="flex gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari nama atau NIK..."
                className="pl-9 pr-4 py-2 border border-blue-100 rounded-full text-xs w-full sm:w-64 focus:outline-none focus:border-[#0053d0] transition-colors bg-[#f8f9ff]"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-sm text-[#737686]">search</span>
            </div>
            <select className="px-4 py-2 border border-blue-100 rounded-full text-xs bg-white text-[#737686] focus:outline-none focus:border-[#0053d0] cursor-pointer hidden sm:block">
              <option value="">Semua Divisi</option>
              <option value="IT">IT & Infrastruktur</option>
              <option value="HR">HR & GA</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Fundraising">Fundraising</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider rounded-tl-xl">Pegawai</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-right">Gaji Pokok</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-right">Tunjangan</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-right">Potongan</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-right">Take Home Pay</th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider rounded-tr-xl text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
              <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                <td className="py-4 px-6 min-w-[200px]">
                  <p className="font-bold text-[#0b1c30]">Rahmatullah Sidik</p>
                  <p className="text-[10px] text-[#737686] font-normal">ID: 20103008013 • Sekretariat</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-blue-50 text-[#0053d0] border border-blue-100 rounded-full font-bold text-[10px]">
                    Karyawan Tetap
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-[#434654] text-right">15.000.000</td>
                <td className="py-4 px-6 font-mono text-emerald-600 text-right">+ 2.500.000</td>
                <td className="py-4 px-6 font-mono text-rose-600 text-right">- 1.250.000</td>
                <td className="py-4 px-6 font-mono font-bold text-[#0053d0] text-sm text-right">Rp 16.250.000</td>
                <td className="py-4 px-6 text-center">
                  <button className="text-[#0053d0] hover:bg-blue-50 p-2 rounded-full transition-colors tooltip" title="Unduh Slip PDF">
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                <td className="py-4 px-6 min-w-[200px]">
                  <p className="font-bold text-[#0b1c30]">Ahmad Faisal</p>
                  <p className="text-[10px] text-[#737686] font-normal">ID: 20155009021 • Fundraising</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px]">
                    Karyawan Kontrak
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-[#434654] text-right">8.000.000</td>
                <td className="py-4 px-6 font-mono text-emerald-600 text-right">+ 1.000.000</td>
                <td className="py-4 px-6 font-mono text-rose-600 text-right">- 450.000</td>
                <td className="py-4 px-6 font-mono font-bold text-[#0053d0] text-sm text-right">Rp 8.550.000</td>
                <td className="py-4 px-6 text-center">
                  <button className="text-[#0053d0] hover:bg-blue-50 p-2 rounded-full transition-colors tooltip" title="Unduh Slip PDF">
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                <td className="py-4 px-6 min-w-[200px]">
                  <p className="font-bold text-[#0b1c30]">Siti Nurhaliza</p>
                  <p className="text-[10px] text-[#737686] font-normal">ID: 20239009121 • Relawan Lapangan</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-bold text-[10px]">
                    Relawan
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-[#434654] text-right">3.500.000</td>
                <td className="py-4 px-6 font-mono text-[#737686] text-right italic text-[10px]">Tidak ada</td>
                <td className="py-4 px-6 font-mono text-[#737686] text-right italic text-[10px]">Tidak ada</td>
                <td className="py-4 px-6 font-mono font-bold text-[#0053d0] text-sm text-right">Rp 3.500.000</td>
                <td className="py-4 px-6 text-center">
                  <button className="text-[#0053d0] hover:bg-blue-50 p-2 rounded-full transition-colors tooltip" title="Unduh Slip PDF">
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center text-xs text-[#737686]">
          <p>Menampilkan 3 dari 128 data</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors opacity-50 cursor-not-allowed">Sebelumnya</button>
            <button className="px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors text-[#0053d0] font-bold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">3</button>
            <button className="px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};
