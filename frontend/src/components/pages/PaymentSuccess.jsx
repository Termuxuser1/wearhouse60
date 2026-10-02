import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaymentStatus, getOrder } from '../../api';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, Loader2, XCircle, ArrowRight } from 'lucide-react';

const MAX_POLLS = 12;

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();
  const [state, setState] = useState('checking'); // checking | paid | timeout | error
  const [order, setOrder] = useState(null);
  const polls = useRef(0);
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setState('error');
      return;
    }
    let timer;
    const poll = async () => {
      try {
        const data = await getPaymentStatus(sessionId);
        if (data.payment_status === 'paid') {
          setState('paid');
          if (!cleared.current) {
            clearCart();
            cleared.current = true;
          }
          if (data.order_id) {
            try {
              setOrder(await getOrder(data.order_id));
            } catch (e) {}
          }
          return;
        }
        if (['failed', 'expired'].includes(data.payment_status)) {
          setState('error');
          return;
        }
        polls.current += 1;
        if (polls.current >= MAX_POLLS) {
          setState('timeout');
          return;
        }
        timer = setTimeout(poll, 2000);
      } catch (e) {
        polls.current += 1;
        if (polls.current >= MAX_POLLS) {
          setState('error');
          return;
        }
        timer = setTimeout(poll, 2000);
      }
    };
    poll();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-5">
      <div className="bg-white max-w-md w-full p-10 text-center">
        {state === 'checking' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-black animate-spin" strokeWidth={1.5} />
            <h1 className="font-display text-3xl uppercase mt-6">Confirming payment</h1>
            <p className="text-black/60 mt-2 text-sm">Hang tight, verifying your order…</p>
          </>
        )}
        {state === 'paid' && (
          <>
            <CheckCircle2 className="w-14 h-14 mx-auto text-[#e4001b]" strokeWidth={1.4} />
            <h1 className="font-display text-4xl uppercase mt-6">Order confirmed</h1>
            <p className="text-black/60 mt-2 text-sm">
              Thanks for the order. A confirmation is on its way.
            </p>
            {order && (
              <div className="mt-6 border-t pt-5 text-left space-y-3">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-[#ededed] overflow-hidden flex-shrink-0">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cond uppercase text-xs tracking-wide leading-tight">{it.name}</p>
                      <p className="text-xs text-black/50">Size {it.size} · x{it.quantity}</p>
                    </div>
                    <span className="font-cond text-sm">€{(it.unit_amount * it.quantity) / 100}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-3 font-cond uppercase tracking-wide text-sm">
                  <span>Total</span>
                  <span className="font-display text-lg">€{order.amount / 100}</span>
                </div>
              </div>
            )}
          </>
        )}
        {(state === 'timeout' || state === 'error') && (
          <>
            <XCircle className="w-14 h-14 mx-auto text-black/40" strokeWidth={1.4} />
            <h1 className="font-display text-3xl uppercase mt-6">
              {state === 'timeout' ? 'Still processing' : 'Something went wrong'}
            </h1>
            <p className="text-black/60 mt-2 text-sm">
              {state === 'timeout'
                ? 'Your payment is taking a little longer than expected. Check your email for confirmation.'
                : 'We could not confirm this payment. If you were charged, contact support.'}
            </p>
          </>
        )}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 mt-8 bg-black text-white px-8 h-12 font-cond uppercase tracking-[0.18em] text-sm hover:bg-[#e4001b] transition-colors"
        >
          Back to store
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
