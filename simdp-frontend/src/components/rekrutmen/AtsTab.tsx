import React, { useState, useEffect } from 'react';
import { api, type Volunteer } from '../../lib/api';
import { $userSession } from '../../lib/store';
import { useStore } from '@nanostores/react';

export const AtsTab: React.FC = () => {
  const session = useStore($userSession);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);

  // Filter/Search State
  const [statusFilter, setStatusFilter] = useState<'baru' | 'direview' | 'diterima' | 'ditolak' | 'semua'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [divisiFilter, setDivisiFilter] = useState('semua');

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

  // Assessment state
  const [assessmentScore, setAssessmentScore] = useState<number | ''>('');
  const [assessmentNote, setAssessmentNote] = useState('');

  const fetchVolunteers = async () => {
    try {
      const res = await api.getVolunteersList();
      if (res.success) setVolunteers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChange = async (status: Volunteer['status']) => {
    if (!selectedVol || !session) return;
    const notes = assessmentNote || selectedVol.catatan_admin || '';
    
    // In a real app we might want to also save the assessment score, but for now we'll put it in notes
    const combinedNotes = assessmentScore ? `[Skor: ${assessmentScore}/10] ${notes}` : notes;

    try {
      const res = await api.updateVolunteerStatus(selectedVol.id, status, combinedNotes, session.user.email);
      if (res.success) {
        alert(res.message);
        setSelectedVol(prev => prev ? { ...prev, status, catatan_admin: combinedNotes } : null);
        fetchVolunteers();
      }
    } catch(e) {
      console.error(e);
    }
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
        alert(`Berhasil mengonversi kandidat. Employee ID: ${res.data.employee_id}`);
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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0053d0]"></div>
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
      case 'diterima': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'ditolak': return 'bg-rose-50 text-rose-800 border-rose-100';
      default: return 'bg-gray-50 text-gray-800 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Table list */}
        <div className="xl:col-span-2 bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex gap-2">
              {(['semua', 'baru', 'direview', 'diterima', 'ditolak'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border capitalize transition-all ${statusFilter === status ? 'bg-[#0053d0] text-white border-[#0053d0]' : 'bg-white border-blue-100 text-[#737686] hover:bg-blue-50'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama/no pendaftaran..."
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-blue-100 bg-[#f8f9ff] text-xs focus:outline-none focus:border-[#0053d0]"
                />
                <span className="material-symbols-outlined absolute left-3 top-2 text-sm text-[#737686]">search</span>
              </div>
              <select
                value={divisiFilter}
                onChange={(e) => setDivisiFilter(e.target.value)}
                className="px-3 py-2 rounded-full border border-blue-100 bg-white text-xs font-semibold focus:outline-none focus:border-[#0053d0]"
              >
                <option value="semua">Semua Divisi</option>
                {uniqueDivisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9ff]/80 text-[#737686] border-b border-blue-50">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider rounded-tl-xl">No. Daftar</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Nama Kandidat</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Divisi Diminati</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Status ATS</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider rounded-tr-xl text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
                {filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#737686] font-bold">
                      Tidak ada kandidat ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((v) => (
                    <tr 
                      key={v.id} 
                      className={`hover:bg-[#eff4ff]/30 transition-colors cursor-pointer ${selectedVol?.id === v.id ? 'bg-[#eff4ff]/50' : ''}`}
                      onClick={() => {
                        setSelectedVol(v);
                        setAssessmentScore('');
                        setAssessmentNote('');
                      }}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold">{v.nomor_pendaftaran}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#0b1c30] block">{v.nama_lengkap}</span>
                        <span className="text-[10px] text-[#737686] block">{v.email}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#434654]">{v.divisi_diminati}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadgeClass(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedVol(v);
                            setAssessmentScore('');
                            setAssessmentNote('');
                          }}
                          className="px-3 py-1.5 bg-white border border-blue-100 hover:bg-blue-50 text-[#0053d0] rounded-full text-xs font-bold transition-colors shadow-sm"
                        >
                          Nilai
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
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5 h-fit">
          <h3 className="font-bold text-base text-[#0b1c30] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0053d0]">assignment_ind</span>
            Assessment Kandidat
          </h3>
          
          {!selectedVol ? (
            <div className="text-center py-20 bg-[#f8f9ff]/50 rounded-2xl border border-blue-100 border-dashed text-[#737686] font-bold text-xs">
              Pilih kandidat dari tabel ATS untuk meninjau data
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-[#0b1c30]">{selectedVol.nama_lengkap}</h4>
                  <span className="text-[10px] font-semibold text-[#737686] mt-1 block">{selectedVol.nomor_pendaftaran} • {selectedVol.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadgeClass(selectedVol.status)}`}>
                  {selectedVol.status}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-50">
                <button
                  onClick={() => handleStatusChange('direview')}
                  disabled={selectedVol.status === 'direview'}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full text-xs font-bold transition-all border border-amber-200/50"
                >
                  Tandai Direview
                </button>
                <button
                  onClick={() => handleStatusChange('ditolak')}
                  disabled={selectedVol.status === 'ditolak' || selectedVol.converted_to_employee_id != null}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-full text-xs font-bold transition-all border border-rose-200/50"
                >
                  Tolak Kandidat
                </button>
                <button
                  onClick={handleOpenConvertModal}
                  disabled={selectedVol.converted_to_employee_id != null}
                  className="px-3 py-2 bg-[#0053d0] hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex-grow text-center flex items-center justify-center gap-1"
                >
                  {selectedVol.converted_to_employee_id ? 'Diterima (Sudah Karyawan)' : <><span className="material-symbols-outlined text-sm">how_to_reg</span> Terima & Konversi</>}
                </button>
              </div>

              {/* Formulir Assessment */}
              <div className="bg-[#f8f9ff]/80 rounded-xl p-4 border border-blue-100">
                <h5 className="font-bold text-[#0b1c30] text-xs uppercase tracking-wider mb-3">Formulir Penilaian HR</h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#434654] mb-1">Skor Keseluruhan (1-10)</label>
                    <input 
                      type="number" 
                      min="1" max="10"
                      value={assessmentScore}
                      onChange={(e) => setAssessmentScore(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Mis: 8"
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:border-[#0053d0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#434654] mb-1">Catatan Wawancara / Review</label>
                    <textarea 
                      rows={3}
                      value={assessmentNote}
                      onChange={(e) => setAssessmentNote(e.target.value)}
                      placeholder={selectedVol.catatan_admin || "Ketik catatan hasil seleksi di sini..."}
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:border-[#0053d0] text-xs resize-none"
                    />
                  </div>
                  <button 
                    onClick={() => handleStatusChange(selectedVol.status)} // Just save notes
                    className="w-full py-2 bg-white border border-[#0053d0] text-[#0053d0] hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors"
                  >
                    Simpan Assessment
                  </button>
                </div>
              </div>

              {/* Data Diri */}
              <div className="space-y-2 pt-2 text-xs">
                <h5 className="font-bold text-[#0b1c30] text-[10px] uppercase tracking-wider mb-2">Data Diri & Kontak</h5>
                <div className="flex justify-between"><span className="text-[#737686]">Email</span><span className="font-semibold text-[#0b1c30]">{selectedVol.email}</span></div>
                <div className="flex justify-between"><span className="text-[#737686]">WhatsApp</span><span className="font-semibold text-[#0b1c30]">{selectedVol.no_hp}</span></div>
                <div className="flex justify-between"><span className="text-[#737686]">TTL</span><span className="font-semibold text-[#0b1c30]">{selectedVol.tempat_lahir}, {selectedVol.tanggal_lahir}</span></div>
                <div>
                  <span className="text-[#737686] block mb-1">Alamat Domisili</span>
                  <p className="p-2.5 bg-gray-50 rounded-lg font-medium text-[#434654] border border-gray-100">{selectedVol.alamat}</p>
                </div>
              </div>

              {/* Pendidikan & Skill */}
              <div className="space-y-2 pt-2 text-xs">
                <h5 className="font-bold text-[#0b1c30] text-[10px] uppercase tracking-wider mb-2">Pendidikan & Keahlian</h5>
                <div className="flex justify-between"><span className="text-[#737686]">Pendidikan</span><span className="font-semibold text-[#0b1c30]">{selectedVol.pendidikan_terakhir} {selectedVol.jurusan}</span></div>
                <div className="flex justify-between"><span className="text-[#737686]">Institusi</span><span className="font-semibold text-[#0b1c30]">{selectedVol.institusi}</span></div>
                <div>
                  <span className="text-[#737686] block mb-1">Keahlian</span>
                  <p className="p-2.5 bg-gray-50 rounded-lg font-medium text-[#434654] border border-gray-100 whitespace-pre-wrap">{selectedVol.keahlian}</p>
                </div>
              </div>

              {/* Motivasi & CV */}
              <div className="space-y-2 pt-2 text-xs">
                <h5 className="font-bold text-[#0b1c30] text-[10px] uppercase tracking-wider mb-2">Ketersediaan & Berkas</h5>
                <div className="flex justify-between"><span className="text-[#737686]">Divisi Diminati</span><span className="font-semibold text-[#0b1c30]">{selectedVol.divisi_diminati}</span></div>
                <div className="flex justify-between"><span className="text-[#737686]">Durasi Gabung</span><span className="font-semibold text-[#0b1c30]">{selectedVol.durasi_kesediaan}</span></div>
                <div className="flex justify-between"><span className="text-[#737686]">Siap Mulai</span><span className="font-semibold text-[#0b1c30]">{selectedVol.tersedia_mulai}</span></div>
                <div>
                  <span className="text-[#737686] block mb-1">Motivasi</span>
                  <p className="p-2.5 bg-gray-50 rounded-lg font-medium text-[#434654] border border-gray-100 whitespace-pre-wrap">{selectedVol.motivasi}</p>
                </div>
                
                {selectedVol.catatan_admin && (
                  <div>
                    <span className="text-amber-800 font-bold block mb-1 mt-2">Riwayat Catatan HR</span>
                    <p className="p-2.5 bg-amber-50/50 border border-amber-100/50 rounded-lg font-medium text-amber-900">{selectedVol.catatan_admin}</p>
                  </div>
                )}
                
                <a
                  href={selectedVol.cv_drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f8f9ff] hover:bg-blue-50 text-[#0053d0] rounded-full font-bold text-xs transition-colors border border-blue-100 mt-4"
                >
                  <span className="material-symbols-outlined text-sm">description</span> Unduh Berkas CV
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convert to Employee Modal popup */}
      {showConvertModal && selectedVol && (
        <div className="fixed inset-0 bg-[#0b1c30]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full border border-blue-50 shadow-2xl relative">
            <h4 className="text-lg font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0053d0]">how_to_reg</span>
              Konversi ke Karyawan
            </h4>
            <p className="text-xs text-[#737686] mb-6">Tentukan penempatan kerja untuk <strong>{selectedVol.nama_lengkap}</strong>.</p>

            <form onSubmit={handleConvert} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Join Date (Tgl. Mulai)</label>
                <input
                  type="date"
                  value={convertData.join_date}
                  onChange={(e) => setConvertData(p => ({ ...p, join_date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 focus:outline-none focus:border-[#0053d0] font-semibold text-[#0b1c30] bg-[#f8f9ff]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Departemen</label>
                <select
                  value={convertData.departement}
                  onChange={(e) => setConvertData(p => ({ ...p, departement: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold text-[#0b1c30]"
                >
                  {['Sekretariat', 'Keuangan', 'LAZ Al Azhar', 'Fundraising & Partnership', 'Program'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Unit Kerja</label>
                <input
                  type="text"
                  value={convertData.unit}
                  onChange={(e) => setConvertData(p => ({ ...p, unit: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold text-[#0b1c30]"
                  placeholder="Contoh: Divisi IT"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Job Level</label>
                  <select
                    value={convertData.job_level}
                    onChange={(e) => setConvertData(p => ({ ...p, job_level: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold text-[#0b1c30]"
                  >
                    <option value="Non Staf">Non Staf / Relawan</option>
                    <option value="Staf">Staf</option>
                    <option value="Manajemen">Manajemen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#434654] mb-2">Grade Level</label>
                  <select
                    value={convertData.level}
                    onChange={(e) => setConvertData(p => ({ ...p, level: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] focus:outline-none focus:border-[#0053d0] font-semibold text-[#0b1c30]"
                  >
                    {['5A', '5C', '4A', '4B', '4C', '3A', '3B', '3C', '2A', '2B', '2C', '1', '1C'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-5 py-2.5 text-[#737686] hover:bg-gray-100 rounded-full font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="px-6 py-2.5 bg-[#0053d0] hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {converting ? 'Memproses...' : 'Proses'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
