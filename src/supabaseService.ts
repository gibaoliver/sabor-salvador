import { supabase } from './supabaseClient';
import { Restaurant, Event, Review } from './types';
import { INITIAL_RESTAURANTS, INITIAL_EVENTS } from './data';

// Helper to check if a table exists by attempting a 1-row select
export async function testTableConnection(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('id').limit(1);
    if (error) {
      // If error code is '42P01' (relation does not exist), the table is missing
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error(`Error testing table connection for ${tableName}:`, err);
    return false;
  }
}

// Map database row to Restaurant type
export function mapRowToRestaurant(row: any): Restaurant {
  return {
    id: row.id,
    name: row.name,
    rating: Number(row.rating ?? 5),
    reviewsCount: Number(row.reviews_count ?? 0),
    neighborhood: row.neighborhood,
    priceRange: row.price_range,
    category: row.category,
    imageUrl: row.image_url,
    description: row.description,
    address: row.address,
    phone: row.phone,
    closesAt: row.closes_at,
    dishes: Array.isArray(row.dishes) ? row.dishes : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    featured: !!row.featured,
  };
}

// Fetch all restaurants
export async function getRestaurantsFromSupabase(): Promise<Restaurant[] | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching restaurants from Supabase:', error);
    // Return null to signify communication error or missing tables
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return null;
    }
    return null;
  }

  return (data || []).map(mapRowToRestaurant);
}

// Insert or update a restaurant
export async function upsertRestaurantToSupabase(rest: Restaurant): Promise<boolean> {
  const payload = {
    id: rest.id,
    name: rest.name,
    rating: rest.rating,
    reviews_count: rest.reviewsCount,
    neighborhood: rest.neighborhood,
    price_range: rest.priceRange,
    category: rest.category,
    image_url: rest.imageUrl,
    description: rest.description,
    address: rest.address,
    phone: rest.phone,
    closes_at: rest.closesAt,
    featured: !!rest.featured,
    dishes: rest.dishes,
    reviews: rest.reviews,
  };

  const { error } = await supabase
    .from('restaurants')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error(`Error saving restaurant ${rest.name} to Supabase:`, error);
    return false;
  }
  return true;
}

// Fetch all events
export async function getEventsFromSupabase(): Promise<Event[] | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events from Supabase:', error);
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return null;
    }
    return null;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    location: row.location,
    neighborhood: row.neighborhood,
    price: row.price,
    category: row.category,
    imageUrl: row.image_url,
    badge: row.badge,
    status: row.status,
  }));
}

// Insert or update an event
export async function upsertEventToSupabase(ev: Event): Promise<boolean> {
  const payload = {
    id: ev.id,
    title: ev.title,
    date: ev.date,
    time: ev.time,
    location: ev.location,
    neighborhood: ev.neighborhood,
    price: ev.price,
    category: ev.category,
    image_url: ev.imageUrl,
    badge: ev.badge,
    status: ev.status,
  };

  const { error } = await supabase
    .from('events')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error(`Error saving event ${ev.title} to Supabase:`, error);
    return false;
  }
  return true;
}

// Delete event from Supabase
export async function deleteEventFromSupabase(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error(`Error deleting event ${eventId} from Supabase:`, error);
    return false;
  }
  return true;
}

// Seeds the Supabase database with initial values
export async function seedSupabaseInitialData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Send restaurants
    for (const rest of INITIAL_RESTAURANTS) {
      const ok = await upsertRestaurantToSupabase(rest);
      if (!ok) {
        return { success: false, message: `Erro ao enviar dados do restaurante: ${rest.name}` };
      }
    }

    // 2. Send events
    for (const ev of INITIAL_EVENTS) {
      const ok = await upsertEventToSupabase(ev);
      if (!ok) {
        return { success: false, message: `Erro ao enviar dados do evento: ${ev.title}` };
      }
    }

    return { 
      success: true, 
      message: 'Todos os restaurantes e eventos de demonstração foram sincronizados com sucesso!' 
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Erro inesperado ao popular as tabelas.' };
  }
}

// SQL Script generator to aid the user
export const SQL_CREATION_SCRIPT = `-- Sabor Salvador - SQL de Setup para o Editor no Supabase
-- Copie todo este bloco, cole no campo "New Query" do painel SQL Editor do Supabase e clique em "Run"

-- 1. Criar tabela de restaurantes
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  neighborhood TEXT,
  price_range TEXT,
  category TEXT,
  image_url TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  closes_at TEXT,
  featured BOOLEAN DEFAULT FALSE,
  dishes JSONB DEFAULT '[]'::JSONB,
  reviews JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Criar tabela de eventos
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT,
  neighborhood TEXT,
  price TEXT,
  category TEXT,
  image_url TEXT,
  badge TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Habilitar RLS (Row Level Security) e Criar Políticas de Acesso Público Total
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas para Restaurants
DROP POLICY IF EXISTS "Permitir leitura pública de restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir inserção pública de restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir atualização pública de restaurantes" ON restaurants;
DROP POLICY IF EXISTS "Permitir exclusão pública de restaurantes" ON restaurants;

CREATE POLICY "Permitir leitura pública de restaurantes" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de restaurantes" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de restaurantes" ON restaurants FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de restaurantes" ON restaurants FOR DELETE USING (true);

-- Políticas para Events
DROP POLICY IF EXISTS "Permitir leitura pública de eventos" ON events;
DROP POLICY IF EXISTS "Permitir inserção pública de eventos" ON events;
DROP POLICY IF EXISTS "Permitir atualização pública de eventos" ON events;
DROP POLICY IF EXISTS "Permitir exclusão pública de eventos" ON events;

CREATE POLICY "Permitir leitura pública de eventos" ON events FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de eventos" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de eventos" ON events FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de eventos" ON events FOR DELETE USING (true);
`;
