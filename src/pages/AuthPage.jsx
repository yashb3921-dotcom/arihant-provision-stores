import React, { useState } from 'react';
import { User, Smartphone, KeyRound, Eye, EyeOff, Loader, Shield } from 'lucide-react';
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
    
    if (isPhone) {
        emailToUse = `${emailToUse}@arihant.com`;
    } else if (!emailToUse.includes('@')) {
       alert("Please enter a valid 10-digit mobile number, or your Admin Email.");
       setLoading(false); return;
    }

    try {
      if (form.isSignup) {
        const { error } = await supabase.auth.signUp({ 
            email: emailToUse, 
            password: form.password, 
            options: { data: { full_name: form.name, phone_display: isPhone ? form.identifier : '' } } 
        });
        if (error) throw error;
        alert("Registration successful! You can now log in.");
        setForm(prev => ({ ...prev, isSignup: false }));
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password: form.password });
        if (error) throw error;
        if (data.user.email === ADMIN_EMAIL) setView('admin'); else setView('shop');
      }
    } catch (err) {
      alert(err.message === 'Invalid login credentials' ? 'Incorrect Number/Email or Password. (Did you register an account first?)' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-orange-200/60 to-rose-200/60 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass p-8 sm:p-12 rounded-[3rem] border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-orange-500/40 border border-orange-300">
            <Shield size={36} strokeWidth={2.5} />
          </div>

          <h2 className="text-4xl font-black mb-3 text-slate-900 tracking-tight">{form.isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-500 mb-10 font-semibold text-lg">{form.isSignup ? 'Sign up to start shopping.' : 'Enter your details to access your account.'}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.isSignup && (
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 ml-2 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input type="text" placeholder="e.g. Rahul Sharma" required className="w-full py-5 pl-14 bg-white/90 border-2 border-slate-200 rounded-2xl text-base font-bold outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-slate-400 shadow-inner" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 ml-2 uppercase tracking-widest">Mobile Number or Admin Email</label>
              <div className="relative group">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input type="text" placeholder="e.g. 9876543210" required className="w-full py-5 pl-14 bg-white/90 border-2 border-slate-200 rounded-2xl text-base font-bold outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-slate-400 shadow-inner" value={form.identifier} onChange={e => setForm({...form, identifier: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 ml-2 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full py-5 pl-14 pr-14 bg-white/90 border-2 border-slate-200 rounded-2xl text-base font-bold outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-slate-400 shadow-inner" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition-colors p-1">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button disabled={loading} className="w-full min-h-[64px] bg-gradient-to-r from-orange-500 to-amber-500 text-white py-5 rounded-full font-extrabold text-xl hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] mt-8 flex justify-center items-center border border-orange-400">
                {loading ? <Loader className="animate-spin" size={28} /> : (form.isSignup ? 'Create Account' : 'Secure Login')}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t-2 border-slate-200/60 text-center">
            <button onClick={() => { setForm({ identifier: '', password: '', name: '', isSignup: !form.isSignup }); setShowPassword(false); }} className="text-base font-bold text-slate-600 hover:text-orange-600 transition-colors p-2">
                {form.isSignup ? 'Already have an account? Log in here' : "Don't have an account? Register now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
