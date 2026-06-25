import React, { useState } from 'react';

// Mock interface for Job Postings
interface JobPosting {
  id: string;
  judul: string;
  departemen: string;
  unit: string;
  tipe_kontrak: 'Tetap' | 'Kontrak' | 'Relawan';
  batas_lamaran: string;
  status: 'Aktif' | 'Draf' | 'Ditutup';
  kebutuhan: number;
  jumlah_pelamar: number;
}

const mockLowongan: JobPosting[] = [
  {
    id: 'JOB-2601',
    judul: 'Staf Fundraising Digital',
    departemen: 'Fundraising & Partnership',
    unit: 'Digital',
    tipe_kontrak: 'Kontrak',
    batas_lamaran: '2026-07-31',
    status: 'Aktif',
    kebutuhan: 2,
    jumlah_pelamar: 45
  },
  {
    id: 'JOB-2602',
    judul: 'Relawan Fasilitator Desa',
    departemen: 'Program',
    unit: 'Pemberdayaan',
    tipe_kontrak: 'Relawan',
    batas_lamaran: '2026-08-15',
    status: 'Aktif',
    kebutuhan: 10,
    jumlah_pelamar: 128
  },
  {
    id: 'JOB-2603',
    judul: 'Manajer Keuangan',
    departemen: 'Keuangan',
    unit: 'Akuntansi',
    tipe_kontrak: 'Tetap',
    batas_lamaran: '2026-06-30',
    status: 'Draf',
    kebutuhan: 1,
    jumlah_pelamar: 0
  }
];

export const LowonganTab: React.FC = () => {
  const [lowongan, setLowongan] = useState<JobPosting[]>(mockLowongan);
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status: JobPosting['status']) => {
    switch(status) {
      case 'Aktif': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Draf': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Ditutup': return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const getContractBadge = (tipe: JobPosting['tipe_kontrak']) => {
    switch(tipe) {
      case 'Tetap': return 'text-[#0053d0] bg-blue-50';
      case 'Kontrak': return 'text-amber-700 bg-amber-50';
      case 'Relawan': return 'text-purple-700 bg-purple-50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-base text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0053d0]">work</span>
              Manajemen Lowongan
            </h3>
            <p className="text-xs text-[#737686] mt-1">Buat dan kelola lowongan pekerjaan yang akan dipublikasikan.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0053d0] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Buat Lowongan
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider rounded-tl-xl">Posisi / Departemen</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Tipe Kontrak</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Batas Waktu</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Kebutuhan / Pelamar</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider rounded-tr-xl text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
              {lowongan.map((job) => (
                <tr key={job.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0b1c30] block">{job.judul}</span>
                    <span className="text-[10px] text-[#737686] block">{job.departemen} • {job.unit}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getContractBadge(job.tipe_kontrak)}`}>
                      {job.tipe_kontrak}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#434654]">{job.batas_lamaran}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0053d0]">{job.kebutuhan} Orang</span>
                    <span className="text-[10px] text-[#737686] block mt-0.5">{job.jumlah_pelamar} Pelamar Masuk</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="p-2 text-[#0053d0] hover:bg-blue-50 rounded-full transition-colors" title="Edit Lowongan">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
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
          <div className="bg-white rounded-[24px] p-6 max-w-2xl w-full border border-blue-50 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h4 className="text-lg font-bold text-[#0b1c30] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0053d0]">post_add</span>
              Buat Posting Lowongan Baru
            </h4>

            <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); setShowModal(false); alert('Fitur simpan lowongan sedang dalam pengembangan backend.'); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#434654] mb-2">Judul Posisi *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" placeholder="Mis. Staf Digital Marketing" required />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Departemen *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" required>
                    <option value="">Pilih Departemen...</option>
                    <option value="Program">Program</option>
                    <option value="Fundraising & Partnership">Fundraising & Partnership</option>
                    <option value="Keuangan">Keuangan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Unit Kerja</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" placeholder="Opsional" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Tipe Kontrak *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" required>
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Relawan">Relawan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Job Level *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" required>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Staf">Staf</option>
                    <option value="Non Staf">Non Staf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Batas Lamaran *</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Jumlah Kebutuhan *</label>
                  <input type="number" min="1" className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold" placeholder="Berapa orang?" required />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#434654] mb-2">Deskripsi Tugas *</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold resize-none" placeholder="Jelaskan peran dan tanggung jawab pekerjaan..." required></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#434654] mb-2">Kualifikasi *</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold resize-none" placeholder="Tulis persyaratan minimal (pendidikan, pengalaman, skill)..." required></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-blue-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-[#737686] hover:bg-gray-100 rounded-full font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#0053d0] hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-md flex items-center gap-2">
                  Simpan Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
