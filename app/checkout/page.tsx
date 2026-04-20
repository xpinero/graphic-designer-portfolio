'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart';
import { useSettingsStore } from '@/lib/store/settings';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal } = useCartStore();
  const { shopEnabled, fetchSettings, isLoading } = useSettingsStore();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const hasPhysicalProducts = items.some((item) => !item.product.isDigital);

  useEffect(() => {
    fetchSettings();
    const id = window.setInterval(fetchSettings, 60_000);
    return () => window.clearInterval(id);
  }, [fetchSettings]);

  useEffect(() => {
    if (!isLoading && !shopEnabled && items.length > 0) {
      toast.error('The shop is currently closed. Checkout is unavailable.');
      router.replace('/');
    }
  }, [isLoading, shopEnabled, items.length, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-foreground/70 mb-8">
            Add some items to your cart before checking out.
          </p>
          <button
            onClick={() => router.push(shopEnabled ? '/shop' : '/')}
            className="bg-accent hover:bg-accent-light text-background font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {shopEnabled ? 'Continue Shopping' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  if (!shopEnabled) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
            
            <div className="bg-muted rounded-lg p-6 space-y-4">
              {items.map((item) => {
                const variantsText = item.selectedVariants
                  ? Object.entries(item.selectedVariants)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')
                  : '';
                const itemKey = `${item.product.id}-${JSON.stringify(item.selectedVariants || {})}`;

                return (
                  <div key={itemKey} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-background rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">
                        {item.product.name}
                      </h3>
                      {variantsText && (
                        <p className="text-xs text-foreground/60">{variantsText}</p>
                      )}
                      <p className="text-sm text-foreground/70">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {hasPhysicalProducts && (
                  <div className="flex justify-between text-foreground/70">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="your@email.com"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Order confirmation will be sent to this email
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-2 text-sm text-foreground/70">
                  <Lock size={16} className="mt-0.5 flex-shrink-0" />
                  <p>
                    Your payment information is secure. We use Stripe for payment processing.
                    {hasPhysicalProducts && ' Shipping address will be collected on the next page.'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-accent hover:bg-accent-light text-background font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Continue to Payment
                  </>
                )}
              </button>

              <p className="text-xs text-center text-foreground/60">
                By completing your purchase, you agree to our terms and conditions.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
