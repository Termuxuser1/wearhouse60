import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const PaymentCancel = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-5">
    <div className="bg-white max-w-md w-full p-10 text-center">
      <ShoppingBag className="w-14 h-14 mx-auto text-black/40" strokeWidth={1.4} />
      <p className="font-cond text-xs">WEARHOUSE 60</p>
      <h1 data-testid="payment-cancel-title" className="font-display text-4xl uppercase mt-6">Paiement annulé</h1>
      <p data-testid="payment-cancel-message" className="text-black/60 mt-2 text-sm">
        Ton panier est conservé. Tu peux reprendre ta commande quand tu veux.
      </p>
      <Link
        to="/"
        data-testid="payment-cancel-back"
        className="group inline-flex items-center gap-2 mt-8 bg-black text-white px-6 h-12 font-cond uppercase text-sm hover:bg-[#2b3a26] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Retour à la boutique
      </Link>
    </div>
  </div>
);

export default PaymentCancel;
