import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useCart, useNavigation } from '../contexts/StoreContext';

const SuccessPage = () => {
  const { lastOrder } = useCart();
  const { setView } = useNavigation();

  if (!lastOrder) return null;

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200 animate-bounce"><CheckCircle size={48} /></div>
      <h2 className="text-4xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
      <p className="text-slate-500 mb-8 font-medium">Order ID: <span className="text-orange-600 font-bold">#{lastOrder.id.slice(0,6).toUpperCase()}</span></p>
      
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl w-full max-w-sm mb-8 text-left space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-50"><span className="text-xs font-bold text-slate-400 uppercase">Total Amount</span><span className="text-2xl font-black text-slate-900">₹{lastOrder.total_amount}</span></div>
        <div><p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Deliver To</p><p className="font-bold text-slate-800 text-sm">{lastOrder.customer_name}</p><p className="text-xs text-slate-500 mt-1">{lastOrder.address || 'In-Store Pickup'}</p></div>
      </div>
      <button onClick={() => setView('shop')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 shadow-xl transition-all active:scale-95">Continue Shopping</button>
    </div>
  );
};

export default SuccessPage;
