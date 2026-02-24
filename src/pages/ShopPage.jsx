import React, { useState } from 'react';
import { Search, Tag, Minus, Plus, ShoppingBasket, ChevronDown } from 'lucide-react';
import { useShop, useCart } from '../contexts/StoreContext';
import { CATEGORIES, calculateDiscount } from '../config/supabase';

const ProductCard = ({ product }) => {
    const { isShopOpen } = useShop();
    const { addToCart } = useCart();
    
    const [variant, setVariant] = useState("1");
    const [customVal, setCustomVal] = useState("");
    const [added, setAdded] = useState(false);

    const discountedPrice = calculateDiscount(product.price, product.discount_percent);
    const hasDiscount = product.discount_percent > 0;

    const unitLower = product.unit.toLowerCase();
    const isWeight = unitLower.includes('kg') || unitLower.includes('g');
    const isLiquid = unitLower.includes('l') || unitLower.includes('ml');

    const currentMultiplier = variant === "custom" ? ((parseFloat(customVal)||0)/1000) : parseFloat(variant);
    const displayPrice = Math.floor(discountedPrice * (currentMultiplier || 1));
    const originalDisplayPrice = Math.floor(product.price * (currentMultiplier || 1));

    const handleAdd = () => {
        let label = product.unit;
        let mult = parseFloat(variant);

        if (variant === "0.5") label = isWeight ? "500 gm" : (isLiquid ? "500 ml" : "Half");
        else if (variant === "0.25") label = isWeight ? "250 gm" : (isLiquid ? "250 ml" : "Quarter");
        else if (variant === "custom") {
            const v = parseFloat(customVal);
            if(!v || v <= 0) return alert("Please enter a valid amount");
            mult = v / 1000;
            label = `${v} ${isWeight ? 'gm' : (isLiquid ? 'ml' : 'units')}`;
        }

        addToCart(product, label, mult, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="group bg-white/90 backdrop-blur-sm rounded-[2.5rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out flex flex-col h-full relative border border-slate-200 shadow-sm">
            {hasDiscount && (
            <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-1.5 animate-pulse border border-red-400">
                <Tag size={12} className="fill-white/20" /> {product.discount_percent}% OFF
            </div>
            )}
            
            <div className="relative aspect-square overflow-hidden bg-slate-50/80 p-5 flex items-center justify-center border-b border-slate-100">
            <img 
                src={product.image} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-md" 
                alt={product.name} 
                onError={(e) => e.target.src=['https://', 'placehold.co/400x400/f8fafc/94a3b8?text=Image+Not+Found'].join('')} 
            />
            </div>
            
            <div className="p-6 flex flex-col flex-1 bg-white">
            <div className="flex justify-between items-start mb-2">
               <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{product.category}</p>
               <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{product.unit}</p>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors">{product.name}</h3>
            
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">₹{displayPrice}</span>
                {hasDiscount && <span className="text-sm text-slate-400 line-through font-bold decoration-2 decoration-red-400/50">₹{originalDisplayPrice}</span>}
            </div>
            
            {/* VARIANT SELECTOR */}
            <div className="mt-auto space-y-3">
                <div className="relative">
                    <select value={variant} onChange={e => setVariant(e.target.value)} className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner">
                        <option value="1">1 {product.unit} (Full)</option>
                        {(isWeight || isLiquid) && <option value="0.5">{isWeight ? '500 gm' : '500 ml'} (Half)</option>}
                        {(isWeight || isLiquid) && <option value="0.25">{isWeight ? '250 gm' : '250 ml'} (Quarter)</option>}
                        <option value="custom">Custom amount...</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                
                {variant === 'custom' && (
                    <input type="number" placeholder={isWeight ? "Enter grams (e.g. 150)" : "Enter amount"} value={customVal} onChange={e => setCustomVal(e.target.value)} className="w-full bg-orange-50 border-2 border-orange-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner" />
                )}

                <button 
                    disabled={!isShopOpen || added} 
                    onClick={handleAdd} 
                    className={`w-full text-white py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all duration-300 active:scale-[0.97] border min-h-[56px] ${added ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/40' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 border-orange-400'} disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none`}
                >
                    {added ? 'Added to Bag ✓' : 'Add To Cart'}
                </button>
            </div>
            </div>
        </div>
    );
};

const ShopPage = () => {
  const { products, isShopOpen } = useShop();
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
        
        <div className="w-full lg:w-auto relative group mb-2 lg:mb-0 block sm:hidden">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input type="text" placeholder="Search products..." className="w-full bg-white border-2 border-slate-200 rounded-full py-4 pl-14 pr-4 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none text-base font-semibold transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`whitespace-nowrap px-7 py-3.5 rounded-full text-sm font-extrabold transition-all duration-300 ${selectedCategory === cat ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20 scale-105 border-transparent' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50/50 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
        {filteredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} />
        ))}
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
