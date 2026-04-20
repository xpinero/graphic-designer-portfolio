'use client';

import Image from 'next/image';
import { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: () => void;
}

export default function ProductCard({ product, index, onClick }: ProductCardProps) {
  const hasVariants = product.variants && product.variants.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-accent text-background text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {product.inventory !== undefined && product.inventory <= 5 && product.inventory > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Only {product.inventory} left
          </div>
        )}
        {product.inventory === 0 && (
          <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center">
            <span className="text-background font-bold text-lg">Sold Out</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-accent mb-2">
          {product.category}
        </div>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-accent">
              ${product.price.toFixed(2)}
            </span>
            {hasVariants && (
              <span className="text-xs text-foreground/60 ml-1">+</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            disabled={product.inventory === 0}
            className="flex items-center gap-2 bg-accent hover:bg-accent-light text-background px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {hasVariants ? 'Select' : 'Add'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
