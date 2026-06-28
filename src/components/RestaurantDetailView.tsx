import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star, ChevronLeft, Send, Sparkles, Navigation } from 'lucide-react';
import { Restaurant, Review } from '../types';

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddReview: (restaurantId: string, review: Review) => void;
}

export default function RestaurantDetailView({
  restaurant,
  onBack,
  onAddReview
}: RestaurantDetailViewProps) {
  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !userComment.trim()) return;

    const newReview: Review = {
      id: `usr-rev-${Date.now()}`,
      author: authorName,
      rating: userRating,
      comment: userComment,
      timeAgo: 'Agora mesmo'
    };

    onAddReview(restaurant.id, newReview);
    // Reset fields
    setAuthorName('');
    setUserComment('');
    setUserRating(5);
  };

  return (
    <div className="animate-fade-in bg-[#fff8f6] text-[#271812] py-8 px-4 md:px-8 flex-grow">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation back link */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-primary-container mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para Listagem</span>
        </button>

        {/* 1. HERO BANNER FULL WIDTH */}
        <div className="rounded-3xl overflow-hidden shadow-md relative h-[320px] md:h-[480px] mb-10 w-full bg-slate-800">
          {restaurant.imageUrl ? (
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surface border border-brand-container-high">
              <Sparkles className="w-12 h-12 text-brand-outline-variant mb-4" />
              <span className="text-brand-outline font-bold text-sm">Nenhuma foto de capa cadastrada</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white text-left flex items-end gap-6">
            {/* Logo if exists (Desktop) */}
            {restaurant.logoUrl && (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-2 shrink-0 shadow-2xl overflow-hidden hidden sm:block border-4 border-white/20">
                 <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
            )}
            <div>
              <span className="bg-brand-secondary-container text-brand-on-surface-variant font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                Especialidade da Casa
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-2 leading-tight drop-shadow-md">
                {restaurant.name}
              </h1>
              <p className="text-xs md:text-sm text-brand-surface-bright/90 font-medium drop-shadow-sm">
                {restaurant.neighborhood} • {restaurant.category} • Bahia Original
              </p>
            </div>
          </div>
        </div>

        {/* 2. DESCRIPTION & HIGHLIGHTS GRID SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Left Content (7 cols) */}
          <div className="lg:col-span-8 text-left">
            {/* Mobile Logo if exists */}
            {restaurant.logoUrl && (
              <div className="w-20 h-20 bg-white rounded-2xl p-2 mb-6 shadow-md overflow-hidden sm:hidden block border border-brand-container-high">
                 <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
            )}
            
            <div className="mb-12">
              <p className="text-sm md:text-base leading-relaxed text-brand-on-surface-variant font-medium whitespace-pre-line">
                {restaurant.description || 'Nenhuma descrição informada pelo restaurante.'}
              </p>
            </div>

            {/* Menu Highlights list */}
            <div>
              <div className="flex items-center gap-2 mb-8 border-b border-brand-container-highest pb-4 text-left">
                <h2 className="font-display text-2xl font-extrabold text-brand-on-surface">
                  Sugestões do Chef
                </h2>
              </div>

              {/* Loop through dishes */}
              <div className="space-y-6">
                {restaurant.dishes.length === 0 ? (
                  <p className="text-xs text-brand-outline italic text-left">Consultar cardápio completo do dia no estabelecimento.</p>
                ) : (
                  restaurant.dishes.map((dish) => (
                    <div 
                      key={dish.id}
                      className="bg-white p-6 rounded-3xl border border-brand-container-high hover:border-brand-primary/20 hover:shadow-md transition text-left flex flex-col md:flex-row gap-6 items-start"
                    >
                      {dish.imageUrl ? (
                        <img 
                          src={dish.imageUrl} 
                          alt={dish.name} 
                          className="w-full md:w-36 h-48 md:h-36 object-cover rounded-2xl shrink-0 shadow-sm" 
                        />
                      ) : (
                        <div className="w-full md:w-36 h-48 md:h-36 bg-brand-container-low border border-brand-container-highest rounded-2xl shrink-0 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-brand-outline-variant" />
                        </div>
                      )}
                      
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start gap-4 mb-3 text-left">
                          <h3 className="font-display text-lg font-bold text-brand-on-surface leading-snug">
                            {dish.name}
                          </h3>
                          <span className="text-sm font-extrabold text-brand-secondary shrink-0">
                            R$ {dish.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-brand-on-surface-variant leading-relaxed text-left mb-4">
                          {dish.description}
                        </p>
                        
                        {/* Tags for presentation like in the model */}
                        <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 border border-brand-outline-variant rounded-full text-[9px] font-bold text-brand-outline uppercase tracking-wider">Original</span>
                           <span className="px-3 py-1 border border-brand-outline-variant rounded-full text-[9px] font-bold text-brand-outline uppercase tracking-wider">Chef's Choice</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Information Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Horário de Funcionamento Box */}
            <div className="bg-[#f7f5f2] border border-[#e8e4dc] p-6 rounded-3xl text-left shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-brand-on-surface border-b border-[#e8e4dc] pb-4">
                 <Clock className="w-5 h-5 text-brand-secondary" />
                 <h3 className="font-display text-lg font-bold">Horário de Funcionamento</h3>
              </div>
              
              <div className="space-y-4 text-xs font-semibold text-brand-on-surface-variant border-b border-[#e8e4dc] pb-6 mb-6">
                 <div className="flex justify-between items-center">
                    <span>Seg - Qui</span>
                    <span>18:00 - {restaurant.closesAt}</span>
                 </div>
                 <div className="flex justify-between items-center text-brand-secondary">
                    <span>Sex - Sáb</span>
                    <span>12:00 - 00:00</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span>Domingo</span>
                    <span>12:00 - 21:00</span>
                 </div>
              </div>
              
              <div className="bg-[#efeadf] p-4 rounded-xl text-center italic text-xs text-brand-on-surface-variant font-medium mb-6 shadow-inner">
                 "A arte da culinária é a linguagem universal do afeto."
              </div>

              <button className="w-full py-3.5 bg-[#1a1a1a] text-white font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-black transition shadow-lg flex items-center justify-center gap-2">
                 Solicitar Reserva
              </button>
            </div>

            {/* Contact details box */}
            <div className="bg-brand-container-low border border-brand-container-highest p-6 rounded-3xl text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Aberto agora • Closes at {restaurant.closesAt}
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold text-brand-on-surface-variant">
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                  <div>
                    <h4 className="text-brand-on-surface font-extrabold">Endereço</h4>
                    <p className="font-medium mt-0.5">{restaurant.address}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                  <div>
                    <h4 className="text-brand-on-surface font-extrabold">Telefone</h4>
                    <p className="font-medium mt-0.5">{restaurant.phone || '(71) 99999-9999'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Map Device */}
            <div className="bg-[#fadcd2]/40 rounded-3xl p-4 border border-brand-container-highest flex flex-col justify-between items-center text-center relative h-40 overflow-hidden shadow-inner group">
              <div 
                className="absolute inset-0 opacity-25 bg-[radial-gradient(#a73a00_1px,transparent_1px)]"
                style={{ backgroundSize: '12px 12px' }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-brand-primary-container/20 rounded-full flex items-center justify-center animate-pulse">
                  <MapPin className="w-6 h-6 text-brand-primary group-hover:animate-bounce" />
                </div>
              </div>
              
              <div className="z-10 mt-auto w-full">
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`)}
                  className="w-full bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-xs py-3 px-5 rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-101"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Obter Rotas</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. REVIEWS GRID WITH GUEST SUBMISSIONS */}
        <section className="border-t border-brand-container-highest pt-12 text-left mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl font-extrabold text-brand-on-surface">
              Guest Reviews
            </h2>
            <div className="flex items-center gap-1 text-sm font-semibold text-brand-on-surface-variant">
              <Star className="w-4 h-4 text-brand-secondary-container fill-brand-secondary-container" />
              <span>{restaurant.rating} de 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Reviews display list */}
            <div className="lg:col-span-8 space-y-4">
              {restaurant.reviews.length === 0 ? (
                <p className="text-xs text-brand-outline italic">Ainda não há avaliações para este local. Seja o primeiro a escrever!</p>
              ) : (
                restaurant.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-brand-container-high shadow-xs">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-sm flex items-center justify-center">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-on-surface leading-tight">{rev.author}</p>
                          <span className="text-[10px] text-brand-outline font-medium">{rev.timeAgo}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-brand-secondary-container">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-brand-secondary-container text-brand-secondary-container" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-brand-on-surface-variant leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Simulated Review Submission Widget */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-brand-container-high shadow-xs text-left">
              <h3 className="font-display text-sm font-bold text-brand-on-surface mb-4">
                Deixe seu palpite
              </h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Seu Nome</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Gilberto Macêdo" 
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2 text-xs font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Nota da Moqueca / Prato</label>
                  <div className="flex gap-1.5 mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setUserRating(num)}
                        className={`p-1.5 rounded transition ${userRating >= num ? 'text-brand-secondary-container' : 'text-brand-outline-variant'}`}
                        aria-label={`Evaluate ${num} stars`}
                      >
                        <Star className={`w-4 h-4 ${userRating >= num ? 'fill-brand-secondary-container' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Minha opinião</label>
                  <textarea 
                    rows={3}
                    placeholder="Descreva o sabor, atendimento, o dendê e o carinho do lugar..." 
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2 text-xs font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-brand-primary-container/15"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Avaliação</span>
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
