import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MessageCircle, Send, User, Check, Edit2, X, BookOpen, ArrowLeft } from 'lucide-react';
import { GuideArticle } from '../types';

interface ArticleComment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  timeAgo: string;
}

interface GuideDetailViewProps {
  articles: GuideArticle[];
}

export default function GuideDetailView({ articles }: GuideDetailViewProps) {
  const { slug } = useParams();
  const [currentUser] = useState<string>(() => localStorage.getItem('sabor_salvador_user') || '');
  const [article, setArticle] = useState<GuideArticle | null>(null);

  // Comments State
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
  
  const [commentAuthor, setCommentAuthor] = useState(currentUser);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    if (!slug) return;
    const found = articles.find(a => a.id === slug);
    if (found) {
      setArticle(found);
    }
  }, [slug, articles]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentAuthor.trim() || !commentContent.trim()) return;

    if (!currentUser) {
      localStorage.setItem('sabor_salvador_user', commentAuthor.trim());
    }

    const newComment: ArticleComment = {
      id: `comm-${Date.now()}`,
      articleId: article.id,
      author: commentAuthor.trim(),
      content: commentContent.trim(),
      timeAgo: "Agora mesmo"
    };

    setComments(prev => [newComment, ...prev]);
    setCommentContent('');
  };

  const handleStartEdit = (comm: ArticleComment) => {
    setEditingCommentId(comm.id);
    setEditingContent(comm.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingContent.trim()) return;
    setComments(prev => prev.map(c => c.id === id ? { ...c, content: editingContent, timeAgo: 'Editado agora' } : c));
    setEditingCommentId(null);
    setEditingContent('');
  };

  const getDetailedBody = (id: string) => {
    if (id === 'art-1') {
      return `O azeite de dendê não é meramente um ingrediente na culinária de Salvador; ele é o sangue que corre nas veias da tradição espiritual e alimentar da Bahia. Extraído do fruto da palmeira Elaeis guineensis, trazida pelas diásporas ancestrais da Costa Ocidental africana, o dendê representa resistência, conexão com os orixás e a perpetuação do matriarcado culinário no Pelourinho e além.\n\nA preparação da moqueca ideal exige sabedoria. Primeiro, a panela rústica de barro tradicional do Recôncavo (especialmente de Maragogipinho) precisa estar bem aquecida. O leite de coco precisa ser fresco, batido na hora, rústico e espesso. Mas o grandioso toque é o azeite de dendê puro de pilão, que adiciona aquela tonalidade alaranjada brilhante e aquele aroma terroso e esfumaçado irresistível.\n\nNas feiras tradicionais como a de São Joaquim, as baianas selecionam com carinho cada ingrediente de produtores locais. Assim, consumir um acarajé ou uma moqueca é participar de um banquete histórico eterno, sustentado pelo afeto baiano caloroso.`;
    }
    if (id === 'art-2') {
      return `Longe dos grandes palcos comerciais e circuitos turísticos, pequenos coletivos artísticos e feiras independentes estão redefinindo as tardes soteropolitanas em bairros residenciais arborizados de Salvador.\n\nEventos como as 'feiras de quintal' no Santo Antônio Além do Caramuru, Rio Vermelho e Graça criam palcos intimistas onde cantores e compositores locais de bossa, samba alternativo, jazz e afropop expressam suas canções diretamente para um público caloroso. Ao lado de mesas de madeira improvisadas, artesãos exibem xilogravuras, cervejas caseiras aromatizadas com folhas locais e cerâmicas que celebram a herança soteropolitana.\n\nEsses pólos representam o autêntico movimento de descentralização urbana. É o ritmo urbano respirando autenticidade, em uma sinergia amigável onde todos se apoiam.`;
    }
    return `Explore as profundezas culturais e as belíssimas paisagens de Salvador. Nossos guias trazem detalhes exclusivos sobre locais históricos, as melhores praias escondidas da Baía de Todos-os-Santos e experiências de culinária artesanal tradicional.\n\nAproveite sua visita à capital baiana entrando em contato com a população nativa, provando o pirão de peixe fresco à beira-mar e dançando ao som de tambores ancestrais que vibram no coração histórico da cidade.`;
  };

  if (!article) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-surface py-20 text-center">
        <div>
          <p className="text-brand-on-surface-variant font-bold mb-4">Carregando detalhes do guia...</p>
          <Link to="/guias" className="text-brand-primary font-bold underline hover:text-brand-primary-container">
            Voltar para Guias
          </Link>
        </div>
      </div>
    );
  }

  const articleComments = comments.filter(c => c.articleId === article.id);

  return (
    <div className="animate-fade-in bg-white min-h-screen text-brand-on-surface flex-grow py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-container-high relative">
        <div className="p-4 bg-brand-surface border-b border-brand-container flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Lendo: Roteiro & Reportagens</span>
          </div>
          <Link to="/guias" className="text-brand-outline hover:text-brand-primary p-1 bg-white rounded-full transition">
            <X className="w-5 h-5" />
          </Link>
        </div>

        <div className="p-6 md:p-8 space-y-6 flex-grow">
          {/* Photo */}
          <div className="rounded-2xl overflow-hidden h-60 md:h-80 w-full relative shrink-0 shadow-md">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-6 pt-12">
              <p className="text-[10px] uppercase font-bold text-brand-secondary-container">{article.date}</p>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mt-2 leading-tight">
                {article.title}
              </h2>
            </div>
          </div>

          {/* Author & Read metadata */}
          <div className="flex gap-4 items-center text-xs text-brand-outline font-semibold border-b border-brand-surface pb-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary-container text-white flex items-center justify-center font-bold text-sm shadow-sm">
              SS
            </div>
            <div>
              <p className="text-brand-on-surface font-extrabold">Redação Sabor Salvador</p>
              <span className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> {article.readTime ?? '5 min leitura'}</span>
            </div>
          </div>

          {/* Detailed description and paragraphs */}
          <div className="text-sm md:text-base leading-relaxed text-brand-on-surface-variant/90 space-y-6 font-medium whitespace-pre-line text-justify">
            {getDetailedBody(article.id)}
          </div>

          {/* COMMENTS SECTION */}
          <div className="border-t border-brand-container-highest pt-8 mt-10">
            <h3 className="font-display text-lg font-extrabold text-brand-on-surface mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-brand-primary" />
              <span>Comentários Comunitários ({articleComments.length})</span>
            </h3>

            {/* Submit New Comment */}
            <form onSubmit={handleAddComment} className="bg-brand-surface p-6 rounded-3xl border border-brand-outline-variant/60 space-y-4 mb-8 shadow-sm">
              <h4 className="text-[11px] font-black uppercase text-brand-outline">Compartilhe sua percepção soteropolitana</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline" />
                  <input 
                    type="text" 
                    required
                    placeholder="Seu nome"
                    value={commentAuthor}
                    onChange={e => setCommentAuthor(e.target.value)}
                    className="w-full bg-white border border-brand-outline-variant rounded-xl pl-11 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="sm:col-span-2 relative">
                  <input 
                    type="text" 
                    required
                    placeholder="O que achou desta história baiana?"
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    className="w-full bg-white border border-brand-outline-variant rounded-xl px-5 py-3 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary-container text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Postar</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {articleComments.length === 0 ? (
                <p className="text-xs text-brand-outline italic text-left">Nenhum comentário ainda. Seja o primeiro a escrever!</p>
              ) : (
                articleComments.map(comm => (
                  <div key={comm.id} className="p-5 rounded-2xl bg-white border border-brand-container-high relative shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary-container/10 text-brand-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {comm.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-extrabold text-brand-on-surface leading-tight">{comm.author}</span>
                        <span className="text-[10px] text-brand-outline font-medium">{comm.timeAgo}</span>
                      </div>

                      <div className="flex gap-2">
                        {currentUser === comm.author && (
                          <button
                            onClick={() => handleStartEdit(comm)}
                            className="text-[10px] font-bold text-brand-outline hover:text-brand-primary flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" /> Editar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* If in edit state */}
                    {editingCommentId === comm.id ? (
                      <div className="mt-3 flex gap-2">
                        <input 
                          type="text"
                          value={editingContent}
                          onChange={e => setEditingContent(e.target.value)}
                          className="flex-grow bg-brand-surface border border-brand-outline-variant p-2.5 px-4 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-primary"
                        />
                        <button
                          onClick={() => handleSaveEdit(comm.id)}
                          className="p-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-xl flex items-center gap-1.5 font-bold text-[10px]"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-brand-on-surface-variant font-medium leading-relaxed italic text-left pl-11">
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
        <div className="p-5 bg-brand-surface border-t border-brand-container flex justify-between items-center">
          <span className="text-[10px] text-brand-outline font-extrabold uppercase">Guias Sabor Salvador</span>
          <Link
            to="/guias"
            className="bg-brand-on-surface text-white text-xs font-bold py-3 px-6 rounded-xl hover:bg-brand-on-surface-variant transition cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Guias
          </Link>
        </div>

      </div>
    </div>
  );
}
