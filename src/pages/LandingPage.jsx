import React from 'react';
import { ChevronRight, Sparkles, ShieldCheck, Clock, HeartHandshake, PackageCheck, Zap } from 'lucide-react';
import { useNavigation } from '../contexts/StoreContext';

const LandingPage = () => {
  const { setView } = useNavigation();
  
  return (
    <div className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-12 lg:py-0 overflow-hidden">
      
      {/* Immersive Animated Background Gradients */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>

      {/* Hero Content Re-architected (NO STATIC IMAGES NEEDED) */}
      <div className="max-w-4xl mx-auto text-center space-y-10 z-10 animate-fade-in-up flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl text-orange-700 text-xs font-black uppercase tracking-widest border border-orange-200 shadow-md hover:shadow-lg transition-all cursor-default">
          <Sparkles size={16} className="text-orange-500 fill-orange-500" /> Premium Quality Assured
        </div>
        
        {/* Massive Typography */}
        <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[6rem] font-black text-slate-900 leading-[1.05] tracking-tighter">
          Your Daily <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500">
            Essentials.
          </span>
        </h2>
        
        <p className="text-slate-500 text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed max-w-2xl mx-auto px-4">
          The finest authentic spices, fresh grains, and everyday household needs delivered straight to your door with unmatched care.
        </p>
        
        {/* Premium Call To Action Buttons (TALLER & MORE PADDED) */}
        <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center w-full sm:w-auto px-6">
          <button onClick={() => setView('shop')} className="w-full sm:w-auto min-h-[64px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-95 border border-orange-400">
            Start Shopping <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button onClick={() => setView('auth')} className="w-full sm:w-auto min-h-[64px] bg-white/90 backdrop-blur-md border-2 border-slate-200 text-slate-800 px-10 py-4 rounded-2xl font-bold text-xl hover:border-orange-400 hover:text-orange-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-xl">
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

      {/* Floating Aesthetic Glass Elements (Replacing Image Dependency) */}
      <div className="hidden lg:flex absolute top-1/4 left-32 flex-col items-center justify-center animate-float opacity-80">
          <div className="glass p-5 rounded-3xl text-orange-500 shadow-2xl rotate-[-10deg] border border-white/80">
              <PackageCheck size={48} strokeWidth={2}/>
          </div>
      </div>

      <div className="hidden lg:flex absolute bottom-1/4 right-32 flex-col items-center justify-center animate-float-delayed opacity-80">
          <div className="glass px-6 py-4 rounded-2xl text-slate-800 shadow-2xl rotate-[5deg] border border-white/80 flex items-center gap-3 font-black text-lg">
              <Zap className="text-amber-500 fill-amber-500" size={24}/> Super Fast
          </div>
      </div>

    </div>
  );
};

export default LandingPage;
