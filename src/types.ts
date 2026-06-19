export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
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
  category: string;
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
  category: string;
  imageUrl: string;
  badge?: string;
  status?: 'Confirmado' | 'Esgotado' | 'Indisponível';
}

export interface GuideArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
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
