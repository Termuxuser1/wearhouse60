import React, { useState } from 'react';
import { product, dropColors } from '../mock';
import { useCart } from '../context/CartContext';
import { ArrowUpRight } from 'lucide-react';

const DropSection = () => {
  const { addItem } = useCart();
  const [active, setActive] = useState(dropColors[0].id);
  const wash = product.washes.find((w) => w.id === active) || product.washes[0];

  return (
    <section id="drop" className="bg-[#f4f4f4] py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 text-center">
        <p className="font-cond uppercase tracking-[0.3em] text-xs text-black/50">New for the drop</p>
        <h2 className="font-display text-6xl md:text-8xl uppercase mt-2">The Drop.</h2>
        <p className="text-black/60 mt-3 max-w-lg mx-auto">
          Three washes, one silhouette. Raw Indigo, Washed Black & Coated Wax.
        </p>

        {/* color dots */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {dropColors.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              aria-label={c.label}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                active === c.id ? 'border-black scale-110' : 'border-black/20 hover:border-black/50'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* set preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-4xl mx-auto">
          {[
            { label: 'The Jean', img: wash.image, price: wash.price,
              sku: `wax001_${active.replace(/-/g, '_')}`, productId: 'wax-001', variantId: active, variantName: wash.name, size: '32', name: `WAX//001 — ${wash.name}` },
            { label: 'The Jacket', img: wash.hover, price: 215,
              sku: 'wax_trucker_jacket', productId: 'wax-jacket', variantId: '', variantName: '', size: 'M', name: 'WAX//Trucker Jacket' },
            { label: 'The Short', img: product.washes[(dropColors.findIndex((d)=>d.id===active)+1)%3].image, price: 95,
              sku: 'wax_cutoff_short', productId: 'wax-short', variantId: '', variantName: '', size: '32', name: 'WAX//001 Cut-Off Short' },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => addItem({ sku: item.sku, productId: item.productId, variantId: item.variantId, variantName: item.variantName, name: item.name, size: item.size, qty: 1, price: item.price, image: item.img })}>
              <div className="aspect-[4/5] bg-white overflow-hidden">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-left">
                <span className="font-cond uppercase tracking-wide text-sm">{item.label}</span>
                <span className="font-cond text-sm">€{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <span className="font-cond uppercase tracking-wide text-sm" style={{ color: wash.hex }}>
            {dropColors.find((c) => c.id === active)?.label}
          </span>
          <span className="text-black/40 text-sm">·</span>
          <span className="font-cond uppercase tracking-wide text-sm text-[#e4001b]">Out now</span>
        </div>

        <a
          href="#product"
          className="group inline-flex items-center gap-2 mt-8 bg-black text-white px-10 h-12 font-cond uppercase tracking-[0.18em] text-sm hover:bg-[#e4001b] transition-colors"
        >
          Shop the collection
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
};

export default DropSection;
