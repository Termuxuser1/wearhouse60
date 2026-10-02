import React from 'react';
import { features, detailImages } from '../mock';

const Features = () => {
  return (
    <section id="features" className="bg-black text-white py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-cond uppercase tracking-[0.3em] text-xs text-white/50">Built different</p>
          <h2 className="font-display text-5xl md:text-7xl uppercase mt-2 leading-[0.9]">
            Every detail,
            <br />
            <span className="text-[#e4001b]">obsessed over.</span>
          </h2>
        </div>

        {/* detail images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {detailImages.map((src, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden group">
              <img
                src={src}
                alt={`WAX//001 detail ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mt-14 border-t border-white/15 pt-12">
          {features.map((f, i) => (
            <div key={i}>
              <span className="font-display text-5xl text-white/15">0{i + 1}</span>
              <h3 className="font-cond font-600 uppercase tracking-wide text-lg mt-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mt-2">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
