import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('wax001_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wax001_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const key = `${item.id}-${item.wash || ''}-${item.size || ''}`;
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, { ...item, key }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, qty) } : p))
    );
  }, []);

  const count = items.reduce((n, p) => n + p.qty, 0);
  const subtotal = items.reduce((n, p) => n + p.qty * p.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, count, subtotal, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};
