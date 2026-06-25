import React, { useState } from 'react';

export const LemburTimesheetTab: React.FC = () => {
  const [formType, setFormType] = useState<'timesheet' | 'lembur'>('timesheet');

  const handleAjukan = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Laporan ${formType} berhasil disimpan.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex border-b border-blue-50/50 gap-6">
        <button 
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${formType === 'timesheet' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
          onClick={() => setFormType('timesheet')}
        >
          Lapor Timesheet Harian
        </button>
        <button 
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${formType === 'lembur' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
          onClick={() => setFormType('lembur')}
        >
          Pengajuan Lembur (Overtime)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Area */}
        <div className="lg:col-span-1 bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6 h-max">
          <h3 className="font-bold text-base text-[#0b1c30] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0053d0]">
              {formType === 'timesheet' ? 'assignment' : 'more_time'}
            </span>
            {formType === 'timesheet' ? 'Isi Timesheet' : 'Form Lembur'}
          </h3>

          <form onSubmit={handleAjukan} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal *</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
              />
            </div>

            {formType === 'timesheet' && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Proyek / Tugas Utama *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Audit Keuangan Q2"
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Jam Mulai *</label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Jam Selesai *</label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">
                {formType === 'timesheet' ? 'Rincian Kegiatan *' : 'Alasan Lembur *'}
              </label>
              <textarea
                required
                rows={3}
                placeholder={formType === 'timesheet' ? "Tuliskan apa saja yang dikerjakan hari ini..." : "Alasan mengapa pekerjaan harus dilemburkan..."}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              Simpan Laporan
            </button>
          </form>
        </div>

        {/* Tabel Riwayat */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/50">
            <h3 className="font-bold text-base text-[#0b1c30]">
              Riwayat {formType === 'timesheet' ? 'Timesheet Bulan Ini' : 'Lembur Bulan Ini'}
            </h3>
            <span className="bg-[#0053d0]/10 text-[#0053d0] px-3 py-1 rounded-full text-xs font-bold">
              Total: {formType === 'timesheet' ? '42 Jam' : '4 Jam'}
            </span>
          </div>
          <div className="overflow-x-auto text-xs flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Tanggal</th>
                  {formType === 'timesheet' ? (
                    <th className="py-3 px-6 font-bold uppercase tracking-wider">Proyek</th>
                  ) : (
                    <th className="py-3 px-6 font-bold uppercase tracking-wider">Alasan</th>
                  )}
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Durasi</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
                {formType === 'timesheet' ? (
                  <>
                    <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-[#737686]">17 Jun 2026</td>
                      <td className="py-4 px-6 font-bold">Penyusunan Anggaran Tahunan</td>
                      <td className="py-4 px-6 font-mono font-medium">08:00 - 16:00<br/><span className="text-[10px] text-[#737686] font-normal">(8 Jam)</span></td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-[#737686]">18 Jun 2026</td>
                      <td className="py-4 px-6 font-bold">Laporan Pajak Q1</td>
                      <td className="py-4 px-6 font-mono font-medium">08:00 - 15:30<br/><span className="text-[10px] text-[#737686] font-normal">(7.5 Jam)</span></td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr className="hover:bg-[#eff4ff]/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-[#737686]">15 Jun 2026</td>
                    <td className="py-4 px-6 font-bold">Kejar deadline Laporan Audit Eksternal</td>
                    <td className="py-4 px-6 font-mono font-medium">17:00 - 20:00<br/><span className="text-[10px] text-[#737686] font-normal">(3 Jam)</span></td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        DISETUJUI MANAJER
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
