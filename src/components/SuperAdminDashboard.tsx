import React, { useState } from 'react';
import { 
  LayoutDashboard, Store, Calendar, BookOpen, Plus, Edit2, Trash2, Tags, Image as ImageIcon, DollarSign, Clock, MapPin, Phone, X, Upload
} from 'lucide-react';
import { Restaurant, Event, GuideArticle, Dish } from '../types';
import { uploadImageToSupabase } from '../supabaseService';

interface SuperAdminDashboardProps {
  restaurants: Restaurant[];
  events: Event[];
  articles: GuideArticle[];
  categories: string[];
  onAddRestaurant: (rest: Restaurant) => void;
  onUpdateRestaurant: (rest: Restaurant) => void;
  onDeleteRestaurant: (id: string) => void;
  onAddEvent: (ev: Event) => void;
  onUpdateEvent: (ev: Event) => void;
  onDeleteEvent: (id: string) => void;
  onAddArticle: (art: GuideArticle) => void;
  onUpdateArticle: (art: GuideArticle) => void;
  onDeleteArticle: (id: string) => void;
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
}

export default function SuperAdminDashboard({
  restaurants, events, articles, categories,
  onAddRestaurant, onUpdateRestaurant, onDeleteRestaurant,
  onAddEvent, onUpdateEvent, onDeleteEvent,
  onAddArticle, onUpdateArticle, onDeleteArticle,
  onAddCategory, onDeleteCategory
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'events' | 'articles' | 'categories'>('overview');
  
  // -- Restaurant Form State --
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [restName, setRestName] = useState('');
  const [restCategory, setRestCategory] = useState(categories[0] || '');
  const [restNeighborhood, setRestNeighborhood] = useState<'Rio Vermelho' | 'Barra' | 'Pelourinho' | 'Pituba'>('Rio Vermelho');
  const [restImageUrl, setRestImageUrl] = useState('');
  const [restImageFile, setRestImageFile] = useState<File | null>(null);
  const [restDescription, setRestDescription] = useState('');
  const [restDishes, setRestDishes] = useState<Dish[]>([]);
  const [isSavingRest, setIsSavingRest] = useState(false);

  // -- Dish Form State --
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishFile, setNewDishFile] = useState<File | null>(null);

  // -- Event Form State --
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evNeighborhood, setEvNeighborhood] = useState('');
  const [evPrice, setEvPrice] = useState('');
  const [evCategory, setEvCategory] = useState(categories[0] || '');
  const [evImageUrl, setEvImageUrl] = useState('');

  // -- Article Form State --
  const [editingArticle, setEditingArticle] = useState<GuideArticle | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artCategory, setArtCategory] = useState(categories[0] || '');
  const [artDate, setArtDate] = useState('');
  const [artImageUrl, setArtImageUrl] = useState('');
  const [artImageFile, setArtImageFile] = useState<File | null>(null);
  const [artContent, setArtContent] = useState('');
  const [isSavingArt, setIsSavingArt] = useState(false);

  // -- Category Form State --
  const [newCategoryName, setNewCategoryName] = useState('');

  // ---- RESTAURANT METHODS ----
  const resetRestForm = () => {
    setEditingRestaurant(null);
    setRestName('');
    setRestCategory(categories[0] || '');
    setRestNeighborhood('Rio Vermelho');
    setRestImageUrl('');
    setRestImageFile(null);
    setRestDescription('');
    setRestDishes([]);
    resetDishForm();
  };

  const resetDishForm = () => {
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
    setNewDishFile(null);
  };

  const handleAddDish = async () => {
    if (!newDishName || !newDishPrice) return;
    
    let uploadedDishUrl = '';
    if (newDishFile) {
      const url = await uploadImageToSupabase(newDishFile);
      if (url) uploadedDishUrl = url;
    }

    const newDish: Dish = {
      id: `dish-${Date.now()}`,
      name: newDishName,
      description: newDishDesc,
      price: parseFloat(newDishPrice.replace(',', '.')) || 0,
      imageUrl: uploadedDishUrl
    };

    setRestDishes(prev => [...prev, newDish]);
    resetDishForm();
  };

  const handleRemoveDish = (dishId: string) => {
    setRestDishes(prev => prev.filter(d => d.id !== dishId));
  };

  const startEditRest = (r: Restaurant) => {
    setEditingRestaurant(r);
    setRestName(r.name);
    setRestCategory(r.category);
    setRestNeighborhood(r.neighborhood);
    setRestImageUrl(r.imageUrl);
    setRestImageFile(null);
    setRestDescription(r.description);
    setRestDishes(r.dishes || []);
    resetDishForm();
  };

  const saveRestaurant = async () => {
    if (!restName) return;
    setIsSavingRest(true);
    
    let finalImageUrl = restImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (restImageFile) {
      const uploadedUrl = await uploadImageToSupabase(restImageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const baseId = `rest-${Date.now()}`;
    const newRest: Restaurant = editingRestaurant ? { ...editingRestaurant } : {
      id: baseId, name: restName, rating: 5.0, reviewsCount: 0,
      neighborhood: restNeighborhood, priceRange: '$$', category: restCategory || categories[0],
      imageUrl: finalImageUrl,
      description: restDescription, address: '', phone: '', closesAt: '23:00', dishes: restDishes, reviews: [], featured: true
    };
    newRest.name = restName; 
    newRest.category = restCategory; 
    newRest.neighborhood = restNeighborhood;
    newRest.imageUrl = finalImageUrl;
    newRest.description = restDescription;
    newRest.dishes = restDishes;
    
    if (editingRestaurant) onUpdateRestaurant(newRest); else onAddRestaurant(newRest);
    resetRestForm();
    setIsSavingRest(false);
  };

  // ---- EVENT METHODS ----
  const resetEventForm = () => {
    setEditingEvent(null);
    setEvTitle(''); setEvDate(''); setEvTime(''); setEvLocation('');
    setEvNeighborhood(''); setEvPrice(''); setEvCategory(categories[0] || ''); setEvImageUrl('');
  };

  const startEditEvent = (e: Event) => {
    setEditingEvent(e);
    setEvTitle(e.title); setEvDate(e.date); setEvTime(e.time); setEvLocation(e.location);
    setEvNeighborhood(e.neighborhood); setEvPrice(e.price); setEvCategory(e.category); setEvImageUrl(e.imageUrl);
  };

  const saveEvent = () => {
    if (!evTitle) return;
    const baseId = `ev-${Date.now()}`;
    const newEv: Event = editingEvent ? { ...editingEvent } : {
      id: baseId, title: evTitle, date: evDate, time: evTime, location: evLocation,
      neighborhood: evNeighborhood, price: evPrice, category: evCategory || categories[0],
      imageUrl: evImageUrl || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
      status: 'Confirmado'
    };
    newEv.title = evTitle; newEv.date = evDate; newEv.time = evTime; newEv.location = evLocation;
    newEv.neighborhood = evNeighborhood; newEv.price = evPrice; newEv.category = evCategory;
    if (evImageUrl) newEv.imageUrl = evImageUrl;
    if (editingEvent) onUpdateEvent(newEv); else onAddEvent(newEv);
    resetEventForm();
  };

  // ---- ARTICLE METHODS ----
  const resetArticleForm = () => {
    setEditingArticle(null);
    setArtTitle(''); setArtSummary(''); setArtCategory(categories[0] || ''); setArtDate(''); setArtImageUrl(''); setArtImageFile(null); setArtContent('');
  };

  const startEditArticle = (a: GuideArticle) => {
    setEditingArticle(a);
    setArtTitle(a.title); setArtSummary(a.summary); setArtCategory(a.category); setArtDate(a.date); setArtImageUrl(a.imageUrl); setArtImageFile(null); setArtContent(a.content || '');
  };

  const saveArticle = async () => {
    if (!artTitle) return;
    setIsSavingArt(true);
    let finalImageUrl = artImageUrl || 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80';
    if (artImageFile) {
      const uploadedUrl = await uploadImageToSupabase(artImageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const baseId = `art-${Date.now()}`;
    const newArt: GuideArticle = editingArticle ? { ...editingArticle } : {
      id: baseId, title: artTitle, summary: artSummary, category: 'Geral', // Default hidden category
      date: artDate || new Date().toLocaleDateString('pt-BR'),
      imageUrl: finalImageUrl,
      readTime: '5 min', content: artContent
    };
    newArt.title = artTitle; newArt.summary = artSummary; newArt.category = 'Geral';
    if (artDate) newArt.date = artDate; newArt.imageUrl = finalImageUrl; newArt.content = artContent;
    if (editingArticle) onUpdateArticle(newArt); else onAddArticle(newArt);
    resetArticleForm();
    setIsSavingArt(false);
  };

  return (
    <div className="flex-grow flex bg-[#0B1121] text-slate-300 w-full font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-64px)] overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">S</div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-sm">Sabor Salvador</h2>
            <p className="text-[10px] text-slate-500 font-medium">Painel Admin</p>
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase px-2 mb-3">Itens do Menu</p>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => { setActiveTab('restaurants'); resetRestForm(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'restaurants' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <Store className="w-4 h-4" /> Restaurantes
            </button>
            <button onClick={() => { setActiveTab('articles'); resetArticleForm(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'articles' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <BookOpen className="w-4 h-4" /> Guias e Blogs
            </button>
            <button onClick={() => { setActiveTab('events'); resetEventForm(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <Calendar className="w-4 h-4" /> Eventos
            </button>
            <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <Tags className="w-4 h-4" /> Categorias
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">GO</div>
            <div className="flex-grow">
              <p className="text-xs text-white font-bold">Gilberto Oliveira</p>
              <p className="text-[10px] text-slate-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0B1121]">
        
        {/* HEADER */}
        <header className="h-20 shrink-0 border-b border-slate-800/60 px-8 flex items-center justify-between bg-[#0B1121]/50 backdrop-blur-md">
          <div>
            <h1 className="text-xl font-extrabold text-white">Olá, Administrador 👋</h1>
            <p className="text-xs text-slate-400 mt-0.5">Aqui está um resumo do sistema Sabor Salvador.</p>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-1">Restaurantes</p>
                      <h3 className="text-3xl font-black text-white">{restaurants.length}</h3>
                    </div>
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400"><Store className="w-5 h-5" /></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-auto">Total de estabelecimentos</p>
                </div>
                
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-1">Eventos</p>
                      <h3 className="text-3xl font-black text-white">{events.length}</h3>
                    </div>
                    <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400"><Calendar className="w-5 h-5" /></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-auto">Agendados no sistema</p>
                </div>
                
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-1">Guias e Blogs</p>
                      <h3 className="text-3xl font-black text-white">{articles.length}</h3>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400"><BookOpen className="w-5 h-5" /></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-auto">Artigos publicados</p>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-1">Categorias</p>
                      <h3 className="text-3xl font-black text-white">{categories.length}</h3>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400"><Tags className="w-5 h-5" /></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-auto">Filtros ativos</p>
                </div>
              </div>

              {/* RECENT ACTIVITY MOCK */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-white">Últimos Restaurantes Adicionados</h3>
                  </div>
                  <div className="space-y-4">
                    {restaurants.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl bg-[#1F2937]/50 border border-slate-800/50">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{r.name}</p>
                          <p className="text-xs text-slate-400">Categoria: {r.category}</p>
                        </div>
                      </div>
                    ))}
                    {restaurants.length === 0 && <p className="text-xs text-slate-500">Nenhum registro ainda.</p>}
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-white">Últimas Publicações</h3>
                  </div>
                  <div className="space-y-4">
                    {articles.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl bg-[#1F2937]/50 border border-slate-800/50">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white line-clamp-1">{a.title}</p>
                          <p className="text-xs text-slate-400">Em {a.date}</p>
                        </div>
                      </div>
                    ))}
                    {articles.length === 0 && <p className="text-xs text-slate-500">Nenhum registro ainda.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESTAURANTES */}
          {activeTab === 'restaurants' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">Gerenciar Restaurantes</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* FORM */}
                <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 sticky top-0">
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    {editingRestaurant ? 'Editar Restaurante' : 'Novo Restaurante'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome *</label>
                      <input type="text" value={restName} onChange={e => setRestName(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoria</label>
                        <select value={restCategory} onChange={e => setRestCategory(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bairro</label>
                        <select value={restNeighborhood} onChange={e => setRestNeighborhood(e.target.value as any)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none">
                          <option value="Rio Vermelho">Rio Vermelho</option><option value="Barra">Barra</option>
                          <option value="Pelourinho">Pelourinho</option><option value="Pituba">Pituba</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Foto do Restaurante (Capa)</label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer bg-[#0B1121] border border-slate-800 border-dashed hover:border-indigo-500 rounded-xl px-4 py-2 flex items-center justify-center gap-2 transition">
                          <Upload className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs text-slate-300 font-medium">{restImageFile ? restImageFile.name : 'Anexar nova foto'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              setRestImageFile(e.target.files[0]);
                              setRestImageUrl(''); // clear URL if new file uploaded
                            }
                          }} />
                        </label>
                      </div>
                      {restImageUrl && !restImageFile && <p className="text-[10px] text-emerald-400 mt-1 truncate">Foto atual: {restImageUrl}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição</label>
                      <textarea value={restDescription} onChange={e => setRestDescription(e.target.value)} rows={3} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"></textarea>
                    </div>

                    {/* PRATOS / CARDÁPIO */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <h4 className="text-xs font-bold text-white mb-4">Cardápio do Restaurante ({restDishes.length} pratos)</h4>
                      
                      <div className="space-y-2 mb-4">
                        {restDishes.map((dish) => (
                          <div key={dish.id} className="flex justify-between items-center bg-[#0B1121] p-3 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-3">
                              {dish.imageUrl ? (
                                <img src={dish.imageUrl} className="w-10 h-10 object-cover rounded-lg" alt={dish.name} />
                              ) : (
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-500"/></div>
                              )}
                              <div>
                                <p className="text-xs font-bold text-white">{dish.name}</p>
                                <p className="text-[10px] text-slate-400">R$ {dish.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <button onClick={() => handleRemoveDish(dish.id)} className="text-slate-500 hover:text-red-400 transition">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#1F2937]/50 p-4 rounded-xl border border-slate-800/50 space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Adicionar Novo Prato</p>
                        <input type="text" placeholder="Nome do prato" value={newDishName} onChange={e => setNewDishName(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none" />
                        <div className="flex gap-2">
                          <input type="text" placeholder="Preço (Ex: 45.90)" value={newDishPrice} onChange={e => setNewDishPrice(e.target.value)} className="w-1/3 bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none" />
                          <input type="text" placeholder="Breve descrição" value={newDishDesc} onChange={e => setNewDishDesc(e.target.value)} className="w-2/3 bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <label className="w-full cursor-pointer bg-[#0B1121] border border-slate-800 hover:border-indigo-500 rounded-xl px-3 py-2 flex items-center justify-center gap-2 transition text-xs text-slate-300">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{newDishFile ? newDishFile.name : 'Anexar foto do prato'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={e => {
                            if (e.target.files && e.target.files[0]) setNewDishFile(e.target.files[0]);
                          }} />
                        </label>
                        <button onClick={handleAddDish} className="w-full py-2 bg-slate-800 text-indigo-400 rounded-xl text-xs font-bold hover:bg-slate-700 transition">
                          + Incluir Prato
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3 mt-4 border-t border-slate-800">
                      {editingRestaurant && <button onClick={resetRestForm} className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition" disabled={isSavingRest}>Cancelar</button>}
                      <button onClick={saveRestaurant} disabled={isSavingRest} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        {isSavingRest ? 'Salvando...' : 'Salvar Restaurante'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2 space-y-3">
                  {restaurants.map(r => (
                    <div key={r.id} className="bg-[#111827] border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-slate-700 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          {r.imageUrl ? <img src={r.imageUrl} className="w-full h-full object-cover" alt="" /> : <Store className="w-5 h-5 text-slate-500 m-auto mt-3" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">{r.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{r.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.neighborhood}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEditRest(r)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteRestaurant(r.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  {restaurants.length === 0 && <p className="text-center text-slate-500 text-sm py-10">Nenhum restaurante cadastrado.</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-xl font-bold text-white">Gerenciar Guias e Blogs</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* FORM */}
                <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 sticky top-0">
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Título *</label>
                      <input type="text" value={artTitle} onChange={e => setArtTitle(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Resumo Rápido</label>
                      <textarea value={artSummary} onChange={e => setArtSummary(e.target.value)} rows={2} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data Publicação</label>
                        <input type="text" placeholder="Ex: 20 Out 2024" value={artDate} onChange={e => setArtDate(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Foto de Capa</label>
                        <div className="flex items-center gap-3 h-full">
                          <label className="w-full cursor-pointer bg-[#0B1121] border border-slate-800 border-dashed hover:border-emerald-500 rounded-xl px-4 h-full py-1.5 flex items-center justify-center gap-2 transition text-xs text-slate-300">
                            <Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{artImageFile ? artImageFile.name : 'Anexar imagem'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                setArtImageFile(e.target.files[0]);
                                setArtImageUrl('');
                              }
                            }} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Conteúdo Completo</label>
                      <textarea value={artContent} onChange={e => setArtContent(e.target.value)} rows={4} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"></textarea>
                    </div>
                    <div className="pt-2 flex gap-3">
                      {editingArticle && <button onClick={resetArticleForm} className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition" disabled={isSavingArt}>Cancelar</button>}
                      <button onClick={saveArticle} disabled={isSavingArt} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                        {isSavingArt ? 'Salvando...' : 'Salvar Notícia'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2 space-y-3">
                  {articles.map(a => (
                    <div key={a.id} className="bg-[#111827] border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-slate-700 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          {a.imageUrl && <img src={a.imageUrl} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5 line-clamp-1">{a.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEditArticle(a)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteArticle(a.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && <p className="text-center text-slate-500 text-sm py-10">Nenhum artigo cadastrado.</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-xl font-bold text-white">Gerenciar Eventos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 sticky top-0">
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Título *</label>
                      <input type="text" value={evTitle} onChange={e => setEvTitle(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data</label>
                        <input type="text" placeholder="Ex: 15 de Out" value={evDate} onChange={e => setEvDate(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hora</label>
                        <input type="text" placeholder="Ex: 20:00" value={evTime} onChange={e => setEvTime(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Local / Nome</label>
                        <input type="text" value={evLocation} onChange={e => setEvLocation(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bairro</label>
                        <input type="text" value={evNeighborhood} onChange={e => setEvNeighborhood(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço</label>
                        <input type="text" placeholder="Ex: R$ 50,00" value={evPrice} onChange={e => setEvPrice(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoria</label>
                        <select value={evCategory} onChange={e => setEvCategory(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">URL da Imagem</label>
                      <input type="text" value={evImageUrl} onChange={e => setEvImageUrl(e.target.value)} className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none" />
                    </div>
                    <div className="pt-2 flex gap-3">
                      {editingEvent && <button onClick={resetEventForm} className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition">Cancelar</button>}
                      <button onClick={saveEvent} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-500/20">Salvar Evento</button>
                    </div>
                  </div>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2 space-y-3">
                  {events.map(e => (
                    <div key={e.id} className="bg-[#111827] border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-slate-700 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          {e.imageUrl && <img src={e.imageUrl} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">{e.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{e.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {e.date} às {e.time}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEditEvent(e)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteEvent(e.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && <p className="text-center text-slate-500 text-sm py-10">Nenhum evento cadastrado.</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-xl font-bold text-white">Gerenciar Categorias</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* LIST */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-5">Categorias Ativas ({categories.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                      <div key={c} className="flex items-center gap-2 bg-[#1F2937] border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200">
                        <span>{c}</span>
                        <button 
                          onClick={() => onDeleteCategory(c)} 
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Remover"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ADD NEW */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    Adicionar Nova Categoria
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome da Categoria</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Culinária Vegana"
                        value={newCategoryName} 
                        onChange={e => setNewCategoryName(e.target.value)} 
                        className="w-full bg-[#0B1121] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newCategoryName.trim()) {
                            onAddCategory(newCategoryName.trim());
                            setNewCategoryName('');
                          }
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          onAddCategory(newCategoryName.trim());
                          setNewCategoryName('');
                        }
                      }}
                      className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 transition shadow-lg shadow-amber-500/20"
                    >
                      Cadastrar Categoria
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
