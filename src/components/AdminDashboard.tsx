import React, { useState } from 'react';
import { 
  Eye, Star, Clipboard, Settings, Plus, Edit2, Play, Pause, Save, Trash2, MessageSquare, Utensils, X, CornerDownRight 
} from 'lucide-react';
import { Restaurant, Review, Dish } from '../types';

interface AdminDashboardProps {
  restaurant: Restaurant;
  onUpdateRestaurant: (updated: Restaurant) => void;
}

export default function AdminDashboard({
  restaurant,
  onUpdateRestaurant
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'cardapio' | 'avaliacoes' | 'config'>('geral');
  const [restaurantStatus, setRestaurantStatus] = useState<'Aberto' | 'Pausado'>('Aberto');
  
  // New/Edit Dish Form State
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState<number>(0);

  // Active Review Replying State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Configuration Fields State
  const [cfgName, setCfgName] = useState(restaurant.name);
  const [cfgCategory, setCfgCategory] = useState(restaurant.category);
  const [cfgDescription, setCfgDescription] = useState(restaurant.description);
  const [cfgAddress, setCfgAddress] = useState(restaurant.address);
  const [cfgPhone, setCfgPhone] = useState(restaurant.phone);
  const [cfgClose, setCfgClose] = useState(restaurant.closesAt);

  const handleDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || dishPrice <= 0) return;

    if (editingDish) {
      // Edit mode (Update)
      const updatedDishes = restaurant.dishes.map(d => 
        d.id === editingDish.id 
          ? { ...d, name: dishName, description: dishDesc, price: dishPrice }
          : d
      );
      onUpdateRestaurant({
        ...restaurant,
        dishes: updatedDishes
      });
      setEditingDish(null);
    } else {
      // Add mode (Create)
      const dishToAdd: Dish = {
        id: `dish-${Date.now()}`,
        name: dishName,
        description: dishDesc,
        price: dishPrice
      };
      onUpdateRestaurant({
        ...restaurant,
        dishes: [...restaurant.dishes, dishToAdd]
      });
    }

    // Reset Form
    setDishName('');
    setDishDesc('');
    setDishPrice(0);
  };

  const handleStartEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishDesc(dish.description ?? '');
    setDishPrice(dish.price);
  };

  const handleCancelEditDish = () => {
    setEditingDish(null);
    setDishName('');
    setDishDesc('');
    setDishPrice(0);
  };

  const handleDeleteDish = (id: string) => {
    const updated = {
      ...restaurant,
      dishes: restaurant.dishes.filter(d => d.id !== id)
    };
    onUpdateRestaurant(updated);
  };

  // Reviews Reply Flow
  const handleStartReply = (review: Review) => {
    setReplyingReviewId(review.id);
    setReplyText(review.reply || '');
  };

  const handleSaveReply = (reviewId: string) => {
    const updatedReviews = restaurant.reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, reply: replyText.trim() };
      }
      return r;
    });
    onUpdateRestaurant({
      ...restaurant,
      reviews: updatedReviews
    });
    setReplyingReviewId(null);
    setReplyText('');
  };

  const handleDeleteReply = (reviewId: string) => {
    const updatedReviews = restaurant.reviews.map(r => {
      if (r.id === reviewId) {
        const copy = { ...r };
         delete copy.reply;
         return copy;
      }
      return r;
    });
    onUpdateRestaurant({
      ...restaurant,
      reviews: updatedReviews
    });
  };

  // Configurations Flow
  const handleSaveConfig = () => {
    const updated = {
      ...restaurant,
      name: cfgName,
      category: cfgCategory,
      description: cfgDescription,
      address: cfgAddress,
      phone: cfgPhone,
      closesAt: cfgClose
    };
    onUpdateRestaurant(updated);
  };

  return (
    <div className="animate-fade-in flex-grow bg-brand-surface text-brand-on-surface flex flex-col md:flex-row border-t border-brand-container-highest">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-brand-container-high py-8 px-4 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <span className="block text-[10px] font-bold text-brand-outline tracking-wider uppercase px-3 mb-4">
              Navegação Interna
            </span>
            <nav className="space-y-1.5 text-left">
              <button
                onClick={() => setActiveSubTab('geral')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'geral'
                    ? 'bg-brand-container text-brand-primary shadow-xs'
                    : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'
                }`}
              >
                <Clipboard className="w-4 h-4 shrink-0" />
                <span>Visão Geral</span>
              </button>

              <button
                onClick={() => setActiveSubTab('cardapio')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'cardapio'
                    ? 'bg-brand-container text-brand-primary shadow-xs'
                    : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'
                }`}
              >
                <Utensils className="w-4 h-4 shrink-0" />
                <span>Meu Cardápio</span>
              </button>

              <button
                onClick={() => setActiveSubTab('avaliacoes')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'avaliacoes'
                    ? 'bg-brand-container text-brand-primary shadow-xs'
                    : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'
                }`}
              >
                <Star className="w-4 h-4 shrink-0" />
                <span>Avaliações</span>
              </button>

              <button
                onClick={() => setActiveSubTab('config')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'config'
                    ? 'bg-brand-container text-brand-primary shadow-xs'
                    : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Configurações</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Identity of Sidebar */}
        <div className="pt-6 border-t border-brand-container-highest mt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-brand-primary overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" 
                alt="Proprietário" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-extrabold text-brand-on-surface leading-tight">{restaurant.name}</p>
              <span className="text-[10px] text-brand-outline font-medium">Proprietário</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN COCKPIT ELEMENT */}
      <main className="flex-grow p-6 md:p-10 text-left">
        
        {/* Subtab: Geral */}
        {activeSubTab === 'geral' && (
          <div className="animate-fade-in space-y-8">
            
            {/* Header row with shortcut */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-brand-on-surface">
                  Visão Geral
                </h1>
                <p className="text-xs text-brand-on-surface-variant/80 font-medium">
                  Bem-vindo de volta! Gerencie e atualize a presença da sua <b>{restaurant.name}</b> no Sabor Salvador.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveSubTab('cardapio');
                  setEditingDish(null);
                }}
                className="bg-brand-primary text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-primary-container transition shadow-md shadow-brand-primary/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Prato</span>
              </button>
            </div>

            {/* Metrics cards container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Views */}
              <div className="bg-white rounded-2xl border border-brand-container-high p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center border border-brand-container-highest text-brand-secondary shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    +12%
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    Visualizações de Perfil
                  </span>
                  <p className="font-display text-3xl font-black text-brand-on-surface mt-1">
                    2.4k
                  </p>
                </div>
              </div>

              {/* Card 2: Rating */}
              <div className="bg-white rounded-2xl border border-brand-container-high p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center border border-brand-container-highest text-brand-secondary shrink-0">
                    <Star className="w-5 h-5 fill-brand-secondary-container text-brand-secondary-container" />
                  </div>
                  <span className="bg-brand-container text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Novo
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    Nota média (Dendê Meter)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="font-display text-3xl font-black text-brand-on-surface">
                      {restaurant.rating.toFixed(1)}
                    </p>
                    <div className="flex gap-0.5 text-xs text-brand-secondary-container">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>🌴</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Total dishes */}
              <div className="bg-white rounded-2xl border border-brand-container-high p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center border border-brand-container-highest text-brand-primary shrink-0">
                    <Utensils className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">
                    Pratos Registrados
                  </span>
                  <p className="font-display text-3xl font-black text-brand-on-surface mt-1">
                    {restaurant.dishes.length}
                  </p>
                  <span className="text-[10px] text-brand-on-surface-variant font-medium block mt-1">
                    Pronto para receber pedidos e visitas
                  </span>
                </div>
              </div>

            </div>

            {/* Split Screen Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Recent activities */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-brand-container-high">
                <div className="border-b border-brand-container pb-4 mb-6">
                  <h3 className="font-display text-md font-extrabold text-brand-on-surface">
                    Atividades Recentes
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Activity 1 */}
                  <div className="flex gap-4 items-start text-xs border-b border-brand-surface pb-5">
                    <div className="w-8 h-8 rounded-full bg-brand-container flex items-center justify-center text-brand-primary shrink-0 font-bold">
                      MS
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-brand-on-surface text-xs">Nova avaliação de Maria S.</h4>
                        <span className="text-[10px] text-brand-outline">Há 2 horas</span>
                      </div>
                      <p className="text-brand-on-surface-variant mt-1 italic">
                        "O melhor vatapá que já comi no Rio Vermelho! O ambiente é incrível."
                      </p>
                    </div>
                  </div>

                  {/* Activity 2 */}
                  <div className="flex gap-4 items-start text-xs border-b border-brand-surface pb-5">
                    <div className="w-8 h-8 rounded-full bg-[#ec4899]/10 text-[#ec4899] flex items-center justify-center shrink-0 font-bold">
                      JP
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-brand-on-surface text-xs">Nova reserva confirmada</h4>
                        <span className="text-[10px] text-brand-outline">Há 4 horas</span>
                      </div>
                      <p className="text-brand-on-surface-variant mt-1">
                        Mesa para 4 pessoas - Hoje às 20:00 (João P.)
                      </p>
                    </div>
                  </div>

                  {/* Activity 3 */}
                  <div className="flex gap-4 items-start text-xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold col">
                      🍳
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-brand-on-surface text-xs">Cardápio atualizado</h4>
                        <span className="text-[10px] text-brand-outline">Agora para visitantes</span>
                      </div>
                      <p className="text-brand-on-surface-variant mt-1">
                        Iguarias e receitas soteropolitanas prontas no diretório público.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Action blocks */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Block 1: Status */}
                <div className="bg-white p-6 rounded-2xl border border-brand-container-high">
                  <span className="block text-[10px] font-bold text-brand-outline uppercase tracking-wider mb-4">
                    Status de Atendimento
                  </span>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3.5 h-3.5 rounded-full ${restaurantStatus === 'Aberto' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <p className="text-xs font-bold text-brand-on-surface">
                      Sua casa está {restaurantStatus === 'Aberto' ? 'Aberta' : 'Pausada'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setRestaurantStatus('Aberto')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        restaurantStatus === 'Aberto' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-brand-surface text-brand-on-surface hover:bg-brand-container'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Ativar</span>
                    </button>

                    <button
                      onClick={() => setRestaurantStatus('Pausado')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        restaurantStatus === 'Pausado' 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-brand-surface text-brand-on-surface hover:bg-brand-container'
                      }`}
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pausar</span>
                    </button>
                  </div>
                </div>

                {/* Block 2: Spotlight recommendation */}
                <div className="bg-white p-6 rounded-2xl border border-brand-container-high text-left">
                  <span className="block text-[10px] font-bold text-brand-outline uppercase tracking-wider mb-3">
                    Prato Chefe em Destaque
                  </span>
                  
                  <h4 className="text-sm font-extrabold text-brand-on-surface">
                    {restaurant.dishes[0]?.name || "Receita de Moqueca"}
                  </h4>
                  <p className="text-[11px] text-brand-on-surface-variant mt-0.5 leading-relaxed line-clamp-2">
                    {restaurant.dishes[0]?.description || "A principal especialidade de dendê, amendoim e tempero baiano tradicional."}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-brand-surface flex justify-between items-center text-xs">
                    <span className="font-extrabold text-brand-primary">
                      R$ {(restaurant.dishes[0]?.price || 85).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => setActiveSubTab('cardapio')}
                      className="text-xs font-black text-brand-primary hover:underline hover:text-brand-primary-container cursor-pointer"
                    >
                      Gerenciar Cardápio
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Subtab 2: Meu Cardápio manager with exhaustive CRUD */}
        {activeSubTab === 'cardapio' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-on-surface">Meu Cardápio</h2>
              <p className="text-xs text-brand-on-surface-variant">Configure, adicione, edite ou exclua pratos no mostruário público.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Existing items list */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-brand-container-high space-y-4">
                <h3 className="font-display text-sm font-bold border-b border-brand-container pb-3 mb-4">Pratos Registrados</h3>
                
                {restaurant.dishes.length === 0 ? (
                  <p className="text-xs text-brand-outline italic">Sua culinária está vazia! Adicione seus primeiros pratos ao lado.</p>
                ) : (
                  restaurant.dishes.map((dish) => (
                    <div key={dish.id} className="p-4 rounded-xl bg-brand-surface border border-brand-outline-variant flex justify-between items-center gap-4 text-xs">
                      <div className="text-left-side">
                        <h4 className="font-bold text-brand-on-surface">{dish.name}</h4>
                        <p className="text-brand-outline mt-0.5 leading-snug">{dish.description}</p>
                        <span className="text-brand-primary font-extrabold block mt-1.5">R$ {dish.price.toFixed(2)}</span>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEditDish(dish)}
                          className="p-2 bg-brand-container text-brand-primary hover:bg-brand-primary/10 rounded-full transition"
                          title="Editar Prato"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 rounded-full text-rose-600 transition"
                          title="Deletar Prato"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add / Edit Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-brand-container-high text-left">
                <div className="flex justify-between items-center border-b border-brand-container pb-3 mb-4">
                  <h3 className="font-display text-sm font-bold">
                    {editingDish ? `Editar Prato: ${editingDish.name}` : "Adicionar Prato Novo"}
                  </h3>
                  {editingDish && (
                    <button 
                      onClick={handleCancelEditDish}
                      className="text-brand-outline hover:text-brand-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleDishSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Nome do Prato (Ex: Bobó de Camarão)</label>
                    <input 
                      type="text" 
                      required 
                      value={dishName}
                      onChange={e => setDishName(e.target.value)}
                      placeholder="Nome do Prato" 
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Preço em R$</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      step="0.01"
                      value={dishPrice || ''}
                      onChange={e => setDishPrice(parseFloat(e.target.value))}
                      placeholder="Ex: 85" 
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Descrição do Sabor/Iguaria</label>
                    <textarea 
                      rows={3}
                      value={dishDesc}
                      onChange={e => setDishDesc(e.target.value)}
                      placeholder="Insira as iguarias, farofa, camarão, coentro, amendoim..." 
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="flex gap-2">
                    {editingDish && (
                      <button 
                        type="button" 
                        onClick={handleCancelEditDish}
                        className="w-1/3 border border-brand-outline-variant text-brand-on-surface-variant font-bold text-xs py-2.5 rounded-lg hover:bg-brand-surface transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="flex-grow bg-brand-primary text-white font-bold text-xs py-2.5 rounded-lg hover:scale-101 transition cursor-pointer"
                    >
                      {editingDish ? "Salvar Alterações" : "Salvar Prato"}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Subtab: Avaliações with Owner Reply CRUD mechanics */}
        {activeSubTab === 'avaliacoes' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-on-surface">Opiniões de Clientes</h2>
              <p className="text-xs text-brand-on-surface-variant">Resenhas submetidas pelos visitantes com possibilidade de interação rústica e resposta rústica.</p>
            </div>

            <div className="space-y-4">
              {restaurant.reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl border border-brand-container-high transition hover:shadow-xs text-left">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-sm flex items-center justify-center shrink-0">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-brand-on-surface leading-snug">{rev.author}</h4>
                        <span className="text-[10px] text-brand-outline font-medium block mt-0.5">{rev.timeAgo}</span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-brand-secondary-container bg-brand-surface border border-brand-container-highest px-3 py-1 rounded-full">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i}>🌴</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-brand-on-surface-variant italic">
                    "{rev.comment}"
                  </p>

                  {/* Owner Response render */}
                  {rev.reply ? (
                    <div className="mt-4 p-4 rounded-xl bg-brand-surface border-l-4 border-brand-primary relative text-xs">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-brand-primary flex items-center gap-1.5">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          Resposta do Proprietário
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStartReply(rev)}
                            className="text-[10px] font-bold text-brand-outline hover:text-brand-primary"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteReply(rev.id)}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-700"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <p className="text-brand-on-surface-variant leading-relaxed font-semibold">
                        {rev.reply}
                      </p>
                    </div>
                  ) : null}

                  {/* Interacting replies entry */}
                  {replyingReviewId === rev.id ? (
                    <div className="mt-4 p-4 rounded-xl border border-brand-outline-variant bg-brand-surface space-y-3">
                      <label className="block text-[10px] font-extrabold text-brand-primary uppercase">Interagir com Resposta</label>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escreva sua resposta de gratidão baiana com axé..."
                        className="w-full bg-white border border-brand-outline-variant rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => setReplyingReviewId(null)}
                          className="px-3 py-1.5 border border-brand-outline-variant rounded-md text-brand-on-surface-variant font-bold text-[10px]"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveReply(rev.id)}
                          disabled={!replyText.trim()}
                          className="px-4 py-1.5 bg-brand-primary text-white rounded-md font-bold text-[10px] hover:bg-brand-primary-container transition"
                        >
                          Publicar Resposta
                        </button>
                      </div>
                    </div>
                  ) : (
                    !rev.reply && (
                      <div className="mt-4 pt-4 border-t border-brand-surface flex justify-end">
                        <button 
                          onClick={() => handleStartReply(rev)}
                          className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Responder Cliente</span>
                        </button>
                      </div>
                    )
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtab 4: Configurações view */}
        {activeSubTab === 'config' && (
          <div className="animate-fade-in space-y-6 max-w-xl">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-on-surface">Configurações do Perfil</h2>
              <p className="text-xs text-brand-on-surface-variant">Edite os dados básicos e a foto do estabelecimento exibidos no diretório.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-brand-container-high space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5">Nome de Exibição do Estabelecimento</label>
                <input 
                  type="text" 
                  value={cfgName}
                  onChange={e => setCfgName(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5">Categoria / Culinária Principal</label>
                <select 
                  value={cfgCategory}
                  onChange={e => setCfgCategory(e.target.value as any)}
                  className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                >
                  <option value="Acarajé">Acarajé</option>
                  <option value="Moqueca">Moqueca</option>
                  <option value="Hamburgueria">Hamburgueria</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Barzinho">Barzinho</option>
                  <option value="Café">Café</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5">Descrição Principal de Destaque</label>
                <textarea 
                  rows={3}
                  value={cfgDescription}
                  onChange={e => setCfgDescription(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5">Endereço Completo</label>
                <input 
                  type="text" 
                  value={cfgAddress}
                  onChange={e => setCfgAddress(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5">Telefone de Contato</label>
                <input 
                  type="text" 
                  value={cfgPhone}
                  onChange={e => setCfgPhone(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5">Horário de Fechamento (Ex: 23:00)</label>
                <input 
                  type="text" 
                  value={cfgClose}
                  onChange={e => setCfgClose(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-4 border-t border-brand-surface">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="bg-brand-primary hover:bg-brand-primary-container text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
