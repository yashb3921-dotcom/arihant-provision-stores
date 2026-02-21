import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';

import { 
  NavigationProvider, 
  AuthProvider, 
  ShopProvider, 
  CartProvider, 
  useNavigation, 
  useAuth 
} from './contexts/StoreContext';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import SuccessPage from './pages/SuccessPage';

const AppContent = () => {
  const { view } = useNavigation();
  const { loading } = useAuth();

  useEffect(() => {
    if (!document.getElementById('font-outfit')) {
      const link = document.createElement('link'); link.id = 'font-outfit'; link.href = '[https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap](https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap)'; link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (!document.getElementById('style-glass')) {
      const style = document.createElement('style'); style.id = 'style-glass';
      style.innerHTML = `
        body { font-family: 'Outfit', sans-serif; background-color: #F8FAFC; }
        .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); }
        .glass-nav { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans">
        <Loader className="animate-spin mb-4 text-orange-600" size={48} />
        <p className="font-bold tracking-[0.3em] animate-pulse uppercase text-xs text-slate-400">Loading Store...</p>
      </div>
    );
  }

  return (
    <>
      {view !== 'landing' && view !== 'auth' && <Navbar />}
      <main className="max-w-7xl mx-auto px-6 animate-in fade-in duration-500">
        {view === 'landing' && <LandingPage />}
        {view === 'auth' && <AuthPage />}
        {view === 'shop' && <ShopPage />}
        {view === 'admin' && <AdminPage />}
        {view === 'profile' && <ProfilePage />}
        {view === 'success' && <SuccessPage />}
      </main>
      <CartDrawer />
    </>
  );
};

const App = () => {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ShopProvider>
          <CartProvider>
            <div className="min-h-screen selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
               <AppContent />
            </div>
          </CartProvider>
        </ShopProvider>
      </AuthProvider>
    </NavigationProvider>
  );
};

export default App;
