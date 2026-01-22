
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, SellerProfile, Ad } from './types';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdDetails } from './pages/AdDetails';
import { Dashboard } from './pages/Dashboard';
import { PostAd } from './pages/PostAd';
import { Profile } from './pages/Profile';
import { Pricing } from './pages/Pricing';
import { Toaster, toast } from 'react-hot-toast';

type Page = 'home' | 'login' | 'register' | 'ad-details' | 'dashboard' | 'post-ad' | 'profile' | 'pricing';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as UserRole) || 'buyer',
            created_at: session.user.created_at
          });
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentPage('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigateTo = (page: Page, id?: string) => {
    if (id) setSelectedAdId(id);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onAdClick={(id) => navigateTo('ad-details', id)} onPostAd={() => navigateTo('post-ad')} />;
      case 'login':
        return <Login onNavigateTo={navigateTo} />;
      case 'register':
        return <Register onNavigateTo={navigateTo} />;
      case 'ad-details':
        return <AdDetails adId={selectedAdId!} onBack={() => navigateTo('home')} />;
      case 'dashboard':
        return user?.role === 'seller' ? <Dashboard user={user as SellerProfile} onNavigateTo={navigateTo} /> : <Home onAdClick={(id) => navigateTo('ad-details', id)} onPostAd={() => navigateTo('post-ad')} />;
      case 'post-ad':
        return user?.role === 'seller' ? <PostAd user={user as SellerProfile} onNavigateTo={navigateTo} /> : <Pricing user={user as SellerProfile} onNavigateTo={navigateTo} />;
      case 'profile':
        return user ? <Profile user={user} onNavigateTo={navigateTo} /> : <Login onNavigateTo={navigateTo} />;
      case 'pricing':
        return <Pricing user={user as SellerProfile} onNavigateTo={navigateTo} />;
      default:
        return <Home onAdClick={(id) => navigateTo('ad-details', id)} onPostAd={() => navigateTo('post-ad')} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <Navbar 
        user={user} 
        onNavigateTo={navigateTo} 
        activePage={currentPage} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-indigo-400">MarketMaster</span>
          </div>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            The most secure and professional classifieds marketplace for buyers and sellers across the country.
          </p>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} MarketMaster Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
