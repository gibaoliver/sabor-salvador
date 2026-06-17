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

        {/* 1. VISUAL GALLERY SPLIT - Screen 2 main hero showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* Main Huge Dish Showcase (Moqueca Clay Pot) - Left column (7 cols) */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-md relative h-[320px] md:h-[480px]">
            <img 
              src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80" 
              alt="Moqueca de Camarão Fervente" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-left">
              <span className="bg-brand-secondary-container text-brand-on-surface-variant font-bold text-[10px] uppercase.tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                Especialidade da Casa
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-xs md:text-sm text-brand-surface-bright/80 max-w-xl font-medium">
                {restaurant.neighborhood} • {restaurant.category} • Bahia Original
              </p>
            </div>
          </div>

          {/* Side Rattan Lounge & Plated Fish Images - Right column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Top Subcategory: Rattan dining room */}
            <div className="rounded-3xl overflow-hidden shadow-md h-[180px] md:h-[228px]">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
                alt="Ambiente Rústico Sofisticado com Lustres de Palha" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Subcategory: Seafood plate fillet */}
            <div className="rounded-3xl overflow-hidden shadow-md h-[180px] md:h-[228px]">
              <img 
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80" 
                alt="Grelhado de Peixe ao Purê" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>

        {/* 2. DESCRIPTION & HIGHLIGHTS GRID SPLIT - Screen 2 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Left Content - Descriptive paragraph & Menu Highlights (7 cols) */}
          <div className="lg:col-span-8">
            <div className="mb-10 text-left">
              <p className="text-sm md:text-md leading-relaxed text-brand-on-surface-variant/90 font-medium whitespace-pre-line">
                O ambiente da {restaurant.name} é uma jornada cultural profundamente imersiva, cercada por obras de arte locais, hospitalidade baiana calorosa e o aroma irresistível de dendê fresco batido e leite de coco fresco. Cada prato conta uma história do rico patrimônio histórico de Salvador, meticulosamente preparado com ingredientes nativos da agricultura familiar regional.
              </p>
            </div>

            {/* Menu Highlights list */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-left">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                <h2 className="font-display text-xl font-extrabold text-brand-on-surface">
                  Menu Highlights
                </h2>
              </div>

              {/* Loop through actual dishes */}
              <div className="space-y-4">
                {restaurant.dishes.length === 0 ? (
                  <p className="text-xs text-brand-outline italic text-left">Consultar cardápio completo do dia no estabelecimento.</p>
                ) : (
                  restaurant.dishes.map((dish) => (
                    <div 
                      key={dish.id}
                      className="bg-white p-6 rounded-2xl border border-brand-container-high hover:border-brand-primary/20 hover:shadow-sm transition text-left-side"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2 text-left">
                        <h3 className="font-display text-md font-bold text-brand-on-surface">
                          {dish.name}
                        </h3>
                        <span className="text-sm font-extrabold text-brand-primary shrink-0">
                          R$ {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-brand-on-surface-variant leading-relaxed text-left">
                        {dish.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Information Cards & Directions widget (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
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
                    <h4 className="text-brand-on-surface font-extrabold">Address</h4>
                    <p className="font-medium mt-0.5">{restaurant.address}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                  <div>
                    <h4 className="text-brand-on-surface font-extrabold">Phone</h4>
                    <p className="font-medium mt-0.5">{restaurant.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Map Device */}
            <div className="bg-[#fadcd2]/40 rounded-3xl p-4 border border-brand-container-highest flex flex-col justify-between items-center text-center relative h-52 overflow-hidden shadow-inner">
              <div 
                className="absolute inset-0 opacity-25 bg-[radial-gradient(#a73a00_1px,transparent_1px)]"
                style={{ backgroundSize: '12px 12px' }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 bg-brand-primary-container/20 rounded-full flex items-center justify-center animate-pulse">
                  <MapPin className="w-6 h-6 text-brand-primary animate-bounce" />
                </div>
              </div>
              
              <div className="z-10 mt-auto w-full">
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`)}
                  className="w-full bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-xs py-3 px-5 rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-101"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
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
