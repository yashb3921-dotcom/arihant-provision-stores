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
import CheckoutPage from './pages/CheckoutPage'; // Added import
import SuccessPage from './pages/SuccessPage';

const AppContent = () => {
  const { view } = useNavigation();
  const { loading } = useAuth();

  useEffect(() => {
    if (!document.getElementById('font-outfit')) {
      const link = document.createElement('link'); 
      link.id = 'font-outfit'; 
      link.href = ['https://', '[fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap](https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap)'].join(''); 
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans">
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader className="animate-spin text-orange-600 relative z-10" size={56} strokeWidth={3} />
        </div>
        <p className="font-bold tracking-[0.4em] animate-pulse uppercase text-[10px] text-slate-400">Connecting Core...</p>
      </div>
    );
  }

  return (
    <>
      {view !== 'landing' && view !== 'auth' && <Navbar />}
      
      <div className="transition-all duration-500 ease-in-out">
          <main className="max-w-7xl mx-auto px-4 sm:px-6">
            {view === 'landing' && <LandingPage />}
            {view === 'auth' && <AuthPage />}
            {view === 'shop' && <ShopPage />}
            {view === 'admin' && <AdminPage />}
            {view === 'profile' && <ProfilePage />}
            {view === 'checkout' && <CheckoutPage />} 
            {view === 'success' && <SuccessPage />}
          </main>
      </div>
      
      {view !== 'checkout' && <CartDrawer />}
    </>
  );
};

const App = () => {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ShopProvider>
          <CartProvider>
            <div className="min-h-screen selection:bg-orange-200 selection:text-orange-900 flex flex-col">
               <AppContent />
            </div>
          </CartProvider>
        </ShopProvider>
      </AuthProvider>
    </NavigationProvider>
  );
};

export default App;
