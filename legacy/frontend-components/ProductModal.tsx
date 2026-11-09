'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { 
  X, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Gamepad2,
  Share2
} from 'lucide-react';

export default function ProductModal() {
  const { quickViewProduct, closeQuickView, addToCart, formatPrice, showToast, openCatalogModal } = useShop();

  if (!quickViewProduct) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#' + quickViewProduct.slug);
      showToast('Lien du produit copié !', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-pink-500/30 p-6 sm:p-8 shadow-2xl shadow-pink-500/20 z-10 my-8 overflow-hidden animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Product Poster */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-900">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-md bg-pink-600 text-white text-[11px] font-extrabold uppercase shadow-md">
                  {quickViewProduct.badge}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 px-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> {quickViewProduct.guarantee}
              </span>
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-white transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Partager
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.08] text-zinc-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                  {quickViewProduct.platformIcon && (
                    <img src={quickViewProduct.platformIcon} alt="" className="w-3.5 h-3.5 object-contain" />
                  )}
                  {quickViewProduct.platform}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-zinc-500 font-normal">({quickViewProduct.reviewsCount} avis)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-headline">
                {quickViewProduct.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">{quickViewProduct.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Features */}
            <div className="space-y-2 py-2 border-y border-white/10">
              <p className="text-xs font-bold text-pink-300 uppercase tracking-wider">Inclus dans votre commande :</p>
              <div className="space-y-1.5">
                {quickViewProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* If 1000 games pack, link to catalog browser */}
            {quickViewProduct.slug === 'pack-steam-1000-jeux' && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-purple-200 font-medium">
                  <Gamepad2 className="w-4 h-4 text-pink-400" />
                  <span>Consulter la liste détaillée des 1,170 jeux</span>
                </div>
                <button
                  onClick={() => { closeQuickView(); openCatalogModal(); }}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
                >
                  Ouvrir
                </button>
              </div>
            )}

            {/* Price & CTA */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Prix</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white font-headline">
                    {formatPrice(quickViewProduct.priceDZD, quickViewProduct.priceEUR, quickViewProduct.priceUSD)}
                  </span>
                  {quickViewProduct.oldPriceDZD > quickViewProduct.priceDZD && (
                    <span className="text-xs text-zinc-500 line-through">
                      {formatPrice(quickViewProduct.oldPriceDZD, quickViewProduct.oldPriceEUR, quickViewProduct.oldPriceUSD)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    closeQuickView();
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-pink-600/30 transition cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au Panier
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400 justify-center sm:justify-start">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Livraison instantanée par WhatsApp ou Email après validation</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
