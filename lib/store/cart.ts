import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const calculateItemPrice = (product: Product, selectedVariants?: Record<string, string>): number => {
  let price = product.price;
  
  if (selectedVariants && product.variants) {
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

const getItemKey = (productId: string, selectedVariants?: Record<string, string>): string => {
  if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
    return productId;
  }
  return `${productId}-${JSON.stringify(selectedVariants)}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, selectedVariants) => {
        const price = calculateItemPrice(product, selectedVariants);
        const itemKey = getItemKey(product.id, selectedVariants);
        
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => {
            const existingKey = getItemKey(item.product.id, item.selectedVariants);
            return existingKey === itemKey;
          });

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                selectedVariants,
                price,
              },
            ],
          };
        });
      },

      removeItem: (productId, selectedVariants) => {
        const itemKey = getItemKey(productId, selectedVariants);
        
        set((state) => ({
          items: state.items.filter((item) => {
            const existingKey = getItemKey(item.product.id, item.selectedVariants);
            return existingKey !== itemKey;
          }),
        }));
      },

      updateQuantity: (productId, quantity, selectedVariants) => {
        const itemKey = getItemKey(productId, selectedVariants);
        
        if (quantity <= 0) {
          get().removeItem(productId, selectedVariants);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            const existingKey = getItemKey(item.product.id, item.selectedVariants);
            if (existingKey === itemKey) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
