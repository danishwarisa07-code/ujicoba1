import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader.tsx';
import AppFooter from './AppFooter.tsx';
import { 
  Ear, 
  BookMarked, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Download, 
  Search, 
  ArrowRight,
  Sparkles,
  ChefHat
} from 'lucide-react';

export default function MateriPembelajaranCoKelompok5() {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState('');

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 15, 145));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 15, 85));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simple text download of the transcript
    const element = document.createElement("a");
    const file = new Blob([document.getElementById('transcript-content')?.innerText || 'Transcription Intégrale'], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "Transcript_Bouchon_Lyonnais_Joseph_Viola.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/70">
      <AppHeader 
        title="Ruang Materi" 
        showBackButton={true} 
        backTo="/dashboard"
        icon={<BookMarked className="w-5 h-5 text-sky-600" />}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title & Intro */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Compréhension Orale : Gastronomie Lyonnaise
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Fokus Pembelajaran: Menyimak dan memahami percakapan autentik berbahasa Prancis seputar budaya kuliner Lyon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/latihan')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm flex items-center gap-2"
            >
              <span>Lanjut ke Latihan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Span 4): Listening Strategies & Vocabulary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Strategy Card */}
            <div className="bg-gradient-to-br from-sky-900 to-sky-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-sky-800">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2.5 bg-yellow-400/20 text-yellow-300 rounded-xl">
                  <Ear className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Strategi Menyimak</h2>
                  <span className="text-[11px] text-sky-200">Conseils d'écoute active</span>
                </div>
              </div>

              <p className="text-sky-100 text-xs sm:text-sm mb-5 leading-relaxed relative z-10">
                Untuk menguasai <strong className="text-white">Compréhension Orale</strong> secara akurat, ikuti 3 tahapan krusial berikut:
              </p>

              <ul className="space-y-3.5 relative z-10 text-xs">
                <li className="bg-black/25 rounded-2xl p-3.5 border border-white/10">
                  <span className="block text-yellow-300 font-bold mb-1">
                    1. L'écoute Globale (Menyimak Keseluruhan)
                  </span>
                  <span className="text-sky-100 leading-relaxed">
                    Fokus pada konteks utama. Jangan hentikan audio meski ada kata yang tidak dimengerti. Kenali siapa yang berbicara dan situasinya.
                  </span>
                </li>

                <li className="bg-black/25 rounded-2xl p-3.5 border border-white/10">
                  <span className="block text-yellow-300 font-bold mb-1">
                    2. L'écoute Détaillée (Menyimak Detail)
                  </span>
                  <span className="text-sky-100 leading-relaxed">
                    Putar audio kembali. Mulai catat kata kunci (<em>mots-clés</em>) seperti nama hidangan (<em>quenelle, pâté en croûte</em>), bahan, dan ekspresi emosi.
                  </span>
                </li>

                <li className="bg-black/25 rounded-2xl p-3.5 border border-white/10">
                  <span className="block text-yellow-300 font-bold mb-1">
                    3. Validation par la Transcription
                  </span>
                  <span className="text-sky-100 leading-relaxed">
                    Gunakan dokumen transkrip di sebelah kanan untuk memvalidasi pendengaran Anda dan mempelajari ejaan kosakata yang baru.
                  </span>
                </li>
              </ul>
            </div>

            {/* Vocab Helper Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                  <BookMarked className="w-4 h-4" />
                </div>
                <span>Mots-Clés (Kosakata Esensial)</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-sky-800">Un bouchon</span>
                  <span className="text-gray-500 text-right text-xs">Restoran tradisional Lyon</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-sky-800">La quenelle</span>
                  <span className="text-gray-500 text-right text-xs">Pangsit ikan/daging khas</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-sky-800">Pâté en croûte</span>
                  <span className="text-gray-500 text-right text-xs">Pâté dalam balutan pastry</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-sky-800">Cardinaliser</span>
                  <span className="text-gray-500 text-right text-xs">Membuat lobster/udang memerah</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-sky-800">Saignant</span>
                  <span className="text-gray-500 text-right text-xs">Tingkat kematangan rare (daging)</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-sky-800">Exigu</span>
                  <span className="text-gray-500 text-right text-xs">Sempit / terbatas (ruangan)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sky-800">Praline rose</span>
                  <span className="text-gray-500 text-right text-xs">Kacang almond bersalut gula merah muda</span>
                </div>
              </div>
            </div>

            {/* Quick Practice Tip */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tips Ujian:</strong> Simak secara saksama perbedaan antara <em className="italic">île flottante</em> dan <em className="italic">œufs à la neige</em>, serta mengapa chef memakai col bleu-blanc-rouge. Ini sering muncul dalam latihan dan post-test!
              </div>
            </div>
          </div>

          {/* Right Column (Span 8): Interactive Transcript Viewer */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-md border border-gray-200 flex flex-col overflow-hidden">
            {/* Document Header Controls */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Document Référence:</h3>
                  <p className="text-xs font-mono text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded mt-0.5 inline-block">
                    Transcript_Bouchon_Lyonnais_Joseph_Viola.docx
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                {/* Search in transcript */}
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari kata..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 w-32"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                </div>

                {/* Zoom controls */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                  title="Perkecil Teks"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 font-mono w-10 text-center">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                  title="Perbesar Teks"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Print button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                  title="Cetak Dokumen"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Download button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-xs flex items-center gap-1.5 ml-1"
                  title="Unduh Teks"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div 
              id="transcript-content"
              className="p-6 sm:p-10 max-h-[720px] overflow-y-auto transcript-scroll bg-gray-50/50"
              style={{ fontSize: `${zoomLevel}%` }}
            >
              <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 shadow-sm border border-gray-100 rounded-2xl">
                {/* Title Banner */}
                <div className="text-center mb-8 border-b-2 border-sky-800 pb-6">
                  <div className="inline-flex items-center gap-1.5 text-xs text-sky-700 font-semibold uppercase tracking-wider mb-2">
                    <ChefHat className="w-4 h-4" /> C'est meilleur quand c'est bon
                  </div>
                  <h2 className="text-2xl font-extrabold uppercase tracking-wider text-gray-900">
                    Transcription Intégrale
                  </h2>
                  <p className="text-base italic text-gray-600 mt-2 font-serif">
                    « Un bouchon lyonnais mythique » — Chez Joseph Viola (MOF)
                  </p>
                </div>

                {/* Meta Table */}
                <table className="w-full text-xs sm:text-sm mb-8 border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700 w-1/3">Titre de la vidéo :</td>
                      <td className="py-2.5 text-gray-600">Un bouchon lyonnais mythique</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700">Chaîne YouTube :</td>
                      <td className="py-2.5 text-gray-600">C'est meilleur quand c'est bon</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700">Lieu & Personnalité :</td>
                      <td className="py-2.5 text-gray-600">Lyon, Bouchon traditionnel du Chef Joseph Viola (MOF)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-gray-700 align-top">Thématique :</td>
                      <td className="py-2.5 text-gray-600">Gastronomie lyonnaise, bouchons traditionnels, spécialités du terroir</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-xs sm:text-sm italic text-gray-600 mb-8 p-4 bg-sky-50/60 rounded-xl border-l-4 border-sky-500 leading-relaxed">
                  Ce document contient la transcription textuelle complète et ordonnée de la vidéo consacrée au bouchon traditionnel lyonnais du chef Joseph Viola, tirée de l'émission culinaire « C'est meilleur quand c'est bon ». Il constitue un support pédagogique idéal pour l'étude du vocabulaire de la cuisine lyonnaise et du patrimoine gastronomique français.
                </div>

                {/* Section 1 */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-sky-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-xs">1</span>
                    Introduction et Arrivée au Bouchon Lyonnais
                  </h3>
                  <div className="space-y-3.5 text-gray-800 leading-relaxed text-sm">
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Ça, c'est la cuisine lyonnaise, hein ! Généreux, de la sauce, de la crème.</p>
                    <p><span className="font-semibold text-sky-700">Voix off :</span> J'ai un respect infini pour ces jeunes qui choisissent ce métier. Il a été champion du monde. Il faut prendre ça ici. L'omelette du curé, la fameuse ! Le foie de veau... Oh là là ! Je ne vais pas parler de ma grand-mère ? Non, s'il te plaît !</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> On est à Lyon aujourd'hui. On va manger dans un restaurant que j'ai testé en 2002. Il a été repris par le chef Joseph Viola en 2004, donc c'était encore l'ancienne famille, c'était vraiment le bouchon traditionnel lyonnais. Et Joseph Viola, qui a un col bleu-blanc-rouge...</p>
                    <p><span className="font-semibold text-sky-700">Intervenant :</span> D'accord.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Ah, il y a un champignon ! Quel rapport avec la choucroute ? Et depuis, voilà ! Il y a même la Vallée de la Gastronomie. Il ne manque plus que : « C'est Meilleur Quand C'est Bon ».</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Bonsoir, excusez-moi. Alors c'est par où ? Oh, il y a du vin, ça tombe bien, j'ai soif ! Bonjour !</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> Bonjour !</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Ah oui, il y a de la toque ! Oh la vache ! Vous avez perdu votre toque ou quoi ?</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> Ouais, non, j'essaie de ne pas la mettre parce que sinon...</p>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-sky-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-xs">2</span>
                    En Cuisine : Les Sauces, la Sauce Nantua et les Gratins
                  </h3>
                  <div className="space-y-3.5 text-gray-800 leading-relaxed text-sm">
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Donc là, c'est les sauces ? C'est important les sauces ici, non ?</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> C'est un poste clé, les sauces. Là, c'est une sauce poivre.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Ça, c'est quoi ?</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> La sauce Nantua. C'est des carcasses d'écrevisses qu'on va venir cardinaliser, donc rougir très fort, un peu comme moi là ! Et après, on va mettre une belle garniture aromatique, du cognac. Ça, c'est pour faire les gratins.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Le gratin de truite, là ? C'était le plat du jour. On a failli le prendre, mais comme ça, on a l'impression de l'avoir mangé un peu. Ça, c'est la cuisine lyonnaise, hein !</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> Généreux, de la sauce, de la crème.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Ah oui, vous en mettez beaucoup !</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> Il faut. C'est la crème montée qui fait gratiner la sauce.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> C'est vous le chef de la pomme de terre ? Ça, c'est quoi ? Gratin de pommes de terre, là, pommes de terre soufflées ?</p>
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> Oh la vache ! Les gratins de truite à la sauce Nantua, à la crème. Ah, la quenelle magnifique ! Merci, bon service !</p>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-sky-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-xs">3</span>
                    Les Entrées Traditionnelles : Saladier Lyonnais et Pâté en Croûte
                  </h3>
                  <div className="space-y-3.5 text-gray-800 leading-relaxed text-sm">
                    <p><span className="font-semibold text-sky-700">Cuisinier :</span> Le gâteau de tomates, fromage frais, sauce au pistou, un petit peu de parmesan. Saladier lyonnais : salade de museau, salade de lentilles, petits harengs fumés.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Tu vois, autrefois, dans la tradition lyonnaise, tu avais les saladiers, on te les posait comme ça et tout. Et là, il le dresse à l'assiette.</p>
                    <p><span className="font-semibold text-sky-700">Serveur :</span> Bonsoir. On aura le pâté du chef.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Merci. Alors, si tu le prends seul, bah tu as ta tranche de pâté. Et sinon, là, il te le dresse dans deux assiettes. C'est pas mal plutôt de le mettre au milieu et que tu me dises : « Oh, tu as tout pris et tout ». Donc ici, il a été champion du monde [du pâté en croûte]. Il faut prendre ça ici. La croûte est dingue !</p>
                    <p><span className="font-semibold text-sky-700">Intervenant :</span> C'est des Américains derrière ?</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> C'est le service de 19h30, il y a plein d'Américains. Moi, je pense qu'après, c'est les Lyonnais, peut-être un peu plus tard. C'était vraiment ce bouchon de quartier qui n'a pas... Tu vois, regarde le carrelage comme il est génial ! C'est vraiment le carrelage d'autrefois qui est dans son jus ! Chaque table a un nom connu dans la restauration ou dans la cuisine. Et si tu veux, c'était comme ça quand il a repris, il a tout gardé et il continue à faire cette cuisine que tu ne trouves pas forcément ailleurs.</p>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-sky-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-xs">4</span>
                    L'Omelette du Curé et les Plats Signature
                  </h3>
                  <div className="space-y-3.5 text-gray-800 leading-relaxed text-sm">
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Évidemment, le pâté en croûte, tu le vois partout, mais tu vas voir ce qui va suivre, c'est unique en France. C'est l'omelette, c'est pour nous ! L'omelette du curé, la fameuse !</p>
                    <p><span className="font-semibold text-sky-700">Intervenant :</span> Bah, je croyais que c'était une quenelle.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Regarde-moi ça ! Dedans, il y a des écrevisses. C'est ce que j'ai mangé la première fois que je suis venue. Il a perpétué la tradition. Mais c'est pas bon, c'est extraordinaire ! Et quand tu viens ici, tu manges ça ! Regarde-moi cette sauce... Mais cette cuisine française qu'on ne trouve plus nulle part ! C'est comme notre copain qui faisait le poulet avec le homard. Tu vois, il faut y aller parce que... quand il y a des recettes que tu ne trouves plus nulle part. Et cette sauce Nantua, elle est incroyable !</p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-sky-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-xs">5</span>
                    Les Plats de Viande et Abats : Veau, Rognons et Béchamel
                  </h3>
                  <div className="space-y-3.5 text-gray-800 leading-relaxed text-sm">
                    <p><span className="font-semibold text-sky-700">Voix off / Serveur :</span> La volaille aux morilles, le steak au poivre, le foie de veau. Le tendron fermier avec sa sauce vierge et son jus de veau.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> On n'a pas du tout commandé ça ? Ah, c'est de la part du chef ! Alors là, c'est le plat estival : tendron de veau. Tu n'aimes pas les cadeaux, mais je vais quand même te le partager. Ça a l'air tendre, hein ! Ah bah là, on a tout compris ! C'est extraordinaire ça ! Il y a des olives dessus et de la tomate, donc il y a un côté plus provençal. Il faut le cuire longtemps pour qu'il soit moelleux comme ça. C'est très bon. Derrière toi, il y a toute la collection des Guides Michelin. C'est patrimonial ça, mon cher ami.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> La cervelle à la provençale, ça faisait partie des plats qu'il fallait prendre. Le rognon, c'est pour nous ! Sublime. Et gratin de pâtes peint en béchamel, et des pommes de terre cuites à la lyonnaise, donc dans la graisse de canard.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Tiens, regarde. Je te mets ça, je prends ça. Oh là là, mais c'est rigolo ! Et regarde, il y a des petits lardons avec les champignons et tout. Tu vois, regarde, à la goutte... et là, il est un peu saignant. Bah, c'est à tomber ! Et alors, pour accompagner ça, tu as le gratin de pâtes. Ça, c'est vraiment typiquement lyonnais. C'est le gratin de pâtes à la française, pas du tout al dente comme les Italiens. On veut surtout retrouver le plaisir de l'enfance. J'allais dire : « On ne guérit jamais de son enfance », mais c'est vrai, même pour le goût ! Et ensuite, les pommes de terre. Bravo chef !</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Franchement, j'admire vraiment ces cuisiniers, parce que non seulement il fait très chaud, mais en plus c'est hyper exigu. Ils passent comme ça, et tu sens qu'ils sont dans une espèce de retenue permanente pour ne pas se brûler, ne pas renverser les plats, ne pas se bousculer... Moi, j'ai un respect infini pour ces jeunes qui choisissent ce métier.</p>
                  </div>
                </div>

                {/* Section 6 */}
                <div className="mb-4">
                  <h3 className="text-base font-bold text-sky-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 inline-flex items-center justify-center text-xs">6</span>
                    Le Dessert : Île Flottante à la Praline Rose
                  </h3>
                  <div className="space-y-3.5 text-gray-800 leading-relaxed text-sm">
                    <p><span className="font-semibold text-sky-700">Serveur :</span> Une île flottante à la praline rose.</p>
                    <p><span className="font-semibold text-sky-700">Intervenant :</span> Elle flotte, ton île flottante ?</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Bah, elle flotte, ouais ! Une île flottante, déjà, c'est un seul tenant qui flotte sur quelque chose. Ce que nous avait expliqué un restaurateur, c'est qu'elle est posée sur une tranche de quelque chose, alors que les œufs à la neige, c'est plein de petits blancs qui flottent comme ça, comme des icebergs. Alors, j'y vais ?</p>
                    <p><span className="font-semibold text-sky-700">Intervenant :</span> Alors ? Je ne vais pas parler de ma grand-mère ?</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Non, s'il te plaît ! Elle, elle mettait un peu de praline là-dedans et du coup, il y avait des lignes roses comme ça qui se baladaient dans la crème anglaise.</p>
                    <p><span className="font-semibold text-sky-700">Intervenant :</span> Tu reviendras ? Je crois que tu es déjà revenue, de toute façon.</p>
                    <p><span className="font-semibold text-sky-700">Présentatrice :</span> Je suis déjà revenue ! Aujourd'hui, il y a le championnat du monde de la praline rose en France. Ah bah, je ne savais pas ! Tu vois, personne ne m'avait dit.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
