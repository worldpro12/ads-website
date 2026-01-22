import React, { useEffect, useRef, useState } from 'react';
import { SellerProfile } from '../types';
import { PACKAGES } from '../constants';
import { Check, Shield, Loader2, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface PricingProps {
  user: SellerProfile | null;
  onNavigateTo: (page: any) => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export const Pricing: React.FC<PricingProps> = ({ user, onNavigateTo }) => {
  const silverBtnRef = useRef<HTMLDivElement>(null);
  const goldBtnRef = useRef<HTMLDivElement>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const isHostAccessible = () => {
    try {
      // Accessing location properties can throw in cross-origin iframes
      return !!(window.location && (window.location.host || window.location.hostname));
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;

    const checkPaypal = setInterval(() => {
      attempts++;
      
      if (!isHostAccessible()) {
        setSdkError("Payment interface is restricted by your browser's security settings (Inaccessible Host). Please try a standard browser window.");
        clearInterval(checkPaypal);
        return;
      }

      if (window.paypal && window.paypal.Buttons) {
        setIsSdkReady(true);
        setSdkError(null);
        clearInterval(checkPaypal);
      } else if (attempts >= maxAttempts) {
        setSdkError("PayPal SDK timed out. Check your internet connection or ad-blocker.");
        clearInterval(checkPaypal);
      }
    }, 1000);

    return () => clearInterval(checkPaypal);
  }, []);

  useEffect(() => {
    if (!isSdkReady || !user || user.role !== 'seller' || sdkError) return;

    const renderButtons = async () => {
      const renderButton = async (ref: React.RefObject<HTMLDivElement | null>, type: 'silver' | 'gold', color: string) => {
        if (!ref.current || ref.current.innerHTML !== '') return;

        try {
          await window.paypal.Buttons({
            style: { color, shape: 'pill', label: 'pay', height: 45 },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: { 
                    value: PACKAGES[type].price.toString(), 
                    currency_code: 'LKR' 
                  },
                  description: `MarketMaster ${type.charAt(0).toUpperCase() + type.slice(1)} Package - 30 Days`
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture();
              await handlePaymentSuccess(type, order);
            },
            onError: (err: any) => {
              console.error("PayPal SDK Component Error:", err);
              if (err?.message?.includes('window host')) {
                setSdkError("The payment window cannot communicate with the site due to cross-origin restrictions.");
              } else {
                toast.error('Payment window encountered an error.');
              }
            }
          }).render(ref.current);
        } catch (e: any) {
          console.error(`PayPal Render Catch (${type}):`, e);
          if (e.message?.includes('window host')) {
            setSdkError("Payment interface blocked by browser environment restrictions.");
          }
        }
      };

      await renderButton(silverBtnRef, 'silver', 'silver');
      await renderButton(goldBtnRef, 'gold', 'blue');
    };

    renderButtons();
  }, [isSdkReady, user, sdkError]);

  const handlePaymentSuccess = async (packageType: 'silver' | 'gold', order: any) => {
    if (!user) return;

    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: user.id,
        package_type: packageType,
        amount: packageType === 'silver' ? PACKAGES.silver.price : PACKAGES.gold.price,
        paypal_order_id: order.id,
        status: 'completed'
      });

      if (paymentError) throw paymentError;

      const { error: userError } = await supabase
        .from('users')
        .update({
          package_type: packageType,
          package_expiry: expiryDate.toISOString()
        })
        .eq('id', user.id);

      if (userError) throw userError;

      toast.success(`Welcome to ${packageType.toUpperCase()}! Your account is now upgraded.`);
      onNavigateTo('dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Account update failed. Support ID: ' + order.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 px-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide uppercase">
          <Sparkles size={16} /> Premium Access
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Business</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Choose a listing package to start reaching thousands of potential buyers today.
        </p>
      </div>

      {sdkError && (
        <div className="bg-red-50 border border-red-200 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4 text-red-800 max-w-3xl mx-auto shadow-sm">
          <AlertTriangle className="text-red-500" size={48} />
          <div>
            <h3 className="font-bold text-xl mb-2">Payment System Restricted</h3>
            <p className="text-sm opacity-90 mb-6">{sdkError}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="danger" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outline" onClick={() => onNavigateTo('home')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}

      {!user ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center gap-4 text-amber-800 max-w-2xl mx-auto">
          <Shield className="text-amber-500" size={24} />
          <p className="text-sm font-medium">Please <button onClick={() => onNavigateTo('login')} className="font-bold underline">Log In</button> as a seller to purchase packages.</p>
        </div>
      ) : user.role !== 'seller' ? (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl flex items-center gap-4 text-blue-800 max-w-2xl mx-auto">
          <Zap className="text-blue-500" size={24} />
          <p className="text-sm font-medium">Only seller accounts can purchase packages. You are currently a Buyer.</p>
        </div>
      ) : null}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 transition-opacity duration-500 ${sdkError ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
        {/* Silver */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 flex flex-col group hover:shadow-2xl transition-all">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Silver</h3>
            <p className="text-gray-500 text-lg leading-relaxed">{PACKAGES.silver.description}</p>
          </div>
          <div className="mb-10">
            <div className="flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">LKR {PACKAGES.silver.price}</span>
              <span className="text-gray-400 font-medium ml-2">/ month</span>
            </div>
          </div>
          <ul className="space-y-4 mb-12 flex-grow">
            {[`Up to ${PACKAGES.silver.maxAds} listings`, 'Standard visibility', 'Basic analytics', '30-day listing duration'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                <Check size={18} className="text-green-500" /> {feat}
              </li>
            ))}
          </ul>
          
          <div className="mt-auto">
            {user?.role === 'seller' && !sdkError ? (
              <div ref={silverBtnRef} className="min-h-[50px] flex items-center justify-center">
                {!isSdkReady && <Loader2 size={24} className="animate-spin text-gray-300" />}
              </div>
            ) : (
              <Button variant="outline" className="w-full py-4 rounded-2xl" onClick={() => onNavigateTo('register')}>
                Join as Seller
              </Button>
            )}
          </div>
        </div>

        {/* Gold */}
        <div className="bg-indigo-600 rounded-[3rem] p-10 shadow-2xl border border-indigo-500 flex flex-col text-white relative group hover:shadow-indigo-200 transition-all">
          <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
            Recommended
          </div>
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Gold</h3>
            <p className="text-indigo-100 text-lg leading-relaxed">{PACKAGES.gold.description}</p>
          </div>
          <div className="mb-10">
            <div className="flex items-baseline">
              <span className="text-5xl font-extrabold text-white">LKR {PACKAGES.gold.price}</span>
              <span className="text-indigo-200 font-medium ml-2">/ month</span>
            </div>
          </div>
          <ul className="space-y-4 mb-12 flex-grow">
            {['Unlimited listings', 'Featured placement', 'Advanced insights', '24/7 priority support', 'Custom storefront'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                <Check size={18} className="text-indigo-300" /> {feat}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {user?.role === 'seller' && !sdkError ? (
              <div ref={goldBtnRef} className="min-h-[50px] flex items-center justify-center">
                {!isSdkReady && <Loader2 size={24} className="animate-spin text-white/30" />}
              </div>
            ) : (
              <Button variant="secondary" className="w-full py-4 rounded-2xl bg-white text-indigo-600 font-bold" onClick={() => onNavigateTo('register')}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};