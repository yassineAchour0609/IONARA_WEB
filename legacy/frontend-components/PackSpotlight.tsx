'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ShoppingCart, 
  ListFilter, 
  ShieldCheck, 
  Download,
  Infinity
} from 'lucide-react';

export default function PackSpotlight() {
  const { addToCart, formatPrice, openCatalogModal, openQuickView } = useShop();

  const packProduct = PRODUCTS.find((p) => p.slug === 'pack-steam-1000-jeux') || PRODUCTS[0];

  const features = [
    'Plus de 1,170 jeux Steam complets inclus',
    'Black Myth: Wukong, Cyberpunk 2077, Elden Ring, God of War, GTA V...',
    'Accès à vie garanti & Mises à jour gratuites',
    'Mode Solo Hors-Ligne 100% sans coupure',
    'Installation facile en 3 minutes (Guide pas-à-pas fourni)',
    'Sauvegardes locales sur votre propre PC',
  ];

  return (
    <section id="spotlight" className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl -z-10" />

      <div className="relative rounded-3xl border border-pink-500/30 bg-gradient-to-b from-slate-900/90 to-black/95 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl shadow-pink-500/10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-pink-500/40">
              <Flame className="w-4 h-4 fill-white" />
              Offre Phare Exclusive
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              ★ 4.9/5 (342 avis)
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            Stock disponible • Livraison en 5 min
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-pink-400 mb-2">
                Bibliothèque Complète Steam PC
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-headline tracking-tight leading-tight">
                Pack Steam Ultime <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">1,170+ Jeux</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                Ne payez plus chaque jeu à 70 €. Obtenez un accès direct et permanent à notre bibliothèque massive contenant tous les hits majeurs, les classiques et les nouvelles sorties avec mises à jour continues.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs text-zinc-400 block mb-1">Prix Tout Inclus (Accès à Vie)</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white font-headline">
                    {formatPrice(packProduct.priceDZD, packProduct.priceEUR, packProduct.priceUSD)}
                  </span>
                  <span className="text-sm sm:text-base text-zinc-500 line-through">
                    {formatPrice(packProduct.oldPriceDZD, packProduct.oldPriceEUR, packProduct.oldPriceUSD)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    -62% OFF
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => addToCart(packProduct)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Commander le Pack
                </button>
                <button
                  onClick={openCatalogModal}
                  className="px-5 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-pink-500/40 text-zinc-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ListFilter className="w-4 h-4 text-purple-400" />
                  Voir les 1,170 jeux
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border border-pink-500/40 shadow-2xl shadow-pink-500/20 group">
              <img
                src={packProduct.image}
                alt="Pack Steam 1000+ Jeux"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Prêt pour téléchargement</p>
                  <p className="text-[10px] text-zinc-400">Bibliothèque active 2026</p>
                </div>
                <button
                  onClick={() => openQuickView(packProduct)}
                  className="text-xs text-pink-400 font-bold hover:underline"
                >
                  Détails &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
