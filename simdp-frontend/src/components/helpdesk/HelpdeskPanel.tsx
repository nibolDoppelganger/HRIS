import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const HelpdeskPanel: React.FC = () => {
  const session = useStore($userSession);
  const [activeTab, setActiveTab] = useState<'tiket' | 'buat'>('tiket');

  const mockTickets = [
    { id: 'TKT-202606-01', subject: 'Pertanyaan Potongan BPJS', category: 'Payroll', status: 'In Progress', date: '24 Jun 2026' },
    { id: 'TKT-202606-02', subject: 'Kendala Akses Sistem', category: 'IT Support', status: 'Closed', date: '20 Jun 2026' },
    { id: 'TKT-202606-03', subject: 'Pengajuan Cuti Tahunan', category: 'Cuti', status: 'Open', date: '23 Jun 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Pusat Bantuan HR</h2>
          <p className="text-xs text-[#737686] mt-0.5">Ajukan pertanyaan, kendala operasional, atau bantuan terkait kepegawaian.</p>
        </div>
        <button 
          onClick={() => setActiveTab('buat')}
          className="bg-[#0053d0] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Buat Tiket Baru
        </button>
      </div>

      {activeTab === 'buat' && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 max-w-3xl animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full">
              FORM TIKET BARU
            </h3>
            <button 
              onClick={() => setActiveTab('tiket')}
              className="text-xs font-bold text-[#737686] hover:text-[#0b1c30] transition-colors"
            >
              Kembali
            </button>
          </div>

          <form className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Kategori Bantuan *</label>
              <select className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] cursor-pointer">
                <option value="">-- Pilih Kategori --</option>
                <option value="Payroll">Payroll / Gaji</option>
                <option value="BPJS">BPJS / Asuransi</option>
                <option value="Cuti">Cuti / Kehadiran</option>
                <option value="IT Support">Kendala Sistem / IT</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Subjek *</label>
              <input
                type="text"
                placeholder="Ringkasan kendala atau pertanyaan"
                className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Deskripsi Detail *</label>
              <textarea
                rows={5}
                placeholder="Jelaskan kendala Anda secara rinci agar tim HR dapat membantu dengan lebih cepat..."
                className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-sm text-[#0b1c30] resize-y"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-blue-50/50">
              <button
                type="button"
                onClick={() => setActiveTab('tiket')}
                className="px-6 py-2.5 font-bold text-[#737686] hover:text-red-600 hover:bg-red-50 rounded-full text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Tiket berhasil dikirim. Tim HR akan segera merespons.');
                  setActiveTab('tiket');
                }}
                className="px-8 py-2.5 bg-[#008733] hover:bg-emerald-700 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-emerald-500/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Kirim Tiket
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'tiket' && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8f9ff]/50">
            <h3 className="font-bold text-sm text-[#0b1c30]">Daftar Tiket Saya</h3>
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-blue-100 rounded-full text-xs font-bold text-[#0b1c30] outline-none cursor-pointer">
                <option value="Semua">Semua Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                  <th className="px-6 py-4">ID Tiket</th>
                  <th className="px-6 py-4">Subjek & Kategori</th>
                  <th className="px-6 py-4">Tanggal Buat</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/40">
                {mockTickets.map((ticket, idx) => (
                  <tr key={idx} className="hover:bg-[#eff4ff]/20">
                    <td className="px-6 py-4 font-mono font-bold text-[#0b1c30]">{ticket.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0b1c30]">{ticket.subject}</p>
                      <p className="text-[10px] text-[#737686] mt-0.5">Kategori: {ticket.category}</p>
                    </td>
                    <td className="px-6 py-4 text-[#434654]">{ticket.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                        ticket.status === 'Open' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 hover:bg-blue-50 text-[#0053d0] rounded-lg transition-colors cursor-pointer" title="Lihat Balasan">
                        <span className="material-symbols-outlined text-lg">forum</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
