import React from "react";
import { useStore } from '@nanostores/react';
import { $isSidebarOpen } from '../../lib/store';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const isSidebarOpen = useStore($isSidebarOpen);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { id: "pegawai", label: "Karyawan", icon: "badge", href: "/pegawai" },
    { id: "import", label: "Import Data", icon: "upload_file", href: "/import" },
    { id: "orgchart", label: "Struktur Organisasi", icon: "account_tree", href: "/org-chart" },
    { id: "kehadiran", label: "Kehadiran", icon: "event_available", href: "/kehadiran" },
    { id: "payroll", label: "Payroll", icon: "payments", href: "/payroll" },
    { id: "reimbursement", label: "Reimbursement", icon: "receipt_long", href: "/reimbursement" },
    { id: "rekrutmen", label: "Rekrutmen", icon: "person_add", href: "/rekrutmen-admin" },
    { id: "pelatihan", label: "Pelatihan", icon: "school", href: "/pelatihan" },
    { id: "performance", label: "Penilaian Kinerja", icon: "trending_up", href: "/performance" },
    { id: "administrasi-hr", label: "Administrasi HR", icon: "admin_panel_settings", href: "/administrasi-hr" },
    { id: "laporan", label: "Laporan", icon: "description", href: "/laporan" },
    { id: "pengaturan", label: "Pengaturan", icon: "settings", href: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('simdp_session');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => $isSidebarOpen.set(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-full flex flex-col z-40 w-[260px] bg-[#0053d0] shadow-lg shadow-blue-500/10 rounded-tr-[40px] rounded-br-[40px] overflow-hidden transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col h-full relative z-10">
          {/* Brand Header */}
          <div className="px-8 py-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0">
                <span className="font-sans text-xl font-bold text-[#0053d0]">IA</span>
              </div>
              <div>
                <h1 className="font-sans text-lg font-extrabold text-white leading-none tracking-tight">
                  Insan APU<span className="text-[#b3c5ff]">.</span>
                </h1>
                <p className="font-sans text-[10px] text-white/70 mt-1 font-semibold uppercase tracking-widest">
                  LAZWaf Al Azhar
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button 
              className="lg:hidden text-white/70 hover:text-white p-1 rounded-full transition-colors"
              onClick={() => $isSidebarOpen.set(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto scroll-hidden px-4 py-2 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentPath.startsWith(item.href);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => $isSidebarOpen.set(false)}
                  className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-[#0053d0] shadow-md shadow-blue-900/10 font-bold"
                      : "text-[#b3c5ff] hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span 
                    className="material-symbols-outlined text-2xl shrink-0"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-white/10 space-y-1.5">
            <a
              href="/pusat-bantuan"
              onClick={() => $isSidebarOpen.set(false)}
              className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentPath.startsWith("/pusat-bantuan")
                  ? "bg-white text-[#0053d0] shadow-md shadow-blue-900/10 font-bold"
                  : "text-[#b3c5ff] hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="material-symbols-outlined text-2xl shrink-0">help</span>
              <span className="truncate">Pusat Bantuan</span>
            </a>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-3.5 rounded-xl font-sans text-sm font-medium text-[#b3c5ff] hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-2xl shrink-0">logout</span>
              <span className="truncate">Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
