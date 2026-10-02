import React from 'react';
import { gridProducts } from '../mock';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

const ProductGrid = () => {
  const { addItem } = useCart();

  return (
    <section id="grid" className="max-w-[1600px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <div className="text-center mb-10">
        <h2 className="font-display text-5xl md:text-7xl uppercase">Style it</h2>
        <p className="text-black/60 mt-2">Build the full WAX//001 look.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {gridProducts.map((p) => {
          const discount = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
          return (
            <div key={p.id} className="product-card group">
              <div className="relative aspect-[4/5] bg-[#ededed] overflow-hidden">
                {discount > 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-[#e4001b] text-white text-[11px] font-semibold px-2 py-1">
                    -{discount}%
                  </span>
                )}
                <img src={p.image} alt={p.name} className="img-main absolute inset-0 w-full h-full object-cover" />
                <img src={p.hover} alt="" className="img-hover absolute inset-0 w-full h-full object-cover" />

                {/* quick sizes on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          addItem({ id: p.id, name: p.name, size: s, qty: 1, price: p.price, image: p.image })
                        }
                        className="min-w-[34px] h-8 px-2 text-xs font-cond border border-black/20 hover:bg-black hover:text-white transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-cond font-600 uppercase tracking-wide text-sm leading-tight">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-cond text-sm">€{p.price}</span>
                    {p.compareAt && (
                      <span className="text-black/40 line-through text-xs">€{p.compareAt}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    addItem({ id: p.id, name: p.name, size: p.sizes[0], qty: 1, price: p.price, image: p.image })
                  }
                  className="w-8 h-8 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors flex-shrink-0"
                  aria-label={`Add ${p.name}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
