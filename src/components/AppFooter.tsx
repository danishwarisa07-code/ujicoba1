import React from 'react';
import { MEMBERS_TEXT } from './AppHeader.tsx';
import { Heart, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-sky-100 text-gray-600 mt-auto py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand & Purpose */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sky-800 font-bold text-sm sm:text-base">
              <span>La gastronomie : Compréhension Orale</span>
              <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full font-semibold">
                Kelompok 5
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-md">
              Modul pembelajaran interaktif menyimak bahasa Prancis autentik bertema kuliner tradisional Lyonnaise & Paul Bocuse.
            </p>
          </div>

          {/* Members credits */}
          <div className="bg-sky-50/80 rounded-xl p-3 border border-sky-100/80 max-w-xl text-center md:text-right">
            <div className="text-[11px] font-semibold text-sky-900 mb-1 flex items-center justify-center md:justify-end gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tim Penyusun Kelompok 5:</span>
            </div>
            <p className="text-xs font-medium text-sky-800 leading-relaxed">
              {MEMBERS_TEXT}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>untuk pembelajaran bahasa & budaya Prancis</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-sky-500" /> Lyon & Paul Bocuse
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-sky-500" /> Evaluasi Terintegrasi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
