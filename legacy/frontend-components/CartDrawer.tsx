'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export default function CartDrawer({ onOpenCheckout }: CartDrawerProps) {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    promoCode,
    promoDiscount,
    applyPromo,
    formatPrice,
    currency
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    onOpenCheckout();
  };

  const formatItemPrice = (dzd: number, eur: number, usd: number) => {
    if (currency === 'EUR') return `${eur} €`;
    if (currency === 'USD') return `$${usd}`;
    return `${dzd.toLocaleString('fr-FR')} DA`;
  };

  const formatCalcPrice = (val: number) => {
    if (currency === 'EUR') return `${val.toFixed(2)} €`;
    if (currency === 'USD') return `$${val.toFixed(2)}`;
    return `${Math.round(val).toLocaleString('fr-FR')} DA`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-white">Mon Panier</h3>
                <p className="text-xs text-zinc-400">{cart.length} article(s)</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Votre panier est vide</h4>
                <p className="text-xs text-zinc-400 mb-6">
                  Découvrez nos offres exclusives de comptes de jeux et ajoutez vos favoris !
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-lg shadow-pink-600/30"
                >
                  Voir les offres
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.slug}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-3 items-center group hover:border-pink-500/30 transition"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                        <button
                          onClick={() => removeFromCart(item.slug)}
                          className="text-zinc-500 hover:text-rose-400 transition p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] text-pink-400 font-semibold">{item.platform}</p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-white">
                          {formatItemPrice(item.priceDZD, item.priceEUR, item.priceUSD)}
                        </span>

                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.slug, -1)}
                            className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.slug, 1)}
                            className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-white/[0.02] space-y-4">
              
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Code promo (ex: IONARA10)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  Appliquer
                </button>
              </form>

              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> Code {promoCode} actif
                  </span>
                  <span className="font-bold">-{promoDiscount}%</span>
                </div>
              )}

              {/* Subtotal & Totals */}
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatCalcPrice(cartSubtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Réduction promo</span>
                    <span>-{formatCalcPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="text-emerald-400 font-bold">GRATUIT (Instantané)</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-base font-black text-white font-headline">
                  <span>Total à payer</span>
                  <span className="text-pink-400">{formatCalcPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-600/30 transition cursor-pointer"
              >
                <span>Passer la Commande</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paiement sécurisé BaridiMob • CCP • CB • WhatsApp</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
