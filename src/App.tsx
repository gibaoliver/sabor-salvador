import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import RestaurantListView from './components/RestaurantListView';
import RestaurantDetailView from './components/RestaurantDetailView';
import EventsView from './components/EventsView';
import GuidesView from './components/GuidesView';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import SupabaseConsole from './components/SupabaseConsole';

import { 
  getRestaurantsFromSupabase, 
  getEventsFromSupabase, 
  upsertRestaurantToSupabase, 
  upsertEventToSupabase, 
  deleteEventFromSupabase, 
  seedSupabaseInitialData 
} from './supabaseService';

import { 
  INITIAL_RESTAURANTS, 
  INITIAL_EVENTS, 
  INITIAL_ARTICLES 
} from './data';
import { Restaurant, Event, Review } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'restaurants' | 'events' | 'guides' | 'login' | 'admin'>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  
  // Real reactive state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [articles] = useState(INITIAL_ARTICLES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Supabase Sync States
  const [dbLoading, setDbLoading] = useState(true);
  const [dbTablesMissing, setDbTablesMissing] = useState(false);

  // Search routing state (passed from Home Search click to Directory list filter)
  const [searchFood, setSearchFood] = useState('');
  const [searchBairro, setSearchBairro] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Load from Supabase
  const loadSupabaseData = async () => {
    setDbLoading(true);
    try {
      const supRests = await getRestaurantsFromSupabase();
      const supEvents = await getEventsFromSupabase();

      if (supRests === null || supEvents === null) {
        setDbTablesMissing(true);
      } else {
        setDbTablesMissing(false);
        if (supRests.length > 0) {
          setRestaurants(supRests);
        }
        if (supEvents.length > 0) {
          setEvents(supEvents);
        }
      }
    } catch (err) {
      console.error('Error fetching Supabase data on mount:', err);
      setDbTablesMissing(true);
    } finally {
      setDbLoading(false);
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

  // Add event dynamically (from Admin)
  const handleAddEvent = async (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    await upsertEventToSupabase(newEvent);
  };

  // Delete event dynamically (from Admin)
  const handleDeleteEvent = async (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    await deleteEventFromSupabase(eventId);
  };

  // Modify restaurant info (from Admin)
  const handleUpdateRestaurant = async (updated: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
    await upsertRestaurantToSupabase(updated);
  };

  // Select restaurant -> redirect to detail view
  const handleSelectRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
    setActiveTab('restaurants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back callback
  const handleBackToDirectory = () => {
    setSelectedRestaurantId(null);
    setActiveTab('restaurants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterRestaurant = async (newRestaurant: Restaurant) => {
    setRestaurants(prev => [newRestaurant, ...prev]);
    setIsLoggedIn(true);
    // Focus directly on the newly created restaurant details!
    setSelectedRestaurantId(newRestaurant.id);
    setActiveTab('restaurants');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save to database
    await upsertRestaurantToSupabase(newRestaurant);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin restaurant record selection (default to Casa de Tereza)
  const adminRestaurant = restaurants.find(r => r.id === 'casa-de-tereza') || restaurants[0];

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col justify-between font-sans">
      
      {/* 1. MAIN GLOBAL STICKY HEADER */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        selectedRestaurantId={selectedRestaurantId}
        setSelectedRestaurantId={setSelectedRestaurantId}
      />

      {/* 2. MAIN APPLICATION CONTENT TRANSITIONS */}
      <main className="flex-grow flex flex-col">
        
        {/* Render Details View explicitly if selected */}
        {activeTab === 'restaurants' && selectedRestaurantId ? (
          (() => {
            const currentRestaurant = restaurants.find(r => r.id === selectedRestaurantId);
            if (!currentRestaurant) return (
              <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-center">
                <p className="text-lg font-bold text-brand-on-surface-variant mb-4">Restaurante não encontrado.</p>
                <p className="text-sm text-brand-outline mb-6">Pode ser que o banco de dados não possua todos os restaurantes do Bento Grid.</p>
                <button 
                  onClick={handleBackToDirectory}
                  className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-brand-primary/90 transition"
                >
                  Voltar para Restaurantes
                </button>
              </div>
            );
            return (
              <RestaurantDetailView 
                restaurant={currentRestaurant}
                onBack={handleBackToDirectory}
                onAddReview={handleAddReview}
              />
            );
          })()
        ) : (
          /* Render based on selected standard tabs */
          (() => {
            switch (activeTab) {
              case 'home':
                return (
                  <HomeView 
                    restaurants={restaurants}
                    onSelectRestaurant={handleSelectRestaurant}
                    setActiveTab={setActiveTab}
                    setSearchFood={setSearchFood}
                    setSearchBairro={setSearchBairro}
                    setSelectedCategory={setSelectedCategory}
                  />
                );
              case 'restaurants':
                return (
                  <RestaurantListView 
                    restaurants={restaurants}
                    onSelectRestaurant={handleSelectRestaurant}
                    searchFood={searchFood}
                    setSearchFood={setSearchFood}
                    searchBairro={searchBairro}
                    setSearchBairro={setSearchBairro}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                );
              case 'events':
                return (
                  <EventsView 
                    events={events}
                  />
                );
              case 'guides':
                return (
                  <GuidesView 
                    articles={articles}
                  />
                );
              case 'login':
                return (
                  <LoginView 
                    onLoginSuccess={handleLoginSuccess}
                    setActiveTab={setActiveTab}
                    onRegisterRestaurant={handleRegisterRestaurant}
                  />
                );
              case 'admin':
                return (
                  <AdminDashboard 
                    restaurant={adminRestaurant}
                    onUpdateRestaurant={handleUpdateRestaurant}
                  />
                );
              default:
                return (
                  <HomeView 
                    restaurants={restaurants}
                    onSelectRestaurant={handleSelectRestaurant}
                    setActiveTab={setActiveTab}
                    setSearchFood={setSearchFood}
                    setSearchBairro={setSearchBairro}
                    setSelectedCategory={setSelectedCategory}
                  />
                );
            }
          })()
        )}
      </main>

      {/* 3. FOOTER */}
      <Footer 
        setActiveTab={setActiveTab} 
        setSelectedRestaurantId={setSelectedRestaurantId}
      />

      {/* Supabase Administration Console Deck */}
      <SupabaseConsole 
        dbLoading={dbLoading}
        dbTablesMissing={dbTablesMissing}
        restaurantsCount={restaurants.length}
        eventsCount={events.length}
        onRefresh={loadSupabaseData}
        onSeed={seedSupabaseInitialData}
      />
      
    </div>
  );
}
