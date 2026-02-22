import React, { useState } from 'react';
import { ShoppingBag, Search, LayoutDashboard, User } from 'lucide-react';
import { useNavigation, useAuth, useCart } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const Navbar = () => {
  const { setView } = useNavigation();
  const { user, isAdmin } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 group-hover:scale-105 transition-all duration-300 ease-out">
            <img src={STORE_INFO.logo} alt="Logo" className="h-8 sm:h-10 w-auto object-contain" />
          </div>
          <div className="hidden sm:flex flex-col justify-center">
            <h1 className="font-extrabold text-2xl tracking-tight leading-none text-slate-900 group-hover:text-orange-600 transition-colors">Arihant</h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-1">Provision Store</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md mx-6 hidden lg:block opacity-0 pointer-events-none"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <button 
              onClick={() => setView(isAdmin ? 'admin' : 'profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 shadow-sm active:scale-95 ${isAdmin ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-transparent hover:shadow-lg hover:shadow-slate-900/20' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600'}`}
            >
              {isAdmin ? <LayoutDashboard size={18} /> : <User size={18} />}
              <span className="text-xs font-bold hidden sm:block tracking-wide">{isAdmin ? 'Admin Panel' : 'My Account'}</span>
            </button>
          ) : (
            <button onClick={() => setView('auth')} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30 transition-all duration-300 active:scale-95">
              Log In
            </button>
          )}
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white border border-slate-200 text-slate-700 rounded-full hover:border-orange-500 hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group"
          >
            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce shadow-md">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
