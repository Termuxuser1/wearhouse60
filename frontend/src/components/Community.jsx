import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Community = () => (
  <section id="lookbook" className="section-space page-width lookbook">
    <div className="section-heading"><h2 className="eyebrow">03 / EN SITUATION</h2><p className="section-statement">LE PORTER.<br />PAS LE SUIVRE.</p></div>
    <div className="lookbook-grid">
      <figure className="lookbook-campaign"><img src="/images/campaign.webp" alt="Silhouette WEARHOUSE 60, jean porté avec un débardeur blanc et un bob camo" loading="lazy" /><figcaption>WEARHOUSE 60 — WEAR IT OR DIE FOR IT</figcaption></figure>
      <figure><img src="/images/jean-back.webp" alt="Vue entière de dos du jean ciré, revers camo" loading="lazy" /><figcaption>60 WAXED JEAN / VUE DE DOS</figcaption></figure>
    </div>
    <a className="text-link" href="#product" data-testid="lookbook-shop">FAIRE SIEN LE 60 WAXED JEAN <ArrowUpRight size={18} /></a>
  </section>
);
export default Community;