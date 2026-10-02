import React, { useState, useEffect, useCallback } from 'react';
import { adminLogin, adminOrders, adminInventory, updateInventory } from '../../api';
import { Loader2, Package, ClipboardList, LogOut } from 'lucide-react';
import { InventoryPanel } from '../InventoryPanel';
import { money } from '../../brand';

const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('wearhouse60_admin') || '');
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
      setError('Impossible de charger les données de la boutique.');
      if (e?.response?.status === 401) {
        localStorage.removeItem('wearhouse60_admin');
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
      localStorage.setItem('wearhouse60_admin', tk);
      setToken(tk);
    } catch (err) {
      setError('Connexion impossible. Vérifie ton mot de passe.');
    }
  };

  const logout = () => {
    localStorage.removeItem('wearhouse60_admin');
    setToken('');
  };

  const changeQty = async (row, qty) => {
    const q = Math.max(0, parseInt(qty || '0', 10));
    setError('');
    try {
      await updateInventory(token, {
        product_id: row.product_id,
        variant_id: row.variant_id,
        size: row.size,
        qty: q,
      });
      setInventory((prev) => prev.map((r) => r.product_id === row.product_id && r.variant_id === row.variant_id && r.size === row.size ? { ...r, qty: q } : r));
      const k = `${row.product_id}:${row.variant_id}:${row.size}`;
      setSavedKey(k);
      setTimeout(() => setSavedKey(''), 1200);
      return true;
    } catch (e) { setError('Le stock n’a pas été enregistré. Réessaie.'); return false; }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-5">
        <form onSubmit={handleLogin} className="bg-white w-full max-w-sm p-10">
          <h1 className="font-display text-3xl uppercase text-center" data-testid="admin-title">WEARHOUSE 60</h1>
          <p className="text-black/50 text-sm text-center mt-1">Administration de la boutique</p>
          <input
            type="password"
            data-testid="admin-password"
            autoComplete="current-password"
            aria-label="Mot de passe administrateur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full border border-black/20 h-12 px-4 mt-6 outline-none focus:border-black font-cond tracking-wide"
          />
          {error && <p role="alert" data-testid="admin-login-error" className="text-red-800 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            data-testid="admin-login"
            className="w-full bg-black text-white h-12 mt-4 font-cond uppercase text-sm hover:bg-[#2b3a26] transition-colors"
          >
            Connexion
          </button>
          <a href="/" data-testid="admin-login-back" className="block text-xs text-center mt-5 underline">Retour à la boutique</a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <header className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" data-testid="admin-home" className="font-display text-lg sm:text-2xl">WEARHOUSE 60</a>
          <button data-testid="admin-logout" onClick={logout} className="flex items-center gap-2 font-cond uppercase text-xs hover:text-[#a9b69b]">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {error && <p role="alert" data-testid="admin-save-error" className="error-message mb-5">{error}</p>}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'orders', label: 'Commandes', icon: ClipboardList },
            { id: 'inventory', label: 'Stock', icon: Package },
          ].map((t) => (
            <button
              key={t.id}
              data-testid={`admin-tab-${t.id}`}
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
            <Loader2 className="w-5 h-5 animate-spin" /> Chargement…
          </div>
        )}

        {!loading && tab === 'orders' && (
          <div className="bg-white">
            {orders.length === 0 ? (
              <p data-testid="admin-orders-empty" className="p-8 text-black/50 text-center">Aucune commande pour le moment.</p>
            ) : (
              <div className="divide-y">
                {orders.map((o) => (
                  <div key={o.order_id} className="p-5" data-testid={`admin-order-${o.order_id}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-cond uppercase tracking-wide text-sm">#{o.order_id.slice(0, 8)}</span>
                        <span
                          data-testid={`admin-order-status-${o.order_id}`}
                          className={`ml-3 text-[11px] font-semibold px-2 py-0.5 uppercase ${
                            o.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : o.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-black/10 text-black/50'
                          }`}
                        >
                          {({ paid: 'Payée', pending: 'En attente', failed: 'Échouée', expired: 'Expirée' })[o.payment_status] || o.payment_status}
                        </span>
                      </div>
                      <span data-testid={`admin-order-total-${o.order_id}`} className="font-display text-lg">{money(o.amount / 100)}</span>
                    </div>
                    <p className="text-xs text-black/50 mt-1 break-all">
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

        {!loading && tab === 'inventory' && <InventoryPanel rows={inventory} onSave={changeQty} savedKey={savedKey} />}
      </div>
    </div>
  );
};

export default Admin;
