
import React, { useState } from 'react';
import { UserProfile, SellerProfile } from '../types';
import { Search, PlusSquare, User, LogIn, Menu, X, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';

interface NavbarProps {
  user: UserProfile | SellerProfile | null;
  onNavigateTo: (page: any) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigateTo, activePage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigateTo('home')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <PlusSquare size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">MarketMaster</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search ads..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'seller' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onNavigateTo('dashboard')}
                      className="gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => onNavigateTo('post-ad')}
                      className="gap-2"
                    >
                      <PlusSquare size={16} />
                      Post Ad
                    </Button>
                  </>
                )}
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border-2 border-transparent group-hover:border-indigo-600 transition-all">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.email[0].toUpperCase()
                    )}
                  </button>
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                    <button 
                      onClick={() => onNavigateTo('profile')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User size={16} /> Profile Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogIn size={16} className="rotate-180" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onNavigateTo('login')}>
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={() => onNavigateTo('register')}>
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ads..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          {user ? (
            <div className="space-y-2">
              {user.role === 'seller' && (
                <>
                  <button 
                    onClick={() => { onNavigateTo('dashboard'); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </button>
                  <button 
                    onClick={() => { onNavigateTo('post-ad'); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <PlusSquare size={20} /> Post New Ad
                  </button>
                </>
              )}
              <button 
                onClick={() => { onNavigateTo('profile'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <User size={20} /> Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogIn size={20} className="rotate-180" /> Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => onNavigateTo('login')}>Log In</Button>
              <Button variant="primary" onClick={() => onNavigateTo('register')}>Register</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
