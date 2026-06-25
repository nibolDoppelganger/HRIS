import React, { useState } from 'react';
import { UserManagement } from './UserManagement';

export const HakAksesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'akun' | 'matrix'>('akun');

  const tabs = [
    { id: 'akun', label: 'Manajemen Akun', icon: 'manage_accounts' },
    { id: 'matrix', label: 'Matrix Hak Akses', icon: 'admin_panel_settings' },
  ];

  const permissions = [
    { modul: 'Dashboard', admin: true, hr: true, manager: 'Divisi Sendiri', staf: 'Terbatas' },
    { modul: 'Data Pegawai - View', admin: true, hr: true, manager: 'Divisi Sendiri', staf: false },
    { modul: 'Data Pegawai - Mutasi (Tambah/Edit)', admin: true, hr: true, manager: false, staf: false },
    { modul: 'Riwayat Karir', admin: true, hr: true, manager: 'Divisi Sendiri', staf: false },
    { modul: 'Reimbursement - Pengajuan', admin: true, hr: true, manager: true, staf: true },
    { modul: 'Reimbursement - Approval L1', admin: true, hr: true, manager: 'Divisi Sendiri', staf: false },
    { modul: 'Kehadiran - Cuti/Absen', admin: true, hr: true, manager: true, staf: 'Diri Sendiri' },
    { modul: 'Payroll - View Slip Gaji', admin: true, hr: true, manager: 'Divisi Sendiri', staf: 'Diri Sendiri' },
    { modul: 'Administrasi HR - Helpdesk', admin: true, hr: true, manager: true, staf: true },
    { modul: 'Konfigurasi Sistem / Master', admin: true, hr: false, manager: false, staf: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Hak Akses & Manajemen Akun</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Kelola daftar pengguna sistem dan matriks otorisasi per level.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-blue-50/50 flex w-full max-w-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'akun' | 'matrix')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#0053d0] text-white shadow-md shadow-blue-500/20'
                : 'text-[#737686] hover:bg-[#f8f9ff] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'akun' && (
        <div className="mt-6">
          <UserManagement />
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden mt-6">
          <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/50">
            <div>
              <h3 className="font-bold text-sm text-[#0b1c30]">Matrix Role-Based Access Control (RBAC)</h3>
              <p className="text-[10px] text-[#737686] mt-0.5">Konfigurasi izin baca dan tulis untuk setiap modul di aplikasi.</p>
            </div>
            <button className="text-xs font-bold text-white bg-[#0053d0] hover:bg-blue-700 px-4 py-2 rounded-full shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">save</span> Simpan Perubahan
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                  <th className="px-6 py-4">Modul / Fitur</th>
                  <th className="px-6 py-4 text-center">Super Admin</th>
                  <th className="px-6 py-4 text-center">Admin HR</th>
                  <th className="px-6 py-4 text-center">Manager Divisi</th>
                  <th className="px-6 py-4 text-center">Staf Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/40">
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-[#eff4ff]/20">
                    <td className="px-6 py-4 font-bold text-[#0b1c30]">{perm.modul}</td>
                    
                    {[perm.admin, perm.hr, perm.manager, perm.staf].map((val, i) => (
                      <td key={i} className="px-6 py-4 text-center">
                        {typeof val === 'boolean' ? (
                          <span className={`material-symbols-outlined text-lg ${val ? 'text-emerald-500' : 'text-rose-400'}`}>
                            {val ? 'check_circle' : 'cancel'}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-100">
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
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
