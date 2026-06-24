import React, { useState, useEffect } from "react";
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const session = useStore($userSession);
  
  const [adminName, setAdminName] = useState("Admin");
  const [adminRole, setAdminRole] = useState("Staff");
  const [adminAvatar, setAdminAvatar] = useState("https://ui-avatars.com/api/?name=Admin&background=0053d0&color=fff");

  useEffect(() => {
    if (session?.user) {
      setAdminName(session.user.nama || session.user.email);
      setAdminRole(session.user.role_name || "Administrator");
      setAdminAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.nama || 'A')}&background=0053d0&color=fff`);
    }
  }, [session]);

  const mockNotifications = [
    { id: 1, title: "Cuti Disetujui", desc: "Cuti Ahmad Faisal disetujui", time: "2 jam yang lalu" },
    { id: 2, title: "Klaim Baru", desc: "Dian mengajukan reimbursement", time: "Kemarin, 09:15" },
    { id: 3, title: "Pemberitahuan", desc: "Kontrak Budi berakhir dlm 30 hari", time: "Kemarin, 14:30" },
  ];

  return (
    <header className="fixed top-0 right-0 left-[260px] h-[80px] flex justify-between items-center px-10 z-30 bg-white/80 backdrop-blur-md border-b border-blue-50/50 shadow-sm shadow-blue-100/10">
      {/* Left section: Breadcrumb/Page title and Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="text-xl font-bold text-[#0053d0] hidden lg:block mr-2 shrink-0">
          {title}
        </div>
        
        {/* Search input field */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-2.5 bg-[#f8f9ff] border border-transparent focus:border-[#0053d0]/30 focus:bg-white rounded-full font-sans text-sm text-[#0b1c30] placeholder-[#737686]/60 transition-all duration-200 outline-none"
            placeholder="Cari karyawan, dokumen..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#0b1c30] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right section: Notifications, Help, Admin profile */}
      <div className="flex items-center gap-4">
        {/* Icons */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#737686] hover:text-[#0053d0] hover:bg-[#eff4ff] rounded-full p-2.5 transition-colors relative cursor-pointer"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white pulse-dot"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-[320px] bg-white rounded-2xl shadow-xl border border-blue-50 p-4 z-50">
              <div className="flex justify-between items-center pb-2 border-b border-blue-50">
                <span className="font-bold text-sm text-[#0b1c30]">Notifikasi Terbaru</span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#0053d0] hover:underline cursor-pointer"
                >
                  Tandai selesai
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="text-xs p-2 hover:bg-[#f8f9ff] rounded-lg transition-colors">
                    <p className="font-bold text-[#0b1c30]">{n.title}</p>
                    <p className="text-[#434654] text-[11px] mt-0.5">{n.desc}</p>
                    <p className="text-[#737686] text-[10px] mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="text-[#737686] hover:text-[#0053d0] hover:bg-[#eff4ff] rounded-full p-2.5 transition-colors cursor-pointer"
            title="Pusat Bantuan"
          >
            <span className="material-symbols-outlined text-2xl">help</span>
          </button>
        </div>

        {/* Profile Card */}
        <div
          className="flex items-center gap-3 pl-4 border-l border-blue-50/80 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0b1c30] leading-none group-hover:text-[#0053d0] transition-colors">{adminName}</p>
            <p className="text-[11px] font-semibold text-[#737686] mt-1">{adminRole}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden ring-2 ring-transparent group-hover:ring-[#0053d0]/30 transition-all">
            <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};
