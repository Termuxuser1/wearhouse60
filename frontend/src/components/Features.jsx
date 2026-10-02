import React from 'react';
import { features } from '../brand';

export const Features = () => (
  <section id="features" className="details-section section-space">
    <div className="page-width">
      <div className="section-heading"><h2 className="eyebrow">02 / LES DÉTAILS</h2><p className="section-statement">RIEN N’EST<br /><span>LAISSÉ AU HASARD.</span></p></div>
      <div className="detail-photos">
        {[
          { src: '/images/detail-wax.webp', alt: 'Reflets marbrés du denim noir ciré', caption: '01 — LA MATIÈRE' },
          { src: '/images/detail-camo.webp', alt: 'Revers du jean en camouflage vert militaire', caption: '02 — LE CONTRASTE' },
          { src: '/images/detail-back.webp', alt: 'Poches et finition du jean vu de dos', caption: '03 — LA CONSTRUCTION' },
        ].map((photo, index) => <figure key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption data-testid={`detail-caption-${index}`}>{photo.caption}</figcaption></figure>)}
      </div>
      <div className="feature-grid">{features.map((feature, index) => <div key={feature.title}><span className="feature-number">0{index + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p></div>)}</div>
    </div>
  </section>
);
export default Features;