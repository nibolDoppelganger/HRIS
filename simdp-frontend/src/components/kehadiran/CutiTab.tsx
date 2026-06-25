import React, { useState } from 'react';

export const CutiTab: React.FC = () => {
  const [jenisCuti, setJenisCuti] = useState('Cuti Tahunan');
  
  const handleAjukan = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pengajuan cuti berhasil dikirim untuk persetujuan Atasan.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Saldo Cuti */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 flex items-center justify-between">
          <div>
            <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Cuti Tahunan</p>
            <p className="text-3xl font-extrabold text-[#0053d0] mt-1">8 <span className="text-sm font-semibold text-[#737686]">/ 12 Hari</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0053d0] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 flex items-center justify-between">
          <div>
            <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Cuti Besar</p>
            <p className="text-3xl font-extrabold text-[#0b1c30] mt-1">0 <span className="text-sm font-semibold text-[#737686]">Hari</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f8f9ff] text-[#737686] flex items-center justify-center border border-blue-50">
            <span className="material-symbols-outlined text-2xl">hotel_class</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 flex items-center justify-between">
          <div>
            <p className="text-[#737686] text-xs font-semibold uppercase tracking-wider">Izin Khusus</p>
            <p className="text-sm font-bold text-[#434654] mt-2">Sesuai Peraturan</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">local_hospital</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Pengajuan Cuti */}
        <div className="lg:col-span-1 bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
          <h3 className="font-bold text-base text-[#0b1c30] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0053d0]">post_add</span>
            Form Pengajuan
          </h3>

          <form onSubmit={handleAjukan} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Jenis Cuti / Izin *</label>
              <select 
                value={jenisCuti}
                onChange={(e) => setJenisCuti(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
              >
                <option value="Cuti Tahunan">Cuti Tahunan</option>
                <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                <option value="Cuti Sakit">Izin Sakit (Butuh Surat Dokter)</option>
                <option value="Izin Pribadi">Izin Pribadi</option>
                <option value="Izin Duka">Izin Kedukaan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Mulai *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Selesai *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Alasan Lengkap *</label>
              <textarea
                required
                rows={3}
                placeholder="Contoh: Mengurus dokumen keluarga..."
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] resize-y"
              ></textarea>
            </div>

            {jenisCuti.includes('Sakit') && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Lampiran (Surat Dokter)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full text-xs text-[#737686] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0053d0] hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              Ajukan Permohonan
            </button>
          </form>
        </div>

        {/* Tabel Riwayat */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-blue-50/50">
            <h3 className="font-bold text-base text-[#0b1c30]">Riwayat Pengajuan</h3>
          </div>
          <div className="overflow-x-auto text-xs flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Tanggal Dibuat</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Periode Cuti</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Jenis & Alasan</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
                <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                  <td className="py-4 px-6 font-mono text-[#737686]">05 Mei 2026</td>
                  <td className="py-4 px-6 font-mono font-medium">10 - 12 Mei 2026<br/><span className="text-[10px] text-[#737686] font-normal">(3 Hari)</span></td>
                  <td className="py-4 px-6">
                    <p className="font-bold">Cuti Tahunan</p>
                    <p className="text-[10px] text-[#737686]">Acara keluarga di kampung</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      DISETUJUI
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                  <td className="py-4 px-6 font-mono text-[#737686]">12 Feb 2026</td>
                  <td className="py-4 px-6 font-mono font-medium">12 - 13 Feb 2026<br/><span className="text-[10px] text-[#737686] font-normal">(2 Hari)</span></td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-rose-600">Izin Sakit</p>
                    <p className="text-[10px] text-[#737686]">Demam berdarah (Lampiran 1x)</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      DISETUJUI
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
