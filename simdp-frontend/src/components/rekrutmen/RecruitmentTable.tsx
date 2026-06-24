import React, { useState, useEffect } from 'react';
import { api, type Volunteer } from '../../lib/api';
import { $userSession } from '../../lib/store';
import { useStore } from '@nanostores/react';

export const RecruitmentTable: React.FC = () => {
  const session = useStore($userSession);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);

  // Filter/Search State
  const [statusFilter, setStatusFilter] = useState<'baru' | 'direview' | 'diterima' | 'ditolak' | 'semua'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [divisiFilter, setDivisiFilter] = useState('semua');

  // Recruitment Toggle Settings
  const [isOpen, setIsOpen] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [openDivisions, setOpenDivisions] = useState('');
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Convert to Employee Modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertData, setConvertData] = useState({
    join_date: new Date().toISOString().split('T')[0],
    departement: '',
    unit: '',
    job_level: 'Non Staf',
    level: '1'
  });
  const [converting, setConverting] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const res = await api.getVolunteersList();
      if (res.success) setVolunteers(res.data);
      
      const resStatus = await api.getRecruitmentStatus();
      if (resStatus.success) {
        setIsOpen(resStatus.data.is_open);
        setInfoText(resStatus.data.info);
        setOpenDivisions(resStatus.data.divisi_tersedia.join(','));
      }
    } catch (e) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleToggleRecruitment = async () => {
    if (!session) return;
    setUpdatingSettings(true);
    try {
      await api.updateRecruitmentSettings({
        rekrutmen_is_open: (!isOpen).toString()
      }, session.user.email);
      setIsOpen(!isOpen);
    } catch(e) {}
    finally {
      setUpdatingSettings(false);
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setUpdatingSettings(true);
    try {
      await api.updateRecruitmentSettings({
        rekrutmen_info: infoText,
        rekrutmen_divisi: openDivisions
      }, session.user.email);
      alert('Konfigurasi rekrutmen diperbarui.');
    } catch(e) {}
    finally {
      setUpdatingSettings(false);
    }
  };

  const handleStatusChange = async (status: Volunteer['status']) => {
    if (!selectedVol || !session) return;
    const notes = prompt('Masukkan catatan admin (opsional):') || '';
    try {
      const res = await api.updateVolunteerStatus(selectedVol.id, status, notes, session.user.email);
      if (res.success) {
        alert(res.message);
        // Refresh volunteer details in state
        setSelectedVol(prev => prev ? { ...prev, status, catatan_admin: notes } : null);
        fetchVolunteers();
      }
    } catch(e) {}
  };

  const handleOpenConvertModal = () => {
    if (!selectedVol) return;
    setConvertData({
      join_date: new Date().toISOString().split('T')[0],
      departement: selectedVol.divisi_diminati,
      unit: selectedVol.divisi_diminati === 'Program' ? 'Program' : (selectedVol.divisi_diminati.includes('Keuangan') ? 'Pengeluaran' : 'Direksi'),
      job_level: 'Non Staf',
      level: '1'
    });
    setShowConvertModal(true);
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVol || !session) return;
    setConverting(true);
    try {
      const res = await api.convertToEmployee(selectedVol.id, convertData, session.user.email);
      if (res.success && res.data) {
        alert(`Berhasil mengonversi relawan. Employee ID: ${res.data.employee_id}`);
        setShowConvertModal(false);
        setSelectedVol(null);
        fetchVolunteers();
      }
    } catch(e) {
      alert('Konversi gagal.');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a7a]"></div>
        <p className="text-sm text-slate-500 mt-4 font-semibold">Memuat data pendaftar...</p>
      </div>
    );
  }

  // Filter items
  const filteredVolunteers = volunteers.filter(v => {
    const matchesStatus = statusFilter === 'semua' || v.status === statusFilter;
    const matchesDivisi = divisiFilter === 'semua' || v.divisi_diminati === divisiFilter;
    const matchesSearch = v.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.nomor_pendaftaran.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDivisi && matchesSearch;
  });

  const uniqueDivisions = Array.from(new Set(volunteers.map(v => v.divisi_diminati)));

  const getStatusBadgeClass = (status: Volunteer['status']) => {
    switch (status) {
      case 'baru': return 'bg-sky-50 text-sky-800 border-sky-100';
      case 'direview': return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'diterima': return 'bg-blue-50 text-[#1e3a7a] border-blue-100';
      case 'ditolak': return 'bg-rose-50 text-rose-800 border-rose-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-md tracking-tight mb-4">Pengaturan Pintu Rekrutmen Publik</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Toggle status */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between h-full">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Rekrutmen</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isOpen ? 'bg-blue-50 text-[#1e3a7a] border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {isOpen ? '🟢 Buka' : '🔴 Tutup'}
              </span>
            </div>
            <button
              onClick={handleToggleRecruitment}
              disabled={updatingSettings}
              className={`mt-4 w-full py-2.5 text-xs font-bold rounded-xl text-white transition-all shadow-md ${isOpen ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#1e3a7a] hover:bg-[#0f2557]'}`}
            >
              {updatingSettings ? 'Proses...' : (isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran')}
            </button>
          </div>

          {/* Editor Info */}
          <form onSubmit={handleUpdateInfo} className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Teks Pengumuman Banner</label>
                <input
                  type="text"
                  value={infoText}
                  onChange={(e) => setInfoText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#1e3a7a]"
                  placeholder="Contoh: Pendaftaran Relawan dibuka s/d 31 Juli 2026"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Divisi Tersedia (pisahkan koma)</label>
                <input
                  type="text"
                  value={openDivisions}
                  onChange={(e) => setOpenDivisions(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#1e3a7a]"
                  placeholder="Contoh: Program,Fundraising & Partnership"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={updatingSettings}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>

      {/* Main Table view */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table list */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex gap-2">
              {(['semua', 'baru', 'direview', 'diterima', 'ditolak'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border capitalize transition-all ${statusFilter === status ? 'bg-blue-50 text-[#1e3a7a] border-blue-200' : 'bg-slate-55 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama/no pendaftaran..."
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1e3a7a] flex-grow"
              />
              <select
                value={divisiFilter}
                onChange={(e) => setDivisiFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#1e3a7a]"
              >
                <option value="semua">Semua Divisi</option>
                {uniqueDivisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">No. Daftar</th>
                  <th className="pb-3">Nama</th>
                  <th className="pb-3">Divisi</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-bold">
                      Tidak ada pendaftar ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((v) => (
                    <tr 
                      key={v.id} 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedVol?.id === v.id ? 'bg-slate-50' : ''}`}
                      onClick={() => setSelectedVol(v)}
                    >
                      <td className="py-3.5 font-mono text-xs font-bold text-slate-800">{v.nomor_pendaftaran}</td>
                      <td className="py-3.5">
                        <span className="font-bold text-slate-800 block">{v.nama_lengkap}</span>
                        <span className="text-xs text-slate-400 block">{v.email}</span>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-600 text-xs">{v.divisi_diminati}</td>
                      <td className="py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadgeClass(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedVol(v)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer/panel */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit">
          <h3 className="font-extrabold text-slate-900 text-md tracking-tight mb-6">Detail Peninjauan Pelamar</h3>
          
          {!selectedVol ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 border-dashed text-slate-400 font-bold text-xs">
              Pilih pelamar dari tabel untuk meninjau data lengkap
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-md leading-tight">{selectedVol.nama_lengkap}</h4>
                  <span className="text-xs font-semibold text-slate-400 mt-1 block">{selectedVol.nomor_pendaftaran} • {selectedVol.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadgeClass(selectedVol.status)}`}>
                  {selectedVol.status}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleStatusChange('direview')}
                  disabled={selectedVol.status === 'direview'}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all border border-amber-200/50"
                >
                  Tandai Direview
                </button>
                <button
                  onClick={() => handleStatusChange('ditolak')}
                  disabled={selectedVol.status === 'ditolak' || selectedVol.converted_to_employee_id != null}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all border border-rose-200/50"
                >
                  Tolak Pelamar
                </button>
                <button
                  onClick={handleOpenConvertModal}
                  disabled={selectedVol.converted_to_employee_id != null}
                  className="px-3 py-1.5 bg-[#1e3a7a] hover:bg-[#0f2557] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-800/10 flex-grow text-center"
                >
                  {selectedVol.converted_to_employee_id ? 'Diterima (Sudah Karyawan)' : 'Terima & Konversi'}
                </button>
              </div>

              {/* Data Diri */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-[#1e3a7a]">1. Data Diri & Kontak</h5>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Email</span><span className="font-semibold text-slate-800">{selectedVol.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">WhatsApp</span><span className="font-semibold text-slate-800">{selectedVol.no_hp}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">TTL</span><span className="font-semibold text-slate-800">{selectedVol.tempat_lahir}, {selectedVol.tanggal_lahir}</span></div>
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Alamat Domisili</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl font-semibold text-slate-700">{selectedVol.alamat}</p>
                </div>
              </div>

              {/* Pendidikan & Skill */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-[#1e3a7a]">2. Pendidikan & Keahlian</h5>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Pendidikan</span><span className="font-semibold text-slate-800">{selectedVol.pendidikan_terakhir} {selectedVol.jurusan}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Institusi</span><span className="font-semibold text-slate-800">{selectedVol.institusi}</span></div>
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Keahlian</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl font-semibold text-slate-700 whitespace-pre-wrap">{selectedVol.keahlian}</p>
                </div>
              </div>

              {/* Motivasi & CV */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-[#1e3a7a]">3. Ketersediaan & Berkas</h5>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Divisi Pilihan</span><span className="font-semibold text-slate-800">{selectedVol.divisi_diminati}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Durasi Gabung</span><span className="font-semibold text-slate-800">{selectedVol.durasi_kesediaan}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Siap Mulai</span><span className="font-semibold text-slate-800">{selectedVol.tersedia_mulai}</span></div>
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Motivasi</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl font-semibold text-slate-700 whitespace-pre-wrap">{selectedVol.motivasi}</p>
                </div>
                {selectedVol.catatan_admin && (
                  <div>
                    <span className="text-amber-800 font-bold block mb-1">Catatan Admin</span>
                    <p className="p-2.5 bg-amber-50/50 border border-amber-100/50 rounded-xl font-semibold text-amber-900">{selectedVol.catatan_admin}</p>
                  </div>
                )}
                <a
                  href={selectedVol.cv_drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-all border border-slate-200 mt-2"
                >
                  📄 Download CV Dokumen
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convert to Employee Modal popup */}
      {showConvertModal && selectedVol && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative">
            <h4 className="text-lg font-black text-slate-900 mb-2">Konversi Pelamar ke Karyawan</h4>
            <p className="text-xs text-slate-500 font-medium mb-6">Tentukan posisi penempatan kerja untuk <strong>{selectedVol.nama_lengkap}</strong> sebagai Relawan.</p>

            <form onSubmit={handleConvert} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal Mulai Kontrak (Join Date) *</label>
                <input
                  type="date"
                  value={convertData.join_date}
                  onChange={(e) => setConvertData(p => ({ ...p, join_date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Departemen Penempatan *</label>
                <select
                  value={convertData.departement}
                  onChange={(e) => setConvertData(p => ({ ...p, departement: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1e3a7a] text-xs font-semibold"
                >
                  {['Sekretariat', 'Keuangan', 'LAZ Al Azhar', 'Fundraising & Partnership', 'Program'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Unit Kerja Penempatan *</label>
                <input
                  type="text"
                  value={convertData.unit}
                  onChange={(e) => setConvertData(p => ({ ...p, unit: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] text-xs font-semibold"
                  placeholder="Contoh: Humas, GA, dan IT"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Job Level *</label>
                  <input
                    type="text"
                    value={convertData.job_level}
                    onChange={(e) => setConvertData(p => ({ ...p, job_level: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] text-xs font-semibold"
                    placeholder="Contoh: Non Staf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Grade Level *</label>
                  <select
                    value={convertData.level}
                    onChange={(e) => setConvertData(p => ({ ...p, level: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1e3a7a] text-xs font-semibold"
                  >
                    {['5A', '5C', '4A', '4B', '4C', '3A', '3B', '3C', '2A', '2B', '2C', '1', '1C'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="px-5 py-2.5 bg-[#1e3a7a] hover:bg-[#0f2557] disabled:bg-blue-300 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {converting ? 'Memproses...' : 'Proses Konversi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
