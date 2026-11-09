import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { savePostTestResult } from '../firebase.ts';
import AppHeader from './AppHeader.tsx';
import AppFooter from './AppFooter.tsx';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Lock, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Home, 
  Tv, 
  Check, 
  Sparkles,
  Award
} from 'lucide-react';

interface QuestionItem {
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: QuestionItem[] = [
  { question: "Où se situe historiquement le mythique restaurant du chef Paul Bocuse présenté dans la vidéo ?", options: ["À Paris", "À Collonges-au-Mont-d'Or", "À Marseille", "À Bordeaux"], correctAnswer: 1 },
  { question: "Combien d'étoiles Michelin cet établissement historique a-t-il conservées pendant plusieurs décennies ?", options: ["Une étoile", "Deux étoiles", "Trois étoiles", "Aucune"], correctAnswer: 2 },
  { question: "Quel est l'ingrédient principal de la recette emblématique détaillée dans cette séquence ?", options: ["Le bœuf bourguignon", "Le poulet au vinaigre", "Le canard à l'orange", "Le saumon à l'oseille"], correctAnswer: 1 },
  { question: "Que fait-on subir aux morceaux de volaille au tout début de la préparation culinaire ?", options: ["On les fait bouillir dans l'eau salée", "On les fait rissoler et dorer dans du beurre", "On les cuit doucement à la vapeur", "On les marine pendant 24 heures"], correctAnswer: 1 },
  { question: "Quel type de vinaigre est traditionnellement recommandé pour déglacer cette recette ?", options: ["Du vinaigre balsamique sucré", "Du bon vinaigre de vin (rouge ou vieux)", "Du vinaigre de cidre doux", "Du vinaigre blanc d'alcool"], correctAnswer: 1 },
  { question: "Dans le vocabulaire gastronomique, que signifie l'action de « déglacer » la poêle avec le vinaigre ?", options: ["Refroidir la viande très rapidement", "Dissoudre et récupérer les sucs de cuisson accrochés au fond", "Enlever le gras excédentaire de la sauce", "Retirer la peau de la volaille"], correctAnswer: 1 },
  { question: "Quel ingrédient aromatique est couramment ajouté (souvent en chemise) pendant la cuisson de ce plat ?", options: ["L'ail", "L'oignon rouge", "Le poireau", "La carotte"], correctAnswer: 0 },
  { question: "Quel liquide ajoute-t-on après le vinaigre pour mouiller la viande et créer le fond de la sauce ?", options: ["Du lait entier", "Du bouillon de volaille (ou un peu d'eau)", "Du jus de pomme", "De la bière brune"], correctAnswer: 1 },
  { question: "Comment obtient-on la texture onctueuse et nappante finale de cette fameuse sauce lyonnaise ?", options: ["En ajoutant de la farine", "En mixant des légumes racines", "En incorporant de la crème fraîche et/ou du beurre", "En mettant du fromage râpé"], correctAnswer: 2 },
  { question: "Quel est l'objectif principal lorsqu'on laisse « réduire » la sauce à feu doux ?", options: ["Refroidir le plat avant le service", "Épaissir le liquide pour en concentrer les saveurs", "Changer la couleur de la viande", "Rendre le plat moins calorique"], correctAnswer: 1 },
  { question: "Quelle herbe fraîche, souvent ciselée, vient parfumer et colorer ce plat au moment du dressage ?", options: ["La menthe", "Le romarin", "L'estragon (ou le persil)", "Le basilic"], correctAnswer: 2 },
  { question: "Comment appelle-t-on le récipient lourd (souvent en fonte) utilisé pour mijoter ce type de plat traditionnel ?", options: ["Une marmite", "Une cocotte", "Un wok", "Une friteuse"], correctAnswer: 1 },
  { question: "Comment la viande doit-elle être cuite avec le couvercle pour garantir la réussite du plat ?", options: ["Saignante à cœur", "Cuite à l'étouffée pour rester très moelleuse", "Frite et extrêmement croquante", "Totalement crue à l'intérieur"], correctAnswer: 1 },
  { question: "Avant d'envoyer l'assiette au client, quelle est la dernière étape cruciale du chef ?", options: ["Napper généreusement les morceaux de poulet avec la sauce", "Saupoudrer de sucre glace", "Couper la viande en minuscules dés", "Servir la sauce à part dans un petit ramequin"], correctAnswer: 0 },
  { question: "Quel équilibre de saveurs caractérise particulièrement le poulet au vinaigre ?", options: ["L'amer et le piquant extrêmes", "L'acidité du vinaigre adoucie par la crème (aigre-doux subtil)", "Le très sucré et le salé", "L'insipide et le très gras"], correctAnswer: 1 },
  { question: "Par qui l'héritage d'excellence de Paul Bocuse est-il rigoureusement maintenu aujourd'hui dans ses cuisines ?", options: ["Par des machines automatisées", "Par sa fidèle brigade et ses chefs exécutifs", "Par des étudiants stagiaires uniquement", "Le restaurant a définitivement fermé"], correctAnswer: 1 },
  { question: "Quel signe distinctif sur la veste de ces grands chefs indique le titre prestigieux de Meilleur Ouvrier de France (MOF) ?", options: ["Un tablier entièrement doré", "Une étoile brodée sur le cœur", "Un col aux couleurs du drapeau (bleu-blanc-rouge)", "Une haute toque noire"], correctAnswer: 2 },
  { question: "Que symbolise historiquement la cuisine de Paul Bocuse dans le monde entier ?", options: ["La cuisine moléculaire et chimique", "La grande tradition bourgeoise et la générosité du terroir", "La restauration rapide de luxe", "La diététique stricte"], correctAnswer: 1 },
  { question: "Quel est l'accompagnement le plus classique servi avec un plat en sauce lyonnais de ce type ?", options: ["Des frites industrielles", "Des pommes de terre, un gratin ou des macaronis", "Une salade de fruits exotiques", "Du pain de mie grillé"], correctAnswer: 1 },
  { question: "Quel surnom honorifique donnait-on souvent à Paul Bocuse dans le milieu de la haute gastronomie ?", options: ["Le roi des desserts", "Le cuisinier du siècle (ou le Pape de la gastronomie)", "Le boucher de Lyon", "Le petit chef"], correctAnswer: 1 }
];

export default function PostTestComprehensionOrale() {
  const navigate = useNavigate();
  const { currentUser, userProfile, refreshUserProfile } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<'loading' | 'locked' | 'intro' | 'quiz' | 'results'>('loading');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Firestore lock check on mount
  useEffect(() => {
    if (userProfile) {
      if (userProfile.postTestCompleted) {
        setFinalScore(userProfile.postTestScore ?? 0);
        setCurrentScreen('locked');
      } else {
        setCurrentScreen('intro');
      }
    }
  }, [userProfile]);

  const getLetter = (idx: number) => String.fromCharCode(65 + idx);

  const startTest = () => {
    setCurrentScreen('quiz');
  };

  const selectOption = (optIdx: number) => {
    const updated = [...userAnswers];
    updated[currentQIndex] = optIdx;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if current question has selection
    if (userAnswers[currentQIndex] === null) return;
    setIsSubmitting(true);

    let calculatedScore = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) {
        calculatedScore++;
      }
    });

    setFinalScore(calculatedScore);

    // Save to Firestore permanently
    if (currentUser) {
      try {
        await savePostTestResult(currentUser.uid, calculatedScore, questions.length);
        await refreshUserProfile();
      } catch (err) {
        console.error('Error saving post-test to Firestore:', err);
      }
    }

    setIsSubmitting(false);
    setCurrentScreen('results');

    // Confetti celebration
    if (calculatedScore >= 12) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const currentQ = questions[currentQIndex];
  const selectedOption = userAnswers[currentQIndex];

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/70">
      <AppHeader 
        title="Évaluation Finale (Post-Test)" 
        showBackButton={true} 
        backTo="/dashboard"
        icon={<GraduationCap className="w-5 h-5 text-sky-600" />}
      />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 w-full py-10">
        <div className="max-w-3xl w-full">
          {/* Loading state */}
          {currentScreen === 'loading' && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-sky-100">
              <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Memverifikasi status ujian dari Firestore...</p>
            </div>
          )}

          {/* STATE 0: Locked Screen (user has already completed test) */}
          {currentScreen === 'locked' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center animate-fade-in border-t-8 border-red-500">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                <Lock className="w-10 h-10" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                Accès Verrouillé / Ujian Telah Selesai
              </h1>

              <p className="text-gray-600 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
                Anda telah menyelesaikan evaluasi akhir (Post-Test) ini. Sesuai ketentuan akademik, evaluasi ini hanya dapat dikerjakan <strong>satu kali percobaan</strong>.
              </p>

              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100 mb-8 max-w-sm mx-auto">
                <div className="text-xs text-sky-700 font-semibold uppercase tracking-wider mb-1">
                  Nilai Akhir Resmi Anda
                </div>
                <div className="text-4xl font-black text-sky-900 font-mono">
                  {finalScore} <span className="text-xl text-gray-400 font-normal">/ {questions.length}</span>
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan secara permanen di Firestore
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3.5 px-8 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour au tableau de bord (Kembali ke Dasbor)</span>
              </button>
            </div>
          )}

          {/* STATE 1: Intro & Reference Video Screen */}
          {currentScreen === 'intro' && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 text-center animate-fade-in border border-sky-100 relative overflow-hidden">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-amber-200">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Post-Test : Poulet au Vinaigre (Paul Bocuse)
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                Evaluasi akhir pemahaman lisan bahasa Prancis tingkat lanjut.
              </p>

              {/* Warning instructions card */}
              <div className="bg-amber-50 text-amber-900 p-5 rounded-2xl text-left mb-6 border border-amber-200 text-xs sm:text-sm">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  Consignes Importantes :
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                  <li>Evaluasi ini terdiri dari <strong>20 pertanyaan pilihan ganda</strong> berdasarkan video resep Paul Bocuse.</li>
                  <li><strong className="text-red-700">Peringatan:</strong> Ujian ini dibatasi secara ketat hanya untuk <strong>SATU KALI percobaan</strong>.</li>
                  <li>Setelah dikirimkan, nilai Anda akan disimpan secara permanen di database Firestore dan tidak dapat diubah kembali.</li>
                  <li>Silakan tonton video referensi di bawah ini dengan saksama sebelum memulai.</li>
                </ul>
              </div>

              {/* YouTube Video Embed Section */}
              <div className="mb-8 p-4 sm:p-6 bg-sky-50 rounded-2xl border border-sky-100 text-left">
                <div className="flex items-center gap-2 mb-2 font-bold text-sky-900 text-sm sm:text-base">
                  <Tv className="w-5 h-5 text-red-600" />
                  <span>Vidéo de Référence : Poulet au Vinaigre de Paul Bocuse</span>
                </div>
                <p className="text-xs text-sky-700 mb-4">
                  Tonton video pembelajaran autentik berikut sebelum menekan tombol mulai ujian.
                </p>

                {/* 16:9 Responsive YouTube Embed */}
                <div className="relative w-full rounded-2xl overflow-hidden shadow-md border-2 border-white aspect-video bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/PA10l4Qy3yg"
                    title="YouTube video player: Paul Bocuse Poulet au Vinaigre"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={startTest}
                className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 text-base sm:text-lg flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
              >
                <span>J'ai compris, commencer l'examen</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STATE 2: Quiz Screen */}
          {currentScreen === 'quiz' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100 animate-fade-in">
              {/* Header / Progress Bar */}
              <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-wrap justify-between items-center gap-3">
                <div className="text-xs sm:text-sm font-semibold text-gray-500">
                  Question <span className="text-xl font-black text-sky-700 font-mono">{currentQIndex + 1}</span> sur {questions.length}
                </div>

                {/* Progress Dots */}
                <div className="flex flex-wrap gap-1 max-w-[320px]">
                  {questions.map((_, idx) => {
                    const isCurrent = idx === currentQIndex;
                    const isAnswered = userAnswers[idx] !== null;
                    return (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          isCurrent
                            ? 'w-4 bg-sky-600'
                            : isAnswered
                            ? 'w-2 sm:w-2.5 bg-sky-300'
                            : 'w-2 sm:w-2.5 bg-gray-200'
                        }`}
                        title={`Soal ${idx + 1}: ${isAnswered ? 'Terjawab' : 'Belum'}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="p-6 sm:p-10">
                {/* Question */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-8 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-10">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectOption(idx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-sm font-medium ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-200 shadow-sm'
                            : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {getLetter(idx)}
                        </div>
                        <span className="flex-grow">{option}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-sky-600' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 bg-sky-600 rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQIndex === 0}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition text-sm flex items-center gap-2 ${
                      currentQIndex === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>

                  {currentQIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={selectedOption === null}
                      className={`px-7 py-2.5 rounded-xl font-semibold transition text-sm flex items-center gap-2 shadow-sm ${
                        selectedOption !== null
                          ? 'bg-sky-600 hover:bg-sky-700 text-white cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Suivant</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={selectedOption === null || isSubmitting}
                      className={`px-8 py-3 rounded-xl font-bold transition text-sm flex items-center gap-2 shadow-md ${
                        selectedOption !== null && !isSubmitting
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSubmitting ? 'Menyimpan ke Cloud...' : "Soumettre l'évaluation"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Results Screen */}
          {currentScreen === 'results' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center animate-fade-in border-t-8 border-sky-600 relative overflow-hidden">
              <Award className="absolute -left-10 -bottom-10 w-64 h-64 text-sky-50 pointer-events-none rotate-12 opacity-50" />

              <div className="relative z-10 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Évaluation Terminée
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
                  Bilan de vos compétences
                </h2>

                <div className="bg-sky-50 rounded-3xl p-6 sm:p-8 mb-6 inline-block shadow-inner border border-sky-100 w-full">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    Votre Score Officiel
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-black text-sky-800 font-mono">{finalScore}</span>
                    <span className="text-2xl text-sky-400 font-bold font-mono">/ {questions.length}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-sky-200/60 text-sm font-bold">
                    {finalScore >= 17 && (
                      <span className="text-emerald-700">🌟 Félicitations ! Mention Très Bien.</span>
                    )}
                    {finalScore >= 14 && finalScore < 17 && (
                      <span className="text-sky-700">👏 Bon travail ! Vous avez acquis l'essentiel du vocabulaire.</span>
                    )}
                    {finalScore >= 10 && finalScore < 14 && (
                      <span className="text-amber-700">👌 Passable. Il faudra revoir certaines notions clés.</span>
                    )}
                    {finalScore < 10 && (
                      <span className="text-red-600">⚠️ Insuffisant. La compréhension orale est à retravailler.</span>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-8 flex items-center justify-center gap-1.5 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Hasil ujian telah dicatat di database Firestore secara permanen. Anda tidak dapat mengubah jawaban Anda lagi.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 mx-auto"
                >
                  <Home className="w-4 h-4" />
                  <span>Retour au tableau de bord</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
