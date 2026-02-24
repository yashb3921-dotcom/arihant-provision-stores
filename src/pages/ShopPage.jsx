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
    <div className="py-8 space-y-10 animate-fade-in-up">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200/60">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Collection</span></h2>
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              {isShopOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{isShopOpen ? 'Accepting Orders' : 'Store Currently Closed'}</span>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="w-full lg:w-auto relative group mb-2 lg:mb-0 block sm:hidden">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input type="text" placeholder="Search products..." className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 pl-14 pr-4 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none text-base font-semibold transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`whitespace-nowrap px-7 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${selectedCategory === cat ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20 scale-105 border-transparent' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50/50 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredProducts.map((product, index) => {
          const cartItem = cart.find(c => c.id === product.id);
          const discountedPrice = calculateDiscount(product.price, product.discount_percent);
          const hasDiscount = product.discount_percent > 0;
          
          return (
            <div 
              key={product.id} 
              className="group bg-white/90 backdrop-blur-sm rounded-[2.5rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out flex flex-col h-full relative border border-slate-200 shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-1.5 animate-pulse border border-red-400">
                  <Tag size={12} className="fill-white/20" /> {product.discount_percent}% OFF
                </div>
              )}
              
              {/* Image Box */}
              <div className="relative aspect-square overflow-hidden bg-slate-50/80 p-5 flex items-center justify-center border-b border-slate-100">
                <img 
                    src={product.image} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-md" 
                    alt={product.name} 
                    onError={(e) => e.target.src=['https://', 'placehold.co/400x400/f8fafc/94a3b8?text=Image+Not+Found'].join('')} 
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-slate-700 shadow-md border border-slate-200">
                    {product.unit}
                </div>
              </div>
              
              {/* Content Box */}
              <div className="p-6 flex flex-col flex-1 bg-white">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-4 line-clamp-2 h-12 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                
                {/* Pricing Display */}
                <div className="flex items-baseline gap-2 mb-6 mt-auto">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">₹{discountedPrice}</span>
                  {hasDiscount && <span className="text-sm text-slate-400 line-through font-bold decoration-2 decoration-red-400/50">₹{product.price}</span>}
                </div>
                
                {/* UPGRADED: Add to Cart Controls */}
                <div className="mt-auto">
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-orange-50 border-2 border-orange-200 rounded-2xl p-1.5 shadow-inner animate-in zoom-in duration-200">
                      <button onClick={() => updateCartQuantity(product, -1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-orange-600 shadow-sm hover:bg-orange-500 hover:text-white transition-all active:scale-90"><Minus size={20}/></button>
                      <span className="font-black text-orange-700 text-xl w-10 text-center">{cartItem.quantity}</span>
                      <button onClick={() => updateCartQuantity(product, 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-orange-600 shadow-sm hover:bg-orange-500 hover:text-white transition-all active:scale-90"><Plus size={20}/></button>
                    </div>
                  ) : (
                    <button 
                      disabled={!isShopOpen} 
                      onClick={() => updateCartQuantity(product, 1)} 
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-extrabold text-base uppercase tracking-widest hover:from-orange-600 hover:to-amber-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 transition-all duration-300 shadow-lg shadow-orange-500/30 active:scale-[0.97] border border-orange-400 disabled:border-slate-300 min-h-[56px]"
                    >
                      Add To Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-24 text-center opacity-60 animate-in fade-in">
            <ShoppingBasket size={64} className="mx-auto mb-6 text-slate-300"/>
            <h3 className="text-2xl font-black text-slate-400 mb-2">No products found</h3>
            <p className="font-medium text-slate-500 text-lg">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
