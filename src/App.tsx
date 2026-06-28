import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import RestaurantListView from './components/RestaurantListView';
import RestaurantDetailView from './components/RestaurantDetailView';
import EventsView from './components/EventsView';
import EventDetailView from './components/EventDetailView';
import GuidesView from './components/GuidesView';
import GuideDetailView from './components/GuideDetailView';

import { 
  getRestaurantsFromSupabase, 
  getEventsFromSupabase, 
  getArticlesFromSupabase,
  upsertRestaurantToSupabase,
  getCategoriesFromSupabase
} from './supabaseService';

import { 
  INITIAL_RESTAURANTS, 
  INITIAL_EVENTS, 
  INITIAL_ARTICLES 
} from './data';
import { Restaurant, Event, Review, GuideArticle } from './types';

function RestaurantDetailViewWrapper({ restaurants, onAddReview }: { restaurants: Restaurant[], onAddReview: (id: string, review: Review) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const currentRestaurant = restaurants.find(r => r.id === id);
  
  if (!currentRestaurant) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-lg font-bold text-brand-on-surface-variant mb-4">Restaurante não encontrado.</p>
        <p className="text-sm text-brand-outline mb-6">Pode ser que o banco de dados não possua todos os restaurantes.</p>
        <button 
          onClick={() => navigate('/restaurantes')}
          className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-brand-primary/90 transition"
        >
          Voltar para Restaurantes
        </button>
      </div>
    );
  }

  return (
    <RestaurantDetailView 
      restaurant={currentRestaurant}
      onBack={() => navigate('/restaurantes')}
      onAddReview={onAddReview}
    />
  );
}

export default function App() {
  const navigate = useNavigate();

  // Real reactive state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [articles, setArticles] = useState<GuideArticle[]>(INITIAL_ARTICLES);
  const [categories, setCategories] = useState<string[]>([]);

  // Search routing state
  const [searchFood, setSearchFood] = useState('');
  const [searchBairro, setSearchBairro] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Load from Supabase
  const loadSupabaseData = async () => {
    try {
      const supRests = await getRestaurantsFromSupabase();
      const supEvents = await getEventsFromSupabase();
      const supArticles = await getArticlesFromSupabase();
      const supCategories = await getCategoriesFromSupabase();

      if (supRests && supRests.length > 0) {
        setRestaurants(supRests);
      }
      if (supEvents && supEvents.length > 0) {
        setEvents(supEvents);
      }
      if (supArticles && supArticles.length > 0) {
        setArticles(supArticles);
      }
      if (supCategories && supCategories.length > 0) {
        setCategories(supCategories);
      }
    } catch (err) {
      console.error('Error fetching Supabase data on mount:', err);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Add review dynamically
  const handleAddReview = async (restaurantId: string, review: Review) => {
    let updatedRestaurant: Restaurant | null = null;
    setRestaurants(prev => {
      const result = prev.map(restaurant => {
        if (restaurant.id === restaurantId) {
          const overallRate = parseFloat(((restaurant.rating * restaurant.reviewsCount + review.rating) / (restaurant.reviewsCount + 1)).toFixed(1));
          updatedRestaurant = {
            ...restaurant,
            rating: overallRate,
            reviewsCount: restaurant.reviewsCount + 1,
            reviews: [review, ...restaurant.reviews]
          };
          return updatedRestaurant;
        }
        return restaurant;
      });

      if (updatedRestaurant) {
        upsertRestaurantToSupabase(updatedRestaurant);
      }

      return result;
    });
  };

  const handleSelectRestaurant = (id: string) => {
    navigate(`/restaurantes/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col justify-between font-sans">
      <Header />

      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={
            <HomeView 
              restaurants={restaurants}
              onSelectRestaurant={handleSelectRestaurant}
              setSearchFood={setSearchFood}
              setSearchBairro={setSearchBairro}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          } />
          
          <Route path="/restaurantes" element={
            <RestaurantListView 
              restaurants={restaurants}
              onSelectRestaurant={handleSelectRestaurant}
              searchFood={searchFood}
              setSearchFood={setSearchFood}
              searchBairro={searchBairro}
              setSearchBairro={setSearchBairro}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          } />

          <Route path="/restaurantes/:id" element={
            <RestaurantDetailViewWrapper 
              restaurants={restaurants}
              onAddReview={handleAddReview}
            />
          } />

          <Route path="/eventos" element={
            <EventsView events={events} />
          } />

          <Route path="/eventos/:slug" element={
            <EventDetailView events={events} />
          } />

          <Route path="/guias" element={
            <GuidesView articles={articles} />
          } />

          <Route path="/guias/:slug" element={
            <GuideDetailView articles={articles} />
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<HomeView restaurants={restaurants} onSelectRestaurant={handleSelectRestaurant} setSearchFood={setSearchFood} setSearchBairro={setSearchBairro} setSelectedCategory={setSelectedCategory} categories={categories} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
