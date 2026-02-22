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
    const data = {
      name: formData.get('name'), 
      price: parseFloat(formData.get('price')), 
      discount_percent: parseInt(formData.get('discount') || 0),
      category: formData.get('category'), 
      unit: formData.get('unit'), 
      image: formData.get('image') || '[https://placehold.co/400x400/f8fafc/94a3b8?text=Product](https://placehold.co/400x400/f8fafc/94a3b8?text=Product)'
    };
    const { error } = editingProduct?.id ? await supabase.from('products').update(data).eq('id', editingProduct.id) : await supabase.from('products').insert([data]);
    if (!error) { setEditingProduct(null); e.target.reset(); fetchProducts(); } else { alert(error.message); }
  };

  return (
    <div className="py-12 space-y-8 animate-fade-in-up">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
              <LayoutDashboard size={14} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Command Center</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={toggleShopStatus} className={`flex items-center gap-2 px-6 py-4 rounded-full text-xs font-black tracking-wider uppercase transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 ${isShopOpen ? 'bg-green-500 hover:bg-green-400 shadow-green-500/30 hover:shadow-green-500/50' : 'bg-red-500 hover:bg-red-400 shadow-red-500/30 hover:shadow-red-500/50'}`}>
              {isShopOpen ? <CheckCircle size={18}/> : <X size={18}/>} {isShopOpen ? 'Store is Open' : 'Store is Closed'}
          </button>
          <button onClick={() => setEditingProduct({ name: '', price: '', category: 'Essentials', unit: '1 kg', discount_percent: 0 })} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-full font-bold text-sm flex items-center gap-2 hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-95">
              <Plus size={20}/> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Active Orders Section */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-slate-200/60 flex items-center justify-between bg-white/40 backdrop-blur-md">
            <div>
                <h3 className="font-black text-2xl flex items-center gap-3 text-slate-900"><Truck className="text-orange-600" size={28}/> Live Orders</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Manage current incoming orders</p>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> Real-time Sync
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-4 no-scrollbar">
            {orders.map((order, index) => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="font-black text-slate-900 text-lg">Order #{order.id.slice(0,6).toUpperCase()}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                          <p className="font-black text-2xl text-slate-900">₹{order.total_amount}</p>
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-lg mt-2 inline-block ${order.order_type === 'delivery' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{order.order_type}</span>
                      </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                      <p className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><User size={14} className="text-orange-500"/> {order.customer_name}</p>
                      <p className="text-xs font-medium text-slate-500 mb-3">{order.customer_phone}</p>
                      <div className="text-xs text-slate-600 font-medium leading-relaxed bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                          {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                      </div>
                  </div>
                  
                  <div className="flex justify-end border-t border-slate-100 pt-4">
                    <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                        className={`text-xs font-bold px-4 py-2.5 rounded-xl border-none outline-none cursor-pointer uppercase tracking-wider transition-all shadow-sm ${order.status === 'Completed' ? 'bg-green-100 text-green-800 focus:ring-green-400' : order.status === 'Cancelled' ? 'bg-red-100 text-red-800 focus:ring-red-400' : 'bg-orange-100 text-orange-800 focus:ring-orange-400'} ring-2 ring-transparent`}
                    >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
              </div>
            ))}
            {orders.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                    <Truck size={64} className="mb-4 text-slate-200" />
                    <p className="font-bold text-xl">No active orders</p>
                </div>
            )}
          </div>
        </div>

        {/* Inventory & Editor Section */}
        <div className="space-y-6 h-[700px] flex flex-col">
          
          {/* Product Form */}
          {editingProduct && (
            <div className="glass p-8 rounded-[2.5rem] border border-orange-200 shadow-2xl relative animate-in slide-in-from-right duration-300 z-20">
              <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 hover:rotate-90 transition-all bg-white p-2 rounded-full shadow-sm"><X size={18}/></button>
              <h3 className="font-black text-2xl mb-6 text-slate-900">{editingProduct.id ? 'Edit Product' : 'Create Product'}</h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Product Name</label>
                    <input name="name" defaultValue={editingProduct.name} placeholder="e.g. Premium Basmati Rice" required className="mt-1 w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Base Price (₹)</label>
                        <input name="price" defaultValue={editingProduct.price} type="number" step="0.01" placeholder="0.00" required className="mt-1 w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner" />
                    </div>
                    {/* Emphasized Discount Field */}
                    <div>
                        <label className="text-[10px] font-bold text-orange-600 ml-2 uppercase tracking-widest flex items-center gap-1"><Tag size={10}/> Discount %</label>
                        <input name="discount" defaultValue={editingProduct.discount_percent} type="number" min="0" max="100" placeholder="e.g. 10" className="mt-1 w-full p-3.5 bg-orange-50 border border-orange-200 rounded-2xl text-sm font-black text-orange-600 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-orange-300 shadow-inner" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Category</label>
                        <select name="category" defaultValue={editingProduct.category || 'Essentials'} className="mt-1 w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner">
                            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Unit</label>
                        <input name="unit" defaultValue={editingProduct.unit} placeholder="e.g. 1 kg, 500g" required className="mt-1 w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Image URL</label>
                    <input name="image" defaultValue={editingProduct.image} placeholder="https://..." className="mt-1 w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner" />
                </div>
                
                <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-full font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-[0.98] mt-2">
                    <Save size={18}/> Save Product to Store
                </button>
              </form>
            </div>
          )}
          
          {/* Inventory List */}
          <div className="glass rounded-[2.5rem] overflow-hidden flex flex-col flex-1 border border-white">
            <div className="p-6 border-b border-slate-100 bg-white/50 flex justify-between items-center">
                <h4 className="font-black text-lg text-slate-900">Inventory</h4>
                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold">{products.length} Items</span>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-2 no-scrollbar">
              {products.map(p => {
                  const hasDisc = p.discount_percent > 0;
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={p.image} className="w-12 h-12 rounded-xl object-cover bg-slate-50" alt="Asset" onError={(e) => e.target.src='[https://placehold.co/100](https://placehold.co/100)'} />
                            {hasDisc && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse">%</div>}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs font-black text-slate-900">₹{calculateDiscount(p.price, p.discount_percent)}</p>
                                  {hasDisc && <p className="text-[10px] text-slate-400 line-through font-semibold">₹{p.price}</p>}
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingProduct(p)} className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white transition-colors"><Edit size={14}/></button>
                        <button onClick={async () => { if(confirm("Are you sure you want to delete this product?")) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14}/></button>
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
