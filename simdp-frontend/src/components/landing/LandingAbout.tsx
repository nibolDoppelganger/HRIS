import React from 'react';

export const LandingAbout: React.FC = () => {
  const values = [
    { title: 'Profesional', desc: 'Pengelolaan administrasi data kepegawaian yang akurat, sistematis, dan amanah.', icon: '🎯' },
    { title: 'Terintegrasi', desc: 'Menghubungkan rekrutmen relawan, profil karir karyawan, dan pelaporan secara real-time.', icon: '🔄' },
    { title: 'Transparan', desc: 'Membuka akuntabilitas kapasitas kerja organisasi kepada seluruh donatur dan stakeholder.', icon: '👁️' }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="text-[#1e3a7a] font-extrabold text-sm uppercase tracking-wider block mb-2">Tentang LAZWaf</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Mewujudkan Layanan Kepegawaian yang Unggul & Akuntabel
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6 font-light text-sm sm:text-base">
              Lembaga Amil Zakat Wakaf Al Azhar adalah lembaga pengelola Zakat, Infaq, Sedekah, dan Wakaf produktif yang senantiasa berinovasi untuk mendampingi kemandirian mustahik di seluruh pelosok Indonesia.
            </p>
            <p className="text-slate-600 leading-relaxed font-light text-sm sm:text-base">
              Melalui SIM Data Pegawai ini, kami mengintegrasikan manajemen karir staf, koordinasi divisi, serta rekrutmen relawan untuk memastikan kinerja lembaga yang maksimal dan profesional.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="animate-fade-in-up p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100 flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
