import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import DropSection from './components/DropSection';
import ProductSection from './components/ProductSection';
import Features from './components/Features';
import Community from './components/Community';
import Footer from './components/Footer';
import PaymentSuccess from './components/pages/PaymentSuccess';
import PaymentCancel from './components/pages/PaymentCancel';
import Admin from './components/pages/Admin';
import { Toaster } from 'sonner';

const Landing = () => (
  <>
    <Header />
    <main>
      <Hero />
      <DropSection />
      <ProductSection />
      <Features />
      <Community />
    </main>
    <Footer />
  </>
);

function App() {
  useEffect(() => {
    document.title = 'WEARHOUSE 60 — WEAR IT OR DIE FOR IT';
  }, []);

  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </CartProvider>
    </div>
  );
}

export default App;
