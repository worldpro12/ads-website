import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, Phone, Globe, MapPin, CheckCircle2, ChevronLeft } from 'lucide-react';
import { UserRole } from '../types';
import { toast } from 'react-hot-toast';

interface RegisterProps {
  onNavigateTo: (page: any) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigateTo }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('buyer');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    whatsapp: '',
    country: '',
    address: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Sign up user in Auth
      // The keys in options.data must match the SQL trigger: NEW.raw_user_meta_data->>'key'
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: role,
            full_name: formData.fullName,
            whatsapp_number: formData.whatsapp,
            username: formData.username
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        // Step 2: Update the record created by the Trigger to ensure all fields are synchronized
        // We use 'update' because the Trigger (AFTER INSERT) has already created the row.
        const { error: dbError } = await supabase
          .from('users')
          .update({
            role: role,
            full_name: formData.fullName,
            whatsapp_number: role === 'seller' ? formData.whatsapp : null,
            country: role === 'seller' ? formData.country : null,
            address: role === 'seller' ? formData.address : null,
            username: role === 'seller' ? formData.username : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (dbError) {
          console.error('Database sync error:', dbError);
          toast.error('Account created, but profile update failed. Please update it in settings later.');
        } else {
          toast.success('Registration successful! Please check your email for verification.');
        }
        
        onNavigateTo('login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Join MarketMaster</h1>
          <p className="text-gray-500">The most secure classified ads marketplace.</p>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-xl font-bold text-gray-900 text-center">Tell us your goal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 group relative overflow-hidden ${role === 'buyer' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}`}
              >
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${role === 'buyer' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                  <User size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">I'm a Buyer</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">I want to find deals and contact sellers securely via WhatsApp.</p>
                {role === 'buyer' && <div className="absolute top-4 right-4 text-indigo-600"><CheckCircle2 size={20} /></div>}
              </button>
              <button 
                type="button"
                onClick={() => setRole('seller')}
                className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 group relative overflow-hidden ${role === 'seller' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}`}
              >
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${role === 'seller' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                  <Globe size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">I'm a Seller</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">I want to list items, manage ads, and track my business growth.</p>
                {role === 'seller' && <div className="absolute top-4 right-4 text-indigo-600"><CheckCircle2 size={20} /></div>}
              </button>
            </div>
            <Button type="button" className="w-full py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-100" onClick={() => setStep(2)}>
              Continue to Registration
            </Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input required type="email" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input required type="password" minLength={6} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Min 6 characters" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              {role === 'seller' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <input required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="+94 77 123 4567" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Username</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <input required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="john_store" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <input required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Sri Lanka" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
                      <input required className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Street, City" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-grow py-3.5 rounded-2xl" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-2" size={18} /> Back
              </Button>
              <Button type="submit" className="flex-[2] py-3.5 rounded-2xl shadow-xl shadow-indigo-100 font-bold" isLoading={loading}>
                Complete Registration
              </Button>
            </div>
            
            <p className="text-center text-xs text-gray-400 pt-2">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};