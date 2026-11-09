import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Clock, LogOut, ArrowLeft, UtensilsCrossed, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
  icon?: React.ReactNode;
}

export const MEMBERS_TEXT = "Alesya Sonia H (2405684) Citra Dafina Hafsa (2405356) Danish Warisa Irawan (2408737) Nabila Alisya Yuliana S (2408784)";

export default function AppHeader({
  title = "Co Kelompok 5",
  showBackButton = false,
  backTo = "/dashboard",
  icon
}: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, totalStudySeconds, formatStudyTime, logout, syncStatus } = useAuth();

  const isAuthPage = location.pathname === '/';

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || "Apprenant";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Top Bleu-Blanc-Rouge Ribbon */}
      <div className="fixed top-0 left-0 w-full h-1.5 flex z-50">
        <div className="w-1/3 bg-[#0055A4]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#EF4135]" />
      </div>

      {/* Authors bar under ribbon */}
      <div className="bg-sky-950 text-sky-100 text-[11px] sm:text-xs py-1.5 px-4 text-center border-b border-sky-800/60 sticky top-1.5 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className="inline-flex items-center gap-1 font-semibold text-sky-300">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Kelompok 5:
          </span>
          <span className="font-medium tracking-wide">
            {MEMBERS_TEXT}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-[33px] sm:top-[35px] z-30 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Brand / Back */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-9 h-9 rounded-full hover:bg-sky-50 text-gray-600 hover:text-sky-700 flex items-center justify-center transition-colors border border-gray-200"
                  title="Kembali"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              <div 
                onClick={() => navigate(currentUser ? '/dashboard' : '/')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-sky-200 transition-colors">
                  {icon ? icon : <UtensilsCrossed className="w-5 h-5 text-sky-600" />}
                </div>
                <div>
                  <div className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-sky-700 transition-colors flex items-center gap-2">
                    {title}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium hidden sm:block">
                    La gastronomie française • Compréhension Orale
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Study Timer & User Account (if authenticated) */}
            {!isAuthPage && currentUser && (
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Timer Badge */}
                <div 
                  className="flex items-center gap-2 bg-sky-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-sky-100 shadow-xs"
                  title={`Status: ${syncStatus === 'syncing' ? 'Menyimpan...' : syncStatus === 'error' ? 'Gagal menyimpan' : 'Tersinkronkan'}`}
                >
                  <Clock className={`w-4 h-4 ${syncStatus === 'syncing' ? 'text-amber-500 animate-spin' : 'text-sky-600'}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sky-800 font-medium hidden sm:block">Waktu Belajar</span>
                    <span className="font-bold text-xs sm:text-sm text-sky-700 font-mono tracking-wider">
                      {formatStudyTime(totalStudySeconds)}
                    </span>
                  </div>
                </div>

                {/* User Info & Avatar */}
                <div className="flex items-center gap-3 border-l pl-3 sm:pl-5 border-gray-200">
                  <div className="text-right hidden md:block">
                    <div className="font-semibold text-xs sm:text-sm text-gray-800 truncate max-w-[140px]">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[140px]">
                      {currentUser.email}
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {initial}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Keluar / Déconnexion"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
