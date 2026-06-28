import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-surface/90 border-b border-brand-container-highest flex-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Styled with font-display Montserrat */}
        <Link 
          to="/"
          className="flex items-center gap-2 cursor-pointer group"
          id="brand-logo-container"
        >
          <span className="font-display text-2xl font-bold tracking-tight text-brand-primary transition group-hover:text-brand-primary-container">
            Sabor Salvador
          </span>
        </Link>

        {/* Navigation Links for Visitors - Screen Headers */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-brand-on-surface-variant">
          <Link
            to="/restaurantes"
            className={`hover:text-brand-primary transition-colors py-1 relative ${
              currentPath.startsWith('/restaurantes') ? 'text-brand-primary font-semibold border-b-2 border-brand-primary' : ''
            }`}
          >
            Restaurantes
          </Link>
          <Link
            to="/eventos"
            className={`hover:text-brand-primary transition-colors py-1 relative ${
              currentPath.startsWith('/eventos') ? 'text-brand-primary font-semibold border-b-2 border-brand-primary' : ''
            }`}
          >
            Eventos
          </Link>
        </nav>

        {/* Interactive Controls (Search, Notifications) */}
        <div className="flex items-center gap-4">
          <Link 
            to="/restaurantes"
            className="p-2 hover:bg-brand-container-low rounded-full text-brand-on-surface-variant transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

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
