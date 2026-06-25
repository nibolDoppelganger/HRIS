import React from 'react';

export const KomponenBenefitTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Tetap & Kontrak */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
            <h3 className="font-bold text-base text-[#0b1c30] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0053d0]">verified_user</span>
              Benefit Pegawai Tetap & Kontrak
            </h3>
            <p className="text-xs text-[#737686] mb-6">Konfigurasi standar komponen tunjangan dan potongan wajib untuk pegawai berstatus Tetap dan Kontrak.</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-50 bg-[#f8f9ff]/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">health_and_safety</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">BPJS Kesehatan & Ketenagakerjaan</p>
                    <p className="text-xs text-[#737686]">Ditanggung perusahaan dan dipotong dari gaji pokok sesuai regulasi</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0053d0]"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-blue-50 bg-[#f8f9ff]/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">directions_car</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Tunjangan Transport</p>
                    <p className="text-xs text-[#737686]">Diberikan secara prorata berdasarkan kehadiran</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0053d0]"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-blue-50 bg-[#f8f9ff]/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Tunjangan Makan</p>
                    <p className="text-xs text-[#737686]">Diberikan secara prorata berdasarkan kehadiran</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0053d0]"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-blue-50 bg-[#f8f9ff]/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0053d0] flex items-center justify-center">
                    <span className="material-symbols-outlined">medical_services</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">Tunjangan Kesehatan Khusus</p>
                    <p className="text-xs text-[#737686]">Plafon reimbursement rawat jalan sesuai level jabatan</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0053d0]"></div>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-[#0053d0] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Relawan */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6 h-max">
            <h3 className="font-bold text-base text-[#0b1c30] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">volunteer_activism</span>
              Status Relawan
            </h3>
            <p className="text-xs text-[#737686] mb-6">Sesuai kebijakan (Bab 15.3), Relawan hanya menerima komponen tunggal tanpa tunjangan tambahan.</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-[#eff4ff]/30 opacity-70">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                    Gaji Pokok / Uang Saku
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                  </p>
                </div>
                <p className="text-xs text-[#737686]">Satu-satunya komponen yang diterima</p>
              </div>
              
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 opacity-50">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5 line-through">
                    BPJS & Tunjangan
                    <span className="material-symbols-outlined text-[14px] text-rose-600">cancel</span>
                  </p>
                </div>
                <p className="text-xs text-[#737686]">Otomatis dinonaktifkan sistem</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-50 flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl">
              <span className="material-symbols-outlined text-[#0053d0] text-xl">info</span>
              <p className="text-[10px] text-[#434654] leading-relaxed">Sistem payroll akan otomatis menyeleksi komponen tunjangan jika tipe pegawai diatur sebagai "Relawan" saat penambahan data pegawai.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
