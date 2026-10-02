export const BRAND = { name: 'WEARHOUSE 60', tagline: 'WEAR IT OR DIE FOR IT', logo: '/images/wearhouse60-logo.webp' };
export const navLinks = [
  { label: 'Le jean', href: '#product', id: 'product' },
  { label: 'Les détails', href: '#features', id: 'features' },
  { label: 'Le lookbook', href: '#lookbook', id: 'lookbook' },
];
export const money = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
export const features = [
  { title: 'Du poids.', text: '14 oz de denim, environ 475 g/m². Une toile épaisse, 100 % coton, qui donne de la tenue à la coupe.' },
  { title: 'Du relief.', text: 'Un traitement ciré, un brillant irrégulier et des nuances marbrées. Tout sauf un noir uniforme.' },
  { title: 'Le revers.', text: 'Noir à l’extérieur. Camo à l’intérieur. Un revers suffit à révéler la différence.' },
  { title: 'La signature.', text: 'Un patch gravé à la ceinture, au dos. La signature manuscrite de WEARHOUSE 60.' },
];