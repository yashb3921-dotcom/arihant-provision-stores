import React, { useState } from 'react';
import { ShoppingBag, LayoutDashboard, User } from 'lucide-react';
import { useNavigation, useAuth, useCart } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const Navbar = () => {
  const { setView } = useNavigation();
  const { user, isAdmin } = useAuth();
  const { cart, setIsCartOpen } = useCart();

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 group-hover:scale-105 transition-all duration-300 ease-out">
            <img src={STORE_INFO.logo} alt="Logo" className="h-8 sm:h-10 w-auto object-contain" />
          </div>
          <div className="hidden sm:flex flex-col justify-center">
            <h1 className="font-black text-2xl tracking-tight leading-none text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-500 transition-all">Arihant</h1>
            <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-[0.25em] mt-0.5">Provision Store</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <button 
              onClick={() => setView(isAdmin ? 'admin' : 'profile')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-300 shadow-sm active:scale-95 ${isAdmin ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-transparent hover:shadow-lg hover:shadow-slate-900/20' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 hover:shadow-orange-500/10'}`}
            >
              {isAdmin ? <LayoutDashboard size={20} /> : <User size={20} />}
              <span className="text-sm font-bold hidden sm:block tracking-wide">{isAdmin ? 'Admin Panel' : 'My Account'}</span>
            </button>
          ) : (
            <button onClick={() => setView('auth')} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-7 py-3 rounded-2xl font-bold text-base hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 active:scale-95 border border-orange-400">
              Log In
            </button>
          )}
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl hover:border-orange-400 hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 group"
          >
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-[11px] font-black h-6 w-6 flex items-center justify-center rounded-full border-2 border-white shadow-md animate-bounce">
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
