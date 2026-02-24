import React from 'react';
import { ShoppingBag, X, ShoppingBasket, Minus, Plus, ChevronRight, Tag } from 'lucide-react';
import { useCart, useNavigation } from '../contexts/StoreContext';
import { calculateDiscount } from '../config/supabase';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateCartQuantity, cartTotal } = useCart();
  const { setView } = useNavigation();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={() => setIsCartOpen(false)} 
      />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-white">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight text-slate-900">
            <div className="p-2 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-xl text-orange-600 shadow-inner border border-orange-100"><ShoppingBag size={24} /></div>
            Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white text-slate-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-all hover:rotate-90 duration-300 border border-slate-200 shadow-sm"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-80 animate-in fade-in zoom-in duration-500">
              <ShoppingBasket size={80} className="mb-6 text-slate-200" />
              <p className="font-black text-2xl text-slate-500 text-center tracking-tight">Your cart is empty.</p>
              <p className="text-sm font-semibold mt-2 text-center text-slate-400">Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            cart.map((item, index) => {
              const basePrice = calculateDiscount(item.price, item.discount_percent);
              const variantPrice = Math.floor(basePrice * item.variantMultiplier);
              const hasDisc = item.discount_percent > 0;
              
              return (
                <div key={item.cartItemId} className="flex gap-4 p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 relative shrink-0">
                    {hasDisc && <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-br-lg z-10 shadow-sm">{item.discount_percent}% OFF</div>}
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} onError={(e) => e.target.src=['https://', 'placehold.co/400x400/f8fafc/94a3b8?text=Item'].join('')} />
                  </div>
                  
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-slate-800 text-sm line-clamp-2 leading-snug">{item.name}</h4>
                    </div>
                    
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-black text-xl text-slate-900">₹{variantPrice}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 shadow-sm">{item.variantLabel}</p>
                      <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-200 shadow-inner">
                        <button onClick={() => updateCartQuantity(item.cartItemId, -1)} className="p-2 text-slate-500 hover:text-orange-600 hover:bg-white rounded-full transition-all active:scale-90 shadow-sm"><Minus size={16}/></button>
                        <span className="w-8 text-center font-black text-base text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.cartItemId, 1)} className="p-2 text-slate-500 hover:text-orange-600 hover:bg-white rounded-full transition-all active:scale-90 shadow-sm"><Plus size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1.5">Total Amount</span>
              <span className="text-4xl font-black text-slate-900 tracking-tight">₹{cartTotal}</span>
            </div>
            <button 
                onClick={handleCheckoutClick} 
                className="w-full min-h-[64px] bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-full font-extrabold text-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 active:scale-[0.98]"
            >
              Proceed to Checkout <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
