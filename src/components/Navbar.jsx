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
    <nav className="sticky top-0 z-40 glass-nav border-b border-slate-200/50 px-6 py-4 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-white p-2 rounded-xl shadow-md border border-slate-100 group-hover:scale-105 transition-transform">
            <img src={STORE_INFO.logo} alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-2xl tracking-tight leading-none text-slate-900">Arihant</h1>
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-[0.2em] mt-1">Provision Store</p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search grains, spices, essentials..." 
              className="w-full bg-slate-100/70 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-orange-200 focus:shadow-md outline-none transition-all text-sm font-semibold text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button 
              onClick={() => setView(isAdmin ? 'admin' : 'profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shadow-sm ${isAdmin ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300'}`}
            >
              {isAdmin ? <LayoutDashboard size={18} /> : <User size={18} />}
              <span className="text-xs font-bold hidden sm:block">{isAdmin ? 'Admin Console' : 'My Profile'}</span>
            </button>
          ) : (
            <button onClick={() => setView('auth')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 shadow-md transition-all active:scale-95">Login</button>
          )}
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce shadow-md">
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
