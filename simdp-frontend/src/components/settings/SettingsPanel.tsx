import React, { useState, useEffect } from 'react';
import { api, mockDB } from '../../lib/api';
import { $userSession } from '../../lib/store';
import { useStore } from '@nanostores/react';

export const SettingsPanel: React.FC = () => {
  const session = useStore($userSession);
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [appName, setAppName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = mockDB.getSettings();
        setTagline(settings.landing_tagline);
        setDescription(settings.landing_deskripsi);
        setShowStats(settings.landing_show_stats === 'true');
        setAppName(settings.app_name);

        const resLogs = await api.getAuditLogs();
        if (resLogs.success) setLogs(resLogs.data.slice(0, 15)); // Get last 15 audits
      } catch(e) {}
      finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    try {
      await api.updateRecruitmentSettings({
        landing_tagline: tagline,
        landing_deskripsi: description,
        landing_show_stats: showStats.toString(),
        app_name: appName
      }, session.user.email);
      alert('Pengaturan umum berhasil disimpan.');
      
      const resLogs = await api.getAuditLogs();
      if (resLogs.success) setLogs(resLogs.data.slice(0, 15));
    } catch(e) {
      alert('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a7a]"></div>
        <p className="text-sm text-slate-500 mt-4 font-semibold">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
      {/* Settings Form */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-md tracking-tight mb-6 text-[#0f2557] pb-2 border-b">
          Konfigurasi Kustomisasi Sistem
        </h3>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Aplikasi SIM *</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tagline Hero Landing Page *</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Paragraf Deskripsi Landing Page *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold leading-relaxed"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tampilkan Statistik Publik</label>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 max-w-xs">
              <input
                type="checkbox"
                checked={showStats}
                onChange={() => setShowStats(!showStats)}
                className="text-[#1e3a7a] focus:ring-[#1e3a7a] w-4 h-4 rounded"
              />
              <span className="font-semibold text-slate-700">Tampilkan Counter Statistik Karyawan</span>
            </label>
          </div>

          <div className="pt-6 border-t mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#1e3a7a] hover:bg-[#1e3a7a] disabled:bg-blue-300 text-white rounded-xl font-bold transition-all shadow-md"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>

      {/* System Audit Log View */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit">
        <h3 className="font-extrabold text-slate-900 text-md tracking-tight mb-4 text-slate-800 pb-2 border-b">
          Audit Log Aktivitas Terkini
        </h3>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {logs.map((log, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-1 text-[10px]">
              <div className="flex justify-between items-center text-slate-400 font-bold font-mono">
                <span>{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                <span className="text-[#1e3a7a]">{log.aksi}</span>
              </div>
              <p className="font-semibold text-slate-700 leading-tight">{log.detail}</p>
              <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                <span>User: {log.user_email}</span>
                {log.ref_id && <span className="font-mono">Ref: {log.ref_id}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
