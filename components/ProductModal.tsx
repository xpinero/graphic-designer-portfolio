'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart';
import toast from 'react-hot-toast';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const calculatePrice = () => {
    let price = product.price;
    
    if (product.variants) {
      product.variants.forEach((variant) => {
        const selectedValue = selectedVariants[variant.name];
        if (selectedValue) {
          const option = variant.options.find((opt) => opt.value === selectedValue);
          if (option) {
            price += option.priceModifier;
          }
        }
      });
    }
    
    return price;
  };

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      const allVariantsSelected = product.variants.every(
        (variant) => selectedVariants[variant.name]
      );
      
      if (!allVariantsSelected) {
        toast.error('Please select all options');
        return;
      }
    }

    addItem(product, quantity, selectedVariants);
    toast.success('Added to cart!');
    onClose();
  };

  const currentPrice = calculatePrice();
  const isOutOfStock = product.inventory === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full bg-background rounded-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-accent text-background text-xs font-bold px-3 py-1 rounded">
                  Featured
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col">
              <div className="text-xs uppercase tracking-wider text-accent mb-3">
                {product.category}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {product.name}
              </h2>
              
              <div className="text-2xl font-bold text-accent mb-6">
                ${currentPrice.toFixed(2)}
              </div>
              
              <p className="text-foreground/70 leading-relaxed mb-6">
                {product.description}
              </p>

              {product.isDigital && (
                <div className="bg-muted p-3 rounded-lg mb-6 text-sm text-foreground/70">
                  <Check size={16} className="inline mr-2 text-accent" />
                  Digital download - Instant delivery after purchase
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {variant.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => {
                          const isSelected = selectedVariants[variant.name] === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [variant.name]: option.value,
                                }))
                              }
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'border-accent bg-accent text-background'
                                  : 'border-border hover:border-accent'
                              }`}
                            >
                              {option.value}
                              {option.priceModifier !== 0 && (
                                <span className="ml-1 text-sm">
                                  (+${option.priceModifier.toFixed(2)})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-border hover:border-accent transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-border hover:border-accent transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-accent hover:bg-accent-light text-background font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {product.inventory !== undefined && product.inventory > 0 && product.inventory <= 5 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center">
                  Only {product.inventory} left in stock!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
