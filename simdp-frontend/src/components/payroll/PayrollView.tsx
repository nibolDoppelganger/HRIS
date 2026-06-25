import React, { useState } from "react";
import { DashboardPayrollTab } from "./DashboardPayrollTab";
import { SlipGajiTab } from "./SlipGajiTab";
import { KomponenBenefitTab } from "./KomponenBenefitTab";

export const PayrollView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'slip-gaji' | 'komponen-benefit'>('dashboard');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Payroll, Kompensasi & Benefit</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Penghitungan gaji pokok, tunjangan amil, potongan BPJS, dan PPh 21</p>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-blue-50/50 gap-6 hide-scrollbar">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> Dashboard & Proses
        </button>
        <button 
          onClick={() => setActiveTab('slip-gaji')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'slip-gaji' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span> Daftar Slip Gaji
        </button>
        <button 
          onClick={() => setActiveTab('komponen-benefit')}
          className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'komponen-benefit' ? 'border-[#0053d0] text-[#0053d0]' : 'border-transparent text-[#737686] hover:text-[#0b1c30]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">settings_accessibility</span> Komponen & Benefit
        </button>
      </div>

      {activeTab === 'dashboard' && <DashboardPayrollTab />}
      {activeTab === 'slip-gaji' && <SlipGajiTab />}
      {activeTab === 'komponen-benefit' && <KomponenBenefitTab />}
    </div>
  );
};

