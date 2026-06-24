import React, { useState } from 'react';
import { api } from '../../lib/api';
import { setSession } from '../../lib/store';

export const GoogleLoginButton: React.FC = () => {
  const [email, setEmail] = useState('');
  const [customRole, setCustomRole] = useState('superadmin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetEmail = email ? email : (customRole === 'superadmin' ? 'admin@alazhar.or.id' : (customRole === 'hrd' ? 'hr@alazhar.or.id' : 'manager@alazhar.or.id'));

    try {
      const res = await api.login(targetEmail);
      if (res.success && res.data) {
        setSession({
          session_token: res.data.session_token,
          expires_at: res.data.expires_at,
          user: res.data.user
        });
        window.location.href = '/dashboard';
      } else {
        setError(res.error || 'Autentikasi gagal.');
      }
    } catch (err) {
      setError('Gagal masuk ke sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 600));
      const res = await api.login('admin@alazhar.or.id');
      if (res.success && res.data) {
        setSession({
          session_token: res.data.session_token,
          expires_at: res.data.expires_at,
          user: res.data.user
        });
        window.location.href = '/dashboard';
      } else {
        setError('Google SignIn gagal.');
      }
    } catch(err) {
      setError('Kesalahan koneksi Google OAuth.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-100 flex flex-col items-center animate-scale-in mx-4 sm:mx-0">
      {/* Brand logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-[#0f2557] to-[#1e3a7a] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/20 mb-4">
        LA
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">SIMDP LAZWaf</h2>
      <p className="text-xs text-slate-400 font-semibold mt-1 mb-8 uppercase tracking-widest">Sistem Informasi Kepegawaian</p>

      {error && (
        <div className="w-full p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold mb-6 animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Simulated Google GIS Auth button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-3 border border-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.23 2.705 1.258 6.645l3.968 3.12z"
          />
          <path
            fill="#FBBC05"
            d="M16.04 15.345c-1.077.732-2.436 1.164-4.04 1.164a7.075 7.075 0 0 1-6.734-4.855L1.258 14.73C3.23 18.67 7.27 21.375 12 21.375c3.09 0 5.864-1.09 7.964-2.955l-3.924-3.075z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.825-.075-1.62-.21-2.385H12v4.515h6.48a5.54 5.54 0 0 1-2.4 3.63l3.924 3.075c2.29-2.115 3.486-5.23 3.486-8.835z"
          />
          <path
            fill="#34A853"
            d="M5.266 14.235A7.075 7.075 0 0 1 4.91 12c0-.795.137-1.56.356-2.235L1.258 6.645A11.96 11.96 0 0 0 0 12c0 1.92.45 3.735 1.258 5.355l4.008-3.12z"
          />
        </svg>
        <span>Masuk dengan Google</span>
      </button>

      <div className="w-full flex items-center justify-between gap-4 mb-6">
        <hr className="w-full border-slate-100" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">atau opsi tester</span>
        <hr className="w-full border-slate-100" />
      </div>

      {/* Developer Form for testing various Roles */}
      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Akun Demo (Role)</label>
          <select
            value={customRole}
            onChange={(e) => {
              setCustomRole(e.target.value);
              setEmail('');
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#1e3a7a] focus:ring-2 focus:ring-blue-500/10 text-xs font-semibold"
          >
            <option value="superadmin">Super Admin (admin@alazhar.or.id)</option>
            <option value="hrd">Admin HR (hr@alazhar.or.id)</option>
            <option value="manager">Manager Divisi Sekretariat (manager@alazhar.or.id)</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-medium my-1">
          <span>Password</span>
          <span className="font-semibold text-slate-500">Auto-filled (Demo)</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#0f2557] to-[#1e3a7a] hover:from-[#1a3370] hover:to-[#264a94] disabled:opacity-50 rounded-xl transition-all duration-300 shadow-md shadow-blue-900/15"
        >
          {loading ? 'Menghubungkan...' : 'Masuk Aplikasi Demo'}
        </button>
      </form>
    </div>
  );
};
