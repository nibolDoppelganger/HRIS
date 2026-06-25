import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const AdministrasiHRPanel: React.FC = () => {
  const session = useStore($userSession);
  const [activeTab, setActiveTab] = useState<'onboarding' | 'aset' | 'dokumen' | 'helpdesk'>('onboarding');

  const tabs = [
    { id: 'onboarding', label: 'Onboarding & Offboarding', icon: 'checklist' },
    { id: 'aset', label: 'Manajemen Aset', icon: 'devices' },
    { id: 'dokumen', label: 'Template Dokumen', icon: 'description' },
    { id: 'helpdesk', label: 'HR Helpdesk', icon: 'support_agent' },
  ] as const;

  const mockOnboarding = [
    { id: 1, name: 'Budi Santoso', role: 'Staf Program', type: 'Onboarding', progress: 80, status: 'In Progress' },
    { id: 2, name: 'Rina Gunawan', role: 'Koordinator', type: 'Onboarding', progress: 100, status: 'Completed' },
    { id: 3, name: 'Andi Wijaya', role: 'Relawan', type: 'Offboarding', progress: 40, status: 'In Progress' },
  ];

  const mockAset = [
    { id: 'AST-001', nama: 'Laptop Lenovo ThinkPad', kategori: 'Laptop', dipinjamkanKe: 'Rahmatullah Sidik', tanggalPinjam: '2024-01-15', kondisi: 'Baik' },
    { id: 'AST-002', nama: 'HP Samsung Galaxy A54', kategori: 'HP Dinas', dipinjamkanKe: 'Ahmad Maulana', tanggalPinjam: '2025-03-10', kondisi: 'Baik' },
    { id: 'AST-003', nama: 'Motor Honda Vario 160', kategori: 'Kendaraan', dipinjamkanKe: 'Budi Santoso', tanggalPinjam: '2023-11-20', kondisi: 'Rusak Ringan' },
  ];

  const mockHelpdesk = [
    { id: 'TKT-101', kategori: 'Cuti', subjek: 'Kendala Pengajuan Cuti Tahunan', pengaju: 'Siti Aminah', tanggal: '2026-06-20', status: 'Open' },
    { id: 'TKT-102', kategori: 'Payslip', subjek: 'Komponen BPJS Tidak Sesuai', pengaju: 'Rina Gunawan', tanggal: '2026-06-22', status: 'In Progress' },
    { id: 'TKT-103', kategori: 'Reimbursement', subjek: 'Klaim Transport Ditolak', pengaju: 'Andi Wijaya', tanggal: '2026-06-18', status: 'Resolved' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Administrasi HR</h2>
          <p className="text-xs text-[#737686] mt-0.5">Kelola siklus kerja, aset perusahaan, dan operasional SDM.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-x-auto scroll-hidden border border-blue-50/50 p-2">
        <div className="flex min-w-max gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-[14px] font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#0053d0] text-white shadow-sm"
                  : "text-[#737686] hover:text-[#0b1c30] hover:bg-blue-50/40"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'onboarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden">
              <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/50">
                <h3 className="font-bold text-sm text-[#0b1c30]">Daftar Tugas Aktif</h3>
                <button className="text-xs font-bold text-[#0053d0] hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                  + Buat Checklist Baru
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                      <th className="px-6 py-4">Karyawan</th>
                      <th className="px-6 py-4">Tipe</th>
                      <th className="px-6 py-4">Progres</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50/40">
                    {mockOnboarding.map(task => (
                      <tr key={task.id} className="hover:bg-[#eff4ff]/20">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#0b1c30]">{task.name}</p>
                          <p className="text-[10px] text-[#737686]">{task.role}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            task.type === 'Onboarding' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {task.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full h-1.5 bg-blue-50 rounded-full overflow-hidden max-w-[100px]">
                              <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-[#0053d0]'}`} style={{ width: `${task.progress}%` }}></div>
                            </div>
                            <span className="font-bold text-[10px] text-[#0b1c30]">{task.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 hover:bg-blue-50 text-[#0053d0] rounded-lg transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#0053d0] to-blue-800 rounded-[24px] shadow-sm p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
              <h3 className="font-extrabold text-lg mb-1">Onboarding Template</h3>
              <p className="text-xs text-blue-100 mb-6">Kelola standar penyambutan karyawan baru di setiap divisi.</p>
              <button className="w-full bg-white text-[#0053d0] font-bold text-xs py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition-colors">
                Kelola Template
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'aset' && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden">
          <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/50">
            <div>
              <h3 className="font-bold text-sm text-[#0b1c30]">Daftar Aset Perusahaan</h3>
              <p className="text-[10px] text-[#737686] mt-0.5">Laptop, Kendaraan, dan Inventaris Kantor yang dipinjamkan.</p>
            </div>
            <button className="text-xs font-bold text-white bg-[#0053d0] hover:bg-blue-700 px-4 py-2 rounded-full shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">add</span> Tambah Aset
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                  <th className="px-6 py-4">Kode Aset</th>
                  <th className="px-6 py-4">Nama Aset</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Dipinjamkan Ke</th>
                  <th className="px-6 py-4">Kondisi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/40">
                {mockAset.map((aset) => (
                  <tr key={aset.id} className="hover:bg-[#eff4ff]/20">
                    <td className="px-6 py-4 font-mono font-bold text-[#0053d0]">{aset.id}</td>
                    <td className="px-6 py-4 font-bold text-[#0b1c30]">{aset.nama}</td>
                    <td className="px-6 py-4 text-[#434654]">{aset.kategori}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-[#0053d0]">
                          {aset.dipinjamkanKe.charAt(0)}
                        </div>
                        <span className="font-medium text-[#0b1c30]">{aset.dipinjamkanKe}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        aset.kondisi === 'Baik' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {aset.kondisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold text-[#0053d0] bg-[#eff4ff] hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'dokumen' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[20px] shadow-sm border border-blue-50/50 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
            </div>
            <h4 className="font-bold text-sm text-[#0b1c30]">Kontrak Kerja (PKWT)</h4>
            <p className="text-[10px] text-[#737686] mt-1 mb-4">Template standar untuk pegawai kontrak.</p>
            <button className="text-xs font-bold text-[#0053d0] bg-[#eff4ff] px-4 py-1.5 rounded-full mt-auto">Download</button>
          </div>
          <div className="bg-white rounded-[20px] shadow-sm border border-blue-50/50 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-[#0053d0] rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <h4 className="font-bold text-sm text-[#0b1c30]">Surat Peringatan (SP)</h4>
            <p className="text-[10px] text-[#737686] mt-1 mb-4">Draft SP 1, 2, dan 3 berformat Word.</p>
            <button className="text-xs font-bold text-[#0053d0] bg-[#eff4ff] px-4 py-1.5 rounded-full mt-auto">Download</button>
          </div>
          <div className="bg-white rounded-[20px] border border-dashed border-blue-200 p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50/30 transition-colors cursor-pointer text-[#737686] hover:text-[#0053d0]">
            <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
            <h4 className="font-bold text-sm">Upload Template Baru</h4>
          </div>
        </div>
      )}

      {activeTab === 'helpdesk' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-[#0053d0] to-blue-800 rounded-[20px] shadow-sm p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full pointer-events-none"></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">Tiket Aktif</p>
              <h3 className="font-sans text-4xl font-extrabold">24</h3>
            </div>
            
            <div className="bg-white rounded-[20px] shadow-sm border border-blue-50/50 p-5 space-y-3">
              <h4 className="font-bold text-xs text-[#0b1c30] uppercase tracking-wider mb-2">Filter Status</h4>
              <button className="w-full flex justify-between items-center px-3 py-2 bg-blue-50/50 text-[#0053d0] font-bold text-xs rounded-xl border border-blue-100">
                Semua Tiket <span className="bg-white px-2 py-0.5 rounded-full text-[10px]">128</span>
              </button>
              <button className="w-full flex justify-between items-center px-3 py-2 text-[#434654] font-medium hover:bg-[#f8f9ff] text-xs rounded-xl transition-colors">
                Open <span className="bg-[#f8f9ff] px-2 py-0.5 rounded-full text-[10px]">12</span>
              </button>
              <button className="w-full flex justify-between items-center px-3 py-2 text-[#434654] font-medium hover:bg-[#f8f9ff] text-xs rounded-xl transition-colors">
                In Progress <span className="bg-[#f8f9ff] px-2 py-0.5 rounded-full text-[10px]">12</span>
              </button>
              <button className="w-full flex justify-between items-center px-3 py-2 text-[#434654] font-medium hover:bg-[#f8f9ff] text-xs rounded-xl transition-colors">
                Resolved <span className="bg-[#f8f9ff] px-2 py-0.5 rounded-full text-[10px]">104</span>
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 overflow-hidden">
              <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]/50">
                <h3 className="font-bold text-sm text-[#0b1c30]">Daftar Tiket Helpdesk</h3>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-lg">search</span>
                  <input type="text" placeholder="Cari ID tiket atau subjek..." className="pl-10 pr-4 py-2 bg-white border border-blue-100 rounded-full text-xs w-[250px] focus:outline-none focus:border-[#0053d0] transition-colors" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                      <th className="px-6 py-4">ID Tiket</th>
                      <th className="px-6 py-4">Subjek & Kategori</th>
                      <th className="px-6 py-4">Pengaju</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50/40">
                    {mockHelpdesk.map((tiket) => (
                      <tr key={tiket.id} className="hover:bg-[#eff4ff]/20 cursor-pointer">
                        <td className="px-6 py-4 font-mono font-bold text-[#0053d0]">{tiket.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#0b1c30]">{tiket.subjek}</p>
                          <p className="text-[10px] text-[#737686] mt-0.5">{tiket.kategori}</p>
                        </td>
                        <td className="px-6 py-4 text-[#434654] font-medium">{tiket.pengaju}</td>
                        <td className="px-6 py-4 text-[#737686]">{tiket.tanggal}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            tiket.status === 'Open' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            tiket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            {tiket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
