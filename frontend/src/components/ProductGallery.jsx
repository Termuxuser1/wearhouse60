import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ProductGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);
  const image = images[selected];
  const move = (direction) => setSelected(index => (index + direction + images.length) % images.length);
  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <span className="gallery-stamp">60 / DENIM</span>
        <img src={image.src} alt={image.alt} data-testid="product-main-image" className={selected === 0 ? 'flat-image' : ''} />
        <div className="gallery-controls"><button onClick={() => move(-1)} className="icon-button" aria-label="Photo précédente" data-testid="gallery-previous"><ArrowLeft size={18} /></button><span data-testid="gallery-position">0{selected + 1} / 0{images.length}</span><button onClick={() => move(1)} className="icon-button" aria-label="Photo suivante" data-testid="gallery-next"><ArrowRight size={18} /></button></div>
      </div>
      <div className="gallery-thumbnails">{images.map((item, index) => <button key={item.src} data-testid={`gallery-thumbnail-${index}`} aria-label={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)} className={selected === index ? 'selected' : ''}><img src={item.src} alt={item.alt} loading="lazy" /><span>{item.label}</span></button>)}</div>
    </div>
  );
};