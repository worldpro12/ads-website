
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Mail, Lock, LogIn, ChevronRight } from 'lucide-react';

interface LoginProps {
  onNavigateTo: (page: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateTo }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      onNavigateTo('home');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Log in to manage your ads and messages.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input 
                required
                type="email" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input 
                required
                type="password" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </button>

          <Button type="submit" className="w-full py-4 rounded-xl gap-2 shadow-indigo-100 shadow-xl" isLoading={loading}>
            <LogIn size={20} />
            Log In
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 uppercase font-bold tracking-widest text-xs">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Google Account
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account? 
          <button 
            onClick={() => onNavigateTo('register')}
            className="ml-2 font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 mx-auto mt-2"
          >
            Create an account <ChevronRight size={16} />
          </button>
        </p>
      </div>
    </div>
  );
};
