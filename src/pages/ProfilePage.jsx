import React, { useEffect } from 'react';
import { ArrowLeft, Clock, LogOut, Package, MapPin, Smartphone } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto py-12 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('shop')} className="p-3 bg-white border border-slate-200 rounded-full hover:border-orange-500 hover:text-orange-600 shadow-sm hover:shadow-md transition-all active:scale-95 hover:-translate-y-0.5"><ArrowLeft size={20}/></button>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">My Profile</h2>
      </div>
      
      {/* Profile Card */}
      <div className="glass p-8 sm:p-10 rounded-[3rem] border border-white shadow-xl mb-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-20 -mt-20 blur-3xl opacity-60"></div>
          
          <div className="w-28 h-28 bg-gradient-to-tr from-orange-500 to-amber-400 text-white rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-lg shadow-orange-500/30 shrink-0">
              {user.user_metadata?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          
          <div className="text-center sm:text-left flex-1 relative z-10">
              <h3 className="font-black text-3xl text-slate-900 mb-1">{user.user_metadata?.full_name || 'Valued Customer'}</h3>
              <p className="text-slate-500 font-medium mb-4 flex items-center justify-center sm:justify-start gap-2">
                  <Smartphone size={16}/> {user.email.includes('@arihant.com') ? user.email.split('@')[0] : user.email}
              </p>
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200">
                  <Package size={14}/> {myOrders.length} Lifetime Orders
              </div>
          </div>
          
          <button onClick={logout} className="sm:ml-auto w-full sm:w-auto px-6 py-3.5 bg-red-50 text-red-600 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 z-10">
              <LogOut size={18}/> Sign Out
          </button>
      </div>

      {/* Orders List */}
      <h3 className="font-black text-2xl mb-6 flex items-center gap-3 text-slate-900"><Clock size={24} className="text-orange-500" /> Order History</h3>
      
      <div className="space-y-5">
      {myOrders.map(order => (
          <div key={order.id} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest mb-3 inline-block shadow-sm ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                    </span>
                    <p className="font-black text-slate-900 text-3xl tracking-tight">₹{order.total_amount}</p>
                </div>
                <div className="text-left sm:text-right bg-slate-50 p-3 rounded-2xl border border-slate-100 w-full sm:w-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-sm font-black text-slate-800">#{order.id.slice(0,8).toUpperCase()}</p>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100/50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Items</p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {order.items.map(i => `${i.name} (${i.quantity})`).join(' • ')}
                </p>
            </div>

            <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <MapPin size={14}/> {order.order_type.toUpperCase()}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(order.created_at).toLocaleString()}
                </span>
            </div>
          </div>
      ))}
      
      {myOrders.length === 0 && (
          <div className="p-16 text-center glass rounded-[2.5rem] border border-white">
              <Package size={64} className="mx-auto mb-4 text-slate-300"/>
              <p className="font-black text-2xl text-slate-400 mb-2">No orders yet</p>
              <p className="font-medium text-slate-500">Your order history will appear here once you make a purchase.</p>
          </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePage;
