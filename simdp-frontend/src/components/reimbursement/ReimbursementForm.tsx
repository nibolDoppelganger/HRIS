import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const ReimbursementForm: React.FC = () => {
  const session = useStore($userSession);
  const [claimType, setClaimType] = useState('Medis - Rawat Jalan');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  
  const handleSimpan = () => {
    alert('Pengajuan klaim reimbursement berhasil dikirim untuk persetujuan.');
    window.location.href = '/reimbursement';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-xs text-[#737686] font-medium">
        <button onClick={() => window.location.href = '/reimbursement'} className="hover:text-[#0053d0] transition-colors cursor-pointer">
          Reimbursement
        </button>
        <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
        <span className="text-[#0b1c30] font-bold">Ajukan Klaim Baru</span>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8">
        <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30] mb-2">Formulir Pengajuan Reimbursement</h2>
        <p className="text-xs text-[#737686] mb-8">Lengkapi detail biaya operasional atau medis yang akan diklaim.</p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Jenis Klaim *</label>
              <select 
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] cursor-pointer"
              >
                <option value="Medis - Rawat Jalan">Medis - Rawat Jalan</option>
                <option value="Medis - Kacamata">Medis - Kacamata / Optik</option>
                <option value="Transportasi / Bensin">Transportasi / Bensin</option>
                <option value="Perjalanan Dinas">Perjalanan Dinas (SPPD)</option>
                <option value="Operasional Kantor">Biaya Operasional Kantor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal Kuitansi *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Nominal Klaim (Rp) *</label>
            <input
              type="number"
              placeholder="Contoh: 150000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] font-mono font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Keterangan / Tujuan *</label>
            <textarea
              rows={3}
              placeholder="Jelaskan rincian pengeluaran secara singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] resize-y"
            ></textarea>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Unggah Bukti Kuitansi / Struk *</label>
            <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:bg-blue-50/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="material-symbols-outlined text-4xl text-[#c0c7d4] mb-3">upload_file</span>
              <p className="text-sm font-bold text-[#0b1c30]">Klik atau Tarik File Bukti (PDF / JPG / PNG)</p>
              <p className="text-[10px] text-[#737686] mt-1">Maks. ukuran 5MB</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-blue-50/50">
            <button
              type="button"
              onClick={() => window.location.href = '/reimbursement'}
              className="px-6 py-3 font-bold text-[#737686] hover:text-red-600 hover:bg-red-50 rounded-full text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSimpan}
              className="px-8 py-3 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-500/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
