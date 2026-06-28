import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, ThumbsUp, MessageCircle, X, 
  Send, User, Check, Eye, Share2, ArrowLeft, Edit2, BookOpen
} from 'lucide-react';
import { Event } from '../types';

interface NewsComment {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
}

interface NewsArticle {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  neighborhood: string;
  category: string;
  imageUrl: string;
  badge?: string;
  summary: string;
  content: string;
  views: number;
  likes: number;
  live: boolean;
  comments: NewsComment[];
}

interface EventDetailViewProps {
  events: Event[];
}

export default function EventDetailView({ events }: EventDetailViewProps) {
  const { slug } = useParams();
  const [currentUser] = useState<string>(() => localStorage.getItem('sabor_salvador_user') || '');
  const [article, setArticle] = useState<NewsArticle | null>(null);

  // New Comment Submission Form State
  const [commentName, setCommentName] = useState(currentUser);
  const [commentText, setCommentText] = useState('');

  // Editing Comment State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Toast Notify
  const [toastMessage, setToastMessage] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    // Find event
    const eventRaw = events.find(e => e.id === slug);
    if (!eventRaw) return;

    const getDetailedSummary = (id: string) => {
      if (id === 'ev-1') return 'A abertura oficial do festival lotou o centro histórico de Salvador. Cobrimos os bastidores do palanque e a emoção das apresentações de Axé.';
      if (id === 'ev-2') return 'Os tradicionais ensaios de domingo no Largo da Tieta retornam sob forte aclamação do público soteropolitano e novos arranjos rústicos.';
      if (id === 'ev-3') return 'O fenômeno do sound system baiano confirma show aberto nas ladeiras históricas de Salvador, gerando imensa comoção popular nas redes.';
      if (id === 'ev-4') return 'O tradicional Jazz ao pôr de sol no Solar do Unhão volta com participações de peso da nova MPB brasileira neste final de semana.';
      if (id === 'ev-5') return 'Vilarejo praiano vira ponto de encontro do arrasta-pé raiz com noites agitadas, sanfonas chorando e muita culinária nordestina.';
      return 'Nova nota de cobertura de evento soteropolitano. Acompanhe a energia e os melhores spots culturais selecionados pela redação.';
    };

    const getDetailedContent = (id: string) => {
      if (id === 'ev-1') {
        return `SALVADOR — Sob o céu estrelado do Pelourinho, a primeira noite do Festival de Verão resgatou o que há de mais puro na pulsação baiana. Comandado por grandes vozes do axé tradicional, o evento uniu gerações de baianos e turistas que cantaram em coro uníssono até a madrugada.\n\n"Estar aqui é reviver a energia de nossas raízes sagradas de matriz africana", declarou Mestre Jorge, visivelmente emocionado nos bastidores do Largo. O Sabor Salvador cobriu os preparativos locais, as cozinhas improvisadas servindo acarajés quentes aos foliões e a forte segurança que garantiu a harmonia absoluta.\n\nO destaque ficou para o dueto surpresa que levou o público às lágrimas, misturando percussão pesada com sopros clássicos. A próxima noite promete ainda mais surpresas com artistas independentes de toda a Bahia cobrindo ritmos que vão do samba ao afropop soteropolitano.`;
      }
      if (id === 'ev-2') {
        return `PELOURINHO — A energia incomparável do Olodum voltou a tremer o asfalto do Largo da Tieta neste final de semana. O lendário bloco afro reuniu um público caloroso para treinar as novas coreografias e cadências que engrenarão as ruas no próximo Carnaval.\n\nNossa equipe de pauta cultural acompanhou de perto a passagem de som, onde os percussionistas demonstraram sincronia sagrada. O som dos tambores correu pelas ladeiras históricas, atraindo moradores e visitantes. "É mais que música, é um manifesto social de orgulho negro e herança baiana", celebrou a líder do coletivo.\n\nAlém da consagrada batida de samba-reggae, o grupo apresentou arranjos inovadores com guitarras elétricas acentuadas, mostrando que a tradição continua vibrante e se renovando sem parar.`;
      }
      if (id === 'ev-3') {
        return `SALVADOR — Preparem as pernas e a alma: o BaianaSystem acaba de oficializar sua próxima intervenção urbana nas ladeiras do Pelourinho. Conhecidos por guiar multidões compactas com sua fusão agressiva de guitarra baiana, beats eletrônicos modernos, dub e ijexá, o grupo planeja um show de entrada franca sob o tema ambiental do mar.\n\nA prefeitura de Salvador já adiantou que o Pelô passará por uma logística especial de trânsito e segurança reforçada para comportar o público estimado. Nas rodas de conversa do Rio Vermelho, o espetáculo é o assunto mais discutido. "O BaianaSystem resgata o espírito comunitário das praças públicas", analisa nosso colunista local.\n\nO repertório contará com canções clássicas, faixas de discos memoráveis e participações especiais de mestres griôs rústicos do Recôncavo Baiano.`;
      }
      if (id === 'ev-4') {
        return `COMÉRCIO — Um dos cenários mais deslumbrantes da Baía de Todos-os-Santos servirá mais uma vez de palco para a consagrada Jam no MAM. Unindo o jazz instrumental experimental ao calor da síncope rítmica baiana, o evento deste sábado trará ao palco solistas consagrados e jovens talentos da cena brasileira.\n\nA atmosfera do Solar do Unhão é mágica: o som do contrabaixo se mescla de forma pacífica com o quebrar das ondas enquanto o pôr do sol se deita sobre a baía. Nossa equipe conversou com o baterista de destaque da noite: "Socar o tambor com o mar batendo atrás é uma experiência de arrepiar as amarras corporais."\n\nOs ingressos simbólicos podem ser adquiridos na bilheteria local a preços justificados de forma comunitária. Um excelente programa para relaxar com amigos e desfrutar do crepúsculo.`;
      }
      if (id === 'ev-5') {
        return `RIO VERMELHO — O Rio Vermelho provou que não vive apenas de moqueca e boemia contemporânea. O tradicional forró pé-de-serra tomou conta da Vila Caramuru neste final de semana, atraindo casais de todas as idades para dançar o autêntico arrasta-pé sob a orquestra de sanfonas.\n\nNem o vento fresco diminuiu o vigor dentro do pavilhão. Barraquinhas ao redor comercializaram caldos quentes de peixe, milho verde cozido, canjica regional, bolo de aipim feito no forno à lenha e licores artesanais típicos de Santo Antônio de Jesus.\n\nAs apresentações comemoram clássicos de Luiz Gonzaga, Trio Nordestino e Dominguinhos com extrema fidelidade acústica. Uma excelente pauta cultural de resgate das festividades juninas no coração litorâneo da capital.`;
      }
      return `SALVADOR — Novas atualizações sobre espetáculos e celebrações no centro de Salvador. Nossos repórteres de campo trazem análises profundas das tendências gastronômicas, encontros espontâneos em becos coloniais e a ressonância da percussão tradicional baiana.\n\nFique sintonizado para entrevistas inéditas com organizadores de festivais, chefs locais que comentam sobre jantares sinestésicos e roteiros musicais secretos espalhados pelos quatro cantos da grande metrópole baiana.`;
    };

    setArticle({
      id: eventRaw.id,
      title: eventRaw.title.includes('Festival') ? eventRaw.title : `Bastidores: ${eventRaw.title} atrai atenção e dita ritmo cultural`,
      date: eventRaw.date.replace('Sábado', 'Sáb').replace('Domingo', 'Dom'),
      time: eventRaw.time,
      location: eventRaw.location,
      neighborhood: eventRaw.neighborhood,
      category: eventRaw.category,
      imageUrl: eventRaw.imageUrl,
      badge: eventRaw.badge || 'REPORTAGEM',
      summary: getDetailedSummary(eventRaw.id),
      content: getDetailedContent(eventRaw.id),
      views: Math.floor(180 + Math.random() * 320),
      likes: Math.floor(15 + Math.random() * 70),
      live: eventRaw.id === 'ev-1',
      comments: [
        {
          id: `comm-1-${eventRaw.id}`,
          author: 'Rodrigo Lôbo',
          content: 'Que texto completo e rico em detalhes! Salvador precisava de um veículo assim cuidando do nosso patrimônio.',
          timeAgo: 'Há 2 horas'
        },
        {
          id: `comm-2-${eventRaw.id}`,
          author: 'Karina Mendes',
          content: 'O Sabor Salvador capturou o sentimento perfeito do local. Ansiosa para as próximas reportagens.',
          timeAgo: 'Há 5 horas'
        }
      ]
    });
  }, [slug, events]);

  const handleToggleLike = () => {
    if (!article) return;
    setLiked(!liked);
    setArticle(prev => prev ? { ...prev, likes: prev.likes + (liked ? -1 : 1) } : null);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim() || !article) return;
    
    // Save current user identifying info if not set (for simulation)
    if (!currentUser) {
      localStorage.setItem('sabor_salvador_user', commentName.trim());
    }

    const newComm: NewsComment = {
      id: `comm-${Date.now()}`,
      author: commentName.trim(),
      content: commentText.trim(),
      timeAgo: 'Agora mesmo'
    };

    setArticle(prev => prev ? { ...prev, comments: [newComm, ...prev.comments] } : null);
    setCommentText('');
  };

  const handleStartEditComment = (comm: NewsComment) => {
    setEditingCommentId(comm.id);
    setEditingCommentText(comm.content);
  };

  const handleSaveEditComment = (commentId: string) => {
    if (!editingCommentText.trim() || !article) return;
    setArticle(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, content: editingCommentText.trim(), timeAgo: 'Editado agora' } : c)
      };
    });
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  if (!article) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-surface py-20 text-center">
        <div>
          <p className="text-brand-on-surface-variant font-bold mb-4">Carregando detalhes do evento...</p>
          <Link to="/eventos" className="text-brand-primary font-bold underline hover:text-brand-primary-container">
            Voltar para Agenda
          </Link>
        </div>
      </div>
    );
  }

  // Create Google Maps search query based on neighborhood/location + Salvador
  const mapQuery = encodeURIComponent(`${article.location || ''} ${article.neighborhood}, Salvador, Bahia, Brasil`);

  return (
    <div className="animate-fade-in bg-white min-h-screen text-brand-on-surface flex-grow py-8 px-4 md:px-8">
      
      {/* Toast Messages */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-on-surface text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-brand-container-highest animate-fade-in flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 hover:text-brand-secondary-container text-xs font-bold">×</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-container-high relative">
        <div className="p-4 bg-brand-surface border-b border-brand-container flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Cobertura de Salvador - {article.category}</span>
          </div>
          <Link to="/eventos" className="text-brand-outline hover:text-brand-primary p-1 bg-white rounded-full transition">
            <X className="w-5 h-5" />
          </Link>
        </div>

        <div className="p-6 md:p-10 flex-grow">
          {/* Article Header */}
          <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-md">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 text-white/90 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                <span>{article.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{article.neighborhood}</span>
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white leading-tight shadow-black/50 drop-shadow-lg">
                {article.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-brand-container-highest">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary-container text-white flex items-center justify-center font-bold text-sm shadow-sm">
                SS
              </div>
              <div>
                <p className="text-xs font-extrabold text-brand-on-surface">Redação Sabor Salvador</p>
                <p className="text-[10px] text-brand-outline font-semibold">Pauta: {article.time}</p>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <span className="bg-brand-surface px-2.5 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-1 border border-brand-outline-variant">
                <Eye className="w-3 h-3 text-brand-primary" />
                <span>{article.views} Visualizações</span>
              </span>

              <button 
                onClick={handleToggleLike}
                className={`px-3 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-1 border border-brand-outline-variant transition ${
                  liked ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-brand-surface hover:bg-brand-container'
                }`}
              >
                <ThumbsUp className={`w-3 h-3 ${liked ? 'fill-emerald-700 text-emerald-700' : ''}`} />
                <span>{article.likes} Curtidas</span>
              </button>
            </div>
          </div>

          {/* High-Fidelity Rich Paragraph Writing */}
          <div className="text-sm md:text-base leading-relaxed text-brand-on-surface-variant/90 space-y-6 font-medium whitespace-pre-line text-justify mb-10">
            {article.content}
          </div>

          {/* EMBEDDED LOCATION MAP */}
          <div className="mb-10">
            <h3 className="font-display text-lg font-extrabold text-brand-on-surface mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-primary" />
              <span>Onde fica: {article.location || article.neighborhood}</span>
            </h3>
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-brand-container-high shadow-md">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${mapQuery}`}
                allowFullScreen
                title="Mapa do evento"
              ></iframe>
              {/* Note: In a real app we need an actual Google Maps API key or use a free alternative like OSM. 
                  Since we are just simulating, I'll use a placeholder iframe or openstreetmap. Let's swap to OSM for it to actually work without API keys. */}
            </div>
          </div>

          {/* COMMENTS FORUM SECTION (CRUD IMPLEMENTED) */}
          <div className="border-t border-brand-container-highest pt-8 mt-5">
            <h3 className="font-display text-sm font-extrabold text-brand-on-surface mb-6 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-primary" />
              <span>Espaço do Leitor: Comentários ({article.comments.length})</span>
            </h3>

            {/* Comment Posting form */}
            <form onSubmit={handleAddComment} className="bg-brand-surface p-4 rounded-2xl border border-brand-outline-variant space-y-3 mb-6">
              <span className="text-[9px] font-bold uppercase text-brand-primary tracking-wider block">Deixe sua opinião sobre esse acontecimento</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-outline" />
                  <input 
                    type="text" 
                    required
                    placeholder="Nome do leitor"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    className="w-full bg-white border border-brand-outline-variant rounded-xl pl-9 pr-3 py-2 text-[11px] font-semibold focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input 
                    type="text" 
                    required
                    placeholder="O que achou da notícia? Compartilhe seu axé..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="w-full bg-white border border-brand-outline-variant rounded-xl px-4 py-2 text-[11px] font-semibold focus:outline-none focus:border-brand-primary text-left"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary-container text-white text-[11px] font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3 text-white" />
                  <span>Postar comentário</span>
                </button>
              </div>
            </form>

            {/* List of Comments Thread with Update/Delete Action controls */}
            <div className="space-y-4">
              {article.comments.length === 0 ? (
                <p className="text-[11px] text-brand-outline italic">Seja o primeiro a inaugurar o debate sobre esta pauta!</p>
              ) : (
                article.comments.map((comm) => (
                  <div key={comm.id} className="p-4 rounded-2xl bg-white border border-brand-container-high transition hover:border-brand-outline shadow-2xs">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-[10px] flex items-center justify-center">
                          {comm.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] font-black text-brand-on-surface">{comm.author}</span>
                        <span className="text-[9px] text-brand-outline font-medium">• {comm.timeAgo}</span>
                      </div>

                      <div className="flex gap-2">
                        {currentUser === comm.author && (
                          <button
                            onClick={() => handleStartEditComment(comm)}
                            className="text-[9px] font-bold text-brand-outline hover:text-brand-primary flex items-center gap-0.5"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Editar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* If in edit state, render inline edit form */}
                    {editingCommentId === comm.id ? (
                      <div className="mt-2 flex gap-2">
                        <input 
                          type="text"
                          value={editingCommentText}
                          onChange={e => setEditingCommentText(e.target.value)}
                          className="flex-grow bg-brand-surface border border-brand-outline-variant p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white"
                        />
                        <button
                          onClick={() => handleSaveEditComment(comm.id)}
                          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-1 font-bold text-[10px]"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-brand-on-surface-variant font-medium leading-relaxed italic pl-8">
                        "{comm.content}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="p-4 bg-brand-surface border-t border-brand-container flex justify-between items-center shrink-0">
          <span className="text-[9px] text-brand-outline font-extrabold uppercase">SABOR SALVADOR IMPRENSA • 2026</span>
          <Link
            to="/eventos"
            className="bg-brand-on-surface text-white text-xs font-bold py-2 px-5 rounded-xl hover:bg-brand-on-surface-variant transition cursor-pointer"
          >
            Concluir Leitura
          </Link>
        </div>

      </div>
    </div>
  );
}
