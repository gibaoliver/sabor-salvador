import React, { useState } from 'react';
import { Mail, BookOpen, Clock, Heart, ArrowRight, X, Send, User, Edit2, Trash2, Check, MessageCircle } from 'lucide-react';
import { GuideArticle } from '../types';

interface GuidesViewProps {
  articles: GuideArticle[];
}

interface ArticleComment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  timeAgo: string;
}

export default function GuidesView({ articles }: GuidesViewProps) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Modal Article Reader State
  const [activeArticle, setActiveArticle] = useState<GuideArticle | null>(null);
  
  // Comments CRUD State
  const [comments, setComments] = useState<ArticleComment[]>([
    {
      id: "comm-1",
      articleId: "art-1",
      author: "Juliana Santos (Chef)",
      content: "Que artigo magnífico! De fato, a herança das baianas de acarajé estrutura todo o saber culinário do recôncavo.",
      timeAgo: "Há 1 dia"
    },
    {
      id: "comm-2",
      articleId: "art-1",
      author: "Rodrigo Lôbo",
      content: "Uma aula de culinária e antropologia soteropolitana. Perfeito!",
      timeAgo: "Há 6 horas"
    },
    {
      id: "comm-3",
      articleId: "art-2",
      author: "Lívia Guedes",
      content: "Eu já fui em duas dessas feiras de quintal. O amendoim e a cachaça regional são excelentes!",
      timeAgo: "Há 2 dias"
    }
  ]);
  
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Newsletter Flow
  const handleSubmitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
  };

  // Add Comment (Create)
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle || !commentAuthor.trim() || !commentContent.trim()) return;

    const newComment: ArticleComment = {
      id: `comm-${Date.now()}`,
      articleId: activeArticle.id,
      author: commentAuthor,
      content: commentContent,
      timeAgo: "Agora mesmo"
    };

    setComments(prev => [newComment, ...prev]);
    setCommentAuthor('');
    setCommentContent('');
  };

  // Delete Comment (Delete)
  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  // Start Edit (Setup Update)
  const handleStartEdit = (comm: ArticleComment) => {
    setEditingCommentId(comm.id);
    setEditingContent(comm.content);
  };

  // Save Edit (Update)
  const handleSaveEdit = (id: string) => {
    if (!editingContent.trim()) return;
    setComments(prev => prev.map(c => c.id === id ? { ...c, content: editingContent } : c));
    setEditingCommentId(null);
    setEditingContent('');
  };

  const mainArticle = articles[0] || null;
  const secondaryArticles = articles.slice(1);

  // Article Detailed Body Custom Mapping for maximum aesthetic look
  const getDetailedBody = (id: string) => {
    if (id === 'art-1') {
      return `O azeite de dendê não é meramente um ingrediente na culinária de Salvador; ele é o sangue que corre nas veias da tradição espiritual e alimentar da Bahia. Extraído do fruto da palmeira Elaeis guineensis, trazida pelas diásporas ancestrais da Costa Ocidental africana, o dendê representa resistência, conexão com os orixás e a perpetuação do matriarcado culinário no Pelourinho e além.\n\nA preparação da moqueca ideal exige sabedoria. Primeiro, a panela rústica de barro tradicional do Recôncavo (especialmente de Maragogipinho) precisa estar bem aquecida. O leite de coco precisa ser fresco, batido na hora, rústico e espesso. Mas o grandioso toque é o azeite de dendê puro de pilão, que adiciona aquela tonalidade alaranjada brilhante e aquele aroma terroso e esfumaçado irresistível.\n\nNas feiras tradicionais como a de São Joaquim, as baianas selecionam com carinho cada ingrediente de produtores locais. Assim, consumir um acarajé ou uma moqueca é participar de um banquete histórico eterno, sustentado pelo afeto baiano caloroso.`;
    }
    if (id === 'art-2') {
      return `Longe dos grandes palcos comerciais e circuitos turísticos, pequenos coletivos artísticos e feiras independentes estão redefinindo as tardes soteropolitanas em bairros residenciais arborizados de Salvador.\n\nEventos como as 'feiras de quintal' no Santo Antônio Além do Caramuru, Rio Vermelho e Graça criam palcos intimistas onde cantores e compositores locais de bossa, samba alternativo, jazz e afropop expressam suas canções diretamente para um público caloroso. Ao lado de mesas de madeira improvisadas, artesãos exibem xilogravuras, cervejas caseiras aromatizadas com folhas locais e cerâmicas que celebram a herança soteropolitana.\n\nEsses pólos representam o autêntico movimento de descentralização urbana. É o ritmo urbano respirando autenticidade, em uma sinergia amigável onde todos se apoiam.`;
    }
    return `Explore as profundezas culturais e as belíssimas paisagens de Salvador. Nossos guias trazem detalhes exclusivos sobre locais históricos, as melhores praias escondidas da Baía de Todos-os-Santos e experiências de culinária artesanal tradicional.\n\nAproveite sua visita à capital baiana entrando em contato com a população nativa, provando o pirão de peixe fresco à beira-mar e dançando ao som de tambores ancestrais que vibram no coração histórico da cidade.`;
  };

  return (
    <div className="animate-fade-in bg-brand-surface text-brand-on-surface py-12 px-4 md:px-8 flex-grow">
      <div className="max-w-7xl mx-auto">
        
        {/* Title area */}
        <div className="mb-12 text-left">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-brand-primary mb-3">
            Guias & Reportagens
          </h1>
          <p className="text-brand-on-surface-variant max-w-2xl text-md font-medium">
            Explore mergulhos profundos na cultura baiana, histórias culinárias ancestrais e roteiros de fim de semana escritos por quem vive Salvador.
          </p>
        </div>

        {/* 1. HUGE FEATURED ARTICLE */}
        {mainArticle && (
          <div className="bg-white rounded-3xl overflow-hidden border border-brand-container-high shadow-xl shadow-brand-outline/5 mb-16 flex flex-col lg:flex-row hover:shadow-2xl transition duration-500 group">
            <div className="lg:w-1/2 relative min-h-[250px] lg:min-h-[420px]">
              <img 
                src={mainArticle.imageUrl} 
                alt={mainArticle.title} 
                className="w-full h-full object-cover group-hover:scale-101 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-primary-container text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Especial
              </div>
            </div>

            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary mb-3 block">
                  {mainArticle.category} • {mainArticle.date}
                </span>

                <h2 className="font-display text-2xl md:text-3.5xl font-extrabold text-brand-on-surface leading-tight mb-4 group-hover:text-brand-primary transition">
                  {mainArticle.title}
                </h2>

                <p className="text-xs md:text-sm text-brand-on-surface-variant leading-relaxed mb-6">
                  {mainArticle.summary}
                </p>
              </div>

              <div className="flex justify-between items-center bg-brand-surface p-4 rounded-2xl border border-brand-container-high mt-auto">
                <span className="text-xs font-bold text-brand-outline flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mainArticle.readTime ?? '6 min leitura'}</span>
                </span>
                
                <button 
                  onClick={() => setActiveArticle(mainArticle)}
                  className="bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Leia a Matéria Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SPLIT SECTION: LOWER ARTICLES & HIGHLIGHT COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left Area - List of secondary articles */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border-b border-brand-container-highest pb-3 mb-6">
              <h3 className="font-display text-lg font-extrabold text-brand-on-surface text-left">
                Mais Histórias Recentes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryArticles.map((art) => (
                <div 
                  key={art.id} 
                  className="bg-white rounded-3xl overflow-hidden border border-brand-container-high flex flex-col justify-between hover:shadow-md transition duration-300 group height-full"
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[9px] font-bold text-brand-on-surface px-3 py-1 rounded-xl shadow-xs">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[10px] font-bold text-brand-outline">{art.date}</span>
                      <h4 className="font-display text-md font-bold text-brand-on-surface leading-snug line-clamp-2 mt-1 mb-3 group-hover:text-brand-primary transition">
                        {art.title}
                      </h4>
                      <p className="text-xs text-brand-on-surface-variant line-clamp-3 mb-6">
                        {art.summary}
                      </p>
                    </div>

                    <button 
                      onClick={() => setActiveArticle(art)}
                      className="text-xs font-bold text-brand-primary hover:text-brand-primary-container flex items-center gap-1 cursor-pointer self-start group/btn"
                    >
                      <span>Ler artigo</span>
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Area - Side panel list */}
          <div className="lg:col-span-4 self-stretch">
            <div className="bg-white p-6 rounded-3xl border border-brand-container-high h-full text-left">
              <h3 className="font-display text-sm font-bold text-brand-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <span>Em Destaque</span>
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex gap-4 items-start">
                    <span className="font-display text-2xl font-extrabold text-brand-primary/20 leading-none col shrink-0">01</span>
                    <div>
                      <h4 
                        onClick={() => mainArticle && setActiveArticle(mainArticle)}
                        className="text-xs font-bold text-brand-on-surface hover:text-brand-primary transition cursor-pointer"
                      >
                        Novo pólo gastronômico na Barra aposta em fusão baiano-asiática
                      </h4>
                      <p className="text-[10px] text-brand-outline mt-1 font-medium">Há 2 horas</p>
                    </div>
                  </div>
                </div>

                <hr className="border-brand-container-highest" />

                <div>
                  <div className="flex gap-4 items-start">
                    <span className="font-display text-2xl font-extrabold text-brand-primary/20 leading-none col shrink-0">02</span>
                    <div>
                      <h4 
                        onClick={() => secondaryArticles[0] && setActiveArticle(secondaryArticles[0])}
                        className="text-xs font-bold text-brand-on-surface hover:text-brand-primary transition cursor-pointer"
                      >
                        Entrevista: O renascimento do axé indie nos pequenos palcos do Rio Vermelho
                      </h4>
                      <p className="text-[10px] text-brand-outline mt-1 font-medium">Ontem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NEWSLETTER BANNER */}
        <div className="bg-brand-container-high border border-brand-container-highest rounded-3xl p-8 md:p-12 text-left flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="max-w-xl text-left">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>Newsletter Semanal</span>
            </span>
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-brand-on-surface mb-2">
              O pulso de Salvador no seu email
            </h3>
            <p className="text-xs text-brand-on-surface-variant leading-relaxed">
              Receba nossa curadoria semanal com os melhores shows rústicos, eventos comunitários espontâneos, coberturas de restaurantes e bastidores históricos exclusivos.
            </p>
          </div>

          {subscribed ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 px-6 rounded-2xl border border-emerald-200 text-center text-xs font-bold animate-pulse">
              🎉 Inscrito com sucesso! Cheque seu email em breve.
            </div>
          ) : (
            <form 
              onSubmit={handleSubmitNewsletter}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 max-w-md"
            >
              <input 
                type="email" 
                placeholder="Seu melhor email..." 
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
                className="bg-white border border-brand-outline-variant px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-primary placeholder-brand-on-surface-variant/40 w-full sm:w-64 text-left"
              />
              <button 
                type="submit"
                className="bg-brand-primary-container hover:bg-brand-primary text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-md shadow-brand-primary-container/20 shrink-0 cursor-pointer text-center"
              >
                Inscrever-se
              </button>
            </form>
          )}
        </div>

      </div>

      {/* 4. MODAL DETAILED ARTICLE CORNER READER WITH COMMENTS CRUD */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative text-left border border-brand-container-high animate-fade-in flex flex-col">
            
            {/* Sticky Header inside Scroll */}
            <div className="sticky top-0 z-20 p-5 border-b border-brand-container flex justify-between items-center bg-white/95 backdrop-blur-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary">
                Lendo: Roteiro & Reportagens • {activeArticle.category}
              </span>
              <button 
                onClick={() => {
                  setActiveArticle(null);
                  setEditingCommentId(null);
                }}
                className="p-1 px-2.5 bg-brand-surface rounded-full text-brand-outline hover:text-brand-primary font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content inside Modal */}
            <div className="p-6 md:p-8 space-y-6 flex-grow overflow-y-auto">
              {/* Photo */}
              <div className="rounded-2xl overflow-hidden h-60 w-full relative shrink-0">
                <img 
                  src={activeArticle.imageUrl} 
                  alt={activeArticle.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-5 pt-12">
                  <p className="text-[10px] uppercase font-bold text-brand-secondary-container">{activeArticle.date}</p>
                  <h2 className="font-display text-lg md:text-xl font-extrabold text-white mt-1">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>

              {/* Author & Read metadata */}
              <div className="flex gap-4 items-center text-xs text-brand-outline font-semibold border-b border-brand-surface pb-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <p className="text-brand-on-surface font-extrabold">Redação Sabor Salvador</p>
                  <span>{activeArticle.readTime ?? '5 min'} leitura e sabedoria</span>
                </div>
              </div>

              {/* Detailed description and paragraphs */}
              <div className="text-xs leading-relaxed text-brand-on-surface-variant/90 space-y-4 font-medium whitespace-pre-line">
                {getDetailedBody(activeArticle.id)}
              </div>

              {/* COMMENTS SECTION (CRUD PROCESSES) */}
              <div className="border-t border-brand-container-highest pt-8 mt-4">
                <h3 className="font-display text-sm font-extrabold text-brand-on-surface mb-6 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-brand-primary" />
                  <span>Comentários Comunitários ({comments.filter(c => c.articleId === activeArticle.id).length})</span>
                </h3>

                {/* Submit New Comment */}
                <form onSubmit={handleAddComment} className="bg-brand-surface p-4 rounded-2xl border border-brand-outline-variant/60 space-y-3 mb-6">
                  <h4 className="text-[10px] font-black uppercase text-brand-outline">Compartilhe sua percepção soteropolitana</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-outline" />
                      <input 
                        type="text" 
                        required
                        placeholder="Seu nome"
                        value={commentAuthor}
                        onChange={e => setCommentAuthor(e.target.value)}
                        className="w-full bg-white border border-brand-outline-variant rounded-xl pl-9 pr-3 py-2 text-[11px] font-semibold focus:outline-none focus:border-brand-primary text-left"
                      />
                    </div>
                    <div className="sm:col-span-2 relative">
                      <input 
                        type="text" 
                        required
                        placeholder="O que achou desta história baiana?"
                        value={commentContent}
                        onChange={e => setCommentContent(e.target.value)}
                        className="w-full bg-white border border-brand-outline-variant rounded-xl px-4 py-2 text-[11px] font-semibold focus:outline-none focus:border-brand-primary text-left"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="bg-brand-primary hover:bg-brand-primary-container text-white text-[11px] font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Postar</span>
                    </button>
                  </div>
                </form>

                {/* Comments List Thread with full Edit/Delete actions */}
                <div className="space-y-4">
                  {comments.filter(c => c.articleId === activeArticle.id).length === 0 ? (
                    <p className="text-[11px] text-brand-outline italic text-left">Nenhum comentário ainda. Seja o primeiro a escrever!</p>
                  ) : (
                    comments.filter(c => c.articleId === activeArticle.id).map(comm => (
                      <div key={comm.id} className="p-4 rounded-2xl bg-white border border-brand-container-high relative">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                              {comm.author.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-extrabold text-brand-on-surface leading-tight">{comm.author}</span>
                            <span className="text-[9px] text-brand-outline font-medium">{comm.timeAgo}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStartEdit(comm)}
                              className="text-[9px] font-bold text-brand-outline hover:text-brand-primary"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comm.id)}
                              className="text-[9px] font-bold text-rose-500 hover:text-rose-700"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>

                        {/* If in edit state */}
                        {editingCommentId === comm.id ? (
                          <div className="mt-2 flex gap-2">
                            <input 
                              type="text"
                              value={editingContent}
                              onChange={e => setEditingContent(e.target.value)}
                              className="flex-grow bg-brand-surface border border-brand-outline-variant p-1.5 px-3 rounded-lg text-xs font-semibold focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveEdit(comm.id)}
                              className="p-1 px-2.5 bg-emerald-500 text-white rounded-lg flex items-center gap-1 font-bold text-[10px]"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-brand-on-surface-variant font-medium leading-relaxed italic text-left pl-8">
                            "{comm.content}"
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

            {/* Modal Bottom control action */}
            <div className="p-4 bg-brand-surface border-t border-brand-container flex justify-end">
              <button
                onClick={() => {
                  setActiveArticle(null);
                  setEditingCommentId(null);
                }}
                className="bg-brand-on-surface text-white text-xs font-bold py-2 px-5 rounded-xl cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
