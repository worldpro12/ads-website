
import React, { useState, useEffect } from 'react';
import { UserProfile, SellerProfile } from '../types';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProfileProps {
  user: UserProfile | SellerProfile;
  onNavigateTo: (page: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onNavigateTo }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  
  const [formData, setFormData] = useState({
    fullName: user.full_name || '',
    whatsapp: (user as SellerProfile).whatsapp_number || '',
    address: (user as SellerProfile).address || '',
    country: (user as SellerProfile).country || '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update user profile record
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        full_name: formData.fullName,
        whatsapp_number: formData.whatsapp,
        address: formData.address,
        country: formData.country,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error: pwdError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });
        if (pwdError) throw pwdError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Quick Actions & Avatar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block group mb-6">
              <div className="w-32 h-32 rounded-3xl bg-indigo-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-indigo-600 font-bold text-4xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.full_name ? user.full_name[0] : 'U'
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                <Camera size={18} />
              </label>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{user.full_name || 'My Profile'}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.role === 'seller' ? 'Professional Seller' : 'Verified Buyer'}</p>
            
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 gap-2">
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-left">
                  <Mail size={16} className="text-indigo-600" />
                  <div className="truncate flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold text-gray-700 truncate">{user.email}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-left">
                  <ShieldCheck size={16} className="text-green-600" />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Status</p>
                    <p className="text-sm font-semibold text-gray-700">Active</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Need help?</h3>
              <p className="text-xs text-indigo-100 mb-4 opacity-80">Contact our priority support for any technical issues or billing queries.</p>
              <button className="text-sm font-bold bg-white text-indigo-900 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                Support Center
              </button>
            </div>
            <ShieldCheck size={120} className="absolute -bottom-8 -right-8 opacity-10" />
          </div>
        </div>

        {/* Right: Main Form */}
        <div className="w-full md:w-2/3">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                {user.role === 'seller' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                          value={formData.whatsapp}
                          onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                          value={formData.country}
                          onChange={e => setFormData({...formData, country: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-indigo-600" />
                Security Settings
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Leave blank to keep current"
                    value={formData.newPassword}
                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between">
              {success ? (
                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-100 animate-in fade-in slide-in-from-left duration-300">
                  <CheckCircle2 size={20} />
                  Profile updated successfully!
                </div>
              ) : (
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Changes take effect immediately
                </div>
              )}
              
              <Button 
                type="submit" 
                size="lg" 
                className="gap-2 px-8 rounded-2xl shadow-xl shadow-indigo-100"
                isLoading={loading}
              >
                <Save size={20} />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
