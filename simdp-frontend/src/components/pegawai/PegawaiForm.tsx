import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Employee, ChildEntry, CareerEntry } from '../../lib/api';
import { $userSession } from '../../lib/store';
import { useStore } from '@nanostores/react';

interface Props {
  editId?: string;
}

export const PegawaiForm: React.FC<Props> = ({ editId }) => {
  const session = useStore($userSession);
  const [loading, setLoading] = useState(!!editId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [id, setId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [departement, setDepartement] = useState('Sekretariat');
  const [unit, setUnit] = useState('Direksi');
  const [employmentStatus, setEmploymentStatus] = useState<'Tetap' | 'Kontrak' | 'Relawan'>('Tetap');
  const [level, setLevel] = useState('2B');
  const [jobLevel, setJobLevel] = useState('Staf');
  const [joinDate, setJoinDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [emailKantor, setEmailKantor] = useState('');
  const [emailPribadi, setEmailPribadi] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [maritalStatus, setMaritalStatus] = useState<'Menikah' | 'Single' | 'Janda' | 'Duda'>('Single');
  const [nik, setNik] = useState('');
  const [nikAddress, setNikAddress] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [educationLevel, setEducationLevel] = useState('S1');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionPlace, setInstitutionPlace] = useState('');
  const [graduationDate, setGraduationDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [spouseName, setSpouseName] = useState('');
  const [spouseDob, setSpouseDob] = useState('');
  const [children, setChildren] = useState<ChildEntry[]>([]);
  const [careerHistory, setCareerHistory] = useState<CareerEntry[]>([]);

  useEffect(() => {
    if (editId) {
      const fetchEmployee = async () => {
        try {
          const res = await api.getEmployeeDetail(editId);
          if (res.success && res.data) {
            const emp = res.data as Employee;
            setId(emp.id);
            setEmployeeId(emp.employee_id);
            setFullName(emp.full_name);
            setCurrentPosition(emp.current_position);
            setDepartement(emp.departement);
            setUnit(emp.unit);
            setEmploymentStatus(emp.employment_status);
            setLevel(emp.level);
            setJobLevel(emp.job_level);
            setJoinDate(emp.join_date);
            setContractEndDate(emp.contract_end_date || '');
            setEmailKantor(emp.email_kantor);
            setEmailPribadi(emp.email_pribadi || '');
            setMobilePhone(emp.mobile_phone);
            setPlaceOfBirth(emp.place_of_birth);
            setDateOfBirth(emp.date_of_birth);
            setGender(emp.gender);
            setMaritalStatus(emp.marital_status);
            setNik(emp.nik);
            setNikAddress(emp.nik_address);
            setResidentialAddress(emp.residential_address);
            setEducationLevel(emp.education_level);
            setInstitutionName(emp.institution_name);
            setInstitutionPlace(emp.institution_place);
            setGraduationDate(emp.graduation_date);
            setIsActive(emp.is_active);
            setSpouseName(emp.spouse_name || '');
            setSpouseDob(emp.spouse_dob || '');
            setChildren(emp.children || []);
            setCareerHistory(emp.career_history || []);
          } else {
            alert('Karyawan tidak ditemukan.');
            window.location.href = '/pegawai';
          }
        } catch(e) {
          alert('Gagal mengambil data.');
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    } else {
      setId('emp_' + Math.random().toString(36).substring(2, 11));
    }
  }, [editId]);

  const handleGenerateEmployeeId = async () => {
    if (!joinDate) {
      alert('Tentukan Tanggal Masuk (Join Date) terlebih dahulu.');
      return;
    }
    try {
      const res = await api.getEmployeesList();
      const count = res.success ? res.data.filter(e => e.join_date === joinDate).length : 0;
      const parsedDate = new Date(joinDate);
      const year = parsedDate.getFullYear();
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const seq = (count + 1).toString().padStart(3, '0');
      setEmployeeId(`${year}${month}${day}${seq}`);
    } catch(e) {}
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi.';
    if (!currentPosition.trim()) errs.currentPosition = 'Posisi jabatan wajib diisi.';
    if (!joinDate) errs.joinDate = 'Tanggal masuk wajib diisi.';
    if (!employeeId) errs.employeeId = 'Employee ID wajib diisi. Silakan generate.';
    if (!mobilePhone.trim()) errs.mobilePhone = 'No. HP wajib diisi.';
    if (!dateOfBirth) errs.dateOfBirth = 'Tanggal lahir wajib diisi.';
    if (!placeOfBirth.trim()) errs.placeOfBirth = 'Tempat lahir wajib diisi.';
    if (!nik.trim()) {
      errs.nik = 'NIK wajib diisi.';
    } else if (nik.length !== 16) {
      errs.nik = 'NIK harus berisi tepat 16 digit.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!validate()) return;
    
    setSubmitting(true);

    let history = [...careerHistory];
    if (history.length === 0) {
      history = [
        {
          id: 'c_' + id + '_1',
          employee_id: employeeId,
          urutan: 1,
          jabatan: currentPosition,
          departement: departement,
          unit: unit,
          mulai: joinDate,
          selesai: null,
          is_current: true,
          keterangan: 'Onboarding pegawai baru'
        }
      ];
    } else {
      history = history.map(h => h.is_current ? {
        ...h,
        jabatan: currentPosition,
        departement: departement,
        unit: unit
      } : h);
    }

    const payload: Employee = {
      id,
      employee_id: employeeId,
      full_name: fullName,
      current_position: currentPosition,
      departement,
      unit,
      employment_status: employmentStatus,
      level,
      job_level: jobLevel,
      join_date: joinDate,
      contract_end_date: contractEndDate,
      email_kantor: emailKantor,
      email_pribadi: emailPribadi,
      mobile_phone: mobilePhone,
      place_of_birth: placeOfBirth,
      date_of_birth: dateOfBirth,
      gender,
      marital_status: maritalStatus,
      nik,
      nik_address: nikAddress,
      residential_address: residentialAddress,
      education_level: educationLevel,
      institution_name: institutionName,
      institution_place: institutionPlace,
      graduation_date: graduationDate,
      is_active: isActive,
      spouse_name: spouseName,
      spouse_dob: spouseDob,
      children,
      career_history: history
    };

    try {
      const res = await api.saveEmployee(payload, session.session_token);
      if (res.success) {
        alert(editId ? 'Perubahan berhasil disimpan.' : 'Pegawai baru berhasil ditambahkan.');
        window.location.href = `/pegawai/${payload.id}`;
      } else {
        alert(res.error || 'Terjadi kesalahan saat menyimpan.');
      }
    } catch(err) {
      alert('Koneksi bermasalah.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0053d0]"></div>
        <p className="text-sm text-[#737686] mt-4 font-semibold">Memuat formulir...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-[#737686] font-medium mb-4">
        <a href="/pegawai" className="hover:text-[#0053d0] transition-colors cursor-pointer">
          Karyawan
        </a>
        <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
        <span className="text-[#0b1c30] font-bold">{editId ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</span>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-8">
        <div className="mb-8">
          <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">
            {editId ? 'Edit Profil Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
          <p className="text-xs text-[#737686] mt-1">Lengkapi data pribadi dan informasi kepegawaian di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Data Identitas Utama */}
          <div className="space-y-4">
            <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full">
              Data Identitas Utama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.fullName && <span className="text-rose-600 text-[10px]">{errors.fullName}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">NIK KTP</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="16 Digit NIK"
                  maxLength={16}
                />
                {errors.nik && <span className="text-rose-600 text-[10px]">{errors.nik}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tempat Lahir</label>
                <input
                  type="text"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="Contoh: Jakarta"
                />
                {errors.placeOfBirth && <span className="text-rose-600 text-[10px]">{errors.placeOfBirth}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal Lahir</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                />
                {errors.dateOfBirth && <span className="text-rose-600 text-[10px]">{errors.dateOfBirth}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Jenis Kelamin</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'L'|'P')}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                >
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Status Pernikahan</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                >
                  <option value="Single">Single</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Janda">Janda</option>
                  <option value="Duda">Duda</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Alamat Sesuai KTP</label>
                <textarea
                  value={nikAddress}
                  onChange={(e) => setNikAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-blue-50/50"></div>

          {/* Section 2: Info Kontak */}
          <div className="space-y-4">
            <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full">
              Informasi Kontak
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Nomor HP (WhatsApp)</label>
                <input
                  type="text"
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="0812xxxxxxxx"
                />
                {errors.mobilePhone && <span className="text-rose-600 text-[10px]">{errors.mobilePhone}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Email Pribadi</label>
                <input
                  type="email"
                  value={emailPribadi}
                  onChange={(e) => setEmailPribadi(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="nama@gmail.com"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Alamat Domisili</label>
                <textarea
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  rows={2}
                  placeholder="Kosongkan jika sama dengan KTP"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-blue-50/50"></div>

          {/* Section 3: Posisi & Kepegawaian */}
          <div className="space-y-4">
            <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full">
              Status & Penempatan Kepegawaian
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal Masuk (Join Date)</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                  {!editId && (
                    <button
                      type="button"
                      onClick={handleGenerateEmployeeId}
                      className="px-4 bg-[#eff4ff] text-[#0053d0] font-bold text-[10px] uppercase rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Generate ID
                    </button>
                  )}
                </div>
                {errors.joinDate && <span className="text-rose-600 text-[10px]">{errors.joinDate}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  readOnly={!editId}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs text-[#0b1c30] font-mono font-bold ${!editId ? 'bg-slate-100 border-slate-200' : 'bg-[#f8f9ff] border-blue-100'}`}
                />
                {errors.employeeId && <span className="text-rose-600 text-[10px]">{errors.employeeId}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Email Kantor</label>
                <input
                  type="email"
                  value={emailKantor}
                  onChange={(e) => setEmailKantor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="pegawai@al-azhar.or.id"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Divisi</label>
                <select
                  value={departement}
                  onChange={(e) => setDepartement(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                >
                  <option value="Sekretariat">Sekretariat</option>
                  <option value="Fundraising">Fundraising</option>
                  <option value="Program">Program</option>
                  <option value="Keuangan">Keuangan</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Posisi / Jabatan</label>
                <input
                  type="text"
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  placeholder="Contoh: Manajer Operasional"
                />
                {errors.currentPosition && <span className="text-rose-600 text-[10px]">{errors.currentPosition}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Status Pekerjaan</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                >
                  <option value="Tetap">Tetap</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Relawan">Relawan</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Level Grade</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                >
                  <option value="1A">1A</option>
                  <option value="1B">1B</option>
                  <option value="2A">2A</option>
                  <option value="2B">2B</option>
                  <option value="3A">3A</option>
                  <option value="3B">3B</option>
                  <option value="4A">4A</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-50/50 mt-8 mb-4"></div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => window.location.href = '/pegawai'}
              className="px-6 py-3 font-bold text-[#737686] hover:text-[#0b1c30] bg-[#f8f9ff] border border-blue-100 rounded-full text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Karyawan Baru')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
