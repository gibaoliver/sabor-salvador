import React from 'react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'restaurants' | 'events' | 'guides') => void;
  setSelectedRestaurantId: (id: string | null) => void;
}

export default function Footer({ setActiveTab, setSelectedRestaurantId }: FooterProps) {
  const handleNav = (tab: 'home' | 'restaurants' | 'events' | 'guides') => {
    setSelectedRestaurantId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-on-surface text-brand-surface py-12 px-6 md:px-12 border-t border-brand-outline/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Sabor Salvador</h2>
          <p className="text-sm text-brand-container opacity-80 max-w-sm">
            O guia definitivo da gastronomia soteropolitana. Descubra restaurantes autênticos, eventos sazonais e as melhores moquecas sob o sol da Bahia.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 test-sm font-medium text-brand-container-highest">
          <button onClick={() => handleNav('home')} className="hover:text-white transition">Início</button>
          <button onClick={() => handleNav('restaurants')} className="hover:text-white transition">Restaurantes</button>
          <button onClick={() => handleNav('events')} className="hover:text-white transition">Eventos</button>
          <button onClick={() => handleNav('guides')} className="hover:text-white transition">Guias & Blog</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-brand-container/60 gap-4">
        <div>
          <span>© 2024 Sabor Salvador. O guia definitivo da gastronomia soteropolitana.</span>
        </div>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:underline">Políticas de Privacidade</a>
          <a href="#terms" className="hover:underline">Termos de Uso</a>
          <a href="#work" className="hover:underline">Trabalhe Conosco</a>
          <a href="#partner" className="hover:underline">Anuncie Aqui</a>
        </div>
      </div>
    </footer>
  );
}
