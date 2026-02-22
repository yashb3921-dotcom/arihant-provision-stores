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
    
    // Logic: If it's 10 digits, log them in as a regular user via mocked email.
    // If they type an email (like the admin email), let it pass through to Supabase.
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
      
      {/* Aesthetic Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-orange-200/40 to-rose-200/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass p-10 sm:p-12 rounded-[3rem]">
          
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-orange-500/30">
            <Shield size={32} />
          </div>

          <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">{form.isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-500 mb-8 font-medium">{form.isSignup ? 'Sign up to start shopping.' : 'Enter your details to access your account.'}</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {form.isSignup && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input type="text" placeholder="e.g. Rahul Sharma" required className="w-full p-4 pl-12 bg-white/50 border border-slate-200 rounded-2xl font-semibold outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Mobile Number or Admin Email</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input type="text" placeholder="e.g. 9876543210" required className="w-full p-4 pl-12 bg-white/50 border border-slate-200 rounded-2xl font-semibold outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" value={form.identifier} onChange={e => setForm({...form, identifier: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full p-4 pl-12 pr-12 bg-white/50 border border-slate-200 rounded-2xl font-semibold outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button disabled={loading} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4.5 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-amber-500 shadow-xl hover:shadow-orange-500/30 transition-all duration-300 active:scale-[0.98] mt-4 flex justify-center items-center">
                {loading ? <Loader className="animate-spin" /> : (form.isSignup ? 'Create Account' : 'Secure Login')}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-200/60 text-center">
            <button onClick={() => { setForm({ identifier: '', password: '', name: '', isSignup: !form.isSignup }); setShowPassword(false); }} className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">
                {form.isSignup ? 'Already have an account? Log in here' : "Don't have an account? Register now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
