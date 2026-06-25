import React, { useState, useEffect } from 'react';

export const AbsensiTab: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    alert("Berhasil Clock In! Foto selfie dan lokasi telah disimpan.");
    setIsCheckedIn(true);
  };

  const formattedTime = currentTime ? currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }) : "00:00:00";

  const formattedDate = currentTime ? currentTime.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : "Memuat...";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel Clock In/Out */}
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-8 shadow-sm shadow-blue-500/5 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0053d0] rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          
          <h3 className="font-mono text-5xl font-extrabold text-[#0b1c30] tracking-tight">{formattedTime}</h3>
          <p className="text-[#737686] text-sm font-semibold mt-2">{formattedDate}</p>

          <div className="w-full bg-[#f8f9ff] rounded-xl p-4 mt-6 text-left border border-blue-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">my_location</span>
              <div>
                <p className="text-xs font-bold text-[#0b1c30]">Lokasi Saat Ini</p>
                <p className="text-[10px] text-[#737686]">Kantor Pusat LAZWaf Al Azhar, Jakarta</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600 text-lg">face</span>
              <div>
                <p className="text-xs font-bold text-[#0b1c30]">Verifikasi Wajah (Liveness)</p>
                <p className="text-[10px] text-[#737686]">Kamera siap digunakan</p>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full flex gap-4">
            {!isCheckedIn ? (
              <button 
                onClick={handleCheckIn}
                className="flex-1 py-4 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-full text-sm shadow-md shadow-blue-500/15 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                Clock In Sekarang
              </button>
            ) : (
              <button 
                onClick={() => alert("Berhasil Clock Out! Selamat beristirahat.")}
                className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full text-sm shadow-md shadow-amber-500/15 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Clock Out (Pulang)
              </button>
            )}
          </div>
        </div>

        {/* Panel Status Hari Ini */}
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-8 shadow-sm shadow-blue-500/5">
          <h3 className="font-bold text-lg text-[#0b1c30] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">history</span> 
            Aktivitas Hari Ini
          </h3>

          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-emerald-100">
              <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-[9px] border-4 border-white"></div>
              <p className="text-xs font-bold text-[#737686] uppercase tracking-wider mb-1">Clock In (Masuk)</p>
              {isCheckedIn ? (
                <>
                  <p className="text-2xl font-mono font-bold text-[#0b1c30]">07:45 WIB</p>
                  <p className="text-xs text-[#737686] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    Kantor Pusat
                  </p>
                </>
              ) : (
                <p className="text-sm font-semibold text-[#c0c7d4] italic">Belum absen masuk</p>
              )}
            </div>

            <div className="relative pl-6 border-l-2 border-amber-100">
              <div className="absolute w-4 h-4 rounded-full bg-amber-300 -left-[9px] border-4 border-white"></div>
              <p className="text-xs font-bold text-[#737686] uppercase tracking-wider mb-1">Clock Out (Pulang)</p>
              <p className="text-sm font-semibold text-[#c0c7d4] italic">Belum absen pulang</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0053d0]">info</span>
              <div>
                <p className="text-xs font-bold text-[#0053d0]">Info Shift Anda</p>
                <p className="text-xs text-[#434654] mt-1">Shift Regular: 08:00 - 17:00 WIB. Toleransi keterlambatan maksimal 15 menit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
