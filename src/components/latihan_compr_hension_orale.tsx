import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { saveLatihanResult } from '../firebase.ts';
import AppHeader from './AppHeader.tsx';
import AppFooter from './AppFooter.tsx';
import confetti from 'canvas-confetti';
import { 
  Headphones, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Award, 
  ClipboardList,
  Sparkles
} from 'lucide-react';

interface QuestionItem {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: QuestionItem[] = [
  { question: "Qui est le chef qui a repris ce bouchon traditionnel lyonnais en 2004 ?", options: ["Paul Bocuse", "Joseph Viola", "Alain Ducasse", "Georges Blanc"], correctAnswer: 1, explanation: "Le restaurant a été repris par le chef Joseph Viola en 2004, perpétuant ainsi la tradition de l'ancienne famille." },
  { question: "Quelle caractéristique vestimentaire montre que le chef est Meilleur Ouvrier de France (MOF) ?", options: ["Une toque très haute", "Un tablier noir", "Un col bleu-blanc-rouge", "Une veste dorée"], correctAnswer: 2, explanation: "La présentatrice souligne que Joseph Viola porte « un col bleu-blanc-rouge », symbole distinctif des Meilleurs Ouvriers de France." },
  { question: "Que signifie le terme « cardinaliser » utilisé par le chef à propos des écrevisses ?", options: ["Les couper en petits morceaux", "Les faire rougir très fort à la cuisson", "Les mariner dans du vin blanc", "Les servir avec du fromage"], correctAnswer: 1, explanation: "Le chef explique : « cardinaliser, donc rougir très fort, un peu comme moi là ! »." },
  { question: "Quel alcool est ajouté dans la préparation de la fameuse sauce Nantua ?", options: ["Du rhum", "Du vin rouge", "Du cognac", "Du calvados"], correctAnswer: 2, explanation: "Après avoir fait rougir les carcasses, le chef y ajoute une belle garniture aromatique et du cognac." },
  { question: "D'après le chef, quel ingrédient permet de faire gratiner la sauce ?", options: ["Le gruyère râpé", "La crème montée", "Le beurre fondu", "La chapelure"], correctAnswer: 1, explanation: "Le chef précise : « C'est la crème montée qui fait gratiner la sauce. »" },
  { question: "Quel plat à la sauce Nantua était le plat du jour que la présentatrice a failli prendre ?", options: ["Le gratin de truite", "La quenelle de brochet", "Le poulet de Bresse", "Le foie de veau"], correctAnswer: 0, explanation: "Elle mentionne : « Le gratin de truite, là ? C'était le plat du jour. On a failli le prendre... »" },
  { question: "Dans la tradition lyonnaise des entrées, comment servait-on autrefois la salade de lentilles ou de museau ?", options: ["Directement sur la table sans assiette", "Dans des petits ramequins individuels", "Dans de grands saladiers posés au milieu", "Uniquement sur commande spéciale"], correctAnswer: 2, explanation: "Autrefois, on posait les « saladiers » sur la table, contrairement à la présentation moderne dressée à l'assiette." },
  { question: "Pour quelle spécialité culinaire le chef Joseph Viola a-t-il été sacré « champion du monde » ?", options: ["Le gratin dauphinois", "L'omelette du curé", "Le pâté en croûte", "La tarte aux pralines"], correctAnswer: 2, explanation: "Il a été champion du monde du pâté en croûte. La présentatrice le recommande fortement : « Il faut prendre ça ici. La croûte est dingue ! »" },
  { question: "Quelle clientèle étrangère est particulièrement présente lors du service de 19h30 ?", options: ["Les Japonais", "Les Américains", "Les Italiens", "Les Anglais"], correctAnswer: 1, explanation: "La présentatrice remarque qu'à 19h30, « il y a plein d'Américains », et suppose que les Lyonnais mangent plus tard." },
  { question: "Quel ingrédient de luxe se cache à l'intérieur de la fameuse « omelette du curé » ?", options: ["Des truffes noires", "Du foie gras", "Des écrevisses", "Du homard"], correctAnswer: 2, explanation: "En ouvrant l'omelette, elle s'exclame : « Dedans, il y a des écrevisses. »" },
  { question: "Comment la présentatrice qualifie-t-elle la sauce Nantua de cette omelette ?", options: ["Un peu trop salée", "Très légère et diététique", "Incroyable et extraordinaire", "Trop épicée à son goût"], correctAnswer: 2, explanation: "Elle décrit la recette comme « extraordinaire » et affirme que la sauce Nantua « est incroyable ! »." },
  { question: "Quel plat est offert par le chef (« de la part du chef ») et qualifié de « plat estival » ?", options: ["Le foie de veau", "Le tendron de veau", "Le steak au poivre", "La volaille aux morilles"], correctAnswer: 1, explanation: "Le serveur annonce le tendron fermier, et la présentatrice précise : « c'est le plat estival : tendron de veau. »" },
  { question: "Qu'est-ce qui donne un côté « plus provençal » à ce tendron de veau ?", options: ["L'utilisation de lavande", "La présence d'olives et de tomates", "L'ajout de basilic frais", "La cuisson à l'huile d'olive uniquement"], correctAnswer: 1, explanation: "Elle justifie ce côté provençal en disant : « Il y a des olives dessus et de la tomate. »" },
  { question: "Dans quelle matière grasse les pommes de terre à la lyonnaise sont-elles cuites ?", options: ["Le beurre noisette", "L'huile de tournesol", "La graisse de canard", "Le saindoux"], correctAnswer: 2, explanation: "Elle indique clairement : « des pommes de terre cuites à la lyonnaise, donc dans la graisse de canard. »" },
  { question: "Quelle est la particularité du gratin de pâtes servi dans ce bouchon ?", options: ["Il est servi al dente comme en Italie", "Il est cuit dans un bouillon de bœuf", "Il est en béchamel et n'est pas al dente", "Il est farci à la viande hachée"], correctAnswer: 2, explanation: "C'est un « gratin de pâtes à la française, pas du tout al dente comme les Italiens », avec de la béchamel." },
  { question: "Selon la présentatrice, quelle difficulté physique majeure affrontent les jeunes cuisiniers dans ce restaurant ?", options: ["La cuisine est en sous-sol sans lumière", "L'espace est hyper exigu et il fait très chaud", "Ils doivent porter de lourdes charges", "Ils n'ont pas le droit de parler"], correctAnswer: 1, explanation: "Elle admire les cuisiniers car « non seulement il fait très chaud, mais en plus c'est hyper exigu. »" },
  { question: "Quel est le dessert final commandé à la fin du repas ?", options: ["Une tarte aux pommes", "Une île flottante à la praline rose", "Un fondant au chocolat", "Des œufs à la neige classiques"], correctAnswer: 1, explanation: "Le serveur annonce clairement : « Une île flottante à la praline rose. »" },
  { question: "Quelle est la différence technique entre une île flottante et des œufs à la neige selon les explications ?", options: ["L'île flottante est cuite au four", "L'île flottante est d'un seul tenant", "Les œufs à la neige n'ont pas de crème", "Il n'y a aucune différence culinaire"], correctAnswer: 1, explanation: "Elle explique qu'une île flottante « c'est un seul tenant » alors que les œufs à la neige « c'est plein de petits blancs qui flottent ». " },
  { question: "Quel ingrédient la grand-mère de la présentatrice ajoutait-elle pour faire des « lignes roses » dans la crème anglaise ?", options: ["Du sirop de fraise", "De la praline", "Du colorant alimentaire", "De la confiture de framboise"], correctAnswer: 1, explanation: "Elle se souvient : « Elle mettait un peu de praline là-dedans et du coup, il y avait des lignes roses... »" },
  { question: "Quel événement national (ou mondial) se déroule en France le jour de ce tournage, selon la fin de la vidéo ?", options: ["Le championnat du pâté en croûte", "Le championnat de la cuisine lyonnaise", "Le championnat du monde de la praline rose", "Le championnat des bouchons lyonnais"], correctAnswer: 2, explanation: "Elle découvre à la fin : « Aujourd'hui, il y a le championnat du monde de la praline rose en France. »" }
];

export default function LatihanComprehensionOrale() {
  const navigate = useNavigate();
  const { currentUser, refreshUserProfile } = useAuth();

  const [gameState, setGameState] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsValidated(false);
    setScore(0);
    setGameState('quiz');
  };

  const getLetter = (index: number) => String.fromCharCode(65 + index);

  const selectOption = (index: number) => {
    if (isValidated) return;
    setSelectedOption(index);
  };

  const validateAnswer = () => {
    if (selectedOption === null || isValidated) return;
    setIsValidated(true);

    const isCorrect = selectedOption === questions[currentQIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsValidated(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setGameState('results');

    // Confetti on high score
    if (score >= 14) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    // Persist to Firestore
    if (currentUser) {
      try {
        await saveLatihanResult(currentUser.uid, score, questions.length);
        await refreshUserProfile();
      } catch (err) {
        console.error('Failed to save latihan result:', err);
      }
    }
  };

  const currentQ = questions[currentQIndex];
  const progressPercent = ((currentQIndex + 1) / questions.length) * 100;

  // Circle calculation for results screen (r = 46, perimeter = 2 * PI * 46 ≈ 289)
  const circleLength = 289;
  const strokeOffset = circleLength - (circleLength * score) / questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/70">
      <AppHeader 
        title="Ruang Latihan" 
        showBackButton={true} 
        backTo="/dashboard"
        icon={<Headphones className="w-5 h-5 text-sky-600" />}
      />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 w-full py-10">
        <div className="max-w-3xl w-full">
          {/* STATE 1: Intro Screen */}
          {gameState === 'intro' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center animate-fade-in border border-sky-100">
              <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Headphones className="w-10 h-10 text-sky-600" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Exercice de Compréhension Orale
              </h1>
              <h2 className="text-base sm:text-lg text-sky-700 font-semibold mb-6">
                Thème : Gastronomie Lyonnaise (Chez Joseph Viola)
              </h2>

              <div className="bg-sky-50 text-sky-900 p-6 rounded-2xl text-left mb-8 border border-sky-100/80">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <ClipboardList className="w-5 h-5 text-sky-600" />
                  Consignes :
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-sky-800">
                  Lisez attentivement chaque question et choisissez la meilleure réponse en fonction de la transcription étudiée. 
                  Cet exercice contient <strong>20 questions</strong> à choix multiples (A, B, C, D) conçues pour tester votre vocabulaire et votre compréhension détaillée.
                  <br /><br />
                  Setiap jawaban akan langsung diverifikasi dan disertai penjelasan lengkap. Hasil Anda akan dicatat di Firestore.
                  <br /><br />
                  <em className="font-serif italic font-semibold">Bon courage !</em>
                </p>
              </div>

              <button
                type="button"
                onClick={startQuiz}
                className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 text-base sm:text-lg flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Commencer l'entraînement</span>
              </button>
            </div>
          )}

          {/* STATE 2: Quiz Screen */}
          {gameState === 'quiz' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100 animate-fade-in">
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700 p-6 text-white flex justify-between items-center">
                <div className="font-medium text-sm sm:text-base">
                  Question <span className="text-2xl font-black text-sky-200">{currentQIndex + 1}</span> sur {questions.length}
                </div>
                <div className="bg-white/15 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold backdrop-blur-md border border-white/10">
                  Score : <span className="text-amber-300 font-mono text-base">{score}</span>
                </div>
              </div>

              {/* Progress Bar with French Red accent */}
              <div className="w-full bg-gray-100 h-2">
                <div
                  className="bg-[#EF4135] h-2 transition-all duration-300 rounded-r-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="p-6 sm:p-10">
                {/* Question */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswer;
                    
                    let btnStyle = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-sm font-medium ";
                    let letterBadge = "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ";

                    if (!isValidated) {
                      if (isSelected) {
                        btnStyle += "border-sky-500 bg-sky-50 text-sky-900 shadow-sm ring-2 ring-sky-200";
                        letterBadge += "bg-sky-600 text-white";
                      } else {
                        btnStyle += "border-gray-200 hover:border-sky-300 hover:bg-sky-50/50 text-gray-700";
                        letterBadge += "bg-gray-100 text-gray-600";
                      }
                    } else {
                      if (isCorrect) {
                        btnStyle += "border-emerald-500 bg-emerald-50 text-emerald-900";
                        letterBadge += "bg-emerald-600 text-white";
                      } else if (isSelected && !isCorrect) {
                        btnStyle += "border-red-500 bg-red-50 text-red-900";
                        letterBadge += "bg-red-600 text-white";
                      } else {
                        btnStyle += "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                        letterBadge += "bg-gray-200 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectOption(idx)}
                        disabled={isValidated}
                        className={btnStyle}
                      >
                        <div className={letterBadge}>{getLetter(idx)}</div>
                        <span className="flex-grow">{option}</span>
                        {isValidated && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isValidated && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Explanation Card */}
                {isValidated && (
                  <div
                    className={`p-5 rounded-2xl mb-6 border-l-4 animate-fade-in text-sm ${
                      selectedOption === currentQ.correctAnswer
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2 mb-1">
                      {selectedOption === currentQ.correctAnswer ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Bonne réponse !</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Mauvaise réponse !</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                  <div className="text-xs text-gray-400 hidden sm:block">
                    Pilih opsi lalu tekan tombol validasi
                  </div>

                  {!isValidated ? (
                    <button
                      type="button"
                      onClick={validateAnswer}
                      disabled={selectedOption === null}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                        selectedOption !== null
                          ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Valider la réponse</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="px-8 py-3 bg-sky-900 hover:bg-sky-950 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
                    >
                      <span>{currentQIndex === questions.length - 1 ? 'Voir les résultats' : 'Question suivante'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Results Screen */}
          {gameState === 'results' && (
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center animate-fade-in border border-sky-100 relative overflow-hidden">
              <Award className="absolute -right-10 -top-10 w-64 h-64 text-sky-50 pointer-events-none -rotate-12 opacity-60" />

              <div className="relative z-10 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Résultats de l'entraînement
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                  Bilan de la séance
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mb-8">
                  Hasil latihan Anda berhasil disimpan ke Cloud Firestore.
                </p>

                {/* Animated Circular Score */}
                <div className="w-44 h-44 mx-auto rounded-full border-8 border-sky-100 flex items-center justify-center mb-6 relative">
                  <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="transparent"
                      stroke="#0284c7"
                      strokeWidth="8"
                      strokeDasharray="289"
                      strokeDashoffset={strokeOffset}
                      className="circle-progress"
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-5xl font-black text-sky-700 font-mono">{score}</span>
                    <span className="text-lg text-gray-400 font-medium">/{questions.length}</span>
                  </div>
                </div>

                {/* Verdict message */}
                <div className="mb-8">
                  {score >= 17 ? (
                    <div className="text-emerald-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-semibold">
                      🎉 Félicitations ! Excellent travail, vous maîtrisez parfaitement le vocabulaire lyonnais !
                    </div>
                  ) : score >= 12 ? (
                    <div className="text-amber-800 bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm font-semibold">
                      👍 Pas mal ! Vous avez une bonne base, continuez à pratiquer la compréhension orale.
                    </div>
                  ) : (
                    <div className="text-red-700 bg-red-50 p-4 rounded-2xl border border-red-200 text-xs sm:text-sm font-semibold">
                      📖 Il faut réviser le vocabulaire. Relisez attentivement la transcription dans le menu Materi !
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="px-6 py-3 bg-white border-2 border-sky-600 text-sky-700 hover:bg-sky-50 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Recommencer le test</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-md transition text-sm flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Retour au tableau de bord</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
