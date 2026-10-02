import React, { useState, useEffect } from 'react';
import { heroImages, BRAND } from '../mock';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative w-full h-[78vh] min-h-[520px] overflow-hidden bg-black">
      <img
        src={heroImages.main}
        alt="WAX//001 campaign"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1400ms] ease-out ${
          loaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      <div className="relative h-full max-w-[1600px] mx-auto px-5 md:px-8 flex flex-col justify-end pb-14 md:pb-16">
        <p className="reveal font-cond text-white/80 tracking-[0.35em] uppercase text-xs md:text-sm mb-3">
          First Drop · Limited
        </p>
        <h1
          className="reveal font-display text-white text-[16vw] sm:text-[12vw] lg:text-[9rem] leading-[0.85] uppercase"
          style={{ animationDelay: '0.1s' }}
        >
          {BRAND.name}
        </h1>
        <p
          className="reveal font-cond text-white/90 tracking-wide text-base md:text-lg mt-4 max-w-md"
          style={{ animationDelay: '0.2s' }}
        >
          {BRAND.tagline}
        </p>
        <div className="reveal mt-7 flex flex-wrap gap-3" style={{ animationDelay: '0.3s' }}>
          <a
            href="#product"
            className="group inline-flex items-center gap-2 bg-white text-black px-8 h-12 font-cond uppercase tracking-[0.18em] text-sm hover:bg-[#e4001b] hover:text-white transition-colors"
          >
            Shop the jean
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 border border-white/60 text-white px-8 h-12 font-cond uppercase tracking-[0.18em] text-sm hover:bg-white hover:text-black transition-colors"
          >
            The details
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
