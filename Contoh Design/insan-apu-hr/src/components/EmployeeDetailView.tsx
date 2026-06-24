import React, { useState } from "react";
import { Employee } from "../types";

interface EmployeeDetailViewProps {
  employee: Employee | null;
  onBackToList: () => void;
  onEditClick: (employee: Employee) => void;
}

export default function EmployeeDetailView({
  employee,
  onBackToList,
  onEditClick,
}: EmployeeDetailViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "profil" | "kepegawaian" | "keluarga" | "karir" | "reimbursement" | "payslip" | "dokumen" | "log"
  >("profil");

  if (!employee) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-[#737686]">
        Karyawan tidak ditemukan. Silakan kembali ke daftar karyawan.
        <button
          onClick={onBackToList}
          className="mt-4 px-5 py-2.5 bg-[#0053d0] text-white rounded-full text-xs font-bold"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const tabsList = [
    { id: "profil", label: "Profil" },
    { id: "kepegawaian", label: "Kepegawaian" },
    { id: "keluarga", label: "Keluarga" },
    { id: "karir", label: "Karir" },
    { id: "reimbursement", label: "Reimbursement" },
    { id: "payslip", label: "Payslip" },
    { id: "dokumen", label: "Dokumen" },
    { id: "log", label: "Log" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#737686] font-medium">
        <button onClick={onBackToList} className="hover:text-[#0053d0] transition-colors cursor-pointer">
          Karyawan
        </button>
        <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
        <span className="text-[#0b1c30] font-bold">{employee.name}</span>
      </div>

      {/* Large Profile Header Card */}
      <div className="bg-white rounded-[24px] shadow-sm mb-8 overflow-hidden relative border border-blue-50/50">
        {/* Blue Cover Section */}
        <div className="h-32 bg-[#dae1ff]/30 relative overflow-hidden">
          {/* Dot Grid Visual Overlay */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#0053d0 1.2px, transparent 1.2px)", backgroundColor: "rgba(255, 255, 255, 0.4)", backgroundSize: "20px 20px" }}></div>
        </div>

        {/* Info Grid Block */}
        <div className="px-8 pb-8 -mt-16 relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full">
            {/* Round Avatar Container */}
            <div className="w-[120px] h-[120px] rounded-[24px] border-[6px] border-white overflow-hidden bg-white shrink-0 shadow-sm">
              {employee.avatarUrl ? (
                <img
                  src={employee.avatarUrl}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 text-[#0053d0] flex items-center justify-center font-bold text-3xl">
                  {getInitials(employee.name)}
                </div>
              )}
            </div>

            {/* Profile Info details */}
            <div className="flex-1 w-full pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">
                  {employee.name}
                </h2>
                
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                  employee.status === "TETAP"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}>
                  {employee.status}
                </span>

                <span className="px-3 py-1 bg-[#eff4ff] text-[#0053d0] rounded-full font-bold text-[10px] border border-blue-50">
                  {employee.levelGrade || employee.level}
                </span>
              </div>

              <p className="font-sans text-base text-[#434654] font-medium mb-5">
                {employee.position}
              </p>

              {/* Detail parameters list */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-xs text-[#737686]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0053d0]/70 text-lg">badge</span>
                  <span className="font-bold text-[#0b1c30]">ID: {employee.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0053d0]/70 text-lg">calendar_today</span>
                  <span>Bergabung {employee.joinedDate}</span>
                </div>
                {employee.supervisorName && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0053d0]/70 text-lg">supervisor_account</span>
                    <span>Atasan: <span className="font-bold text-[#0053d0]">{employee.supervisorName}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0053d0]/70 text-lg">groups</span>
                  <span>Bawahan Langsung: <span className="font-bold text-[#0b1c30]">{employee.directReportsCount || 0}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Trigger */}
          <button
            onClick={() => onEditClick(employee)}
            className="w-full lg:w-auto shrink-0 bg-[#0053d0] hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md shadow-blue-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profil
          </button>
        </div>
      </div>

      {/* Tabs Row Navigation */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-x-auto scroll-hidden mb-8 border border-blue-50/50 p-2">
        <div className="flex min-w-max gap-1.5">
          {tabsList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-5 py-2.5 rounded-[14px] font-sans text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-[#0053d0]/15 text-[#0053d0]"
                  : "text-[#737686] hover:text-[#0b1c30] hover:bg-blue-50/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeSubTab === "profil" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Data Pribadi & Kontak (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* DATA PRIBADI CARD */}
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 relative overflow-hidden flex flex-col justify-between">
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dae1ff]/20 rounded-bl-full pointer-events-none"></div>
              
              <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block self-start px-4 py-1.5 rounded-full relative z-10 mb-8">
                DATA PRIBADI
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10 text-xs">
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Tempat Lahir</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.birthPlace || "Jakarta"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Tanggal Lahir</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.birthDate || "12 Agustus 1980"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Jenis Kelamin</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.gender}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Status Pernikahan</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.maritalStatus || "Menikah"}</p>
                </div>
              </div>
            </div>

            {/* KONTAK & IDENTITAS CARD */}
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eff4ff] rounded-bl-full pointer-events-none"></div>

              <h3 className="font-sans text-[10px] text-[#585f6a] font-bold uppercase tracking-wider bg-[#eff4ff] inline-block self-start px-4 py-1.5 rounded-full relative z-10 mb-8">
                KONTAK &amp; IDENTITAS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10 text-xs">
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Nomor Telepon</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.phone || "+62 812-3456-7890"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Email Internal</p>
                  <p className="font-sans text-base text-[#0053d0] font-extrabold">{employee.email}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">NIK (KTP)</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.identityNumber || "3174091208800001"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Pendidikan Terakhir</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.education || "S2 Manajemen, UI"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Karir Timeline Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full">
                    RIWAYAT KARIR
                  </h3>
                </div>

                {/* Timeline connector list */}
                <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-blue-50">
                  {employee.careerHistory && employee.careerHistory.length > 0 ? (
                    employee.careerHistory.map((stage, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot */}
                        <div
                          className={`absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white z-10 shadow-sm ${
                            idx === 0 ? "bg-[#0053d0]" : "bg-[#c0c7d4]"
                          }`}
                        ></div>
                        <div className={idx === 0 ? "bg-[#dae1ff]/20 p-5 rounded-[16px] border border-blue-50" : "p-2"}>
                          <p className={`font-sans text-xs font-bold mb-1.5 ${idx === 0 ? "text-[#0053d0]" : "text-[#737686]"}`}>
                            {stage.period}
                          </p>
                          <p className="font-sans text-sm font-extrabold text-[#0b1c30]">
                            {stage.title}
                          </p>
                          <p className="font-sans text-xs text-[#737686] mt-0.5">
                            {stage.department}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#737686]">Belum ada riwayat karir tercatat.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mocking other tabs beautifully */}
      {activeSubTab === "kepegawaian" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Rincian Berkas Kepegawaian</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50/50">
              <p className="text-[#737686] font-medium">Status Pajak (PTKP)</p>
              <p className="font-bold text-sm text-[#0b1c30] mt-1">K/1 (Menikah, 1 Anak)</p>
            </div>
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50/50">
              <p className="text-[#737686] font-medium">No. BPJS Ketenagakerjaan</p>
              <p className="font-mono font-bold text-sm text-[#0b1c30] mt-1">08092104821</p>
            </div>
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50/50">
              <p className="text-[#737686] font-medium">NPWP Resmi</p>
              <p className="font-mono font-bold text-sm text-[#0b1c30] mt-1">12.345.678.9-012.000</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <p className="text-xs">Dokumen kontrak kerja terbaru telah ditandatangani secara digital via <strong>AmanahSign</strong>.</p>
          </div>
        </div>
      )}

      {activeSubTab === "keluarga" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Data Anggota Keluarga / Tanggungan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-blue-50">
              <thead>
                <tr className="text-[#737686] font-bold">
                  <th className="py-3">Nama Anggota</th>
                  <th className="py-3">Hubungan</th>
                  <th className="py-3">Tanggal Lahir</th>
                  <th className="py-3">No. Telepon / Darurat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/40 text-[#0b1c30]">
                {employee.maritalStatus === "Menikah" ? (
                  <>
                    <tr>
                      <td className="py-3 font-semibold">Sarah Amelia</td>
                      <td className="py-3 text-[#737686]">Istri</td>
                      <td className="py-3">04 Des 1983</td>
                      <td className="py-3">+62 812-7766-5544 (Darurat)</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold">Firas Al-Fatih</td>
                      <td className="py-3 text-[#737686]">Anak Kandung</td>
                      <td className="py-3">12 Mei 2011</td>
                      <td className="py-3">-</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-[#737686]">Belum ada anggota keluarga tercatat dlm sistem.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "karir" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Sertifikasi &amp; Pelatihan Terdaftar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-blue-50 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0053d0]">workspace_premium</span>
              <div>
                <p className="font-bold text-[#0b1c30]">Certified Human Resource Manager (CHRM)</p>
                <p className="text-[10px] text-[#737686] mt-0.5">Diberikan oleh BNSP - Valid s/d Des 2028</p>
              </div>
            </div>
            <div className="p-4 border border-blue-50 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0053d0]">school</span>
              <div>
                <p className="font-bold text-[#0b1c30]">Latihan Kepemimpinan Tingkat Menengah</p>
                <p className="text-[10px] text-[#737686] mt-0.5">Penyelenggara: Yayasan Al Azhar Indonesia (2022)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "reimbursement" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Riwayat Klaim Reimbursement</h3>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-bold text-[10px]">
              2 Klaim Sedang Diproses
            </span>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left divide-y divide-blue-50">
              <thead>
                <tr className="text-[#737686] font-bold">
                  <th className="py-3">No. Klaim</th>
                  <th className="py-3">Deskripsi Klaim</th>
                  <th className="py-3">Nominal (IDR)</th>
                  <th className="py-3">Tanggal Pengajuan</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/40 text-[#0b1c30]">
                <tr>
                  <td className="py-3 font-mono">CLM-2026-004</td>
                  <td className="py-3 font-semibold">Pembelian Buku Manajemen Yayasan</td>
                  <td className="py-3">Rp 450.000</td>
                  <td className="py-3">18 Jun 2026</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-semibold text-[10px]">PENDING</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-mono">CLM-2026-001</td>
                  <td className="py-3 font-semibold">Biaya Perjalanan Dinas Surabaya</td>
                  <td className="py-3">Rp 2.400.000</td>
                  <td className="py-3">12 Mei 2026</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[10px]">DISETUJUI</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "payslip" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Slip Gaji Bulanan</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-4 bg-[#f8f9ff] hover:bg-[#eff4ff]/60 border border-blue-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0053d0]">payments</span>
                <div>
                  <p className="font-bold">Slip Gaji - Mei 2026</p>
                  <p className="text-[10px] text-[#737686] mt-0.5">Ditransfer ke Bank Syariah Indonesia (BSI)</p>
                </div>
              </div>
              <button
                onClick={() => alert("Mengunduh slip gaji Mei 2026...")}
                className="px-4 py-2 bg-white border border-blue-100 text-[#0053d0] font-bold rounded-full text-[11px] hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Unduh PDF
              </button>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#f8f9ff] hover:bg-[#eff4ff]/60 border border-blue-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0053d0]">payments</span>
                <div>
                  <p className="font-bold">Slip Gaji - April 2026</p>
                  <p className="text-[10px] text-[#737686] mt-0.5">Ditransfer ke Bank Syariah Indonesia (BSI)</p>
                </div>
              </div>
              <button
                onClick={() => alert("Mengunduh slip gaji April 2026...")}
                className="px-4 py-2 bg-white border border-blue-100 text-[#0053d0] font-bold rounded-full text-[11px] hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "dokumen" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Dokumen &amp; Berkas Pendukung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-blue-50 rounded-xl flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0053d0]">picture_as_pdf</span>
                <span className="font-bold truncate text-[#0b1c30]">Scan KTP.pdf</span>
              </div>
              <button onClick={() => alert("Membuka scan KTP...")} className="text-[#0053d0] hover:underline font-bold text-left self-start cursor-pointer">Lihat Berkas</button>
            </div>
            <div className="p-4 border border-blue-50 rounded-xl flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0053d0]">picture_as_pdf</span>
                <span className="font-bold truncate text-[#0b1c30]">Ijazah S2 Resmi.pdf</span>
              </div>
              <button onClick={() => alert("Membuka Ijazah...")} className="text-[#0053d0] hover:underline font-bold text-left self-start cursor-pointer">Lihat Berkas</button>
            </div>
            <div className="p-4 border border-blue-50 rounded-xl flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0053d0]">description</span>
                <span className="font-bold truncate text-[#0b1c30]">CV_Update_2025.docx</span>
              </div>
              <button onClick={() => alert("Mengunduh CV...")} className="text-[#0053d0] hover:underline font-bold text-left self-start cursor-pointer">Unduh File</button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "log" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-4">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Audit Log Kepegawaian</h3>
          <div className="space-y-4 text-xs relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-blue-50/50">
            <div className="relative">
              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#0053d0]"></div>
              <p className="font-semibold text-[#0b1c30]">Informasi Profil diubah oleh Admin HR</p>
              <p className="text-[10px] text-[#737686] mt-0.5">24 Jun 2026, 08:34 UTC</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#737686]"></div>
              <p className="font-semibold text-[#0b1c30]">Dokumen KTP ditambahkan ke sistem</p>
              <p className="text-[10px] text-[#737686] mt-0.5">18 Jan 2026, 11:20 UTC</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#737686]"></div>
              <p className="font-semibold text-[#0b1c30]">Promosi Jabatan: Diangkat menjadi Kepala Divisi Sekretariat</p>
              <p className="text-[10px] text-[#737686] mt-0.5">01 Mar 2021, 00:01 UTC</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
