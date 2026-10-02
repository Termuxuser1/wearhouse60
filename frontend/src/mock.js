// MOCK DATA for WAX//001 denim landing page.
// NOTE: All data here is MOCKED for the frontend-only teaser. Images are placeholders
// and will be replaced by the user later. Backend integration comes in a later phase.

export const BRAND = {
  name: 'WAX//001',
  tagline: 'The raw selvedge jean, hand-waxed.',
};

export const announcements = [
  'FREE SHIPPING WORLDWIDE FROM €150',
  'WAX//001 — LIMITED FIRST DROP',
  '30-DAY RETURNS · NO QUESTIONS ASKED',
  'JAPANESE SELVEDGE DENIM · 14.5OZ',
];

export const heroImages = {
  main: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
  secondary: 'https://images.unsplash.com/photo-1617354839314-9476d4ca8a3d',
};

// The single hero product WAX//001 with its washes (variants)
export const product = {
  id: 'wax-001',
  name: 'WAX//001',
  subtitle: 'Hand-Waxed Selvedge Jean',
  basePrice: 155,
  compareAtPrice: 185,
  rating: 4.9,
  reviews: 214,
  description:
    'Cut from 14.5oz Japanese selvedge denim and finished with a hand-applied wax coating for a second-skin patina that only gets better with wear. Built to break in, made to last.',
  washes: [
    { id: 'raw-indigo', name: 'Raw Indigo', price: 155, hex: '#2b3a67',
      image: 'https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
      hover: 'https://images.unsplash.com/photo-1637069585336-827b298fe84a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900' },
    { id: 'washed-black', name: 'Washed Black', price: 155, hex: '#1c1c1c',
      image: 'https://images.unsplash.com/photo-1631112230741-446762ee05ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
      hover: 'https://images.unsplash.com/photo-1640336437301-8368b53861ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=900' },
    { id: 'coated-wax', name: 'Coated Wax', price: 175, hex: '#3a3027',
      image: 'https://images.unsplash.com/photo-1645859610425-f0f4177df5f0?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
      hover: 'https://images.unsplash.com/photo-1671624759834-bcf0d3dd2517?crop=entropy&cs=srgb&fm=jpg&q=85&w=900' },
  ],
  sizes: [28, 29, 30, 31, 32, 33, 34, 36],
  soldOutSizes: [29, 36],
};

// The drop selector shown in THE DROP. section
export const dropColors = [
  { id: 'raw-indigo', label: 'Raw Indigo', hex: '#2b3a67' },
  { id: 'washed-black', label: 'Washed Black', hex: '#1c1c1c' },
  { id: 'coated-wax', label: 'Coated Wax', hex: '#3a3027' },
];

// Secondary product grid (styling pieces / related)
export const gridProducts = [
  { id: 'wax-jacket', name: 'WAX//Trucker Jacket', price: 215, compareAt: null,
    image: 'https://images.unsplash.com/photo-1618695387047-92fcda1b6231',
    hover: 'https://images.unsplash.com/photo-1618695386836-4f5809db074f',
    sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'wax-short', name: 'WAX//001 Cut-Off Short', price: 95, compareAt: 115,
    image: 'https://images.unsplash.com/photo-1637069585336-827b298fe84a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
    hover: 'https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
    sizes: [28, 30, 32, 34] },
  { id: 'wax-belt', name: 'Copper Rivet Belt', price: 68, compareAt: null,
    image: 'https://images.unsplash.com/photo-1631112230741-446762ee05ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
    hover: 'https://images.unsplash.com/photo-1640336437301-8368b53861ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
    sizes: ['OS'] },
  { id: 'wax-tee', name: 'Heavyweight Box Tee', price: 52, compareAt: null,
    image: 'https://images.unsplash.com/photo-1617354839314-9476d4ca8a3d',
    hover: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
    sizes: ['S', 'M', 'L', 'XL'] },
];

export const features = [
  { title: 'Japanese Selvedge', text: '14.5oz raw denim woven on vintage shuttle looms in Okayama, Japan.' },
  { title: 'Hand-Waxed Finish', text: 'A hand-applied wax coating that cracks and fades into a unique patina.' },
  { title: 'Copper Hardware', text: 'Solid copper rivets and a custom engraved shank button built to outlast.' },
  { title: 'Triple-Stitched', text: 'Chain-stitched seams and bar-tacked stress points for a lifetime of wear.' },
];

export const galleryImages = [
  'https://images.unsplash.com/photo-1618695387047-92fcda1b6231',
  'https://images.unsplash.com/photo-1617354839314-9476d4ca8a3d',
  'https://images.unsplash.com/photo-1773614784740-8036a30a0d32',
  'https://images.unsplash.com/photo-1618695386836-4f5809db074f',
];

export const detailImages = [
  'https://images.unsplash.com/photo-1631112230741-446762ee05ac?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1640336437301-8368b53861ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1671624759834-bcf0d3dd2517?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

export const community = [
  { user: 'b1glouis', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246' },
  { user: 'mrdayann_', img: 'https://images.unsplash.com/photo-1617354839314-9476d4ca8a3d' },
  { user: 'lucas__ns_', img: 'https://images.unsplash.com/photo-1773614784740-8036a30a0d32' },
  { user: 'giray_exe', img: 'https://images.unsplash.com/photo-1618695387047-92fcda1b6231' },
  { user: '7hayb7', img: 'https://images.unsplash.com/photo-1618695386836-4f5809db074f' },
  { user: 'lorelyyn', img: 'https://images.unsplash.com/photo-1637069585336-827b298fe84a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900' },
];

export const navLinks = [
  { label: 'THE JEAN', href: '#product' },
  { label: 'THE DROP', href: '#drop' },
  { label: 'DETAILS', href: '#features' },
  { label: 'STYLE IT', href: '#grid' },
  { label: 'COMMUNITY', href: '#community' },
];
