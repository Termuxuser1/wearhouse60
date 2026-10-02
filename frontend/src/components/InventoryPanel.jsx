import React, { useState, useEffect } from 'react';
import { Check, Save } from 'lucide-react';

const StockRow = ({ row, onSave, saved }) => {
  const [qty, setQty] = useState(String(row.qty));
  const [saving, setSaving] = useState(false);
  useEffect(() => setQty(String(row.qty)), [row.qty]);
  const valid = qty !== '' && Number.isInteger(Number(qty)) && Number(qty) >= 0;
  const save = async (event) => { event.preventDefault(); if (!valid) return; setSaving(true); await onSave(row, qty); setSaving(false); };
  return <form onSubmit={save} className="py-5 border-b flex flex-wrap items-center justify-between gap-4" data-testid={`inventory-row-${row.size}`}><div><p className="font-cond text-lg">TAILLE {row.size}</p><p className="text-xs text-black/50">{row.name} · Noir ciré / Camo</p></div><div className="flex items-center gap-3"><input data-testid={`inventory-input-${row.size}`} aria-label={`Stock taille ${row.size}`} type="number" min="0" step="1" required value={qty} onChange={event => setQty(event.target.value)} className="w-20 h-10 border px-3" /><button type="submit" aria-label={`Enregistrer le stock taille ${row.size}`} data-testid={`inventory-save-${row.size}`} disabled={!valid || saving || Number(qty) === row.qty} className="icon-button bg-[#2b3a26] text-white">{saved ? <Check size={16} /> : <Save size={16} />}</button>{saved && <span className="text-xs text-[#2b3a26]" data-testid={`inventory-saved-${row.size}`}>Enregistré</span>}</div></form>;
};

export const InventoryPanel = ({ rows, onSave, savedKey }) => <section><div className="border-b pb-5 mb-1 flex justify-between items-center"><h2 className="font-cond uppercase">Stock disponible</h2><p data-testid="admin-total-stock" className="font-display text-3xl">{rows.reduce((total, row) => total + row.qty, 0)} <span className="font-cond text-xs">PIÈCES</span></p></div>{rows.map(row => <StockRow key={row.size} row={row} onSave={onSave} saved={savedKey === `${row.product_id}:${row.variant_id}:${row.size}`} />)}</section>;