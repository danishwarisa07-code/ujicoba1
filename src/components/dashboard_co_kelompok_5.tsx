import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { getUserAttempts, QuizAttempt } from '../firebase.ts';
import AppHeader from './AppHeader.tsx';
import AppFooter from './AppFooter.tsx';
import { 
  BookOpen, 
  PenSquare, 
  GraduationCap, 
  ArrowRight, 
  Cloud, 
  RefreshCw, 
  Clock, 
  Award, 
  CheckCircle2, 
  Lock, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DashboardCoKelompok5() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    userProfile, 
    totalStudySeconds, 
    formatStudyTime, 
    syncStatus, 
    refreshUserProfile 
  } = useAuth();

  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  useEffect(() => {
    refreshUserProfile();
    if (currentUser) {
      setLoadingAttempts(true);
      getUserAttempts(currentUser.uid)
        .then(data => setAttempts(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingAttempts(false));
    }
  }, [currentUser, refreshUserProfile]);

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || "Apprenant";
  const postTestDone = userProfile?.postTestCompleted ?? false;
  const postTestScore = userProfile?.postTestScore;
  const latihanScore = userProfile?.latihanScore;

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/60">
      <AppHeader title="Co Kelompok 5" />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700 rounded-3xl p-6 sm:p-10 mb-8 text-white shadow-xl relative overflow-hidden animate-fade-in border border-sky-800/40">
          {/* Decorative glowing blurs */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Espace d'apprentissage
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Bonjour, {displayName} ! 👋
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed mb-6">
              Selamat datang di ruang pembelajaran <span className="font-semibold text-white">Compréhension Orale</span> bertema{' '}
              <span className="italic font-serif">La gastronomie lyonnaise & Paul Bocuse</span>. Waktu aktivitas dan evaluasi Anda tersinkronisasi secara otomatis dengan Firestore.
            </p>

            {/* Live Sync Status indicator */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                    <span className="text-amber-200 font-medium">Menyinkronkan data ke Cloud...</span>
                  </>
                ) : syncStatus === 'error' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    <span className="text-red-200 font-medium">Gagal menyimpan data</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-100 font-medium">Tersinkronisasi dengan Firestore</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-sky-200">
                <Clock className="w-3.5 h-3.5 text-sky-300" />
                <span>Akumulasi Waktu: <strong className="text-white font-mono">{formatStudyTime(totalStudySeconds)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Materi */}
          <div 
            onClick={() => navigate('/materi')}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 cursor-pointer border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
                  Materi Pembelajaran
                </h2>
                <span className="text-[11px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-full">
                  Dokumen & Transkrip
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Strategi menyimak 3 tahap, kosakata kunci bouchon lyonnais, dan transkrip lengkap percakapan Chef Joseph Viola (MOF).
              </p>
            </div>
            <div className="flex items-center text-sky-600 font-semibold text-sm group-hover:text-sky-800 pt-3 border-t border-gray-100">
              Mulai Membaca <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Latihan */}
          <div 
            onClick={() => navigate('/latihan')}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 cursor-pointer border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
                <PenSquare className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                  Latihan Soal
                </h2>
                <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                  20 Soal Interaktif
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Uji pemahaman Anda dengan pembahasan instan pada setiap pilihan jawaban. Latihan dapat diulang tanpa batasan.
              </p>
            </div>
            <div className="flex items-center text-amber-600 font-semibold text-sm group-hover:text-amber-800 pt-3 border-t border-gray-100">
              {latihanScore !== undefined ? `Nilai Terakhir: ${latihanScore}/20 • Mulai Latihan` : 'Mulai Latihan'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Post-Test */}
          <div 
            onClick={() => navigate('/post-test')}
            className={`rounded-2xl p-6 sm:p-7 cursor-pointer border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between ${
              postTestDone 
                ? 'bg-emerald-50/70 border-emerald-200' 
                : 'bg-white/90 backdrop-blur-md border-emerald-100'
            }`}
          >
            <div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-all shadow-inner ${
                postTestDone
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                {postTestDone ? <CheckCircle2 className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Post-Test
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  postTestDone 
                    ? 'bg-emerald-200 text-emerald-800' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {postTestDone ? 'Terkunci (Selesai)' : '1x Percobaan'}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Evaluasi akhir video <span className="font-semibold text-gray-700">Poulet au Vinaigre (Paul Bocuse)</span>.
                {postTestDone 
                  ? ' Anda telah menyelesaikan evaluasi ini. Hasil telah tersimpan permanen di Firestore.'
                  : ' Hanya dapat dikerjakan 1 kali percobaan saja.'}
              </p>
            </div>
            <div className="flex items-center font-semibold text-sm pt-3 border-t border-gray-100 text-emerald-600 group-hover:text-emerald-800">
              {postTestDone ? (
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Lock className="w-4 h-4" /> Skor Akhir: {postTestScore}/20
                </span>
              ) : (
                <>
                  Ikuti Ujian Sekarang <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Stats & Attempts History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview Stats */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2 pb-3 border-b border-gray-100">
              <Award className="w-5 h-5 text-sky-600" />
              Ringkasan Prestasi Anda
            </h3>

            <div className="space-y-3">
              <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-sky-700 font-medium">Total Waktu Belajar</div>
                  <div className="text-xl font-black text-sky-900 font-mono mt-0.5">
                    {formatStudyTime(totalStudySeconds)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-200/60 text-sky-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-800 font-medium">Latihan Soal (Terbaik)</div>
                  <div className="text-xl font-black text-amber-900 font-mono mt-0.5">
                    {latihanScore !== undefined ? `${latihanScore} / 20` : 'Belum Mencoba'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-200/60 text-amber-700 flex items-center justify-center">
                  <PenSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-800 font-medium">Nilai Post-Test (Resmi)</div>
                  <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">
                    {postTestDone && postTestScore !== undefined ? `${postTestScore} / 20` : 'Belum Ujian'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-200/60 text-emerald-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Activity / Attempts History from Firestore */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-sky-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-600" />
                  Riwayat Aktivitas & Evaluasi
                </h3>
                <span className="text-xs text-gray-400">Tersimpan di Cloud Firestore</span>
              </div>

              {loadingAttempts ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  Memuat riwayat dari Firestore...
                </div>
              ) : attempts.length === 0 ? (
                <div className="py-10 text-center text-gray-400 bg-sky-50/30 rounded-xl border border-dashed border-sky-200">
                  <p className="text-sm font-medium text-gray-600">Belum ada riwayat pengerjaan.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Silakan mulai membaca materi atau kerjakan latihan soal untuk melihat perkembangan Anda di sini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                  {attempts.map((attempt) => (
                    <div key={attempt.id} className="py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          attempt.type === 'post-test' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {attempt.type === 'post-test' ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : (
                            <PenSquare className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {attempt.type === 'post-test' ? 'Evaluasi Akhir (Post-Test)' : 'Sesi Latihan Mandiri'}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {new Date(attempt.completedAt).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-lg ${
                          attempt.percentage >= 70 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {attempt.score} / {attempt.maxScore} ({attempt.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center mt-4">
              <span>Pengguna: <strong>{currentUser?.email}</strong></span>
              <span>UID: <code className="font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded">{currentUser?.uid.slice(0, 10)}...</code></span>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
