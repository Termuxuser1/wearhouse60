import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const PaymentCancel = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-5">
    <div className="bg-white max-w-md w-full p-10 text-center">
      <ShoppingBag className="w-14 h-14 mx-auto text-black/40" strokeWidth={1.4} />
      <h1 className="font-display text-4xl uppercase mt-6">Checkout cancelled</h1>
      <p className="text-black/60 mt-2 text-sm">
        No worries — your cart is saved. Pick up right where you left off.
      </p>
      <Link
        to="/"
        className="group inline-flex items-center gap-2 mt-8 bg-black text-white px-8 h-12 font-cond uppercase tracking-[0.18em] text-sm hover:bg-[#e4001b] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to store
      </Link>
    </div>
  </div>
);

export default PaymentCancel;
