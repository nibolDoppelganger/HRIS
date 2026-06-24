import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export const RecruitmentForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_hp: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    gender: 'L' as 'L' | 'P',
    alamat: '',
    pendidikan_terakhir: 'S1',
    institusi: '',
    jurusan: '',
    keahlian: '',
    motivasi: '',
    divisi_diminati: '',
    pengalaman_relawan: '',
    tersedia_mulai: '',
    durasi_kesediaan: '6 bulan'
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.getRecruitmentStatus();
        if (res.success) {
          setIsOpen(res.data.is_open);
          setAvailableDivisions(res.data.divisi_available || res.data.divisi_tersedia || []);
          if (res.data.divisi_tersedia && res.data.divisi_tersedia.length > 0) {
            setFormData(prev => ({ ...prev, divisi_diminati: res.data.divisi_tersedia[0] }));
          }
        } else {
          setIsOpen(false);
        }
      } catch (e) {
        setIsOpen(false);
      } finally {
        setLoadingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cv: 'Ukuran file maksimal adalah 2MB.' }));
      } else {
        setCvFile(file);
        setErrors(prev => {
          const copy = { ...prev };
          delete copy.cv;
          return copy;
        });
      }
    }
  };

  const validateStep = (currentStep: number) => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.nama_lengkap.trim()) errs.nama_lengkap = 'Nama lengkap wajib diisi.';
      if (!formData.email.trim()) {
        errs.email = 'Email wajib diisi.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Format email tidak valid.';
      }
      if (!formData.no_hp.trim()) errs.no_hp = 'Nomor HP wajib diisi.';
      if (!formData.tempat_lahir.trim()) errs.tempat_lahir = 'Tempat lahir wajib diisi.';
      if (!formData.tanggal_lahir) errs.tanggal_lahir = 'Tanggal lahir wajib diisi.';
      if (!formData.alamat.trim()) errs.alamat = 'Alamat lengkap wajib diisi.';
    } else if (currentStep === 2) {
      if (!formData.institusi.trim()) errs.institusi = 'Nama institusi wajib diisi.';
      if (!formData.jurusan.trim()) errs.jurusan = 'Jurusan/program studi wajib diisi.';
      if (!formData.keahlian.trim()) {
        errs.keahlian = 'Keahlian wajib diisi.';
      } else if (formData.keahlian.length < 30) {
        errs.keahlian = 'Keahlian minimal berisi 30 karakter.';
      }
    } else if (currentStep === 3) {
      if (!formData.divisi_diminati) errs.divisi_diminati = 'Divisi yang diminati wajib dipilih.';
      if (!formData.motivasi.trim()) {
        errs.motivasi = 'Motivasi wajib diisi.';
      } else if (formData.motivasi.length < 100) {
        errs.motivasi = 'Motivasi minimal berisi 100 karakter untuk menjelaskan komitmen Anda.';
      }
      if (!formData.tersedia_mulai) errs.tersedia_mulai = 'Tanggal kesediaan mulai wajib diisi.';
      if (!cvFile) errs.cv = 'Silakan unggah dokumen CV Anda (PDF).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      const res = await api.submitVolunteerApplication(formData);
      if (res.success && res.data) {
        // Redirect to success page
        window.location.href = `/rekrutmen/sukses?ticket=${res.data.nomor_pendaftaran}&name=${encodeURIComponent(formData.nama_lengkap)}&email=${encodeURIComponent(formData.email)}`;
      } else {
        setErrors({ submit: res.error || 'Terjadi kesalahan sistem.' });
      }
    } catch (err) {
      setErrors({ submit: 'Gagal mengirim pendaftaran.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="max-w-2xl mx-auto py-24 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a7a]"></div>
        <p className="text-sm text-slate-500 mt-4 font-semibold">Memeriksa status pendaftaran...</p>
      </div>
    );
  }

  if (isOpen === false) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mx-auto text-3xl mb-6 shadow-inner">
          🔒
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pendaftaran Relawan Sedang Ditutup</h2>
        <p className="text-slate-500 font-medium leading-relaxed mt-4">
          Saat ini kami tidak sedang membuka rekrutmen relawan baru. Silakan pantau terus website dan media sosial resmi LAZWaf Al Azhar untuk informasi pembukaan angkatan berikutnya.
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2.5 text-sm font-bold text-white bg-[#1e3a7a] hover:bg-[#0f2557] rounded-xl transition-all shadow-md mt-8"
        >
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-xl my-10">
      {/* Form Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          <span>Langkah {step} dari 3</span>
          <span>{step === 1 ? 'Data Diri' : step === 2 ? 'Pendidikan & Keahlian' : 'Keterangan Gabung'}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1e3a7a] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-medium">
            ⚠️ {errors.submit}
          </div>
        )}

        {/* STEP 1: DATA DIRI */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Section 1: Data Diri Pelamar</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap *</label>
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.nama_lengkap && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.nama_lengkap}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">No. Handphone (WA) *</label>
                <input
                  type="text"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                  placeholder="Contoh: 081280XXXXXX"
                />
                {errors.no_hp && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.no_hp}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tempat Lahir *</label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                  placeholder="Kota tempat lahir"
                />
                {errors.tempat_lahir && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.tempat_lahir}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal Lahir *</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                />
                {errors.tanggal_lahir && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.tanggal_lahir}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Kelamin *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex-1 hover:bg-slate-100">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'L'}
                    onChange={() => setFormData(p => ({ ...p, gender: 'L' }))}
                    className="text-[#1e3a7a] focus:ring-[#1e3a7a]"
                  />
                  <span className="text-sm font-semibold text-slate-700">Laki-Laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex-1 hover:bg-slate-100">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === 'P'}
                    onChange={() => setFormData(p => ({ ...p, gender: 'P' }))}
                    className="text-[#1e3a7a] focus:ring-[#1e3a7a]"
                  />
                  <span className="text-sm font-semibold text-slate-700">Perempuan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Lengkap *</label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                placeholder="Masukkan alamat lengkap domisili Anda saat ini"
              ></textarea>
              {errors.alamat && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.alamat}</p>}
            </div>
          </div>
        )}

        {/* STEP 2: PENDIDIKAN & KEAHLIAN */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Section 2: Pendidikan & Keahlian</h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pendidikan Terakhir *</label>
              <select
                name="pendidikan_terakhir"
                value={formData.pendidikan_terakhir}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
              >
                {['SMA/SMK', 'D3', 'S1', 'S2', 'S3'].map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Institusi *</label>
                <input
                  type="text"
                  name="institusi"
                  value={formData.institusi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                  placeholder="Contoh: Universitas Indonesia"
                />
                {errors.institusi && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.institusi}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jurusan *</label>
                <input
                  type="text"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                  placeholder="Contoh: Ilmu Komunikasi"
                />
                {errors.jurusan && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.jurusan}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keahlian / Skill Spesifik *</label>
              <textarea
                name="keahlian"
                value={formData.keahlian}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                placeholder="Deskripsikan keahlian relevan yang Anda miliki (Desain grafis, Excel formulas, copywriting, IT support, dll. Minimal 30 karakter)"
              ></textarea>
              {errors.keahlian && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.keahlian}</p>}
            </div>
          </div>
        )}

        {/* STEP 3: MOTIVASI & KETERSEDIAAN */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Section 3: Motivasi & Kesediaan</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Divisi yang Diminati *</label>
                <select
                  name="divisi_diminati"
                  value={formData.divisi_diminati}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                >
                  {availableDivisions.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
                {errors.divisi_diminati && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.divisi_diminati}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Durasi Kesediaan Gabung *</label>
                <select
                  name="durasi_kesediaan"
                  value={formData.durasi_kesediaan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                >
                  {['1 bulan', '3 bulan', '6 bulan', '1 tahun', 'Fleksibel'].map(dur => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Motivasi Bergabung *</label>
              <textarea
                name="motivasi"
                value={formData.motivasi}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                placeholder="Tuliskan motivasi utama Anda ingin bergabung sebagai relawan di LAZWaf Al Azhar. (Minimal 100 karakter)"
              ></textarea>
              {errors.motivasi && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.motivasi}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pengalaman Kegiatan Relawan Sebelumnya</label>
              <textarea
                name="pengalaman_relawan"
                value={formData.pengalaman_relawan}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                placeholder="Sebutkan jika ada (opsional)"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Siap Mulai Tanggal *</label>
                <input
                  type="date"
                  name="tersedia_mulai"
                  value={formData.tersedia_mulai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-sm"
                />
                {errors.tersedia_mulai && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.tersedia_mulai}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unggah CV Pelamar (PDF, maks 2MB) *</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1e3a7a] hover:file:bg-blue-100 border border-dashed border-slate-200 p-2.5 rounded-xl bg-slate-50/50"
                />
                {cvFile && <p className="text-xs text-[#1e3a7a] font-semibold mt-1.5">✓ {cvFile.name}</p>}
                {errors.cv && <p className="text-xs text-rose-600 font-semibold mt-1.5">{errors.cv}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Kembali
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#0f2557] hover:bg-[#1e3a7a] rounded-xl transition-all duration-300 shadow-md shadow-blue-900/10"
            >
              Lanjutkan
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#1e3a7a] hover:bg-[#0f2557] disabled:bg-blue-300 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mengirim...
                </>
              ) : (
                'Kirim Pendaftaran'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
