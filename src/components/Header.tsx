import React from 'react';
import { Search, Bell, User, LogOut, Menu, ArrowLeftRight } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'restaurants' | 'events' | 'guides' | 'login' | 'admin';
  setActiveTab: (tab: 'home' | 'restaurants' | 'events' | 'guides' | 'login' | 'admin') => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  selectedRestaurantId?: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
}

export default function Header({
  activeTab, 
  setActiveTab, 
  isLoggedIn, 
  onLogout,
  selectedRestaurantId,
  setSelectedRestaurantId
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-surface/90 border-b border-brand-container-highest flex-none">
      {/* Visual Workspace Controller for high-fidelity evaluation of all 7 screens */}
      <div className="bg-brand-primary text-white text-xs px-4 py-2 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 animate-pulse text-brand-secondary-container" />
          <span><b>Painel de Navegação de Protótipo (Selecione a Tela):</b></span>
        </span>
        <div className="flex gap-2 text-[10px]">
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('home'); }} 
            className={`px-2 py-0.5 rounded transition ${activeTab === 'home' && !selectedRestaurantId ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            1. Home
          </button>
          <button 
            onClick={() => { setSelectedRestaurantId('casa-de-tereza'); setActiveTab('restaurants'); }} 
            className={`px-2 py-0.5 rounded transition ${selectedRestaurantId === 'casa-de-tereza' && activeTab === 'restaurants' ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            2. Detalhes (Moqueca)
          </button>
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('login'); }} 
            className={`px-2 py-0.5 rounded transition ${activeTab === 'login' ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            4. Login Proprietário
          </button>
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab(isLoggedIn ? 'admin' : 'login'); }} 
            className={`px-2 py-0.5 rounded transition ${activeTab === 'admin' ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            3. Painel Administrador {isLoggedIn ? '✓' : ''}
          </button>
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('restaurants'); }} 
            className={`px-2 py-0.5 rounded transition ${activeTab === 'restaurants' && !selectedRestaurantId ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            5. Busca Restaurantes
          </button>
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('events'); }} 
            className={`px-2 py-0.5 rounded transition ${activeTab === 'events' ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            6. Feed Eventos
          </button>
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('guides'); }} 
            className={`px-2 py-0.5 rounded transition ${activeTab === 'guides' ? 'bg-brand-secondary-container text-brand-on-surface font-bold' : 'bg-white/10 hover:bg-white/20'}`}
          >
            7. Guias & Blog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Styled with font-display Montserrat */}
        <div 
          onClick={() => { setSelectedRestaurantId(null); setActiveTab('home'); }}
          className="flex items-center gap-2 cursor-pointer group"
          id="brand-logo-container"
        >
          <span className="font-display text-2xl font-bold tracking-tight text-brand-primary transition group-hover:text-brand-primary-container">
            Sabor Salvador
          </span>
        </div>

        {/* Navigation Links for Visitors - Screen Headers */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-brand-on-surface-variant">
          <button
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('restaurants'); }}
            className={`hover:text-brand-primary transition-colors py-1 relative ${
              activeTab === 'restaurants' && !selectedRestaurantId ? 'text-brand-primary font-semibold border-b-2 border-brand-primary' : ''
            }`}
          >
            Restaurantes
          </button>
          <button
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('events'); }}
            className={`hover:text-brand-primary transition-colors py-1 relative ${
              activeTab === 'events' ? 'text-brand-primary font-semibold border-b-2 border-brand-primary' : ''
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('guides'); }}
            className={`hover:text-brand-primary transition-colors py-1 relative ${
              activeTab === 'guides' ? 'text-brand-primary font-semibold border-b-2 border-brand-primary' : ''
            }`}
          >
            Guias & Blog
          </button>
        </nav>

        {/* Interactive Controls (Sign In status, Search, Notifications) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedRestaurantId(null); setActiveTab('restaurants'); }}
            className="p-2 hover:bg-brand-container-low rounded-full text-brand-on-surface-variant transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            className="p-2 hover:bg-brand-container-low rounded-full text-brand-on-surface-variant transition relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-primary-container rounded-full ring-2 ring-brand-surface" />
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-brand-container pr-3 pl-1.5 py-1.5 rounded-full border border-brand-container-highest">
              <div 
                onClick={() => setActiveTab('admin')}
                className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm relative overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Tereza Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:block text-left cursor-pointer" onClick={() => setActiveTab('admin')}>
                <p className="text-xs font-semibold text-brand-on-surface line-clamp-1 leading-none">Tereza</p>
                <span className="text-[10px] text-brand-outline font-medium">Proprietária</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-1 hover:bg-brand-container-high rounded-full text-brand-primary transition ml-1"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="bg-brand-primary-container hover:bg-brand-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-md shadow-brand-primary-container/15 hover:scale-102 flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Anunciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
