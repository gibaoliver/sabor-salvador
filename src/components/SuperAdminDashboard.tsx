import React, { useState } from 'react';
import { 
  LayoutDashboard, Store, Calendar, BookOpen, Plus, Edit2, Trash2, X, Save, Image, MapPin, Phone, DollarSign, Clock
} from 'lucide-react';
import { Restaurant, Event, GuideArticle } from '../types';

interface SuperAdminDashboardProps {
  restaurants: Restaurant[];
  events: Event[];
  articles: GuideArticle[];
  onAddRestaurant: (rest: Restaurant) => void;
  onUpdateRestaurant: (rest: Restaurant) => void;
  onDeleteRestaurant: (id: string) => void;
  onAddEvent: (ev: Event) => void;
  onUpdateEvent: (ev: Event) => void;
  onDeleteEvent: (id: string) => void;
  onAddArticle: (art: GuideArticle) => void;
  onUpdateArticle: (art: GuideArticle) => void;
  onDeleteArticle: (id: string) => void;
}

export default function SuperAdminDashboard({
  restaurants, events, articles,
  onAddRestaurant, onUpdateRestaurant, onDeleteRestaurant,
  onAddEvent, onUpdateEvent, onDeleteEvent,
  onAddArticle, onUpdateArticle, onDeleteArticle
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'events' | 'articles'>('overview');
  
  // States for forms
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingArticle, setEditingArticle] = useState<GuideArticle | null>(null);

  // -- Restaurant Form State --
  const [restName, setRestName] = useState('');
  const [restCategory, setRestCategory] = useState<'Acarajé' | 'Moqueca' | 'Hamburgueria' | 'Sushi' | 'Barzinho' | 'Café'>('Moqueca');
  const [restNeighborhood, setRestNeighborhood] = useState<'Rio Vermelho' | 'Barra' | 'Pelourinho' | 'Pituba'>('Rio Vermelho');
  const [restImageUrl, setRestImageUrl] = useState('');
  const [restDescription, setRestDescription] = useState('');

  // -- Event Form State --
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evNeighborhood, setEvNeighborhood] = useState('');
  const [evPrice, setEvPrice] = useState('');
  const [evCategory, setEvCategory] = useState<'Axé' | 'Samba' | 'Forró' | 'Jazz' | 'Alternativo' | 'Todos'>('Axé');
  const [evImageUrl, setEvImageUrl] = useState('');
  const [evBadge, setEvBadge] = useState('');

  // -- Article Form State --
  const [artTitle, setArtTitle] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artCategory, setArtCategory] = useState<'Cultura' | 'Música' | 'Gastronomia' | 'Noite' | 'Eventos'>('Cultura');
  const [artDate, setArtDate] = useState('');
  const [artImageUrl, setArtImageUrl] = useState('');
  const [artContent, setArtContent] = useState('');

  const resetRestForm = () => {
    setEditingRestaurant(null);
    setRestName('');
    setRestCategory('Moqueca');
    setRestNeighborhood('Rio Vermelho');
    setRestImageUrl('');
    setRestDescription('');
  };

  const startEditRest = (r: Restaurant) => {
    setEditingRestaurant(r);
    setRestName(r.name);
    setRestCategory(r.category);
    setRestNeighborhood(r.neighborhood);
    setRestImageUrl(r.imageUrl);
    setRestDescription(r.description);
  };

  const saveRestaurant = () => {
    if (!restName) return;
    const baseId = `rest-${Date.now()}`;
    const newRest: Restaurant = editingRestaurant ? { ...editingRestaurant } : {
      id: baseId,
      name: restName,
      rating: 5.0,
      reviewsCount: 0,
      neighborhood: restNeighborhood,
      priceRange: '$$',
      category: restCategory,
      imageUrl: restImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      description: restDescription,
      address: '',
      phone: '',
      closesAt: '23:00',
      dishes: [],
      reviews: [],
      featured: true
    };
    newRest.name = restName;
    newRest.category = restCategory;
    newRest.neighborhood = restNeighborhood;
    if (restImageUrl) newRest.imageUrl = restImageUrl;
    newRest.description = restDescription;

    if (editingRestaurant) onUpdateRestaurant(newRest);
    else onAddRestaurant(newRest);
    resetRestForm();
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEvTitle('');
    setEvDate('');
    setEvTime('');
    setEvLocation('');
    setEvNeighborhood('');
    setEvPrice('');
    setEvCategory('Axé');
    setEvImageUrl('');
    setEvBadge('');
  };

  const startEditEvent = (e: Event) => {
    setEditingEvent(e);
    setEvTitle(e.title);
    setEvDate(e.date);
    setEvTime(e.time);
    setEvLocation(e.location);
    setEvNeighborhood(e.neighborhood);
    setEvPrice(e.price);
    setEvCategory(e.category);
    setEvImageUrl(e.imageUrl);
    setEvBadge(e.badge || '');
  };

  const saveEvent = () => {
    if (!evTitle) return;
    const baseId = `ev-${Date.now()}`;
    const newEv: Event = editingEvent ? { ...editingEvent } : {
      id: baseId,
      title: evTitle,
      date: evDate,
      time: evTime,
      location: evLocation,
      neighborhood: evNeighborhood,
      price: evPrice,
      category: evCategory,
      imageUrl: evImageUrl || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
      badge: evBadge,
      status: 'Confirmado'
    };
    newEv.title = evTitle;
    newEv.date = evDate;
    newEv.time = evTime;
    newEv.location = evLocation;
    newEv.neighborhood = evNeighborhood;
    newEv.price = evPrice;
    newEv.category = evCategory;
    if (evImageUrl) newEv.imageUrl = evImageUrl;
    newEv.badge = evBadge;

    if (editingEvent) onUpdateEvent(newEv);
    else onAddEvent(newEv);
    resetEventForm();
  };

  const resetArticleForm = () => {
    setEditingArticle(null);
    setArtTitle('');
    setArtSummary('');
    setArtCategory('Cultura');
    setArtDate('');
    setArtImageUrl('');
    setArtContent('');
  };

  const startEditArticle = (a: GuideArticle) => {
    setEditingArticle(a);
    setArtTitle(a.title);
    setArtSummary(a.summary);
    setArtCategory(a.category);
    setArtDate(a.date);
    setArtImageUrl(a.imageUrl);
    setArtContent(a.content || '');
  };

  const saveArticle = () => {
    if (!artTitle) return;
    const baseId = `art-${Date.now()}`;
    const newArt: GuideArticle = editingArticle ? { ...editingArticle } : {
      id: baseId,
      title: artTitle,
      summary: artSummary,
      category: artCategory,
      date: artDate || new Date().toLocaleDateString('pt-BR'),
      imageUrl: artImageUrl || 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80',
      readTime: '5 min',
      content: artContent
    };
    newArt.title = artTitle;
    newArt.summary = artSummary;
    newArt.category = artCategory;
    if (artDate) newArt.date = artDate;
    if (artImageUrl) newArt.imageUrl = artImageUrl;
    newArt.content = artContent;

    if (editingArticle) onUpdateArticle(newArt);
    else onAddArticle(newArt);
    resetArticleForm();
  };

  return (
    <div className="animate-fade-in flex-grow bg-brand-surface text-brand-on-surface flex flex-col md:flex-row border-t border-brand-container-highest">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-brand-container-high py-8 px-4 flex flex-col shrink-0">
        <span className="block text-[10px] font-bold text-brand-outline tracking-wider uppercase px-3 mb-4">
          Super Admin Menu
        </span>
        <nav className="space-y-1.5 text-left">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'}`}>
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </button>
          <button onClick={() => { setActiveTab('restaurants'); resetRestForm(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'restaurants' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'}`}>
            <Store className="w-4 h-4" /> Restaurantes
          </button>
          <button onClick={() => { setActiveTab('events'); resetEventForm(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'events' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'}`}>
            <Calendar className="w-4 h-4" /> Eventos
          </button>
          <button onClick={() => { setActiveTab('articles'); resetArticleForm(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'articles' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-on-surface-variant hover:bg-brand-surface hover:text-brand-primary'}`}>
            <BookOpen className="w-4 h-4" /> Notícias & Blog
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 md:p-10 text-left overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-brand-on-surface">Painel do Dono do Site</h1>
              <p className="text-xs text-brand-on-surface-variant">Gerencie todo o conteúdo da plataforma Sabor Salvador.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-brand-container-high text-center">
                <Store className="w-8 h-8 text-brand-primary mx-auto mb-2" />
                <p className="text-3xl font-black text-brand-on-surface">{restaurants.length}</p>
                <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">Restaurantes</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-brand-container-high text-center">
                <Calendar className="w-8 h-8 text-brand-secondary mx-auto mb-2" />
                <p className="text-3xl font-black text-brand-on-surface">{events.length}</p>
                <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">Eventos</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-brand-container-high text-center">
                <BookOpen className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-3xl font-black text-brand-on-surface">{articles.length}</p>
                <p className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">Notícias</p>
              </div>
            </div>
          </div>
        )}

        {/* RESTAURANTS TAB */}
        {activeTab === 'restaurants' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="font-display text-xl font-extrabold text-brand-on-surface border-b pb-4">Gerenciar Restaurantes</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-brand-container-high space-y-4 shadow-sm">
                <h3 className="font-display text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-primary" /> {editingRestaurant ? 'Editar Restaurante' : 'Adicionar Novo'}
                </h3>
                <input type="text" placeholder="Nome" value={restName} onChange={e => setRestName(e.target.value)} className="w-full p-2 text-xs border rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={restCategory} onChange={e => setRestCategory(e.target.value as any)} className="p-2 text-xs border rounded-lg">
                    <option value="Acarajé">Acarajé</option><option value="Moqueca">Moqueca</option><option value="Hamburgueria">Hamburgueria</option>
                    <option value="Sushi">Sushi</option><option value="Barzinho">Barzinho</option><option value="Café">Café</option>
                  </select>
                  <select value={restNeighborhood} onChange={e => setRestNeighborhood(e.target.value as any)} className="p-2 text-xs border rounded-lg">
                    <option value="Rio Vermelho">Rio Vermelho</option><option value="Barra">Barra</option>
                    <option value="Pelourinho">Pelourinho</option><option value="Pituba">Pituba</option>
                  </select>
                </div>
                <input type="text" placeholder="URL da Imagem (opcional)" value={restImageUrl} onChange={e => setRestImageUrl(e.target.value)} className="w-full p-2 text-xs border rounded-lg" />
                <textarea placeholder="Descrição rápida..." value={restDescription} onChange={e => setRestDescription(e.target.value)} rows={3} className="w-full p-2 text-xs border rounded-lg"></textarea>
                <div className="flex gap-2">
                  {editingRestaurant && <button onClick={resetRestForm} className="flex-1 py-2 text-xs font-bold border rounded-lg hover:bg-gray-50">Cancelar</button>}
                  <button onClick={saveRestaurant} className="flex-1 py-2 text-xs font-bold bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90">Salvar Restaurante</button>
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {restaurants.map(r => (
                  <div key={r.id} className="bg-white p-4 rounded-xl border flex justify-between items-center text-xs">
                    <div><p className="font-bold">{r.name}</p><p className="text-gray-500">{r.category} • {r.neighborhood}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditRest(r)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDeleteRestaurant(r.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="font-display text-xl font-extrabold text-brand-on-surface border-b pb-4">Gerenciar Eventos</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-brand-container-high space-y-4 shadow-sm">
                <h3 className="font-display text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-secondary" /> {editingEvent ? 'Editar Evento' : 'Adicionar Novo'}
                </h3>
                <input type="text" placeholder="Título do Evento" value={evTitle} onChange={e => setEvTitle(e.target.value)} className="w-full p-2 text-xs border rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Data (Ex: 15 de Out)" value={evDate} onChange={e => setEvDate(e.target.value)} className="p-2 text-xs border rounded-lg" />
                  <input type="text" placeholder="Horário (Ex: 20:00)" value={evTime} onChange={e => setEvTime(e.target.value)} className="p-2 text-xs border rounded-lg" />
                  <input type="text" placeholder="Local" value={evLocation} onChange={e => setEvLocation(e.target.value)} className="p-2 text-xs border rounded-lg" />
                  <input type="text" placeholder="Preço (Ex: R$ 50,00)" value={evPrice} onChange={e => setEvPrice(e.target.value)} className="p-2 text-xs border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Bairro" value={evNeighborhood} onChange={e => setEvNeighborhood(e.target.value)} className="p-2 text-xs border rounded-lg" />
                  <select value={evCategory} onChange={e => setEvCategory(e.target.value as any)} className="p-2 text-xs border rounded-lg">
                    <option value="Axé">Axé</option><option value="Samba">Samba</option><option value="Forró">Forró</option>
                    <option value="Jazz">Jazz</option><option value="Alternativo">Alternativo</option><option value="Todos">Todos</option>
                  </select>
                </div>
                <input type="text" placeholder="URL da Imagem" value={evImageUrl} onChange={e => setEvImageUrl(e.target.value)} className="w-full p-2 text-xs border rounded-lg" />
                <div className="flex gap-2">
                  {editingEvent && <button onClick={resetEventForm} className="flex-1 py-2 text-xs font-bold border rounded-lg hover:bg-gray-50">Cancelar</button>}
                  <button onClick={saveEvent} className="flex-1 py-2 text-xs font-bold bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90">Salvar Evento</button>
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {events.map(e => (
                  <div key={e.id} className="bg-white p-4 rounded-xl border flex justify-between items-center text-xs">
                    <div><p className="font-bold">{e.title}</p><p className="text-gray-500">{e.date} • {e.location}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditEvent(e)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDeleteEvent(e.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ARTICLES TAB */}
        {activeTab === 'articles' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="font-display text-xl font-extrabold text-brand-on-surface border-b pb-4">Gerenciar Notícias & Guias</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-brand-container-high space-y-4 shadow-sm">
                <h3 className="font-display text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-500" /> {editingArticle ? 'Editar Notícia' : 'Adicionar Nova Notícia'}
                </h3>
                <input type="text" placeholder="Título" value={artTitle} onChange={e => setArtTitle(e.target.value)} className="w-full p-2 text-xs border rounded-lg" />
                <textarea placeholder="Resumo rápido..." value={artSummary} onChange={e => setArtSummary(e.target.value)} rows={2} className="w-full p-2 text-xs border rounded-lg"></textarea>
                <div className="grid grid-cols-2 gap-2">
                  <select value={artCategory} onChange={e => setArtCategory(e.target.value as any)} className="p-2 text-xs border rounded-lg">
                    <option value="Cultura">Cultura</option><option value="Música">Música</option>
                    <option value="Gastronomia">Gastronomia</option><option value="Noite">Noite</option><option value="Eventos">Eventos</option>
                  </select>
                  <input type="text" placeholder="Data (ex: 20 Out 2024)" value={artDate} onChange={e => setArtDate(e.target.value)} className="p-2 text-xs border rounded-lg" />
                </div>
                <input type="text" placeholder="URL da Imagem" value={artImageUrl} onChange={e => setArtImageUrl(e.target.value)} className="w-full p-2 text-xs border rounded-lg" />
                <textarea placeholder="Conteúdo da notícia..." value={artContent} onChange={e => setArtContent(e.target.value)} rows={4} className="w-full p-2 text-xs border rounded-lg"></textarea>
                <div className="flex gap-2">
                  {editingArticle && <button onClick={resetArticleForm} className="flex-1 py-2 text-xs font-bold border rounded-lg hover:bg-gray-50">Cancelar</button>}
                  <button onClick={saveArticle} className="flex-1 py-2 text-xs font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Salvar Notícia</button>
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {articles.map(a => (
                  <div key={a.id} className="bg-white p-4 rounded-xl border flex justify-between items-center text-xs">
                    <div><p className="font-bold line-clamp-1">{a.title}</p><p className="text-gray-500">{a.date} • {a.category}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditArticle(a)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDeleteArticle(a.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
