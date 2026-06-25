import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { $userSession } from '../../lib/store';
import { useStore } from '@nanostores/react';

export const PengaturanRekrutmenTab: React.FC = () => {
  const session = useStore($userSession);
  const [isOpen, setIsOpen] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [openDivisions, setOpenDivisions] = useState('');
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const resStatus = await api.getRecruitmentStatus();
        if (resStatus.success) {
          setIsOpen(resStatus.data.is_open);
          setInfoText(resStatus.data.info);
          setOpenDivisions(resStatus.data.divisi_tersedia.join(','));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleRecruitment = async () => {
    if (!session) return;
    setUpdatingSettings(true);
    try {
      await api.updateRecruitmentSettings({
        rekrutmen_is_open: (!isOpen).toString()
      }, session.user.email);
      setIsOpen(!isOpen);
    } catch(e) {
        console.error(e);
    } finally {
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
    } catch(e) {
        console.error(e);
    } finally {
      setUpdatingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0053d0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
        <h3 className="font-bold text-base text-[#0b1c30] mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0053d0]">settings</span>
          Pengaturan Pintu Rekrutmen Publik
        </h3>
        <p className="text-xs text-[#737686] mb-6">Konfigurasi ini akan mengubah tampilan pada halaman pendaftaran relawan (website publik).</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Toggle status */}
          <div className="p-5 bg-[#f8f9ff]/50 rounded-xl border border-blue-50 flex flex-col justify-between h-full">
            <div>
              <span className="block text-[10px] font-bold text-[#737686] uppercase tracking-wider mb-2">Status Rekrutmen Terkini</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {isOpen ? '🟢 BUKA (Menerima Lamaran)' : '🔴 TUTUP (Hanya Lihat Info)'}
              </span>
            </div>
            <button
              onClick={handleToggleRecruitment}
              disabled={updatingSettings}
              className={`mt-6 w-full py-2.5 text-xs font-bold rounded-full text-white transition-all shadow-md flex items-center justify-center gap-2 ${isOpen ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#0053d0] hover:bg-blue-700'}`}
            >
              <span className="material-symbols-outlined text-sm">{isOpen ? 'power_settings_new' : 'publish'}</span>
              {updatingSettings ? 'Proses...' : (isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran')}
            </button>
          </div>

          {/* Editor Info */}
          <form onSubmit={handleUpdateInfo} className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Teks Pengumuman Banner</label>
                <input
                  type="text"
                  value={infoText}
                  onChange={(e) => setInfoText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] text-xs focus:outline-none focus:border-[#0053d0] transition-colors"
                  placeholder="Contoh: Pendaftaran Relawan dibuka s/d 31 Juli 2026"
                />
                <p className="text-[10px] text-[#737686] mt-1">Teks ini akan muncul di banner atas halaman rekrutmen.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#434654] mb-2">Divisi Tersedia (Pisahkan dg Koma)</label>
                <input
                  type="text"
                  value={openDivisions}
                  onChange={(e) => setOpenDivisions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] text-xs focus:outline-none focus:border-[#0053d0] transition-colors"
                  placeholder="Contoh: Program,Fundraising & Partnership"
                />
                <p className="text-[10px] text-[#737686] mt-1">Pilihan dropdown yang muncul saat pelamar mengisi form.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingSettings}
                className="px-5 py-2.5 bg-[#0053d0] hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
