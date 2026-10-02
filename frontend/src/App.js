import { useEffect } from 'react';
import './App.css';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import DropSection from './components/DropSection';
import ProductSection from './components/ProductSection';
import Features from './components/Features';
import ProductGrid from './components/ProductGrid';
import Community from './components/Community';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';

function App() {
  useEffect(() => {
    document.title = 'WAX//001 — Hand-Waxed Selvedge Jean';
  }, []);

  return (
    <div className="App">
      <CartProvider>
        <Header />
        <main>
          <Hero />
          <DropSection />
          <ProductSection />
          <Features />
          <ProductGrid />
          <Community />
        </main>
        <Footer />
        <Toaster />
      </CartProvider>
    </div>
  );
}

export default App;
