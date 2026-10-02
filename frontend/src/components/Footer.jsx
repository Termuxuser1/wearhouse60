import React, { useState } from 'react';
import { BRAND } from '../mock';
import { galleryImages } from '../mock';
import { ArrowRight, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubbed(true);
    setEmail('');
  };

  return (
    <footer>
      {/* JOIN THE CLUB */}
      <div className="relative">
        <img
          src={galleryImages[2]}
          alt="Join the WAX//001 club"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative max-w-xl mx-auto px-5 py-20 md:py-28 text-center text-white">
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9]">Join the club</h2>
          <p className="font-cond tracking-wide text-white/80 mt-4 uppercase text-sm">
            Be the first to know about the next drop and never miss it again
          </p>

          {subbed ? (
            <p className="mt-8 font-cond uppercase tracking-widest text-[#ff5a6e]">
              Thanks for subscribing ✦
            </p>
          ) : (
            <form onSubmit={submit} className="mt-8 flex max-w-md mx-auto border-b border-white/40">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent py-3 text-white placeholder:text-white/50 outline-none font-cond tracking-wide"
              />
              <button
                type="submit"
                className="px-3 text-white hover:text-[#ff5a6e] transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* bottom footer */}
      <div className="bg-black text-white">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <span className="font-display text-3xl">{BRAND.name}</span>
              <p className="text-white/50 text-sm mt-3 max-w-xs">{BRAND.tagline}</p>
              <div className="flex gap-4 mt-5">
                {[Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.6} />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Shop', links: ['The Jean', 'The Drop', 'Style It', 'Gift Cards'] },
              { title: 'Help', links: ['Size Guide', 'Shipping', 'Returns', 'Contact'] },
              { title: 'Brand', links: ['Our Story', 'Denim 101', 'Sustainability', 'Careers'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-cond uppercase tracking-widest text-xs text-white/50 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className="text-sm text-white/80 hover:text-[#ff5a6e] transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">© 2025 {BRAND.name}. All rights reserved.</p>
            <div className="flex gap-5 text-xs text-white/40">
              <a href="#top" className="hover:text-white">Privacy</a>
              <a href="#top" className="hover:text-white">Terms</a>
              <a href="#top" className="hover:text-white">Refund policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
