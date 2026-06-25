import React, { useState } from 'react';
import { api } from '../../lib/api';
import { setSession } from '../../lib/store';

export const LoginForm: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('admin@alazhar.or.id');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Alamat email wajib diisi");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulasi pengiriman OTP
    setTimeout(() => {
      setStep(2);
      setIsLoading(false);
    }, 800);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Masukkan 6 digit kode OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Mock verifikasi OTP & login
      const res = await api.login(email);
      if (res?.success) {
        setSession(res.data);
        window.location.href = '/dashboard';
      } else {
        setError('Kode OTP tidak valid.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem saat memverifikasi OTP.');
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex bg-[#f8f9ff] relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-blue-200/20 blur-[120px] pointer-events-none"></div>

      {/* Main Container Split Screen */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto md:p-6 lg:p-12 items-stretch justify-center relative z-10">
        
        {/* Left Side: Brand Showcase Card */}
        <div className="hidden md:flex md:w-[45%] lg:w-[48%] bg-[#0053d0] rounded-[40px] shadow-2xl relative overflow-hidden flex-col justify-between p-12 text-white">
          {/* Islamic Watermark Overlay */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shrink-0">
                <span className="font-sans text-xl font-bold text-[#0053d0]">IA</span>
              </div>
              <div>
                <h1 className="font-sans text-lg font-extrabold text-white leading-none tracking-tight">
                  Insan APU<span className="text-[#b3c5ff]">.</span>
                </h1>
                <p className="font-sans text-[10px] text-white/70 mt-1 font-semibold uppercase tracking-widest">
                  LAZWaf Al Azhar
                </p>
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div className="relative z-10 max-w-md">
            <h2 className="font-sans text-3xl font-extrabold text-white leading-tight tracking-tight">
              Sistem Manajemen Insan &amp; Amil LAZWaf Al Azhar
            </h2>
            <p className="font-sans text-sm text-[#b3c5ff] mt-4 leading-relaxed font-medium">
              Aplikasi penatausahaan kepegawaian yang amanah, profesional, transparan, dan terintegrasi penuh untuk kemaslahatan umat.
            </p>
          </div>

          {/* Secure Footer Credit */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-white/60 font-semibold uppercase tracking-wider">
            Sistem Terenkripsi End-to-End
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 border border-blue-50/50 shadow-xl shadow-blue-500/5 relative">
            
            {/* Mobile Header */}
            <div className="flex items-center gap-3 mb-8 md:hidden">
              <div className="w-9 h-9 rounded-lg bg-[#0053d0] flex items-center justify-center shrink-0">
                <span className="font-sans text-lg font-bold text-white">IA</span>
              </div>
              <div>
                <h1 className="font-sans text-base font-extrabold text-[#0b1c30] leading-none tracking-tight">
                  Insan APU
                </h1>
                <p className="font-sans text-[9px] text-[#737686] mt-0.5 font-bold uppercase tracking-widest">
                  LAZWaf Al Azhar
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30] tracking-tight">
                Masuk ke Akun
              </h2>
              <p className="font-sans text-xs text-[#737686] mt-1.5 font-semibold">
                Silakan masukkan kredensial administrator Anda
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm shrink-0">error</span>
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-4 text-xs text-[#0b1c30]">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[#434654] uppercase tracking-wider">Alamat Email Institusi</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0] focus:bg-white outline-none font-medium text-sm tracking-wide"
                      placeholder="nama@al-azhar.or.id"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-[#434654] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-blue-200 text-[#0053d0] focus:ring-[#0053d0]"
                    />
                    Ingat Perangkat Saya
                  </label>
                </div>

                {/* Send OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0053d0] hover:bg-blue-700 disabled:bg-[#0053d0]/60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Memproses...
                    </>
                  ) : (
                    "Kirim Kode OTP"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs text-[#0b1c30] animate-fade-in">
                {/* Email Display */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end">
                    <label className="font-bold text-[#434654] uppercase tracking-wider">Kode OTP</label>
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setOtp(''); setError(''); }} 
                      className="text-[#0053d0] font-bold hover:underline"
                    >
                      Ubah Email
                    </button>
                  </div>
                  <p className="text-xs text-[#737686] mb-2 font-medium">
                    Kode 6 digit telah dikirim ke <strong className="text-[#0b1c30]">{email}</strong>
                  </p>
                  
                  {/* OTP Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(val);
                      }}
                      className="w-full px-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0] focus:bg-white outline-none font-bold text-center text-2xl tracking-[0.5em]"
                      placeholder="••••••"
                      maxLength={6}
                      autoComplete="one-time-code"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full bg-[#0053d0] hover:bg-blue-700 disabled:bg-[#0053d0]/60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Memverifikasi...
                    </>
                  ) : (
                    "Verifikasi & Masuk"
                  )}
                </button>
                
                <div className="text-center pt-2">
                  <button type="button" className="text-[#737686] font-semibold hover:text-[#0053d0] transition-colors">
                    Belum menerima kode? Kirim ulang
                  </button>
                </div>
              </form>
            )}


          </div>

          {/* Underneath footer copyright */}
          <p className="font-sans text-[11px] text-[#737686] mt-8 text-center font-medium">
            Insan APU HR System © 2026. Hak Cipta Dilindungi.<br />
            Lembaga Amil Zakat &amp; Wakaf Al Azhar.
          </p>
        </div>

      </div>
    </div>
  );
};
