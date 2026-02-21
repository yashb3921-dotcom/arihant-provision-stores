import React, { useEffect } from 'react';
import { ArrowLeft, Clock, LogOut } from 'lucide-react';
import { useAuth, useNavigation, useCart } from '../contexts/StoreContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { setView } = useNavigation();
  const { myOrders } = useCart();

  useEffect(() => {
    if (!user) setView('auth');
  }, [user, setView]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4 mb-8"><button onClick={() => setView('shop')} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-orange-500 transition-colors"><ArrowLeft size={20}/></button><h2 className="text-3xl font-black text-slate-900">My Profile</h2></div>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-black">{user.user_metadata?.full_name?.[0]?.toUpperCase() || 'U'}</div>
          <div><h3 className="font-bold text-xl">{user.user_metadata?.full_name || 'Valued Customer'}</h3><p className="text-slate-500 text-sm font-medium">{user.email.includes('@arihant.com') ? user.email.split('@')[0] : user.email}</p></div>
          <button onClick={logout} className="ml-auto p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><LogOut size={20}/></button>
      </div>
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-700"><Clock size={18} /> Previous Orders</h3>
      <div className="space-y-4">
      {myOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div><span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-1 inline-block ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span><p className="font-black text-slate-900 text-lg">₹{order.total_amount}</p></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">#{order.id.slice(0,8).toUpperCase()}</p>
            </div>
            <div className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase"><span>{new Date(order.created_at).toLocaleDateString()}</span><span>{order.order_type}</span></div>
          </div>
      ))}
      {myOrders.length === 0 && <div className="p-12 text-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl">No orders yet. Time to go shopping!</div>}
      </div>
    </div>
  );
};

export default ProfilePage;
