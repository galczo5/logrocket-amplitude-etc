import { createContext, useContext, useEffect, useState } from 'react';
import { trackRemoveFromCart, trackEvent } from '@/lib/analytics';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addItem(newItem: Omit<CartItem, 'quantity'>) {
    setItems((prev) => {
      const key = itemKey(newItem.productId, newItem.size, newItem.color);
      const existing = prev.find((i) => itemKey(i.productId, i.size, i.color) === key);
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.size, i.color) === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }

  function removeItem(productId: string, size: string, color: string) {
    const key = itemKey(productId, size, color);
    const item = items.find((i) => itemKey(i.productId, i.size, i.color) === key);
    if (item) {
      trackRemoveFromCart(productId, item.name, item.price);
    }
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.size, i.color) !== key));
  }

  function updateQuantity(productId: string, size: string, color: string, quantity: number) {
    const key = itemKey(productId, size, color);
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    const item = items.find((i) => itemKey(i.productId, i.size, i.color) === key);
    if (item) {
      trackEvent('Cart Quantity Updated', {
        productId,
        productName: item.name,
        oldQuantity: item.quantity,
        newQuantity: quantity
      });
    }
    setItems((prev) => prev.map((i) => (itemKey(i.productId, i.size, i.color) === key ? { ...i, quantity } : i)));
  }

  function clearCart() {
    const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    trackEvent('Cart Cleared', { itemCount: items.length, totalPrice: cartTotal / 100 });
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
