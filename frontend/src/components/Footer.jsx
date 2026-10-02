import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BRAND, navLinks } from '../brand';

export const Footer = () => (
  <footer className="site-footer">
    <div className="page-width">
      <div className="footer-top"><div><img src={BRAND.logo} alt="Signature WEARHOUSE 60" /><p className="font-display">WEARHOUSE 60</p><span>{BRAND.tagline}</span></div><nav>{navLinks.map(link => <a key={link.id} href={link.href} data-testid={`footer-${link.id}`}>{link.label}<ArrowUpRight size={17} /></a>)}</nav></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} WEARHOUSE 60</span><span>DENIM 14 OZ. CARACTÈRE BRUT.</span><a href="#top" data-testid="back-to-top">RETOUR EN HAUT ↑</a></div>
    </div>
  </footer>
);
export default Footer;