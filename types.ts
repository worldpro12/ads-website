
export type UserRole = 'buyer' | 'seller';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface SellerProfile extends UserProfile {
  country?: string;
  address?: string;
  contact_number?: string;
  whatsapp_number?: string;
  username?: string;
  package_type: 'none' | 'silver' | 'gold';
  package_expiry?: string;
  total_ads?: number;
}

export interface Ad {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  sub_category?: string;
  price: number;
  condition: 'new' | 'used' | 'refurbished';
  location: string;
  images: string[];
  whatsapp_contact: string;
  created_at: string;
  expiry_date: string;
  views: number;
  clicks: number;
  whatsapp_clicks: number;
  seller?: {
    full_name: string;
    avatar_url: string;
    whatsapp_number: string;
  };
}

export interface Package {
  id: string;
  name: 'Silver' | 'Gold';
  price: number;
  maxAds: number | 'unlimited';
  description: string;
}

export interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
  whatsapp_clicks: number;
}
