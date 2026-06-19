import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Calendar, MapPin, ThumbsUp, MessageCircle, X, 
  Send, User, Plus, Check, Bookmark, Radio, Eye, Share2, 
  Sparkles, BookOpen, ArrowRight, Edit2, Trash2, Heart, Award, Flame
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
  category: 'Axé' | 'Samba' | 'Forró' | 'Jazz' | 'Alternativo';
  imageUrl: string;
  badge?: string;
  summary: string;
  content: string;
  views: number;
  likes: number;
  live: boolean;
  comments: NewsComment[];
}

interface EventsViewProps {
  events: Event[];
}

const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', label: 'Batuque/Pelourinho (Colorido)' },
  { url: 'https://images.unsplash.com/photo-1594142404563-64cccaf5a10f?auto=format&fit=crop&w=800&q=80', label: 'Festival Multidão (Luzes)' },
  { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', label: 'Noite de Show (Espetáculo)' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', label: 'Pôr do Sol/Solar (Praia)' }
];

export default function EventsView({ events }: EventsViewProps) {
  const [activeCat, setActiveCat] = useState<'Todos' | 'Axé' | 'Samba' | 'Forró' | 'Jazz' | 'Alternativo'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enriched news state
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);


  // Helpers inside closure for initial content hydration
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

  // Convert raw events into full news stories
  useEffect(() => {
    setNewsList(prev => {
      if (prev.length > 0) return prev; // Preserve existing edited state
      
      return events.map(e => {
        const matchingCat = (['Axé', 'Samba', 'Forró', 'Jazz', 'Alternativo'].includes(e.category) 
          ? e.category 
          : 'Axé') as 'Axé' | 'Samba' | 'Forró' | 'Jazz' | 'Alternativo';

        return {
          id: e.id,
          title: e.title.includes('Festival') ? e.title : `Bastidores: ${e.title} atrai atenção e dita ritmo cultural`,
          date: e.date.replace('Sábado', 'Sáb').replace('Domingo', 'Dom'),
          time: e.time,
          location: e.location,
          neighborhood: e.neighborhood,
          category: matchingCat,
          imageUrl: e.imageUrl,
          badge: e.badge || 'REPORTAGEM',
          summary: getDetailedSummary(e.id),
          content: getDetailedContent(e.id),
          views: Math.floor(180 + Math.random() * 320),
          likes: Math.floor(15 + Math.random() * 70),
          live: e.id === 'ev-1',
          comments: [
            {
              id: `comm-1-${e.id}`,
              author: 'Rodrigo Lôbo',
              content: 'Que texto completo e rico em detalhes! Salvador precisava de um veículo assim cuidando do nosso patrimônio.',
              timeAgo: 'Há 2 horas'
            },
            {
              id: `comm-2-${e.id}`,
              author: 'Karina Mendes',
              content: 'O Sabor Salvador capturou o sentimento perfeito do local. Ansiosa para as próximas reportagens.',
              timeAgo: 'Há 5 horas'
            }
          ]
        };
      });
    });
  }, [events]);

  const filteredNews = useMemo(() => {
    return newsList.filter(news => {
      if (activeCat !== 'Todos' && news.category !== activeCat) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        return news.title.toLowerCase().includes(query) || 
               news.summary.toLowerCase().includes(query) || 
               news.neighborhood.toLowerCase().includes(query) ||
               news.location.toLowerCase().includes(query);
      }
      return true;
    });
  }, [newsList, activeCat, searchTerm]);

  // Featured News Article (generally the live/first one)
  const featuredNews = useMemo(() => {
    return newsList.find(n => n.live) || newsList[0] || null;
  }, [newsList]);

  // Increment view counter on read modal open
  const handleOpenReadNews = (news: NewsArticle) => {
    setActiveArticle(news);
    setNewImageUrl(PRESET_IMAGES[2].url); // Reset default presets option
    
    // Increment local state views safely
    setNewsList(prev => prev.map(n => n.id === news.id ? { ...n, views: n.views + 1 } : n));
  };

  // Like Toggle Function
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Avoid opening modal on button click
    
    const wasLiked = likedArticles.includes(id);
    if (wasLiked) {
      setLikedArticles(prev => prev.filter(item => item !== id));
      setNewsList(prev => prev.map(n => n.id === id ? { ...n, likes: Math.max(0, n.likes - 1) } : n));
    } else {
      setLikedArticles(prev => [...prev, id]);
      setNewsList(prev => prev.map(n => n.id === id ? { ...n, likes: n.likes + 1 } : n));
    }

    // If modal is active, synchronize its display state too
    if (activeArticle && activeArticle.id === id) {
      setActiveArticle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: wasLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
        };
      });
    }
  };

  // COMMENTS CRUD ON ACTIVE ARTICLE
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle || !commentName.trim() || !commentText.trim()) return;

    const newComment: NewsComment = {
      id: `rc-${Date.now()}`,
      author: commentName.trim(),
      content: commentText.trim(),
      timeAgo: 'Agora mesmo'
    };

    localStorage.setItem('sabor_salvador_user', commentName.trim());
    setCurrentUser(commentName.trim());

    // Update active modal article comments
    setActiveArticle(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: [newComment, ...prev.comments]
      };
    });

    // Sync master news list state
    setNewsList(prev => prev.map(n => {
      if (n.id === activeArticle.id) {
        return {
          ...n,
          comments: [newComment, ...n.comments]
        };
      }
      return n;
    }));

    // Reset inputs
    setCommentName('');
    setCommentText('');
  };

  const handleStartEditComment = (comment: NewsComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleSaveEditComment = (commentId: string) => {
    if (!editingCommentText.trim() || !activeArticle) return;

    // Update inside active article
    setActiveArticle(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, content: editingCommentText.trim() } : c)
      };
    });

    // Update master news list
    setNewsList(prev => prev.map(n => {
      if (n.id === activeArticle.id) {
        return {
          ...n,
          comments: n.comments.map(c => c.id === commentId ? { ...c, content: editingCommentText.trim() } : n.comments.find(k => k.id === commentId) ? { ...c, content: editingCommentText.trim() } : c)
        } as any;
      }
      return n;
    }));

    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!activeArticle) return;

    // Update inside active article
    setActiveArticle(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      };
    });

    // Update master news list
    setNewsList(prev => prev.map(n => {
      if (n.id === activeArticle.id) {
        return {
          ...n,
          comments: n.comments.filter(c => c.id !== commentId)
        };
      }
      return n;
    }));
  };

  const handleSimulateShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.host}/news-share-mock`);
    }
    setToastMessage(`Link da reportagem "${title}" copiado para a área de transferência! 🔗`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="animate-fade-in bg-brand-surface text-brand-on-surface py-12 px-4 md:px-8 flex-grow">
      
      {/* Toast Messages */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-on-surface text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-brand-container-highest animate-fade-in flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 hover:text-brand-secondary-container text-xs font-bold">×</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* PAGE INTRODUCING HEADER */}
        <div className="mb-10 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-primary mb-2 font-mono">
              <Radio className="w-4 h-4 text-brand-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase">Imprensa e Cultura Soteropolitana</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-brand-on-surface leading-tight tracking-tight">
              Agenda & Cobertura de Eventos
            </h1>
            <p className="text-brand-on-surface-variant max-w-2xl text-xs sm:text-sm font-semibold mt-1">
              Boletins em tempo real, bastidores, roteiros culturais e artigos críticos de quem vive o som e a culinária dos templos e praças de Salvador.
            </p>
          </div>

        </div>


        {/* COMPACT FEATURED LIVE NEWS STORY BANNER */}
        {featuredNews && (
          <div className="relative rounded-3xl overflow-hidden h-[360px] md:h-[450px] flex flex-col justify-end p-6 md:p-12 mb-12 shadow-2xl bg-cover bg-center group border border-brand-container-highest transition duration-500 hover:shadow-brand-primary/10">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-101"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(16, 8, 4, 0.98), rgba(16, 8, 4, 0.4)), url('${featuredNews.imageUrl}')`
              }}
            />
            
            <div className="max-w-2xl z-10 text-left text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-rose-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest animate-pulse">
                  <Flame className="w-3 h-3 text-white" />
                  <span>Plantão Cobertura Ao Vivo</span>
                </span>
                <span className="bg-white/10 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                  {featuredNews.category}
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight group-hover:text-amber-350 transition">
                {featuredNews.title}
              </h2>
              
              <p className="text-xs md:text-sm text-brand-container/90 mb-6 font-medium leading-relaxed max-w-xl line-clamp-2">
                {featuredNews.summary}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-semibold text-white/80">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 h-fit">
                    <Calendar className="w-3.5 h-3.5 text-brand-secondary-container" />
                    <span>{featuredNews.date}</span>
                  </span>
                  <span className="flex items-center gap-1 h-fit">
                    <MapPin className="w-3.5 h-3.5 text-brand-secondary-container" />
                    <span>{featuredNews.location}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleToggleLike(featuredNews.id, e)}
                    className={`p-2 rounded-lg flex items-center gap-1.5 transition text-xs font-extrabold ${likedArticles.includes(featuredNews.id) ? 'text-brand-primary bg-white' : 'text-white hover:bg-white/10'}`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedArticles.includes(featuredNews.id) ? 'fill-brand-primary text-brand-primary' : 'text-white'}`} />
                    <span>{featuredNews.likes}</span>
                  </button>

                  <button 
                    onClick={() => handleOpenReadNews(featuredNews)}
                    className="bg-brand-primary text-white hover:bg-brand-primary-container font-bold px-5 py-2.5 rounded-xl transition cursor-pointer text-xs"
                  >
                    Ver Cobertura Completa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & CATEGORIES FILTERS BAR */}
        <div className="bg-white rounded-2xl p-5 border border-brand-container-high shadow-xs mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline" />
            <input 
              type="text" 
              placeholder="Buscar coberturas, artistas, bairros ou ritmos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {(['Todos', 'Axé', 'Samba', 'Forró', 'Jazz', 'Alternativo'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeCat === cat
                    ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                    : 'bg-brand-surface text-brand-on-surface-variant border-brand-outline-variant hover:text-brand-primary hover:border-brand-primary/50'
                }`}
              >
                {cat === 'Todos' ? 'Todos os ritmos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID OF EVENT NEWS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length === 0 ? (
            <div className="col-span-full text-center bg-white p-16 rounded-3xl border border-brand-container-high">
              <span className="text-4xl">📻</span>
              <h3 className="font-display text-sm font-bold mt-4 mb-1">Nenhuma notícia encontrada</h3>
              <p className="text-xs text-brand-outline max-w-xs mx-auto">Não localizamos pautas ativas na categoria ou termo selecionado. Tente buscar um bairro ou submeta uma nova dica.</p>
            </div>
          ) : (
            filteredNews.map((news) => {
              const isLiked = likedArticles.includes(news.id);
              return (
                <div 
                  key={news.id}
                  onClick={() => handleOpenReadNews(news)}
                  className="bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand-outline/10 transition duration-300 border border-brand-container-high flex flex-col justify-between group cursor-pointer height-full relative"
                >
                  {/* Image overlay with tags */}
                  <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating Status / Category badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-extrabold text-brand-primary flex items-center gap-1.5 shadow-sm border border-brand-container-high uppercase tracking-wider">
                      <span>{news.badge}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-brand-on-surface/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-sm border border-brand-container-high">
                      <MapPin className="w-3 h-3 text-brand-secondary-container" />
                      <span>{news.neighborhood}</span>
                    </div>

                    {news.live && (
                      <div className="absolute top-4 right-4 bg-rose-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-md animate-pulse">
                        LIVE
                      </div>
                    )}
                  </div>

                  {/* News Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-outline">
                        <span>{news.category} • {news.date}</span>
                        <span className="flex items-center gap-1 text-brand-outline">
                          <Eye className="w-3.5 h-3.5 text-brand-outline" /> {news.views} views
                        </span>
                      </div>

                      <h3 className="font-display text-sm md:text-md font-bold text-brand-on-surface leading-snug line-clamp-2 mt-1.5 mb-2 group-hover:text-brand-primary transition">
                        {news.title}
                      </h3>

                      <p className="text-[11px] font-medium text-brand-on-surface-variant/80 leading-relaxed mb-6 line-clamp-3">
                        {news.summary}
                      </p>
                    </div>

                    {/* Engagement bar and Action Button */}
                    <div className="pt-4 border-t border-brand-surface flex justify-between items-center text-xs">
                      <div className="flex gap-2 text-brand-outline">
                        <button 
                          onClick={(e) => handleToggleLike(news.id, e)}
                          className={`p-1 px-2.5 rounded-lg flex items-center gap-1 font-bold ${
                            isLiked ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-brand-surface text-brand-outline'
                          }`}
                          title={isLiked ? "Descurtir" : "Curtir"}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                          <span>{news.likes}</span>
                        </button>

                        <Link 
                          to={`/eventos/${news.id}`}
                          onClick={(e) => { e.stopPropagation(); }}
                          className="p-1 px-2.5 rounded-lg hover:bg-brand-surface flex items-center gap-1 font-bold"
                          title="Comentários dos Leitores"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{news.comments.length}</span>
                        </Link>
                      </div>

                      <button 
                        onClick={(e) => handleSimulateShare(news.title, e)}
                        className="p-1.5 text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-surface rounded-lg transition"
                        title="Compartilhar Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
