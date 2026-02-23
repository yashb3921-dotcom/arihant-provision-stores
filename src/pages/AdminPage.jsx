import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle, X, Plus, Truck, Edit, Save, Trash2, Tag, User } from 'lucide-react';
import { useAuth, useNavigation, useShop, useCart } from '../contexts/StoreContext';
import { supabase, CATEGORIES, ORDER_STATUSES, calculateDiscount } from '../config/supabase';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const { setView } = useNavigation();
  const { products, isShopOpen, toggleShopStatus, fetchProducts } = useShop();
  const { orders, updateOrderStatus } = useCart();
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!isAdmin) setView('shop');
  }, [isAdmin, setView]);

  if (!isAdmin) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // SAFE PARSING
    const discountVal = parseInt(formData.get('discount') || 0);
    const data = {
      name: formData.get('name'), 
      price: parseFloat(formData.get('price')), 
      category: formData.get('category'), 
      unit: formData.get('unit'), 
      image: formData.get('image') || (['https://', 'placehold.co/400x400/f8fafc/94a3b8?text=Product'].join(''))
    };

    const payload = { ...data, discount_percent: discountVal };

    const { error } = editingProduct?.id 
        ? await supabase.from('products').update(payload).eq('id', editingProduct.id) 
        : await supabase.from('products').insert([payload]);
        
    if (error) { 
        if (error.message.includes('discount_percent')) {
            alert("CRITICAL ERROR: Please go to your Supabase Dashboard -> Table Editor -> 'products' table, and add a new column named 'discount_percent' (Type: int4, Default: 0).");
        } else {
            alert("Database Error: " + error.message); 
        }
    } else { 
        setEditingProduct(null); 
        e.target.reset(); 
        fetchProducts(); 
    }
  };

  return (
    <div className="py-12 space-y-8 animate-fade-in-up">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm">
              <LayoutDashboard size={14} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Command Center</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={toggleShopStatus} className={`flex items-center gap-2 px-7 py-4 rounded-full text-sm font-black tracking-wider uppercase transition-all shadow-lg hover:-translate-y-1 active:scale-95 ${isShopOpen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/30' : 'bg-red-500 hover:bg-red-400 shadow-red-500/30'}`}>
              {isShopOpen ? <CheckCircle size={20}/> : <X size={20}/>} {isShopOpen ? 'Store is Open' : 'Store is Closed'}
          </button>
          <button onClick={() => setEditingProduct({ name: '', price: '', category: 'Essentials', unit: '1 kg', discount_percent: 0 })} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-7 py-4 rounded-full font-bold text-sm flex items-center gap-2 hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:-translate-y-1 active:scale-95 border border-orange-400">
              <Plus size={22}/> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Active Orders Section */}
        <div className="lg:col-span-2 glass rounded-[3rem] overflow-hidden flex flex-col h-[750px] border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <div className="p-8 border-b border-slate-200/60 flex items-center justify-between bg-white/60 backdrop-blur-md">
            <div>
                <h3 className="font-black text-3xl flex items-center gap-3 text-slate-900"><Truck className="text-orange-600" size={32}/> Live Orders</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">Manage current incoming orders</p>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> Real-time Sync
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-5 no-scrollbar bg-slate-50/30">
            {orders.map((order, index) => (
              <div key={order.id} className="bg-white border-2 border-slate-100 rounded-[2rem] p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex justify-between items-start mb-5">
                      <div>
                          <p className="font-black text-slate-900 text-xl">Order #{order.id.slice(0,6).toUpperCase()}</p>
                          <p className="text-sm font-semibold text-slate-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                          <p className="font-black text-3xl text-slate-900">₹{order.total_amount}</p>
                          <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full mt-2 inline-block shadow-sm ${order.order_type === 'delivery' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>{order.order_type}</span>
                      </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-[1.5rem] p-5 mb-5 border border-slate-200 shadow-inner">
                      <p className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2"><User size={16} className="text-orange-500"/> {order.customer_name}</p>
                      <p className="text-sm font-medium text-slate-500 mb-4">{order.customer_phone}</p>
                      <div className="text-sm text-slate-700 font-semibold leading-relaxed bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                          {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                      </div>
                  </div>
                  
                  <div className="flex justify-end border-t-2 border-slate-100 pt-5">
                    <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                        className={`text-sm font-black px-5 py-3 rounded-xl border-none outline-none cursor-pointer uppercase tracking-widest transition-all shadow-sm ${order.status === 'Completed' ? 'bg-green-100 text-green-800 focus:ring-green-400' : order.status === 'Cancelled' ? 'bg-red-100 text-red-800 focus:ring-red-400' : 'bg-orange-100 text-orange-800 focus:ring-orange-400'} ring-2 ring-transparent`}
                    >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
              </div>
            ))}
            {orders.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                    <Truck size={80} className="mb-4 text-slate-200" />
                    <p className="font-black text-2xl">No active orders</p>
                </div>
            )}
          </div>
        </div>

        {/* Inventory & Editor Section */}
        <div className="space-y-6 h-[750px] flex flex-col">
          
          {/* Product Form */}
          {editingProduct && (
            <div className="glass p-8 rounded-[3rem] border border-orange-200 shadow-2xl relative animate-in slide-in-from-right duration-300 z-20">
              <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 hover:rotate-90 transition-all bg-white p-2.5 rounded-full shadow-sm border border-slate-100"><X size={20}/></button>
              <h3 className="font-black text-3xl mb-8 text-slate-900">{editingProduct.id ? 'Edit Product' : 'Create Product'}</h3>
              
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="text-[11px] font-black text-slate-500 ml-3 uppercase tracking-widest">Product Name</label>
                    <input name="name" defaultValue={editingProduct.name} placeholder="e.g. Premium Basmati Rice" required className="mt-1.5 w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-base font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner" />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="text-[11px] font-black text-slate-500 ml-3 uppercase tracking-widest">Base Price (₹)</label>
                        <input name="price" defaultValue={editingProduct.price} type="number" step="0.01" placeholder="0.00" required className="mt-1.5 w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-base font-black outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner" />
                    </div>
                    {/* Emphasized Discount Field */}
                    <div>
                        <label className="text-[11px] font-black text-orange-600 ml-3 uppercase tracking-widest flex items-center gap-1"><Tag size={12}/> Discount %</label>
                        <input name="discount" defaultValue={editingProduct.discount_percent} type="number" min="0" max="100" placeholder="e.g. 10" className="mt-1.5 w-full p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl text-base font-black text-orange-600 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30 transition-all placeholder:text-orange-300 shadow-inner" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="text-[11px] font-black text-slate-500 ml-3 uppercase tracking-widest">Category</label>
                        <select name="category" defaultValue={editingProduct.category || 'Essentials'} className="mt-1.5 w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner">
                            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[11px] font-black text-slate-500 ml-3 uppercase tracking-widest">Unit</label>
                        <input name="unit" defaultValue={editingProduct.unit} placeholder="e.g. 1 kg, 500g" required className="mt-1.5 w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner" />
                    </div>
                </div>

                <div>
                    <label className="text-[11px] font-black text-slate-500 ml-3 uppercase tracking-widest">Image URL</label>
                    <input name="image" defaultValue={editingProduct.image} placeholder="https://..." className="mt-1.5 w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-inner" />
                </div>
                
                <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4.5 rounded-full font-extrabold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:-translate-y-1 active:scale-[0.98] mt-4 border border-orange-400">
                    <Save size={20}/> Save Product to Store
                </button>
              </form>
            </div>
          )}
          
          {/* Inventory List */}
          <div className="glass rounded-[3rem] overflow-hidden flex flex-col flex-1 border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <div className="p-8 border-b border-slate-100 bg-white/60 flex justify-between items-center backdrop-blur-md">
                <h4 className="font-black text-2xl text-slate-900">Inventory</h4>
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">{products.length} Items</span>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/30">
              {products.map(p => {
                  const hasDisc = p.discount_percent > 0;
                  return (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group shadow-sm hover:-translate-y-0.5">
                      <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={p.image} className="w-14 h-14 rounded-2xl object-cover bg-slate-50 border border-slate-200" alt="Asset" onError={(e) => e.target.src=(['https://', 'placehold.co/100'].join(''))} />
                            {hasDisc && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md animate-pulse border border-red-400">%</div>}
                          </div>
                          <div>
                              <p className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{p.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm font-black text-slate-900">₹{calculateDiscount(p.price, p.discount_percent)}</p>
                                  {hasDisc && <p className="text-xs text-slate-400 line-through font-semibold">₹{p.price}</p>}
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingProduct(p)} className="p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white transition-colors shadow-sm"><Edit size={16}/></button>
                        <button onClick={async () => { if(confirm("Are you sure you want to delete this product?")) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-sm"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  )
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
