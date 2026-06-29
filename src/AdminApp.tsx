import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import SupabaseConsole from './components/SupabaseConsole';

import { 
  getRestaurantsFromSupabase, 
  getEventsFromSupabase, 
  upsertRestaurantToSupabase, 
  deleteRestaurantFromSupabase,
  upsertEventToSupabase, 
  deleteEventFromSupabase, 
  getCategoriesFromSupabase,
  upsertCategoryToSupabase,
  deleteCategoryFromSupabase,
  seedSupabaseInitialData 
} from './supabaseService';

import { 
  INITIAL_RESTAURANTS, 
  INITIAL_EVENTS 
} from './data';
import { Restaurant, Event } from './types';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<'login' | 'admin'>('login');
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<string[]>([
    'Acarajé', 'Moqueca', 'Hamburgueria', 'Sushi', 'Barzinho', 'Café',
    'Axé', 'Samba', 'Forró', 'Jazz', 'Cultura', 'Gastronomia', 'Eventos'
  ]);

  // Supabase Sync States
  const [dbLoading, setDbLoading] = useState(true);
  const [dbTablesMissing, setDbTablesMissing] = useState(false);

  // Load from Supabase
  const loadSupabaseData = async () => {
    setDbLoading(true);
    try {
      const supRests = await getRestaurantsFromSupabase();
      const supEvents = await getEventsFromSupabase();
      const supCategories = await getCategoriesFromSupabase();

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
        if (supCategories && supCategories.length > 0) {
          setCategories(supCategories);
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

    // Check auth session
    import('./supabaseClient').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const isSuper = session.user.email === 'gilberto010396@gmail.com' || session.user.user_metadata?.is_super_admin === true;
          setIsLoggedIn(true);
          setIsSuperAdmin(isSuper);
          setActiveTab('admin');
        }
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const isSuper = session.user.email === 'gilberto010396@gmail.com' || session.user.user_metadata?.is_super_admin === true;
          setIsLoggedIn(true);
          setIsSuperAdmin(isSuper);
          setActiveTab('admin');
        } else {
          setIsLoggedIn(false);
          setIsSuperAdmin(false);
          setActiveTab('login');
        }
      });
    });
  }, []);

  const handleAddEvent = async (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    await upsertEventToSupabase(newEvent);
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    await upsertEventToSupabase(updatedEvent);
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    await deleteEventFromSupabase(eventId);
  };


  const handleUpdateRestaurant = async (updated: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
    await upsertRestaurantToSupabase(updated);
  };

  const handleDeleteRestaurant = async (restId: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== restId));
    await deleteRestaurantFromSupabase(restId);
  };

  const handleAddCategory = async (cat: string) => {
    setCategories(prev => {
      if (!prev.includes(cat)) return [...prev, cat];
      return prev;
    });
    await upsertCategoryToSupabase(cat);
  };

  const handleDeleteCategory = async (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
    await deleteCategoryFromSupabase(cat);
  };

  const handleLoginSuccess = (isSuperAdminLogin = false) => {
    setIsLoggedIn(true);
    setIsSuperAdmin(isSuperAdminLogin);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterRestaurant = async (newRestaurant: Restaurant) => {
    setRestaurants(prev => [newRestaurant, ...prev]);
    await upsertRestaurantToSupabase(newRestaurant);
  };

  const adminRestaurant = restaurants.find(r => r.id === 'casa-de-tereza') || restaurants[0];

  return (
    <div className="min-h-screen bg-brand-surface text-brand-on-surface flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-surface/90 border-b border-brand-container-highest py-4 px-8 flex justify-between items-center">
        <span className="font-display text-2xl font-bold tracking-tight text-brand-primary">
          Sabor Salvador <span className="text-sm font-normal text-brand-outline">| Área Restrita</span>
        </span>
        {isLoggedIn && (
          <button 
            onClick={async () => {
              const { supabase } = await import('./supabaseClient');
              await supabase.auth.signOut();
              setIsLoggedIn(false);
              setIsSuperAdmin(false);
              setActiveTab('login');
            }}
            className="text-sm font-bold text-brand-primary hover:text-brand-primary-container cursor-pointer"
          >
            Sair
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        {activeTab === 'login' ? (
          <LoginView 
            onLoginSuccess={handleLoginSuccess}
            setActiveTab={(tab) => { if (tab === 'home') window.location.href = '/' }} // fallback redirect to main site
            onRegisterRestaurant={handleRegisterRestaurant}
          />
        ) : (
          isSuperAdmin ? (
            <SuperAdminDashboard
              restaurants={restaurants}
              events={events}
              onAddRestaurant={handleRegisterRestaurant}
              onUpdateRestaurant={handleUpdateRestaurant}
              onDeleteRestaurant={handleDeleteRestaurant}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          ) : (
            <AdminDashboard 
              restaurant={adminRestaurant}
              onUpdateRestaurant={handleUpdateRestaurant}
            />
          )
        )}
      </main>

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
