import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const Hero = () => (
  <section id="top" className="hero">
    <img src="/images/campaign.webp" alt="Campagne WEARHOUSE 60 : jean noir ciré porté, silhouette ample" className="hero-image" fetchPriority="high" />
    <div className="hero-shade" />
    <div className="hero-content page-width">
      <div className="hero-heading reveal">
        <p className="eyebrow">INDÉPENDANT. SANS COMPROMIS.</p>
        <h1 data-testid="hero-brand">WEARHOUSE<br /><span>60.</span></h1>
        <p className="hero-slogan" data-testid="hero-slogan">WEAR IT OR DIE FOR IT</p>
      </div>
      <div className="hero-bottom reveal">
        <a href="#product" className="action action-light" data-testid="hero-shop">DÉCOUVRIR LE JEAN <ArrowUpRight size={19} /></a>
        <span className="hero-caption">60 WAXED JEAN<br />DENIM CIRÉ — 14 OZ <ArrowDownRight size={20} /></span>
      </div>
    </div>
  </section>
);
export default Hero;