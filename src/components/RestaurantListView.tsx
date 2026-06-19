import React, { useState, useMemo } from 'react';
import { MapPin, Star, Filter, ArrowUpDown } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantListViewProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (id: string) => void;
  searchFood: string;
  setSearchFood: (term: string) => void;
  searchBairro: string;
  setSearchBairro: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories?: string[];
}

export default function RestaurantListView({
  restaurants,
  onSelectRestaurant,
  searchFood,
  setSearchFood,
  searchBairro,
  setSearchBairro,
  selectedCategory,
  setSelectedCategory,
  categories = []
}: RestaurantListViewProps) {
  const [bairroFilter, setBairroFilter] = useState<'Todas' | 'Rio Vermelho' | 'Barra' | 'Pelourinho' | 'Pituba'>('Todas');
  const [priceFilter, setPriceFilter] = useState<'Todas' | '$' | '$$' | '$$$'>('Todas');
  const [localSearch, setLocalSearch] = useState('');

  // Handle preselected queries from Home dashboard
  const activeBairro = useMemo(() => {
    return searchBairro ? searchBairro : bairroFilter;
  }, [searchBairro, bairroFilter]);

  // Combined filters
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      // Bairro filter match (relaxed check if set from search input or strict match)
      if (activeBairro !== 'Todas') {
        const matchInput = activeBairro.toLowerCase().trim();
        if (!restaurant.neighborhood.toLowerCase().includes(matchInput)) {
          return false;
        }
      }

      // Category filter match
      if (selectedCategory && selectedCategory !== 'Todas') {
        if (restaurant.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Price filter match
      if (priceFilter !== 'Todas' && restaurant.priceRange !== priceFilter) {
        return false;
      }

      // Query term search in food text, name, description
      const query = (searchFood || localSearch).toLowerCase().trim();
      if (query) {
        const matchName = restaurant.name.toLowerCase().includes(query);
        const matchDesc = restaurant.description.toLowerCase().includes(query);
        const matchDish = restaurant.dishes.some(d => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query));
        return matchName || matchDesc || matchDish;
      }

      return true;
    });
  }, [restaurants, activeBairro, selectedCategory, priceFilter, searchFood, localSearch]);

  const resetFilters = () => {
    setBairroFilter('Todas');
    setPriceFilter('Todas');
    setSelectedCategory('Todas');
    setLocalSearch('');
    setSearchFood('');
    setSearchBairro('');
  };

  return (
    <div className="animate-fade-in bg-brand-surface text-brand-on-surface py-12 px-4 md:px-8 flex-grow">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title Section - Screen 5 layout */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-brand-primary mb-4 leading-tight">
            Gastronomia em Salvador
          </h1>
          <p className="text-brand-on-surface-variant text-md md:text-lg max-w-3xl leading-relaxed">
            Descubra os melhores sabores da Bahia. De acarajés na fogueira de rua a moquecas borbulhantes sofisticadas, explore a rica culinária que dá alma a Salvador.
          </p>
        </div>

        {/* 2. DYNAMIC FILTERS CARD - Screen 5 Layout Panel */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-brand-container-high shadow-xl shadow-brand-outline/5 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Filter by Neighborhood */}
            <div className="lg:col-span-5">
              <span className="block text-xs font-bold text-brand-on-surface-variant uppercase tracking-wider mb-3">
                Bairros Populares
              </span>
              <div className="flex flex-wrap gap-2">
                {(['Todas', 'Rio Vermelho', 'Barra', 'Pituba', 'Pelourinho'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSearchBairro('');
                      setBairroFilter(b);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      (searchBairro ? searchBairro === b : activeBairro === b)
                        ? 'bg-brand-primary-container text-white border-brand-primary-container shadow-sm'
                        : 'bg-brand-surface text-brand-on-surface-variant border-brand-outline-variant hover:border-brand-primary'
                    }`}
                  >
                    {b === 'Todas' ? 'Qualquer Bairro' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Category */}
            <div className="lg:col-span-3">
              <label htmlFor="category-select" className="block text-xs font-bold text-brand-on-surface-variant uppercase tracking-wider mb-3">
                Categoria
              </label>
              <select
                id="category-select"
                className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-on-surface focus:outline-none focus:border-brand-secondary transition"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Todas">Todas as categorias</option>
                {categories.length > 0 ? (
                  categories.map(c => <option key={c} value={c}>{c}</option>)
                ) : (
                  <>
                    <option value="Acarajé">Acarajé</option>
                    <option value="Moqueca">Moqueca</option>
                    <option value="Hamburgueria">Hamburgueria</option>
                    <option value="Sushi">Sushi</option>
                    <option value="Barzinho">Barzinho</option>
                    <option value="Café">Café</option>
                  </>
                )}
              </select>
            </div>

            {/* Filter by Price Segment */}
            <div className="lg:col-span-3">
              <span className="block text-xs font-bold text-brand-on-surface-variant uppercase tracking-wider mb-3">
                Preço
              </span>
              <div className="flex bg-brand-surface border border-brand-outline-variant rounded-xl p-1">
                {(['Todas', '$', '$$', '$$$'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition ${
                      priceFilter === p
                        ? 'bg-brand-primary-container text-white shadow-sm'
                        : 'text-brand-on-surface-variant hover:text-brand-primary'
                    }`}
                  >
                    {p === 'Todas' ? 'Tudo' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Active search or Clear Actions */}
            <div className="lg:col-span-1 flex items-center justify-end">
              {(bairroFilter !== 'Todas' || priceFilter !== 'Todas' || selectedCategory !== 'Todas' || searchFood || localSearch || searchBairro) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-brand-primary hover:text-brand-primary-container font-extrabold underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Quick search input */}
          <div className="mt-6 pt-6 border-t border-brand-container-high flex items-center gap-2">
            <input 
              type="text"
              placeholder="Digite palavra-chave adicional para buscar..."
              value={localSearch || searchFood}
              onChange={(e) => {
                setSearchFood('');
                setLocalSearch(e.target.value);
              }}
              className="bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2 text-xs font-semibold text-brand-on-surface w-full max-w-md focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* 3. DIRECTORY HEADER RESULTS - Screen 5 */}
        <div className="flex justify-between items-center mb-8 pb-3 border-b border-brand-container-highest">
          <p className="text-brand-on-surface-variant font-bold text-sm">
            Mostrando {filteredRestaurants.length} restaurantes {activeBairro !== 'Todas' ? `no bairro ${activeBairro}` : ''}
          </p>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant hover:text-brand-primary">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Ordenar</span>
          </button>
        </div>

        {/* 4. RESTAURANT GRID */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-brand-container-high">
            <span className="text-4xl">🥘</span>
            <h3 className="font-display text-lg font-bold text-brand-on-surface mt-4 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-xs text-brand-on-surface-variant max-w-sm mx-auto mb-6">
              Não encontramos restaurantes com os filtros selecionados. Tente expandir sua pesquisa por bairro ou digite outro prato.
            </p>
            <button
              onClick={resetFilters}
              className="bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-xs px-6 py-2.5 rounded-full transition"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => {
              // Exact screenshots highlight buttons differently:
              // - "A Casa da Moqueca" has full orange button.
              // - others usually have border "Ver Detalhes" button.
              const isCasaDaMoqueca = restaurant.id === 'casa-de-tereza' || restaurant.id === 'a-casa-da-moqueca';
              return (
                <div 
                  key={restaurant.id}
                  className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition duration-300 border border-brand-container-high flex flex-col group h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-brand-on-surface flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-brand-primary" />
                      <span>{restaurant.neighborhood}</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 className="font-display text-lg font-bold text-brand-on-surface line-clamp-1 leading-snug">
                          {restaurant.name}
                        </h3>
                        <span className="text-xs font-extrabold text-brand-primary shrink-0">
                          {restaurant.priceRange}
                        </span>
                      </div>

                      {/* Ratings stars count */}
                      <div className="flex items-center gap-1 mb-3 text-xs text-brand-outline font-medium">
                        <Star className="w-3.5 h-3.5 text-brand-secondary-container fill-brand-secondary-container" />
                        <span className="font-extrabold text-brand-on-surface">{restaurant.rating}</span>
                        <span>({restaurant.reviewsCount || 100})</span>
                      </div>

                      <p className="text-xs leading-relaxed text-brand-on-surface-variant line-clamp-3 mb-6">
                        {restaurant.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectRestaurant(restaurant.id)}
                      className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl transition cursor-pointer ${
                        isCasaDaMoqueca
                          ? 'bg-brand-primary-container hover:bg-brand-primary text-white shadow-sm shadow-brand-primary-container/10'
                          : 'border-2 border-brand-on-surface-variant hover:border-brand-primary text-brand-on-surface hover:text-brand-primary'
                      }`}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. PAGINATION COMPONENT - Screen 5 layout */}
        <div className="flex justify-center items-center gap-2 mt-16">
          <button className="w-9 h-9 border border-brand-outline-variant hover:border-brand-primary rounded-full flex items-center justify-center text-xs font-bold text-brand-on-surface transition hover:bg-brand-surface">
            ‹
          </button>
          <button className="w-9 h-9 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md shadow-brand-primary/10">
            1
          </button>
          <button className="w-9 h-9 border border-brand-outline-variant hover:border-brand-primary rounded-full flex items-center justify-center text-xs font-bold text-brand-on-surface transition hover:bg-brand-surface">
            2
          </button>
          <button className="w-9 h-9 border border-brand-outline-variant hover:border-brand-primary rounded-full flex items-center justify-center text-xs font-bold text-brand-on-surface transition hover:bg-brand-surface">
            3
          </button>
          <span className="text-xs font-semibold text-brand-outline px-1">...</span>
          <button className="w-9 h-9 border border-brand-outline-variant hover:border-brand-primary rounded-full flex items-center justify-center text-xs font-bold text-brand-on-surface transition hover:bg-brand-surface">
            12
          </button>
          <button className="w-9 h-9 border border-brand-outline-variant hover:border-brand-primary rounded-full flex items-center justify-center text-xs font-bold text-brand-on-surface transition hover:bg-brand-surface">
            ›
          </button>
        </div>

      </div>
    </div>
  );
}
