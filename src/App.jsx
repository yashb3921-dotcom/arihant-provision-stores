import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Plus, Minus, X, Store, User, LogOut, 
  LayoutDashboard, Clock, ArrowLeft, Edit, Save, Eye, EyeOff,
  ChevronRight, CheckCircle, AlertCircle, Loader, Truck, ShoppingBasket,
  Smartphone, Printer, KeyRound, Tag, Sparkles, Trash2
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SUPABASE_URL = "https://fcszshzymowhebrtrltl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjc3pzaHp5bW93aGVicnRybHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjI4MjMsImV4cCI6MjA4NjI5ODgyM30._-xnb38vx7Z5gAZeQSy-SRoU7RYGXRStT9Bi1nttzu4";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORE_INFO = {
  name: "Arihant Provision Stores",
  phone: "9881469046",
  address: "Behind K.K. Hospital, Markal Road, Alandi Devachi, Pune",
  logo: "https://i.postimg.cc/8cJbrYQc/Screenshot_2026_02_16_202002.png"
};

const CATEGORIES = ["All", "Grains", "Spices", "Pulses", "Dairy", "Essentials", "Snacks"];
const ORDER_STATUSES = ["Pending", "Accepted", "Packed", "Out for Delivery", "Ready for Pickup", "Completed", "Cancelled"];
const ADMIN_EMAIL = 'bhandari.devichand9@gmail.com';

const calculateDiscount = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.floor(price - (price * (discountPercent / 100)));
};

// --- MAIN APP ---
const App = () => {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);
  
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [authForm, setAuthForm] = useState({ identifier: '', password: '', name: '', isSignup: false });
  const [showPassword, setShowPassword] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // --- INITIALIZATION & REALTIME ---
  useEffect(() => {
    // Inject Custom Font
    if (!document.getElementById('font-outfit')) {
      const link = document.createElement('link');
      link.id = 'font-outfit';
      link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Check Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if(session?.user) {
         fetchOrders(session.user);
         setView(session.user.email === ADMIN_EMAIL ? 'admin' : 'shop');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Fetch Initial Data
    fetchProducts();
    fetchStatus();

    // Supabase Realtime Channels
    const channel = supabase.channel('public-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchStatus)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
         if (user) fetchOrders(user);
      })
      .subscribe();

    return () => {
      subscription?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Re-bind realtime when user changes

  // --- DATA FETCHERS ---
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) setProducts(data);
  };

  const fetchStatus = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'shop_status').single();
    if (data) setIsShopOpen(data.value?.isOpen ?? true);
  };

  const fetchOrders = async (currentUser) => {
    if (!currentUser) return;
    if (currentUser.email === ADMIN_EMAIL) {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
    }
    const { data: userData } = await supabase.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
    if (userData) setMyOrders(userData);
  };

  // --- ACTIONS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const cleanPhone = authForm.identifier.trim();
    let emailToUse = cleanPhone;
    const isPhone = /^\d{10}$/.test(cleanPhone);
    
    if (isPhone) emailToUse = `${cleanPhone}@arihant.com`;
    else if (!cleanPhone.includes('@')) {
       alert("Please enter a valid 10-digit mobile number or admin email.");
       setLoading(false); return;
    }

    try {
      if (authForm.isSignup) {
        const { error } = await supabase.auth.signUp({ 
          email: emailToUse, 
          password: authForm.password,
          options: { data: { full_name: authForm.name, phone_display: isPhone ? cleanPhone : '' } }
        });
        if (error) throw error;
        alert("Registration successful! Please log in.");
        setAuthForm(prev => ({ ...prev, isSignup: false }));
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password: authForm.password });
        if (error) throw error;
        if (data.user.email === ADMIN_EMAIL) {
            fetchOrders(data.user);
            setView('admin');
        } else {
            fetchOrders(data.user);
            setView('shop');
        }
      }
    } catch (err) {
      alert(err.message === 'Invalid login credentials' ? 'Incorrect Number or Password.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null); setCart([]); setOrders([]); setMyOrders([]);
    setView('landing');
    setLoading(false);
  };

  const updateCartQuantity = (product, delta) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) return prev.filter(item => item.id !== product.id);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) return [...prev, { ...product, quantity: 1 }];
      return prev;
    });
  };

  const handlePlaceOrder = async (details, type) => {
    if (!user) return alert("Please login first.");
    setLoading(true);
    const orderData = {
      customer_name: details.name, customer_phone: details.phone, address: details.address,
      items: cart, total_amount: cartTotal, order_type: type, status: 'Pending', user_id: user.id
    };
    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (error) alert("Error: " + error.message);
    else { setLastOrder(data); setCart([]); setIsCartOpen(false); setView('success'); fetchOrders(user); }
    setLoading(false);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (user?.email !== ADMIN_EMAIL) return;
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'), price: parseFloat(formData.get('price')), discount_percent: parseInt(formData.get('discount') || 0),
      category: formData.get('category'), unit: formData.get('unit'), image: formData.get('image') || 'https://placehold.co/400?text=Product'
    };
    const { error } = editingProduct?.id ? await supabase.from('products').update(data).eq('id', editingProduct.id) : await supabase.from('products').insert([data]);
    if (error) alert(error.message); else { setEditingProduct(null); fetchProducts(); }
  };

  // --- COMPUTED ---
  const cartTotal = cart.reduce((sum, item) => sum + (calculateDiscount(item.price, item.discount_percent) * item.quantity), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === "All" || p.category === selectedCategory));
  const isAdmin = user?.email === ADMIN_EMAIL;

  if (loading && view === 'landing') return <div className="h-screen flex items-center justify-center text-orange-600 font-bold bg-slate-50"><Loader className="animate-spin mr-2"/> Loading Store...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* GLOBAL NAVBAR */}
      {view !== 'landing' && view !== 'auth' && (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('landing')}>
              <img src={STORE_INFO.logo} alt="Logo" className="h-10 w-auto bg-white p-2 rounded-xl shadow-sm border border-slate-100" />
              <div className="hidden sm:block">
                <h1 className="font-extrabold text-2xl tracking-tight leading-none">Arihant</h1>
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-[0.2em] mt-1">Provision Store</p>
              </div>
            </div>
            {view === 'shop' && (
              <div className="flex-1 max-w-md mx-8 hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search..." className="w-full bg-slate-100/70 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-orange-200 outline-none text-sm font-semibold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              {user ? (
                <button onClick={() => setView(isAdmin ? 'admin' : 'profile')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm ${isAdmin ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}>
                  {isAdmin ? <LayoutDashboard size={18} /> : <User size={18} />} <span className="hidden sm:block">{isAdmin ? 'Admin' : 'Profile'}</span>
                </button>
              ) : (
                <button onClick={() => setView('auth')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600">Login</button>
              )}
              <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white border border-slate-200 rounded-xl hover:text-orange-600">
                <ShoppingBag size={20} />
                {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-bounce">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* MAIN VIEWS */}
      <main className="max-w-7xl mx-auto px-6">
        
        {view === 'landing' && (
          <div className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-center gap-16 py-12">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-700 z-10">
              <span className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full text-orange-700 text-xs font-bold uppercase tracking-wider"><Sparkles size={12}/> Premium Quality</span>
              <h2 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight">Daily <br/><span className="text-orange-600">Essentials.</span></h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">Your trusted neighborhood store for authentic spices, fresh grains, and household needs.</p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button onClick={() => setView('shop')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 flex gap-2">Shop Now <ChevronRight/></button>
                <button onClick={() => setView('auth')} className="bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg">Sign In</button>
              </div>
            </div>
            <div className="flex-1 hidden lg:flex justify-center items-center">
              <img src={STORE_INFO.logo} className="w-[350px] drop-shadow-2xl hover:scale-105 transition-transform" alt="Store Hero" />
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className="max-w-md mx-auto py-24 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
              <h2 className="text-3xl font-black mb-2">{authForm.isSignup ? 'Join Arihant' : 'Welcome Back'}</h2>
              <p className="text-slate-400 mb-8 font-medium">Enter your details to continue.</p>
              <form onSubmit={handleAuth} className="space-y-4">
                {authForm.isSignup && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <div className="relative mt-1"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input type="text" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-200" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} /></div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                  <div className="relative mt-1"><Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input type="text" placeholder="9876543210" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-200" value={authForm.identifier} onChange={e => setAuthForm({...authForm, identifier: e.target.value})} /></div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                  <div className="relative mt-1">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                    <input type={showPassword ? "text" : "password"} required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-200" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 flex justify-center mt-4">
                  {loading ? <Loader className="animate-spin" /> : (authForm.isSignup ? 'Create Account' : 'Secure Login')}
                </button>
              </form>
              <button onClick={() => setAuthForm(p => ({...p, isSignup: !p.isSignup}))} className="w-full mt-6 text-sm font-bold text-slate-500 hover:text-orange-600">{authForm.isSignup ? 'Already have an account? Login' : "New customer? Register now"}</button>
            </div>
          </div>
        )}

        {view === 'shop' && (
          <div className="py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">Our <span className="text-orange-600">Collection</span></h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${isShopOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div> {isShopOpen ? 'Live Store Open' : 'Store Closed'}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-xl text-xs font-bold border ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500'}`}>{cat}</button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredProducts.map(product => {
                const cartItem = cart.find(c => c.id === product.id);
                const price = calculateDiscount(product.price, product.discount_percent);
                const hasDisc = product.discount_percent > 0;
                return (
                  <div key={product.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all flex flex-col relative">
                    {hasDisc && <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded shadow-sm"><Tag size={10} className="inline mr-1"/>{product.discount_percent}% OFF</div>}
                    <div className="relative aspect-square bg-slate-50 overflow-hidden"><img src={product.image} className="w-full h-full object-cover" onError={(e)=>e.target.src='https://placehold.co/400?text=Item'} /><span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-bold uppercase">{product.unit}</span></div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="font-bold text-sm leading-snug mb-3 line-clamp-2 h-10">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-4 mt-auto">
                        <span className="text-xl font-black">₹{price}</span>
                        {hasDisc && <span className="text-xs text-slate-400 line-through">₹{product.price}</span>}
                      </div>
                      {cartItem ? (
                        <div className="flex justify-between items-center bg-orange-50 rounded-xl p-1">
                          <button onClick={() => updateCartQuantity(product, -1)} className="w-8 h-8 flex justify-center items-center bg-white rounded-lg text-orange-600"><Minus size={14}/></button>
                          <span className="font-black text-orange-700">{cartItem.quantity}</span>
                          <button onClick={() => updateCartQuantity(product, 1)} className="w-8 h-8 flex justify-center items-center bg-white rounded-lg text-orange-600"><Plus size={14}/></button>
                        </div>
                      ) : (
                        <button disabled={!isShopOpen} onClick={() => updateCartQuantity(product, 1)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase hover:bg-orange-600 disabled:bg-slate-300">Add To Bag</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="py-12 space-y-8 animate-in fade-in">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex justify-between items-center">
              <div><h2 className="text-3xl font-black">Admin Dashboard</h2></div>
              <div className="flex gap-4">
                <button onClick={toggleShopStatus} className={`px-5 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}>{isShopOpen ? 'Store Open' : 'Store Closed'}</button>
                <button onClick={() => setEditingProduct({ name: '', price: '', category: 'Essentials', unit: '1 kg', discount_percent: 0 })} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm flex gap-2"><Plus size={18}/> Add Product</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Tabular Orders */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-xl flex items-center gap-2"><Truck className="text-orange-600"/> Live Orders</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4 text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td className="p-4"><p className="font-bold text-xs">#{o.id.slice(0,6).toUpperCase()}</p><p className="text-[10px] text-slate-400">{new Date(o.created_at).toLocaleDateString()}</p></td>
                          <td className="p-4"><p className="font-bold text-xs">{o.customer_name}</p><p className="text-[10px] text-slate-400">{o.customer_phone}</p></td>
                          <td className="p-4"><p className="text-[10px] text-slate-500 line-clamp-1 w-32">{o.items.map(i=>`${i.name}x${i.quantity}`).join(', ')}</p><span className="text-[9px] font-bold uppercase bg-blue-50 text-blue-600 px-2 rounded">{o.order_type}</span></td>
                          <td className="p-4 font-black text-sm">₹{o.total_amount}</td>
                          <td className="p-4 text-right"><select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className="text-[9px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 outline-none">{ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Editor */}
              <div className="space-y-6">
                {editingProduct && (
                  <div className="bg-white p-6 rounded-[2rem] border border-orange-200 shadow-lg relative">
                    <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-slate-400"><X size={20}/></button>
                    <h3 className="font-bold text-lg mb-4">{editingProduct.id ? 'Edit Item' : 'New Item'}</h3>
                    <form onSubmit={handleSaveProduct} className="space-y-3">
                      <input name="name" defaultValue={editingProduct.name} placeholder="Product Name" required className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" />
                      <div className="flex gap-3"><input name="price" defaultValue={editingProduct.price} type="number" placeholder="Price" required className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" /><input name="discount" defaultValue={editingProduct.discount_percent} type="number" placeholder="Disc %" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" /></div>
                      <div className="flex gap-3"><select name="category" defaultValue={editingProduct.category} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select><input name="unit" defaultValue={editingProduct.unit} placeholder="Unit (1 kg)" required className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" /></div>
                      <input name="image" defaultValue={editingProduct.image} placeholder="Image URL" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" />
                      <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm">Save Product</button>
                    </form>
                  </div>
                )}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm max-h-[500px] overflow-y-auto no-scrollbar">
                  <h4 className="font-bold text-xs uppercase mb-4">Inventory</h4>
                  {products.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl group">
                      <div className="flex gap-3 items-center"><img src={p.image} className="w-10 h-10 rounded-lg object-cover" onError={(e)=>e.target.src='https://placehold.co/100'}/><div><p className="text-xs font-bold line-clamp-1">{p.name}</p><p className="text-[9px] font-bold text-slate-400">₹{p.price}</p></div></div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100"><button onClick={()=>setEditingProduct(p)} className="text-orange-500"><Edit size={14}/></button><button onClick={async ()=>{if(confirm('Delete?')){await supabase.from('products').delete().eq('id', p.id); fetchProducts();}}} className="text-red-500"><Trash2 size={14}/></button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'profile' && user && (
          <div className="max-w-2xl mx-auto py-12 animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-black">{user.user_metadata?.full_name?.[0] || 'U'}</div>
                <div><h3 className="font-bold text-xl">{user.user_metadata?.full_name || 'Customer'}</h3><p className="text-slate-500 text-sm">{user.email}</p></div>
              </div>
              <button onClick={handleLogout} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold flex gap-2"><LogOut size={18}/> Logout</button>
            </div>
            <h3 className="font-bold text-lg mb-4">Order History</h3>
            <div className="space-y-4">
              {myOrders.map(o => (
                <div key={o.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between mb-2"><span className="font-bold text-lg">₹{o.total_amount}</span><span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-3 py-1 rounded-full">{o.status}</span></div>
                  <p className="text-xs text-slate-500">{o.items.map(i=>`${i.name} (${i.quantity})`).join(', ')}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase">{new Date(o.created_at).toLocaleDateString()} • {o.order_type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'success' && lastOrder && (
          <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in">
            <CheckCircle size={64} className="text-green-500 mb-6 animate-bounce" />
            <h2 className="text-4xl font-black mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 mb-8">Order ID: #{lastOrder.id.slice(0,6).toUpperCase()}</p>
            <button onClick={() => setView('shop')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600">Continue Shopping</button>
          </div>
        )}

      </main>

      {/* CART SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h2 className="text-2xl font-black flex gap-2"><ShoppingBag className="text-orange-600"/> My Bag</h2><button onClick={()=>setIsCartOpen(false)}><X/></button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between"><h4 className="font-bold text-sm">{item.name}</h4><span className="font-black text-orange-600">₹{calculateDiscount(item.price, item.discount_percent) * item.quantity}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase">{item.unit}</span>
                      <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                        <button onClick={()=>updateCartQuantity(item,-1)} className="px-2 text-slate-400 hover:text-orange-600"><Minus size={14}/></button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={()=>updateCartQuantity(item,1)} className="px-2 text-slate-400 hover:text-orange-600"><Plus size={14}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between font-black text-2xl mb-6"><span>Total</span><span>₹{cartTotal}</span></div>
                <button onClick={()=>{
                  const n = prompt("Name:"); const p = prompt("Phone:"); const a = prompt("Address (or PICKUP):");
                  if(n&&p) handlePlaceOrder({name:n, phone:p, address:a}, a?.toUpperCase()==='PICKUP'?'takeaway':'delivery');
                }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-orange-600">Place Order <ChevronRight/></button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
