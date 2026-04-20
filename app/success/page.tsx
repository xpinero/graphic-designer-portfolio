'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push('/shop');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/order?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('cart-storage');
    }
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-foreground/70">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        {orderDetails && (
          <div className="bg-muted rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Order Number:</span>
                <span className="font-medium">{orderDetails.orderNumber || sessionId?.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Email:</span>
                <span className="font-medium">{orderDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Total:</span>
                <span className="font-medium text-accent">${(orderDetails.amount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
          <ul className="text-left space-y-2 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Digital products will be available for download via email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Physical products will be shipped within 2-3 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>You can track your order status via the link in your email</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-accent hover:bg-accent-light text-background font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-border hover:border-accent text-foreground font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
