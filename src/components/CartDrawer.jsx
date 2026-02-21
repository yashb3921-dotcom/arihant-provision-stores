import React, { useState } from 'react';
import { ShoppingBag, X, ShoppingBasket, Minus, Plus, ChevronRight, Loader } from 'lucide-react';
import { useCart, useAuth } from '../contexts/StoreContext';
import { calculateDiscount } from '../config/supabase';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, cartTotal, placeOrder } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    const name = prompt("Receiver Name:", user?.user_metadata?.full_name || "");
    const phone = prompt("Contact Number:", user?.user_metadata?.phone_display || "");
    const address = prompt("Delivery Address (Type 'PICKUP' for store takeaway):", "");
    if (!name || !phone) return;

    setLoading(true);
    const type = address?.toUpperCase() === 'PICKUP' ? 'takeaway' : 'delivery';
    const { error } = await placeOrder({ name, phone, address: address || "Store Point" }, type);
    if (error) alert(error);
    setLoading(false);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3"><ShoppingBag className="text-orange-600" /> My Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center opacity-60">
              <ShoppingBasket size={80} className="mb-4" />
              <p className="font-bold">Your bag is empty</p>
            </div>
          ) : (
            cart.map(item => {
              const itemPrice = calculateDiscount(item.price, item.discount_percent);
              return (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-orange-100 transition-all">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-white" alt={item.name} />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                      <span className="font-black text-orange-600">₹{itemPrice * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.unit}</p>
                      <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-slate-100">
                        <button onClick={() => updateCartQuantity(item, -1)} className="p-1.5 text-slate-400 hover:text-orange-600"><Minus size={14}/></button>
                        <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item, 1)} className="p-1.5 text-slate-400 hover:text-orange-600"><Plus size={14}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold text-sm">Total</span>
              <span className="text-3xl font-black text-slate-900">₹{cartTotal}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-70">
              {loading ? <Loader className="animate-spin" /> : <>Place Order <ChevronRight size={20} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
