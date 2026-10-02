import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';
import { getProducts } from '../api';
import { product as mockProduct } from '../mock';
import { Star, Truck, RotateCcw, Minus, Plus, Check } from 'lucide-react';

const ProductSection = () => {
  const { addItem } = useCart();
  const [data, setData] = useState(null);
  const [washId, setWashId] = useState(mockProduct.washes[0].id);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getProducts()
      .then((d) => setData(d.product))
      .catch(() => {});
  }, []);

  const p = data || mockProduct;
  const wash = p.washes.find((w) => w.id === washId) || p.washes[0];
  const price = wash.price;
  const availability = wash.availability || null; // { size: qty }

  const isSoldOut = (s) => {
    if (availability) return (availability[String(s)] || 0) <= 0;
    return (mockProduct.soldOutSizes || []).includes(s);
  };

  const handleAdd = () => {
    if (!size) {
      toast({ title: 'Select a size', description: 'Please choose your size before adding to cart.' });
      return;
    }
    addItem({
      sku: wash.lookup_key,
      productId: p.id,
      variantId: wash.id,
      variantName: wash.name,
      size,
      qty,
      price,
      name: `${p.name} — ${wash.name}`,
      image: wash.image,
    });
  };

  return (
    <section id="product" className="max-w-[1600px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-24">
          <div className="aspect-[4/5] bg-[#ededed] overflow-hidden">
            <img
              key={wash.image}
              src={wash.image}
              alt={`${p.name} ${wash.name}`}
              className="w-full h-full object-cover reveal"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {p.washes.map((w) => (
              <button
                key={w.id}
                onClick={() => setWashId(w.id)}
                className={`aspect-square bg-[#ededed] overflow-hidden border-2 transition-colors ${
                  w.id === washId ? 'border-black' : 'border-transparent hover:border-black/30'
                }`}
              >
                <img src={w.hover} alt={w.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-md">
          <p className="font-cond uppercase tracking-[0.25em] text-xs text-[#e4001b] mb-3">{p.subtitle}</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none uppercase">{p.name}</h2>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-black text-black" />
              ))}
            </div>
            <span className="text-sm text-black/60">{p.rating} · {p.reviews} reviews</span>
          </div>

          <div className="flex items-end gap-3 mt-5">
            <span className="font-display text-3xl">€{price}</span>
            {p.compareAtPrice > price && (
              <span className="text-black/40 line-through text-lg mb-0.5">€{p.compareAtPrice}</span>
            )}
            {p.compareAtPrice > price && (
              <span className="bg-[#e4001b] text-white text-xs font-semibold px-2 py-1 mb-1">
                -{Math.round((1 - price / p.compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          <p className="text-black/70 leading-relaxed mt-5 text-[15px]">{p.description}</p>

          <div className="mt-7">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cond uppercase tracking-widest text-xs text-black/60">Wash</span>
              <span className="font-cond uppercase tracking-wide text-sm">{wash.name}</span>
            </div>
            <div className="flex gap-3">
              {p.washes.map((w) => (
                <button
                  key={w.id}
                  onClick={() => { setWashId(w.id); setSize(null); }}
                  aria-label={w.name}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    w.id === washId ? 'border-black scale-110' : 'border-black/15 hover:border-black/40'
                  }`}
                  style={{ backgroundColor: w.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cond uppercase tracking-widest text-xs text-black/60">Size (waist)</span>
              <button className="text-xs text-black/50 underline underline-offset-2 hover:text-black">Size guide</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {p.sizes.map((s) => {
                const soldOut = isSoldOut(s);
                return (
                  <button
                    key={s}
                    disabled={soldOut}
                    onClick={() => setSize(s)}
                    className={`h-11 font-cond text-sm border transition-all relative ${
                      soldOut
                        ? 'border-black/10 text-black/25 cursor-not-allowed line-through'
                        : size === s
                        ? 'border-black bg-black text-white'
                        : 'border-black/20 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 flex gap-3">
            <div className="flex items-center border border-black/20">
              <button className="w-11 h-12 flex items-center justify-center hover:bg-black/5" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-cond">{qty}</span>
              <button className="w-11 h-12 flex items-center justify-center hover:bg-black/5" onClick={() => setQty((q) => q + 1)}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white h-12 font-cond uppercase tracking-[0.2em] text-sm hover:bg-[#e4001b] transition-colors"
            >
              Add to cart — €{price * qty}
            </button>
          </div>

          <div className="mt-7 space-y-3 border-t pt-6">
            {[
              { icon: Truck, text: 'Free shipping worldwide from €150' },
              { icon: RotateCcw, text: '30-day free returns' },
              { icon: Check, text: 'Japanese 14.5oz selvedge · made to last' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-black/70">
                <b.icon className="w-4 h-4 text-black" strokeWidth={1.6} />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
