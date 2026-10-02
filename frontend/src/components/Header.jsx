import React, { useState } from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { BRAND, navLinks } from '../brand';
import { useCart } from '../context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import CartDrawer from './CartDrawer';

export const Header = () => {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="announcement" data-testid="brand-announcement"><span>DENIM 14 OZ / NOIR CIRÉ / REVERS CAMO</span><span className="hidden sm:block">{BRAND.tagline}</span></div>
      <nav className="main-nav">
        <div className="nav-links">{navLinks.map(link => <a key={link.id} href={link.href} data-testid={`nav-${link.id}`}>{link.label}</a>)}</div>
        <button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu" data-testid="open-menu"><Menu size={22} /></button>
        <a href="#top" className="brand-lockup" data-testid="header-brand"><img src={BRAND.logo} alt="Logo WEARHOUSE 60" /><span>WEARHOUSE <b>60</b></span></a>
        <button className="cart-trigger" onClick={() => setOpen(true)} aria-label={`Ouvrir le panier, ${count} article(s)`} data-testid="open-cart"><span className="hidden sm:inline">PANIER</span><ShoppingBag size={19} /><span data-testid="cart-count">({count})</span></button>
      </nav>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" data-testid="mobile-menu" className="bg-white">
          <SheetHeader><SheetTitle>WEARHOUSE 60</SheetTitle><SheetDescription>WEAR IT OR DIE FOR IT</SheetDescription></SheetHeader>
          <div className="flex flex-col gap-7 mt-12 font-cond text-xl uppercase">{navLinks.map(link => <a key={link.id} href={link.href} data-testid={`mobile-nav-${link.id}`} onClick={() => setMobileOpen(false)}>{link.label}</a>)}</div>
        </SheetContent>
      </Sheet>
      <CartDrawer />
    </header>
  );
};
export default Header;