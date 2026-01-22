
import React from 'react';
import { Ad } from '../types';
import { MapPin, Clock, Tag } from 'lucide-react';

interface AdCardProps {
  ad: Ad;
  onClick: () => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={ad.images[0] || 'https://picsum.photos/400/300'} 
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold">
          LKR {ad.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
          <Tag size={12} />
          {ad.category}
        </div>
        <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
          {ad.title}
        </h3>
        
        <div className="space-y-1.5">
          <div className="flex items-center text-sm text-gray-500 gap-1.5">
            <MapPin size={14} />
            {ad.location}
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-1.5">
            <Clock size={14} />
            {new Date(ad.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
