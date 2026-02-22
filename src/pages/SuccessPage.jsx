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
            <div className="w-28 h-28 bg-gradient-to-tr from-green-500 to-emerald-400 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                <CheckCircle size={56} className="animate-[bounce_2s_infinite]" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight text-center">Order Confirmed!</h2>
          <p className="text-slate-500 mb-10 font-medium text-lg text-center">Your order <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">#{lastOrder.id.slice(0,6).toUpperCase()}</span> is processing.</p>
          
          <div className="glass w-full p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white mb-8 text-left space-y-5 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex justify-between items-center pb-5 border-b border-slate-200/60">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount Paid</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">₹{lastOrder.total_amount}</span>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 mt-1"><PackageOpen size={20}/></div>
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{lastOrder.order_type === 'delivery' ? 'Deliver To' : 'Pickup By'}</p>
                    <p className="font-bold text-slate-900 text-base">{lastOrder.customer_name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{lastOrder.address || 'In-Store Pickup'}</p>
                </div>
            </div>
          </div>
          
          <button onClick={() => setView('shop')} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4.5 rounded-full font-bold text-lg hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 group active:scale-95 animate-in fade-in duration-1000 delay-500">
              Continue Shopping <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
          </button>
      </div>
    </div>
  );
};

export default SuccessPage;
