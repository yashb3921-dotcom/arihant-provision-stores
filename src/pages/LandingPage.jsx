import React from 'react';
import { ChevronRight, Sparkles, ShieldCheck, Clock, HeartHandshake, PackageCheck, Zap } from 'lucide-react';
import { useNavigation } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const LandingPage = () => {
  const { setView } = useNavigation();
  
  return (
    <div className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-12 lg:py-0 overflow-hidden">
      
      {/* Immersive Animated Background Gradients */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>

      {/* Hero Content */}
      <div className="flex-1 text-center lg:text-left space-y-8 z-10 animate-fade-in-up">
        
        <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-xl px-6 py-2.5 rounded-full text-orange-700 text-xs font-black uppercase tracking-widest border border-orange-200 shadow-md hover:shadow-lg transition-all cursor-default">
          <Sparkles size={16} className="text-orange-500 fill-orange-500" /> Premium Quality Assured
        </div>
        
        <h2 className="text-6xl sm:text-7xl lg:text-[6rem] font-black text-slate-900 leading-[1.05] tracking-tighter">
          Your Daily <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500">
            Essentials.
          </span>
        </h2>
        
        <p className="text-slate-500 text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed max-w-2xl mx-auto lg:mx-0">
          The finest authentic spices, fresh grains, and everyday household needs delivered straight to your door with unmatched care.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start w-full sm:w-auto">
          <button onClick={() => setView('shop')} className="w-full sm:w-auto min-h-[64px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-4 rounded-full font-extrabold text-lg hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:-translate-y-1.5 flex items-center justify-center gap-3 group active:scale-95 border border-orange-400">
            Start Shopping <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button onClick={() => setView('auth')} className="w-full sm:w-auto min-h-[64px] bg-white/90 backdrop-blur-md border-2 border-slate-200 text-slate-800 px-10 py-4 rounded-full font-extrabold text-lg hover:border-orange-400 hover:text-orange-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1.5">
            Sign In / Register
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="pt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-200/80 mt-8">
            <div className="flex flex-col items-center lg:items-start gap-2"><ShieldCheck className="text-orange-500" size={28}/><span className="text-sm font-bold text-slate-700">100% Secure</span></div>
            <div className="flex flex-col items-center lg:items-start gap-2"><Clock className="text-orange-500" size={28}/><span className="text-sm font-bold text-slate-700">Fast Delivery</span></div>
            <div className="flex flex-col items-center lg:items-start gap-2"><HeartHandshake className="text-orange-500" size={28}/><span className="text-sm font-bold text-slate-700">Trusted Store</span></div>
        </div>
      </div>

      {/* Right Image/Graphic with the exact image you requested */}
      <div className="flex-1 hidden lg:flex justify-center items-center relative z-10 animate-in zoom-in duration-1000 delay-200">
         <div className="relative glass p-6 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] group w-full max-w-md flex justify-center border border-white/60">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/40 to-white/10 rounded-[3rem] pointer-events-none"></div>
            <img src={['https://', 'iili.io/qFY0OjR.png'].join('')} className="w-[100%] h-auto object-contain drop-shadow-2xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-700 ease-out relative z-10" alt="Store Hero" />
         </div>
      </div>

    </div>
  );
};

export default LandingPage;
