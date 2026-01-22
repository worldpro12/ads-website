
import React, { useState, useEffect } from 'react';
import { Ad } from '../types';
import { MapPin, Clock, Share2, Heart, MessageCircle, ChevronLeft, ChevronRight, User, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface AdDetailsProps {
  adId: string;
  onBack: () => void;
}

export const AdDetails: React.FC<AdDetailsProps> = ({ adId, onBack }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Mock fetch ad data
    setAd({
      id: adId,
      seller_id: 'seller-1',
      title: 'Premium Apple iPhone 15 Pro Max 256GB - Blue Titanium',
      description: 'Selling my iPhone 15 Pro Max in excellent condition. It comes with all original accessories and box. Used for only 2 months. Battery health is at 100%. No scratches or dents. Fully unlocked and ready for a new owner.\n\nIncluded in box:\n- iPhone 15 Pro Max\n- USB-C Charging Cable\n- Original Box and Documentation',
      category: 'Electronics',
      sub_category: 'Mobile Phones',
      price: 425000,
      condition: 'used',
      location: 'Bambalapitiya, Colombo 04',
      images: [
        'https://picsum.photos/seed/iphone1/800/600',
        'https://picsum.photos/seed/iphone2/800/600',
        'https://picsum.photos/seed/iphone3/800/600'
      ],
      whatsapp_contact: '+94771234567',
      created_at: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      views: 124,
      clicks: 45,
      whatsapp_clicks: 12,
      seller: {
        full_name: 'Dinesh Perera',
        avatar_url: 'https://picsum.photos/seed/dinesh/200/200',
        whatsapp_number: '+94771234567'
      }
    });
  }, [adId]);

  if (!ad) return null;

  const handleWhatsAppClick = () => {
    const message = `Hi, I want to buy this product: ${ad.title}. Link: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ad.whatsapp_contact.replace('+', '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
              <img 
                src={ad.images[activeImage]} 
                alt={ad.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? ad.images.length - 1 : prev - 1))}
                  className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center pointer-events-auto hover:bg-white transition-colors shadow-md"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === ad.images.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center pointer-events-auto hover:bg-white transition-colors shadow-md"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {ad.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === i ? 'border-indigo-600' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {ad.description}
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Condition</span>
                <span className="font-semibold text-gray-900 capitalize">{ad.condition}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Category</span>
                <span className="font-semibold text-gray-900">{ad.category}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Location</span>
                <span className="font-semibold text-gray-900">{ad.location}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Ad ID</span>
                <span className="font-semibold text-gray-900">#AD-{ad.id.split('-')[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Seller Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                FOR SALE
              </span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500">
                  <Heart size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-indigo-600">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{ad.title}</h1>
            <div className="text-3xl font-extrabold text-indigo-600 mb-6">
              LKR {ad.price.toLocaleString()}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={20} className="text-gray-400" />
                <span>{ad.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={20} className="text-gray-400" />
                <span>Posted on {new Date(ad.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <Button 
              className="w-full py-4 text-lg gap-2 rounded-2xl shadow-indigo-100 shadow-xl"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle size={22} />
              Contact on WhatsApp
            </Button>
            
            <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> 
              Safe & Secure Transaction
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Seller Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl overflow-hidden">
                {ad.seller?.avatar_url ? (
                  <img src={ad.seller.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  ad.seller?.full_name[0]
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{ad.seller?.full_name}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <User size={14} /> Member since 2023
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl">
              View All Ads from Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
