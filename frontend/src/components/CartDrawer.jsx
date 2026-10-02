import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Minus, Plus, X, ShoppingBag, ArrowUpRight, LockKeyhole } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { money } from '../brand';

export const CartDrawer = () => {
  const { items, open, setOpen, removeItem, updateQty, subtotal, checkout, checkingOut } = useCart();
  const [error, setError] = useState('');
  const handleCheckout = async () => {
    setError('');
    try { await checkout(); } catch (e) { setError(typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : 'Paiement indisponible. Merci de réessayer.'); }
  };
  return (
    <Sheet open={open} onOpenChange={value => { setOpen(value); setError(''); }}>
      <SheetContent side="right" data-testid="cart-drawer" className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        <SheetHeader className="px-6 pt-7 pb-5 border-b text-left"><SheetTitle className="font-display text-2xl">TON PANIER</SheetTitle><SheetDescription>WEARHOUSE 60</SheetDescription></SheetHeader>
        {items.length === 0 ? <div className="empty-cart"><ShoppingBag size={36} strokeWidth={1.3} /><p data-testid="cart-empty">Ton panier est vide.</p><button className="action action-primary" data-testid="cart-continue" onClick={() => setOpen(false)}>DÉCOUVRIR LE JEAN <ArrowUpRight size={18} /></button></div> : <>
          <div className="cart-items">{items.map(item => <div key={item.key} className="cart-item" data-testid={`cart-item-${item.size}`}>
            <img src={item.image} alt={item.name} /><div className="min-w-0 flex-1"><div className="flex justify-between items-start gap-2"><p className="font-cond text-sm" data-testid={`cart-name-${item.size}`}>{item.name}</p><button aria-label={`Retirer la taille ${item.size}`} onClick={() => removeItem(item.key)} data-testid={`cart-remove-${item.size}`}><X size={17} /></button></div><p className="text-xs text-black/55 mt-1" data-testid={`cart-variant-${item.size}`}>Noir ciré / Camo · Taille {item.size}</p><div className="flex justify-between items-center gap-2 mt-4"><div className="quantity-control"><button aria-label="Réduire la quantité" disabled={item.qty <= 1} onClick={() => updateQty(item.key, item.qty - 1)} data-testid={`cart-minus-${item.size}`}><Minus size={13} /></button><span data-testid={`cart-quantity-${item.size}`}>{item.qty}</span><button aria-label="Augmenter la quantité" disabled={item.qty >= item.maxQty} onClick={() => updateQty(item.key, item.qty + 1)} data-testid={`cart-plus-${item.size}`}><Plus size={13} /></button></div><span className="font-cond text-sm" data-testid={`cart-price-${item.size}`}>{money(item.qty * item.price)}</span></div></div>
          </div>)}</div>
          <div className="cart-summary"><div className="flex justify-between"><span>SOUS-TOTAL TTC</span><strong data-testid="cart-subtotal">{money(subtotal)}</strong></div>{error && <p role="alert" data-testid="checkout-error" className="error-message">{error}</p>}<button className="action action-primary w-full" data-testid="checkout-button" onClick={handleCheckout} disabled={checkingOut}>{checkingOut ? 'REDIRECTION…' : 'PASSER COMMANDE'}<ArrowUpRight size={18} /></button><p className="flex justify-center gap-2 text-xs text-black/55"><LockKeyhole size={13} />Paiement sécurisé par Stripe</p></div>
        </>}
      </SheetContent>
    </Sheet>
  );
};
export default CartDrawer;