import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  resetUserPassword 
} from '../firebase.ts';
import AppHeader from './AppHeader.tsx';
import AppFooter from './AppFooter.tsx';
import { Mail, Lock, User, Waves, ArrowRight, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AutentikasiCoKelompok5() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formType, setFormType] = useState<'login' | 'register' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If already authenticated, redirect to /dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      await loginWithEmail(email.trim(), password);
      showToast('Berhasil masuk! Mengalihkan ke dasbor...', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Akun tidak ditemukan atau kata sandi keliru.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = 'Kata sandi salah. Silakan coba lagi.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi.';
      }
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      showToast('Kata sandi minimal 6 karakter.', 'error');
      return;
    }
    setLoading(true);

    try {
      await registerWithEmail(name.trim(), email.trim(), password);
      showToast('Pendaftaran akun berhasil! Selamat datang.', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMsg = 'Gagal mendaftar. Silakan coba kembali.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Email ini sudah terdaftar. Silakan gunakan menu masuk.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Format email tidak valid.';
      }
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Silakan masukkan email Anda terlebih dahulu.', 'error');
      return;
    }
    setLoading(true);

    try {
      await resetUserPassword(email.trim());
      showToast('Tautan reset kata sandi telah dikirim ke email Anda!', 'success');
      setFormType('login');
    } catch (err: any) {
      console.error('Password reset error:', err);
      showToast('Gagal mengirim tautan reset. Pastikan email terdaftar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      showToast('Membuka autentikasi Google...', 'info');
      await loginWithGoogle();
      showToast('Berhasil masuk dengan akun Google!', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast('Gagal masuk via Google. Silakan coba lagi atau gunakan email.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-900 via-sky-800 to-sky-700 animate-gradient">
      {/* Header */}
      <AppHeader title="Co Kelompok 5" />

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-50 animate-fade-in">
          <div
            className={`px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 text-white text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-sky-600'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in border border-sky-100">
          {/* French Flag Ribbon on Top of Card */}
          <div className="absolute top-0 left-0 w-full h-2 flex">
            <div className="w-1/3 bg-[#0055A4]" />
            <div className="w-1/3 bg-gray-100" />
            <div className="w-1/3 bg-[#EF4135]" />
          </div>

          <div className="p-8 sm:p-10 pt-10">
            {/* Logo / Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Waves className="w-8 h-8 text-sky-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Co Kelompok 5
              </h1>
              <p className="text-xs text-sky-700 font-semibold uppercase tracking-wider mt-1">
                La gastronomie lyonnaise
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {formType === 'login' && 'Selamat datang kembali! Silakan masuk ke akun Anda.'}
                {formType === 'register' && 'Buat akun baru untuk mulai mencatat progres belajar.'}
                {formType === 'forgot' && 'Masukkan email terdaftar untuk mengatur ulang kata sandi.'}
              </p>
            </div>

            {/* LOGIN FORM */}
            {formType === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormType('forgot')}
                      className="text-xs font-medium text-sky-600 hover:text-sky-800 transition"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="px-3 text-xs text-gray-400 font-medium">ATAU</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition shadow-xs text-sm"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                    alt="Google Logo"
                  />
                  Masuk dengan Google
                </button>

                <p className="text-center text-xs text-gray-600 mt-5">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setFormType('register')}
                    className="font-bold text-sky-600 hover:text-sky-800 transition"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {formType === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Kata Sandi (Min. 6 Karakter)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Mendaftarkan...' : 'Buat Akun'}
                  <Sparkles className="w-4 h-4" />
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="px-3 text-xs text-gray-400 font-medium">ATAU</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition shadow-xs text-sm"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                    alt="Google Logo"
                  />
                  Daftar dengan Google
                </button>

                <p className="text-center text-xs text-gray-600 mt-5">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setFormType('login')}
                    className="font-bold text-sky-600 hover:text-sky-800 transition"
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {formType === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="bg-sky-50 text-sky-800 p-3.5 rounded-xl text-xs border border-sky-100 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    Masukkan email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Anda
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                >
                  {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                </button>

                <p className="text-center text-xs text-gray-600 mt-5">
                  Ingat kata sandi Anda?{' '}
                  <button
                    type="button"
                    onClick={() => setFormType('login')}
                    className="font-bold text-sky-600 hover:text-sky-800 transition"
                  >
                    Kembali ke Masuk
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
