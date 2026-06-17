export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  timeAgo: string;
  reply?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  neighborhood: 'Rio Vermelho' | 'Barra' | 'Pelourinho' | 'Pituba';
  priceRange: '$' | '$$' | '$$$';
  category: 'Acarajé' | 'Moqueca' | 'Hamburgueria' | 'Sushi' | 'Barzinho' | 'Café';
  imageUrl: string;
  description: string;
  address: string;
  phone: string;
  closesAt: string;
  dishes: Dish[];
  reviews: Review[];
  featured?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  neighborhood: string;
  price: string;
  category: 'Axé' | 'Samba' | 'Forró' | 'Jazz' | 'Alternativo' | 'Todos';
  imageUrl: string;
  badge?: string;
  status?: 'Confirmado' | 'Esgotado' | 'Indisponível';
}

export interface GuideArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Cultura' | 'Música' | 'Gastronomia' | 'Noite' | 'Eventos';
  date: string;
  imageUrl: string;
  readTime: string;
  content?: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  type: 'up' | 'down' | 'neutral';
}

export interface RecentActivity {
  id: string;
  type: 'review' | 'reservation' | 'menu';
  title: string;
  description: string;
  rating?: number;
  timeAgo: string;
}
