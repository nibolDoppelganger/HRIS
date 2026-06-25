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
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [id, setId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [departement, setDepartement] = useState('Sekretariat');
  const [unit, setUnit] = useState('Direksi');
  const [employmentStatus, setEmploymentStatus] = useState<'Tetap' | 'Kontrak' | 'Relawan'>('Tetap');
  const [level, setLevel] = useState('Level 1');
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
            setUnit(emp.unit || 'Direksi');
            setEmploymentStatus(emp.employment_status);
            setLevel(emp.level || 'Level 1');
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
            setEducationLevel(emp.education_level || 'S1');
            setInstitutionName(emp.institution_name || '');
            setInstitutionPlace(emp.institution_place || '');
            setGraduationDate(emp.graduation_date || '');
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

  const validateStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!employeeId) errs.employeeId = 'Employee ID wajib diisi. Silakan generate.';
      if (!fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi.';
      if (!currentPosition.trim()) errs.currentPosition = 'Posisi jabatan wajib diisi.';
      if (!joinDate) errs.joinDate = 'Tanggal masuk wajib diisi.';
      if (employmentStatus === 'Kontrak' && !contractEndDate) errs.contractEndDate = 'Tanggal kontrak berakhir wajib diisi.';
    } else if (step === 2) {
      if (!placeOfBirth.trim()) errs.placeOfBirth = 'Tempat lahir wajib diisi.';
      if (!dateOfBirth) errs.dateOfBirth = 'Tanggal lahir wajib diisi.';
      if (!mobilePhone.trim()) errs.mobilePhone = 'No. HP wajib diisi.';
      if (!nik.trim()) {
        errs.nik = 'NIK wajib diisi.';
      } else if (nik.length !== 16) {
        errs.nik = 'NIK harus berisi tepat 16 digit.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
  };

  const handleAddChild = () => {
    setChildren([...children, { nama: '', dob: '' }]);
  };

  const handleRemoveChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, field: 'nama' | 'dob', value: string) => {
    const newChildren = [...children];
    newChildren[index][field] = value;
    setChildren(newChildren);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!validateStep(currentStep)) return;
    
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

  const stepTitles = [
    "Identitas & Posisi",
    "Data Pribadi",
    "Pendidikan",
    "Data Keluarga"
  ];

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
          <p className="text-xs text-[#737686] mt-1">Lengkapi data pribadi dan informasi kepegawaian dalam 4 langkah.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8 bg-[#f8f9ff] p-2 rounded-2xl">
          {stepTitles.map((title, i) => (
            <div key={i} className="flex-1 text-center relative">
              {i !== 0 && (
                <div className={`absolute top-1/2 -left-[50%] w-full h-[2px] -translate-y-1/2 ${currentStep > i ? 'bg-[#0053d0]' : 'bg-[#dae1ff]'}`}></div>
              )}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStep === i + 1 ? 'bg-[#0053d0] text-white shadow-md' :
                  currentStep > i + 1 ? 'bg-[#0053d0] text-white' : 'bg-white border-2 border-[#dae1ff] text-[#737686]'
                }`}>
                  {currentStep > i + 1 ? <span className="material-symbols-outlined text-sm">check</span> : (i + 1)}
                </div>
                <span className={`text-[10px] font-bold hidden sm:block ${currentStep >= i + 1 ? 'text-[#0b1c30]' : 'text-[#737686]'}`}>{title}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Identitas & Posisi */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal Masuk (Join Date) *</label>
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
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Employee ID *</label>
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
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                  {errors.fullName && <span className="text-rose-600 text-[10px]">{errors.fullName}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Posisi Saat Ini *</label>
                  <input
                    type="text"
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                  {errors.currentPosition && <span className="text-rose-600 text-[10px]">{errors.currentPosition}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Departemen *</label>
                  <select
                    value={departement}
                    onChange={(e) => setDepartement(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                  >
                    <option value="Sekretariat">Sekretariat</option>
                    <option value="Fundraising & Partnership">Fundraising & Partnership</option>
                    <option value="Program">Program</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="LAZ Al Azhar">LAZ Al Azhar</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Status Kepegawaian *</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Relawan">Relawan (berbayar, tanpa tunjangan)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Level *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                  >
                    <option value="Level 1">Level 1 - Staf Junior / Relawan</option>
                    <option value="Level 2">Level 2 - Koordinator / Staf Senior</option>
                    <option value="Level 3">Level 3 - Manager / Koordinator Senior</option>
                    <option value="Level 4">Level 4 - Manager Senior</option>
                    <option value="Level 5">Level 5 - Direktur / Kepala Divisi</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Job Level *</label>
                  <select
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                  >
                    <option value="Direktur">Direktur</option>
                    <option value="Kepala Divisi">Kepala Divisi</option>
                    <option value="Manager Senior">Manager Senior</option>
                    <option value="Manager">Manager</option>
                    <option value="Koordinator Senior">Koordinator Senior</option>
                    <option value="Koordinator">Koordinator</option>
                    <option value="Staf Senior">Staf Senior</option>
                    <option value="Staf">Staf</option>
                    <option value="Non-Staf">Non-Staf</option>
                    <option value="Relawan">Relawan</option>
                  </select>
                </div>

                {employmentStatus === 'Kontrak' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tgl Kontrak Berakhir *</label>
                    <input
                      type="date"
                      value={contractEndDate}
                      onChange={(e) => setContractEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                    />
                    {errors.contractEndDate && <span className="text-rose-600 text-[10px]">{errors.contractEndDate}</span>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Data Pribadi */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tempat Lahir *</label>
                  <input
                    type="text"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                  {errors.placeOfBirth && <span className="text-rose-600 text-[10px]">{errors.placeOfBirth}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal Lahir *</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                  {errors.dateOfBirth && <span className="text-rose-600 text-[10px]">{errors.dateOfBirth}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Jenis Kelamin *</label>
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
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Status Pernikahan *</label>
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

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">No. HP (WA) *</label>
                  <input
                    type="text"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                    placeholder="08xxxxxxxx"
                  />
                  {errors.mobilePhone && <span className="text-rose-600 text-[10px]">{errors.mobilePhone}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Email Kantor</label>
                  <input
                    type="email"
                    value={emailKantor}
                    onChange={(e) => setEmailKantor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Email Pribadi</label>
                  <input
                    type="email"
                    value={emailPribadi}
                    onChange={(e) => setEmailPribadi(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">NIK KTP *</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                    maxLength={16}
                  />
                  {errors.nik && <span className="text-rose-600 text-[10px]">{errors.nik}</span>}
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

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Alamat Domisili</label>
                  <textarea
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                    rows={2}
                    placeholder="Sama dengan KTP..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pendidikan */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Pendidikan Terakhir</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30] cursor-pointer"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Nama Institusi</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                    placeholder="Contoh: Universitas Al Azhar"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Kota Institusi</label>
                  <input
                    type="text"
                    value={institutionPlace}
                    onChange={(e) => setInstitutionPlace(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tanggal Lulus</label>
                  <input
                    type="date"
                    value={graduationDate}
                    onChange={(e) => setGraduationDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Data Keluarga */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <p className="text-xs text-[#737686]">Data keluarga bersifat opsional, namun diperlukan untuk keperluan administrasi BPJS Kesehatan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Nama Pasangan</label>
                  <input
                    type="text"
                    value={spouseName}
                    onChange={(e) => setSpouseName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-[#434654] uppercase tracking-wider">Tgl Lahir Pasangan</label>
                  <input
                    type="date"
                    value={spouseDob}
                    onChange={(e) => setSpouseDob(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-6">
                  <h4 className="font-bold text-sm text-[#0b1c30]">Data Anak</h4>
                  <button
                    type="button"
                    onClick={handleAddChild}
                    className="text-xs font-bold text-[#0053d0] bg-[#eff4ff] hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Tambah Anak
                  </button>
                </div>
                
                {children.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-blue-200 rounded-xl bg-white">
                    <p className="text-xs text-[#737686]">Belum ada tanggungan anak.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {children.map((c, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end bg-[#f8f9ff] p-3 rounded-xl border border-blue-50">
                        <div className="flex-1 w-full">
                          <label className="font-bold text-[10px] text-[#737686] uppercase tracking-wider block mb-1">Nama Anak {idx + 1}</label>
                          <input
                            type="text"
                            value={c.nama}
                            onChange={(e) => handleChildChange(idx, 'nama', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <label className="font-bold text-[10px] text-[#737686] uppercase tracking-wider block mb-1">Tanggal Lahir</label>
                          <input
                            type="date"
                            value={c.dob}
                            onChange={(e) => handleChildChange(idx, 'dob', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(idx)}
                          className="h-[34px] px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center shrink-0"
                          title="Hapus Anak"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-blue-50/50 mt-8 mb-4"></div>

          {/* Navigation Actions */}
          <div className="flex justify-between items-center pt-2">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2.5 font-bold text-[#737686] hover:text-[#0b1c30] bg-[#f8f9ff] border border-blue-100 rounded-full text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span> Kembali
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.location.href = '/pegawai'}
                className="px-6 py-2.5 font-bold text-[#737686] hover:text-red-600 hover:bg-red-50 rounded-full text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-full text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1"
                >
                  Lanjut <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2.5 bg-[#008733] hover:bg-emerald-700 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  {submitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Karyawan')}
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
