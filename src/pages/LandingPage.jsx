import React from 'react';
import { ChevronRight, Sparkles, ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import { useNavigation } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const LandingPage = () => {
  const { setView } = useNavigation();
  
  return (
    <div className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-12 lg:py-0 overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left space-y-8 z-10 animate-fade-in-up">
        
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full text-orange-700 text-xs font-bold uppercase tracking-widest border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-default">
          <Sparkles size={14} className="fill-orange-500" /> Premium Quality Guaranteed
        </div>
        
        <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
          Your Daily <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500">
            Essentials.
          </span>
        </h2>
        
        <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
          The finest authentic spices, fresh grains, and everyday household needs delivered straight to your door with care.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
          <button onClick={() => setView('shop')} className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-4.5 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-amber-500 shadow-xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95">
            Start Shopping <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => setView('auth')} className="bg-white/80 backdrop-blur-md border-2 border-slate-200 text-slate-700 px-8 py-4.5 rounded-2xl font-bold text-lg hover:border-slate-900 hover:text-slate-900 transition-all duration-300 active:scale-95 shadow-sm">
            Sign In / Register
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="pt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-200/60 mt-8">
            <div className="flex flex-col items-center lg:items-start gap-2"><ShieldCheck className="text-orange-500" size={24}/><span className="text-xs font-bold text-slate-600">100% Secure</span></div>
            <div className="flex flex-col items-center lg:items-start gap-2"><Clock className="text-orange-500" size={24}/><span className="text-xs font-bold text-slate-600">Fast Delivery</span></div>
            <div className="flex flex-col items-center lg:items-start gap-2"><HeartHandshake className="text-orange-500" size={24}/><span className="text-xs font-bold text-slate-600">Trusted Store</span></div>
        </div>

      </div>

      {/* Right Image/Graphic */}
      <div className="flex-1 hidden lg:flex justify-center items-center relative z-10 animate-in zoom-in duration-1000 delay-200">
         <div className="relative glass p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/10 rounded-[3rem] pointer-events-none"></div>
            <img src={STORE_INFO.logo} className="w-[400px] h-auto object-contain drop-shadow-2xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-700 ease-out" alt="Store Hero" />
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
