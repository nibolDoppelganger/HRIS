import React, { useState } from "react";
import { Employee } from "../types";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Employee) => void;
}

export default function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    division: "Program" as Employee["division"],
    position: "",
    unit: "",
    status: "TETAP" as Employee["status"],
    level: "Staf" as Employee["level"],
    gender: "Laki-laki" as Employee["gender"],
    email: "",
    phone: "",
    birthPlace: "Jakarta",
    birthDate: "",
    identityNumber: "",
    education: "",
    maritalStatus: "Belum Menikah" as Employee["maritalStatus"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Nama wajib diisi";
    if (!formData.position.trim()) tempErrors.position = "Posisi wajib diisi";
    if (!formData.unit.trim()) tempErrors.unit = "Unit wajib diisi";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      tempErrors.email = "Email tidak valid";
    }
    if (!formData.phone.trim()) tempErrors.phone = "Nomor telepon wajib diisi";
    if (!formData.birthDate.trim()) tempErrors.birthDate = "Tanggal lahir wajib diisi";
    if (!formData.identityNumber.trim() || formData.identityNumber.length < 10) {
      tempErrors.identityNumber = "NIK KTP tidak valid (min 10 angka)";
    }
    if (!formData.education.trim()) tempErrors.education = "Pendidikan terakhir wajib diisi";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build the NIK ID based on the join year
    const currentYear = new Date().getFullYear();
    const uniqueNumber = Math.floor(100 + Math.random() * 900);
    const generatedId = `IA-${currentYear}-${uniqueNumber}`;

    // Format current date as Joined Date (e.g. 24 Jun 2026)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const joinedDate = new Date().toLocaleDateString('id-ID', options);

    const newEmployee: Employee = {
      ...formData,
      id: generatedId,
      joinedDate: joinedDate,
      tenure: "0 Bln (Baru)",
      careerHistory: [
        {
          period: `${joinedDate.split(" ")[1]} ${currentYear} - Sekarang`,
          title: formData.position,
          department: `Divisi ${formData.division}`,
        },
      ],
    };

    onAdd(newEmployee);
    onClose();
    // Reset form
    setFormData({
      name: "",
      division: "Program",
      position: "",
      unit: "",
      status: "TETAP",
      level: "Staf",
      gender: "Laki-laki",
      email: "",
      phone: "",
      birthPlace: "Jakarta",
      birthDate: "",
      identityNumber: "",
      education: "",
      maritalStatus: "Belum Menikah",
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[28px] shadow-2xl border border-blue-50/50 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-blue-50/50 flex justify-between items-center bg-[#f8f9ff]">
          <div>
            <h3 className="font-sans text-lg font-bold text-[#0b1c30]">
              Tambah Karyawan Baru
            </h3>
            <p className="text-xs text-[#737686] mt-0.5">Lengkapi data pribadi dan kepegawaian</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#737686] hover:text-[#0b1c30] p-1.5 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content/Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#0b1c30]">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Nama Lengkap</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="Ahmad Faisal"
              />
              {errors.name && <span className="text-rose-600 text-[10px]">{errors.name}</span>}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Jenis Kelamin</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Employee["gender"] })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs cursor-pointer"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Alamat Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="nama@al-azhar.or.id"
              />
              {errors.email && <span className="text-rose-600 text-[10px]">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Nomor Telepon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="+62 812-xxxx-xxxx"
              />
              {errors.phone && <span className="text-rose-600 text-[10px]">{errors.phone}</span>}
            </div>
          </div>

          <div className="border-t border-blue-50/50 my-4"></div>

          {/* HR Kepegawaian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Division */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Divisi</label>
              <select
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value as Employee["division"] })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs cursor-pointer"
              >
                <option value="Program">Program</option>
                <option value="Fundraising">Fundraising</option>
                <option value="Operasional">Operasional</option>
                <option value="Keuangan">Keuangan</option>
                <option value="HRD">HRD</option>
              </select>
            </div>

            {/* Position */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Posisi / Jabatan</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="Kepala Sub-divisi"
              />
              {errors.position && <span className="text-rose-600 text-[10px]">{errors.position}</span>}
            </div>

            {/* Unit */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Unit Kerja</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="Zakat Center"
              />
              {errors.unit && <span className="text-rose-600 text-[10px]">{errors.unit}</span>}
            </div>

            {/* Level */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Level Jabatan</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as Employee["level"] })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs cursor-pointer"
              >
                <option value="Direksi">Direksi</option>
                <option value="Manajer">Manajer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Staf">Staf</option>
                <option value="Magang/Relawan">Magang/Relawan</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Status Kontrak</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee["status"] })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs cursor-pointer"
              >
                <option value="TETAP">TETAP (Permanent)</option>
                <option value="KONTRAK">KONTRAK (Contract)</option>
                <option value="RELAWAN">RELAWAN (Volunteer)</option>
              </select>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Pendidikan Terakhir</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="S1 Manajemen, UI"
              />
              {errors.education && <span className="text-rose-600 text-[10px]">{errors.education}</span>}
            </div>
          </div>

          <div className="border-t border-blue-50/50 my-4"></div>

          {/* Personal Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NIK KTP */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">NIK KTP (Identitas)</label>
              <input
                type="number"
                value={formData.identityNumber}
                onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="3174xxxxxxxxxxxx"
              />
              {errors.identityNumber && <span className="text-rose-600 text-[10px]">{errors.identityNumber}</span>}
            </div>

            {/* Marital status */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Status Pernikahan</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as Employee["maritalStatus"] })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs cursor-pointer"
              >
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Duda/Janda">Duda/Janda</option>
              </select>
            </div>

            {/* Birth Place */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Tempat Lahir</label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="Jakarta"
              />
            </div>

            {/* Birth Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#434654] uppercase tracking-wider">Tanggal Lahir</label>
              <input
                type="text"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs"
                placeholder="12 Agustus 1980"
              />
              {errors.birthDate && <span className="text-rose-600 text-[10px]">{errors.birthDate}</span>}
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-blue-50/50 flex justify-end gap-3 bg-[#f8f9ff]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 text-[#434654] font-bold text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-[#0053d0] hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Simpan Karyawan
          </button>
        </div>
      </div>
    </div>
  );
}
