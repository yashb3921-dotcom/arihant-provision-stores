import React, { useState } from 'react';
import { User, Smartphone, KeyRound, Eye, EyeOff, Loader } from 'lucide-react';
import { useNavigation } from '../contexts/StoreContext';
import { supabase, ADMIN_EMAIL } from '../config/supabase';

const AuthPage = () => {
  const { setView } = useNavigation();
  const [form, setForm] = useState({ identifier: '', password: '', name: '', isSignup: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let emailToUse = form.identifier.trim();
    const isPhone = /^\d{10}$/.test(emailToUse);
    if (isPhone) emailToUse = `${emailToUse}@arihant.com`;
    else if (!emailToUse.includes('@')) {
       alert("Please enter a valid 10-digit mobile number.");
       setLoading(false); return;
    }

    try {
      if (form.isSignup) {
        const { error } = await supabase.auth.signUp({ email: emailToUse, password: form.password, options: { data: { full_name: form.name, phone_display: isPhone ? form.identifier : '' } } });
        if (error) throw error;
        alert("Registration successful! Please log in.");
        setForm(prev => ({ ...prev, isSignup: false }));
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password: form.password });
        if (error) throw error;
        if (data.user.email === ADMIN_EMAIL) setView('admin'); else setView('shop');
      }
    } catch (err) {
      alert(err.message === 'Invalid login credentials' ? 'Incorrect Number or Password.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-full -mr-20 -mt-20 blur-2xl opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">{form.isSignup ? 'Join Arihant' : 'Welcome Back'}</h2>
          <p className="text-slate-400 mb-8 font-medium">Please enter your details to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {form.isSignup && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">Full Name</label>
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="e.g. Rahul Sharma" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-orange-200 outline-none transition-all font-bold text-slate-800" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">Mobile Number</label>
              <div className="relative"><Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="e.g. 9876543210" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-orange-200 outline-none transition-all font-bold text-slate-800" value={form.identifier} onChange={e => setForm({...form, identifier: e.target.value})} /></div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">Password</label>
              <div className="relative"><KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full p-4 pl-12 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-orange-200 outline-none transition-all font-bold text-slate-800" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-orange-600 transition-all active:scale-95 mt-2 flex justify-center">{loading ? <Loader className="animate-spin" /> : (form.isSignup ? 'Create Account' : 'Secure Login')}</button>
          </form>
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button onClick={() => { setForm({ identifier: '', password: '', name: '', isSignup: !form.isSignup }); setShowPassword(false); }} className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">{form.isSignup ? 'Already have an account? Login' : "New customer? Register now"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
