import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Utensils, ArrowRight, ArrowLeft, Phone, MapPin, Clock, Plus, Check, DollarSign, Image } from 'lucide-react';
import { Restaurant } from '../types';

interface LoginViewProps {
  onLoginSuccess: (isSuperAdmin?: boolean) => void;
  setActiveTab: (tab: 'home' | 'restaurants' | 'events' | 'guides' | 'login' | 'admin') => void;
  onRegisterRestaurant?: (newRestaurant: Restaurant) => void;
}

const CATEGORY_PRESETS = [
  { category: 'Acarajé', label: 'Acarajé Baiano Tradicional', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80' },
  { category: 'Moqueca', label: 'Moqueca de Panela de Barro', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { category: 'Sushi', label: 'Sushi & Culinária Oriental', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80' },
  { category: 'Hamburgueria', label: 'Hambúrguer Gourmet', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { category: 'Barzinho', label: 'Estação de Coquetéis Tropicais', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80' },
  { category: 'Café', label: 'Cafeteria e Sobremesas', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' }
];

export default function LoginView({ onLoginSuccess, setActiveTab, onRegisterRestaurant }: LoginViewProps) {
  // Global Toggle Mode
  const [isRegister, setIsRegister] = useState(false);

  // Classicial Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  // Restaurant Registration States
  const [restName, setRestName] = useState('');
  const [restCategory, setRestCategory] = useState<'Acarajé' | 'Moqueca' | 'Hamburgueria' | 'Sushi' | 'Barzinho' | 'Café'>('Moqueca');
  const [restNeighborhood, setRestNeighborhood] = useState<'Rio Vermelho' | 'Barra' | 'Pelourinho' | 'Pituba'>('Rio Vermelho');
  const [restPriceRange, setRestPriceRange] = useState<'$' | '$$' | '$$$'>('$$');
  const [restPhone, setRestPhone] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restClosesAt, setRestClosesAt] = useState('23:00');
  const [restDescription, setRestDescription] = useState('');
  const [restImageUrl, setRestImageUrl] = useState(CATEGORY_PRESETS[1].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  // Signature Dish Registration States
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishDescription, setDishDescription] = useState('');

  // Automatically update the selected image preset when the category is changed for better user experience
  useEffect(() => {
    if (!useCustomUrl && isRegister) {
      const match = CATEGORY_PRESETS.find(p => p.category === restCategory);
      if (match) {
        setRestImageUrl(match.url);
      }
    }
  }, [restCategory, useCustomUrl, isRegister]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha todos os campos!');
      return;
    }
    
    if (email.trim().toLowerCase() === 'admin@saborsalvador.com' && password === 'admin123') {
      onLoginSuccess(true);
      return;
    }

    onLoginSuccess(false);
  };

  const handleShortcutLogin = () => {
    setEmail('proprietario@casadetereza.com.br');
    setPassword('dende1234');
    onLoginSuccess(false);
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restName.trim()) {
      setErrorMessage('O nome comercial do restaurante é obrigatório.');
      return;
    }

    if (!restAddress.trim()) {
      setErrorMessage('O endereço completo do restaurante é obrigatório.');
      return;
    }

    if (!restPhone.trim()) {
      setErrorMessage('O telefone comercial é obrigatório.');
      return;
    }

    // Determine final image URL
    const finalImage = useCustomUrl && customImageUrl.trim() ? customImageUrl.trim() : restImageUrl;

    // Build default dishes or merge signature dish
    const finalDishes = [];
    
    if (dishName.trim()) {
      finalDishes.push({
        id: `dish-primary-${Date.now()}`,
        name: dishName.trim(),
        description: dishDescription.trim() || `Irresistível especialidade da casa caracterizando nossa cozinha e ingredientes frescos.`,
        price: parseFloat(dishPrice) || 45.00
      });
    } else {
      // Create a default dish representing their category
      finalDishes.push({
        id: `dish-default-${Date.now()}`,
        name: `Especialidade do Chef (${restCategory})`,
        description: `Tradicional receita preparada carinhosamente com insumos rústicos de alta qualidade de Salvador.`,
        price: restPriceRange === '$$$' ? 95.00 : restPriceRange === '$$' ? 55.00 : 25.00
      });
    }

    // Add extra generic refreshments
    finalDishes.push({
      id: `dish-beber-${Date.now()}`,
      name: 'Suco Natural do Nordeste',
      description: 'Opções de frutas locais colhidas frescas: Umbu, Mangaba, Cajá ou Maracujá.',
      price: 15.00
    });

    const newRestaurant: Restaurant = {
      id: `rest-${Date.now()}-${restName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: restName.trim(),
      rating: 5.0, // Brand new restaurants gets maximum appreciation!
      reviewsCount: 0,
      neighborhood: restNeighborhood,
      priceRange: restPriceRange,
      category: restCategory,
      imageUrl: finalImage,
      description: restDescription.trim() || `Excelente espaço de alta culinária focado em ${restCategory} na vizinhança boêmia de ${restNeighborhood}. Venha conferir nossa herança baiana em cada mordida.`,
      address: restAddress.trim(),
      phone: restPhone.trim(),
      closesAt: restClosesAt.trim() || '23:00',
      dishes: finalDishes,
      reviews: [],
      featured: true
    };

    if (onRegisterRestaurant) {
      onRegisterRestaurant(newRestaurant);
    } else {
      // Fallback fallback alert if undefined
      alert('Cadastro realizado! No momento o sistema de persistência no estado global está indisponível.');
    }
  };

  return (
    <div 
      className="animate-fade-in flex-grow flex items-center justify-center py-16 px-4 bg-cover bg-center min-h-[600px]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 248, 246, 0.82), rgba(255, 248, 246, 0.94)), url('https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      <div className={`bg-white p-8 md:p-10 rounded-3xl border border-brand-container-high shadow-2xl w-full transition-all duration-500 text-left ${
        isRegister ? 'max-w-4xl' : 'max-w-md'
      }`}>

        {/* LOGO SYMBOL */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-brand-primary text-brand-primary shadow-xs">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        {/* HEADING ACCORDING TO VIEW MODE */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-primary tracking-tight">
            {isRegister ? 'Cadastre seu Estabelecimento' : 'Sabor Salvador'}
          </h2>
          <p className="text-xs text-brand-on-surface-variant mt-1.5 font-semibold">
            {isRegister 
              ? 'Insira os dados do seu restaurante e divulgue seu menu para milhares de clientes baianos e turistas.' 
              : 'Acesse o painel do proprietário para editar cardápios e avaliações.'}
          </p>
        </div>

        {/* ALERTS */}
        {errorMessage && (
          <div className="bg-brand-error-container text-brand-error p-3.5 rounded-xl text-xs font-semibold mb-6 text-center border border-brand-error/20">
            {errorMessage}
          </div>
        )}

        {recoveryMessage && (
          <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold mb-6 text-center border border-emerald-200">
            {recoveryMessage}
          </div>
        )}

        {/* RENDER FORMS */}
        {!isRegister ? (
          /* ================= LOGIN FORM ================= */
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-brand-outline uppercase mb-1.5">
                  E-mail do Gestor
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline" />
                  <input 
                    type="email"
                    placeholder="seu@restaurante.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold text-brand-outline uppercase">
                    Senha de Acesso
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      if (email.trim()) {
                        setRecoveryMessage(`Instruções de redefinição de senha enviadas para ${email}!`);
                      } else {
                        setRecoveryMessage('Por favor, insira o seu e-mail de acesso no campo de texto para recuperar a senha.');
                      }
                    }}
                    className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl pl-10 pr-10 py-3 text-xs font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-outline hover:text-brand-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary-container hover:bg-brand-primary text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-brand-primary-container/20 cursor-pointer text-center mt-2 flex items-center justify-center gap-1.5"
              >
                <span>Acessar Painel Residencial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="my-6 flex items-center justify-between text-[11px] text-brand-outline-variant font-bold leading-none">
              <div className="border-t border-brand-outline-variant flex-grow mr-2" />
              <span>OU</span>
              <div className="border-t border-brand-outline-variant flex-grow ml-2" />
            </div>

            {/* REGISTER TOGGLING BUTTON */}
            <div className="text-center space-y-4 mb-4">
              <button
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage('');
                  setRecoveryMessage('');
                }}
                className="w-full bg-brand-primary text-white hover:bg-brand-primary-container font-black text-xs py-3 rounded-xl transition-all shadow-md shadow-brand-primary/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Restaurante</span>
              </button>
              
              <div className="bg-brand-surface border border-brand-container-high rounded-xl p-3 text-[10px] text-brand-on-surface-variant font-semibold">
                <span className="text-brand-primary block font-extrabold mb-1">💡 Atalho de Visualização Rápida</span>
                Disponibilizamos o restaurante <strong>Casa de Tereza</strong> para simulação instantânea no admin.
                <button
                  onClick={handleShortcutLogin}
                  className="text-brand-primary underline hover:text-brand-primary-container font-extrabold block w-full mt-1 px-2 py-1 bg-white rounded border border-brand-outline-variant/50"
                >
                  Entrar Direto como Casa de Tereza →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= REGISTER NEW RESTAURANT FORM ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs text-brand-on-surface-variant font-semibold">
            
            <div className="flex justify-between items-center bg-brand-surface p-3 px-4 rounded-xl border border-brand-container-high mb-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage('');
                  setRecoveryMessage('');
                }}
                className="text-[11px] font-bold text-brand-outline hover:text-brand-primary flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para o Login</span>
              </button>
              <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-widest bg-brand-primary-container/10 px-2.5 py-1 rounded-full">
                Sabor Salvador Partner
              </span>
            </div>

            {/* SECTIONS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* COL 1: GENERAL STATS */}
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold text-brand-on-surface border-b border-brand-surface pb-1.5 flex items-center gap-1.5 label-section">
                  <span className="text-neutral-400 font-normal">1.</span> Dados Gerais do Estabelecimento
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">
                    Nome do Restaurante *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Cantina do Recôncavo, Camarão da Dinha"
                    value={restName}
                    onChange={e => setRestName(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">
                      Categoria / Tipo Culinária *
                    </label>
                    <select
                      value={restCategory}
                      onChange={e => setRestCategory(e.target.value as any)}
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-brand-primary"
                    >
                      <option value="Moqueca">Moqueca Baiana</option>
                      <option value="Acarajé">Acarajé & Baianas</option>
                      <option value="Hamburgueria">Hamburgueria Comercial</option>
                      <option value="Sushi">Sushi / Comida Asiática</option>
                      <option value="Barzinho">Barzinho & Drinks Tropicais</option>
                      <option value="Café">Cafeteria / Sobremesas Doces</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">
                      Bairro em Salvador *
                    </label>
                    <select
                      value={restNeighborhood}
                      onChange={e => setRestNeighborhood(e.target.value as any)}
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-brand-primary"
                    >
                      <option value="Rio Vermelho">Rio Vermelho</option>
                      <option value="Barra">Barra</option>
                      <option value="Pelourinho">Pelourinho</option>
                      <option value="Pituba">Pituba</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1.5 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand-outline" /> 
                      <span>Faixa de Preço *</span>
                    </label>
                    <div className="flex gap-2">
                      {(['$', '$$', '$$$'] as const).map((pr) => (
                        <button
                          type="button"
                          key={pr}
                          onClick={() => setRestPriceRange(pr)}
                          className={`flex-grow py-2 rounded-xl text-xs font-bold transition border ${
                            restPriceRange === pr 
                              ? 'bg-brand-primary text-white border-brand-primary shadow-xs' 
                              : 'bg-brand-surface text-brand-on-surface-variant border-brand-outline-variant hover:border-brand-primary/50'
                          }`}
                        >
                          {pr === '$$$' ? '$$$ (Alto)' : pr === '$$' ? '$$ (Médio)' : '$ (Baixo)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-outline" />
                      <span>Horário de Fechamento</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="Ex: 23:00, 00:00"
                      value={restClosesAt}
                      onChange={e => setRestClosesAt(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-outline" />
                      <span>Telefone Comercial *</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: (71) 3329-1055"
                      value={restPhone}
                      onChange={e => setRestPhone(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-outline" />
                      <span>Endereço Completo *</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: R. Odilon Santos, 120 - Rio Vermelho, Salvador - BA"
                      value={restAddress}
                      onChange={e => setRestAddress(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">
                    Histórico e Conceito Culinarista
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Conte um pouco da história do seu restaurante, inspiração baiana, segredos de família ou herança cultural..."
                    value={restDescription}
                    onChange={e => setRestDescription(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-outline-variant rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* COL 2: VISUAL ASSOC AND SIGNATURE DISH */}
              <div className="space-y-4">
                
                {/* 2. CHOOSE PRESET IMAGE OR INPUT OWN */}
                <h3 className="font-display text-sm font-bold text-brand-on-surface border-b border-brand-surface pb-1.5 flex items-center gap-1.5 label-section">
                  <span className="text-neutral-400 font-normal">2.</span> Identidade Visual & Fotografias
                </h3>

                <div className="bg-brand-surface p-4 rounded-2xl border border-brand-container-high space-y-3.5">
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="imageChoice" 
                        checked={!useCustomUrl}
                        onChange={() => setUseCustomUrl(false)}
                        className="text-brand-primary"
                      />
                      <span className="text-[11px] font-extrabold text-brand-on-surface">Usar Foto Temática Otimizada (Recomendado)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="imageChoice" 
                        checked={useCustomUrl}
                        onChange={() => setUseCustomUrl(true)}
                        className="text-brand-primary"
                      />
                      <span className="text-[11px] font-extrabold text-brand-on-surface">Link URL Personalizado</span>
                    </label>
                  </div>

                  {!useCustomUrl ? (
                    <div>
                      <p className="text-[10px] text-brand-outline italic mb-2 leading-tight">
                        Nosso sistema selecionou automaticamente uma foto exclusiva de <strong>{restCategory}</strong> para valorizar seu layout.
                      </p>
                      <div className="flex items-center gap-3.5 bg-white p-2.5 rounded-xl border border-brand-outline-variant/60">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 shadow-sm">
                          <img src={restImageUrl} className="w-full h-full object-cover" alt="Preset Preview" />
                        </div>
                        <div>
                          <p className="text-[10px] text-brand-on-surface font-extrabold">Banner de Categoria Selecionado</p>
                          <span className="text-[9px] text-brand-outline block">Perfeito para ilustrar listagens gastronômicas</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">
                        URL da Foto do Restaurante
                      </label>
                      <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline" />
                        <input 
                          type="url"
                          placeholder="Ex: https://links.unsplash.com/sua-foto-incrivel"
                          value={customImageUrl}
                          onChange={e => setCustomImageUrl(e.target.value)}
                          className="w-full bg-white border border-brand-outline-variant rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary text-left"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SIGNATURE DISH SECTION */}
                <h3 className="font-display text-sm font-bold text-brand-on-surface border-b border-brand-surface pb-1.5 flex items-center gap-1.5 label-section">
                  <span className="text-neutral-400 font-normal">3.</span> Prato Principal do Chef (Destaque do Cardápio)
                </h3>

                <div className="bg-amber-50/10 p-5 rounded-2xl border border-amber-250/50 space-y-3.5">
                  <div className="flex gap-2 items-center text-amber-800">
                    <span className="text-base">🍳</span>
                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-primary">
                      Cadastre sua principal iguaria baiana agora mesmo
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Nome do Prato Signature</label>
                      <input 
                        type="text"
                        placeholder="Ex: Bobó de Abóbora com Camarão"
                        value={dishName}
                        onChange={e => setDishName(e.target.value)}
                        className="w-full bg-white border border-brand-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1">Preço (R$)</label>
                      <input 
                        type="number"
                        placeholder="85.00"
                        value={dishPrice}
                        onChange={e => setDishPrice(e.target.value)}
                        className="w-full bg-white border border-brand-outline-variant rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-outline uppercase mb-1 font-semibold">Composição e Ingredientes / Descrição do Prato</label>
                    <input 
                      type="text"
                      placeholder="Descreva o prato, os acompanhamentos rústicos e se leva dendê..."
                      value={dishDescription}
                      onChange={e => setDishDescription(e.target.value)}
                      className="w-full bg-white border border-brand-outline-variant rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary text-left"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* BUTTON CONTROL BAR IN FOOTER FORM */}
            <div className="pt-6 border-t border-brand-surface flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage('');
                  setRecoveryMessage('');
                }}
                className="px-6 py-3 bg-brand-surface border border-brand-outline-variant hover:bg-brand-container-low text-brand-on-surface-variant font-black rounded-xl transition cursor-pointer text-center"
              >
                Cancelar Cadastro
              </button>

              <button 
                type="submit"
                className="px-8 py-3 bg-brand-primary-container hover:bg-brand-primary text-white font-black rounded-xl shadow-md transition cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Finalizar Cadastro e Ver Meu Restaurante</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
