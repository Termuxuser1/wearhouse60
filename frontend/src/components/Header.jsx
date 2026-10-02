import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { announcements, navLinks, BRAND } from '../mock';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const AnnouncementBar = () => {
  const loop = [...announcements, ...announcements];
  return (
    <div className="bg-black text-white overflow-hidden">
      <div className="marquee-track py-2">
        {loop.map((a, i) => (
          <span
            key={i}
            className="font-cond text-[11px] tracking-[0.18em] uppercase px-8 flex items-center"
          >
            {a}
            <span className="ml-8 text-[#e4001b]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Header = () => {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div
        className={`transition-all duration-300 border-b ${
          scrolled ? 'bg-white/95 backdrop-blur-md border-black/10' : 'bg-white border-transparent'
        }`}
      >
        <nav className="max-w-[1600px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* left nav */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-cond font-600 text-[12px] tracking-[0.12em] uppercase text-black/80 hover:text-[#e4001b] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* mobile menu btn */}
          <button
            className="lg:hidden p-1 -ml-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" strokeWidth={1.6} />
          </button>

          {/* center logo */}
          <a href="#top" className="flex items-center gap-2 lg:flex-1 lg:justify-center">
            <span className="font-display text-2xl md:text-[26px] leading-none text-black">
              {BRAND.name}
            </span>
          </a>

          {/* right icons */}
          <div className="flex items-center gap-4 lg:gap-5 lg:flex-1 justify-end">
            <div className="hidden md:flex items-center gap-1 font-cond text-[12px] tracking-wider">
              <button
                onClick={() => setLang('EN')}
                className={lang === 'EN' ? 'text-black' : 'text-black/40'}
              >
                EN
              </button>
              <span className="text-black/30">/</span>
              <button
                onClick={() => setLang('FR')}
                className={lang === 'FR' ? 'text-black' : 'text-black/40'}
              >
                FR
              </button>
            </div>
            <button className="hidden md:block hover:text-[#e4001b] transition-colors" aria-label="Search">
              <Search className="w-5 h-5" strokeWidth={1.6} />
            </button>
            <button className="hidden md:block hover:text-[#e4001b] transition-colors" aria-label="Account">
              <User className="w-5 h-5" strokeWidth={1.6} />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="relative hover:text-[#e4001b] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e4001b] text-white text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-white p-6 reveal">
            <div className="flex items-center justify-between mb-10">
              <span className="font-display text-2xl">{BRAND.name}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-cond font-600 text-xl tracking-wide uppercase text-black hover:text-[#e4001b] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      <CartDrawer />
    </header>
  );
};

export default Header;
