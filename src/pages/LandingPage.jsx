import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useNavigation } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const LandingPage = () => {
  const { setView } = useNavigation();
  
  return (
    <div className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-16 py-12 relative animate-in fade-in zoom-in-95 duration-700">
      <div className="flex-1 text-center lg:text-left space-y-8 z-10">
        <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-100 shadow-sm">
          <Sparkles size={12} className="fill-orange-500" /> Premium Quality • Best Prices
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight">
          Daily <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Essentials.</span>
        </h2>
        <p className="text-slate-500 text-lg max-w-lg font-medium leading-relaxed mx-auto lg:mx-0">
          Your trusted neighborhood store for authentic spices, fresh grains, and daily household needs. Delivered with care.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
          <button onClick={() => setView('shop')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 hover:shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95">
            Start Shopping <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => setView('auth')} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-slate-900 hover:text-slate-900 transition-all active:scale-95 shadow-sm">Sign In</button>
        </div>
      </div>
      <div className="flex-1 hidden lg:flex justify-center items-center relative">
         <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-blue-50 rounded-full blur-[100px] opacity-60"></div>
         <div className="relative bg-white/40 backdrop-blur-xl p-12 rounded-[3rem] border border-white/50 shadow-2xl">
            <img src={STORE_INFO.logo} className="w-[350px] h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" alt="Store Hero" />
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
export default LandingPage;
