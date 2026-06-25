import React, { useState } from "react";
import { AtsTab } from "./AtsTab";
import { LowonganTab } from "./LowonganTab";
import { ManpowerTab } from "./ManpowerTab";
import { PengaturanRekrutmenTab } from "./PengaturanRekrutmenTab";

export const RekrutmenAdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ats' | 'lowongan' | 'mpp' | 'settings'>('ats');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Rekrutmen & Talent Acquisition</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Kelola lowongan pekerjaan, proses ATS pelamar, dan manpower planning</p>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-blue-50/50 gap-6 hide-scrollbar">
        <button 
          onClick={() => setActiveTab('ats')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ats' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">recent_actors</span> ATS & Kandidat
        </button>
        <button 
          onClick={() => setActiveTab('lowongan')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'lowongan' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">work</span> Manajemen Lowongan
        </button>
        <button 
          onClick={() => setActiveTab('mpp')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'mpp' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">group_add</span> Manpower Planning
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span> Pengaturan Rekrutmen
        </button>
      </div>

      {activeTab === 'ats' && <AtsTab />}
      {activeTab === 'lowongan' && <LowonganTab />}
      {activeTab === 'mpp' && <ManpowerTab />}
      {activeTab === 'settings' && <PengaturanRekrutmenTab />}
    </div>
  );
};
