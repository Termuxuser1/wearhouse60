import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';

const CartDrawer = () => {
  const { items, open, setOpen, removeItem, updateQty, subtotal } = useCart();

  const freeShipAt = 150;
  const remaining = Math.max(0, freeShipAt - subtotal);
  const progress = Math.min(100, (subtotal / freeShipAt) * 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="font-display text-2xl tracking-wide flex items-center gap-2">
            YOUR CART
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="w-10 h-10 text-black/30" strokeWidth={1.3} />
            <p className="font-cond text-sm tracking-wide uppercase text-black/50">
              Your cart is empty.
            </p>
            <Button
              onClick={() => setOpen(false)}
              className="rounded-none bg-black text-white hover:bg-[#e4001b] font-cond tracking-widest uppercase text-xs h-11 px-8"
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 border-b">
              {remaining > 0 ? (
                <p className="text-xs text-black/60">
                  Add <span className="font-semibold text-black">€{remaining}</span> for free shipping
                </p>
              ) : (
                <p className="text-xs text-[#e4001b] font-semibold">You unlocked free shipping 🎉</p>
              )}
              <div className="h-1 bg-black/10 mt-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e4001b] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((it) => (
                <div key={it.key} className="flex gap-4">
                  <div className="w-20 h-24 bg-[#ededed] overflow-hidden flex-shrink-0">
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-cond font-600 text-sm uppercase tracking-wide leading-tight">
                        {it.name}
                      </p>
                      <button onClick={() => removeItem(it.key)} aria-label="Remove">
                        <X className="w-4 h-4 text-black/40 hover:text-[#e4001b]" />
                      </button>
                    </div>
                    <p className="text-xs text-black/50 mt-0.5">
                      {it.wash ? `${it.wash} · ` : ''}{it.size ? `Size ${it.size}` : ''}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-black/15">
                        <button
                          className="w-7 h-7 flex items-center justify-center hover:bg-black/5"
                          onClick={() => updateQty(it.key, it.qty - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm">{it.qty}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center hover:bg-black/5"
                          onClick={() => updateQty(it.key, it.qty + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-cond font-600 text-sm">€{it.price * it.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cond uppercase tracking-widest text-sm text-black/60">Subtotal</span>
                <span className="font-display text-xl">€{subtotal}</span>
              </div>
              <Button
                onClick={() =>
                  toast({
                    title: 'Checkout is a demo',
                    description: 'Payments are not connected yet — this is a frontend preview.',
                  })
                }
                className="w-full rounded-none bg-black text-white hover:bg-[#e4001b] font-cond tracking-[0.2em] uppercase text-sm h-12"
              >
                Checkout
              </Button>
              <p className="text-[11px] text-center text-black/40">
                Taxes & shipping calculated at checkout
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
