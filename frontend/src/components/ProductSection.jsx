import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { getProducts } from '../api';
import { useCart } from '../context/CartContext';
import { ProductGallery } from './ProductGallery';
import { ProductOptions } from './ProductOptions';
import { money } from '../brand';

export const ProductSection = () => {
  const { addItem, items } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    setError('');
    getProducts().then(data => setProduct(data.product)).catch(() => setError('Le stock est indisponible pour le moment.'));
  }, []);
  useEffect(() => { load(); window.addEventListener('focus', load); return () => window.removeEventListener('focus', load); }, [load]);
  const wash = product?.washes[0];
  const stock = wash?.availability || {};
  const inCart = items.find(item => item.sku === wash?.lookup_key && item.size === size)?.qty || 0;
  const available = Math.max(0, (stock[size] || 0) - inCart);
  const totalStock = Object.values(stock).reduce((sum, value) => sum + value, 0);
  const handleAdd = () => {
    if (!size || !available || error) return;
    addItem({ sku: wash.lookup_key, productId: product.id, variantId: wash.id, variantName: wash.name,
      size, qty: Math.min(qty, available), price: wash.price, name: product.name, image: wash.image, maxQty: stock[size] });
    setQty(1);
  };
  return (
    <section id="product" className="page-width section-space">
      <div className="product-section-label"><h2 className="eyebrow">01 / LE JEAN</h2><span>WEARHOUSE 60 — DENIM DE CARACTÈRE</span></div>
      {error && <div role="alert" data-testid="product-error" className="error-message">{error}<button onClick={load} data-testid="retry-products">Réessayer</button></div>}
      {!product ? (!error && <div className="loading-product" data-testid="product-loading"><Loader2 className="animate-spin" />Chargement du jean…</div>) : (
        <div className="product-layout">
          <ProductGallery images={product.gallery} />
          <div className="product-info">
            <p className="eyebrow accent">NOIR CIRÉ. ENVERS CAMO.</p>
            <p className="product-name font-display" data-testid="product-name">{product.name}</p>
            <div className="product-price"><span data-testid="product-price">{money(wash.price)}</span><del data-testid="product-compare-price">{money(product.compareAtPrice)}</del><span className="price-note">TTC</span></div>
            <p className="product-description" data-testid="product-description">{product.description}</p>
            <div className="product-color" data-testid="product-color"><span className="color-swatch" />{wash.name}<Check size={15} /></div>
            <ProductOptions sizes={product.sizes} stock={stock} size={size} setSize={value => { setSize(value); setQty(1); }} qty={Math.min(qty, available || 1)} setQty={setQty} available={available} totalStock={totalStock} />
            <button className="action action-primary add-to-cart" disabled={!size || !available || !!error} onClick={handleAdd} data-testid="add-to-cart">
              {totalStock === 0 ? 'RUPTURE DE STOCK' : !size ? 'CHOISIR UNE TAILLE' : available === 0 ? 'STOCK DÉJÀ DANS LE PANIER' : `AJOUTER AU PANIER — ${money(wash.price * Math.min(qty, available))}`}<ArrowUpRight size={18} />
            </button>
            <div className="product-facts"><p><Check size={16} /> Denim épais 14 oz · 100 % coton</p><p><Check size={16} /> Coupe ample · Finition cirée marbrée</p><p><Check size={16} /> Revers camo · Patch gravé à l’arrière</p></div>
          </div>
        </div>
      )}
    </section>
  );
};
export default ProductSection;