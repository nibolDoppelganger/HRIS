import React from "react";

export const PelatihanView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Modul Pelatihan & Kompetensi</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Kelola sertifikasi amil dan agenda pelatihan karyawan</p>
        </div>
        <button className="bg-[#0053d0] hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-full shadow-md shadow-blue-500/15 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-lg">add</span>
          Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[24px] border border-blue-50/50 p-8 shadow-sm shadow-blue-500/5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0053d0] flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
          </div>
          <h3 className="font-bold text-lg text-[#0b1c30] mb-2">Kompetensi Zakat & Wakaf Syariah</h3>
          <p className="text-[#434654] text-sm leading-relaxed mb-6">
            Sistem pelatihan wajib bagi amil LAZWaf Al Azhar bekerjasama dengan Majelis Ulama Indonesia (MUI) dan Badan Wakaf Indonesia (BWI).
          </p>
          <div className="flex items-center gap-4 border-t border-blue-50/50 pt-6">
            <div className="flex-1">
              <p className="text-xs text-[#737686] font-semibold uppercase tracking-wider mb-1">Peserta Terdaftar</p>
              <p className="text-xl font-extrabold text-[#0053d0]">42 <span className="text-sm font-normal text-[#434654]">Amil</span></p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#737686] font-semibold uppercase tracking-wider mb-1">Sertifikat Rilis</p>
              <p className="text-xl font-extrabold text-emerald-600">128 <span className="text-sm font-normal text-[#434654]">Amil</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-blue-50/50 p-8 shadow-sm shadow-blue-500/5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-2xl">model_training</span>
          </div>
          <h3 className="font-bold text-lg text-[#0b1c30] mb-2">Pelatihan Kepemimpinan Cabang</h3>
          <p className="text-[#434654] text-sm leading-relaxed mb-6">
            Program persiapan bagi calon kepala kantor perwakilan wilayah dan manajemen tingkat menengah untuk mengelola KPW.
          </p>
          <div className="flex items-center gap-4 border-t border-blue-50/50 pt-6">
            <div className="flex-1">
              <p className="text-xs text-[#737686] font-semibold uppercase tracking-wider mb-1">Peserta Terdaftar</p>
              <p className="text-xl font-extrabold text-[#0053d0]">15 <span className="text-sm font-normal text-[#434654]">Kandidat</span></p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#737686] font-semibold uppercase tracking-wider mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#0053d0] font-bold text-xs rounded-full border border-blue-100">Sedang Berjalan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
