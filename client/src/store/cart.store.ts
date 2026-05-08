import { create } from 'zustand';
import api from '@/src/lib/api';
import { Cart } from '@/src/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart');
      set({ cart: data });
    } catch {}
  },

  addItem: async (productId, quantity, size, color) => {
    await api.post('/cart', { productId, quantity, size, color });
    await get().fetchCart();
    set({ isOpen: true });
  },

  updateItem: async (itemId, quantity) => {
    await api.put(`/cart/${itemId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    await get().fetchCart();
  },

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
}));
