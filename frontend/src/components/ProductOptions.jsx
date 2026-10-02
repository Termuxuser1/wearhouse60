import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const ProductOptions = ({ sizes, stock, size, setSize, qty, setQty, available, totalStock }) => (
  <div className="product-options">
    <div className="option-label"><span>TAILLE</span><span data-testid="selected-size">{size ? `TAILLE ${size}` : '1 / 2 / 3'}</span></div>
    <div className="size-selector">{sizes.map(value => <button key={value} aria-pressed={size === value} disabled={!stock[value]} data-testid={`size-select-${value}`} onClick={() => setSize(value)} className={size === value ? 'selected' : ''}>{value}{!stock[value] && <span className="sr-only"> — épuisée</span>}</button>)}</div>
    <div className="stock-row"><p data-testid="product-stock" aria-live="polite"><span className={`stock-dot ${totalStock === 0 ? 'sold-out' : ''}`} />{totalStock === 0 ? 'Épuisé' : size ? `${stock[size]} pièce${stock[size] > 1 ? 's' : ''} disponible${stock[size] > 1 ? 's' : ''} · taille ${size}` : `${totalStock} pièces disponibles`}</p>
      <div className="quantity-control"><button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label="Réduire la quantité" data-testid="product-quantity-minus"><Minus size={14} /></button><span data-testid="product-quantity">{qty}</span><button onClick={() => setQty(Math.min(available, qty + 1))} disabled={!size || qty >= available} aria-label="Augmenter la quantité" data-testid="product-quantity-plus"><Plus size={14} /></button></div>
    </div>
  </div>
);