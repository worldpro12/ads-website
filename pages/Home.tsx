
import React, { useState, useEffect } from 'react';
import { Ad } from '../types';
import { AdCard } from '../components/AdCard';
import { CATEGORIES } from '../constants';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HomeProps {
  onAdClick: (id: string) => void;
  onPostAd: () => void;
}

export const Home: React.FC<HomeProps> = ({ onAdClick, onPostAd }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  useEffect(() => {
    // Mock fetching ads (In production, use Supabase)
    const mockAds: Ad[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `ad-${i}`,
      seller_id: 'seller-1',
      title: `${['iPhone 15 Pro', 'Toyota Camry', 'Luxury Apartment', 'Modern Sofa', 'Mountain Bike'][i % 5]} - Great Condition`,
      description: 'This is a high-quality product in excellent condition. Selling because I am moving out.',
      category: CATEGORIES[i % CATEGORIES.length],
      price: [150000, 2500000, 45000000, 45000, 85000][i % 5],
      condition: 'used',
      location: ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna'][i % 5],
      images: [`https://picsum.photos/seed/${i + 10}/800/600`],
      whatsapp_contact: '+94771234567',
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      expiry_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      views: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 200),
      whatsapp_clicks: Math.floor(Math.random() * 50)
    }));

    setAds(mockAds);
    setLoading(false);
  }, []);

  const filteredAds = ads
    .filter(ad => selectedCategory === 'All' || ad.category === selectedCategory)
    .filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(ad => ad.price >= priceRange.min && ad.price <= priceRange.max)
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'popular') return b.views - a.views;
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 bg-indigo-900 rounded-3xl overflow-hidden flex items-center justify-center text-center p-6">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/1200/400?grayscale" alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Find everything you need in one place
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            Browse thousands of items from trusted sellers or sell your own.
          </p>
          <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="rounded-xl shadow-lg" onClick={onPostAd}>
              Start Selling
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-6">
              <Filter size={20} className="text-indigo-600" />
              Advanced Filters
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (LKR)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 1000000 })}
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Ad Listings */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'Latest Ads' : `${selectedCategory} Ads`}
            </h2>
            <div className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredAds.length}</span> ads
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 rounded-xl aspect-[4/3] animate-pulse"></div>
              ))}
            </div>
          ) : filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAds.map(ad => (
                <AdCard key={ad.id} ad={ad} onClick={() => onAdClick(ad.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No ads found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange({ min: 0, max: 1000000 }); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
