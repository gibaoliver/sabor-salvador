import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'restaurants' | 'events' | 'guides';
  setActiveTab: (tab: 'home' | 'restaurants' | 'events' | 'guides') => void;
  selectedRestaurantId?: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
}

export default function Header({
  activeTab, 
  setActiveTab, 
  selectedRestaurantId,
  setSelectedRestaurantId
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-surface/90 border-b border-brand-container-highest flex-none">
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

        {/* Interactive Controls (Search, Notifications) */}
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
        </div>
      </div>
    </header>
  );
}
