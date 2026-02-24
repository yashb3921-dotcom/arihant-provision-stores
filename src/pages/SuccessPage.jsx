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
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-emerald-200/40 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="animate-in zoom-in-95 duration-700 flex flex-col items-center w-full max-w-md mt-4">
          
          {/* Beautiful Ticket Container */}
          <div className="w-full bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100 relative mb-8">
              
              {/* Top Section: Success Header */}
              <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-8 flex flex-col items-center text-white relative">
                  <div className="absolute inset-0 bg-white/10 opacity-30 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:16px_16px]"></div>
                  
                  <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-5 animate-[bounce_2s_infinite]">
                      <CheckCircle size={56} className="text-green-500" />
                  </div>
                  
                  <h2 className="relative z-10 text-4xl sm:text-5xl font-black tracking-tight text-center mb-3">Confirmed!</h2>
                  <div className="relative z-10 font-black text-green-50 bg-green-700/30 px-5 py-2 rounded-full text-sm shadow-inner backdrop-blur-sm border border-green-400/50 uppercase tracking-widest">
                      ID: {lastOrder.order_id}
                  </div>
              </div>

              {/* Ticket Divider (Dashed Cutout Effect) */}
              <div className="relative h-8 bg-white flex items-center justify-between px-[-10px] -my-4 z-20">
                  <div className="w-8 h-8 bg-slate-50 rounded-full shadow-inner absolute -left-4"></div>
                  <div className="w-full border-t-4 border-dashed border-slate-200 mx-6"></div>
                  <div className="w-8 h-8 bg-slate-50 rounded-full shadow-inner absolute -right-4"></div>
              </div>

              {/* Bottom Section: Order Details */}
              <div className="p-8 pt-10 space-y-6 bg-white relative z-10">
                  
                  {/* Dynamic Message Box */}
                  {isTakeaway ? (
                      <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-100"><Store className="text-blue-600 shrink-0" size={28}/></div>
                          <div>
                              <p className="text-base font-black text-blue-900 mb-0.5">Ready for Takeaway</p>
                              <p className="text-xs font-bold text-blue-700/80 leading-snug">Pick up from: {STORE_INFO.address}</p>
                          </div>
                      </div>
                  ) : (
                      <div className="bg-orange-50 border-2 border-orange-200 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-orange-100"><Truck className="text-orange-600 shrink-0" size={28}/></div>
                          <div>
                              <p className="text-base font-black text-orange-900 mb-0.5">Out for Delivery</p>
                              <p className="text-xs font-bold text-orange-700/80 leading-snug">Our executive will contact you shortly.</p>
                          </div>
                      </div>
                  )}

                  {/* Customer Info & Total */}
                  <div className="space-y-6 pt-2">
                      <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-100 rounded-xl text-slate-500 shadow-inner border border-slate-200">
                              {isTakeaway ? <Store size={24}/> : <MapPin size={24}/>}
                          </div>
                          <div>
                              <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1">{isTakeaway ? 'Customer Name' : 'Deliver To'}</p>
                              <p className="font-extrabold text-slate-900 text-xl mb-1">{lastOrder.customer_name}</p>
                              <p className="text-sm text-slate-600 font-medium leading-relaxed">{lastOrder.address}</p>
                          </div>
                      </div>
                      
                      <div className="flex justify-between items-end border-t-2 border-slate-100 pt-6">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Total Paid</span>
                          <span className="text-5xl font-black text-slate-900 tracking-tight">₹{lastOrder.total_amount}</span>
                      </div>
                  </div>

              </div>
          </div>
          
          <button onClick={() => setView('shop')} className="w-full min-h-[68px] bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full font-extrabold text-xl hover:bg-orange-500 shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3 group active:scale-95 border border-slate-700">
              Back to Store <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform"/>
          </button>
      </div>
    </div>
  );
};

export default SuccessPage;
