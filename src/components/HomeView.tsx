import React, { useState } from 'react';
import { Search, MapPin, Star, CupSoda, Flame, Coffee } from 'lucide-react';
import { Restaurant } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeViewProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (id: string) => void;
  setSearchFood: (term: string) => void;
  setSearchBairro: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
}

export default function HomeView({
  restaurants,
  onSelectRestaurant,
  setSearchFood,
  setSearchBairro,
  setSelectedCategory
}: HomeViewProps) {
  const navigate = useNavigate();
  const [foodInput, setFoodInput] = useState('');
  const [bairroInput, setBairroInput] = useState('');

  const featuredList = restaurants.filter(r => r.featured);
  
  // Hardcoded Categories from Screen 1 image
  const categories = [
    { label: 'Acarajé', emoji: '🧆' },
    { label: 'Moqueca', emoji: '🍲' },
    { label: 'Hamburgueria', emoji: '🍔' },
    { label: 'Sushi', emoji: '🍣' },
    { label: 'Barzinho', emoji: '🍹' },
    { label: 'Café', emoji: '☕' }
  ];

  const handleSearchBtn = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFood(foodInput);
    setSearchBairro(bairroInput);
    navigate('/restaurantes');
  };

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    navigate('/restaurantes');
  };

  // Renders the customized palm tree / sun rating "Dendê Meter"
  const renderDendeMeter = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-brand-secondary-container" title={`Nota: ${rating}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="text-sm font-bold">🌴</span>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in bg-brand-surface text-brand-on-surface flex-grow">
      {/* 1. HERO CORNER - Screen 1 Header Background */}
      <section 
        className="relative min-h-[500px] md:min-h-[560px] flex flex-col justify-center items-center px-4 py-16 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(39, 24, 18, 0.45), rgba(39, 24, 18, 0.70)), url('https://images.unsplash.com/photo-1594142404563-64cccaf5a10f?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="text-center max-w-3xl mx-auto z-10">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md">
            Descubra o melhor sabor de Salvador
          </h1>
          <p className="text-lg md:text-xl text-brand-surface-bright opacity-95 mb-10 max-w-xl mx-auto font-medium drop-shadow-sm">
            Encontre restaurantes tradicionais, quiosques de acarajé e eventos vibrantes na capital da Bahia.
          </p>

          {/* Dual Search Engine Widget */}
          <form 
            onSubmit={handleSearchBtn}
            className="bg-white p-2.5 md:p-3.5 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto border border-brand-container-highest"
          >
            <div className="flex items-center gap-3 w-full px-4 border-b md:border-b-0 md:border-r border-brand-container-highest py-2 md:py-0">
              <Search className="w-5 h-5 text-brand-primary shrink-0" />
              <input
                type="text"
                placeholder="O que você quer comer?"
                className="w-full text-brand-on-surface placeholder-brand-on-surface-variant/60 focus:outline-none text-sm font-medium"
                value={foodInput}
                onChange={e => setFoodInput(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full px-4 py-2 md:py-0">
              <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
              <input
                type="text"
                placeholder="Qual bairro? (Rio Vermelho, Barra, Pelourinho...)"
                className="w-full text-brand-on-surface placeholder-brand-on-surface-variant/60 focus:outline-none text-sm font-medium"
                value={bairroInput}
                onChange={e => setBairroInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-sm px-8 py-3.5 rounded-xl md:rounded-full w-full md:w-auto transition-all shadow-md shadow-brand-primary-container/20 cursor-pointer shrink-0"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* 2. CHIP FILTER BAR - Screen 1 Pill categories */}
      <section className="py-8 bg-white border-b border-brand-container-highest">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-3">
            {categories.map((cat) => {
              const isActive = cat.label === 'Moqueca'; // Show default highlight as requested in screenshot Screen 1
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.label)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    isActive 
                      ? 'bg-brand-primary-container text-white border-brand-primary-container shadow-sm hover:opacity-95' 
                      : 'bg-white text-brand-on-surface-variant border-brand-outline-variant hover:bg-brand-surface hover:text-brand-primary'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SPOTLIGHT SECTION: "Bento Grid de Destaques" */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3/5 py-1.5 rounded-full select-none uppercase tracking-widest mb-3 inline-block">
            Bento Grid Curado
          </span>
          <h2 className="font-display text-3.5xl md:text-4.5xl font-extrabold text-brand-on-surface tracking-tight mb-3">
            Em Destaque
          </h2>
          <p className="text-brand-on-surface-variant text-md max-w-xl font-medium">
            Os lugares e experiências mais bem avaliados por quem entende de sabor e ama Salvador.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] md:auto-rows-[190px] lg:auto-rows-[210px]">
          
          {/* Card 1: Huge Hero Bento (Casa de Tereza) - spans 8 cols, 2 rows in large screens */}
          <div className="md:col-span-12 lg:col-span-8 lg:row-span-2 bg-brand-primary text-white rounded-[24px] p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group shadow-lg hover:shadow-2xl transition duration-500">
            {/* Absolute decorative circle matching Bento template */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition duration-500" />
            <div className="absolute top-0 right-0 w-full h-full bg-cover bg-center brightness-60 opacity-20 group-hover:opacity-30 group-hover:scale-101 transition duration-500 select-none pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80')` }} />
            
            <div className="relative z-10 text-left">
              <span className="text-[10px] font-extrabold bg-white/20 text-white px-3 py-1.5 rounded-md uppercase tracking-wider mb-6 inline-block">
                ★ MELHOR DA BAHIA
              </span>
              <h3 className="font-display text-3xl md:text-4.5xl font-extrabold tracking-tight leading-tight mb-4 group-hover:translate-x-1 transition duration-300">
                Casa de Tereza
              </h3>
              <p className="text-sm md:text-base text-white/95 max-w-xl font-medium leading-relaxed">
                A Casa de Tereza é uma viagem de sabores em um ambiente que respira arte baiana. Cada prato conta uma história de dendê e axé.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌴🌴🌴</span>
                <span className="text-xs font-bold text-white/90">Rio Vermelho • 4.8 Rating</span>
              </div>
              <button 
                onClick={() => onSelectRestaurant('casa-de-tereza')}
                className="bg-white text-brand-primary hover:bg-brand-surface-dim font-bold text-xs px-6 py-3 rounded-full transition shadow-md self-stretch sm:self-auto cursor-pointer"
              >
                Conhecer Menu Completo
              </button>
            </div>
          </div>

          {/* Card 2: Stats Bento Block - spans 4 cols, 1 row */}
          <div className="md:col-span-6 lg:col-span-4 bg-white rounded-[24px] border border-brand-container-high p-6 flex flex-col justify-between hover:shadow-xl transition duration-300">
            <div className="text-left">
              <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-wider block mb-1">
                DENDÊ INDEX
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4.5xl font-black text-brand-on-surface">94.8%</span>
                <span className="text-xs font-bold text-emerald-500 font-sans">★ Excelente</span>
              </div>
            </div>
            
            {/* Visual React-like miniature graph bars matching Bento template */}
            <div className="h-10 w-full bg-brand-surface rounded-lg flex items-end gap-1.5 p-1.5 mt-4">
              <div className="h-[40%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[60%]" />
              <div className="h-[75%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[90%]" />
              <div className="h-[60%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[80%]" />
              <div className="h-[95%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[100%]" />
              <div className="h-[65%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[85%]" />
              <div className="h-[85%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[95%]" />
              <div className="h-[90%] w-[15%] bg-brand-primary rounded-xs transition-all hover:h-[100%]" />
            </div>
          </div>

          {/* Card 3: Interactive Status / Live events - spans 4 cols, 1 row */}
          <div className="md:col-span-6 lg:col-span-4 bg-brand-on-surface text-brand-surface rounded-[24px] p-6 flex flex-col justify-between hover:shadow-xl transition duration-300 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-secondary/15 rounded-full blur-md" />
            
            <div className="flex justify-between items-center z-10 text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">ONLINE AGORA</span>
              </div>
              <span className="text-[10px] font-bold text-brand-surface/75 bg-white/10 px-2.5 py-1 rounded-md">BOHEMIA</span>
            </div>

            <div className="my-3 z-10 text-left">
              <h4 className="font-display text-lg font-bold text-white mb-1">Rio Vermelho Ativo</h4>
              <p className="text-xs text-brand-surface/80">3 eventos musicais rústicos acontecendo neste fim de semana.</p>
            </div>

            <button 
              onClick={() => navigate('/eventos')}
              className="w-full text-center bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer z-10"
            >
              Ver Programação Oficial →
            </button>
          </div>

          {/* Card 4: Secondary Beautiful Restaurant Bento (Dona Mariquita) - spans 6 cols, 1 row */}
          <div className="md:col-span-6 lg:col-span-6 bg-white rounded-[24px] border border-brand-container-high p-6 flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-xl transition duration-300 group">
            <div className="sm:w-1/3 min-h-[140px] bg-brand-surface rounded-[18px] overflow-hidden relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80" 
                alt="Dona Mariquita" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col justify-between flex-grow text-left">
              <div>
                <span className="text-[10px] font-extrabold text-brand-secondary uppercase tracking-wider">Cultura de Raiz</span>
                <h4 className="font-display text-lg font-bold text-brand-on-surface line-clamp-1 mt-0.5 group-hover:text-brand-primary transition duration-300">
                  Dona Mariquita
                </h4>
                <p className="text-xs text-brand-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                  Sabores tradicionais de terreiros ensopados com carinho, resgatando origens autênticas no Rio Vermelho.
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-bold text-brand-on-surface">★ 4.9 (920)</span>
                <button 
                  onClick={() => onSelectRestaurant('dona-mariquita')}
                  className="text-xs font-extrabold text-brand-primary hover:text-brand-primary-container"
                >
                  Espiar Menu →
                </button>
              </div>
            </div>
          </div>

          {/* Card 5: Tertiary Beautiful Restaurant Bento (Cuco Bistrô) - spans 6 cols, 1 row */}
          <div className="md:col-span-6 lg:col-span-6 bg-white rounded-[24px] border border-brand-container-high p-6 flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-xl transition duration-300 group">
            <div className="sm:w-1/3 min-h-[140px] bg-brand-surface rounded-[18px] overflow-hidden relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80" 
                alt="Cuco Bistrô" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col justify-between flex-grow text-left">
              <div>
                <span className="text-[10px] font-extrabold text-brand-secondary uppercase tracking-wider">Centro Histórico</span>
                <h4 className="font-display text-lg font-bold text-brand-on-surface line-clamp-1 mt-0.5 group-hover:text-brand-primary transition duration-300">
                  Cuco Bistrô
                </h4>
                <p className="text-xs text-brand-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                  Localizado no coração do Pelourinho, combina herança baiana clássica com alta gastronomia contemporânea de alto nível.
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-bold text-brand-on-surface">★ 4.6 (810)</span>
                <button 
                  onClick={() => onSelectRestaurant('cuco-bistro')}
                  className="text-xs font-extrabold text-brand-primary hover:text-brand-primary-container"
                >
                  Espiar Menu →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
