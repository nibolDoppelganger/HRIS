import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Employee } from '../../lib/api';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

interface Props {
  id: string;
}

export const PegawaiDetail: React.FC<Props> = ({ id }) => {
  const session = useStore($userSession);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeSubTab, setActiveSubTab] = useState<
    "profil" | "kepegawaian" | "keluarga" | "karir" | "reimbursement" | "payslip" | "dokumen" | "log"
  >("profil");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.getEmployeeDetail(id);
        if (res.success && res.data) {
          setEmployee(res.data as Employee);
        } else {
          setError(res.error || 'Karyawan tidak ditemukan.');
        }
      } catch (e) {
        setError('Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const onBackToList = () => {
    window.location.href = '/pegawai';
  };

  const onEditClick = () => {
    window.location.href = `/pegawai/${id}/edit`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0053d0]"></div>
        <p className="text-sm text-[#737686] mt-4 font-semibold">Memuat profil pegawai...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="bg-white rounded-[24px] p-8 text-center text-[#737686] shadow-sm border border-blue-50/50 py-16">
        <span className="text-3xl block mb-4">⚠️</span>
        <p className="text-[#0b1c30] font-bold text-sm">{error || 'Karyawan tidak ditemukan.'}</p>
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

  const empStatus = employee.employment_status.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#737686] font-medium">
        <button onClick={onBackToList} className="hover:text-[#0053d0] transition-colors cursor-pointer">
          Karyawan
        </button>
        <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
        <span className="text-[#0b1c30] font-bold">{employee.full_name}</span>
      </div>

      {/* Large Profile Header Card */}
      <div className="bg-white rounded-[24px] shadow-sm mb-8 overflow-hidden relative border border-blue-50/50">
        <div className="h-32 bg-[#dae1ff]/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#0053d0 1.2px, transparent 1.2px)", backgroundColor: "rgba(255, 255, 255, 0.4)", backgroundSize: "20px 20px" }}></div>
        </div>

        <div className="px-8 pb-8 -mt-16 relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full">
            <div className="w-[120px] h-[120px] rounded-[24px] border-[6px] border-white overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-blue-50 text-[#0053d0] flex items-center justify-center font-bold text-3xl">
                {getInitials(employee.full_name)}
              </div>
            </div>

            <div className="flex-1 w-full pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">
                  {employee.full_name}
                </h2>
                
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                  empStatus === "TETAP"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : empStatus === "KONTRAK"
                    ? "bg-rose-50 text-rose-700 border border-rose-100"
                    : "bg-slate-50 text-[#585f6a] border border-slate-100"
                }`}>
                  {employee.employment_status}
                </span>

                <span className="px-3 py-1 bg-[#eff4ff] text-[#0053d0] rounded-full font-bold text-[10px] border border-blue-50">
                  {employee.level}
                </span>

                {!employee.is_active && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-[10px] border border-red-200">
                    NONAKTIF
                  </span>
                )}
              </div>

              <p className="font-sans text-base text-[#434654] font-medium mb-5">
                {employee.current_position} di {employee.departement}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-xs text-[#737686]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0053d0]/70 text-lg">badge</span>
                  <span className="font-bold text-[#0b1c30]">ID: {employee.employee_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0053d0]/70 text-lg">calendar_today</span>
                  <span>Bergabung {employee.join_date}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onEditClick}
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
          <div className="lg:col-span-2 space-y-6">
            {/* DATA PRIBADI CARD */}
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dae1ff]/20 rounded-bl-full pointer-events-none"></div>
              
              <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block self-start px-4 py-1.5 rounded-full relative z-10 mb-8">
                DATA PRIBADI
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10 text-xs">
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Tempat Lahir</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.place_of_birth || "-"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Tanggal Lahir</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.date_of_birth || "-"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Jenis Kelamin</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.gender === 'L' ? 'Laki-Laki' : employee.gender === 'P' ? 'Perempuan' : '-'}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Status Pernikahan</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.marital_status || "-"}</p>
                </div>
              </div>
            </div>

            {/* KONTAK & IDENTITAS CARD */}
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eff4ff] rounded-bl-full pointer-events-none"></div>

              <h3 className="font-sans text-[10px] text-[#585f6a] font-bold uppercase tracking-wider bg-[#eff4ff] inline-block self-start px-4 py-1.5 rounded-full relative z-10 mb-8">
                KONTAK & IDENTITAS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10 text-xs">
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Nomor Telepon</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.mobile_phone || "-"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Email</p>
                  <p className="font-sans text-base text-[#0053d0] font-extrabold">{employee.email_kantor || employee.email_pribadi || "-"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">NIK (KTP)</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.nik || "-"}</p>
                </div>
                <div>
                  <p className="font-sans text-[#737686] font-medium mb-1">Pendidikan Terakhir</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.education_level || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-sans text-[#737686] font-medium mb-1">Alamat Sesuai KTP</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.nik_address || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-sans text-[#737686] font-medium mb-1">Alamat Domisili</p>
                  <p className="font-sans text-base text-[#0b1c30] font-extrabold">{employee.residential_address || "-"}</p>
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

                <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-blue-50">
                  {employee.career_history && employee.career_history.length > 0 ? (
                    employee.career_history.map((stage, idx) => {
                      const isCurrent = stage.is_current;
                      return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white z-10 shadow-sm ${
                            isCurrent ? "bg-[#0053d0]" : "bg-[#c0c7d4]"
                          }`}
                        ></div>
                        <div className={isCurrent ? "bg-[#dae1ff]/20 p-5 rounded-[16px] border border-blue-50" : "p-2"}>
                          <p className={`font-sans text-xs font-bold mb-1.5 ${isCurrent ? "text-[#0053d0]" : "text-[#737686]"}`}>
                            {stage.mulai} s/d {stage.selesai || 'Sekarang'}
                          </p>
                          <p className="font-sans text-sm font-extrabold text-[#0b1c30]">
                            {stage.jabatan}
                          </p>
                          <p className="font-sans text-xs text-[#737686] mt-0.5">
                            {stage.departement} • {stage.unit}
                          </p>
                          {stage.keterangan && (
                            <p className="text-[10px] text-[#737686] leading-relaxed mt-2 bg-[#f8f9ff] p-2 rounded-xl">
                              {stage.keterangan}
                            </p>
                          )}
                        </div>
                      </div>
                    )})
                  ) : (
                    <p className="text-xs text-[#737686]">Belum ada riwayat karir tercatat.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "kepegawaian" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8 space-y-6">
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Rincian Berkas Kepegawaian</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50/50">
              <p className="text-[#737686] font-medium">No. BPJS Kesehatan</p>
              <p className="font-mono font-bold text-sm text-[#0b1c30] mt-1">{employee.bpjs_kesehatan || '-'}</p>
            </div>
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50/50">
              <p className="text-[#737686] font-medium">No. BPJS Ketenagakerjaan</p>
              <p className="font-mono font-bold text-sm text-[#0b1c30] mt-1">{employee.bpjs_ketenagakerjaan || '-'}</p>
            </div>
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50/50">
              <p className="text-[#737686] font-medium">NPWP Resmi</p>
              <p className="font-mono font-bold text-sm text-[#0b1c30] mt-1">{employee.npwp || '-'}</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <p className="text-xs">Data kepegawaian terakhir diperbarui sesuai ketentuan LAZWaf.</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/40 text-[#0b1c30]">
                {employee.spouse_name && (
                  <tr>
                    <td className="py-3 font-semibold">{employee.spouse_name}</td>
                    <td className="py-3 text-[#737686]">Pasangan</td>
                    <td className="py-3">{employee.spouse_dob || '-'}</td>
                  </tr>
                )}
                {employee.children && employee.children.map((c, i) => (
                  <tr key={i}>
                    <td className="py-3 font-semibold">{c.nama}</td>
                    <td className="py-3 text-[#737686]">Anak</td>
                    <td className="py-3">{c.dob}</td>
                  </tr>
                ))}
                {!employee.spouse_name && (!employee.children || employee.children.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-[#737686]">Belum ada data anggota keluarga tercatat dlm sistem.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabs placeholder for features that might be added later */}
      {(activeSubTab === "karir" || activeSubTab === "reimbursement" || activeSubTab === "payslip" || activeSubTab === "dokumen" || activeSubTab === "log") && (
        <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-16 text-center">
          <span className="material-symbols-outlined text-4xl text-[#c0c7d4] mb-3">construction</span>
          <h3 className="font-sans text-sm font-bold text-[#0b1c30]">Fitur Sedang Dikembangkan</h3>
          <p className="text-xs text-[#737686] mt-2">Tab {activeSubTab} akan segera tersedia pada pembaruan sistem berikutnya.</p>
        </div>
      )}
    </div>
  );
};
