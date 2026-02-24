import React, { useState } from 'react';
import { ArrowLeft, MapPin, Store, Truck, ChevronRight, Loader, Info, User, Smartphone } from 'lucide-react';
import { useCart, useAuth, useNavigation } from '../contexts/StoreContext';
import { STORE_INFO } from '../config/supabase';

const CheckoutPage = () => {
  const { cart, cartTotal, placeOrder } = useCart();
  const { user } = useAuth();
  const { setView } = useNavigation();
  
  const [type, setType] = useState('delivery'); 
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone_display || '',
    address: ''
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (type === 'delivery' && !form.address.trim()) return alert("Please enter your delivery address.");
    
    setLoading(true);
    const finalAddress = type === 'takeaway' ? 'In-Store Pickup' : form.address;
    
    const { error } = await placeOrder({ name: form.name, phone: form.phone, address: finalAddress }, type);
    if (error) {
        alert(error.message);
        setLoading(false);
    }
  };

  if (cart.length === 0) {
      setView('shop');
      return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 lg:py-12 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8 px-2">
          <button onClick={() => setView('shop')} className="p-4 bg-white border-2 border-slate-200 rounded-full hover:border-orange-500 hover:text-orange-600 shadow-sm active:scale-95 transition-all"><ArrowLeft size={24}/></button>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h2>
      </div>

      <div className="glass p-6 sm:p-10 rounded-[3rem] border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        
        <div className="flex bg-slate-100 p-2 rounded-full mb-8 shadow-inner">
            <button type="button" onClick={() => setType('delivery')} className={`flex-1 py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 ${type === 'delivery' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                <Truck size={22}/> Delivery
            </button>
            <button type="button" onClick={() => setType('takeaway')} className={`flex-1 py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 ${type === 'takeaway' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                <Store size={22}/> Takeaway
            </button>
        </div>

        {type === 'delivery' && (
            <div className="bg-orange-50 border border-orange-200 p-5 rounded-3xl mb-8 flex items-start gap-4">
                <Info className="text-orange-500 shrink-0 mt-0.5" size={24}/>
                <div>
                    <p className="font-black text-orange-800 text-lg">Delivery Information</p>
                    <p className="text-orange-700/80 font-semibold mt-1">Delivery charges may vary depending on distance. Our executive will contact you.</p>
                </div>
            </div>
        )}

        {type === 'takeaway' && (
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl mb-8 flex items-start gap-4">
                <Store className="text-blue-500 shrink-0 mt-0.5" size={24}/>
                <div>
                    <p className="font-black text-blue-800 text-lg">Store Address</p>
                    <p className="text-blue-700/80 font-semibold mt-1">{STORE_INFO.address}</p>
                    <p className="text-blue-700 font-black mt-2 bg-blue-100/50 inline-block px-3 py-1 rounded-xl">Owner Phone: {STORE_INFO.phone}</p>
                </div>
            </div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 ml-2 uppercase tracking-widest">Contact Name</label>
                <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input required type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-5 pl-14 bg-white/90 border-2 border-slate-200 rounded-2xl text-lg font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-sm" />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 ml-2 uppercase tracking-widest">Phone Number</label>
                <div className="relative group">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input required type="tel" placeholder="Your Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-5 pl-14 bg-white/90 border-2 border-slate-200 rounded-2xl text-lg font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-sm" />
                </div>
            </div>

            {type === 'delivery' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-xs font-black text-slate-500 ml-2 uppercase tracking-widest">Complete Delivery Address</label>
                  <div className="relative group">
                      <MapPin className="absolute left-5 top-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                      <textarea required placeholder="Full Address with Landmark" value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows="3" className="w-full p-5 pl-14 bg-white/90 border-2 border-slate-200 rounded-2xl text-lg font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all shadow-sm resize-none"></textarea>
                  </div>
                </div>
            )}

            <div className="pt-8 mt-8 border-t-2 border-slate-100 flex items-center justify-between mb-8">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total to Pay</span>
                <span className="text-5xl font-black text-slate-900 tracking-tight">₹{cartTotal}</span>
            </div>

            <button disabled={loading} className="w-full min-h-[72px] bg-gradient-to-r from-orange-500 to-amber-500 text-white py-5 rounded-full font-extrabold text-2xl hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 border border-orange-400">
                {loading ? <Loader className="animate-spin" size={28} /> : <>Confirm Order <ChevronRight size={28} /></>}
            </button>
        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
