import React, { useState } from 'react';
import { Search, Tag, Minus, Plus, ShoppingBasket } from 'lucide-react';
import { useShop, useCart } from '../contexts/StoreContext';
import { CATEGORIES, calculateDiscount } from '../config/supabase';

const ShopPage = () => {
  const { products, isShopOpen } = useShop();
  const { cart, updateCartQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === "All" || p.category === selectedCategory));

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Our <span className="text-orange-600">Collection</span></h2>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isShopOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{isShopOpen ? 'Live Store Open' : 'Store Closed'}</span>
          </div>
        </div>
        <div className="w-full md:w-auto relative group mb-4 md:mb-0 block lg:hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
          <input type="text" placeholder="Search..." className="w-full bg-slate-100/70 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-orange-200 outline-none text-sm font-semibold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredProducts.map(product => {
          const cartItem = cart.find(c => c.id === product.id);
          const discountedPrice = calculateDiscount(product.price, product.discount_percent);
          const hasDiscount = product.discount_percent > 0;
          return (
            <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-orange-100 transition-all duration-300 flex flex-col h-full relative">
              {hasDiscount && <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1"><Tag size={10} /> {product.discount_percent}% OFF</div>}
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} onError={(e) => e.target.src='[https://placehold.co/400?text=Product](https://placehold.co/400?text=Product)'} />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase text-slate-700 shadow-sm">{product.unit}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mb-1.5">{product.category}</p>
                <h3 className="font-bold text-slate-800 text-sm leading-snug mb-3 line-clamp-2 h-10">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4 mt-auto">
                  <span className="text-xl font-black text-slate-900">₹{discountedPrice}</span>
                  {hasDiscount && <span className="text-xs text-slate-400 line-through font-semibold">₹{product.price}</span>}
                </div>
                <div className="mt-auto">
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-1 animate-in fade-in duration-200">
                      <button onClick={() => updateCartQuantity(product, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-600 shadow-sm hover:bg-orange-600 hover:text-white transition-all active:scale-90"><Minus size={14}/></button>
                      <span className="font-black text-orange-700 text-sm">{cartItem.quantity}</span>
                      <button onClick={() => updateCartQuantity(product, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-orange-600 shadow-sm hover:bg-orange-600 hover:text-white transition-all active:scale-90"><Plus size={14}/></button>
                    </div>
                  ) : (
                    <button disabled={!isShopOpen} onClick={() => updateCartQuantity(product, 1)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-md active:scale-95">Add To Bag</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center opacity-50"><ShoppingBasket size={48} className="mx-auto mb-4 text-slate-300"/><p className="font-bold text-slate-400">No products found</p></div>
      )}
    </div>
  );
};

export default ShopPage;
