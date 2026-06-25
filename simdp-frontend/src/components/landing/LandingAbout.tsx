import React from 'react';

export const LandingAbout: React.FC = () => {
  const values = [
    { title: 'Profesional', desc: 'Pengelolaan administrasi data kepegawaian yang akurat, sistematis, dan amanah.', icon: '🎯' },
    { title: 'Terintegrasi', desc: 'Menghubungkan rekrutmen amil zakat, profil karir karyawan, dan pelaporan secara real-time.', icon: '🔄' },
    { title: 'Transparan', desc: 'Membuka akuntabilitas kapasitas kerja organisasi kepada seluruh donatur dan stakeholder.', icon: '👁️' }
  ];

  return (
    <section className="py-16 bg-[#f8f9ff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="text-[#0053d0] font-extrabold text-sm uppercase tracking-wider block mb-2">Tentang LAZWaf</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight leading-tight mb-6">
              Mewujudkan Layanan Kepegawaian yang Unggul & Akuntabel
            </h2>
            <p className="text-[#737686] leading-relaxed mb-6 font-medium text-sm sm:text-base">
              Lembaga Amil Zakat Wakaf Al Azhar adalah lembaga pengelola Zakat, Infaq, Sedekah, dan Wakaf produktif yang senantiasa berinovasi untuk mendampingi kemandirian mustahik di seluruh pelosok Indonesia.
            </p>
            <p className="text-[#737686] leading-relaxed font-medium text-sm sm:text-base">
              Melalui SIM Data Pegawai ini, kami mengintegrasikan manajemen karir staf, koordinasi divisi, serta rekrutmen amil zakat untuk memastikan kinerja lembaga yang maksimal dan profesional.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="animate-fade-in-up p-5 sm:p-6 bg-white rounded-3xl border border-blue-50/50 flex gap-4 items-start shadow-sm shadow-blue-500/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                <div className="w-12 h-12 bg-[#f8f9ff] rounded-2xl flex items-center justify-center text-xl shadow-inner border border-blue-50/50 flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-base sm:text-lg mb-1">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-[#737686] font-medium leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
