import React from "react";

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { id: "pegawai", label: "Karyawan", icon: "badge", href: "/pegawai" },
    { id: "kehadiran", label: "Kehadiran", icon: "event_available", href: "/kehadiran" },
    { id: "payroll", label: "Payroll", icon: "payments", href: "/payroll" },
    { id: "rekrutmen", label: "Rekrutmen", icon: "person_add", href: "/rekrutmen-admin" },
    { id: "pelatihan", label: "Pelatihan", icon: "school", href: "/pelatihan" },
    { id: "pengaturan", label: "Pengaturan", icon: "settings", href: "/settings" },
    { id: "laporan", label: "Laporan", icon: "description", href: "/laporan" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('simdp_session');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40 w-[260px] bg-[#0053d0] shadow-lg shadow-blue-500/10 rounded-tr-[40px] rounded-br-[40px] overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      <div className="flex flex-col h-full relative z-10">
        {/* Brand Header */}
        <div className="px-8 py-10">
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
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto scroll-hidden px-4 py-2 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentPath.startsWith(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
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
  );
};
