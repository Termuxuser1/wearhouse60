import React from 'react';
import { community, galleryImages } from '../mock';
import { Instagram } from 'lucide-react';

const Community = () => {
  const loop = [...community, ...community];
  return (
    <section id="community" className="py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        {/* editorial banner */}
        <div className="relative aspect-[21/9] overflow-hidden mb-16">
          <img src={galleryImages[0]} alt="WAX//001 editorial" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-end p-6 md:p-12">
            <div>
              <h2 className="font-display text-white text-5xl md:text-8xl uppercase leading-[0.85]">
                Worn in
                <br />the wild
              </h2>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="font-cond uppercase tracking-[0.3em] text-xs text-black/50">@wax001</p>
          <h2 className="font-display text-5xl md:text-7xl uppercase mt-2">Community</h2>
          <p className="text-black/60 mt-2">Tag us to be featured.</p>
        </div>
      </div>

      {/* marquee gallery */}
      <div className="overflow-hidden">
        <div className="marquee-track gap-3 py-2" style={{ animationDuration: '35s' }}>
          {loop.map((c, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group w-[260px] h-[320px] flex-shrink-0 overflow-hidden mx-1.5"
            >
              <img
                src={c.img}
                alt={c.user}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity font-cond uppercase tracking-wide text-sm">
                  <Instagram className="w-4 h-4" />@{c.user}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
