import React, { useState } from 'react';
import { SellerProfile } from '../types';
import { CATEGORIES, PACKAGES } from '../constants';
import { ImagePlus, X, MapPin, Tag, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { uploadImage } from '../services/imgbbService';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface PostAdProps {
  user: SellerProfile;
  onNavigateTo: (page: any) => void;
}

export const PostAd: React.FC<PostAdProps> = ({ user, onNavigateTo }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    condition: 'used',
    location: '',
    description: ''
  });

  const isPackageValid = user.package_type && user.package_type !== 'none';
  const hasExpired = user.package_expiry && new Date(user.package_expiry) < new Date();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }
      setImages(prev => [...prev, ...files]);
      
      const newUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPackageValid || hasExpired) {
      toast.error('Please upgrade your package to post ads');
      onNavigateTo('pricing');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload images to ImgBB
      const uploadedUrls = await Promise.all(images.map(img => uploadImage(img)));
      
      // 2. Save ad to Supabase
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const { error } = await supabase.from('ads').insert({
        seller_id: user.id,
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        images: uploadedUrls,
        whatsapp_contact: user.whatsapp_number,
        expiry_date: expiryDate.toISOString()
      });

      if (error) throw error;

      toast.success('Ad published successfully!');
      onNavigateTo('dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to post ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isPackageValid || hasExpired) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Package Required</h2>
        <p className="text-gray-500">You need an active package to start posting ads on MarketMaster.</p>
        <Button size="lg" onClick={() => onNavigateTo('pricing')}>
          View Pricing Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Create New Listing</h1>
        <p className="text-gray-500">Provide accurate details to attract more buyers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ImagePlus size={20} className="text-indigo-600" />
            Product Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {previewUrls.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all text-gray-400 hover:text-indigo-600">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                <ImagePlus size={32} strokeWidth={1.5} />
                <span className="text-xs font-bold mt-2">Add Photo</span>
              </label>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-400 italic">
            You can upload up to 5 images. First image will be the cover.
          </p>
        </section>

        {/* Basic Information */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info size={20} className="text-indigo-600" />
              General Details
            </h2>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Title</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. iPhone 15 Pro Max 256GB"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (LKR)</label>
            <input 
              required
              type="number" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 150000"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
            <div className="flex gap-4">
              {['New', 'Used'].map(cond => (
                <label key={cond} className="flex-grow flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                  <input 
                    type="radio" 
                    name="condition" 
                    className="hidden" 
                    value={cond.toLowerCase()} 
                    checked={formData.condition === cond.toLowerCase()}
                    onChange={e => setFormData({...formData, condition: e.target.value})}
                  />
                  <span className="text-sm font-medium">{cond}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input 
                required
                type="text" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                placeholder="City, District"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description</label>
            <textarea 
              required
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your item in detail (features, flaws, reason for selling)..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </section>

        <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
          <div className="flex items-center gap-3 text-indigo-700">
            <CheckCircle2 size={24} />
            <div className="text-sm">
              <p className="font-bold">Ready to go?</p>
              <p className="opacity-80">This ad will be visible to everyone instantly.</p>
            </div>
          </div>
          <Button 
            type="submit" 
            size="lg" 
            isLoading={loading}
            className="px-12 shadow-indigo-200 shadow-xl"
          >
            Publish Ad
          </Button>
        </div>
      </form>
    </div>
  );
};