'use client';

import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShoppingCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const formatVariants = (variants?: Record<string, string>) => {
    if (!variants || Object.keys(variants).length === 0) return null;
    return Object.entries(variants)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-accent" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
                  Shopping Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-foreground/20 mb-4" />
                  <p className="text-foreground/60 mb-2">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-accent hover:text-accent-light transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const variantsText = formatVariants(item.selectedVariants);
                    const itemKey = `${item.product.id}-${JSON.stringify(item.selectedVariants || {})}`;
                    
                    return (
                      <div key={itemKey} className="flex gap-4 pb-4 border-b border-border last:border-0">
                        <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                            {item.product.name}
                          </h3>
                          {variantsText && (
                            <p className="text-xs text-foreground/60 mb-2">{variantsText}</p>
                          )}
                          <p className="text-accent font-semibold mb-2">
                            ${item.price.toFixed(2)}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => removeItem(item.product.id, item.selectedVariants)}
                              className="ml-auto p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span className="text-accent">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-foreground/60">
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-accent hover:bg-accent-light text-background font-medium py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-foreground/70 hover:text-foreground transition-colors text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
