import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createCheckout } from '../api';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('wearhouse60_cart_v1');
      const saved = raw ? JSON.parse(raw) : [];
      return Array.isArray(saved) ? saved.filter(item => item.productId === 'wearhouse60-jean' && ['1', '2', '3'].includes(item.size) && Number.isInteger(item.qty) && item.qty > 0 && Number.isFinite(item.price) && item.maxQty > 0) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem('wearhouse60_cart_v1', JSON.stringify(items));
  }, [items]);

  // item: { sku, productId, variantId, variantName, size, qty, price, name, image }
  const addItem = useCallback((item) => {
    setItems((prev) => {
      const key = `${item.sku}-${item.size}`;
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) => (p.key === key ? { ...item, key, qty: Math.min(item.maxQty, p.qty + item.qty) } : p));
      }
      return [...prev, { ...item, key }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, Math.min(p.maxQty, qty)) } : p)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback(async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const payload = {
        items: items.map((i) => ({
          lookup_key: i.sku,
          product_id: i.productId,
          variant_id: i.variantId || '',
          size: String(i.size),
          quantity: i.qty,
        })),
        origin_url: window.location.origin,
      };
      const data = await createCheckout(payload);
      window.location.href = data.checkout_url;
    } catch (e) {
      setCheckingOut(false);
      throw e;
    }
  }, [items]);

  const count = items.reduce((n, p) => n + p.qty, 0);
  const subtotal = items.reduce((n, p) => n + p.qty * Math.round(p.price * 100), 0) / 100;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, checkout, checkingOut, count, subtotal, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};
