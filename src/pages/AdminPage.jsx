import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle, X, Plus, Truck, Edit, Save, Trash2 } from 'lucide-react';
import { useAuth, useNavigation, useShop, useCart } from '../contexts/StoreContext';
import { supabase, CATEGORIES, ORDER_STATUSES } from '../config/supabase';

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
      name: formData.get('name'), price: parseFloat(formData.get('price')), discount_percent: parseInt(formData.get('discount') || 0),
      category: formData.get('category'), unit: formData.get('unit'), image: formData.get('image') || '[https://placehold.co/400?text=Product](https://placehold.co/400?text=Product)'
    };
    const { error } = editingProduct?.id ? await supabase.from('products').update(data).eq('id', editingProduct.id) : await supabase.from('products').insert([data]);
    if (!error) { setEditingProduct(null); e.target.reset(); fetchProducts(); }
  };

  return (
    <div className="py-12 space-y-10 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2"><LayoutDashboard className="text-orange-500" /><span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Control Center</span></div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Admin Dashboard</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={toggleShopStatus} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all ${isShopOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{isShopOpen ? <CheckCircle size={16}/> : <X size={16}/>} {isShopOpen ? 'Store Open' : 'Store Closed'}</button>
            <button onClick={() => setEditingProduct({ name: '', price: '', category: 'Essentials', unit: '1 kg', discount_percent: 0 })} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all shadow-sm"><Plus size={18}/> Add Product</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Active Orders */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-xl flex items-center gap-2"><Truck size={20} className="text-orange-600"/> Live Orders</h3>
            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Real-time</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50/50 border-b border-slate-100">
                <tr><th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Items</th><th className="px-6 py-4">Total</th><th className="px-6 py-4 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><p className="font-bold text-slate-900 text-xs">#{order.id.slice(0,6).toUpperCase()}</p><p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p></td>
                    <td className="px-6 py-4"><p className="font-bold text-slate-800 text-xs">{order.customer_name}</p><p className="text-[10px] text-slate-400">{order.customer_phone}</p></td>
                    <td className="px-6 py-4"><p className="text-[10px] text-slate-500 font-medium line-clamp-1 w-32">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p><span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded mt-1 inline-block ${order.order_type === 'delivery' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{order.order_type}</span></td>
                    <td className="px-6 py-4 font-black text-slate-900 text-sm">₹{order.total_amount}</td>
                    <td className="px-6 py-4 text-right">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer uppercase tracking-wider transition-all shadow-sm ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No Active Orders</div>}
          </div>
        </div>

        {/* Product Editor & Inventory */}
        <div className="space-y-6">
          {editingProduct && (
            <div className="bg-white p-8 rounded-[2rem] border border-orange-200 shadow-xl relative animate-in slide-in-from-right">
              <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><X size={20}/></button>
              <h3 className="font-bold text-lg mb-6">{editingProduct.id ? 'Edit Item' : 'New Item'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <input name="name" defaultValue={editingProduct.name} placeholder="Product Name" required className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" />
                <div className="grid grid-cols-2 gap-3"><input name="price" defaultValue={editingProduct.price} type="number" step="0.01" placeholder="Price" required className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" /><input name="discount" defaultValue={editingProduct.discount_percent} type="number" placeholder="Disc %" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" /></div>
                <div className="grid grid-cols-2 gap-3"><select name="category" defaultValue={editingProduct.category || 'Essentials'} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200">{CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select><input name="unit" defaultValue={editingProduct.unit} placeholder="Unit (e.g. 1 kg)" required className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" /></div>
                <input name="image" defaultValue={editingProduct.image} placeholder="Image URL" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" />
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md"><Save size={16}/> Save to Database</button>
              </form>
            </div>
          )}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg no-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Inventory ({products.length})</h4>
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-white shadow-sm" alt="Asset" onError={(e) => e.target.src='[https://placehold.co/100](https://placehold.co/100)'} /><div className="pr-2"><p className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">₹{p.price}</p></div></div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingProduct(p)} className="p-2 bg-white text-orange-600 rounded-lg shadow-sm border border-slate-100"><Edit size={12}/></button>
                    <button onClick={async () => { if(confirm("Delete this product?")) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="p-2 bg-white text-red-500 rounded-lg shadow-sm border border-slate-100"><Trash2 size={12}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
