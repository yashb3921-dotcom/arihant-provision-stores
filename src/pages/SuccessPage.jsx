import React, { useEffect } from 'react';
import { CheckCircle, PackageOpen, ChevronRight, Store, Truck, MapPin } from 'lucide-react';
import { useCart, useNavigation } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const SuccessPage = () => {
  const { lastOrder } = useCart();
  const { setView } = useNavigation();

  useEffect(() => {
      if(!lastOrder) setView('shop');
  }, [lastOrder, setView]);

  if (!lastOrder) return null;

  const isTakeaway = lastOrder.order_type === 'takeaway';

  return (
    <div className="h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-green-200/40 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="animate-in zoom-in-75 duration-700 flex flex-col items-center w-full max-w-md">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-400 blur-xl opacity-50 animate-pulse rounded-full"></div>
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-tr from-green-500 to-emerald-400 text-white rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500 border border-green-300">
                <CheckCircle size={64} className="animate-[bounce_2s_infinite]" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight text-center">Confirmed!</h2>
          
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-sm mb-8">
            <p className="text-slate-600 font-bold text-lg text-center">Order ID: <span className="text-orange-600 font-black">{lastOrder.order_id}</span></p>
          </div>
          
          <div className="glass w-full p-8 sm:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white mb-8 text-left space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            
            {/* Custom Messaging based on Type */}
            {isTakeaway ? (
                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-2xl flex gap-4 shadow-inner mb-6">
                    <Store className="text-blue-500 shrink-0" size={24}/>
                    <div>
                        <p className="text-sm font-bold text-slate-800 mb-1">Ready for Takeaway Soon</p>
                        <p className="text-xs font-semibold text-slate-600">Please pick it up from: {STORE_INFO.address}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-orange-50 border-2 border-orange-200 p-5 rounded-2xl flex gap-4 shadow-inner mb-6">
                    <Truck className="text-orange-500 shrink-0" size={24}/>
                    <div>
                        <p className="text-sm font-bold text-slate-800 mb-1">Out for Delivery Soon</p>
                        <p className="text-xs font-semibold text-slate-600">Our executive will contact you shortly.</p>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4 border-t-2 border-slate-100 pt-6">
                <div className="p-4 bg-slate-100 rounded-2xl text-slate-500 shadow-inner border border-slate-200">
                    {isTakeaway ? <Store size={24}/> : <MapPin size={24}/>}
                </div>
                <div>
                    <p className="text-[11px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">{isTakeaway ? 'Customer' : 'Deliver To'}</p>
                    <p className="font-bold text-slate-900 text-xl">{lastOrder.customer_name}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">{lastOrder.address}</p>
                </div>
            </div>
            
          </div>
          
          <button onClick={() => setView('shop')} className="w-full min-h-[64px] bg-gradient-to-r from-slate-900 to-slate-800 text-white py-5 rounded-full font-extrabold text-xl hover:from-orange-600 hover:to-amber-600 shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3 group active:scale-95 animate-in fade-in duration-1000 delay-500 border border-slate-700">
              Back to Home <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform"/>
          </button>
      </div>
    </div>
  );
};

export default SuccessPage;
