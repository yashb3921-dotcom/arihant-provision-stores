import React, { useEffect } from 'react';
import { CheckCircle, PackageOpen, ChevronRight } from 'lucide-react';
import { useCart, useNavigation } from '../contexts/StoreContext';

const SuccessPage = () => {
  const { lastOrder } = useCart();
  const { setView } = useNavigation();

  useEffect(() => {
      if(!lastOrder) setView('shop');
  }, [lastOrder, setView]);

  if (!lastOrder) return null;

  return (
    <div className="h-[85vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-green-200/40 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="animate-in zoom-in-75 duration-700 flex flex-col items-center w-full max-w-md">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-400 blur-xl opacity-50 animate-pulse rounded-full"></div>
            <div className="w-32 h-32 bg-gradient-to-tr from-green-500 to-emerald-400 text-white rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500 border border-green-300">
                <CheckCircle size={64} className="animate-[bounce_2s_infinite]" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight text-center">Confirmed!</h2>
          <p className="text-slate-500 mb-10 font-semibold text-xl text-center">Your order <span className="text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 shadow-sm">#{lastOrder.id.slice(0,6).toUpperCase()}</span> is processing.</p>
          
          <div className="glass w-full p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white mb-8 text-left space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex justify-between items-center pb-6 border-b-2 border-slate-200/60">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Amount Paid</span>
                <span className="text-4xl font-black text-slate-900 tracking-tight">₹{lastOrder.total_amount}</span>
            </div>
            <div className="flex items-start gap-5">
                <div className="p-4 bg-slate-100 rounded-2xl text-slate-500 mt-1 shadow-inner border border-slate-200"><PackageOpen size={24}/></div>
                <div>
                    <p className="text-[11px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">{lastOrder.order_type === 'delivery' ? 'Deliver To' : 'Pickup By'}</p>
                    <p className="font-bold text-slate-900 text-lg">{lastOrder.customer_name}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">{lastOrder.address || 'In-Store Pickup'}</p>
                </div>
            </div>
          </div>
          
          <button onClick={() => setView('shop')} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-5 rounded-full font-extrabold text-xl hover:from-orange-600 hover:to-amber-600 shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3 group active:scale-95 animate-in fade-in duration-1000 delay-500 border border-orange-400">
              Continue Shopping <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform"/>
          </button>
      </div>
    </div>
  );
};

export default SuccessPage;
