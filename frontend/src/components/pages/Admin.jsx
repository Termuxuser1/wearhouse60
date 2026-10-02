import React, { useState, useEffect, useCallback } from 'react';
import { adminLogin, adminOrders, adminInventory, updateInventory } from '../../api';
import { Loader2, Package, ClipboardList, LogOut, Check } from 'lucide-react';

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('wax001_admin') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedKey, setSavedKey] = useState('');

  const load = useCallback(async (tk) => {
    setLoading(true);
    try {
      const [o, inv] = await Promise.all([adminOrders(tk), adminInventory(tk)]);
      setOrders(o.orders || []);
      setInventory(inv.inventory || []);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem('wax001_admin');
        setToken('');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { token: tk } = await adminLogin(password);
      localStorage.setItem('wax001_admin', tk);
      setToken(tk);
    } catch (err) {
      setError('Invalid password');
    }
  };

  const logout = () => {
    localStorage.removeItem('wax001_admin');
    setToken('');
  };

  const changeQty = async (row, qty) => {
    const q = Math.max(0, parseInt(qty || '0', 10));
    setInventory((prev) =>
      prev.map((r) =>
        r.product_id === row.product_id && r.variant_id === row.variant_id && r.size === row.size
          ? { ...r, qty: q }
          : r
      )
    );
    try {
      await updateInventory(token, {
        product_id: row.product_id,
        variant_id: row.variant_id,
        size: row.size,
        qty: q,
      });
      const k = `${row.product_id}:${row.variant_id}:${row.size}`;
      setSavedKey(k);
      setTimeout(() => setSavedKey(''), 1200);
    } catch (e) {}
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-5">
        <form onSubmit={handleLogin} className="bg-white w-full max-w-sm p-10">
          <h1 className="font-display text-3xl uppercase text-center">WAX//001 Admin</h1>
          <p className="text-black/50 text-sm text-center mt-1">Store dashboard</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border border-black/20 h-12 px-4 mt-6 outline-none focus:border-black font-cond tracking-wide"
          />
          {error && <p className="text-[#e4001b] text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white h-12 mt-4 font-cond uppercase tracking-[0.2em] text-sm hover:bg-[#e4001b] transition-colors"
          >
            Log in
          </button>
          <p className="text-[11px] text-black/40 text-center mt-4">Demo password: wax001admin</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <header className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="font-display text-2xl">WAX//001 · ADMIN</span>
          <button onClick={logout} className="flex items-center gap-2 font-cond uppercase tracking-wide text-sm hover:text-[#ff5a6e]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'orders', label: 'Orders', icon: ClipboardList },
            { id: 'inventory', label: 'Inventory', icon: Package },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 h-11 font-cond uppercase tracking-wide text-sm transition-colors ${
                tab === t.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-black/50 py-10">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
          </div>
        )}

        {!loading && tab === 'orders' && (
          <div className="bg-white">
            {orders.length === 0 ? (
              <p className="p-8 text-black/50 text-center">No orders yet.</p>
            ) : (
              <div className="divide-y">
                {orders.map((o) => (
                  <div key={o.order_id} className="p-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-cond uppercase tracking-wide text-sm">#{o.order_id.slice(0, 8)}</span>
                        <span
                          className={`ml-3 text-[11px] font-semibold px-2 py-0.5 uppercase ${
                            o.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : o.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-black/10 text-black/50'
                          }`}
                        >
                          {o.payment_status}
                        </span>
                      </div>
                      <span className="font-display text-lg">€{o.amount / 100}</span>
                    </div>
                    <p className="text-xs text-black/50 mt-1">
                      {new Date(o.created_at).toLocaleString()} {o.email ? `· ${o.email}` : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {o.items.map((it, i) => (
                        <span key={i} className="text-xs bg-[#f4f4f4] px-2 py-1 font-cond uppercase tracking-wide">
                          {it.name} · {it.size} ×{it.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && tab === 'inventory' && (
          <div className="bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left font-cond uppercase tracking-wide text-xs text-black/50">
                  <th className="p-4">Product</th>
                  <th className="p-4">Variant</th>
                  <th className="p-4">Size</th>
                  <th className="p-4 w-40">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventory.map((r) => {
                  const k = `${r.product_id}:${r.variant_id}:${r.size}`;
                  return (
                    <tr key={k} className={r.qty === 0 ? 'bg-red-50/40' : ''}>
                      <td className="p-4 font-cond uppercase tracking-wide">{r.name}</td>
                      <td className="p-4 text-black/60">{r.variant_id || '—'}</td>
                      <td className="p-4">{r.size}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={r.qty}
                            onChange={(e) => changeQty(r, e.target.value)}
                            className="w-20 border border-black/20 h-9 px-2 outline-none focus:border-black"
                          />
                          {savedKey === k && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
