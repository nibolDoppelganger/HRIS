import React, { useState } from 'react';
import { api } from '../../lib/api';
import { setSession } from '../../lib/store';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('admin@alazhar.or.id');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.login(email);
      if (res?.success) {
        setSession(res.data);
        window.location.href = '/dashboard';
      } else {
        setError('Email atau password tidak valid.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    setTimeout(async () => {
      try {
        const res = await api.login('admin@alazhar.or.id');
        if (res?.success) {
          setSession(res.data);
          window.location.href = '/dashboard';
        } else {
          setError('Gagal masuk menggunakan Google SSO.');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Terjadi kesalahan sistem.');
        setIsLoading(false);
      }
    }, 600);
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
            <span className="material-symbols-outlined text-sm">lock</span>
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#0b1c30]">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#434654] uppercase tracking-wider">Alamat Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-lg">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0] focus:bg-white outline-none font-medium"
                    placeholder="nama@al-azhar.or.id"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#434654] uppercase tracking-wider">Kata Sandi</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] text-lg">
                    lock
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0] focus:bg-white outline-none font-medium"
                    placeholder="••••••••"
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
                  Ingat Saya
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Silakan hubungi administrator TI LAZWaf Al Azhar untuk memulihkan kata sandi Anda.");
                  }}
                  className="font-bold text-[#0053d0] hover:underline"
                >
                  Lupa Sandi?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0053d0] hover:bg-blue-700 disabled:bg-[#0053d0]/60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Menghubungkan...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </form>

            <div className="my-6 flex items-center justify-between text-[#737686]">
              <span className="h-px bg-blue-100/50 flex-1"></span>
              <span className="px-4 font-bold text-[10px] uppercase tracking-widest text-[#737686]/60">atau</span>
              <span className="h-px bg-blue-100/50 flex-1"></span>
            </div>

            {/* Google SSO */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-slate-50 text-[#0b1c30] font-bold py-3.5 border border-blue-100 rounded-xl transition-colors flex items-center justify-center gap-3 cursor-pointer"
            >
              {/* Clean minimal Google G-logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Google SSO
            </button>
            
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
